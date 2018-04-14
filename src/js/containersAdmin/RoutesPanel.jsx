import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import GeneralPage from './GeneralPage'
import TeamsPage from './TeamsPage'
import FundsPage from './FundsPage'
import EventsPage from './EventsPage'
import ChallengesPage from './ChallengesPage'
import ReportsPage from './ReportsPage'

import TopNav, { NavBrand, NavDropDown } from '../componentsAdmin/TopNav'
import SideNav from '../componentsAdmin/SideNav'
import Avatar from '../components/TeamBlock/Avatar'
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
  render() {
    const { name, picture } = this.state
    const { match } = this.props
    return (
      <div>
        <TopNav brand={<NavBrand to={match.url}>Derby Dashboard Admin</NavBrand>}>
          <NavDropDown>
            <Avatar src={picture} size={25} style={{ marginRight: '7px' }} />
            {name}
          </NavDropDown>
        </TopNav>

        <div className="container-fluid">
          <div className="row">
            <SideNav
              linkData={[
                { to: `${match.url}/general`, display: 'General' },
                { to: `${match.url}/teams`, display: 'Teams' },
                { to: `${match.url}/funds`, display: 'Funds' },
                { to: `${match.url}/events`, display: 'Events' },
                { to: `${match.url}/challenges`, display: 'Challenges' },
                { to: `${match.url}/reports`, display: 'Reports' },
              ]}
            />
            <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4 mt-5">
              <Switch>
                <Redirect exact from={match.url} to={`${match.url}/general`} />
                <Route
                  path={`${match.url}/general`}
                  render={props => (
                    <GeneralPage {...props} authValues={this.props.authValues} />
                  )}
                />
                <Route
                  path={`${match.url}/teams`}
                  render={props => (
                    <TeamsPage {...props} authValues={this.props.authValues} />
                  )}
                />
                <Route
                  path={`${match.url}/funds`}
                  render={props => (
                    <FundsPage {...props} authValues={this.props.authValues} />
                  )}
                />
                <Route
                  path={`${match.url}/events`}
                  render={props => (
                    <EventsPage {...props} authValues={this.props.authValues} />
                  )}
                />
                <Route
                  path={`${match.url}/challenges`}
                  render={props => (
                    <ChallengesPage {...props} authValues={this.props.authValues} />
                  )}
                />
                <Route
                  path={`${match.url}/reports`}
                  render={props => (
                    <ReportsPage {...props} authValues={this.props.authValues} />
                  )}
                />
              </Switch>
            </main>
          </div>
        </div>
      </div>
    )
  }
}
