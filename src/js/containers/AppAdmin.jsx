import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import LoginPage from './LoginPage'

import { AppStyle, BodyStyle } from '../styles/app'
import theme from '../styles/theme'
import NoMatch from '../components/NoMatch'
import { removeTrailingSlash } from '../util/string'

export default class AdminApp extends Component {
  componentWillMount() {
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
            <LoginPage />
            {/* <Route component={removeTrailingSlash} /> */}
            {/* <Switch> */}
              {/* <Route exact path="/admin" component={LoginPage} /> */}
              {/* <Route component={NoMatch} /> */}
            {/* </Switch> */}
          </AppStyle>
        </ThemeProvider>
      </Router>
    )
  }
}
