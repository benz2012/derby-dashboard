const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const socketIO = require('socket.io')

const dataRoutes = require('./dataRoutes')


// Globals
const app = express()
const server = http.Server(app)
const io = socketIO(server)


// Routes
app.use(dataRoutes)
if (process.env.NODE_ENV !== 'production') {
  // Hot Module Replacement, development only
  const hotMiddleware = require('./hot') // eslint-disable-line global-require
  hotMiddleware(app)
}
app.use(express.static(`${process.cwd()}/public`))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('*', (req, res) => {
  res.sendFile(`${process.cwd()}/public/index.html`)
})
app.post('/live', (req, res) => {
  if (req.body) {
    // vaildate post came from lambda
    const keyChecks = [
      req.body.key === process.env.LAMBDA_ACCESS_KEY_ID_POST,
      req.body.secret === process.env.LAMBDA_SECRET_ACCESS_KEY_POST,
    ]
    if (keyChecks.every(k => k === true)) {
      io.emit('liveUpdate', { data: req.body.update })
    } else {
      // post request is invalid
      console.log('received invalid POST request')
      res.status(403).send()
    }
  }
  res.end()
})


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
