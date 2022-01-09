var data = [];

for (var i = 0; i < 3; i++) {
    var fun = function(i) {
        return  function () {
        console.log(i);
        };
    }

    data[i] = fun(i)
}

data[0]();
data[1]();
data[2]();