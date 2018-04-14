const express = require('express')

const { query, batchGet, get, update, put } = require('../../database')
const config = require('../../database/config')
const params = require('../../database/params')
const { errorEnd, groupBy } = require('./utility')

const router = express.Router()

// Shared Functions
const keyMap = {
  name: 'Name',
  location: 'Location',
  description: 'Description',
  time: 'Time',
  date: 'DateString',
  type: 'Type',
  challengeId: 'ChallengeId',
}
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
        return Object.assign(event, {
          challenge: linkedChallenge.Description,
          challengeId: linkedChallenge.ChallengeId,
        })
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
    eventData.challengeId = c.ChallengeId
    res.json(eventData)
  }).catch(err => errorEnd(err, res))
})

router.post('/:id', (req, res) => {
  const eventId = parseInt(req.params.id)
  if (req.body) {
    return Promise.all(
      req.body.map((u) => {
        const k = Object.keys(u)[0]
        let v = u[k]

        if (k === 'challengeId') {
          v = parseInt(v)
          return query(params.eventsQuery(config.SCHOOL_ID_HARD))
            .then((events) => {
              const alreadyLinked = events.find(e => e.ChallengeId === v)
              if (alreadyLinked) {
                return update(params.attrRemove(
                  'Derby_Events',
                  { SchoolId: config.SCHOOL_ID_HARD, EventId: alreadyLinked.EventId },
                  'ChallengeId'
                ))
              }
              return null
            })
            .then(() => query(params.challengesQuery(config.SCHOOL_ID_HARD)))
            .then((challenges) => {
              const alreadyLinked = challenges.find(c => c.EventId === eventId)
              if (alreadyLinked) {
                return update(params.attrRemove(
                  'Derby_Challenges',
                  { SchoolId: config.SCHOOL_ID_HARD, ChallengeId: alreadyLinked.ChallengeId },
                  'EventId'
                ))
              }
              return null
            })
            .then(() => (
              update(params.attrUpdate(
                'Derby_Events',
                { SchoolId: config.SCHOOL_ID_HARD, EventId: eventId },
                keyMap[k],
                v
              ))
            ))
            .then(() => (
              update(params.attrUpdate(
                'Derby_Challenges',
                { SchoolId: config.SCHOOL_ID_HARD, ChallengeId: v },
                'EventId',
                eventId
              ))
            ))
            .catch(err => errorEnd(err, res))
        }

        if (k === 'time') {
          v = {
            Start: v.start,
            End: v.end,
          }
        }

        return update(params.attrUpdate(
          'Derby_Events',
          { SchoolId: config.SCHOOL_ID_HARD, EventId: eventId },
          keyMap[k],
          v
        ))
      })
    ).then(data => res.json(data)).catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})

// router.put('/', (req, res) => {
//   if (req.body) {
//     const item = req.body.reduce((accum, curr) => {
//       const k = Object.keys(curr)[0]
//       accum[keymap[k]] = curr[k]
//       return accum
//     }, {})
//     put({
//       TableName: 'Derby_Events',
//       Item: item,
//     })
//   }
//   return errorEnd('Missing a request body', res)
// })

module.exports = router
