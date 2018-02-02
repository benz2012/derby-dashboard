const DynamoDB = require('aws-sdk/clients/dynamodb')

const config = require('./config')


// Database Connection
const db = new DynamoDB.DocumentClient({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_SERVER,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_SERVER,
  apiVersion: '2012-08-10',
  region: 'us-east-1',
})


// Read Promises
const get = params => new Promise((resolve, reject) => {
  db.get(params, (err, data) => {
    if (err) { return reject(err) }
    if (!data || !data.Item) {
      return reject(`database response was invalid for: ${params}`)
    }
    return resolve(data.Item)
  })
})
const batchGet = params => new Promise((resolve, reject) => {
  db.batchGet(params, (err, data) => {
    if (err) { return reject(err) }
    if (!data || !data.Responses) {
      return reject(`database response was invalid for: ${params}`)
    }
    return resolve(data.Responses)
  })
})
const query = params => new Promise((resolve, reject) => {
  db.query(params, (err, data) => {
    if (err) { return reject(err) }
    if (!data || !data.Items) {
      return reject(`database response was invalid for: ${params}`)
    }
    return resolve(data.Items)
  })
})
const scan = params => new Promise((resolve, reject) => {
  db.scan(params, (err, data) => {
    if (err) { return reject(err) }
    if (!data || !data.Items) {
      return reject(`database response was invalid for: ${params}`)
    }
    return resolve(data.Items)
  })
})


// Utility Functions
const getSchool = () => (
  get({
    TableName: 'Derby_Schools',
    Key: { SchoolId: config.SCHOOL_ID_HARD },
  })
)


// Exports
module.exports = {
  get,
  batchGet,
  query,
  scan,
  getSchool,
}