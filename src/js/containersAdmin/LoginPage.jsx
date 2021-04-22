import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import FacebookButton from '../components/Button/FacebookButton'
import HeadingText from '../components/HeadingText'

const getIsMobile = () => {
  let isMobile = false
  try {
    isMobile = window.navigator && window.navigator.userAgent && /Mobi/i.test(window.navigator.userAgent)
  } catch (ex) {
    // continue regardless of error
  }
  return isMobile
};

export default class LoginPage extends Component {
  state = {
    isMobile: getIsMobile(),
  }

  facebookLogin = () => {
    if (!window.FB) {
      console.log('FB not connected')
      return
    }
    const { statusChangeCallback, invokeLoginDialogURL } = this.props
    window.FB.getLoginStatus((response) => {
      if (response.status !== 'connected') {
        if (this.state.isMobile) {
          window.location.href = invokeLoginDialogURL()
        }

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
