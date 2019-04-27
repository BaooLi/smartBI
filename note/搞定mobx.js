/**
 1.项目中是如何使用mobx的？

 需求：在config Api接口列表页面，有搜索条件，默认是展示自己配置的接口列表，如果用户想按条件查找，检索后，如果用户跳转到其他页面，返回只该页面时，页面还是按上一次条件检索的结果。

实现：在mobx的store/modules目录下，创建一个configStore的类，导出 new ConfigStore()，
 ----------代码部分-------------
 import {observable, observe, isArrayLike, computed, autorun, action} from "mobx";
 class ConfigStore {
    //默认启用，本人创建
    @observable curSearchOptions = {
        apiUrl: '',
        creator: '',
        creatorSelection: localStorage.getItem('username'),
        enable: 1,
        moduleSearchName: '',
        pageSearchName: '',
    };
    // 如果检索一次，就派发一个动作，改变默认检索条件
    @action.bound saveSearchOptions(option){
        console.log('option',option);
        this.curSearchOptions = option;
    }

}

 export default new ConfigStore();
 --------------代码结束--------------------------

 声明一个对象，记录一下默认值，页面打开时候就用这个默认值去渲染
 声明一个方法，如果检索一次，就派发一个动作，改变默认检索条件

---------------组件部分---------------------------------
把仓库注入到组件内
 @inject((stores, props, context)=>{
    return {//仓库的状态和方法都变为当前组件的属性对象
        curSearchOptions:stores.configStore.curSearchOptions,
        saveSearchOptions: stores.configStore.saveSearchOptions,
    }
})

 @observer
 class FilterConfigWrap extends Component {
    ....
        1.取出默认值，并分别赋给组件 Form 的 initialValue,
        let {
            creatorSelection:curCreator,
            enable:curEnable,
            apiUrl: mobxApiUrl,
            creator: mobxCreator,
            moduleSearchName: mobxModuleSearchName,
            pageSearchName: mobxPageSearchName,
        } = this.props.curSearchOptions

        2.点击检索，就向仓库派发动作，执行父组件的回调，渲染页面
        clickSearch = () => {
        let formValue = this.props.form.getFieldsValue();
        this.props.saveSearchOptions(formValue);//派发的动作
        this.submitSearchConfigForm(formValue)
    }
 }


 项目难点2：结合业务，拓展可编辑表格，实现列类型多样化，列类型条件关联，动态校验是否必填
 1.声明几个全局变量，初始化表格的默认关联关系
 2.因为没一个单元格与另外的单元格无法通信



 在utils声明4个全局变量（4个对象）用来记录4种关联关系，点击编辑的时候引入这个对象循环判断实现恢复关联关系
 1.维度2种关联关系 ①关联维度表，②不关联维度表
 2.指标 聚合方式可选，其他不可选
 3.派生列 派生列计算公式可输入 其他不可选

 required  =  一个函数




 */