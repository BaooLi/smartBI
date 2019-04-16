/*


"scripts": {
    "build": "webpack",
    "start":"webpack-dev-server",
    "n":"node a.js" //可以让node运行
  },

1.安装 npm install webpack webpack-cli -D
2.打包工具-》输出后的结果（js模块）
3.在新的项目下建立src文件，src下面建index.js文件
4.运行命令 npx webpack ，就可以打包出一个main.js文件
5.这个过程：会默认去找node_modules- webpack-cli 文件下面的 config.yargs.js
6、支持js模块化
7、执行npx webpack会打包出一个bundle.js文件。里面是一个自执行函数，
打包的过程：把所有的模块解析为一个对象，通过入口去加载相关依赖，依次实现递归的依赖关系，通过入口来运行所有的文件。
({
    "./src/a.js": (function(module, exports) {eval("module.exports='hello world'\n\n//# sourceURL=webpack:///./src/a.js?");}),

    "./src/index.js": (function(module, exports, __webpack_require__) {eval("let str = __webpack_require__( \"./src/a.js\");\nconsole.log(str);\n\n//# sourceURL=webpack:///./src/index.js?");})

})

安装 webpack-dev-server,webpack并不会真正打包，而是在内存中打包
运行命令 npx webpack-dev-server 会将项目运行在localhost：8080上，用浏览器可以访问localhost：8080

"scripts": {
    "dev": "webpack-dev-server",// 此时必须是webpack.config.js的文件
    "build": "webpack --config webpack.config.my.js" // 如果将webpack.config.js文件更名为webpack.config.my.js也是可以的
  },

1、插件HtmlWebpackPlugin的作用，在src下新建一个index.html文件，并希望在打包后，在bundle目录下这个index.html会自动引打包后的bundle.js文件
new HtmlWebpackPlugin({
            template:'./src/index.html',
            filename:'index.html',
            minify:{
                removeAttributeQuotes:true, 删除引号
                collapseWhitespace:true, 删除空白
            },
            hash:true，每次打包都产生哈希值
        })

安装npm install css-loader style-loader -D
npm install less less-loader
node-sass sass-loader
stylus stylus-loader

2、npm install mini-css-extract-plugin -D

3、npm install postcss-loader autoprefixer 自动添加样式前缀如webkit

4、npm install optimize-css-assets-webpack-plugin -D

5、npm install uglifyjs-webpack-plugin -D

6、npm install babel-loader @babel/core @babel/preset-env

7、npm install @babel/plugin-proposal-class-properties -D 解析es6，7语法

8.npm install @babel/plugin-proposal-decorators -D    解析装饰器语法 @log

9.npm install @babel/plugin-transform-runtime -D 解析高级语法 比如promise、generator

10. npm install @babel/runtime 线上环境也需要此依赖

11. npm install @babel-polyfill 解析高级语法 includes

12. npm install eslint eslint-loader 语法校验 需要下载 .eslintrc.js 文件放在根目录下


13. 全局变量引入问题 npm install jquery

14.npm install expose-loader -D
    expose-loader?$!jquery 意思是 把jquery以$ 形式暴露到全局，解决了js一个文件就是一个闭包的问题
    expose-loader 暴露全局的loader 是一个内联loader
    pre 前面执行的loader
    normal 普通loader
    内联loader
    post 后置loader

15. 想要实现在每个模块中注入 jquery 不是一个一个的引入 但是拿不到 window.$

16. 在index.html中引入 <script  src="http://code.jquery.com/jquery-1.12.0.min.js"></script> 但是又在模块中引入import $ from 'jquery'，其实并不需要， 此时需要

externals:{
 $:'jquery'
}

externals
官网文档解释的很清楚，就是webpack可以不处理应用的某些依赖库，使用externals配置后，依旧可以在代码中通过CMD、AMD或者window/global全局的方式访问。

怎么理解呢？我们先通过官网说的那个jquery的案例来理解。

有时我们希望我们通过script引入的库，如用CDN的方式引入的jquery，我们在使用时，依旧用require的方式来使用，但是却不希望webpack将它又编译进文件中。

1).expose-loader 暴露到window上

    { // import $ from 'expose-loader?$!jquery' 在webpack中进行配置后就不用这么写了，直接写 import $ from 'jquery'即可
        test:require.resolve('jquery'),//把jq暴露到全局 import $ from 'jquery'
        use:'expose-loader?$'
    },

2).providePlugin 给每个人提供一个$
    new webpack.ProvidePlugin({ // 在每个模块之后都注入$,但是拿不到 window.$
            $:'jquery'
        })
3).CDN的方式引入+externals 引入不打包

17.webpack打包我们的图片
    1.在js中创建图片来引入
    2.在css的background中引入
    3.通过标签 <img src='' alt=''>

18.npm install html-withimg-loader -D 解决 直接在index.html的img标签中引入图片路径，而在打包时候找不到的问题







// node的写法
let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    devServer: {
        port:3000,
        progress:true,
        contentBase:'./build',
        compress:true,
    },
    mode: 'development',//production development
    entry:'./src/index.js',
    output:{
        filename: "bundle.[hash:8].js",
        path:path.resolve(__dirname,'build')//路径必须是一个绝对路径 __dirname指的是当前目录下，产生一个dist的文件，
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            filename:'index.html',
            minify:{
                removeAttributeQuotes:true,
                collapseWhitespace:true,
            },
            hash:true
        })
    ],
    module: {
        rules: [
            {
                test:/\.css$/,
                use:[
                    { // 这种写法会把css作为style标签里面的内容插入到头部 MiniCssExtractPlugin.loaders是把打包后的main.css文件作为一个link标签插入到头部
                        loader:'style-loader',
                        options: {
                            insertAt:'top',
                        }
                    },
                    'css-loader'
                ]
            },
            {
                test:/\.css$/,
                use:[
                    {
                        loader:'style-loader',
                        options: {
                            insertAt:'top',
                        }
                    },
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    }
}













 */