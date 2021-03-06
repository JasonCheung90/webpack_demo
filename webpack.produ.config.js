const path = require('path');
const Webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const produConfig = {
  mode: 'production',
  plugins: [
    new BundleAnalyzerPlugin(),
    new Webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dll', 'vendor.manifest.json'),
    }),
  ],
  optimization: {
    minimizer: [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserPlugin({
        // 使用 cache，加快二次构建速度
        cache: true,
        terserOptions: {
          comments: false,
          compress: {
            // 删除无用的代码
            unused: true,
            // 删掉 debugger
							drop_debugger: true, // eslint-disable-line
            // 移除 console
							drop_console: false, // eslint-disable-line
            // 移除无用的代码
							dead_code: true // eslint-disable-line
          },
        },
        parallel: true, // 多线程
      }),
    ],
    concatenateModules: true, // 作用域提升
    runtimeChunk: true, // 将 runtime 移动到一个独立的文件中
    splitChunks: {
      chunks: 'all', // 三选一： "initial" | "all" | "async" (默认)
      minSize: 30000, // 最小尺寸，30K，development 下是10k，越大那么单个文件越大，chunk 数就会变少（针对于提取公共 chunk 的时候，
      // 不管再大也不会把动态加载的模块合并到初始化模块中）当这个值很大的时候就不会做公共部分的抽取了

      maxSize: 0, // 文件的最大尺寸，0为不限制，优先级：maxInitialRequest/maxAsyncRequests < maxSize < minSize
      minChunks: 1, // 默认1，被提取的一个模块至少需要在几个 chunk 中被引用，这个值越大，抽取出来的文件就越小
      maxAsyncRequests: 5, // 在做一次按需加载的时候最多有多少个异步请求，为 1 的时候就不会抽取公共 chunk 了
      maxInitialRequests: 3, // 针对一个 entry 做初始化模块分隔的时候的最大文件数，优先级高于 cacheGroup，所以为 1 的时候就不会抽取 initial common 了
      automaticNameDelimiter: '~', // 打包文件名分隔符
      name: true, // 拆分出来文件的名字，默认为 true，表示自动生成文件名，如果设置为固定的字符串那么所有的 chunk 都会被合并成一个
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 正则规则，如果符合就提取 chunk
          priority: -10, // 缓存组优先级，当一个模块可能属于多个 chunkGroup，这里是优先级
        },
        default: {
          minChunks: 2,
          priority: -20, // 优先级
          reuseExistingChunk: true, // 如果该chunk包含的modules都已经另一个被分割的chunk中存在，那么直接引用已存在的chunk，不会再重新产生一个
        },
      },
    },
  },
};

module.exports = merge( baseConfig, produConfig );
