const request = require('request')

// Scrape Utilities
const serverRenderedHTML = url => new Promise((resolve, reject) => {
  request(url, (err, res, body) => {
    if (err) { reject(err) }
    if (res && res.statusCode && res.statusCode !== 200) {
      reject(`GET unsuccessful, status code: ${res.statusCode}`)
    }
    if (!body) {
      reject('GET unsuccessful, no HTML body returned')
    }
    resolve(body)
  })
})
const validURL = url => new Promise((resolve, reject) => {
  request(url, (err, res, body) => { // eslint-disable-line no-unused-vars
    if (err) { reject(err) }
    if (!(res && res.statusCode)) {
      reject('GET unsuccessful, no response status recieved')
    } else if (res && res.statusCode === 200) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
})

module.exports = {
  serverRenderedHTML,
  validURL,
}
