let str = require('./a.js');
require('./index.css')
require('./style.less')
require('@babel/polyfill')
require('./装饰器')
import $ from 'jquery'
import logo from './mountain.png'
import MyDate from '../note/date'

// import $ from 'expose-loader?$!jquery' 在webpack中进行配置后就不用这么写了

console.log(str);
@log
class F{
    a=12;
}
function log(target) { //target是个类
    console.log(target); //ƒ F() {_classCallCheck(this, F);this.a = 12;} 能把这个类打印出来
}

function * gen(params) {
    yield 1;
}
console.log(gen().next());
let s = 'aaa'.includes('a')
console.log($)
console.log(window.$) // undefined 一个js文件就是一个闭包，并不会挂载到window上

let image=new Image();
image.src=logo;
document.body.appendChild(image)
let f=new MyDate();
// console.log(f.getFullYear());
// let res1=f.getDaysBetweenArr('20190401','20190415')
// let res2=f.getDateAddOrMinus(-1);
// console.log(res1);
// console.log(res2);

