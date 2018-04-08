import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import ChallengePage from './ChallengePage'
import ChallengesPage from './ChallengesPage'
import HomePage from './HomePage'
import LivePage from './LivePage'
import MorePage from './MorePage'
import SchedulePage from './SchedulePage'
import TeamPage from './TeamPage'
import TeamSelectionPage from './TeamSelectionPage'

import NavBar from '../components/NavBar'
import NoMatch from '../components/NoMatch'

export default class RoutesPublic extends Component {
  render() {
    return ([
      <NavBar
        key="app-nav"
        linkData={[
          { to: '/', display: 'Home', exact: true },
          { to: '/schedule', display: 'Schedule' },
          { to: '/teams', display: 'My Team' },
          { to: '/challenges', display: 'Challenges' },
          { to: '/live', display: 'Live' },
          { to: '/more', display: 'More' },
        ]}
      />,
      <Switch key="app-switch">
        <Route exact path="/" component={HomePage} />
        <Route path="/schedule" component={SchedulePage} />
        <Route exact path="/teams" component={TeamSelectionPage} />
        <Route path="/teams/:teamId" component={TeamPage} />
        <Route exact path="/challenges" component={ChallengesPage} />
        <Route path="/challenges/:challengeId" component={ChallengePage} />
        <Route exact path="/live" component={LivePage} />
        <Route exact path="/more" component={MorePage} />
        <Route component={NoMatch} />
      </Switch>,
    ])
  }
}
