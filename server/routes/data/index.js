const express = require('express')

const alumni = require('./alumni')
const application = require('./application')
const auth = require('./auth')
const challenges = require('./challenges')
const events = require('./events')
const history = require('./history')
const home = require('./home')
const raised = require('./raised')
const reports = require('./reports')
const teams = require('./teams')
const year = require('./year')

const { get } = require('../../database')
const { errorEnd } = require('./utility')

// Router Handler
const router = express.Router()
// Non-secure & Secure Request Validation
router.use((req, res, next) => {
  if (req.method === 'GET') {
    if (!req.header('sent-from-client-javascript')) {
      return next('router')
    }
    return next()
  } else if (['POST', 'PUT', 'DELETE'].indexOf(req.method) !== -1) {
    if (req.url === '/auth/access') {
      if (!req.header('sent-from-client-javascript')) {
        return next('router')
      }
      return next()
    }
    const client = req.header('sent-from-client-javascript')
    const uid = req.header('auth-uid')
    const clientToken = req.header('auth-token')
    return get({
      TableName: 'Derby_App',
      Key: { DataName: 'Authorized' },
    }).then((data) => {
      const serverToken = data.AccessTokens[uid]
      const secure = serverToken === clientToken
      if (client && secure) {
        return next()
      }
      return errorEnd('UNAUTHORIZED POST REQUEST', res)
    }).catch(err => errorEnd(`ERROR AUTHORIZING POST REQUEST: ${err}`, res))
  }
  return next('router')
})


// Routes
router.use('/alumni', alumni)
router.use('/application', application)
router.use('/auth', auth)
router.use('/challenges', challenges)
router.use('/events', events)
router.use('/history', history)
router.use('/home', home)
router.use('/raised', raised)
router.use('/reports', reports)
router.use('/teams', teams)
router.use('/year', year)

router.get('/*', (req, res) => {
  res.json({ message: 'Error: Endpoint does not exist.' })
})


module.exports = router
