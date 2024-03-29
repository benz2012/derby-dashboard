const express = require('express')

const { get, update } = require('../../database')
const params = require('../../database/params')
const { errorEnd, applyKeyMapToObj, markdownToHTML } = require('./utility')

const router = express.Router()

// Shared Functions
const keyMap = {
  name: 'Name',
  email: 'Email',
  pledges: 'Pledges',
  description: 'Description',
  endDate: 'EndDate',
  countData: 'CountData',
  countName: 'CountName',
}
const nextId = data => (
  Object.keys(data)
    .filter(k => k !== 'DataName')
    .map(k => parseInt(k, 10))
    .sort((a, b) => (b - a))[0] + 1
)

//
// Alumni Routes
router.get('/', (req, res) => {
  get({
    TableName: 'Derby_App',
    Key: { DataName: 'AlumniPledges' },
  }).then((data) => {
    const alumniKeys = Object.keys(data).filter(k => k !== 'DataName')
    const alumniData = alumniKeys.map((k) => {
      const a = data[k]
      return ({
        id: k,
        name: a.Name,
        email: a.Email,
        pledges: a.Pledges,
      })
    })
    res.json(alumniData)
  }).catch(err => errorEnd(err, res))
})

router.put('/', (req, res) => {
  if (req.body) {
    const item = applyKeyMapToObj(req.body, keyMap)
    return get({
      TableName: 'Derby_App',
      Key: { DataName: 'AlumniPledges' },
    }).then((data) => {
      const newId = nextId(data)
      return update(params.attrUpdate(
        'Derby_App',
        { DataName: 'AlumniPledges' },
        newId,
        item
      ))
    }).then(data => res.json(data))
      .catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})

router.post('/:id', (req, res) => {
  const alumniId = req.params.id
  if (req.body) {
    const item = applyKeyMapToObj(req.body, keyMap)
    return update(params.attrUpdate(
      'Derby_App',
      { DataName: 'AlumniPledges' },
      alumniId,
      item
    )).then(data => res.json(data))
      .catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})

router.delete('/:id', (req, res) => {
  const alumniId = req.params.id
  return update(params.attrRemove(
    'Derby_App',
    { DataName: 'AlumniPledges' },
    alumniId
  )).then(data => res.json(data))
    .catch(err => errorEnd(err, res))
})

//
// Pledges Route
router.get('/pledges', (req, res) => {
  get({
    TableName: 'Derby_App',
    Key: { DataName: 'AlumniPledges' },
  }).then((data) => {
    const alumniKeys = Object.keys(data).filter(k => k !== 'DataName')
    const pledgeData = alumniKeys.map(k => (data[k].Pledges))
    res.json(pledgeData)
  }).catch(err => errorEnd(err, res))
})

//
// Challenges Routes
router.get('/challenges', (req, res) => {
  get({
    TableName: 'Derby_App',
    Key: { DataName: 'AlumniChallenges' },
  }).then((data) => {
    const challengeKeys = Object.keys(data).filter(k => k !== 'DataName')

    const challengeData = challengeKeys.map((k) => {
      const c = data[k]
      return ({
        id: k,
        name: c.Name,
        description: c.Description,
        endDate: c.EndDate,
        countData: c.CountData,
        countName: c.CountName,
      })
    })
    res.json(challengeData)
  }).catch(err => errorEnd(err, res))
})

router.get('/challenges/:id', (req, res) => {
  const challengeId = parseInt(req.params.id)
  get({
    TableName: 'Derby_App',
    Key: { DataName: 'AlumniChallenges' },
  }).then((data) => {
    const challengeKey = Object.keys(data)
      .filter(k => parseInt(k) === challengeId)[0]
    if (challengeKey === undefined) {
      throw new Error('Alumni Challenge does not exist for this id')
    }

    const c = data[challengeKey]
    const challengeData = ({
      id: challengeKey,
      name: c.Name,
      description: c.Description,
      endDate: c.EndDate,
      countData: c.CountData.map(markdownToHTML),
      countName: c.CountName,
    })
    res.json(challengeData)
  }).catch(err => errorEnd(err, res))
})

router.put('/challenges', (req, res) => {
  if (req.body) {
    const item = applyKeyMapToObj(req.body, keyMap)
    return get({
      TableName: 'Derby_App',
      Key: { DataName: 'AlumniChallenges' },
    }).then((data) => {
      const newId = nextId(data)
      return update(params.attrUpdate(
        'Derby_App',
        { DataName: 'AlumniChallenges' },
        newId,
        item
      ))
    }).then(data => res.json(data))
      .catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})

router.post('/challenges/:id', (req, res) => {
  const challengeId = req.params.id
  if (req.body) {
    const item = applyKeyMapToObj(req.body, keyMap)
    return update(params.attrUpdate(
      'Derby_App',
      { DataName: 'AlumniChallenges' },
      challengeId,
      item
    )).then(data => res.json(data))
      .catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})

router.delete('/challenges/:id', (req, res) => {
  const challengeId = req.params.id
  return update(params.attrRemove(
    'Derby_App',
    { DataName: 'AlumniChallenges' },
    challengeId
  )).then(() => (
    get({
      TableName: 'Derby_App',
      Key: { DataName: 'AlumniPledges' },
    })
  )).then((data) => {
    const alumniKeys = Object.keys(data).filter(k => k !== 'DataName')
    return Promise.all(
      alumniKeys.map((key) => {
        const alum = data[key]
        const updatedPledges = Object.keys(alum.Pledges)
          .filter(pKey => pKey !== challengeId)
          .reduce((acc, pKey) => {
            acc[pKey] = alum.Pledges[pKey]
            return acc
          }, {})
        const updatedAlum = {
          ...alum,
          Pledges: updatedPledges,
        }
        return update(params.attrUpdate(
          'Derby_App',
          { DataName: 'AlumniPledges' },
          key,
          updatedAlum
        ))
      })
    )
  }).then(data => res.json(data))
    .catch(err => errorEnd(err, res))
})

module.exports = router
