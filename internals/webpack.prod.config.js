/* eslint import/no-extraneous-dependencies: 0 */
const webpack = require('webpack')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const baseConfig = require('./webpack.base.config')

module.exports = merge(baseConfig, {
  output: {
    filename: '[name].[chunkhash].js',
    hashDigestLength: 8,
  },
  devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin(['public'], {
      root: process.cwd(),
    }),
    new UglifyJsPlugin({
      sourceMap: true,
      warningsFilter: src => true, // eslint-disable-line no-unused-vars
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'), // eslint-disable-line quote-props
      },
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => /node_modules/.test(resource),
    }),
    new webpack.optimize.CommonsChunkPlugin({ name: 'runtime' }),
  ],
})
