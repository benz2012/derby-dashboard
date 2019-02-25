const express = require('express')

const { query, getSchool, put, update, remove } = require('../../database')
const params = require('../../database/params')
const { errorEnd, lastDateTimeString, applyKeyMapToObj } = require('./utility')

const router = express.Router()

// Shared Functions
const keyMap = {
  teamId: 'TeamId',
  entryId: 'EntryId',
  amount: 'Amount',
  dateString: 'DateString',
}

const mapExternal = external => ({
  teamId: external.TeamId,
  entryId: external.EntryId,
  amount: external.Amount,
  dateString: external.DateString,
})

const fundQuery = teamId => ([
  query(params.fundsQuery(teamId, lastDateTimeString(), { ScanIndexForward: false })),
  query(params.externalFundsQuery(teamId)),
])

const fundQueryNoDate = teamId => (
  query(params.fundsQueryNoDate(teamId, { ScanIndexForward: false, Limit: 4 }))
)

const nextId = (data) => {
  const ids = data.map(d => parseInt(d.EntryId, 10))
    .sort((a, b) => (b - a))
  if (ids.length === 0) {
    return 0
  }
  return ids[0] + 1
}

const getFundsForTeam = teamId => (
  // Query for the funds, trying two methods in case entires are not up-to-date
  Promise.all(fundQuery(teamId)).then((responses) => {
    const [fundsRaised, fundsExternal] = responses
    if (fundsRaised.length === 0) {
      return Promise.all([fundQueryNoDate(teamId), fundsExternal])
    }
    return responses
  }).then((responses) => {
    // Structure the results
    const [fundsRaised, fundsExternal] = responses
    const structured = {
      id: teamId,
      raised: 0,
      external: {},
    }
    if (fundsRaised[0] && fundsRaised[0].Raised) {
      structured.raised = fundsRaised[0].Raised
    }
    if (fundsExternal[0] && fundsExternal[0].EntryId) {
      fundsExternal.forEach((fund) => {
        structured.external[fund.EntryId] = fund.Amount
      })
    }
    return structured
  }).catch((err) => { throw err })
)

//
// External Funds Routes
router.get('/external', (req, res) => (
  getSchool().then((school) => {
    const fundQueries = school.Teams.map(tid => (
      query(params.externalFundsQuery(tid))
    ))
    return Promise.all(fundQueries)
  }).then((responses) => {
    const funds = responses.map(resForTeam => resForTeam.map(mapExternal))
    return res.json(funds)
  }).catch(err => errorEnd(err, res))
))

router.put('/external', (req, res) => {
  if (req.body) {
    const { teamId, amount, dateString } = req.body
    return query(
      params.externalFundsQuery(parseInt(teamId))
    ).then((fundsExternal) => {
      const newId = nextId(fundsExternal)
      const Item = {
        TeamId: parseInt(teamId),
        EntryId: newId,
        Amount: parseFloat(amount),
        DateString: dateString,
      }
      return put({ TableName: 'Derby_ExternalFunds', Item })
    }).then(data => res.json(data)).catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})

router.post('/external', (req, res) => {
  if (req.body) {
    const { TeamId, EntryId, Amount, DateString } = applyKeyMapToObj(req.body, keyMap)
    const Item = {
      TeamId: parseInt(TeamId),
      EntryId: parseInt(EntryId),
      Amount: parseFloat(Amount),
      DateString,
    }
    return put({ TableName: 'Derby_ExternalFunds', Item })
      .then(data => res.json(data))
      .catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})

router.delete('/external', (req, res) => {
  if (req.body) {
    const { TeamId, EntryId } = applyKeyMapToObj(req.body, keyMap)
    return remove({
      TableName: 'Derby_ExternalFunds',
      Key: { TeamId, EntryId },
    }).then(data => res.json(data)).catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})

//
// General Routes
router.get('/', (req, res) => {
  getSchool().then((school) => {
    const fundQueries = school.Teams.map(tid => (
      getFundsForTeam(tid)
    ))
    return Promise.all(fundQueries)
  }).then((responses) => {
    res.json(responses)
  }).catch(err => errorEnd(err, res))
})

router.get('/:id', (req, res) => {
  const teamId = parseInt(req.params.id)
  getFundsForTeam(teamId).then((fundsForTeam) => {
    res.json(fundsForTeam)
  }).catch(err => errorEnd(err, res))
  return null
})


module.exports = router
