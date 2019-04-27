/*

1.项目优化
  代码层面:防抖节流、
  打包：
  渲染：
  加载：前端缓存，

2. 浏览器一些原理
3. mvvm原理
4.react原理
5.dom-diff 原理
6.redux原理
7.mobx原理
8.setState
9.vue生命周期
10.react生命周期
11.深拷贝




基础
1.盒模型
2.原型、继承、闭包、作用域
3.ES6 语法
4. let const
5.promise


设计模式：
装饰器模式
观察者模式

优化：
代码层面：按需引入 antd ，element-ui，如果用了moment，忽略他的语言包

防抖，节流，减少dom重绘


git push --set-upstream origin master

----------
所以正确的一次 Event loop 顺序是这样的

执行同步代码，这属于宏任务
执行栈为空，查询是否有微任务需要执行
执行所有微任务
必要的话渲染 UI
然后开始下一轮 Event loop，执行宏任务中的异步代码

-----------

status code: 200 ok ( from cache )
status code: 304 Not Modified
上面两种方式有什么区别呢？简单地说，第一种方式是不向浏览器发送请求，直接使用本地缓存文件。第二种方式，浏览器虽然发现了本地有该资源的缓存，但是不确定是否是最新的，于是想服务器询问，若服务器认为浏览器的缓存版本还可用，那么便会返回304。
浏览器如何决定是使用哪种方式呢？这就和服务器在请求返回中的Header字段有关了。下面对相关的字段进行简单介绍。





------让Nginx支持HTTP1.1----------
https://www.cnblogs.com/liaojiafa/p/6130390.html
我们增加三个参数keepalive 50，proxy_http_version 1.1 , proxy_set_header Connection 来配置。
http{
''' 省去其他的配置
    upstream www{
        keepalive 50; # 必须配置，建议50-100之间
        '''
    }
    server {
    '''省去其他的配置
        location / {
        proxy_http_version 1.1; # 后端配置支持HTTP1.1，必须配
        proxy_set_header Connection "";   # 后端配置支持HTTP1.1 ,必须配置。
        }
    '''

    }
'''
}

1.在父组件中设置二级子路由
<div>
    <Route path='/config/add' component={AddApi}/>
    <Route path='/config/edit/:id' component={EditApi}/>
    <Route path='/config/look/:id' component={LookApi}/>
    <Route path="/config/copy/:id" exact component={CopyApi}/>
</div>

2.在父组件进行跳转
<Link to={{pathname:`/config/edit/${record.apiId}`,
state:{moduleSelSource:this.state.selectSource,curEditRowId:record.apiId}}}>
  编辑
</Link>

3.在子组件进行获取值
moduleSelSource: this.props.location.state.moduleSelSource, // 模块所属名称
curRowId:this.props.match.params.id // 或者 curRowId:this.props.location.state.curEditRowId













 */



















