const express = require('express')

const { getSchool, batchGet, get } = require('../../database')
const { errorEnd } = require('./utility')

const router = express.Router()

// Shared Functions
const mapTeam = team => ({
  id: team.TeamId,
  name: team.Name,
  org: team.Organization || team.Name,
  orgId: team.OrganizationId,
  avatar: team.AvatarURL,
  cover: team.CoverURL,
  url: team.URL,
  members: team.Members,
})


// Routes
router.get('/', (req, res) => {
  let homeTeamId
  getSchool().then((school) => {
    homeTeamId = school.HomeTeamId
    const teamKeys = school.Teams.map(t => ({ TeamId: t }))
    return batchGet({
      RequestItems: { Derby_Teams: { Keys: teamKeys } },
    })
  }).then((response) => {
    const teams = response.Derby_Teams.map((t) => {
      const structured = mapTeam(t)
      structured.homeTeam = t.TeamId === homeTeamId
      return structured
    })
    res.json(teams)
  }).catch(err => errorEnd(err, res))
})

router.get('/:id', (req, res) => {
  const teamId = parseInt(req.params.id)
  get({ TableName: 'Derby_Teams', Key: { TeamId: teamId } }).then((team) => {
    const teamData = mapTeam(team)
    res.json(teamData)
  }).catch(err => errorEnd(err, res))
  return null
})


module.exports = router
