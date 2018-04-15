const express = require('express')

const { getSchool, batchGet, get, update } = require('../../database')
const params = require('../../database/params')
const { errorEnd } = require('./utility')

const router = express.Router()

// Shared Functions
const keyMap = {
  org: 'Organization',
  orgId: 'OrganizationId',
  snap: 'SnapURL',
}
const mapTeam = team => ({
  id: team.TeamId,
  name: team.Name,
  org: team.Organization || team.Name,
  orgId: team.OrganizationId,
  avatar: team.AvatarURL,
  cover: team.CoverURL,
  url: team.URL,
  members: team.Members,
  snap: team.SnapURL,
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

router.post('/:id', (req, res) => {
  const teamId = parseInt(req.params.id)
  if (req.body) {
    return Promise.all(
      req.body.map((u) => {
        const k = Object.keys(u)[0]
        const v = u[k]

        return update(params.attrUpdate(
          'Derby_Teams', { TeamId: teamId }, keyMap[k], v
        ))
      })
    ).then(data => res.json(data)).catch(err => errorEnd(err, res))
  }
  return errorEnd('Missing a request body', res)
})


module.exports = router
