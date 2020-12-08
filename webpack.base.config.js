const path = require('path')
const HtmlWebpakPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
module.exports = {
  entry: {
    index: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name]_[hash:8]_bunder.js',
    chunkFilename: 'js/[name]_[chunkhash:8].js',
  },
  // resolve: {
  //   extensions: ['js','jsx']
  // },
  plugins: [
    new HtmlWebpakPlugin({
      filename: 'index.html',
      template: './src/index.html',
      // hash: true
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name]_[contenthash:8].css',
      chunkFilename: 'css/[name]_[contenthash:8].css',
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve('./dll/vendor_707737c4_dll.js'),
    }),
  ],
  module: {
    noParse: /jquery|lodash/,
    rules: [{
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: path.resolve(__dirname, 'node_modules'),
        use: ['babel-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 3 * 1024,
            name: '[name]-[hash:5].[ext]',
            outputPath: 'images/',
            publicPath: '../images',
          },
        }, ],
      },
    ],
  },
}