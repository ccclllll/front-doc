const http = require('http')
const fs = require('fs')
const path = require("path");

const ct = '0kTcznCjLrgc8UMxREREzR81khWS6Rr-HLtEctmpJ4yfeyouzH_mvcCYWUK_hwDZ0J6sJabA61D-f6797MZT16x-etfAcm7bJe_zS8xnCNPCSE6-2kMX_9nlhV-Ti-O-wj-LiBFX3rUYGPKClQFYwCgxLZcS2I2JM61fvQ319oM'
const ut = 'FobyicMgeV5n3saZh_euZ_jbdXlrBcpF8lobg5tMh2cqEi7nJHYxlScLcP_2umMETN80V01qeR31-f_ckhi5EOQBzVXTb6vhAB_fqeDhyXLFq7tyzgMORJq-SkbOvWsG_NznzlRZaPucCzVFZNGRqAx4FvO5qlAaY1oBp7fYQzbc3Fx7F9gflCfbN2JZBuLNvw-QsGQcaSgugELs0hcH7ZLoPJimuVPkOINSq2tG7wzjEGQJd9zZGk0XkMiLf1mEEBMWpgQYaFM'
const appKey = '3a9a55f76474bde89ecabc1d6914a7f'
const baseurl = '10.228.144.27'
const Referer = 'http://www.eastmoney.com/'

const options = {
    hostname: baseurl,
    path: '/v4/fapp/aszlot',
    method: 'post',
    headers: {
        'Content-Type': 'application/json',
        ct,
        ut,
        Referer,
        appKey
    }
};


function addStocksToServer(stocks) {
    let postData = {
        scs: stocks
    }

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.')
        })
    });

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });

    req.write(JSON.stringify(postData));
    req.end();
}



function deleteStockFromServer(stock) {
    let postData = {
        sc: stock,
        gid: '1'
    }

    const _options = Object.assign(options, {
        path: '/v4/fapp/ds',
    })

    const req = http.request(_options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
          //  console.log('No more data in response.')
        })
    });

    req.on('error', (e) => {
        console.log(`problem with request: ${e.message}`);
    });

    req.write(JSON.stringify(postData));
    req.end();
}

function addStocks(num) {
    getLocalStocks((arr) => {
        let addArr = arr.slice(0, num).map(item => {
            return item[0] + '$' + item[1]
        })
        addStocksToServer(addArr.join(','))
    })
}

function getLocalStocks(callback) {
    const fileUrl = path.resolve(__dirname, './股票.txt')
    fs.readFile(fileUrl, 'utf-8', (err, data) => {
        let arr = JSON.parse(data)
        callback(arr)
    })
}

function deleteStocks(num) {
    getLocalStocks((arr) => {
        let deleteArr = arr.slice(0, num).map(item => {
            return item[0] + '$' + item[1]
        })

        for(let index = 0; index<num; index++) {
            setTimeout(()=>{
                deleteStockFromServer(deleteArr[index])
            },500)
        }
    })
}

deleteStocks(490)
//addStocks(490)