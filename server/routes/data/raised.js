const express = require('express')

const { query, getSchool } = require('../../database')
const params = require('../../database/params')
const placeholder = require('../../database/placeholder')
const { errorEnd, lastDateTimeString } = require('./utility')

const router = express.Router()

// Shared Functions
const fundQuery = teamId => ([
  query(params.fundsQuery(teamId, lastDateTimeString())),
  query(params.externalFundsQuery(teamId)),
])

const structureFunds = (databaseFunds) => {
  let teamId = 0
  const structured = {
    raised: 0,
    external: {},
  }
  databaseFunds.forEach((fund) => {
    if (fund[0] && fund[0].Raised) {
      const mostRecent = fund.pop()
      teamId = mostRecent.TeamId
      structured.raised = mostRecent.Raised
    } else if (fund[0] && fund[0].EntryId) {
      fund.forEach((externalFund) => {
        structured.external[externalFund.EntryId] = externalFund.Amount
      })
    }
  })
  return { [teamId]: structured }
}


// Routes
router.get('/', (req, res) => {
  getSchool().then((school) => {
    const fundQueries = []
    school.Teams.forEach((tid) => {
      fundQueries.push(Promise.all(fundQuery(tid)))
    })
    return Promise.all(fundQueries)
  }).then((responses) => {
    const eachTeamRaised = []
    responses.forEach((teamResponse) => {
      const fundsForTeam = structureFunds(teamResponse)
      eachTeamRaised.push(fundsForTeam)
    })
    eachTeamRaised.push(...placeholder.raised) // TODO: remove placeholder data
    res.send(JSON.stringify(eachTeamRaised))
  }).catch(err => errorEnd(err, res))
})

router.get('/:id', (req, res) => {
  const teamId = parseInt(req.params.id)
  // TODO: remove placeholder data
  // eslint-disable-next-line no-prototype-builtins
  if (placeholder.raised.filter(r => r.hasOwnProperty(teamId)).length > 0) {
    // eslint-disable-next-line no-prototype-builtins
    const fundsForTeam = placeholder.raised.filter(r => r.hasOwnProperty(teamId))[0]
    res.send(JSON.stringify(fundsForTeam))
  }
  Promise.all(fundQuery(teamId)).then((responses) => {
    const fundsForTeam = structureFunds(responses)
    res.send(JSON.stringify(fundsForTeam))
  }).catch(err => errorEnd(err, res))
})


module.exports = router
