'use strict'

const request = require('request')

const KEY = process.env.LAMBDA_ACCESS_KEY_ID_POST
const SECRET = process.env.LAMBDA_SECRET_ACCESS_KEY_POST

const objectEmpty = obj => Object.keys(obj).length === 0

const processEvent = (event, context, callback) => {
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
      if (record.eventName === 'REMOVE') {
        const oldKeys = change.Keys
        if (!objectEmpty(oldKeys)) {
          if (oldKeys.EntryId) {
            teamId = parseInt(oldKeys.TeamId.N)
            fundType = 'external'
            const entryId = parseInt(oldKeys.EntryId.N)
            fundAmount = {
              [entryId]: 0,
            }
          }
        }
      } else {
        // event type was INSERT or MODIFY
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
    }

    if (!(teamId && fundType && (fundAmount || fundAmount === 0))) {
      console.log("UNSUCCESSFUL: Didn't process this record. No retry attempt will be made.")
      return
    }

    // trigger post request
    const options = {
      uri: `${process.env.DOMAIN}/live`,
      method: 'POST',
      json: {
        key: KEY,
        secret: SECRET,
        update: {
          teamId,
          fundType,
          fundAmount,
        },
      },
    }
    request(options, (err, res, body) => {
      if (err) {
        console.log(`POST error: ${err}`)
        return
      }
      if (!err && res.statusCode !== 200) {
        console.log(`POST returned with status code: ${res.statusCode}`)
        return
      }
      if (!err && res.statusCode === 200) {
        console.log('POST Successfully sent to server')
        return
      }
    })
  })

  return callback(null, `Successfully processed ${event.Records.length} records.`)
}

exports.handler = (event, context, callback) => {
  processEvent(event, context, callback)
}
