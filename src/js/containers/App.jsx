/* eslint react/no-multi-comp: 0 */
/* eslint react/prop-types: 0 */
/* eslint import/newline-after-import: 0 */
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect, Switch } from 'react-router-dom'
import styled from 'styled-components'

import LivePage from './LivePage'

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)
const Event = ({ match }) => (
  <div>
    <h4>Viewing EventId: {match.params.eventId}</h4>
  </div>
)
const Day = ({ match }) => (
  <div>
    <h3>Viewing Date: {match.params.dateString}</h3>
    <li><Link to={`${match.url}/1`}>Event 1</Link></li>
    <li><Link to={`${match.url}/2`}>Event 2</Link></li>
    <li><Link to={`${match.url}/3`}>Event 3</Link></li>
    <hr />
    <Route path={`${match.url}/:eventId`} component={Event} />
  </div>
)
const dates = ['2017-10-01', '2017-10-02', '2017-10-03', '2017-10-04', '2017-10-05', '2017-10-06']
const Schedule = ({ match }) => (
  <div>
    <h2>Schedule</h2>
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
  </div>
)
const Team = ({ match }) => (
  <div>
    <h3>Team: {match.params.teamId}</h3>
  </div>
)
const TeamSelection = ({ match }) => (
  <div>
    <h2>Team Selection</h2>
    <ul>
      <li><Link to={`${match.url}/3502`}>Sigma Chi</Link></li>
      <li><Link to={`${match.url}/111115`}>Alpha Xi Delta</Link></li>
      <li><Link to={`${match.url}/111116`}>Alpha Sigma Alpha</Link></li>
      <li><Link to={`${match.url}/111117`}>Delta Phi Epsilon</Link></li>
      <li><Link to={`${match.url}/111118`}>Zeta Tau Alpha</Link></li>
      <li><Link to={`${match.url}/111119`}>Sigma Sigma Sigma</Link></li>
    </ul>
  </div>
)
const Challenge = ({ match }) => (
  <div>
    <h4>Viewing Challenge: {match.params.challengeId}</h4>
    <ul>
      <li><Link to={`${match.url}/event/5`}>Linked Event</Link></li>
    </ul>
    <hr />
    <Route path={`${match.url}/event/:eventId`} component={Event} />
  </div>
)
const Challenges = ({ match }) => (
  <div>
    <h2>Challenges</h2>
    <ul>
      <li><Link to={`${match.url}/1`}>Challenge 1</Link></li>
      <li><Link to={`${match.url}/2`}>Challenge 2</Link></li>
      <li><Link to={`${match.url}/3`}>Challenge 3</Link></li>
    </ul>
  </div>
)
const More = () => (
  <div>
    <h2>More</h2>
  </div>
)
const NoMatch = () => (
  <div>
    <h2>404 Not Found :(</h2>
  </div>
)


export default class App extends Component {
  componentWillMount() {
    document.body.style.backgroundColor = '#dddddd'
  }
  render() {
    return (
      <AppStyle>
        <Router>
          <div>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/schedule">Schedule</Link></li>
              <li><Link to="/teams">My Team</Link></li>
              <li><Link to="/challenges">Challenges</Link></li>
              <li><Link to="/live">Live</Link></li>
              <li><Link to="/more">More</Link></li>
            </ul>

            <hr />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/schedule" component={Schedule} />
              <Route exact path="/teams" component={TeamSelection} />
              <Route path="/teams/:teamId" component={Team} />
              <Route exact path="/challenges" component={Challenges} />
              <Route path="/challenges/:challengeId" component={Challenge} />
              <Route path="/live" component={LivePage} />
              <Route path="/more" component={More} />
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
