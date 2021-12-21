function newOperator(constructor) {
    if(typeof constructor !== 'function'){
        return '必须传入构造函数'
    }
    let obj = {}

   // obj = Object.create(constructor.prototype) // 继承constructor的原型
    obj.__proto__ = constructor.prototype

    let result = constructor.call(obj, ...Array.from(arguments).slice(1))
    //let result = constructor.apply(obj, Array.from(arguments).slice(1))

    return result instanceof Object ? result : obj
}

function Dog(name,age){
    this.name = name
    this.age = age
}
Dog.prototype.sayName = function() {
    console.log(this.name)
}
newOperator(Dog, 'aa', 'bb').sayName()


