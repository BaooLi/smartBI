class Star {
    constructor() {
        this.state = '';
        this.observers = [];//粉丝 维护观察者的数组，每当自己状态变化就通知观察者更新自己的状态 观察者和被观察者是耦合的，观察者的update的更新动作， 是由被观察者调用的
    }

    getState() {
        return this.state;
    }

    setState(state) {
        this.state = state;
        this.notifyAllObservers();
    }

    //添加一个观察者
    attach(observer) {
        this.observers.push(observer)
    }

    notifyAllObservers() {
        if (this.observers.length > 0) {
            this.observers.forEach(observer => observer.update());
        }
    }
}

class Fan {
    constructor(name, star) {
        this.name = name;
        this.star = star;
        this.star.attach(this)
    }

    update() {
        console.log(`我的iddle喜欢${this.star.getState()}色，我也喜欢`)
    }
}

let star = new Star('Baby');
let f1 = new Fan('张三', star);
star.setState('绿色');

// 粉丝观察明星 粉丝是观察者 明星是被观察者
// 粉丝需要把观察的明星添加到自己内部
// 明星维护粉丝（观察者）的数组 明星奖粉丝添加到自己维护的数组中，进行绑定，观察者和被观察者是耦合的
// 外部作用明星状态发生变化，每当明星状态变化就通知粉丝更新自己的状态，粉丝的update的更新动作， 是由明星调用的
//
//
//
//
//
//
//