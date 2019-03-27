const request = require('request')

require('../env') // eslint-disable-line

const KEY = process.env.LAMBDA_ACCESS_KEY_ID_POST
const SECRET = process.env.LAMBDA_SECRET_ACCESS_KEY_POST

const send = (t, f, a) => {
  const options = {
    uri: 'https://localhost:8080/live',
    method: 'POST',
    insecure: true,
    strictSSL: false,
    json: {
      key: KEY,
      secret: SECRET,
      update: {
        teamId: t,
        mergable: {
          [f]: a,
        },
      },
    },
  }
  request(options, (err, res) => {
    if (err) {
      console.log(`POST error: ${err}`)
      return
    }
    if (!err && res.statusCode !== 200) {
      console.log(`POST returned with status code: ${res.statusCode}`)
      return
    }
    if (!err && res.statusCode === 200) {
      console.log('POST Successfully sent to server')
      return
    }
  })
}

send(30966, 'raised', 1200)
