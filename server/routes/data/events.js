const express = require('express')

const { query, batchGet } = require('../../database')
const config = require('../../database/config')
const params = require('../../database/params')
const { errorEnd, groupBy } = require('./utility')

const router = express.Router()

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
      const event = {
        id: e.EventId,
        location: e.Location,
        description: e.Description,
        time: { start: e.Time.Start, end: e.Time.End },
        date: e.DateString,
        type: e.Type,
        name: e.Name,
      }
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

module.exports = router
