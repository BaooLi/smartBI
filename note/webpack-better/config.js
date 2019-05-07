

let path=require('path');
let HtmlWebpackPlugin=require('html-webpack-plugin');
let webpack=require('webpack');
let Happypack=require('happypack');

module.exports={
    mode:'development',
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname, 'dist')
    },
    devServer: {
        port:3000,
        open:true,
        contentBase:'./dist'
    },
    module: {
        noParse: /jquery/,//不去解析jquery 中的依赖库
        rules: [
            {
                test: /\.js$/,
                exclude:/node_modules/,
                include:path.resolve('src'),
                use:'Happypack/loader?id=js'
                // use: {
                //     loader: 'babel-loader',
                //     options:{
                //         presets:[
                //             '@babel/preset-env',//es6
                //             '@babel/preset-react'//react
                //         ]
                //     }
                // }
            },
            {
                test:/\.css$/,
                // use:['style-loader','css-loader']
                use:'Happypack/loader?id=css'
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:'./public/index.html'
        }),
        new Happypack({
            id:'js',
            use: [{
                loader: 'babel-loader',
                options:{
                    presets:[
                        '@babel/preset-env',//es6
                        '@babel/preset-react'//react
                    ]
                }
            }]
        }),
        new Happypack({
            id:'css',
            use:['style-loader','css-loader'],
        }),
        new webpack.IgnorePlugin(/\.\/locale/,/moment/),
        new webpack.DllReferencePlugin({ // 先去动态链接库里查找，找不到再去打包
            manifest:path.resolve(__dirname,'dist','minifest.json')
        }),
    ]
}