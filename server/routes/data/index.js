const express = require('express')

const challenges = require('./challenges')
const events = require('./events')
const home = require('./home')
const raised = require('./raised')
const teams = require('./teams')
const year = require('./year')


// Router Handler
const router = express.Router()
// Non-secure Request Validation
router.use((req, res, next) => {
  if (!req.header('sent-from-client-javascript')) {
    return next('router')
  }
  return next()
})


// Routes
router.use('/challenges', challenges)
router.use('/events', events)
router.use('/home', home)
router.use('/raised', raised)
router.use('/teams', teams)
router.use('/year', year)


module.exports = router
