// function foo() {
//    // console.log(a);
//     a = 1;
// }

// foo(); // ???

// function bar() {
//     a = 1;
//     console.log(a);
// }
// bar(); // ???

// function test(b) {
//     console.log(b)
//     function b() {

//     }

//     var b = '123123'

// }
foo()
console.log(foo);
var foo = 1;
console.log(foo)
function foo(){
    console.log("foo");
}




// test(1)

// 750 15px

// 1.5rem * x = 15

// x=10

// (width / 750) *100


var a = 99;            // 全局变量a
f();                   // f是函数，虽然定义在调用的后面，但是函数声明会提升到作用域的顶部。 
console.log(a);        // a=>99,  此时是全局变量的a
function f() {
  console.log(a);      // 当前的a变量是下面变量a声明提升后，默认值undefined
  var a = 10;
  console.log(a);      // a => 10
}

// 输出结果：
