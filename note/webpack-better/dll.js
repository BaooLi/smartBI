
let path=require('path');
// let HtmlWebpackPlugin=require('html-webpack-plugin');
let webpack=require('webpack')
module.exports={
    mode:'development',
    entry:{
        // test:'./src/test.js'
        react:['react','react-dom']
    },
    output:{
        filename:'_dll_[name].js',
        path:path.resolve(__dirname, 'dist'),
        library: '_dll_[name]', // 打包后导出的变量名字 anotherName
        // libraryTarget: "var", //commonjs
    },
    plugins: [
        new webpack.DllPlugin({
            name:'_dll_[name]',  // 对应关系 ： name===library
            path:path.resolve(__dirname,'dist','minifest.json')//产生任务清单，用于找到同名变量的链接的这个文件
        })
    ]
}

//启动这个文件  npx webpack --config webpack.config.react.js