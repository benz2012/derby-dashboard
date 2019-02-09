const express = require('express')

const { get, update } = require('../../database')
const params = require('../../database/params')
const { errorEnd } = require('./utility')

const router = express.Router()

router.get('/', (req, res) => {
  const { uid } = req.query
  return get({
    TableName: 'Derby_App',
    Key: { DataName: 'Authorized' },
  }).then((data) => {
    const authorized = Object.keys(data.AdminPanel).reduce((acc, key) => {
      // eslint-disable-next-line no-param-reassign
      acc = [...acc, ...data.AdminPanel[key]]
      return acc
    }, []).indexOf(uid) !== -1
    return res.json({ authorized })
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
