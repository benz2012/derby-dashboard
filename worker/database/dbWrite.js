const DynamoDB = require('aws-sdk/clients/dynamodb')
const moment = require('moment')

<<<<<<< HEAD
require('../../env') // load environment variables
=======
if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('../../env') // load environment variables
}
>>>>>>> scraper


// Database Connection
const db = new DynamoDB.DocumentClient({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  apiVersion: '2012-08-10',
  region: 'us-east-1',
})


// Utility Promises
const batchWrite = params => (
  new Promise((resolve, reject) => {
    db.batchWrite(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
)


// Wrtie Functions
const raised = (data) => {
  const timeSlot = Math.floor(moment().utc().hour() / 6)
  const dateString = moment().utc().format(`YYYY-MM-DD-${timeSlot}`)
  // eslint-disable-next-line arrow-body-style
  const updates = Object.keys(data).map(teamId => ({
    PutRequest: {
      Item: {
        TeamId: parseInt(teamId),
        DateString: dateString,
        Raised: data[teamId],
      },
    },
  }))
  return batchWrite({
    RequestItems: {
      Derby_Funds: updates,
    },
  })
}

module.exports = {
  raised,
}
