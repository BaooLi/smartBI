const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const webpackConfig = require('./webpack.config.js')

let copyFile =(src, dist) =>{
    fs.writeFileSync(dist, fs.readFileSync(src));
}

let createVersionValidateStr=() =>{
    // 将当前时间戳写入src下产生一个json文件
    let json_obj = {"build_str": new Date().getTime().toString()}
    fs.writeFile(path.resolve(__dirname, './src/build_str.json'), JSON.stringify(json_obj), function (err) {
        if (err) {
            return console.error(err);
        }
        console.log("打包字符串写入文件：src/build_str.json，成功！")
        realBuild()
    })
}

let realBuild=() =>{
    webpack(webpackConfig, function (err, stats) { // stats 打包状态
        if (err) throw err
        process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')

        if (stats.hasErrors()) {
            // console.log(chalk.red('  Build failed with errors.\n'))
            process.exit(1)
        }
        console.log('  Build complete.\n')
        copyFile(path.resolve(__dirname, './src/build_str.json'), path.resolve(__dirname, './build/build_str.json'))
        console.log('复制 src/build_str.json 到 build/build_str.json：成功')
    })
}

createVersionValidateStr()
// kPdK2KFpTVkP