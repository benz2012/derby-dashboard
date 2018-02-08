const express = require('express')

const { get } = require('../../database')
const { errorEnd, markdownToHTML } = require('./utility')

const router = express.Router()

router.get('/more', (req, res) => {
  get({
    TableName: 'Derby_App',
    Key: { DataName: 'MorePage' },
  }).then((data) => {
    const more = {
      disclaimer: markdownToHTML(data.Disclaimer),
      support: markdownToHTML(data.Support),
      texting: markdownToHTML(data.SignUpForTexts),
      bookmark: markdownToHTML(data.SaveToPhone),
      overviewVideoURL: data.OverviewVideo,
    }
    res.json(more)
  }).catch(err => errorEnd(err, res))
})

module.exports = router
