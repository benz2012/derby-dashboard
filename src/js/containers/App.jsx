import React, { Component } from 'react'
import ReactGA from 'react-ga'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import ChallengePage from './ChallengePage'
import ChallengesPage from './ChallengesPage'
import HomePage from './HomePage'
import LivePage from './LivePage'
import MorePage from './MorePage'
import SchedulePage from './SchedulePage'
import TeamPage from './TeamPage'
import TeamSelectionPage from './TeamSelectionPage'

import { AppStyle, BodyStyle } from '../styles/app'
import theme from '../styles/theme'
import NavBar from '../components/NavBar'
import NoMatch from '../components/NoMatch'
import { logPageView } from '../util/analytics'
import { removeTrailingSlash } from '../util/string'

export default class App extends Component {
  componentWillMount() {
    ReactGA.initialize('UA-108915943-1')
    document.documentElement.style.height = '100%'
    Object.keys(BodyStyle).forEach((attr) => {
      document.body.style[attr] = BodyStyle[attr]
    })
  }
  render() {
    return (
      <Router>
        <ThemeProvider theme={theme}>
          <AppStyle>
            <Route component={removeTrailingSlash} />
            <Route component={logPageView} />
            <NavBar linkData={[
              { to: '/', display: 'Home', exact: true },
              { to: '/schedule', display: 'Schedule' },
              { to: '/teams', display: 'My Team' },
              { to: '/challenges', display: 'Challenges' },
              { to: '/live', display: 'Live' },
              { to: '/more', display: 'More' },
            ]} />
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/schedule" component={SchedulePage} />
              <Route exact path="/teams" component={TeamSelectionPage} />
              <Route path="/teams/:teamId" component={TeamPage} />
              <Route exact path="/challenges" component={ChallengesPage} />
              <Route path="/challenges/:challengeId" component={ChallengePage} />
              <Route exact path="/live" component={LivePage} />
              <Route exact path="/more" component={MorePage} />
              <Route component={NoMatch} />
            </Switch>
          </AppStyle>
        </ThemeProvider>
      </Router>
    )
  }
}
