let num = '10000000.0'
/**
 * 分位表示 
 * @param {*} num 
 * @param {*} reg 正则表达式，若果是千位表示，可传入 /(\d\d\d)/g 百位表示则为：/(\d\d)/g
 * @returns 
 */
function quantileFormat(num, reg) {
    function strReverse(str) {
        return str.split('').reverse().join('')
    }
    try{
        num = num.toString()
        let islessThanZero = num.indexOf('-')> -1
        if(islessThanZero){
            num =  num.substring(1,num.length)
        }
        let nums = num.toString().split('\.')
        let _int = strReverse(nums[0])
        _int = strReverse(_int.replace(reg, '$1,'))
        let _decimal = nums[1] ? nums[1].replace(reg, '$1,') : ''
        let ret = _decimal.length > 0 ? `${_int}.${_decimal}` : _int
        ret = ret.replace(/^,|\,$/g, '')
        return islessThanZero ? '-' + ret : ret
    }catch(e){
        return num
    } 
}
console.log(quantileFormat(num, /(\d\d)/g))