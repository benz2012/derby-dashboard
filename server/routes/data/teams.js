const express = require('express')

const { getSchool, batchGet, get } = require('../../database')
const placeholder = require('../../database/placeholder')
const { errorEnd } = require('./utility')

const router = express.Router()

// Shared Functions
const mapTeam = team => ({
  id: team.TeamId,
  name: team.Name,
  org: team.Organization,
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
    // TODO: remove placeholder data
    const responsePlaceholder = {
      Derby_Teams: [...response.Derby_Teams, ...placeholder.teams],
    }
    const teams = responsePlaceholder.Derby_Teams.map(t => ({
      id: t.TeamId,
      name: t.Name,
      org: t.Organization,
      orgId: t.OrganizationId,
      avatar: t.AvatarURL,
      homeTeam: t.TeamId === homeTeamId,
    }))
    res.json(teams)
  }).catch(err => errorEnd(err, res))
})

router.get('/:id', (req, res) => {
  const teamId = parseInt(req.params.id)
  // TODO: remove placeholder data
  if (placeholder.teams.find(t => t.TeamId === teamId)) {
    const placeholderTeam = placeholder.teams.find(t => t.TeamId === teamId)
    const teamData = mapTeam(placeholderTeam)
    return res.json(teamData)
  }
  get({ TableName: 'Derby_Teams', Key: { TeamId: teamId } }).then((team) => {
    const teamData = mapTeam(team)
    res.json(teamData)
  }).catch(err => errorEnd(err, res))
  return null
})


module.exports = router
