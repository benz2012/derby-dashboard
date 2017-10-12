/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const baseConfig = require('./webpack.base.config')
const mergeLoaderFirst = require('./mergeLoaderFirst')

module.exports = merge({
  customizeObject(a, b, key) {
    return mergeLoaderFirst(a, b, key)
  },
})(baseConfig, {
  entry: {
    app: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      path.resolve(process.cwd(), './src/js/index'),
    ],
  },
  output: {
    filename: 'bundle.dev.[hash].js',
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['react-hot-loader/webpack'],
      },
    ],
  },
  plugins: [
    new ProgressBarPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
})
