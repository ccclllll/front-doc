const fs = require('fs')
const path = require("path");

const fileUrl = path.resolve(__dirname, './美股.txt')
fs.readFile(fileUrl, 'utf-8', (err, data)=>{
   let arr = JSON.parse(data)
    console.log(arr[0])
})


// console.log(.resolve(__dirname, './美股.txt')); 
// console.log('__dirname : ' + __dirname)
// console.log('resolve   : ' + path.resolve('./'))
// console.log('cwd       : ' + process.cwd())