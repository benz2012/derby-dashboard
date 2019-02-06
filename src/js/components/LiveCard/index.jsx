import React from 'react'

import { Currency, Centered, FontIcon } from '../Content'
import { HalfCard } from '../Card'
import { RaisedContainer, NameContainer, TeamName,
  TeamSubName, CheerContainer } from './style'
import theme from '../../styles/theme'

const LiveCard = ({ id, raised, org, orgId, selected, onClick, cheering, showGraphs }) => (
  <HalfCard id={id} selected={selected} onClick={onClick}>
    <RaisedContainer>
      <Centered>
        <Currency fontSize={showGraphs ? 16 : 26}>{raised}</Currency>
      </Centered>
    </RaisedContainer>

    <NameContainer>
      <Centered>
        <TeamName>{org}</TeamName>
        <TeamSubName>{orgId}</TeamSubName>
      </Centered>
    </NameContainer>

    {
      cheering > 0 &&
      <CheerContainer>
        <FontIcon className="material-icons" color={theme['Team Activity']}>
          whatshot
        </FontIcon>
        {cheering} cheering
      </CheerContainer>
    }

  </HalfCard>
)

export default LiveCard
