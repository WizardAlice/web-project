const express = require('express'), //引入express模块
    app = express(),
    server = require('http').createServer(app),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    { getToken, getIndex } = require('./methods');

const cookieParser = require('cookie-parser')
const path = require('path')
//     io = require('socket.io')(require('http'));

app.use(logger())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('../src/assets'))
app.use('/static',express.static('../dist/static'))

app.get('/login',(req,res)=>{
  let temp_path = path.resolve(__dirname, '..')
  res.sendFile(temp_path+'/template/login.html')
})



// 'Set-Cookie': 'SSID=Ap4GTEq; Expires=Wed, 13-Jan-2021 22:23:01 GMT;HttpOnly '

// app.use((req, res, next)=>getIndex(req, res, next))

app.post('/login', (req, res)=>{ //测试登录，返回一个token
  debugger
  if(req.body.user == 'wangtong' && req.body.pwd == '123456'){
    getToken('wangtong', res)
  }else{
    res.send(401)
  }
})

app.use((req, res, next)=>getIndex(req, res, next))

app.get('/index', (req, res) => {
  let temp_path = path.resolve(__dirname, '..')
  res.sendFile(temp_path + '/dist/index.html')
})

app.use('/',function(req,res,next){ 
  res.redirect('/index')
})

// app.use('/*',function(req,res,next){ 
//   let temp_path = path.resolve(__dirname, '..')
//   res.sendFile(temp_path + '/dist/index.html')
// })

// app.get('/', (req, res)=>{ //测试登录，返回一个token
//   res.redirect('/index')
// })


// app.use('/index', (req, res) => { ///////////////////////////////
//   // res.header('refresh', '5;url=http://localhost:8080/teststatus')
//   res.sendFile(__dirname + '/WebSocket.html')
// }); //指定静态HTML文件的位置  

app.get('/index', (req, res) => {
  let temp_path = path.resolve(__dirname, '..')
  res.sendFile(temp_path + '/dist/index.html')
})


// app.all('*', function(req, res, next) {//开发模式下允许跨域访问
//     // res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
//     next();
// })

// app.post('/teststatus', (req, res) => {
//   res.send(302)
// })

// app.get('/teststatus', (req, res) => {
//   res.send("nihao")
// })

let port = process.argv[2] || 3000

console.log(process.argv[2])

server.listen(port, ()=>{
  console.log(`node服务器运行在${port}端口`)
  console.log("通过访问 chrome://inspect/#devices 来进行调试")
})

// io.on('connection', (socket) => {
//  console.log(socket)
// })

const WebSocketServer = require('ws').Server
const uuid = require('node-uuid')

wss = new WebSocketServer({port: 8181})

var clients = []

wss.on('connection',(ws)=>{
  let client = {
    name: "未知",
    id: uuid.v4(),
    socket: ws
  }
  clients.push(client)
  console.log("connection")
  ws.on('message', (message)=>{
    let data = JSON.parse(message)
    switch(data.type){
      case 'messageToAll' : 
        sendMessage(client, data.mes)
        break;
      case 'changeName' :
        client.name = data.mes
        changeName(client.id, data.mes)
        break;
      case 'messageToOne': 
        sendMessageOne(data.target, data.mes)
        break;
    }
  })
})

sendMessageOne = (targetName, mes) =>{
  clients.map((client)=>{
    if(client.name == targetName && client.socket.readyState == 1){
      client.socket.send(JSON.stringify({
        mes: mes,
        name: targetName,
        type: 'secret'
      }))
    }
  })
}

sendMessage = (c, mes) => {
  clients.map((client, index) => {
    if(client.socket.readyState == 1){
      client.socket.send(JSON.stringify({
        mes: mes,
        name: c.name,
        type: 'public'
      }))
    }
    else{
      clients.splice(index,1)
    }
  })
}

alertAll = (id) => {
  let list = clients.map( i => i.name )
  console.log(list)
  clients.map((client, index)=>{
    if(client.socket.readyState == 1){
      client.socket.send(JSON.stringify({
        list: list,
        type: "confirmList"
      }))
    }
    else{
      clients.splice(index,1)
    }
  })
}

changeName = (id, name) => {
  clients.map((client,index)=>{
    if(client.socket.readyState == 1){
      if(client.id == id){
        client.name = name
      }
    }
    else{
      clients.splice(index,1)
    }
  })
  alertAll(id)
}

// include_attr = (x, y, key) => {
//   let flag = false
//   x.map((v) => {
//     v[key]
//   })
// }


