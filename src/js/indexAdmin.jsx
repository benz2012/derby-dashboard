/* eslint import/first: 0 */
import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'

// Load Polyfills
import Promise from 'promise-polyfill'
import 'whatwg-fetch'
import './util/polyfill'

if (!window.Promise) {
  window.Promise = Promise
}

// Load Extraneous Assets
import '../assets/favicons/favicons' // all favicons
import '../assets/images/og_image_v001.png'

// Root Application Container
import AppAdmin from './containers/AppAdmin'

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
render(AppAdmin)

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./containers/AppAdmin', () => { render(AppAdmin) })
}
