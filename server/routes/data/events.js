const express = require('express')

const { query, batchGet, get } = require('../../database')
const config = require('../../database/config')
const params = require('../../database/params')
const { errorEnd, groupBy } = require('./utility')

const router = express.Router()

// Shared Functions
const mapEvent = event => ({
  id: event.EventId,
  location: event.Location,
  description: event.Description,
  time: { start: event.Time.Start, end: event.Time.End },
  date: event.DateString,
  type: event.Type,
  name: event.Name,
})

// Routes
router.get('/', (req, res) => {
  let events
  query(params.eventsQuery(config.SCHOOL_ID_HARD)).then((response) => {
    events = response
    if (events.some(e => e.ChallengeId >= 0)) {
      const challengeKeys = events.filter(e => e.ChallengeId >= 0)
        .map(e => ({ SchoolId: e.SchoolId, ChallengeId: e.ChallengeId }))
      return batchGet({
        RequestItems: { Derby_Challenges: {
          Keys: challengeKeys,
          AttributesToGet: ['ChallengeId', 'Description'],
        } },
      })
    }
    return {}
  }).then((response) => {
    const challenges = response.Derby_Challenges
    const eventsHydrated = events.map((e) => {
      const event = mapEvent(e)
      const linkedChallenge = challenges.find(c => c.ChallengeId === e.ChallengeId)
      if (linkedChallenge && linkedChallenge.Description) {
        return Object.assign(event, { challenge: linkedChallenge.Description })
      }
      return event
    })
    const eventsGrouped = groupBy(eventsHydrated, 'date')
    res.json(eventsGrouped)
  }).catch(err => errorEnd(err, res))
})

router.get('/:id', (req, res) => {
  const eventId = parseInt(req.params.id)
  let event
  const eventKey = { SchoolId: config.SCHOOL_ID_HARD, EventId: eventId }
  get({ TableName: 'Derby_Events', Key: eventKey }).then((response) => {
    event = response
    if (event.ChallengeId >= 0) {
      const cKey = { SchoolId: event.SchoolId, ChallengeId: event.ChallengeId }
      return get({ TableName: 'Derby_Challenges', Key: cKey })
    }
    return {}
  }).then((c) => {
    const eventData = mapEvent(event)
    eventData.challenge = c.Description
    res.json(eventData)
  }).catch(err => errorEnd(err, res))
})

module.exports = router
