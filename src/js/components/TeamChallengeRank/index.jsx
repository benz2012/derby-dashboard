import React from 'react'

import RankScore from './RankScore'
import { RowApart } from './style'
import Block from '../Block'
import { IconLink, Ellipsis } from '../Content'
import { HeadingText2 } from '../HeadingText'
import theme from '../../styles/theme'

const TeamChallengeRank = ({ id, name, description, rank, score }) => {
  return (
    <Block>
      <RowApart>
        <HeadingText2>{name}</HeadingText2>
        <IconLink
          to={`/challenges/${id}`}
          fontSize={24}
          color={theme.buttonBG}
          style={{ marginRight: '5px' }}
        >
          open_in_browser
        </IconLink>
      </RowApart>

      <Ellipsis>{description}</Ellipsis>
      <RankScore rank={rank} score={score} />
    </Block>
  )
}

export default TeamChallengeRank
