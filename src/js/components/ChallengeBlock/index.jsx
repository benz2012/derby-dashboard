import React from 'react'

import RankScore from './RankScore'
import CountRaised from './CountRaised'
import { RowApart } from './style'
import Block from '../Block'
import { IconLink, Ellipsis } from '../Content'
import { HeadingText2 } from '../HeadingText'
import theme from '../../styles/theme'

const ChallengeBlock = ({ id, name, description, parent, bottom }) => (
  <Block>
    <RowApart>
      <HeadingText2>{name}</HeadingText2>
      <IconLink
        to={`/${parent}/${id}`}
        fontSize={24}
        color={theme.buttonBG}
        style={{ marginRight: '5px', transform: 'rotate(90deg)' }}
      >
        open_in_browser
      </IconLink>
    </RowApart>
    <Ellipsis>{description}</Ellipsis>
    {bottom}
  </Block>
)

const TeamChallengeBlock = ({ rank, score, ...rest }) => (
  <ChallengeBlock
    parent="challenges"
    bottom={
      <RankScore rank={rank} score={score} />
    }
    {...rest}
  />
)

const AlumniChallengeBlock = ({ count, countName, raised, ...rest }) => (
  <ChallengeBlock
    parent="alumni/challenges"
    bottom={
      <CountRaised count={count} countName={countName} raised={raised} />
    }
    {...rest}
  />
)

export {
  TeamChallengeBlock,
  AlumniChallengeBlock,
}
