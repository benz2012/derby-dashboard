const socketHandler = (io) => {
  const clients = {}
  const cheering = {}

  io.on('connection', (socket) => {
    const { address } = socket.handshake
    console.log(`connected ${address} with socket ${socket.id}`)
    socket.emit('address', address) // send browser their IP string

    // Keep track of the number of people disconnected, 'tab/id' agnostic
    if (clients[address] === undefined) {
      clients[address] = {}
    }
    clients[address][socket.id] = true
    console.log(JSON.stringify(clients))
    io.emit('watching', Object.keys(clients).length)
    io.emit('cheering', cheering)

    // Keep track of the teams that each person is cheering for
    socket.on('cheering', ({ cheeringFor }) => {
      cheering[address] = cheeringFor
      io.emit('cheering', cheering)
    })

    // When a socket closes/disconnects
    socket.on('disconnect', () => {
      console.log(`disconnected ${socket.id}`)

      // Remove their tracking reference
      delete clients[address][socket.id]
      if (Object.keys(clients[address]).length === 0) {
        // If this is the last socket (tab) per IP, remove them
        // completely and their cheering reference
        delete clients[address]
        delete cheering[address]
      }

      // Send the updates to anyone still connected
      console.log(JSON.stringify(clients))
      io.emit('watching', Object.keys(clients).length)
      io.emit('cheering', cheering)
    })
  })
}

module.exports = socketHandler
