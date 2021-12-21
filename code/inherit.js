function Parent (name) {
    this.name = name
}

Parent.prototype.sayName = function() {
    console.log(this.name)
}

function Child(name, age) {
    Parent.call(this, name)
    this.age = age
}

function inherit(child, Parent) {
    let o = Object.create(Parent.prototype) // 以父类原型复制一个对象

    child.prototype = o  // 子类原型指向这个对象

    o.constructor = child // 赋值构造函数

}

inherit(Child, Parent)

let child = new Child('zs', 14)
child.sayName() // zs
// console.log(child)
// console.log(Parent.prototype.constructor )
// console.log(Child.prototype.__proto__.constructor )