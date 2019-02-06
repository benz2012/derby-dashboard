const express = require('express')

const { query, batchGet, get, put, update, remove } = require('../../database')
const config = require('../../database/config')
const params = require('../../database/params')
const { errorEnd } = require('./utility')

const router = express.Router()

const keyMap = {
  name: 'Name',
  description: 'Description',
  scores: 'Scores',
  public: 'ScoresPublic',
}

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
        description: c.Description,
        scores: c.Scores,
        public: c.ScoresPublic,
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
      public: c.ScoresPublic,
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

router.put('/', (req, res) => {
  if (req.body) {
    const item = Object.keys(req.body).reduce((accum, key) => {
      // eslint-disable-next-line no-param-reassign
      accum[keyMap[key]] = req.body[key]
      return accum
    }, {})
    return query(params.challengesQuery(config.SCHOOL_ID_HARD))
      .then((challenges) => {
        const ids = challenges.map(c => parseInt(c.ChallengeId))
        return Math.max(...ids) + 1
      })
      .then(cid => (
        put({
          TableName: 'Derby_Challenges',
          Item: Object.assign(item, {
            SchoolId: config.SCHOOL_ID_HARD,
            ChallengeId: cid,
          }),
        })
      ))
      .then(data => res.json(data))
      .catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})

router.post('/:id', (req, res) => {
  const cid = parseInt(req.params.id)
  if (req.body) {
    return Promise.all(
      req.body.map((u) => {
        const k = Object.keys(u)[0]
        let v = u[k]

        if (k === 'scores') {
          const scoreList = Object.keys(v).map(tid => ({
            [tid]: {
              include: Boolean(v[tid].include),
              score: parseInt(v[tid].score),
            },
          }))
          v = Object.assign({}, ...scoreList)
        }

        return update(params.attrUpdate(
          'Derby_Challenges',
          { SchoolId: config.SCHOOL_ID_HARD, ChallengeId: cid },
          keyMap[k],
          v
        ))
      })
    ).then(data => res.json(data)).catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})

router.delete('/:id', (req, res) => {
  const cid = parseInt(req.params.id)
  return remove({
    TableName: 'Derby_Challenges',
    Key: { SchoolId: config.SCHOOL_ID_HARD, ChallengeId: cid },
  }).then(data => res.json(data)).catch(err => errorEnd(err, res))
})


module.exports = router
