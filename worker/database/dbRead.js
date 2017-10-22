const connection = require('./connection')

const db = connection()


// Utility Promises
const scan = params => new Promise((resolve, reject) => {
  db.scan(params, (err, data) => {
    if (err) { return reject(err) }
    return resolve(data.Items)
  })
})


// Read Functions
const schools = () => (
  scan({
    TableName: 'Derby_Schools',
    ExpressionAttributeNames: {
      '#SID': 'SchoolId',
      '#URL': 'URL',
      '#T': 'Teams',
    },
    ExpressionAttributeValues: {
      ':active': true,
    },
    FilterExpression: 'Active = :active',
    ProjectionExpression: '#SID, #URL, #T',
  })
)
const teams = () => (
  scan({ TableName: 'Derby_Teams' })
)


// Exports
module.exports = {
  schools,
  teams,
}
