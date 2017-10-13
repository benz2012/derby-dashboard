import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'

import Event from '../components/Event'

export default class ChallengePage extends Component {
  componentDidMount() {
    console.log('ChallengePage is mounted')
  }
  render() {
    const { match } = this.props
    return (
      <div>
        <h1>ChallengePage for challenge {match.params.challengeId}</h1>
        <ul>
          <li><Link to={`${match.url}/event/5`}>Linked Event</Link></li>
        </ul>
        <hr />
        <Route path={`${match.url}/event/:eventId`} component={Event} />
      </div>
    )
  }
}
