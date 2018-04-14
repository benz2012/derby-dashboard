const express = require('express')

const { get, update } = require('../database')
const params = require('../database/params')
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
    const authorized = data.AdminPanel.indexOf(uid) !== -1
    res.json({ authorized })
  }).catch(err => errorEnd(err, res))
})

router.post('/access', (req, res) => {
  if (req.body) {
    if (!(req.body.uid && req.body.token)) {
      return errorEnd('Missing a request parameter(s)', res)
    }
    return update(params.accessUpdate(req.body.uid, req.body.token))
      .then(data => res.json(data))
      .catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})


module.exports = router
