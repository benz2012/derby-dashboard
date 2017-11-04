const express = require('express')

const { getSchool } = require('../../database')
const { errorEnd } = require('./utility')

const router = express.Router()

router.get('/', (req, res) => {
  getSchool().then((school) => {
    res.json({ year: school.EventYear })
  }).catch(err => errorEnd(err, res))
})

module.exports = router
