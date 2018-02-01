const socketHandler = (io) => {
  const clients = {}
  const cheering = {}

  io.on('connection', (socket) => {
    console.log(`connected ${socket.id}`)
    clients[socket.id] = true
    io.emit('watching', Object.keys(clients).length)

    socket.on('cheering', ({ cheeringFor }) => {
      cheering[socket.id] = cheeringFor
      io.emit('cheering', cheering)
    })

    socket.on('disconnect', () => {
      console.log(`disconnected ${socket.id}`)
      delete clients[socket.id]
      delete cheering[socket.id]
      io.emit('watching', Object.keys(clients).length)
      io.emit('cheering', cheering)
    })
  })
}

module.exports = socketHandler
