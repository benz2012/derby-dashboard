/* eslint import/no-extraneous-dependencies: 0 */
/* eslint global-require: 0 */

// This module allows for hot reloading using middleware for express

const webpack = require('webpack')

const webpackConfig = require('../internals/webpack.dev.config')

// Webpack Compiler using development configuration
const compiler = webpack(webpackConfig)

module.exports = (app) => {
  // Webpack Middleware
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
  }))

  // Hot Module Replacment Middleware
  app.use(require('webpack-hot-middleware')(compiler))
}
