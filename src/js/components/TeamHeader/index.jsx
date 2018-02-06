import React, { Component } from 'react'
import Clipboard from 'clipboard'

import Block from '../Block'
import MediumButton from '../Button/MediumButton'
import Avatar from '../TeamBlock/Avatar'
import { TeamBlockContainer } from '../TeamBlock/style'
import { CopySuccess, CopyFailure } from '../Copy'
import { Container, Buttons, CoverImage,
  TeamBlockText, TeamName, TeamSubName } from './style'

export default class TeamHeader extends Component {
  state = {
    success: false,
    failure: false,
  }
  componentDidMount() {
    this.clipboard = new Clipboard(this.shareButton, {
      text: () => window.location.href,
    })
    this.clipboard.on('success', this.successfulCopy)
    this.clipboard.on('error', this.failedCopy)
  }
  componentWillUnmount() {
    this.clipboard.destroy()
  }
  handleDonateClick = () => {
    window.open(this.props.url, '_blank')
  }
  successfulCopy = () => {
    this.setState({ success: true });
    setTimeout(() => {
      this.setState({ success: false });
    }, 3000)
  }
  failedCopy = () => {
    this.setState({ failure: true });
    setTimeout(() => {
      this.setState({ failure: false });
    }, 3000)
  }
  render() {
    const { org, orgId, avatar, cover } = this.props
    const { success, failure } = this.state
    return (
      <Container>
        {success && <CopySuccess />}
        {failure && <CopyFailure />}

        <CoverImage src={cover} />

        <Block>
          <TeamBlockContainer>
            <Avatar src={avatar} size={50} />
            <TeamBlockText>
              <TeamName>{org}</TeamName>
              <TeamSubName>{orgId}</TeamSubName>
            </TeamBlockText>
          </TeamBlockContainer>

          <Buttons>
            <MediumButton onClick={this.handleDonateClick} primary>
              Donate
            </MediumButton>
            <MediumButton innerRef={(el) => { this.shareButton = el }}>
              Share
            </MediumButton>
          </Buttons>
        </Block>
      </Container>
    )
  }
}
