// Proxy 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写// get方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 proxy 实例本身// set方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身// 用法：var proxy = new Proxy(target, handler);let p1 = new Proxy({name: 'Susan', age: 15}, {//receiver = p1 一般没啥用，可以不写	get: function (target, key, receiver) {		console.log(`getting ${key}`);		console.log(receiver);		return Reflect.get(target, key, receiver);	},	set: function (target, key, value, receiver) {		console.log(`setting ${key}`);		return Reflect.set(target, key, value, receiver);	}})// console.log(p1.name);// p1.age=25;// Object.defineProperty(obj, prop, descriptor)// obj：必需。目标对象// prop：必需。需定义或修改的属性的名字// descriptor：必需。目标属性所拥有的特性// 举个例子：var obj = {};Object.defineProperty(obj, "newKey", {	value: "hello",	writable: true | false,	configurable: true | false,	enumerable: true | false,	get: function () {	} | undefined,	set: function (value) {	} | undefined,});// value: 设置属性的值// writable: 值是否可以重写。true | false// enumerable: 目标属性是否可以被枚举。true | false// configurable: 目标属性是否可以被删除或是否可以再次修改特性 true | false// 装饰器// descriptor = {value: func, enumerable: false, configurable: true, writable: true, initializer: ƒ}class Person {	// 装饰类的属性	@handler name = {lastName: 'jiabao'}}function handler(target, key, descriptor) {//  {configurable: true, enumerable: true, writable: true, initializer: ƒ}//	initializer()  ===>  {lastName: "jiabao"}	console.log(descriptor.initializer());}let p1 = new Person()handler(p1.name);// function initializer() {// 	return {lastName: 'jiabao'};// }