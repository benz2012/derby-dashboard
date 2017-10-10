const express = require('express')

const dataRoutes = require('./dataRoutes')

// Globals
const app = express()


// Move to sparate server file, load only in development
if (process.env.NODE_ENV !== 'production') {
  const hotMiddleware = require('./hot') // eslint-disable-line global-require
  hotMiddleware(app)
}


// Routes
app.use(dataRoutes) // defined in `./routes.js`
app.use(express.static(`${process.cwd()}/public`))


// Start Server
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`\n\nserver listening on port ${port}\n`)
})
