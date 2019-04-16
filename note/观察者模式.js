let fs=require('fs');
function Events() {
    this._arr=[];
}
Events.prototype.on=function (fn) {
    this._arr.push(fn);
}
Events.prototype.emit=function (r) {
    this._arr.forEach(function (fn) {
        fn(r);
    })
}
let e =new Events();
let arr=[];
e.on(function (r) {
    arr.push(r);
    if(arr.length==2){
        console.log('读取完毕',arr);
    }
});
fs.readFile('./d.txt','utf8',function (err,data) {
    e.emit(data);
});
fs.readFile('./d.txt','utf8',function (err,data) {
    e.emit(data);
});

// 读取完毕 [ 'yiixa', 'yiixa' ]
//发布者和订阅者没有关系
// 观察者模式
// 观察者要存放在被观察者中，被观察者首先要提供一个更新的方法，当被观察者的数据发生变化时，需要执行被被观察者的update方法

//观察者 明星
function Observer() {
    this.state='不开心的'
}
Observer.prototype.attach=function (s) {
    this.arr.push(s)
}
Observer.prototype.setState=function (newState) {
    this.state=newState;
    this.arr.forEach(fn=>fn.update(this.state));
}
//被观察者 目标 粉丝 有更新自动发通知
function Subject(name,target) {
    this.name=name;
    tihs.target=target;
}

Subject.prototype.update=function (newState) {
    console.log('监听到了变化');
}
let o=new Observer();
let s1=new Subject('lucy',o);
let s2=new Subject('mary',o);
o.attach(s1);
o.attach(s2);
o.setState('开心');
o.setState('不开心');

/*

被观察者提供维护观察者的一系列方法
观察者提供更新接口
观察者把自己注册到被观察者里
在被观察者发生变化时候，调用观察者的更新方法




 */














