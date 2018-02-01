const express = require('express')

const { query, getSchool } = require('../../database')
const params = require('../../database/params')
const placeholder = require('../../database/placeholder')
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
    const fundQueries = []
    school.Teams.forEach((tid) => {
      fundQueries.push(getFundsForTeam(tid))
    })
    return Promise.all(fundQueries)
  }).then((responses) => {
    const eachTeamRaised = responses
    eachTeamRaised.push(...placeholder.raised) // TODO: remove placeholder data
    res.json(eachTeamRaised)
  }).catch(err => errorEnd(err, res))
})

router.get('/:id', (req, res) => {
  const teamId = parseInt(req.params.id)
  // TODO: remove placeholder data
  // eslint-disable-next-line no-prototype-builtins
  if (placeholder.raised.filter(r => r.hasOwnProperty(teamId)).length > 0) {
    // eslint-disable-next-line no-prototype-builtins
    const fundsForTeam = placeholder.raised.filter(r => r.hasOwnProperty(teamId))[0]
    return res.json(fundsForTeam)
  }
  getFundsForTeam(teamId).then((fundsForTeam) => {
    res.json(fundsForTeam)
  }).catch(err => errorEnd(err, res))
  return null
})


module.exports = router
