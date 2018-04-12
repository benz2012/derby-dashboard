const express = require('express')

const { query } = require('../../database')
const config = require('../../database/config')
const params = require('../../database/params')
const { errorEnd } = require('./utility')

const router = express.Router()

// Shared Functions
const mapReport = report => ({
  date: report.DateString,
  header: report.Header,
  body: report.Body,
  challenges: report.LinkedChallenges,
})


// Routes
router.get('/', (req, res) => {
  query(params.reportsQuery(config.SCHOOL_ID_HARD)).then((response) => {
    const structuredReports = response.map(mapReport)
    res.json(structuredReports)
  }).catch(err => errorEnd(err, res))
})


module.exports = router
