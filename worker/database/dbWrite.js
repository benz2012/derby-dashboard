const moment = require('moment')

const connection = require('./connection')
const dbRead = require('./dbRead')

const db = connection()


// Utility Promises
const put = params => new Promise((resolve, reject) => {
  db.put(params, (err, data) => {
    if (err) { return reject(err) }
    return resolve(data)
  })
})
const update = params => new Promise((resolve, reject) => {
  db.update(params, (err, data) => {
    if (err) { return reject(err) }
    return resolve(data)
  })
})
const batchWrite = params => new Promise((resolve, reject) => {
  db.batchWrite(params, (err, data) => {
    if (err) { return reject(err) }
    return resolve(data)
  })
})


// Write Functions
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
  if (updates.length === 0) {
    throw 'WORKER ERROR: Length of raised updates was 0'
  }
  return batchWrite({
    RequestItems: {
      Derby_Funds: updates,
    },
  })
}

const teams = (data) => {
  dbRead.teams().then((existingTeams) => {
    const teamCreations = []
    Object.keys(data).forEach((teamId) => {
      if (existingTeams.find(t => t.TeamId === parseInt(teamId)) === undefined) {
        // If the team we want to write to the database doesn't exist yet
        teamCreations.push(put({
          TableName: 'Derby_Teams',
          Item: {
            TeamId: parseInt(teamId),
            URL: data[teamId].url,
            Name: data[teamId].name,
          },
        }))
      }
    })
    return Promise.all(teamCreations)
  }).catch(err => console.log(err))
}

const teamsForSchool = (data) => {
  const allSchoolIds = Object.keys(data).map(teamId => data[teamId].schoolId)
  const schoolIds = [...new Set(allSchoolIds)]
  const schoolTeams = {}
  schoolIds.forEach((schoolId) => {
    schoolTeams[schoolId] = Object.keys(data).filter(tid => (
      data[tid].schoolId === schoolId
    ))
  })
  dbRead.schools().then((activeSchools) => {
    const activeSchoolIds = activeSchools.map(s => s.SchoolId)
    const schoolUpdates = []
    Object.keys(schoolTeams).forEach((schoolId) => {
      if (!activeSchoolIds.includes(parseInt(schoolId))) { return }
      const teamIds = schoolTeams[schoolId]
      const currentSchool = activeSchools.find(s => s.SchoolId === parseInt(schoolId))
      const newTeamIds = teamIds
        .map(tid => parseInt(tid))
        .filter(tid => !currentSchool.Teams.includes(tid))
      if (newTeamIds.length === 0) { return }

      schoolUpdates.push(update({
        TableName: 'Derby_Schools',
        Key: { SchoolId: parseInt(schoolId) },
        ExpressionAttributeNames: {
          '#Teams': 'Teams',
        },
        ExpressionAttributeValues: {
          ':newTeamsList': newTeamIds,
        },
        UpdateExpression: 'SET #Teams = list_append(#Teams, :newTeamsList)',
      }))
    })
    return Promise.all(schoolUpdates)
  }).catch(err => console.log(err))
}

const teamValues = (data) => {
  const teamUpdates = []
  data.forEach((team) => {
    teamUpdates.push(update({
      TableName: 'Derby_Teams',
      Key: { TeamId: team.teamId },
      ExpressionAttributeNames: {
        '#N': 'Name',
        '#M': 'Members',
        '#A': 'AvatarURL',
        '#C': 'CoverURL',
      },
      ExpressionAttributeValues: {
        ':n': team.name,
        ':m': team.members,
        ':a': team.avatar,
        ':c': team.cover,
      },
      UpdateExpression: 'SET #N = :n, #M = :m, #A = :a, #C = :c',
    }))
  })
  return Promise.all(teamUpdates)
}

module.exports = {
  raised,
  teams,
  teamsForSchool,
  teamValues,
}
