/* eslint import/first: 0 */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

// Load Polyfills
import Promise from 'promise-polyfill'
import 'whatwg-fetch'

if (!window.Promise) {
  window.Promise = Promise
}

// Load Extraneous Assets
import '../assets/favicons/favicons' // all favicons
import '../assets/images/og_image_v001.png'

// Root Application Container
import App from './containers/App'

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
