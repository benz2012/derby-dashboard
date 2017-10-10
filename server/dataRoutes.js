const express = require('express')
const moment = require('moment')

const config = require('./config')
const dbRead = require('./dbRead')


// Router Handler
const router = express.Router()


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


// Data Routes
router.get('/data/raised/school', (req, res) => {
  const timeSlot = Math.floor(moment().utc().hour() / 6) + 2
  const lastDateTimeString = moment().utc()
    .subtract(1, 'days').format(`YYYY-MM-DD-${timeSlot}`)
  getSchool().then((school) => {
    const fundQueries = school.Teams.reduce((prev, tid) => (
      prev.push(
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
          ExpressionAttributeNames: {
            '#T': 'TeamId',
          },
          ExpressionAttributeValues: {
            ':tid': tid,
          },
          KeyConditionExpression: '#T = :tid',
        })
      ) && prev
    ), [])
    Promise.all(fundQueries).then((responses) => {
      const eachTeamRaised = {}
      responses.forEach((funds) => {
        if (!funds[0] || !funds[0].Raised) { return } // ignore external funds
        const mostRecent = funds.pop()
        eachTeamRaised[mostRecent.TeamId] = mostRecent.Raised
      })
      responses.forEach((funds) => {
        if (!funds[0] || !funds[0].EntryId) { return } // focus on external funds
        funds.forEach((externalFund) => {
          eachTeamRaised[externalFund.TeamId] += externalFund.Amount
        })
      })
      res.send(JSON.stringify(eachTeamRaised))
    }).catch(err => errorEnd(err, res))
  }).catch(err => errorEnd(err, res))
})

router.get('/data/home', (req, res) => {
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

module.exports = router
