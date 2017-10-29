import React, { Component } from 'react'

import Avatar from './Avatar'
import { TeamBlockContainer, TeamBlockLeft, TeamBlockImage,
  TeamBlockText, TeamBlockRight, TeamName, TeamSubName } from './style'

export default class TeamBlock extends Component {
  render() {
    const { left, avatar, name, subName, right } = this.props
    return (
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
  }
}
