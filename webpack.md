# webapck4教程

## 核心概念

1. entry     --- 入口
2. output    --- 出口
   * chunkFilename 非入口(non-entry) chunk 文件的名称
3. loader    --- 转换器
4. plugins   --- 插件
5. mode      --- 模式
6. devServer --- 服务器
7. resolve   --- 解析

## 编译es6

 Babel 的插件分为两类：转换插件和语法解析插件：

 1. babel-loader        ---         负责es6语法转化，比如：箭头函数
 2. babel-preset-env    ---         包含es6、7、8等版本的语法转化规则
 3. babel-plugin-transform-runtime --- 避免polyfill污染全局变量 最好使用这个
 4. babel-polyfill      ---         全局使用es6内置方法和函数转化垫片 负责内置方法>和函数 比如 new Set()

## 多页面的公共代码提取

    optimization: {
        splitChunks: {
            cacheGroups: {
                common: {
                    name:'common',
                    chunks:'all', // 有三个选项 initial async
                    minChunks:1,  //打包前最少有几个共享模块
                    minSize:2,    //打包后模块的最细大小
                    priority:0,   //打包的优先级，数字越大，打包顺序越前
                }，

                vendor: {
                    name:'vendor',
                    test:'/[\\/]node_modules[\\/]/'，
                    chunks:'all',
                    priority:10
                }
            }
        }
    }

## 单页面的代码分割和懒加载

1. import().then()      --  返回一个promise对象  推荐使1
2. require.ensure()

    import(/*webpackChunkName:'subA'*/ './subA')
    .then(res => console.log(res))

## 处理css

1. 优化压缩JS terser-webpack-plugin

    new TerserPlugin({
    // 使用 cache，加快二次构建速度
        cache: true,
        parallel: true   // 多线程
        terserOptions: {
            comments: false,
            compress: {
                // 删除无用的代码
                unused: true,
                // 删掉 debugger
                drop_debugger: true, // eslint-disable-line
                // 移除 console
                drop_console: true, // eslint-disable-line
                // 移除无用的代码
                dead_code: true // eslint-disable-line
            }
        }
    })
2. 将css代码抽离压缩 处理未来的css

    use:[
        MiniCssExtractPlugin.loader,
        {
            loader:'css-loader',
        },
        {
            loader:'postcss-loader',
            options: {
                ident:'postcss',
                plugins:[
                    require('postcss-cssnext')(),
                    require('cssnano')(),
                ]
            }
        }
    ]

3. 将css代码从index.bundle.js提取出来

    plugins: [
            new MiniCssExtractPlugin({
                filename:'[name]_[contenthash:8].css',
            })
        ]

4. 压缩css  ---    npm i optimize-css-assets-webpack-plugin -D
    optimization: {
        minimizer: [ new OptimizeCSSAssetsPlugin()],
    },
    plugins: [
            new MiniCssExtractPlugin({
                name:'[name].css',
                chunkFilename:'[id].css'
            }),
            new PurifyCssPlugin(
                {
                    paths:glob.sync(path.join(__dirname , './dist/*.html'))
                }
            )
        ]

5. url-loader  --- file-loader  --- 处理图片

    {
        test:/\.(jpe?g|png|gif|svg)$/i,
        use:[
            {
                loader:'url-loader',
                options: {
                    limit:5000,
                    name:'[name]-[hash:5].[ext]',
                    outputPath:'dist/',
                    useRelativePath:true
                }
            },
        ]
    }

6. postcss-sprites  ---   生成雪碧图
    {
        loader:'postcss-loader',
        options: {
            ident:'postcss',
            plugins:[
                require('postcss-cssnext')(),
                require('cssnano')(),
                require('postcss-sprites')({
                    spritePath:'/dist/assets/imgs/sprites',
                    retina: true  // 移动端retina屏幕处理 图片命名需要改写成a@2x.jpg
                })
            ]
        }
    }

7. file-loader --- 打包字体
    {
        test:/\.(woff|woff2|eot|ttf|otf)$/,
        use:[
            {
                loader:'file-loader',
                options: {
                    name:'[name].[ext]',
                    outputPath:'dist/',
                    useRelativePath:true
                }
            }
        ]
    }

8. 使用webpack内置插件处理第三方库
    plugins:[
        new webpack.ProvidePlugin({
                $:'jquery',
            })
    ]

9. 使用 CleanWebpackPlugin HtmlWebpackPlugin 自动生成html

    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
                filename:'index.html',
                title:'new output',
                template:'./src/index.html',
                minify: {
                    collapseWhitespace: true
                }
            })

10. 使用html-loader 引入图片
    {
        test:/\.html$/,
        use:[
            {
                loader:'html-loader',
                /*options: {
                    attrs:['img:src'],
}*/
            }
        ]
    }

11. webpack --profile --json > stats.json 生成结果分析文件
     在 <http://webpack.github.io/analyse/> 里面查看

12. webpack-bundle-analyzer  --第三方打包结果分析

    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

    plugins:[
        new BundleAnalyzerPlugin()
    ]
13. 设置服务器

    new webpack.HotModuleReplacementPlugin(),

    devServer: {
            port: 8888,
            hot: true,

            /* proxy: {
                'api': {
                    target:'',
                    pathRewirte: {
                        '^api': ''
                    }
                }
            } */
    },
    devtool:'source-map',

14. 安装 webpack
    npm i webpack webpack-cli -D

15. 处理JS
    npm i babel-loader @babel/core @babel/preset-env @babel/plugin-transform-runtime -D

    npm i @babel/runtime

    作用域提升（Scope Hoisting）是指 webpack 通过 ES6 语法的静态分析，分析出模块之间的依赖关系，尽可能地把模块放到同一个函数中
     optimization: {
        concatenateModules: true
    }
