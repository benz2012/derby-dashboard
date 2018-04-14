const express = require('express')

const { getSchool, update } = require('../../database')
const config = require('../../database/config')
const { errorEnd } = require('./utility')

const router = express.Router()


const keyMap = {
  name: 'Name',
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
      alertRange: school.AlertDateRange,
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
        const v = u[k]
        return update({
          TableName: 'Derby_Schools',
          Key: { SchoolId: config.SCHOOL_ID_HARD },
          ExpressionAttributeNames: {
            '#k': keyMap[k],
          },
          ExpressionAttributeValues: {
            ':v': v,
          },
          UpdateExpression: 'SET #k = :v',
        }).then(data => res.json(data))
          .catch(err => errorEnd(err, res))
      })
    )
  }
  return errorEnd('Missing a request body', res)
})

module.exports = router
