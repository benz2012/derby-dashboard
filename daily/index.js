/* eslint padded-blocks: 0 */

'use strict'; // eslint-disable-line

const SNS = require('aws-sdk/clients/sns')
const request = require('request')

exports.handler = (event, context, callback) => {

  request('https://www.derbydashboard.io/sms/daily', (err, res, body) => {
    const message = JSON.parse(body)

    const params = {
      TopicArn: 'arn:aws:sns:us-east-1:259262173836:Derby_Dashboard',
      Message: message,
      MessageAttributes: {
        'AWS.SNS.SMS.SMSType': {
          DataType: 'String',
          StringValue: 'Promotional',
        },
      },
    }

    console.log(message)

    const sns = new SNS({ region: 'us-east-1' })
    sns.publish(params, (publishErr) => {
      if (publishErr) { console.log(publishErr) }
    })
  })
}
