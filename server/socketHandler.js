const socketHandler = (io) => {
  const clients = {}
  const cheering = {}

  io.on('connection', (socket) => {
    const ipAddress = socket.handshake.headers['x-real-ip']
    console.log(`connected ${ipAddress} with socket ${socket.id}`)
    socket.emit('address', ipAddress) // send browser their IP string

    // Keep track of the number of people disconnected, 'tab/id' agnostic
    if (clients[ipAddress] === undefined) {
      clients[ipAddress] = {}
    }
    clients[ipAddress][socket.id] = true
    console.log(JSON.stringify(clients))
    io.emit('watching', Object.keys(clients).length)
    io.emit('cheering', cheering)

    // Keep track of the teams that each person is cheering for
    socket.on('cheering', ({ cheeringFor }) => {
      cheering[ipAddress] = cheeringFor
      io.emit('cheering', cheering)
    })

    // When a socket closes/disconnects
    socket.on('disconnect', () => {
      console.log(`disconnected ${socket.id}`)

      // Remove their tracking reference
      delete clients[ipAddress][socket.id]
      if (Object.keys(clients[ipAddress]).length === 0) {
        // If this is the last socket (tab) per IP, remove them
        // completely and their cheering reference
        delete clients[ipAddress]
        delete cheering[ipAddress]
      }

      // Send the updates to anyone still connected
      console.log(JSON.stringify(clients))
      io.emit('watching', Object.keys(clients).length)
      io.emit('cheering', cheering)
    })
  })
}

module.exports = socketHandler
