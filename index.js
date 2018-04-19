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
