//造假数据  格式如下
// [
//   {
//     "id": 1,
//     "name": "xxx",
//     "sex": 0,
//     "score": 90
//   }
// ];
function getRandom(n,m){ //n到m的随机数
    return Math.round(Math.random() *(m-n) +n)
}
var str1="赵钱孙李周五郑王";//百家姓 0-7
var str2 = "一二三四五六七八九";//0-8
var str3 = "国名火燃新鑫梦妹"; //0-7

var arr = [];
for(var i=0;i<20;i++){
    var obj = {}
        obj["id"] = i;
        obj["name"] = str1[getRandom(0,7)]+str2[getRandom(0,8)]+str3[getRandom(0,7)]
        obj["sex"] = getRandom(0,1);
        obj["score"] = getRandom(50,99)   
    arr.push(obj)
}
console.log(JSON.stringify(arr))
var fs = require('fs');
var path = require('path');
// console.log(path.join(__dirname,"test.json"))
//C:\Users\xjm\Desktop\crm\json\test.json

fs.writeFileSync(path.join(__dirname,"test.json"),JSON.stringify(arr),"utf-8")