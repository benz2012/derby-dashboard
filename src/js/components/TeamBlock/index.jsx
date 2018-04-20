import React from 'react'

import Avatar from './Avatar'
import { TeamBlockContainer, TeamBlockLeft, TeamBlockImage,
  TeamBlockText, TeamBlockRight, TeamName, TeamSubName } from './style'

const TeamBlock = ({ left, avatar, name, subName, right, darker, tight }) => (
  <TeamBlockContainer tight={tight}>
    { left !== null && <TeamBlockLeft>{left}</TeamBlockLeft> }
    { avatar &&
      <TeamBlockImage>
        <Avatar src={avatar} />
      </TeamBlockImage>
    }
    <TeamBlockText>
      <TeamName tight={tight}>{name}</TeamName>
      <TeamSubName darker={darker}>{subName}</TeamSubName>
    </TeamBlockText>
    { right !== null && <TeamBlockRight>{right}</TeamBlockRight> }
  </TeamBlockContainer>
)

export default TeamBlock
