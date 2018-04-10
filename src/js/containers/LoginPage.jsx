import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import FacebookButton from '../components/Button/FacebookButton'
import HeadingText from '../components/HeadingText'

export default class LoginPage extends Component {
  facebookLogin = () => {
    if (!window.FB) {
      console.log('FB not connected')
      return
    }
    const { statusChangeCallback } = this.props
    window.FB.getLoginStatus((response) => {
      if (response.status !== 'connected') {
        window.FB.login(statusChangeCallback, { scope: 'public_profile' })
      } else {
        window.location.reload() // user is actually logged in, reload
      }
    })
  }
  render() {
    return (
      <Page>
        <Block>
          <HeadingText>Derby Dashboard Admin Panel</HeadingText>
          <FacebookButton
            onClick={this.facebookLogin}
            primary
          >
            Login with Facebook
          </FacebookButton>
        </Block>
      </Page>
    )
  }
}
