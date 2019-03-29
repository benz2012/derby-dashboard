import React, { Fragment } from 'react'
import { Route, Switch } from 'react-router-dom'

import AlumniChallengesPage from './AlumniChallengesPage'
import AlumniChallengePage from './AlumniChallengePage'
import ChallengePage from './ChallengePage'
import ChallengesPage from './ChallengesPage'
import HomePage from './HomePage'
import LivePage from './LivePage'
import MorePage from './MorePage'
import ReportsPage from './ReportsPage'
import SchedulePage from './SchedulePage'
import TeamPage from './TeamPage'
import TeamSelectionPage from './TeamSelectionPage'

import AlertBar from '../components/AlertBar'
import NavBar from '../components/NavBar'
import NoMatch from '../components/NoMatch'

const RoutesPublic = () => (
  <Fragment>
    <NavBar
      linkData={[
        { to: '/', display: 'Home', exact: true },
        { to: '/schedule', display: 'Schedule' },
        { to: '/teams', display: 'My Team' },
        { to: '/challenges', display: 'Challenges' },
        { to: '/live', display: 'Live' },
        { to: '/more', display: 'More' },
      ]}
    />
    <AlertBar />
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/schedule" component={SchedulePage} />
      <Route exact path="/teams" component={TeamSelectionPage} />
      <Route path="/teams/:teamId" component={TeamPage} />
      <Route exact path="/challenges" component={ChallengesPage} />
      <Route path="/challenges/:challengeId" component={ChallengePage} />
      <Route exact path="/alumni" component={AlumniChallengesPage} />
      <Route path="/alumni/challenges/:challengeId" component={AlumniChallengePage} />
      <Route path="/reports/:date" component={ReportsPage} />
      <Route exact path="/live" component={LivePage} />
      <Route exact path="/more" component={MorePage} />
      <Route component={NoMatch} />
    </Switch>
  </Fragment>
)

export default RoutesPublic
