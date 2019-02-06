import React from 'react'

import TeamBlock from '../TeamBlock'
import { Ranking, RightPad, Score } from '../Content'
import { BlockNoPad } from './style'

const Leaderboard = ({ scores, simple }) => {
  const Container = ({ children }) => (
    simple ? <div>{children}</div> : <BlockNoPad>{children}</BlockNoPad>
  )
  const colorLight = rank => (simple ? 'inherit' : `hsl(167, 74%, ${rank > 5 ? 100 : 84 + (4 * rank)}%)`)
  const blockStyle = rank => (simple ? {} : { backgroundColor: colorLight(rank), padding: '0px 10px' })
  const score = num => (simple ? num : <RightPad><Score>{num}</Score></RightPad>)
  const scoreBlocks = scores.map((team, index) => {
    const block = simple ? (
      <TeamBlock
        name={team.name}
        left={<Ranking>{index + 1}</Ranking>}
        right={score(team.score)}
        tight
      />
    ) : (
      <TeamBlock
        avatar={team.avatar}
        name={team.name}
        subName={team.orgId}
        left={<Ranking darker>{index + 1}</Ranking>}
        right={score(team.score)}
        darker
      />
    )
    return (
      <div key={team.id} style={blockStyle(index)}>
        {block}
      </div>
    )
  })
  return (
    <Container>
      {scoreBlocks}
    </Container>
  )
}

export default Leaderboard
