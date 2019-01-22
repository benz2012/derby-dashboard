// load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('../env') // eslint-disable-line
}
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const socketIO = require('socket.io')
const morgan = require('morgan')

const data = require('./routes/data')
const live = require('./routes/live')
const alerts = require('./routes/alerts')
const socketHandler = require('./socketHandler')


// Globals
const app = express()
const server = http.Server(app)
const io = socketIO(server)

// Logging
app.use(morgan('short'))

// Redirects
app.enable('trust proxy')
// redirect any http requests to https
app.use((req, res, next) => {
  if (!req.secure && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.headers.host}${req.url}`)
  }
  return next()
})


// Routes & Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/data', data)
app.use('/sms', alerts)
if (process.env.NODE_ENV !== 'production') {
  app.use(require('./routes/hot')) // eslint-disable-line global-require
}
app.use(express.static(`${process.cwd()}/public`)) // main code & assets
live(app, io)
socketHandler(io)

// catch-all route for everything not defined
app.get('*', (req, res) => {
  res.sendFile(`${process.cwd()}/public/index.html`)
})


// Start Server
const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`\n\nserver listening on port ${port}\n`)
})
