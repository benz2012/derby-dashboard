import React from 'react'

import Avatar from './Avatar'
import { TeamBlockContainer, TeamBlockLeft, TeamBlockImage,
  TeamBlockText, TeamBlockRight, TeamName, TeamSubName } from './style'

const TeamBlock = ({ left, avatar, name, subName, right }) => (
  <TeamBlockContainer>
    <TeamBlockLeft>{left}</TeamBlockLeft>
    <TeamBlockImage>
      <Avatar src={avatar} />
    </TeamBlockImage>
    <TeamBlockText>
      <TeamName>{name}</TeamName>
      <TeamSubName>{subName}</TeamSubName>
    </TeamBlockText>
    <TeamBlockRight>{right}</TeamBlockRight>
  </TeamBlockContainer>
)

export default TeamBlock
