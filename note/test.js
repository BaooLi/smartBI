class Star{
    constructor(){
        this.state='';
        this.observers=[];
    }
    attach(fans){
        this.observers.push(fans)
    }
    notifyAllObservers(){
        if (this.observers.length>0){
            this.observers.forEach(fans=>fans.update());
        }
    }
    getState(){
        return this.state
    }
    setState(newVal){
        this.state=newVal;
        this.notifyAllObservers()
    }
}
class Fan{
    constructor(name,star){
        this.name=name;
        this.star=star;
    }
    update(){
        console.log('监测到了明星变化，我也要变',this.star.getState())
    }
}
let star=new Star('周杰伦');
let fan=new Fan('张三',star);
star.attach(fan);
star.setState('绿色');
//明星绑定自己的粉丝到
//粉丝需要将明星添加到自己的内部
