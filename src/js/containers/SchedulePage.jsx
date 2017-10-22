import React, { Component } from 'react'
import { Route, Switch, Redirect, Link } from 'react-router-dom'

import Page from '../components/Page'
import Day from '../components/Day'

export default class SchedulePage extends Component {
  state = {
    dates: ['2017-10-01', '2017-10-02', '2017-10-03', '2017-10-04', '2017-10-05', '2017-10-06'],
  }
  componentDidMount() {
    console.log('SchedulePage is mounted')
  }
  render() {
    const { dates } = this.state
    const { match } = this.props
    return (
      <Page>
        <h1>SchedulePage</h1>
        <ul>
          {dates.map(d => (
            <li key={d}><Link to={`${match.url}/${d}`}>{d}</Link></li>
          ))}
        </ul>
        <hr />
        <Switch>
          <Route path={`${match.url}/:dateString`} component={Day} />
          <Redirect from={`${match.url}`} to={`${match.url}/${dates[0]}`} />
        </Switch>
      </Page>
    )
  }
}
