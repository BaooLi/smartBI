/*
数据劫持: vue.js 则是采用数据劫持结合发布者-订阅者模式的方式，通过Object.defineProperty()来劫持各个属性的setter，getter，在数据变动时发布消息给订阅者，触发相应的监听回调。
要实现mvvm的双向绑定，就必须要实现以下几点：
1、实现一个数据监听器Observer，数据劫持能够对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者
2、实现一个指令解析器Compiler，对每个元素节点的指令进行扫描和解析，根据指令模板替换数据，以及绑定相应的更新函数
3、实现一个Watcher，作为连接Observer和Compiler的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的相应回调函数，从而更新视图
4、mvvm入口函数，整合以上三者
 */


//  观察者 （发布订阅）  观察者  被观察者
// Dep 消息订阅器
// Observer可以监听每个数据的变化，那么监听到变化之后就是怎么通知订阅者了，所以接下来我们需要实现一个消息订阅器，很简单，维护一个数组，用来收集订阅者，数据变动触发notify，再调用订阅者的update方法
class Dep {
    constructor(){
        this.subs = []; // 存放所有的消息订阅者watcher
    }
    // 订阅
    addSub(watcher){ // 添加 watcher
        this.subs.push(watcher);
    }
    // 发布
    notify(){
        this.subs.forEach(watcher=>watcher.update());
    }
}
// new Watcher 消息订阅者 观察者 粉丝
//  作为Observer和Compile之间通信的桥梁，主要做的事情是:
// 1、在自身实例化时往属性订阅器(dep)里面添加自己
// 2、自身必须有一个update()方法
// 3、待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compiler中绑定的回调，则功成身退
class Watcher{
    constructor(vm,expr,cb){
        this.vm = vm;
        this.expr = expr;
        this.cb = cb;
        // 默认先存放一个老值
        this.oldValue = this.get();
    }
    get(){ // vm.$data.school  vm.$data.school.name
        Dep.target = this; // 先把自己放在this上
        // 取值 把这个观察者 和数据关联起来
        let value = CompileUtil.getVal(this.vm,this.expr);
        Dep.target = null; // 不取消 任何值取值 都会添加watcher
        return value;
    }
    update(){ // 更新操作 数据变化后 会调用观察者的update方法
        let newVal = CompileUtil.getVal(this.vm,this.expr);
        if(newVal !== this.oldValue){
            this.cb(newVal);//cb就是更新的回调
        }
    }
}
// vm.$watch(vm,'school.name',(newVal)=>{

// })

// 消息
class Observer{ // 实现数据劫持功能 给每一个属性 都加上一个具有发布订阅的功能dep.addSub 数据更新通知所有订阅者dep.notify
    constructor(data){
        this.observer(data);
    }
    observer(data){
        // 如果是对象才观察
        if(data && typeof data == 'object'){
            // 如果是对象
            for(let key in data){
                this.defineReactive(data,key,data[key]);
            }
        }
    }
    defineReactive(obj,key,value){
         // school :[watcher,watcher]   b:[watcher]
        let dep = new Dep() // 给每一个属性 都加上一个具有发布订阅的功能
        Object.defineProperty(obj,key,{
            get(){
                // 创建watcher时 会取到对应的内容，并且把watcher放到了全局上
                Dep.target && dep.addSub(Dep.target);
                return value;
                this.observer(value);
            },
            set:(newVal)=>{ // {school:{name:'珠峰'}} school ={}
                if(newVal != value){
                    this.observer(newVal);
                    value = newVal;
                    dep.notify();// 通知所有订阅者
                }
            }
        });
    }
}

//compiler 主要做的事情是解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
// 基类 调度
class Compiler{
    constructor(el,vm){
        // 判断el属性 是不是一个元素 如果不是元素 那就获取他
        this.el = this.isElementNode(el)?el:document.querySelector(el);
        // 把当前节点中的元素 获取到 放到内存中
        this.vm = vm;
        let fragment = this.node2fragment(this.el);
        // 把节点中的内容进行替换
        // 编译模版 用数据编译
        this.compile(fragment);
        // 把内容在塞到页面中

        this.el.appendChild(fragment);
    }
    isDirective(attrName){
        return attrName.startsWith('v-');
    }
    // 编译元素的
    compileElement(node){
        let attributes = node.attributes; // 类数组
        [...attributes].forEach(attr=>{ // type="text" v-model="school.name"
            let {name,value:expr} = attr; // v-model="school.name"
            // 判断是不是指令 //v-
            if(this.isDirective(name)){ // v-model v-html v-bind
                let [,directive]  = name.split('-');  // v-on:click
                let [directiveName,eventName] =directive.split(':');
                // 需要调用不同的指令来处理
                CompileUtil[directiveName](node,expr,this.vm,eventName);
            }
        })
    }
    // 编译文本的
    compileText(node){ // 判断当前文本节点中内容是否包含 {{xxx}} {{aaa}}
        let content = node.textContent;
        if(/\{\{(.+?)\}\}/.test(content)){
            // 文本节点
            CompileUtil['text'](node,content,this.vm); // {{a}} {{b}}
        }
    }
    // 核心的编译方法
    compile(node){ // 用来编译内存中的dom节点
        let childNodes = node.childNodes;
        [...childNodes].forEach(child=>{
            if(this.isElementNode(child)){
                this.compileElement(child);
                // 如果是元素的话 需要把自己传进去 在去遍历子节点
                this.compile(child);
            }else{
                this.compileText(child);
            }
        });
    }
    // 把节点移动到内存中
    node2fragment(node){
        // 创建一个文档碎片
        let fragment = document.createDocumentFragment();
        let firstChild;
        while(firstChild = node.firstChild){
            // appendChild具有移动性
            fragment.appendChild(firstChild);
        }
        return fragment
    }
    isElementNode(node){ // 是不是元素节点
        return node.nodeType === 1;
    }
}
//
CompileUtil = {
    // 根据表达式取到对应的数据
    getVal(vm,expr){ // vm.$data   'school'  [school,name]
        return expr.split('.').reduce((data,current)=>{
            return data[current];
        },vm.$data);
    },
    setValue(vm,expr,value){ //vm.$data 'school.name'  =  姜文
        expr.split('.').reduce((data,current,index,arr)=>{
            if(index == arr.length-1){
                return data[current] = value;
            }
            return data[current];
        },vm.$data);
    },
    // 解析v-model这个指令
    model(node,expr,vm){ // node是节点 expr 是表达式 vm是当前实例  school.name vm.$data
        // 给输入框赋予value属性  node.value = xxx
        let fn = this.updater['modelUpdater'];
        new Watcher(vm,expr,(newVal)=>{ // 给输入框加一个观察者 如果稍后数据更新了会触发此方法，会拿新值 给输入框赋予值  【====添加监听数据的订阅者====】
            fn(node,newVal);
        });
        node.addEventListener('input',(e)=>{
            let value = e.target.value; // 获取用户输入的内容
            this.setValue(vm,expr,value);
        })
        let value  = this.getVal(vm,expr); // 珠峰
        fn(node,value);
    },
    html(node,expr,vm){ // v-html="message"
        let fn = this.updater['htmlUpdater'];
        new Watcher(vm,expr,(newVal)=>{
            console.log(newVal)
            fn(node,newVal);
        });
        let value  = this.getVal(vm,expr); // 珠峰
        fn(node,value);
    },
    getContentValue(vm,expr){
        // 遍历表达式 将内容 重新替换成一个完整的内容 返还回去
        return expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
            return this.getVal(vm,args[1]);
        })
    },
    on(node,expr,vm,eventName){ // v-on:click="change"   expr
        node.addEventListener(eventName,(e)=>{
            vm[expr].call(vm,e); // this.change
        })
    },
    text(node,expr,vm){ // expr =>  珠峰 {{b}} {{c}}  ＝>  a b
        let fn = this.updater['textUpdater'];
        let content = expr.replace(/\{\{(.+?)\}\}/g,(...args)=>{
            // 给表达式每{{}} 都加上观察者
            new Watcher(vm,args[1],()=>{
                fn(node,this.getContentValue(vm,expr)); // 返回了一个全的字符串
            });
            return this.getVal(vm,args[1]);
        });
        fn(node,content);
    },
    updater:{ //vue特有的指令对应的更新函数
        htmlUpdater(node,value){ // xss攻击
            node.innerHTML = value;
        },
        // 把数据插入到节点中
        modelUpdater(node,value){
            node.value = value;
        },
        // 处理文本节点的
        textUpdater(node,value){
            node.textContent = value;
        }
    }
}
class Vue{
    constructor(options){
        // this.$el $data $options
        this.$el = options.el;
        this.$data = options.data;
        let computed = options.computed;
        let methods = options.methods;
        // 这个根元素 存在 编译模板
        if(this.$el){
            // 把数据 全部转化成用Object.defineProperty来定义
            new Observer(this.$data);
            // 把数据获取操作 vm上的取值操作 都代理到 vm.$data
            // {{getNewName}} reduce  vm.$data.getNeName
            for(let key in computed){ // 有依赖关系 数据
                Object.defineProperty(this.$data,key,{
                    get:()=>{
                        return computed[key].call(this);
                    }
                })
            };

            for(let key in methods){
                Object.defineProperty(this,key,{
                    get(){
                        return methods[key]
                    }
                })
            }
            this.proxyVm(this.$data);


            new Compiler(this.$el,this);
        }
    }
    //backbone set()  get()
    proxyVm(data){
        for(let key in data){ // {school:{name,age}}
            Object.defineProperty(this,key,{ // 实现可以通过vm取到对应的内容
                get(){
                    return data[key]; // 进行了转化操作
                },
                set(newVal){ // 设置代理方法
                    data[key] = newVal;
                }
            })
        }
    }
}