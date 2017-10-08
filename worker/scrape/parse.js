const cheerio = require('cheerio')

const scrapeUtil = require('./utility')


// Parse Utilities
const teamIdFromURI = (url) => {
  const found = url.match(/derby-challenge\/(\d+)\//)
  return found.length > 0 && found[1]
}


// Parse Functions
const raisedValuesForSchool = html => new Promise((resolve, reject) => {
  const raisedValues = {}
  const dom = cheerio.load(html)
  const teams = dom('.GroupRosterWidget-partdesc')

  teams.each((i, elm) => {
    const teamURI = dom(elm).children('.GroupRosterWidget-name').first().attr('href')
    const teamId = teamIdFromURI(teamURI)
    if (!teamId) {
      reject(`failed to find teamId in teamURL: ${teamURI}`)
    }
    const amount = dom(elm).children('.GroupRosterWidget-raised').first().text()
    const cleanAmount = amount.trim().replace('$', '').replace(',', '')
    const floatAmount = parseFloat(cleanAmount)

    // validate data
    if (!teamId.split('').every(c => (parseInt(c) || c === '0'))) {
      // If any of the characters are not integers
      reject(`teamId is not valid: ${teamId}`)
    }
    if (!cleanAmount.split('').every(c => (parseInt(c) || ['0', '.'].includes(c)))) {
      // If any of the characters are not integers or '.'
      reject(`amount raised is not valid: ${cleanAmount}`)
    }
    if (!floatAmount) {
      // If parsing the string to float failed
      reject(`amount raised is not a valid float: ${cleanAmount}`)
    }
    // Data is valid, add it to the object
    raisedValues[teamId] = floatAmount
  })
  resolve(raisedValues)
})

const teamURLsForSchool = (html, schoolId) => new Promise((resolve, reject) => {
  const urls = {}
  const dom = cheerio.load(html)
  const teams = dom('.GroupRosterWidget-partdesc')

  teams.each((i, elm) => {
    const teamNode = dom(elm).children('.GroupRosterWidget-name').first()
    const teamName = teamNode.text()
    const teamURI = teamNode.attr('href')
    const teamId = teamIdFromURI(teamURI)
    if (!teamId) {
      reject(`failed to find teamId in teamURL: ${teamURI}`)
    }
    const shortTeamURI = teamURI.substring(0, teamURI.lastIndexOf('/'))
    const teamURL = `https://us-p2p.netdonor.net${shortTeamURI}`

    // validate data
    if (!teamId.split('').every(c => (parseInt(c) || c === '0'))) {
      // If any of the characters are not integers
      reject(`teamId is not valid: ${teamId}`)
    }
    urls[teamId] = { schoolId, url: teamURL, name: teamName }
  })
  // validate urls
  const urlValidations = Object.keys(urls).map(key => (
    scrapeUtil.validURL(urls[key])
  ))
  Promise.all(urlValidations).then((results) => {
    if (results.every(result => result)) {
      resolve(urls)
    } else {
      // if any urls are invalid
      reject('An invalid url was found when parsing teamURLsForSchool')
    }
  }).catch(err => reject(err))
})


// Exports
module.exports = {
  raisedValuesForSchool,
  teamURLsForSchool,
}
