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
import MobileMenu from '../componentsAdmin/MobileMenu'
import Avatar from '../components/TeamBlock/Avatar'
import NoMatch from '../components/NoMatch'
import authGroups from '../util/authGroups'
import { loadBootstrapCSS } from '../styles/app'
import { showWhenSmall } from '../componentsAdmin/styleUtils'

export default class RoutesPanel extends Component {
  state = {
    name: null,
    picture: null,
    menu: false,
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

  toggleMenu = () => this.setState((prev) => ({ menu: !prev.menu }))

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

  componentFactory = (route, ToRender) => {
    const { match, authValues } = this.props
    return ({
      [route]: (
        <Route
          key={route}
          path={`${match.url}/${route}`}
          render={props => (
            <ToRender {...props} authValues={authValues} />
          )}
        />
      ),
    })
  }

  componentForRoute = (route) => {
    const components = {
      ...this.componentFactory('general', GeneralPage),
      ...this.componentFactory('teams', TeamsPage),
      ...this.componentFactory('funds', FundsPage),
      ...this.componentFactory('events', EventsPage),
      ...this.componentFactory('challenges', ChallengesPage),
      ...this.componentFactory('reports', ReportsPage),
      ...this.componentFactory('alumni', AlumniPage),
      ...this.componentFactory('alumni-challenges', AlumniChallengesPage),
    }
    return components[route]
  }

  render() {
    const { name, picture, menu } = this.state
    const { match, authValues } = this.props
    const { group } = authValues()
    const SmallDiv = showWhenSmall('div')
    const linkData = authGroups[group].map(route => this.linkDataForRoute(route, match))
    return (
      <div>
        <TopNav
          toggleMenu={this.toggleMenu}
          brand={<NavBrand to={match.url}>Derby Dashboard Admin</NavBrand>}
        >
          <NavButton to="/">Public Site</NavButton>
          <NavDropDown>
            <Avatar src={picture} size={25} style={{ marginRight: '7px' }} />
            {name}
          </NavDropDown>
        </TopNav>

        {menu &&
          <MobileMenu
            toggleMenu={this.toggleMenu}
            linkData={linkData}
          />
        }

        <div className="container-fluid">
          <div className="row">
            <SideNav linkData={linkData} />
            <SmallDiv style={{ width: '100%', marginTop: '30px' }} />
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
