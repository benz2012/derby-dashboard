import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'
import MediumFullButton from '../components/Button/MediumFullButton'

export default class LoginPage extends Component {
  componentDidMount() {
    console.log('login page')
  }
  handleLogin = () => {
    window.location.href = '/admin/login'
  }
  render() {
    return (
      <Page>
        <Block>
          <MediumFullButton onClick={this.handleLogin} primary>
            Login with Facebook
          </MediumFullButton>
        </Block>
      </Page>
    )
  }
}


// #4267b2
