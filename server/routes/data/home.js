const express = require('express')

const { getSchool, update } = require('../../database')
const params = require('../../database/params')
const config = require('../../database/config')
const { errorEnd } = require('./utility')

const router = express.Router()


const keyMap = {
  name: 'Name',
  abbrv: 'Abbreviation',
  header: 'Header',
  body: 'Body',
  learnMoreURL: 'LearnMoreURL',
  videoURL: 'VideoURL',
  year: 'EventYear',
  alertTime: 'AlertTime',
  alertRange: 'AlertDateRange',
}


router.get('/', (req, res) => {
  getSchool().then((school) => {
    const home = {
      header: school.HomePageData.Header,
      body: school.HomePageData.Body,
      learnMoreURL: school.HomePageData.LearnMoreURL,
      videoURL: school.HomePageData.VideoURL,
      name: school.Name,
      abbrv: school.Abbreviation,
      avatar: school.AvatarURL,
      schoolURL: school.URL,
      year: school.EventYear,
      alertRange: { start: school.AlertDateRange.Start, end: school.AlertDateRange.End },
      alertTime: school.AlertTime,
    }
    res.json(home)
  }).catch(err => errorEnd(err, res))
})

router.post('/', (req, res) => {
  if (req.body) {
    return Promise.all(
      req.body.map((u) => {
        const k = Object.keys(u)[0]
        let v = u[k]

        if (k === 'alertRange') {
          v = {
            Start: v.start,
            End: v.end,
          }
        }

        return update(params.attrUpdate(
          'Derby_Schools', { SchoolId: config.SCHOOL_ID_HARD }, keyMap[k], v
        ))
      })
    ).then(data => res.json(data)).catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})

router.post('/page', (req, res) => {
  if (req.body) {
    return Promise.all(
      req.body.map((u) => {
        const k = Object.keys(u)[0]
        const v = u[k]

        return update({
          TableName: 'Derby_Schools',
          Key: { SchoolId: config.SCHOOL_ID_HARD },
          ExpressionAttributeNames: {
            '#page': 'HomePageData',
            '#attr': keyMap[k],
          },
          ExpressionAttributeValues: {
            ':val': v,
          },
          UpdateExpression: 'SET #page.#attr = :val',
          ReturnValues: 'UPDATED_NEW',
        })
      })
    ).then(data => res.json(data)).catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})

module.exports = router
