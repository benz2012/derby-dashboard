const express = require('express')

const alumni = require('./alumni')
const application = require('./application')
const auth = require('./auth')
const authGroups = require('./authGroups')
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
  }
  if (['POST', 'PUT', 'DELETE'].indexOf(req.method) !== -1) {
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
      const group = Object.keys(data.AdminPanel)
        .filter(g => data.AdminPanel[g].indexOf(uid) !== -1)[0]
      const groupAllowed = authGroups[group].indexOf(req.url.split('/')[1]) !== -1
      if (client && secure && groupAllowed) {
        return next()
      }
      console.log({ client, secure, groupAllowed })
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
