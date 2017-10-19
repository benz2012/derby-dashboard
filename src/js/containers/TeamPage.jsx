import React, { Component } from 'react'

import Page from '../components/Page'

export default class TeamPage extends Component {
  componentDidMount() {
    console.log('TeamPage is mounted')
  }
  render() {
    const { match } = this.props
    return (
      <Page>
        <h1>TeamPage for team {match.params.teamId}</h1>
      </Page>
    )
  }
}
