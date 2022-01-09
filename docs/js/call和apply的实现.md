## call

```javascript
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 1
```
call在调用时做了这几件事情

- this直线