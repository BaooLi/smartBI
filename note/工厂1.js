class Plant{
    constructor(name){
        this.name=name
    }
}
class Apple extends Plant{
constructor(name,flavour){
    super(name);
    this.flavour=flavour
}
}
class Orange extends Plant{
    constructor(name,flavour){
        super(name);
        this.flavour=flavour
    }
}
class Factory{ // static修饰的方法属于类本身，不属于类的实例对象,可以通过类名直接调用static修饰的方法
    static create(){

    }
}
class AppleFactory extends Factory{
    static create(){
        return new Apple('苹果','甜');
    }
}
class OrangeFactory extends Factory{
    static create(){
        return new Orange('橘子','酸');
    }
}
let apple = AppleFactory.create();
let orange = OrangeFactory.create();
console.log(apple);
console.log(orange);