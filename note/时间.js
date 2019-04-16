// 此类继承自Date，拥有Date的所有属性和对象
//
// 此类可以自由拓展方法
// 假设最终的类是 MyDate，有一个getTest拓展方法
//let date = new MyDate();

// 调用Date的方法，输出GMT绝对毫秒数
//console.log(date.getTime());
// 调用拓展的方法，随便输出什么，譬如helloworld!
//console.log(date.getTest());

//寄生组合继承
//
// 所有类都是函数;每个函数都有一个 prototype (原型)属性，是一个 对象(当前类本身)，这个属性类似于一个指针，指向一个特定类型的 所有实例所共享的属性和方法。构造函数和实例的prototype属性都指 向同一个原型对象，原型对象的方法都可以由实例取继承;
// Constructor 属性是原型对象的属性，是一个对象(当前类本身)，也 是一个指针，指向构造函数;大部分情况下指向构造函数，但也不少一 成不变的。当构造函数的 prototype 设置为等于一个以对象字面量形式 创建的新对象时，此时 Constructor 属性不再指向构造函数，而是指向 对象;
// 任意一个对象都会有一个属性 __proto__ ，这个属性指向所属类的原型 ( prototype );Objectd的原型上没有 __proto__ ，因为已指向自 身;

Object.setPrototypeOf = Object.setPrototypeOf ||
    function(obj, proto) {
        obj.__proto__ = proto;

        return obj;
    };
function MyDate() {
    // bind属于Function.prototype，接收的参数是：object, param1, params2...
    console.log(Array.prototype.slice.call(arguments));
    console.dir(Date);
    let dd = [Date].concat(Array.prototype.slice.call(arguments))
    console.log(123,dd);
    let res=Function.prototype.bind.apply(Date, dd);
    console.log(22,res);
    var sd=new(res);
    console.log(12,sd);
    console.log(12,sd());
    var dateInst = new(res)();

    // 更改原型指向，否则无法调用MyDate原型上的方法
    // ES6方案中，这里就是[[prototype]]这个隐式原型对象，在没有标准以前就是__proto__
    Object.setPrototypeOf(dateInst, MyDate.prototype);

    dateInst.abc = 1;

    return dateInst;

}
Object.setPrototypeOf(MyDate.prototype, Date.prototype);
// function inherits(child, father) {
//     function Inner() {}
//
//     Inner.prototype = father.prototype;
//     child.prototype = new Inner(); // 继承了Inner的私有(空) + Inner公有(=father 公有) ，丢失了child自己的constructor
//     child.prototype.constructor = child; // 找回自己的constructor
// }
//
// inherits(MyDate, Date);

MyDate.prototype.getTest = function() {

    return this.getTime();
};


let date = new MyDate();
console.log(date);

console.log(date.getTest());//this is not a Date object.
let v=[1, 2, 3].slice()
console.log(v);










//
// class MyDate1 extends Date{
//     constructor(){
//         super();
//     }
//     getA(){
//         return this.getTime()
//     }
// }
//
// let f=new MyDate1();
// let d=f.getA();
// console.log(d);