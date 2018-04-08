import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import AdminPage from './AdminPage'
import LoginPage from './LoginPage'

import NoMatch from '../components/NoMatch'

export default class RoutesAdmin extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/admin" component={AdminPage} />
        <Route exact path="/admin/login" component={LoginPage} />
        <Route component={NoMatch} />
      </Switch>
    )
  }
}
