const DynamoDB = require('aws-sdk/clients/dynamodb')

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('../../env') // load environment variables
}


// Database Connection
const db = new DynamoDB.DocumentClient({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_WORKER,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_WORKER,
  apiVersion: '2012-08-10',
  region: 'us-east-1',
})


// Utility Promises
const get = params => new Promise((resolve, reject) => {
  db.get(params, (err, data) => {
    if (err) { return reject(err) }
    return resolve(data)
  })
})
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
