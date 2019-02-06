import React, { Component } from 'react'
import ReactGA from 'react-ga'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import RoutesPublic from './RoutesPublic'
import RoutesAdmin from '../containersAdmin/RoutesAdmin'

import { AppStyle, BodyStyle } from '../styles/app'
import theme from '../styles/theme'
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
            <Switch>
              <Route path="/admin" component={RoutesAdmin} />
              <Route component={RoutesPublic} />
            </Switch>
          </AppStyle>
        </ThemeProvider>
      </Router>
    )
  }
}
