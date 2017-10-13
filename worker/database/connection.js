const DynamoDB = require('aws-sdk/clients/dynamodb')

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('../../env') // load environment variables
}

const connect = () => new DynamoDB.DocumentClient({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID_WORKER,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_WORKER,
  apiVersion: '2012-08-10',
  region: 'us-east-1',
})

module.exports = connect
