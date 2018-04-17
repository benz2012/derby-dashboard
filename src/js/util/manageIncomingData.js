const filterChallenges = (challenges, teamId) => {
  const filteredChallenges = challenges.filter(c => (
    (Object.keys(c.scores).length > 0) &&
    (c.public === true) &&
    (Object.keys(c.scores[teamId]).length > 0) &&
    (c.scores[teamId].include === true)
  )).map((c) => {
    const ourScore = c.scores[teamId].score
    const rank = Object.keys(c.scores)
      .filter(tid => (
        (parseInt(tid) !== parseInt(teamId)) &&
        (c.scores[tid].include === true)
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
  return filteredChallenges
}

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
      const teamName = thisTeam.org
      return ({ id: teamId, score: scores[teamId].score, name: teamName })
    })
    .sort((a, b) => (b.score - a.score))
}


export {
  filterChallenges,
  hydrateScores,
}
