import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import Page from '../components/Page'

export default class TeamSelectionPage extends Component {
  componentDidMount() {
    console.log('TeamSelectionPage is mounted')
  }
  render() {
    const { match } = this.props
    return (
      <Page>
        <h1>TeamSelectionPage</h1>
        <ul>
          <li><Link to={`${match.url}/3502`}>Sigma Chi</Link></li>
          <li><Link to={`${match.url}/111115`}>Alpha Xi Delta</Link></li>
          <li><Link to={`${match.url}/111116`}>Alpha Sigma Alpha</Link></li>
          <li><Link to={`${match.url}/111117`}>Delta Phi Epsilon</Link></li>
          <li><Link to={`${match.url}/111118`}>Zeta Tau Alpha</Link></li>
          <li><Link to={`${match.url}/111119`}>Sigma Sigma Sigma</Link></li>
        </ul>
      </Page>
    )
  }
}
