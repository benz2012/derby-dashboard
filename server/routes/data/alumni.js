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
      const alumniKeys = Object.keys(data).filter(k => k !== 'DataName')
      const newId = alumniKeys.length + 1
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
        count: c.CountData.length,
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

module.exports = router
