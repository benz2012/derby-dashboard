const express = require('express')

const { query, batchGet, get } = require('../../database')
const config = require('../../database/config')
const params = require('../../database/params')
const { errorEnd } = require('./utility')

const router = express.Router()

router.get('/', (req, res) => {
  let challenges
  query(params.challengesQuery(config.SCHOOL_ID_HARD)).then((response) => {
    challenges = response
    if (challenges.some(c => c.EventId >= 0)) {
      const eventKeys = challenges.filter(c => c.EventId >= 0)
        .map(c => ({ SchoolId: c.SchoolId, EventId: c.EventId }))
      return batchGet({ RequestItems: { Derby_Events: { Keys: eventKeys } } })
    }
    return {}
  }).then((response) => {
    const events = response.Derby_Events
    const challengesHydrated = challenges.map((c) => {
      let name = c.Name
      if (events) {
        const event = events.find(e => e.EventId === c.EventId)
        if (event) {
          name = event.Name
        }
      }
      return ({
        id: c.ChallengeId,
        name,
        scores: c.Scores,
      })
    })
    res.json(challengesHydrated)
  }).catch(err => errorEnd(err, res))
})


router.get('/:id', (req, res) => {
  const challengeId = parseInt(req.params.id)
  let c
  get({
    TableName: 'Derby_Challenges',
    Key: { SchoolId: config.SCHOOL_ID_HARD, ChallengeId: challengeId },
  }).then((response) => {
    c = response
    if (c.EventId >= 0) {
      const eventKey = { SchoolId: c.SchoolId, EventId: c.EventId }
      return get({ TableName: 'Derby_Events', Key: eventKey })
    }
    return {}
  }).then((event) => {
    const challengeData = {
      id: c.ChallengeId,
      description: c.Description,
      name: c.Name,
      scores: c.Scores,
    }
    if (Object.keys(event).length !== 0) {
      challengeData.name = event.Name
      challengeData.linkedEvent = {
        id: c.EventId,
        location: event.Location,
        description: event.Description,
        time: { start: event.Time.Start, end: event.Time.End },
        date: event.DateString,
        type: event.Type,
        name: event.Name,
      }
    }
    res.json(challengeData)
  }).catch(err => errorEnd(err, res))
})


module.exports = router
