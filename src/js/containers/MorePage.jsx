import React, { Component } from 'react'

import Page from '../components/Page'

export default class MorePage extends Component {
  componentDidMount() {
    console.log('MorePage is mounted')
  }
  render() {
    return (
      <Page>
        <h1>MorePage</h1>
      </Page>
    )
  }
}
