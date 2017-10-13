import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'

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

export default class App extends Component {
  componentWillMount() {
    document.body.style.backgroundColor = '#dddddd'
  }
  render() {
    return (
      <AppStyle>
        <Router>
          <div>
            <NavBar />

            <hr />
            <Switch>
              <Route exact path="/" component={HomePage} />
              <Route path="/schedule" component={SchedulePage} />
              <Route exact path="/teams" component={TeamSelectionPage} />
              <Route path="/teams/:teamId" component={TeamPage} />
              <Route exact path="/challenges" component={ChallengesPage} />
              <Route path="/challenges/:challengeId" component={ChallengePage} />
              <Route path="/live" component={LivePage} />
              <Route path="/more" component={MorePage} />
              <Route component={NoMatch} />
            </Switch>
          </div>
        </Router>
      </AppStyle>
    )
  }
}

const AppStyle = styled.div`
  display: block;
  margin: 0;
  border: 0;
  padding: 0;
  color: black;
`
