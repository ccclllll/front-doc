/**
 * js采用\uxxxx表示字符，范围为\u0000~\uffff,超过这个范围需要双字节表示
 * 
 */
let str1 = "\u20BB7" // 超出\uffff, js理解为 \u20BB+7，\u20BB是不可打印字符
console.log(str1) // ' 7' // es

let str2 = "\uD842\uDFB7" // 双字节表示
console.log(str2) // 𠮷

let str3 = "\u{20BB7}" // 中括号表示 es6
console.log(str3) // 𠮷

// es6表示字符的形式

'\z' === 'z' // true
'\172' === 'z' // true
'\x7A' === 'z' // true \x表示单字节编码，两位十六进制
'\u007A' === 'z' // true
'\u{7A}' === 'z' // true

// 遍历
for (let codePoint of "\u20BB7") {
    console.log(codePoint)
}


// 遍历器可正确识别码点
let text = String.fromCodePoint(0x20BB7);

for (let i = 0; i < text.length; i++) {
    console.log(text[i]);
}
// " "
// " "

for (let i of text) {
    console.log(i);
}
// "𠮷"


function compile(template) {
    const evalExpr = /<%=(.+?)%>/g;
    const expr = /<%([\s\S]+?)%>/g;

    template = template
        .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
        .replace(expr, '`); \n $1 \n  echo(`');

    template = 'echo(`' + template + '`);';

    let script =
        `(function parse(data){
      let output = "";
  
      function echo(html){
        output += html;
      }
  
      ${ template }
  
      return output;
    })`;

    return script;
}

let template = `
  <ul>
    <% for(let i=0; i < data.supplies.length; i++) { %>
      <li><%= data.supplies[i] %></li>
    <% } %>
  </ul>
  `;

let parse = eval(compile(template));
parse({
    supplies: ["broom", "mop", "cleaner"]
});