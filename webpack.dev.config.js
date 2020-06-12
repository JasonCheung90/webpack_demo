const path = require("path")
const Webpack = require("webpack")
const merge = require("webpack-merge")
const baseConfig = require("./webpack.base.config")
const devConfig = {
	mode: "development",
	devServer: {
	  port: "3000",
	  open: true,
		hot: true,
	  contentBase: path.resolve(__dirname, "dist"),
	  progress: true
	},
	plugins: [new Webpack.HotModuleReplacementPlugin()],
	devtool: "cheap-module-eval-source-map"
}

module.exports = merge(baseConfig, devConfig)