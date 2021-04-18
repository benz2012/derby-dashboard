const scrapeUtil = require('./utility')
const parse = require('./parse')
const dbRead = require('../database/dbRead')

// Global Constants
const SCHOOL_ID_RIT = 90526

// Global State
let schools = null

// Initialize State Asynchronously
dbRead.schools().then((data) => {
  schools = data
}).catch(err => console.log(err))


// Scrape Functions
const raised = () => new Promise((resolve, reject) => {
  if (!schools) {
    reject(new Error('No Schools have been loaded yet'))
  }
  // TODO: ~ FUTURE ~ Scrape data for all schools
  const rit = schools.find(s => s.SchoolId === SCHOOL_ID_RIT)
  scrapeUtil.serverRenderedHTML(rit.URL)
    .then(html => resolve(parse.raisedValuesForSchool(html, rit.SchoolId)))
    .catch(err => reject(err))
})

const teams = () => new Promise((resolve, reject) => {
  if (!schools) {
    reject(new Error('No Schools have been loaded yet'))
  }
  // TODO: ~ FUTURE ~ Scrape data for all schools
  const rit = schools.find(s => s.SchoolId === SCHOOL_ID_RIT)
  scrapeUtil.serverRenderedHTML(rit.URL)
    .then(html => resolve(parse.teamURLsForSchool(html, rit.SchoolId)))
    .catch(err => reject(err))
})

const teamValues = () => new Promise((resolve, reject) => {
  if (!schools) {
    reject(new Error('No Schools have been loaded yet'))
  }
  const activeTeamIds = []
  schools.forEach((school) => {
    activeTeamIds.push(...school.Teams)
  })

  dbRead.teams().then((existingTeams) => {
    const pagesToScrape = []
    const idsForThosePages = []
    activeTeamIds.forEach((activeId) => {
      const currentTeam = existingTeams.find(t => t.TeamId === activeId)
      if (!currentTeam) {
        reject(new Error(`no team object found for teamId: ${activeId}`))
      }
      pagesToScrape.push(scrapeUtil.serverRenderedHTML(currentTeam.URL))
      idsForThosePages.push(parseInt(activeId))
    })
    Promise.all(pagesToScrape).then((htmls) => {
      const valuesToParse = htmls.map((html, index) => (
        parse.teamValues(html, idsForThosePages[index])
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
