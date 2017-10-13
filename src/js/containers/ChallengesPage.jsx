import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ChallengesPage extends Component {
  componentDidMount() {
    console.log('ChallengesPage is mounted')
  }
  render() {
    const { match } = this.props
    return (
      <div>
        <h1>ChallengesPage</h1>
        <ul>
          <li><Link to={`${match.url}/1`}>Challenge 1</Link></li>
          <li><Link to={`${match.url}/2`}>Challenge 2</Link></li>
          <li><Link to={`${match.url}/3`}>Challenge 3</Link></li>
        </ul>
      </div>
    )
  }
}
