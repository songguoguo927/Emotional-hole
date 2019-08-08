//ajax 分页--与增删查改合并
/**
 * 1.分析客户端，服务端做些啥
 * 2.写api接口
 * 3，在服务器处理数据
 */
var http = require("http"),
  Url = require("url"),
  fs = require("fs");

var server = http.createServer(function(req, res) {
  var urlObj = Url.parse(req.url, true),
    pathname = urlObj["pathname"],
    query = urlObj["query"];

  //-->静态资源（项目）文件的请求处理，服务端接收到具体的请求文件后把文件中的源代码
  //返回给客户端进行渲染即可
  //->静态资源文件请求处理
  var reg = /\.(HTML|CSS|JS|ICO)/i;
  if (reg.test(pathname)) {
    var suffix = reg.exec(pathname)[1].toUpperCase();
    var suffixMIME = "text/html";
    switch (suffix) {
      case "CSS":
        suffixMIME = "text/css";
        break;
      case "JS":
        suffixMIME = "text/javascript";
        break;
    }
    try {
      var conFile = fs.readFileSync("." + pathname, "utf-8");
      res.writeHead(200, { "content-type": suffixMIME + ";charset=utf-8;" });
      res.end(conFile);
    } catch (e) {
      res.writeHead(404, { "content-type": "text/plain;charset=utf-8;" });
      res.end("文件未找到");
    }
    return;
  }

  //-->API接口文档中规定的数据的请求处理
  var studentPath="./json/student.json" 
 var data = JSON.parse(fs.readFileSync(studentPath,"utf-8"));

//  console.log(data)
  if (pathname === "/getList") {
     var n = query["n"],
       arr = [];
     for (var i = (n - 1) * 10; i <= n * 10 - 1; i++) {
       if (i > data.length - 1) {
         break;
       }
       arr.push(data[i]);
    }
     res.writeHead(200, { "content-type": "application/json;charset=utf-8;" });
    res.end(
      JSON.stringify({
        code: 0,
        msg: "success",
        total: Math.ceil(data.length / 10),
        data: arr
       })
  );
     return;
 }

  if (pathname === "/getInfo") {
    var stuId = query["id"],
      obj = null;
    for (var i = 0; i < data.length; i++) {
      if (data[i]["id"] == stuId) {
        obj = data[i];
      }
    }
    var result = {
      code: 0,
      msg: "内容不存在",
      data: null
    };
    if (obj) {
      result = {
        code: 0,
        msg: "成功",
        data: obj
      };
    }
    res.writeHead(200, { "content-type": "application/json;charset=utf-8;" });
    res.end(JSON.stringify(result));
    return;
  }

  if (pathname === "/removeInfo") {
    var stuId = query["id"];
   var result = {
      code: 1,
      msg: "删除失败"
    };
    var flag = false;
    for (var i = 0; i < data.length; i++) {
      if (data[i]["id"] == stuId) {
        // delete(data[i])
        data.splice(i, 1);
        flag = true;
        break;
      }
    }

    if (flag) {
      fs.writeFileSync(studentPath, JSON.stringify(data), "utf-8");
      result = {
        code: 0,
        msg: "删除成功"
      };
    }
    res.writeHead(200, { "content-type": "application/json;charset=utf-8;" });
    //返回客户端的时json字符串
    res.end(JSON.stringify(result));
    return;
  }

  if (pathname === "/addInfo") {
    var str = '';
    req.on('data',function(chunk){
      str += chunk;
    })
    req.on('end',function(){
      if(str.length===0){
        res.writeHead(200, {
          "content-type": "application/json;charset=utf-8;"
        });
        //返回客户端的时json字符串
        res.end(
          JSON.stringify({
            code: 1,
            msg: "add failed"
          })
        );
        return;
      }

      //传输成功则获取  后台给传过来的数据加id
      var newData = JSON.parse(str);
      if(data.length === 0){
        newData.id = 1;
      }else{
        newData.id = parseFloat(data[data.length-1]["id"]) + 1;
      }
      data.push(newData);
      fs.writeFileSync(studentPath,JSON.stringify(data),"utf-8")
    })

    res.writeHead(200, { "content-type": "application/json;charset=utf-8;" });
    //返回客户端的时json字符串
    res.end(
      JSON.stringify({
        code: 0,
        msg: "add success"
      })
    );
    return;
  }

  if(pathname==="/updateInfo"){
    str = "";
    req.on('data',function(chunk){
      str += chunk;
    })
    req.on("end",function(){
      if (str.length === 0) {
        res.writeHead(200, {
          "content-type": "application/json;charset=utf-8;"
        });
        //返回客户端的时json字符串
        res.end(
          JSON.stringify({
            code: 1,
            msg: "修改失败，没有传递任何需要修改的信息"
          })
        );
        return;
      }
      //拿到要更改的用户id，去遍历data 然后修改对应的值
      var flag = false;
      var updateData = JSON.parse(str);
      for (var i = 0; i < data.length; i++) {
        if (data[i]["id"] == updateData["id"]) {
          //写成===害死人
          data[i] = updateData;
          flag = true;
          break;
        }
      }

      if (flag) {
        //更改完con，重新写入
        console.log("--");
        fs.writeFileSync(studentPath, JSON.stringify(data), "utf-8");
        // result = {
        //   code: 0,
        //   msg: "修改成功"
        // };
      }
    })

    res.writeHead(200, { "content-type": "application/json;charset=utf-8;" });
    //返回客户端的时json字符串
    res.end(
      JSON.stringify({
        code: 0,
        msg: "修改成功"
      })
    );
    return;
  }

  //实现批量删除，获取前台post传过来的数据类似{ids:'1,2,3'}
  if(pathname==="/batchDelete"){
    str = "";
    req.on('data',function(chunk){
      str += chunk;
    })
    req.on("end",function(){
      var idsObj = JSON.parse(str);
      var idsArr = idsObj.ids.split(',');
      // console.log(idsArr)
      idsArr.forEach(function(item){
        for(var i =0;i<data.length;i++){
        //找出数组中id和data中id相同的
          if(item==data[i]["id"]){
            data.splice(i,1)
          }
        }
      })
      // console.log(data)
      // 判断完成，重新写入数据
      fs.writeFileSync(studentPath, JSON.stringify(data), "utf-8");
     
  })
  res.writeHead(200, { "content-type": "application/json;charset=utf-8;" });
  //返回客户端的时json字符串
    res.end(
      JSON.stringify({
        code: 0,
        msg: "批量删除完成"
      })
    );
    return;
}


  res.writeHead(404, { "content-type": "text/plain;charset=utf-8;" });
  res.end("请求的数据接口不存在");
});

server.listen(88, function() {
  console.log("服务启动在88端口");
});
