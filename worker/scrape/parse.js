const cheerio = require('cheerio')


const raisedValuesForSchool = html => new Promise((resolve, reject) => {
  const raisedValues = {}
  const dom = cheerio.load(html)
  const teamsRaised = dom('.GroupRosterWidget-partdesc')

  teamsRaised.each((i, elm) => {
    const teamURL = dom(elm).children('.GroupRosterWidget-name').first().attr('href')
    let teamId = null
    const found = teamURL.match(/derby-challenge\/(\d+)\//)
    if (found.length > 0) {
      teamId = found[1]
    } else {
      reject(`failed to find teamId in teamURL: ${teamURL}`)
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


// Exports
module.exports = {
  raisedValuesForSchool,
}
