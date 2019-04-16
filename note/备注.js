/*  代码执行顺序：
    1.new Observer(this.$data);
    2.this.proxyData(this.$data);
    3.new Compile(this.$el, this); 内部 new Watcher()
    // 1.new Observer(this.$data); 第一次执行的时候，Dep.target不存在，Dep.target只有在 new Watcher()的时候才存在
    // 2.执行new Compile(this.$el, this);编译模板，将节点和数据关联起来， 内部会 new Watcher()，
    // 此时，会发生的变化是：（1）数据的获取老值 this.value = this.get()

     get() {
        Dep.target = this; // 1.会将数据对应的watcher实例自己挂载到 Dep.target 上
        let value = this.getVal(this.vm, this.expr); // 2.获取值会数据劫持，调用get方法，此时执行 dep.addSub(Dep.target)会把数据对应的watcher添加到数据对应的订阅数组中 this.subs.push(watcher); 等价于 message: [ input的watcher, 文本节点的watcher, 文本节点的watcher]
        Dep.target = null; // 3.用完之后置空，不取消 任何值取值 都会添加watcher。只要调用get方法就会添加watcher
        return value;
    }



Dep 消息发布订阅器 维护一个订阅的数组 dep里面有watcher  watcher里面有update方法

Observer 数据深度劫持，获取值的时候会调用get ，dep.addSub(Dep.target)添加   ；set 的时候数据发生变化，通知订阅者数据更新，Dep.notify 调用watcher的update方法
每个变化的数据都会对应一个数组，这个数组是存放所有更新的操作  message: [ input的watcher, 文本节点的watcher, 文本节点的watcher]

Watcher 给需要变化的dom元素添加一个观察者（粉丝），当数据（明星）发生变化，执行观察者（粉丝）的更新方法，数据关联的dom元素的更新值的方法
Compiler 模板编译的时候 new Watcher（）
new Watcher的时候，先获取一下老值，1.先走 Dep.target=this, this是实例watcher自己 ，  2. getVal会调用 数据的get方法，在get方法中会判断 Dep.target && dep.addSub(Dep.target) 目的是把watcher放到订阅者的数组中，用完之后Dep.target=null

text --->  new Watcher(vm,expr,cb)
model ---> new Watcher(vm,expr,cb)
html --->  new Watcher(vm,expr,cb)

<input type="text" v-model='message'/>
data:{message:'hello'}  ----->   data:{message:123}  老值和新值进行对比，如果变化，watcher就调用自己的更新函数
执行input对应的更新 input.value = 123 的更新函数

一个数据可能对应多个 watcher 比如 message：[input, text,text] ==> message: [ input的watcher, 文本节点的watcher, 文本节点的watcher]


 */

/*
<div id="app">
    <input type="text" v-model="school.name">
        <div>{{school.name}}</div>
        <div>{{school.age}}</div>
        <!-- 如果数据不变化 视图就不会刷新 -->
        {{getNewName}}
        <!-- 我们在内部 会匹配  {{}} -->
        <ul>
            <li>1</li>
            <li>1</li>
        </ul>
        <button v-on:click="change">更新操作</button>
        <div v-html="message"></div>
</div>
<script src="MVVM.js"></script>
<script>
    let vm = new Vue({
    el:'#app',
    data:{
    school:{
    name:'珠峰',
    age:10
},
    message:'<h1>欢迎大家</h1>'
},
    computed:{
    getNewName(){
    return this.school.name +'架构'
}
},
    methods:{
    change(){
    this.school.name = '姜文'
}
}
})
</script>
*/


class MVVM {
    constructor(options) {
        // 一上来 先把可用的东西挂载在实例上
        this.$el = options.el;
        this.$data = options.data;

        // 如果有要编译的模板我就开始编译
        if (this.$el) {
            // 数据劫持 就是把对想的所有属性 改成get和set方法
            new Observer(this.$data);
            //实现可以通过vm取到对应的内容
            this.proxyData(this.$data);
            // 用数据和元素进行编译
            new Compile(this.$el, this);
        }
    }

    proxyData(data) {
        Object.keys(data).forEach(key => {
            Object.defineProperty(this, key, {
                get() {
                    return data[key]
                },
                set(newValue) {
                    data[key] = newValue
                }
            })
        })
    }
}

class Observer {
    constructor(data) {
        this.observe(data);
    }

    observe(data) {
        // 要对这个data数据将原有的属性改成set和get的形式
        if (!data || typeof data !== 'object') {
            return;
        }
        // 要将数据 一一劫持 先获取取到data的key和value
        Object.keys(data).forEach(key => {
            // 劫持
            this.defineReactive(data, key, data[key]);
            this.observe(data[key]);// 深度递归劫持
        });
    }

    // 定义响应式
    defineReactive(obj, key, value) {
        // 在获取某个值的适合 想弹个框
        let that = this;
        let dep = new Dep(); // 每个变化的数据 都会对应一个数组，这个数组是存放所有更新的操作
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() { // 当取值时调用的方法
                Dep.target && dep.addSub(Dep.target);//
                return value;
            },
            set(newValue) { // 当给data属性中设置值的适合 更改获取的属性的值
                if (newValue != value) {
                    // 这里的this不是实例
                    that.observe(newValue);// 如果是对象继续劫持
                    value = newValue;
                    dep.notify(); // 通知所有人 数据更新了
                }
            }
        });
    }
}

class Dep {
    constructor() {
        // 订阅的数组
        this.subs = []
    }

    addSub(watcher) {
        this.subs.push(watcher);
    }

    notify() {
        this.subs.forEach(watcher => watcher.update());
    }
}

// 观察者的目的就是给需要变化的那个元素增加一个观察者，当数据变化后执行对应的方法
class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        // 先获取一下老的值
        this.value = this.get();
    }

    getVal(vm, expr) { // 获取实例上对应的数据
        expr = expr.split('.'); // [message,a]
        return expr.reduce((prev, next) => { // vm.$data.a
            return prev[next];
        }, vm.$data);
    }

    get() {
        Dep.target = this;
        let value = this.getVal(this.vm, this.expr);
        Dep.target = null;
        return value;
    }

    // 对外暴露的方法
    update() {
        let newValue = this.getVal(this.vm, this.expr);
        let oldValue = this.value;
        if (newValue != oldValue) {
            this.cb(newValue); // 对应watch的callback
        }
    }
}



// 用新值和老值进行比对 如果放生变化 就调用更新方法
// vm.$data expr
/*
<input type="text" v-model="message" />
{ message: 1 }
{ message: 2 }
input.value = message
*/

class Compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        if (this.el) {
            // 如果这个元素能获取到 我们才开始编译
            // 1.先把这些真实的DOM移入到内存中 fragment
            let fragment = this.node2fragment(this.el);
            // 2.编译 => 提取想要的元素节点 v-model 和文本节点 {{}}
            this.compile(fragment);
            // 3.把编译号的fragment在塞回到页面里去
            this.el.appendChild(fragment);
        }
    }

    /* 专门写一些辅助的方法 */
    isElementNode(node) {
        return node.nodeType === 1;
    }

    // 是不是指令
    isDirective(name) {
        return name.includes('v-');
    }

    /* 核心的方法 */
    compileElement(node) {
        // 带v-model v-text
        let attrs = node.attributes; // 取出当前节点的属性
        Array.from(attrs).forEach(attr => {
            // 判断属性名字是不是包含v-model
            let attrName = attr.name;
            if (this.isDirective(attrName)) {
                // 取到对应的值放到节点中
                let expr = attr.value;
                let [, type] = attrName.split('-');
                // node this.vm.$data expr
                CompileUtil[type](node, this.vm, expr);
            }
        })
    }

    compileText(node) {
        // 带{{asd}}
        let expr = node.textContent; // 取文本中的内容
        let reg = /\{\{([^}]+)\}\}/g; // {{a}} {{b}} {{c}}
        if (reg.test(expr)) {
            // node this.vm.$data text
            CompileUtil['text'](node, this.vm, expr);
        }
    }

    compile(fragment) {
        // 需要递归
        let childNodes = fragment.childNodes;
        Array.from(childNodes).forEach(node => {
            if (this.isElementNode(node)) {
                // 是元素节点，还需要继续深入的检查
                // 这里需要编译元素
                this.compileElement(node);
                this.compile(node)
            } else {
                // 文本节点
                // 这里需要编译文本
                this.compileText(node);
            }
        });
    }

    node2fragment(el) { // 需要讲el中的内容全部放到内存中
        // 文档碎片 内存中的dom节点
        let fragment = document.createDocumentFragment();
        let firstChild;
        while (firstChild = el.firstChild) {
            fragment.appendChild(firstChild);
        }
        return fragment; // 内存中的节点
    }
}

CompileUtil = {
    getVal(vm, expr) { // 获取实例上对应的数据
        expr = expr.split('.'); // [message,a]
        return expr.reduce((prev, next) => { // vm.$data.a
            return prev[next];
        }, vm.$data);
    },
    getTextVal(vm, expr) { // 获取编译文本后的结果
        return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            return this.getVal(vm, arguments[1]);
        })
    },
    text(node, vm, expr) { // 文本处理
        let updateFn = this.updater['textUpdater'];
        // {{message.a}} => hello,zfpx;
        let value = this.getTextVal(vm, expr);
        // {{a}} {{b}}
        expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
            new Watcher(vm, arguments[1], (newValue) => {
                // 如果数据变化了，文本节点需要重新获取依赖的属性更新文本中的内容
                updateFn && updateFn(node, this.getTextVal(vm, expr));
            });
        })
        updateFn && updateFn(node, value)
    },
    setVal(vm, expr, value) { // [message,a]
        expr = expr.split('.');
        // 收敛
        return expr.reduce((prev, next, currentIndex) => {
            if (currentIndex === expr.length - 1) {
                return prev[next] = value;
            }
            return prev[next];
        }, vm.$data);
    },
    model(node, vm, expr) { // 输入框处理
        let updateFn = this.updater['modelUpdater'];
        // 这里应该加一个监控 数据变化了 应该调用这个watch的callback
        new Watcher(vm, expr, (newValue) => {
            // 当值变化后会调用cb 将新的值传递过来 （）
            updateFn && updateFn(node, this.getVal(vm, expr));
        });
        node.addEventListener('input', (e) => {
            let newValue = e.target.value;
            this.setVal(vm, expr, newValue)
        })
        updateFn && updateFn(node, this.getVal(vm, expr));
    },
    updater: {
        // 文本更新
        textUpdater(node, value) {
            node.textContent = value
        },
        // 输入框更新
        modelUpdater(node, value) {
            node.value = value;
        }
    }
}








