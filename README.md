# node搭建服务器

# 使用方法
```
cd sample
mkdir css  //建立资源文件夹目录
mkdir imgs
mkdir jscode
vim index.html  //调用静态资源
cd ..
node index.js  //开启静态服务器
```

# 实现原理
### 1. 建立文件夹
![](http://ww1.sinaimg.cn/large/b0a870abgy1fqi7opw6xkj20s009i3zk.jpg)
```
mkdir node-server
touch index.js
mkdir sample
cd sample
touch index.html
```

### 2. 创建服务器对象

```
//将node模块赋值给变量
const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')

//创建一个Web服务器对象
const server = http.createServer(function(req,res){
	routePath(req,res)
})
server.listen(8080)
console.log('please visit http://localhost:8080')
```

### 3. 服务器处理请求
```
function routePath(req,res){
	let pathObj = url.parse(req.url,true) 
	console.log(pathObj)
	let handleFn = routes[pathObj.pathname]
	//动态资源
	if(handleFn){
		req.query = pathObj.query

		//处理post请求
		let body = ''
		req.on('data',function(chunk){
			body += chunk
		}).on('end',function(){
			req.body = parseBody(body)
			handleFn(req,res)
		})
			
	} else{
		staticRoot(path.resolve(__dirname,'sample'),req,res) //静态资源
	}
}

//处理路由
const routes = {
  '/a': function(req, res){
    res.end(JSON.stringify(req.query))
  },

  '/b': function(req, res){
    res.end('match /b')
  },

  '/a/c': function(req, res){
    res.end('match /a/c')
  },

  '/search': function(req, res){
    res.end('username='+req.body.username+',password='+req.body.password)

  }
}
  //表单数据处理
function parseBody(body){
	console.log(body)
	var obj = {}
	body.split('&').forEach(function(str){
	obj[str.split('=')[0]] = str.split('=')[1]  
	//{ username: 'adsasda', password: 'asd' }
	})
	console.log(obj)
	return obj
}

//返回静态资源或者error
function staticRoot(staticPath, req, res){
  var pathObj = url.parse(req.url, true)
  if(pathObj.pathname === '/'){
    pathObj.pathname += 'index.html'
  }
  var filePath = path.join(staticPath, pathObj.pathname)
  fs.readFile(filePath,'binary', function(err, content){
    if(err){
      res.writeHead('404', 'haha Not Found')
      return res.end('<h1>404 Not Found</h1>')
    }

    res.writeHead(200, 'Ok')
    res.write(content, 'binary')
    res.end()  
  })

}

```
