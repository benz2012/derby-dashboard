/* eslint import/no-extraneous-dependencies: 0 */
/* eslint global-require: 0 */

// This module allows for hot reloading using middleware for express

const webpack = require('webpack')
const historyApiFallback = require('connect-history-api-fallback')

const webpackDevConfig = require('../internals/webpack.dev.config')

// Webpack Compiler using development configuration
const compiler = webpack(webpackDevConfig)

module.exports = (app) => {
  // Dependency needed for Dev Server
  app.use(historyApiFallback({ verbose: false }))
  // Webpack Middleware
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackDevConfig.output.publicPath,
  }))
  // Hot Module Replacment Middleware
  app.use(require('webpack-hot-middleware')(compiler))
}
