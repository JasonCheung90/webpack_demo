let path = require("path")
let HtmlWebpakPlugin = require("html-webpack-plugin")
let MiniCssExtractPlugin = require('mini-css-extract-plugin')
let {CleanWebpackPlugin} = require("clean-webpack-plugin")

module.exports = {
  entry: {
		index: "./src/index.js"
	},
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name]_[hash:8]_bunder.js",
		chunkFilename: "js/[name]_[chunkhash:8].js"
  },
  // resolve: {
  //   extensions: ['js','jsx','json']
  // },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpakPlugin({
      filename: "index.html",
      template: "./src/index.html",
      //hash: true
    }),
    new MiniCssExtractPlugin({
      filename:"css/[name]_[contenthash:8].css",
			chunkFilename: "css/[name]_[contenthash:6].css"
    })
  ],
  module: {
    noParse: /jquery|lodash/,
    rules: [
      { test: /\.css$/, 
        use:[
          MiniCssExtractPlugin.loader ,
          "css-loader",
          "postcss-loader"
        ]
      },
      {
        test:/\.js$/,
        include: path.resolve(__dirname, 'src'),
        exclude:path.resolve(__dirname, 'node_modules'),
        use:["babel-loader"]
      },
      {
        test:/\.(png|jpg|jpeg|gif|ico)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 3*1024,
              name:'[name]-[hash:5].[ext]',
              outputPath: "images/",
              publicPath: "../images"
            }
          }
        ]
      }
    ]
  }
}