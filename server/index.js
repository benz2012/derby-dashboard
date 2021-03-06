// load environment variables
if (process.env.NODE_ENV !== 'production') {
  require('../env') // eslint-disable-line global-require
}

const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const socketIO = require('socket.io')

const data = require('./routes/data')
const live = require('./routes/live')
const alerts = require('./routes/alerts')
const socketHandler = require('./socketHandler')


// Globals
const app = express()
let server
if (process.env.NODE_ENV === 'production') {
  server = http.Server(app)
} else {
  const fs = require('fs') // eslint-disable-line global-require
  const https = require('https') // eslint-disable-line global-require
  const privateKey = fs.readFileSync(`${process.cwd()}/local-https/localhost.key`)
  const certificate = fs.readFileSync(`${process.cwd()}/local-https/localhost.crt`)
  server = https.createServer({ key: privateKey, cert: certificate }, app)
}
const io = socketIO(server)

// Redirects
app.enable('trust proxy')
if (process.env.SSL_ENABLED === 'true') {
  // expose http route for ssl verification
  app.use('/.well-known', express.static(`${process.cwd()}/public/.well-known`))
  // redirect any http requests to https
  app.use((req, res, next) => {
    if (!req.secure && process.env.NODE_ENV === 'production') {
      return res.redirect(`https://${req.headers.host}${req.url}`)
    }
    return next()
  })
}

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
