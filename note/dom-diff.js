
/*

虚拟dom jsx会编译出虚拟dom
createElement => {type,props,children}
 1.将虚拟dom转化成了真实DOM渲染到页面上
 2. createElement创建出2个ul用作示例，改变其中一个ul里面的li节点，dom如何更新
 3.DOM Diff比较两个虚拟DOM区别 比较两个对象的区别。dom diff作用 根据两个虚拟对象,创建出补丁，描述改变的内容，将这个补丁用来更新dom

     《dom发生变化有以下几种情况：》
    1.当节点类型相同时，去看一下属性是否相同，产生一个属性的补丁包   {type:'ATTRS',attrs:{class:'list-group'}}
    2.新的dom节点不存在{type:'REMOVE',index:xxx}
    3.如果元素节点类型不相同，直接采用替换模式，{type:'REPLACE',newNode:newNode}
    4.文本节点 内容发生变化，把{type:'TEXT'text:1}
    // 如果有儿子节点 遍历儿子 递归判断， index基于一个序号  patches = {0: Array(1), 2: Array(1), 4: Array(1)}

4.通过js层面的计算，返回一个patch对象，即补丁，再通过特定的操作解析patch对象，给某个元素打补丁，完成页面的重新渲染

  1.遵循 先序深度优先遍历node 规则打补丁 ,哪个节点对应取出哪个差异数组 patches = {0: Array(1), 2: Array(1), 4: Array(1)}

   doPatch(node, currentPatch) // ul 对应补丁包 0




         ul ⓪
      /      |
    li ①   li ③
     |       |
   'a' ②    'b' ④




       ul ⓪
  /     |    \
li ①   li    li ④
 |      |      \
'2'②  '1' ③   '1' ⑤



*/