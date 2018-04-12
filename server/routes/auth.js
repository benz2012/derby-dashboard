const express = require('express')

const { get } = require('../database')
const { errorEnd } = require('./data/utility')

const router = express.Router()
// Non-secure Request Validation
router.use((req, res, next) => {
  if (!req.header('sent-from-client-javascript')) {
    return next('router')
  }
  return next()
})

router.get('/', (req, res) => {
  const { uid } = req.query
  get({
    TableName: 'Derby_App',
    Key: { DataName: 'Authorized' },
  }).then((data) => {
    res.json(data)
  }).catch(err => errorEnd(err, res))
})


module.exports = router
