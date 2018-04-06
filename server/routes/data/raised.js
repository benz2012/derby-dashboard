const express = require('express')

const { query, getSchool } = require('../../database')
const params = require('../../database/params')
const { errorEnd, lastDateTimeString } = require('./utility')

const router = express.Router()

// Shared Functions
const fundQuery = teamId => ([
  query(params.fundsQuery(teamId, lastDateTimeString(), { ScanIndexForward: false })),
  query(params.externalFundsQuery(teamId)),
])
const fundQueryNoDate = teamId => (
  query(params.fundsQueryNoDate(teamId, { ScanIndexForward: false, Limit: 4 }))
)

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


// Routes
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
