const socketHandler = (io) => {
  const clients = {}
  const cheering = {}

  io.on('connection', (socket) => {
    const { remoteAddress } = socket.connection
    console.log(`connected ${remoteAddress} with socket ${socket.id}`)
    socket.emit('address', remoteAddress) // send browser their IP string

    // Keep track of the number of people disconnected, 'tab/id' agnostic
    if (clients[remoteAddress] === undefined) {
      clients[remoteAddress] = {}
    }
    clients[remoteAddress][socket.id] = true
    console.log(JSON.stringify(clients))
    io.emit('watching', Object.keys(clients).length)
    io.emit('cheering', cheering)

    // Keep track of the teams that each person is cheering for
    socket.on('cheering', ({ cheeringFor }) => {
      cheering[remoteAddress] = cheeringFor
      io.emit('cheering', cheering)
    })

    // When a socket closes/disconnects
    socket.on('disconnect', () => {
      console.log(`disconnected ${socket.id}`)

      // Remove their tracking reference
      delete clients[remoteAddress][socket.id]
      if (Object.keys(clients[remoteAddress]).length === 0) {
        // If this is the last socket (tab) per IP, remove them
        // completely and their cheering reference
        delete clients[remoteAddress]
        delete cheering[remoteAddress]
      }

      // Send the updates to anyone still connected
      console.log(JSON.stringify(clients))
      io.emit('watching', Object.keys(clients).length)
      io.emit('cheering', cheering)
    })
  })
}

module.exports = socketHandler
