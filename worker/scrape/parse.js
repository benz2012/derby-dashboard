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
      return reject(`failed to find teamId in teamURI: ${teamURI}`)
    }
    const amount = dom(elm).children('.GroupRosterWidget-raised').first().text()
    const cleanAmount = amount.trim().replace('$', '').replace(',', '')
    const floatAmount = parseFloat(cleanAmount)

    // validate data
    if (!teamId.split('').every(c => (parseInt(c) || c === '0'))) {
      // If any of the characters are not integers
      return reject(`teamId is not valid: ${teamId}`)
    }
    if (!cleanAmount.split('').every(c => (parseInt(c) || ['0', '.'].includes(c)))) {
      // If any of the characters are not integers or '.'
      return reject(`amount raised is not valid: ${cleanAmount}`)
    }
    if (!floatAmount) {
      // If parsing the string to float failed
      return reject(`amount raised is not a valid float: ${cleanAmount}`)
    }
    // Data is valid, add it to the object
    raisedValues[teamId] = floatAmount
  })
  return resolve(raisedValues)
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
      return reject(`failed to find teamId in teamURI: ${teamURI}`)
    }
    const shortTeamURI = teamURI.substring(0, teamURI.lastIndexOf('/'))
    const teamURL = `https://us-p2p.netdonor.net${shortTeamURI}`

    // validate data
    if (!teamId.split('').every(c => (parseInt(c) || c === '0'))) {
      // If any of the characters are not integers
      return reject(`teamId is not valid: ${teamId}`)
    }
    urls[teamId] = { schoolId, url: teamURL, name: teamName }
  })
  // validate urls
  const urlValidations = Object.keys(urls).map(key => (
    scrapeUtil.validURL(urls[key])
  ))
  Promise.all(urlValidations).then((results) => {
    if (results.every(result => result)) {
      return resolve(urls)
    } else {
      // if any urls are invalid
      return reject('An invalid url was found when parsing teamURLsForSchool')
    }
  }).catch(err => reject(err))
})

const teamValues = html => new Promise((resolve, reject) => {
  const dom = cheerio.load(html)
  const teamURL = dom("meta[property='og:url']").attr('content')
  const teamId = teamIdFromURI(teamURL)
  if (!teamId) {
    return reject(`failed to find teamId in teamURL: ${teamURL}`)
  }

  const teamName = dom('#page_name').text()
  const avatarURL = dom('#page-image-camp').attr('src')
  const coverURL = dom('#page-banner').attr('src')

  const memberNode = dom('.group-member-count').first()
  const memberText = memberNode.children().first().text()
  const found = memberText.match(/(\d+).+/)
  const memberNumber = found.length > 0 && found[1]
  if (!memberNumber) {
    return reject(`failed to find number of members for team: ${teamId}`)
  }

  const finalValues = {
    teamId: parseInt(teamId),
    name: teamName,
    members: parseInt(memberNumber),
    avatar: avatarURL,
    cover: coverURL,
  }

  // validate data
  if (!teamId.split('').every(c => (parseInt(c) || c === '0'))) {
    // If any of the characters are not integers
    return reject(`teamId is not valid: ${teamId}`)
  }
  if (!memberNumber.split('').every(c => (parseInt(c) || c === '0'))) {
    // If any of the characters are not integers
    return reject(`number of members is not valid: ${memberNumber}`)
  }
  const urlValidations = [
    scrapeUtil.validURL(avatarURL),
    scrapeUtil.validURL(coverURL),
  ]
  Promise.all(urlValidations).then((results) => {
    if (results.every(result => result)) {
      return resolve(finalValues)
    } else {
      // if any urls are invalid
      return reject(`An invalid url was found when parsing team: ${teamId}`)
    }
  }).catch(err => reject(err))
})


// Exports
module.exports = {
  raisedValuesForSchool,
  teamURLsForSchool,
  teamValues,
}
