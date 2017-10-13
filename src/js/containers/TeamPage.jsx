import React, { Component } from 'react'

export default class TeamPage extends Component {
  componentDidMount() {
    console.log('TeamPage is mounted')
  }
  render() {
    const { match } = this.props
    return (
      <div>
        <h1>TeamPage for team {match.params.teamId}</h1>
      </div>
    )
  }
}
