const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const socketIO = require('socket.io')

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('../env') // load environment variables
}
const dataEndpoints = require('./routes/dataEndpoints')
const liveMiddleware = require('./routes/live')


// Globals
const app = express()
const server = http.Server(app)
const io = socketIO(server)


// Routes
app.use('/data', dataEndpoints)
// app.use(require('./routes/hot')) // Only triggers in development
app.use(express.static(`${process.cwd()}/public`)) // main code & assets
app.get('*', (req, res) => {
  // catch-all route for everything not defined, react-router will handle `404`
  res.sendFile(`${process.cwd()}/public/index.html`)
})
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
liveMiddleware(app, io)


// Socket Events
io.on('connection', (socket) => {
  console.log(`connected ${socket.id}`)
  socket.on('disconnect', () => {
    console.log(`disconnected ${socket.id}`)
  })
})


// Start Server
const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log(`\n\nserver listening on port ${port}\n`)
})
