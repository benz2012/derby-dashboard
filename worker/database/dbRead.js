const DynamoDB = require('aws-sdk/clients/dynamodb')

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('../../env') // load environment variables
}


// Database Connection
const db = new DynamoDB.DocumentClient({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  apiVersion: '2012-08-10',
  region: 'us-east-1',
})


// Utility Promises
const scan = params => (
  new Promise((resolve, reject) => {
    db.scan(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data.Items)
    })
  })
)


// Read Functions
const schoolURLs = () => (
  scan({
    TableName: 'Derby_Schools',
    ExpressionAttributeNames: {
      '#SID': 'SchoolId',
      '#URL': 'URL',
    },
    ExpressionAttributeValues: {
      ':active': true,
    },
    FilterExpression: 'Active = :active',
    ProjectionExpression: '#SID, #URL',
  })
)


// Exports
module.exports = {
  schoolURLs,
}
