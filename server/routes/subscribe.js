const express = require('express')
const request = require('request')

const router = express.Router()

// Act as a proxy for AWS api gateway
router.post('/', (req, res) => {
  if (req.body) {
    const options = {
      url: 'https://92y5mji7jh.execute-api.us-east-1.amazonaws.com/prod',
      method: 'POST',
      json: {
        number: req.body.number,
      },
    }

    request(options, (err, proxyResponse) => {
      if (err) { console.log(`POST error: ${err}`) }
      res.sendStatus(proxyResponse.statusCode)
    })
  }
})

module.exports = router
