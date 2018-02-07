const express = require('express')

const { query, getSchool } = require('../../database')
const params = require('../../database/params')
const { errorEnd, twoWeekTimeString } = require('./utility')

const router = express.Router()

// Shared Functions
const fundsHistory = teamId => (
  query(params.fundsQueryNoDate(teamId, { ScanIndexForward: false, Limit: 56 }))
)
const structureRaisedHistory = (history) => {
  const twoWeeksAgo = twoWeekTimeString()
  return (
    history
      .filter(item => item.DateString > twoWeeksAgo)
      .map(item => ({ dateString: item.DateString, raised: item.Raised }))
      .reverse()
  )
}
const structureExternalHistory = history => (
  history.map(item => ({ dateString: item.DateString, amount: item.Amount }))
)


// Routes
router.get('/', (req, res) => {
  getSchool().then((school) => {
    const historyQueries = school.Teams.map(tid => (
      Promise.all([
        tid, fundsHistory(tid), query(params.externalFundsQuery(tid)),
      ])
    ))
    return Promise.all(historyQueries)
  }).then((responses) => {
    const allHistory = {}
    responses.forEach((response) => {
      const [tid, raised, external] = response
      allHistory[tid] = {
        raised: structureRaisedHistory(raised),
        external: structureExternalHistory(external),
      }
    })
    res.json(allHistory)
  }).catch(err => errorEnd(err, res))
})

router.get('/:id', (req, res) => {
  const teamId = parseInt(req.params.id)
  Promise.all([
    fundsHistory(teamId), query(params.externalFundsQuery(teamId)),
  ]).then((responses) => {
    const [raised, external] = responses
    const structured = {
      raised: structureRaisedHistory(raised),
      external: structureExternalHistory(external),
    }
    res.json(structured)
  }).catch(err => errorEnd(err, res))
})


module.exports = router
