const express = require('express')
const moment = require('moment')

const config = require('./config')
const dbRead = require('./dbRead')
const placeholder = require('./placeholder')

// Router Handler
const router = express.Router()
// Non-secure Request Validation
router.use((req, res, next) => {
  if (!req.header('sent-from-client-javascript')) {
    return next('router')
  }
  return next()
})


// Utility Functions
const errorEnd = (err, res) => {
  console.log(err)
  res.status(500).send()
}
const getSchool = () => (
  dbRead.get({
    TableName: 'Derby_Schools',
    Key: { SchoolId: config.SCHOOL_ID_HARD },
  })
)
const teamNames = () => (
  getSchool().then(s => (
    dbRead.batchGet({ RequestItems: { Derby_Teams: {
      Keys: s.Teams.map(t => ({ TeamId: t })),
      AttributesToGet: ['TeamId', 'Name', 'Organization'],
    } } })
      .then(res => res.Derby_Teams)
      .then(teams => [...teams, ...placeholder.teamNames])
  ))
)
const groupBy = (ungrouped, key) => (
  ungrouped.reduce((final, curr) => {
    // eslint-disable-next-line no-param-reassign
    (final[curr[key]] = final[curr[key]] || []).push(curr)
    return final
  }, {})
)


// Data Routes
router.get('/raised/school', (req, res) => {
  const timeSlot = Math.floor(moment().utc().hour() / 6) + 2
  const lastDateTimeString = moment().utc()
    .subtract(1, 'days').format(`YYYY-MM-DD-${timeSlot}`)
  getSchool().then((school) => {
    const fundQueries = []
    school.Teams.forEach((tid) => {
      fundQueries.push(
        dbRead.query({
          TableName: 'Derby_Funds',
          ExpressionAttributeNames: {
            '#T': 'TeamId',
            '#D': 'DateString',
          },
          ExpressionAttributeValues: {
            ':tid': tid,
            ':dts': lastDateTimeString,
          },
          KeyConditionExpression: '#T = :tid and #D >= :dts',
        }),
        dbRead.query({
          TableName: 'Derby_ExternalFunds',
          ExpressionAttributeNames: { '#T': 'TeamId' },
          ExpressionAttributeValues: { ':tid': tid },
          KeyConditionExpression: '#T = :tid',
        })
      )
    })
    return Promise.all(fundQueries)
  }).then((responses) => {
    const eachTeamRaised = {}
    responses.forEach((funds) => {
      if (!funds[0] || !funds[0].Raised) { return } // ignore external funds
      const mostRecent = funds.pop()
      eachTeamRaised[mostRecent.TeamId] = {}
      eachTeamRaised[mostRecent.TeamId].external = {}
      eachTeamRaised[mostRecent.TeamId].raised = mostRecent.Raised
    })
    responses.forEach((funds) => {
      if (!funds[0] || !funds[0].EntryId) { return } // focus on external funds
      funds.forEach((externalFund) => {
        eachTeamRaised[externalFund.TeamId].external[externalFund.EntryId] = externalFund.Amount
      })
    })
    res.send(JSON.stringify(eachTeamRaised))
  }).catch(err => errorEnd(err, res))
})


router.get('/raised/team/:id', (req, res) => {
  const teamId = parseInt(req.params.id)
  const timeSlot = Math.floor(moment().utc().hour() / 6) + 2
  const lastDateTimeString = moment().utc()
    .subtract(1, 'days').format(`YYYY-MM-DD-${timeSlot}`)
  const fundQueries = [
    dbRead.query({
      TableName: 'Derby_Funds',
      ExpressionAttributeNames: {
        '#T': 'TeamId',
        '#D': 'DateString',
      },
      ExpressionAttributeValues: {
        ':tid': teamId,
        ':dts': lastDateTimeString,
      },
      KeyConditionExpression: '#T = :tid and #D >= :dts',
    }),
    dbRead.query({
      TableName: 'Derby_ExternalFunds',
      ExpressionAttributeNames: { '#T': 'TeamId' },
      ExpressionAttributeValues: { ':tid': teamId },
      KeyConditionExpression: '#T = :tid',
    }),
  ]
  Promise.all(fundQueries).then((responses) => {
    let raised = 0
    responses.forEach((funds) => {
      if (!funds[0] || !funds[0].Raised) { return } // ignore external funds
      const mostRecent = funds.pop()
      raised += mostRecent.Raised
    })
    responses.forEach((funds) => {
      if (!funds[0] || !funds[0].EntryId) { return } // focus on external funds
      funds.forEach((externalFund) => {
        raised += externalFund.Amount
      })
    })
    res.send(JSON.stringify({ [teamId]: raised }))
  }).catch(err => errorEnd(err, res))
})


router.get('/home', (req, res) => {
  const homeData = {}
  getSchool().then((school) => {
    homeData.homeTeamId = school.HomeTeamId
    homeData.eventYear = school.EventYear
    homeData.header = school.HomePageData.Header
    homeData.body = school.HomePageData.Body
    homeData.learnMoreURL = school.HomePageData.LearnMoreURL
    homeData.videoURL = school.HomePageData.VideoURL
    homeData.abbrv = school.Abbreviation

    const teamKeys = school.Teams.map(t => ({ TeamId: t }))
    dbRead.batchGet({
      RequestItems: {
        Derby_Teams: {
          Keys: teamKeys,
        },
      },
    }).then((response) => {
      homeData.teams = []
      response.Derby_Teams.forEach((team) => {
        homeData.teams.push({
          name: team.Name,
          org: team.Organization,
          orgId: team.OrganizationId,
          avatar: team.AvatarURL,
        })
      })
    }).then(() => {
      res.send(JSON.stringify(homeData))
    }).catch(err => errorEnd(err, res))
  }).catch(err => errorEnd(err, res))
})


router.get('/events', (req, res) => {
  dbRead.query({
    TableName: 'Derby_Events',
    ExpressionAttributeNames: { '#S': 'SchoolId' },
    ExpressionAttributeValues: { ':sid': config.SCHOOL_ID_HARD },
    KeyConditionExpression: '#S = :sid',
  }).then((events) => {
    const challengeKeys = []
    events.forEach((event) => {
      if (!(event.ChallengeId >= 0)) { return }
      challengeKeys.push({
        SchoolId: event.SchoolId,
        ChallengeId: event.ChallengeId,
      })
    })
    dbRead.batchGet({
      RequestItems: {
        Derby_Challenges: {
          Keys: challengeKeys,
          AttributesToGet: ['ChallengeId', 'Description'],
        },
      },
    }).then((response) => {
      const challenges = response.Derby_Challenges
      const hydratedEvents = events.map((event) => {
        const returnObject = {
          id: event.EventId,
          location: event.Location,
          description: event.Description,
          time: {
            start: event.Time.Start,
            end: event.Time.End,
          },
          date: event.DateString,
          type: event.Type,
          name: event.Name,
        }
        if (event.ChallengeId >= 0) {
          const linkedChallenge = challenges.find(c => c.ChallengeId === event.ChallengeId)
          if (!linkedChallenge.Description) { return returnObject }
          return Object.assign(returnObject, { challenge: linkedChallenge.Description })
        }
        return returnObject
      })
      const grouppedEvents = groupBy(hydratedEvents, 'date')
      res.send(JSON.stringify(grouppedEvents))
    }).catch(err => errorEnd(err, res))
  }).catch(err => errorEnd(err, res))
})


router.get('/teams', (req, res) => {
  getSchool().then((school) => {
    const teamKeys = school.Teams.map(t => ({ TeamId: t }))
    dbRead.batchGet({
      RequestItems: {
        Derby_Teams: {
          Keys: teamKeys,
        },
      },
    }).then((response) => {
      const teams = response.Derby_Teams.map((team) => {
        const t = {
          id: team.TeamId,
          name: team.Name,
          org: team.Organization,
          orgId: team.OrganizationId,
          avatar: team.AvatarURL,
        }
        if (team.TeamId === school.HomeTeamId) {
          t.homeTeam = true
        }
        return t
      })
      res.send(JSON.stringify(teams))
    }).catch(err => errorEnd(err, res))
  }).catch(err => errorEnd(err, res))
})


router.get('/teams/:id', (req, res) => {
  const teamId = req.params.id
  dbRead.get({
    TableName: 'Derby_Teams',
    Key: { TeamId: parseInt(teamId) },
  }).then((team) => {
    // query all challenges that match school and teamId
    dbRead.query({
      TableName: 'Derby_Challenges',
      ExpressionAttributeNames: { '#S': 'SchoolId' },
      ExpressionAttributeValues: { ':sid': config.SCHOOL_ID_HARD },
      KeyConditionExpression: '#S = :sid',
      FilterExpression: 'attribute_exists(Scores)',
    }).then(challenges => (
      challenges.filter(c => c.Scores.find(s => s.teamId === team.TeamId))
    )).then((challenges) => {
      // eslint-disable-next-line no-unused-vars
      const eventNamesNeeded = new Promise((resolve, reject) => {
        if (challenges.some(c => c.EventId >= 0)) {
          const eventKeys = challenges.filter(c => c.EventId >= 0)
            .map(c => ({ SchoolId: c.SchoolId, EventId: c.EventId }))
          return resolve(dbRead.batchGet({
            RequestItems: { Derby_Events: { Keys: eventKeys } },
          }))
        }
        return resolve([])
      })
      eventNamesNeeded.then((responses) => {
        const events = responses.Derby_Events
        const hydratedChallenges = challenges.map(c => ({
          scores: c.Scores.map(s => ({ score: s.score, teamId: s.teamId })),
          name: c.Name ? c.Name : events.find(e => e.EventId === c.EventId).Name,
        }))
        const teamData = {
          id: team.TeamId,
          org: team.Organization,
          orgId: team.OrganizationId,
          avatar: team.AvatarURL,
          cover: team.CoverURL,
          name: team.Name,
          url: team.URL,
          members: team.Members,
          challenges: hydratedChallenges,
        }
        res.send(JSON.stringify(teamData))
      }).catch(err => errorEnd(err, res))
    }).catch(err => errorEnd(err, res))
  }).catch(err => errorEnd(err, res))
})


router.get('/challenges', (req, res) => {
  dbRead.query({
    TableName: 'Derby_Challenges',
    ExpressionAttributeNames: { '#S': 'SchoolId' },
    ExpressionAttributeValues: { ':sid': config.SCHOOL_ID_HARD },
    KeyConditionExpression: '#S = :sid',
  }).then((challenges) => {
    if (challenges.some(c => c.EventId >= 0)) {
      const eventKeys = challenges.filter(c => c.EventId >= 0)
        .map(c => ({ SchoolId: c.SchoolId, EventId: c.EventId }))
      return Promise.all([
        challenges,
        dbRead.batchGet({ RequestItems: { Derby_Events: { Keys: eventKeys } } }),
        teamNames(),
      ])
    }
    return Promise.all([challenges, [], teamNames()])
  }).then(([challenges, eventsRes, names]) => {
    const events = eventsRes.Derby_Events
    const hydratedChallenges = []
    challenges.forEach((c) => {
      const name = c.Name ? c.Name : events.find(e => e.EventId === c.EventId).Name
      const id = c.ChallengeId
      let scores = []
      if (c.Scores) {
        scores = c.Scores.map((s) => {
          const t = names.find(n => n.TeamId === s.teamId)
          if (!t) { return s }
          const teamName = t.Organization ? t.Organization : t.Name
          if (!teamName) { return s }
          return ({ score: s.score, team: teamName })
        })
      }
      hydratedChallenges.push({ name, id, scores })
    })
    res.send(JSON.stringify(hydratedChallenges))
  }).catch(err => errorEnd(err, res))
})


router.get('/challenges/:id', (req, res) => {
  const challengeId = parseInt(req.params.id)
  dbRead.get({
    TableName: 'Derby_Challenges',
    Key: { SchoolId: config.SCHOOL_ID_HARD, ChallengeId: challengeId },
  }).then((c) => {
    if (c.EventId >= 0) {
      const eventKey = { SchoolId: c.SchoolId, EventId: c.EventId }
      return Promise.all([
        c,
        dbRead.get({ TableName: 'Derby_Events', Key: eventKey }),
        teamNames(),
      ])
    }
    return Promise.all([c, {}, teamNames()])
  }).then(([c, event, names]) => {
    const challengeObj = {
      id: c.ChallengeId,
      description: c.Description,
      name: c.Name,
    }
    if (Object.keys(event).length !== 0) {
      challengeObj.name = event.Name
      challengeObj.linkedEvent = {
        id: c.EventId,
        location: event.Location,
        description: event.Description,
        time: { start: event.Time.Start, end: event.Time.End },
        date: event.DateString,
        type: event.Type,
        name: event.Name,
      }
    }
    let scores = []
    if (c.Scores) {
      scores = c.Scores.map((s) => {
        const t = names.find(n => n.TeamId === s.teamId)
        if (!t) { return s }
        const teamName = t.Organization ? t.Organization : t.Name
        if (!teamName) { return s }
        return ({ score: s.score, team: teamName })
      })
    }
    challengeObj.scores = scores
    res.send(JSON.stringify(challengeObj))
  }).catch(err => errorEnd(err, res))
})


module.exports = router
