const Webpack = require('webpack')
const path = require('path')
let {CleanWebpackPlugin} = require("clean-webpack-plugin")
module.exports = {
  mode: 'production',
  entry: {
    vendor: ['react', 'react-dom']
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8]_dll.js',
    library: '[name]_[chunkhash:8]_dll'
  },
  plugins: [
    new Webpack.DllPlugin({
      name: '[name]_[chunkhash:8]_dll',
      path: path.resolve(__dirname, 'dist', 'manifest.json')
    })
  ]
}