// This module allows the server to accept POST requests to the `live` route,
// but only if they are authenticated and coming from the Amazon Lambda Function
// A successfull post request this route sends live updates to the connected clients

const live = (app, io) => {
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
        return res.status(403).send()
      }
    }
    return res.end()
  })
}

module.exports = live
