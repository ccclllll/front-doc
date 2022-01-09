let obj = {
    a: ['hello', {
        y: 3
    }]
}

let {
    a,
    a: [x, {
        y
    }]
} = obj
console.log(a)
console.log(x)
console.log(y)

// let x;
// ({x} = {x: 1});
// let {} = {a: 1}

console.log(new Object(true).toString())


let {
    toString: xs
} = '12312'
console.log(xs)

let {
    toString: s
} = true;
console.log(s === Boolean.prototype.toString);

(function (sbsdfsssssssa) {
    let toString;
    ({
        toString: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    } = '你是大帅比');
    sbsdfsssssssa.log(xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apply('你是大帅比'))
})(aaaaaaaaa = console)

function add([a = 0, b = 0]){
    return a + b
}

