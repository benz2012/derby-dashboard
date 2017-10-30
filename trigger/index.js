'use strict'

const KMS = require('aws-sdk/clients/kms')
const request = require('request')


const encryptedKey = process.env.LAMBDA_ACCESS_KEY_ID_POST
const encryptedSecret = process.env.LAMBDA_SECRET_ACCESS_KEY_POST
let decryptedKey
let decryptedSecret

const objectEmpty = obj => Object.keys(obj).length === 0

const processEvent = (event, context, callback) => {
  event.Records.forEach((record) => {
    // log event
    console.log(record.eventID)
    console.log(record.eventName)
    console.log('DynamoDB Record: %j', record.dynamodb)

    if (record.eventName === 'REMOVE') {
      console.log(null, 'Irrelevent event type.')
      return
    }

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
      console.log(null, "UNSUCCESSFUL: Didn't process this record. No retry attempt will be made.")
      return
    }

    // trigger post request
    const options = {
      uri: `${process.env.DOMAIN}/live`,
      method: 'POST',
      json: {
        key: decryptedKey,
        secret: decryptedSecret,
        update: {
          [teamId]: {
            [fundType]: fundAmount,
          },
        },
      },
    }
    request(options, (err, res, body) => {
      if (err) {
        console.log(null, `POST error: ${err}`)
        return
      }
      if (!err && res.statusCode !== 200) {
        console.log(null, `POST returned with status code: ${res.statusCode}`)
        return
      }
      if (!err && res.statusCode === 200) {
        console.log(null, 'POST Successfully sent to server')
        return
      }
    })
  })

  return callback(null, `Successfully processed ${event.Records.length} records.`)
}

exports.handler = (event, context, callback) => {
  if (decryptedKey && decryptedSecret) {
    processEvent(event, context, callback)
  } else {
    // Decrypt code should run once and variables stored outside of the function
    // handler so that these are decrypted once per container
    const kms = new KMS()
    kms.decrypt({ CiphertextBlob: new Buffer(encryptedKey, 'base64') }, (err, data) => {
      if (err) {
        console.log('Decrypt error:', err)
        return callback(err)
      }
      decryptedKey = data.Plaintext.toString('ascii')

      return kms.decrypt({ CiphertextBlob: new Buffer(encryptedSecret, 'base64') }, (err2, data2) => {
        if (err2) {
          console.log('Decrypt error:', err2)
          return callback(err2)
        }
        decryptedSecret = data2.Plaintext.toString('ascii')
        return processEvent(event, context, callback)
      })
    })
  }
}
