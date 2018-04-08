const express = require('express')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;

const router = express.Router()


// Configure the Facebook strategy for use by Passport.
passport.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:8080/login/facebook/return',
    enableProof: true,
    profileFields: ['id', 'name', 'profile_pic'],
  },
  (accessToken, refreshToken, profile, cb) => (
    // TODO: send a simple ID to the callback instead of entire user object
    cb(null, profile)
  )
))

// Configure Passport authenticated session persistence.
passport.serializeUser((user, cb) => {
  // TODO: send a simple ID to the callback instead of entire user object
  cb(null, user)
})
passport.deserializeUser((obj, cb) => {
  // TODO: send a simple ID to the callback instead of entire user object
  cb(null, obj)
})

// Initialize Passport and restore authentication state, if any, from the session.
router.use(passport.initialize())
router.use(passport.session())


// Define routes.
router.get('/', (req, res) => {
  res.sendFile(`${process.cwd()}/public/admin.html`)
})

router.get('/login/facebook', passport.authenticate('facebook'))

router.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/')
  })


module.exports = router
