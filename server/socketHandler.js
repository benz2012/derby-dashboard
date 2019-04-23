const socketHandler = (io) => {
  const clients = {}
  const cheering = {}

  io.on('connection', (socket) => {
    const { browserId } = socket.handshake.query
    console.log(`connected ${browserId} with socket ${socket.id}`)

    // Keep track of the number of people connected, 'tab' agnostic
    if (clients[browserId] === undefined) {
      clients[browserId] = {}
    }
    clients[browserId][socket.id] = true
    io.emit('watching', Object.keys(clients).length)
    io.emit('cheering', cheering)

    // Keep track of the teams that each person is cheering for
    socket.on('cheering', ({ cheeringFor }) => {
      cheering[browserId] = cheeringFor
      io.emit('cheering', cheering)
    })

    // When a socket closes/disconnects
    socket.on('disconnect', () => {
      console.log(`disconnected ${socket.id}`)

      // Remove their tracking reference
      delete clients[browserId][socket.id]
      if (Object.keys(clients[browserId]).length === 0) {
        // If this is the last socket (tab) per Id, remove them
        // completely and their cheering reference
        delete clients[browserId]
        delete cheering[browserId]
      }

      // Send the updates to anyone still connected
      io.emit('watching', Object.keys(clients).length)
      io.emit('cheering', cheering)
    })
  })
}

module.exports = socketHandler
