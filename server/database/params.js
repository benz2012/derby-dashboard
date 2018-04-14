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

const accessUpdate = (uid, token, additional) => (Object.assign({
  TableName: 'Derby_App',
  Key: { DataName: 'Authorized' },
  ExpressionAttributeNames: {
    '#access': 'AccessTokens',
    '#uid': uid,
  },
  ExpressionAttributeValues: {
    ':token': token,
  },
  UpdateExpression: 'SET #access.#uid = :token',
}, additional))

const attrUpdate = (table, key, attr, val, additional) => (Object.assign({
  TableName: table,
  Key: key,
  ExpressionAttributeNames: {
    '#attr': attr,
  },
  ExpressionAttributeValues: {
    ':val': val,
  },
  UpdateExpression: 'SET #attr = :val',
  ReturnValues: 'UPDATED_NEW',
}, additional))

const attrRemove = (table, key, attr, additional) => (Object.assign({
  TableName: table,
  Key: key,
  ExpressionAttributeNames: {
    '#attr': attr,
  },
  UpdateExpression: 'REMOVE #attr',
}, additional))

module.exports = {
  fundsQuery,
  fundsQueryNoDate,
  externalFundsQuery,
  eventsQuery,
  challengesQuery,
  reportsQuery,
  accessUpdate,
  attrUpdate,
  attrRemove,
}
