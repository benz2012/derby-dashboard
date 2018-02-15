/* eslint padded-blocks: 0 */

'use strict'; // eslint-disable-line

const SNS = require('aws-sdk/clients/sns')

const baselineValidation = (tel) => {
  if ([10, 11].indexOf(tel.length) === -1) {
    // must be 10 or 11 digits in length
    return false
  }
  if (tel.length === 11 && tel.charAt(0) !== '1') {
    // must be only a US phone number
    return false
  }
  return true
}

const endTransaction = (statusCode, callback) => {
  const response = { statusCode }
  console.log(`response: ${JSON.stringify(response)}`)
  return callback(null, response)
}

exports.handler = (event, context, callback) => {
  console.log(`request: ${JSON.stringify(event)}`)

  if (event.body !== null && event.body !== undefined) {
    const body = JSON.parse(event.body)
    if (body.number !== null && body.number !== undefined) {

      console.log(`recieved value: ${body.number}`)
      // coerce all values to a string
      const numberAsString = String(body.number)
      // strip any non-digit caracters
      let cleanNumber = numberAsString.replace(/\D/g, '')
      // baseline telephone number validation
      if (baselineValidation(cleanNumber) === false) {
        return endTransaction(400, callback)
      }
      // gauruntees a US country code
      if (cleanNumber.length === 10) {
        cleanNumber = `1${cleanNumber}`
      }

      console.log(`attempting to subscribe: ${cleanNumber}`)
      const params = {
        TopicArn: 'arn:aws:sns:us-east-1:259262173836:Derby_Dashboard',
        Protocol: 'sms',
        Endpoint: cleanNumber,
      }
      const sns = new SNS()

      sns.subscribe(params, (err, data) => {
        if (err) {
          // subscription was a failure
          console.log(err, err.stack)
          return endTransaction(500, callback)
        }
        // subscription was a success
        console.log(data)
        const followupParams = {
          PhoneNumber: cleanNumber,
          Message: 'Thank you for subscribing to Derby Dashboard Event Alerts. Reply STOP at any time to unsubscribe.',
          MessageAttributes: {
            'AWS.SNS.SMS.SMSType': {
              DataType: 'String',
              StringValue: 'Transactional',
            },
          },
        }
        sns.publish(followupParams, (publishErr) => {
          if (publishErr) { console.log(publishErr) }
          return endTransaction(200, callback)
        })
      })

    } else {
      return endTransaction(400, callback)
    }
  } else {
    return endTransaction(400, callback)
  }
}
