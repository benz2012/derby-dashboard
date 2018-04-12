const fundsQuery = (teamId, dataString, additional) => (Object.assign({
  TableName: 'Derby_Funds',
  ExpressionAttributeNames: {
    '#T': 'TeamId',
    '#D': 'DateString',
  },
  ExpressionAttributeValues: {
    ':tid': teamId,
    ':dts': dataString,
  },
  KeyConditionExpression: '#T = :tid and #D >= :dts',
}, additional))

const fundsQueryNoDate = (teamId, additional) => (Object.assign({
  TableName: 'Derby_Funds',
  ExpressionAttributeNames: {
    '#T': 'TeamId',
  },
  ExpressionAttributeValues: {
    ':tid': teamId,
  },
  KeyConditionExpression: '#T = :tid',
}, additional))

const externalFundsQuery = (teamId, additional) => (Object.assign({
  TableName: 'Derby_ExternalFunds',
  ExpressionAttributeNames: {
    '#T': 'TeamId',
  },
  ExpressionAttributeValues: {
    ':tid': teamId,
  },
  KeyConditionExpression: '#T = :tid',
}, additional))

const eventsQuery = (schoolId, additional) => (Object.assign({
  TableName: 'Derby_Events',
  ExpressionAttributeNames: {
    '#S': 'SchoolId',
  },
  ExpressionAttributeValues: {
    ':sid': schoolId,
  },
  KeyConditionExpression: '#S = :sid',
}, additional))

const challengesQuery = (schoolId, additional) => (Object.assign({
  TableName: 'Derby_Challenges',
  ExpressionAttributeNames: {
    '#S': 'SchoolId',
  },
  ExpressionAttributeValues: {
    ':sid': schoolId,
  },
  KeyConditionExpression: '#S = :sid',
}, additional))

const reportsQuery = (schoolId, additional) => (Object.assign({
  TableName: 'Derby_Reports',
  ExpressionAttributeNames: {
    '#S': 'SchoolId',
  },
  ExpressionAttributeValues: {
    ':sid': schoolId,
  },
  KeyConditionExpression: '#S = :sid',
}, additional))

module.exports = {
  fundsQuery,
  fundsQueryNoDate,
  externalFundsQuery,
  eventsQuery,
  challengesQuery,
  reportsQuery,
}
