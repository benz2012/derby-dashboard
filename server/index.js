if (process.env.NODE_ENV !== 'production') { // load environment variables
  require('../env') // eslint-disable-line
}
const opbeat = require('opbeat').start() // Initialize first for logging/tracing
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const socketIO = require('socket.io')
const data = require('./routes/data')
const live = require('./routes/live')
const socketHandler = require('./socketHandler')


// Globals
const app = express()
const server = http.Server(app)
const io = socketIO(server)


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
app.use('/data', data)
if (process.env.NODE_ENV !== 'production') {
  app.use(require('./routes/hot')) // eslint-disable-line global-require
}
app.use(express.static(`${process.cwd()}/public`)) // main code & assets
app.get('*', (req, res) => {
  // catch-all route for everything not defined
  res.sendFile(`${process.cwd()}/public/index.html`)
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
live(app, io) // handle POST requests to `/live`
socketHandler(io)
// Log anything from above routes/middleware to Opbeat
app.use(opbeat.middleware.express())


// Start Server
const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`\n\nserver listening on port ${port}\n`)
})
