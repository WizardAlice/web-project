const  moment = require('moment')
const jwt = require('jwt-simple')


const jwtTokenSecret = 'MY_SECRET_STRING'

function getToken(username, res){ //返回token
  let expires = moment().add('days', 7).valueOf()
  var token = jwt.encode({
    username: username,
    exp: expires
  }, jwtTokenSecret)
  res.setHeader('set-cookie', ['token='+token, 'expires='+expires, 'username='+username] , {httpOnly : true})
  // res.cookie('token='+token, 'expires='+expires, 'username='+username, { httpOnly:true })
  // res.cookie('token='+token, 'expires='+expires, 'username='+username, { httpOnly:true })
  res.send(303)
}

function getIndex(req,res,next){  //得到token之后进行解码验证
  let token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'] || (req.cookies && req.cookies.token)
  if(token){
    try{
      let decoded = jwt.decode(token, jwtTokenSecret)
      next()
    }catch(err){
      res.send(401)
    }
  }else{
    res.redirect('/login')
  }
}

module.exports = {
  getToken: getToken,
  getIndex: getIndex
}