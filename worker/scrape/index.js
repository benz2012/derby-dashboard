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
  const rit = schools.find(s => s.SchoolId === 954)
  scrapeUtil.serverRenderedHTML(rit.URL)
    .then(html => resolve(parse.teamURLsForSchool(html, rit.SchoolId)))
    .catch(err => reject(err))
})

const teamValues = () => new Promise((resolve, reject) => {
  if (!schools) {
    reject('No Schools have been loaded yet')
  }
  const activeTeamIds = []
  schools.forEach((school) => {
    activeTeamIds.push(...school.Teams)
  })

  dbRead.teams().then((existingTeams) => {
    const pagesToScrape = []
    activeTeamIds.forEach((activeId) => {
      const currentTeam = existingTeams.find(t => t.TeamId === activeId)
      if (!currentTeam) {
        reject(`no team object found for teamId: ${activeId}`)
      }
      pagesToScrape.push(scrapeUtil.serverRenderedHTML(currentTeam.URL))
    })
    Promise.all(pagesToScrape).then((htmls) => {
      const valuesToParse = htmls.map(html => (
        parse.teamValues(html)
      ))
      Promise.all(valuesToParse)
        .then(values => resolve(values))
        .catch(err => reject(err))
    }).catch(err => reject(err))
  }).catch(err => reject(err))
})


// Exports
module.exports = {
  raised,
  teams,
  teamValues,
}
