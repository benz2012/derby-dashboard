const request = require('request')

// Scrape Utilities
const serverRenderedHTML = url => new Promise((resolve, reject) => {
  request(url, (err, res, body) => {
    if (err) { return reject(err) }
    if (res && res.statusCode && res.statusCode !== 200) {
      return reject(`GET unsuccessful, status code: ${res.statusCode}`)
    }
    if (!body) {
      return reject('GET unsuccessful, no HTML body returned')
    }
    return resolve(body)
  })
})
const validURL = url => new Promise((resolve, reject) => {
  request(url, (err, res, body) => { // eslint-disable-line no-unused-vars
    if (err) { return reject(err) }
    if (!(res && res.statusCode)) {
      return reject('GET unsuccessful, no response status recieved')
    } else if (res && res.statusCode === 200) {
      return resolve(true)
    }
    return resolve(false)
  })
})

module.exports = {
  serverRenderedHTML,
  validURL,
}
