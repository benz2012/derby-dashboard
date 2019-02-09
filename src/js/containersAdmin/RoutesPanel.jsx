import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import GeneralPage from './GeneralPage'
import TeamsPage from './TeamsPage'
import FundsPage from './FundsPage'
import EventsPage from './EventsPage'
import ChallengesPage from './ChallengesPage'
import ReportsPage from './ReportsPage'
import AlumniPage from './AlumniPage'
import AlumniChallengesPage from './AlumniChallengesPage'

import TopNav, { NavBrand, NavDropDown, NavButton } from '../componentsAdmin/TopNav'
import SideNav from '../componentsAdmin/SideNav'
import Avatar from '../components/TeamBlock/Avatar'
import NoMatch from '../components/NoMatch'
import authGroups from '../util/authGroups'
import { loadBootstrapCSS } from '../styles/app'

export default class RoutesPanel extends Component {
  state = {
    name: null,
    picture: null,
  }

  componentWillMount() {
    loadBootstrapCSS() // prevents the public site from needing to load it
    const { uid } = this.props.authValues()
    window.FB.api(`/${uid}?fields=id,name,picture`, 'GET', {}, (res) => {
      this.setState({
        name: res.name,
        picture: res.picture.data.url,
      })
    })
  }

  handleLogout = () => {
    if (!window.FB) return
    const { statusChangeCallback } = this.props
    window.FB.logout(statusChangeCallback)
  }

  linkDataForRoute = (route, match) => {
    const linkData = {
      general: { to: `${match.url}/general`, display: 'General' },
      teams: { to: `${match.url}/teams`, display: 'Teams' },
      funds: { to: `${match.url}/funds`, display: 'Funds' },
      events: { to: `${match.url}/events`, display: 'Events' },
      challenges: { to: `${match.url}/challenges`, display: 'Challenges' },
      reports: { to: `${match.url}/reports`, display: 'Reports' },
      alumni: { to: `${match.url}/alumni`, display: 'Alumni' },
      'alumni-challenges': { to: `${match.url}/alumni-challenges`, display: 'Alumni Challenges' },
    }
    return linkData[route]
  }

  componentForRoute = (route, match, authValues) => {
    const components = {
      general: (
        <Route
          key={route}
          path={`${match.url}/general`}
          render={props => (
            <GeneralPage {...props} authValues={authValues} />
          )}
        />
      ),
      teams: (
        <Route
          key={route}
          path={`${match.url}/teams`}
          render={props => (
            <TeamsPage {...props} authValues={authValues} />
          )}
        />
      ),
      funds: (
        <Route
          key={route}
          path={`${match.url}/funds`}
          render={props => (
            <FundsPage {...props} authValues={authValues} />
          )}
        />
      ),
      events: (
        <Route
          key={route}
          path={`${match.url}/events`}
          render={props => (
            <EventsPage {...props} authValues={authValues} />
          )}
        />
      ),
      challenges: (
        <Route
          key={route}
          path={`${match.url}/challenges`}
          render={props => (
            <ChallengesPage {...props} authValues={authValues} />
          )}
        />
      ),
      reports: (
        <Route
          key={route}
          path={`${match.url}/reports`}
          render={props => (
            <ReportsPage {...props} authValues={authValues} />
          )}
        />
      ),
      alumni: (
        <Route
          key={route}
          path={`${match.url}/alumni`}
          render={props => (
            <AlumniPage {...props} authValues={authValues} />
          )}
        />
      ),
      'alumni-challenges': (
        <Route
          key={route}
          path={`${match.url}/alumni-challenges`}
          render={props => (
            <AlumniChallengesPage {...props} authValues={authValues} />
          )}
        />
      ),
    }
    return components[route]
  }

  render() {
    const { name, picture } = this.state
    const { match, authValues } = this.props
    const { group } = authValues()
    return (
      <div>
        <TopNav brand={<NavBrand to={match.url}>Derby Dashboard Admin</NavBrand>}>
          <NavButton to="/">Public Site</NavButton>
          <NavDropDown>
            <Avatar src={picture} size={25} style={{ marginRight: '7px' }} />
            {name}
          </NavDropDown>
        </TopNav>

        <div className="container-fluid">
          <div className="row">
            <SideNav
              linkData={
                authGroups[group].map(route => this.linkDataForRoute(route, match))
              }
            />
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4 mt-5">
              <Switch>
                <Redirect exact from={match.url} to={`${match.url}/${authGroups[group][0]}`} />
                {authGroups[group].map(
                  route => this.componentForRoute(route, match, authValues)
                )}
                <Route component={NoMatch} />
              </Switch>
            </main>
          </div>
        </div>
      </div>
    )
  }
}
