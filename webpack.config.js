// node的写法
let webpack =require('webpack')
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let MiniCssExtractPlugin = require('mini-css-extract-plugin');
let OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
let  UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    optimization : {
        minimizer:[
            new UglifyJsPlugin({
                cache:true,
                parallel:true,
                sourceMap:true
            }),
            new OptimizeCssAssetsPlugin()
        ]
    },
    devServer: {
        port: 3000,
        progress: true,
        contentBase: './build',
        compress: true,
    },
    mode: 'development',//production development
    entry: './src/index.js',
    output: {
        filename: "bundle.[hash:8].js",
        path: path.resolve(__dirname, 'build'),//路径必须是一个绝对路径 __dirname指的是当前目录下，产生一个dist的文件，
        // publicPath: "http://www.matrix.com" 加上这个之后打包后引入的文件路径前面都会带上这个地址
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
            minify: {
                removeAttributeQuotes: true,
                collapseWhitespace: true,
            },
            hash: true
        }),
        new MiniCssExtractPlugin({
            filename:'css/main.css',

        }),
        // new webpack.ProvidePlugin({ // 在每个模块之后都注入$,但是拿不到 window.$
        //     $:'jquery'
        // })
    ],
    externals:{
        $:'jquery'
    },
    module: {
        rules: [
            // { // import $ from 'expose-loader?$!jquery' 在webpack中进行配置后就不用这么写了，直接写 import $ from 'jquery'即可
            //     test:require.resolve('jquery'),//把jq暴露到全局 import $ from 'jquery'
            //     use:'expose-loader?$'
            // },
            // {
            //     test:/\.js$/,
            //     use:{
            //         loader:'eslint-loader',
            //         options: {
            //             enforce:'pre' // 在执行js之前进行代码检查校验
            //         }
            //     },
            // },
            {
                test:/\.html$/,
                use:'html-withimg-loader'
            },
            {
               test:/\.(png|jpg|gif)/,
                use:{
                   loader:'url-loader',
                    options:{ //当图片小于多少k的时候 用base64来转化 否则用file-loader产生真实的图片
                       limit:200*1024,
                        outputPath:'/img/',
                        // publicPath: "http://www.matrix.com" 只是图片需要在cdn下引入
                    }
                }
                // use:'file-loader'
            },

            {
                test:/\.js$/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:[
                            '@babel/preset-env'
                        ],
                        plugins:[
                            ['@babel/plugin-proposal-decorators',{'legacy':true}],
                            ["@babel/plugin-proposal-class-properties",{"loose":true}],
                            "@babel/plugin-transform-runtime"
                        ]
                    }
                },
                include:path.resolve(__dirname, 'src'),
                exclude:/node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader'
                ]
            }
        ]
    }
}
