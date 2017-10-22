const express = require('express')

const { getSchool } = require('../../database')
const { errorEnd } = require('./utility')

const router = express.Router()

router.get('/', (req, res) => {
  getSchool().then((school) => {
    const home = {
      header: school.HomePageData.Header,
      body: school.HomePageData.Body,
      learnMoreURL: school.HomePageData.LearnMoreURL,
      videoURL: school.HomePageData.VideoURL,
      abbrv: school.Abbreviation,
    }
    res.send(JSON.stringify(home))
  }).catch(err => errorEnd(err, res))
})

module.exports = router
