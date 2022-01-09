const http = require('http')
const fs = require('fs')
const path = require("path");
const baseurl = 'appiiexternal3.eastmoney.com'
const options = {
    hostname: baseurl,
    path: '/corparation_list_stock/list?cls=StockHolderList&from=huawei_fastapp&list=hsj&field=ratio&pagesize=500&pageindex=1&format=json&reverse=0',
    method: 'get',
    headers: {}
};

const fileUrl = path.resolve(__dirname, './股票.txt')
const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    let strs = ''
    res.on('data', (chunk) => {
       // console.log(`BODY: ${chunk}`);
        strs += chunk
        //const stocks = JSON.parse(chunk)


    });
    res.on('end', () => {
        fs.writeFile(fileUrl, strs, (err) => {
            if (err) {
                console.error(err)
                return
            }
        })
        console.log('No more data in response.')
    })
});



req.on('error', (e) => {
    console.log(`problem with request: ${e.message}`);
});


req.end();