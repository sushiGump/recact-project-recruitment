let express = require('express');
let router = express.Router();

const md5 = require("blueimp-md5");
const {UserModel,ChatModel} = require("../db/models");
const filter = {password:0,__v:0};  //查询时过滤指定的属性


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'});
});

//*******用户注册的路由*******
router.post('/register',function (req,res) {
  const {username,type,password} = req.body;
 
  UserModel.findOne({username},function (error,userDoc) {

    if (userDoc){    

      res.send({code:1,msg:"用户已存在"})

    }else{           

      new UserModel({username,password:md5(password),type}).save(function (error,userDoc) {

        const data = {username,type,_id:userDoc._id};

        res.cookie("userid",userDoc._id,{maxAge:1000*60*60*24});  // 持久化cookie, 浏览器会保存在本地文件

        res.send({code:0,data})
      })
    }
  })

});


//*******用户登录的路由*******
router.post("/login",function (req,res) {
  const {username,password} = req.body;
  UserModel.findOne({username,password:md5(password)},filter,function (error,userDoc) {
    if (userDoc){     

      res.cookie("userid",userDoc._id,{maxAge:1000*60*60*24});

      res.send({code:0,data:userDoc})
    }else {           

      res.send({code:1,msg:"用户或密码不正确"})
    }
  })
});


//*******更新用户信息的路由*******
router.post("/update",function (req,res) {
  const user = req.body;    
  const {userid} = req.cookies;

  if (!userid){
    res.send({code:1,msg:"请先登录"});
    return
  }

 
  UserModel.findByIdAndUpdate({_id:userid},user,function (error,oldUser) {

    if (!oldUser){
      res.clearCookie("userid");

    }else{
      const {_id,username,type} = oldUser;   
      const data = Object.assign(user,{_id,username,type});

      res.send({code:0,data})
    }

  })
});

//*******根据cookie从数据库中获取到对应的用户信息*******
router.get("/user",function (req,res) {
  const userid = req.cookies.userid;
  if(!userid){
    res.send({code:1,msg:"请先登录"});
  }else{
    UserModel.findOne({_id:userid},filter,function (error,userDoc) {
      if (!userDoc){
        res.clearCookie('userid');
        res.send({code:1,msg:"请先登录"})
      }else{
        res.send({code:0,data:userDoc})
      }
    })
  }
});

//*******获取用户列表信息的路由（根据类型）*******
router.get("/userlist",function (req,res) {
  const {type} = req.query;
  UserModel.find({type},filter,function (error,users) {
    res.send({code:0,data:users})
  })
});


//*******获取当前用户所有相关聊天信息列表*******
router.get("/msglist",function (req,res) {
  const userid = req.cookies.userid;

  UserModel.find(function (err,userDocs) {

    const users = userDocs.reduce((users, user) => {
      users[user._id] = {username: user.username, header: user.header};
      return users
    } , {});
   
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, function (err, chatMsgs) {
      res.send({code: 0, data: {users, chatMsgs}})
    })

  });
});


//*******修改指定信息为已读*******
router.post("/readmsg",function (req,res) {
  const from = req.body.from;

  const to = req.cookies.userid;


  ChatModel.update({from,to,read:false},{read:true},{multi:true},function (err,msgs) {

    res.send({code: 0, data: msgs.nModified}) 
  })

});

module.exports = router;
