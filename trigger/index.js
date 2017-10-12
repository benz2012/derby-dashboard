'use strict'

const request = require('request')

const objectEmpty = obj => Object.keys(obj).length === 0

exports.handler = (event, context, callback) => {
  event.Records.forEach((record) => {
    // log event
    console.log(record.eventID)
    console.log(record.eventName)
    console.log('DynamoDB Record: %j', record.dynamodb)

    let teamId
    let fundType
    let fundAmount

    // decipher change
    const change = record.dynamodb
    if (!objectEmpty(change)) {
      const newChange = change.NewImage
      if (!objectEmpty(newChange)) {
        teamId = parseInt(newChange.TeamId.N)
        if (newChange.Raised) {
          // change to derby funds
          fundType = 'raised'
          fundAmount = parseFloat(newChange.Raised.N)
        } else if (newChange.Amount) {
          // change to external funds
          fundType = 'external'
          const entryId = parseInt(newChange.EntryId.N)
          fundAmount = {
            [entryId]: parseFloat(newChange.Amount.N),
          }
        }
      }
    }

    if (!(teamId && fundType && fundAmount)) {
      callback(null, `UNSUCCESSFUL. Didn't process ${event.Records.length} records.`)
    }

    // trigger post request
    const options = {
      uri: 'https://derby-dashboard.herokuapp.com',
      method: 'POST',
      json: {
        key: process.env.LAMBDA_ACCESS_KEY_ID_POST,
        secret: process.env.LAMBDA_SECRET_ACCESS_KEY_POST,
        update: {
          [teamId]: {
            [fundType]: fundAmount,
          },
        },
      },
    }
    request(options, (err, res, body) => {
      if (err) {
        console.log(`POST error: ${err}`)
      }
      if (!err && res.statusCode !== 200) {
        console.log(`POST returned with status code: ${res.statusCode}`)
      }
      if (!err && res.statusCode === 200) {
        console.log('POST Successfully sent to server')
      }
    })
  })

  callback(null, `Successfully processed ${event.Records.length} records.`)
}
