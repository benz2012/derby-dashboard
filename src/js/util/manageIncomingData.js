/* eslint no-param-reassign: 0 */

const filterChallenges = (challenges, teamId) => (
  challenges
    .filter(c => (
      Object.keys(c.scores).length > 0 &&
      c.public === true &&
      Object.keys(c.scores[teamId]).length > 0 &&
      c.scores[teamId].include === true
    ))
    .map((c) => {
      const ourScore = c.scores[teamId].score
      const rank = Object.keys(c.scores)
        .filter(tid => (
          parseInt(tid) !== parseInt(teamId) &&
          c.scores[tid].include
        ))
        .map(tid => c.scores[tid].score)
        .reduce((acc, they) => {
          if (they > ourScore) return acc + 1
          return acc
        }, 1)
      return ({
        id: c.id,
        name: c.name,
        description: c.description,
        score: ourScore,
        rank,
      })
    })
)

const hydrateScores = (scores, teams) => {
  if (Object.keys(scores).length === 0) return null
  return Object.keys(scores)
    .filter((teamId) => {
      if (Object.keys(scores[teamId]).length === 0) return null
      return scores[teamId].include
    })
    .map((teamId) => {
      const thisTeam = teams.find(t => parseInt(t.id) === parseInt(teamId))
      if (!thisTeam) return null
      return ({
        id: teamId,
        score: scores[teamId].score,
        name: thisTeam.org,
        orgId: thisTeam.orgId,
        avatar: thisTeam.avatar,
      })
    })
    .sort((a, b) => {
      if (b.score === a.score) {
        return a.name.localeCompare(b.name)
      }
      return b.score - a.score
    })
    .map((team, index, sortedTeams) => {
      const rank = sortedTeams.reduce((acc, them) => {
        if (them.score > team.score) return acc + 1
        return acc
      }, 1)
      return ({ ...team, rank })
    })
}


export {
  filterChallenges,
  hydrateScores,
}
