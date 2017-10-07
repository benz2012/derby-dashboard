const request = require('request')

const dbRead = require('../database/dbRead')
const parse = require('./parse')

// Global State
let schoolURLs = null

// Initialize State Asynchronously
dbRead.schoolURLs().then((urls) => {
  schoolURLs = urls
}).catch(err => console.log(err))


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


// Scrape Functions
const raised = () => new Promise((resolve, reject) => {
  if (!schoolURLs) {
    reject('No School URLs have been loaded yet')
  }
  // TODO: ~ FUTURE ~ Scrape data for all schools
  const rit = schoolURLs.find(s => s.SchoolId === 954)
  serverRenderedHTML(rit.URL)
    .then(html => resolve(parse.raisedValuesForSchool(html)))
    .catch(err => reject(err))
})


// Exports
module.exports = {
  raised,
}
