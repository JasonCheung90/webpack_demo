const Webpack = require('webpack')
const path = require('path')
module.exports = {
  mode: 'production',
  entry: {
    vendor: ['react', 'react-dom', 'lodash'],
  },
  output: {
    path: path.resolve(__dirname, 'dll'),
    filename: '[name]_[chunkhash:8]_dll.js',
    library: '[name]_[chunkhash:8]_dll',
  },
  plugins: [
    new Webpack.DllPlugin({
      name: '[name]_[chunkhash:8]_dll',
      path: path.resolve(__dirname, 'dll', '[name].manifest.json'),
    }),
  ],
}
