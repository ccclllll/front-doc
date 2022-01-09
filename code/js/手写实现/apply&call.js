var foo = {
    value: 1
};

function bar(v) {
   return this.value + v
}

//bar.call(foo); // 1
// console.log(bar.call(foo))

Function.prototype.myCall = function(context) {
    context.fun = this
    var args = Array.from(arguments).slice(1)
    var argStr = args.toString()
    var res =  eval(`context.fun(${argStr})`) // context来调用函数，达到改变this指向的目的
    delete context.fun
    return res
}


Function.prototype.myApply = function(context,args){
    context.fun = this
    var argStr = args.toString()
    var res =  eval(`context.fun(${argStr})`) // context来调用函数，达到改变this指向的目的
    delete context.fun
    return res 
}
console.log(bar.myCall(foo, 1))
console.log(bar.myApply(foo, [1]))