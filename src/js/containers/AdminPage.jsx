import React, { Component } from 'react'

import Page from '../components/Page'
import Block from '../components/Block'

export default class LoginPage extends Component {
  componentDidMount() {
    console.log('admin page')
  }
  render() {
    return (
      <Page>
        <Block>
          Welcome to the admin page ben
        </Block>
      </Page>
    )
  }
}
