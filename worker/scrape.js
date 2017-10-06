const request = require('request')
const cheerio = require('cheerio')

const raised = new Promise((resolve, reject) => {
  // scrape data
  // validate data
  const data = 10
  resolve(data)
  reject('data was invalid')
})


// Export Functions
module.exports = {
  raised,
}
