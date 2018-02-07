const filterChallenges = (challenges, teamId) => {
  const scoredChallenges = challenges.filter(c => c.scores)
    .filter(c => c.scores.findIndex(s => s.teamId === teamId) !== -1)

  const filteredChallenges = []
  scoredChallenges.forEach((c) => {
    const ourScore = c.scores.find(s => s.teamId === teamId)
    const rank = c.scores.reduce((accum, theirScore) => {
      if (theirScore.score > ourScore.score) {
        // increments the accumulator if any score is bigger than our own
        return accum + 1
      }
      return accum
    }, 1)

    filteredChallenges.push({
      id: c.id,
      name: c.name,
      description: c.description,
      score: ourScore.score,
      rank,
    })
  })

  return filteredChallenges
}


export {
  filterChallenges, // eslint-disable-line
}
