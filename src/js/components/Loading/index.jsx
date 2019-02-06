import React, { Component } from 'react'

import { Container, Dot, WaitingText } from './style'

export default class Loading extends Component {
  state = {
    longWait: false,
  }

  componentDidMount() {
    this.timer = setTimeout(() => {
      this.setState({ longWait: true })
    }, 15000) // 15 seconds
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    return (
      <div>
        <Container>
          <Dot delay="-0.32s" />
          <Dot delay="-0.16s" />
          <Dot />
        </Container>
        {
          this.state.longWait &&
          <WaitingText>
            You&#39;ve been waiting a while. Something probably broke
            or your connection is really slow. We appologize for the
            inconvienence.
          </WaitingText>
        }
      </div>
    )
  }
}
