/* eslint consistent-return: 0 */

const cheerio = require('cheerio')

const scrapeUtil = require('./utility')

// Parse Globals
const HOSTNAME = 'https://hope.huntsmancancer.org'
const BASENAME = 'huntsmanchallenge2021'

// Parse Utilities
const teamIdFromURI = (url) => {
  const re = new RegExp(`${BASENAME}\\/(\\d+)\\/`)
  const found = url.match(re)
  return found.length > 0 && found[1]
}

// Parse Functions
const raisedValuesForSchool = (html, schoolId) => new Promise((resolve, reject) => {
  const raisedValues = {}
  const dom = cheerio.load(html)
  const teams = dom('.GroupChildWidget-group')

  // funds donated to school page
  const schoolAmount = dom('#page-raised').first().text()
  const schoolCleanAmount = schoolAmount.trim().replace('$', '').replace(',', '')
  const schoolFloatAmount = parseFloat(schoolCleanAmount)
  if (!schoolCleanAmount.split('').every(c => (parseInt(c) || ['0', '.'].includes(c)))) {
    // If any of the characters are not integers or '.'
    return reject(new Error(`amount raised is not valid: ${schoolCleanAmount}`))
  }
  if (!schoolFloatAmount && schoolFloatAmount !== 0) {
    // If parsing the string to float failed
    return reject(new Error(`amount raised is not a valid float: ${schoolCleanAmount}`))
  }
  raisedValues[schoolId] = schoolFloatAmount

  teams.each((i, elm) => {
    const teamURI = dom(elm).children('.GroupListWidget-name').first().attr('href')
    const teamId = teamIdFromURI(teamURI)
    if (!teamId) {
      return reject(new Error(`failed to find teamId in teamURI: ${teamURI}`))
    }
    const amount = dom(elm).children('.GroupListWidget-raised').first().text()
    const cleanAmount = amount.trim().replace('$', '').replace(',', '')
    const floatAmount = parseFloat(cleanAmount)

    // validate data
    if (!teamId.split('').every(c => (parseInt(c) || c === '0'))) {
      // If any of the characters are not integers
      return reject(new Error(`teamId is not valid: ${teamId}`))
    }
    if (!cleanAmount.split('').every(c => (parseInt(c) || ['0', '.'].includes(c)))) {
      // If any of the characters are not integers or '.'
      return reject(new Error(`amount raised is not valid: ${cleanAmount}`))
    }
    if (!floatAmount && floatAmount !== 0) {
      // If parsing the string to float failed
      return reject(new Error(`amount raised is not a valid float: ${cleanAmount}`))
    }
    // Data is valid, add it to the object
    raisedValues[teamId] = floatAmount
  })
  if (Object.keys(raisedValues).length === 0) {
    return reject(new Error('PARSE FAILED: raisedValues object was empty'))
  }
  return resolve(raisedValues)
})

const teamURLsForSchool = (html, schoolId) => new Promise((resolve, reject) => {
  const urls = {}
  const dom = cheerio.load(html)
  const teams = dom('.GroupChildWidget-group')

  teams.each((i, elm) => {
    const teamNode = dom(elm).children('.GroupListWidget-name').first()
    const teamName = teamNode.text()
    const teamURI = teamNode.attr('href')
    const teamId = teamIdFromURI(teamURI)
    if (!teamId) {
      return reject(new Error(`failed to find teamId in teamURI: ${teamURI}`))
    }
    const shortTeamURI = teamURI.substring(0, teamURI.lastIndexOf('/'))
    const teamURL = `${HOSTNAME}${shortTeamURI}`

    // validate data
    if (!teamId.split('').every(c => (parseInt(c) || c === '0'))) {
      // If any of the characters are not integers
      return reject(new Error(`teamId is not valid: ${teamId}`))
    }
    urls[teamId] = { schoolId, url: teamURL, name: teamName }
  })
  // validate urls
  const urlValidations = Object.keys(urls).map(key => (
    scrapeUtil.validURL(urls[key])
  ))
  Promise.all(urlValidations).then((results) => {
    if (results.every(result => result)) {
      // all urls must be valid
      if (Object.keys(urls).length === 0) {
        return reject(new Error('PARSE FAILED: urls object was empty'))
      }
      return resolve(urls)
    }
    return reject(new Error('An invalid url was found when parsing teamURLsForSchool'))
  }).catch(err => reject(err))
})

const teamValues = (html, teamId) => new Promise((resolve, reject) => {
  const dom = cheerio.load(html)

  const teamName = dom('#page_name').text()
  const avatarURL = dom('#page-image-camp').attr('src')
  const coverURL = dom('#page-banner').attr('src')

  const memberNode = dom('.group-member-count').first()
  const memberText = memberNode.children().first().text()
  const found = memberText.match(/(\d+).+/)
  const memberNumber = found.length > 0 && found[1]
  if (!memberNumber) {
    return reject(new Error(`failed to find number of members for team: ${teamId}`))
  }

  const finalValues = {
    teamId,
    name: teamName,
    members: parseInt(memberNumber),
    avatar: avatarURL,
    cover: coverURL,
  }

  // validate data
  if (!memberNumber.split('').every(c => (parseInt(c) || c === '0'))) {
    // If any of the characters are not integers
    return reject(new Error(`number of members is not valid: ${memberNumber}`))
  }
  const urlValidations = [
    scrapeUtil.validURL(avatarURL),
    scrapeUtil.validURL(coverURL),
  ]
  Promise.all(urlValidations).then((results) => {
    if (results.every(result => result)) {
      // all urls must be valid
      return resolve(finalValues)
    }
    return reject(new Error(`An invalid url was found when parsing team: ${teamId}`))
  }).catch(err => reject(err))
})


// Exports
module.exports = {
  raisedValuesForSchool,
  teamURLsForSchool,
  teamValues,
}
