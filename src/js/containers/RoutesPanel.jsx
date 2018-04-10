import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'

export default class RoutesPanel extends Component {
  handleLogout = () => {
    if (!window.FB) {
      console.log('FB not connected')
      return
    }
    const { statusChangeCallback } = this.props
    window.FB.logout(statusChangeCallback)
  }
  render() {
    return (
      <Page>
        <Block>
          <p>Nav Bar</p>
          <p>Side Bar</p>
          <p>Welcome to the admin panel</p>
          <p>Content</p>
          <button onClick={this.handleLogout}>Logout</button>
        </Block>
      </Page>
    )
  }
}
