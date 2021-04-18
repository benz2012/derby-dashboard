const express = require('express')
const request = require('request')
const moment = require('moment-timezone')

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

const timeParse = t => moment(t, 'HH:mm')
const timeSort = (eventA, eventB) => {
  const datetimeA = timeParse(eventA.time.start)
  const datetimeB = timeParse(eventB.time.start)
  if (datetimeA.isBefore(datetimeB)) return -1
  if (datetimeA.isAfter(datetimeB)) return 1
  return 0
}

router.get('/daily', (req, res) => {
  const options = {
    url: 'https://www.derbydashboard.io/data/events',
    headers: {
      'sent-from-client-javascript': true,
    },
  }
  return request(options, (err, response, body) => {
    const events = JSON.parse(body)

    const ny = moment().tz('America/New_York')
    const today = ny.format('YYYY-MM-DD')
    const todaysEvents = events[today]

    if (!todaysEvents) {
      return res.json({ error: 'no events found' })
    }

    const todaysURL = `https://www.derbydashboard.io/schedule/${today}`
    // const urlEncoded = encodeURIComponent(todaysURL)
    // const bitlyReqURI = `https://api-ssl.bitly.com/v3/shorten?access_token=${process.env.BITLY_API_KEY}&longUrl=${urlEncoded}`
    const bitlyReq = {
      method: 'POST',
      url: 'https://api-ssl.bitly.com/v4/shorten',
      auth: {
        bearer: process.env.BITLY_API_KEY,
      },
      json: {
        long_url: todaysURL,
      },
    }
    return request(bitlyReq, (bitlyErr, bitlyRes, bitData) => {
      if (!bitData) { return res.json({ error: 'bitly didnt work' }) }
      const bitLink = bitData.id
      if (!bitLink) { return res.json({ error: 'bitly didnt have link' }) }

      todaysEvents.sort(timeSort)
      const microEvents = todaysEvents.map((event) => {
        const n = event.name.replace(/[^A-Za-z0-9]/g, '').substr(0, 12)
        const t = moment(event.time.start, 'HH:mm').format('ha')
        return `${n} @${t}`
      })
      const eventsString = microEvents.join('\n')

      const message = `Todays Events:\n${eventsString}\nDetails: ${bitLink}`
      return res.json(message)
    })
  })
})

module.exports = router
