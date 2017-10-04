import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader' // eslint-disable-line import/no-extraneous-dependencies

// Load Polyfills
import Promise from 'promise-polyfill'
import 'whatwg-fetch'

if (!window.Promise) {
  window.Promise = Promise
}

// Root Application Container
import App from './containers/App' // eslint-disable-line import/first


// Wrapper Function for rendering, allows HMR in development only, AppContainer
// is disabled in production.
const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('app')
  )
}

// Initial App Render
render(App)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/App', () => { render(App) })
}
