const express = require('express')

const { query, get, put, update, remove } = require('../../database')
const config = require('../../database/config')
const params = require('../../database/params')
const { errorEnd } = require('./utility')

const router = express.Router()

// Shared Functions
const keyMap = {
  header: 'Header',
  body: 'Body',
  date: 'DateString',
  challenges: 'LinkedChallenges',
  publish: 'Published',
}
const mapReport = report => ({
  date: report.DateString,
  header: report.Header,
  body: report.Body,
  challenges: report.LinkedChallenges,
  publish: report.Published,
})


// Routes
router.get('/', (req, res) => {
  query(params.reportsQuery(config.SCHOOL_ID_HARD)).then((response) => {
    const structuredReports = response.map(mapReport)
    res.json(structuredReports)
  }).catch(err => errorEnd(err, res))
})

router.get('/:date', (req, res) => {
  const dateString = req.params.date
  get({
    TableName: 'Derby_Reports',
    Key: { SchoolId: config.SCHOOL_ID_HARD, DateString: dateString },
  }).then((data) => {
    const reportData = mapReport(data)
    // console.log(reportData)
    res.json(reportData)
  }).catch(err => errorEnd(err, res))
})

router.put('/', (req, res) => {
  if (req.body) {
    const item = Object.keys(req.body).reduce((accum, key) => {
      accum[keyMap[key]] = req.body[key]
      return accum
    }, {})
    return (
      put({
        TableName: 'Derby_Reports',
        Item: Object.assign(item, {
          SchoolId: config.SCHOOL_ID_HARD,
          LinkedChallenges: [],
        }),
      }).then(data => res.json(data)).catch(err => errorEnd(err, res))
    )
  }
  return errorEnd('Missing a request body', res)
})

router.post('/:date', (req, res) => {
  const dateString = req.params.date
  if (req.body) {
    return Promise.all(
      req.body.map((u) => {
        const k = Object.keys(u)[0]
        let v = u[k]
        console.log(k === 'publish' && v === true)

        if (k === 'challenges') {
          v = v.split(',').map(s => parseInt(s))
        }
        if (k === 'publish' && v === true) {
          const chs = req.body.challenges
          if (chs && chs !== '' && chs.length > 0) {
            const linkedChallenges = chs.split(',').map(s => parseInt(s))
            return Promise.all(
              linkedChallenges.map(chId => (
                update(params.attrUpdate(
                  'Derby_Challenges',
                  { SchoolId: config.SCHOOL_ID_HARD, ChallengeId: chId },
                  'ScoresPublic',
                  true
                ))
              ))
            ).then(() => {
              update(params.attrUpdate(
                'Derby_Reports',
                { SchoolId: config.SCHOOL_ID_HARD, DateString: dateString },
                keyMap[k],
                v
              ))
            })
          }
        }

        return update(params.attrUpdate(
          'Derby_Reports',
          { SchoolId: config.SCHOOL_ID_HARD, DateString: dateString },
          keyMap[k],
          v
        ))
      })
    ).then(data => res.json(data)).catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})

router.delete('/:date', (req, res) => {
  const dateString = req.params.date
  return remove({
    TableName: 'Derby_Reports',
    Key: { SchoolId: config.SCHOOL_ID_HARD, DateString: dateString },
  }).then(data => res.json(data)).catch(err => errorEnd(err, res))
})


module.exports = router
