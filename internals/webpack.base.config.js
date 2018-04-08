/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: path.resolve(process.cwd(), './src/js/index'),
    admin: path.resolve(process.cwd(), './src/js/indexAdmin'),
  },
  output: {
    path: path.resolve(process.cwd(), 'public'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['env', { modules: false }], 'react'],
              plugins: ['transform-class-properties', 'transform-object-rest-spread'],
            },
          },
        ],
      },
      {
        test: /\.(png)$/,
        exclude: /favicons/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), './src/index.html'),
      inject: true,
      excludeChunks: ['admin'],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), './src/admin.html'),
      inject: true,
      filename: 'admin.html',
      excludeChunks: ['app'],
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
}
