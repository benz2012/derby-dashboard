const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const socketIO = require('socket.io')

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('../env') // load environment variables
}
const data = require('./routes/data')
const live = require('./routes/live')
const socketHandler = require('./socketHandler')


// Globals
const app = express()
const server = http.Server(app)
const io = socketIO(server)


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


// Start Server
const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`\n\nserver listening on port ${port}\n`)
})
