const scrapeUtil = require('./utility')
const parse = require('./parse')
const dbRead = require('../database/dbRead')


// Global State
let schools = null

// Initialize State Asynchronously
dbRead.schools().then((data) => {
  schools = data
}).catch(err => console.log(err))


// Scrape Functions
const raised = () => new Promise((resolve, reject) => {
  if (!schools) {
    reject('No Schools have been loaded yet')
  }
  // TODO: ~ FUTURE ~ Scrape data for all schools
  const rit = schools.find(s => s.SchoolId === 954)
  scrapeUtil.serverRenderedHTML(rit.URL)
    .then(html => resolve(parse.raisedValuesForSchool(html)))
    .catch(err => reject(err))
})

const teams = () => new Promise((resolve, reject) => {
  if (!schools) {
    reject('No Schools have been loaded yet')
  }
  // TODO: ~ FUTURE ~ Scrape data for all schools
  const rit = schools.find(s => s.SchoolId === 623)
  scrapeUtil.serverRenderedHTML(rit.URL)
    .then(html => resolve(parse.teamURLsForSchool(html, rit.SchoolId)))
    .catch(err => reject(err))
})


// Exports
module.exports = {
  raised,
  teams,
}
