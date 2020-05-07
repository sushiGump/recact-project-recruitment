
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/zhipin2');/*,{useNewUrlParser: true}*/

const conn = mongoose.connection;

conn.on("connected", () => {
    console.log("数据库连接成功")
});

//约束：描述文档结构
let userSchema = new mongoose.Schema({
    username: {type: String, required: true}, // 用户名
    password: {type: String, required: true}, // 密码
    type: {type: String, required: true}, // 用户类型: dashen/laoban
    header: {type: String}, // 头像名称
    post: {type: String}, // 职位
    info: {type: String}, // 个人或职位简介
    company: {type: String}, // 公司名称
    salary: {type: String}   //月薪
});

const UserModel = mongoose.model("user", userSchema);

exports.UserModel = UserModel;


// 定义 chats 集合的文档结构
let chatSchema = new mongoose.Schema({
    from: {type: String, required: true}, // 发送用户的  id
    to: {type: String, required: true}, // 接收用户的 id
    chat_id: {type: String, required: true}, // from 和 to 组成的字符串
    content: {type: String, required: true}, // 内容
    read: {type: Boolean, default: false}, // 标识是否已读
    create_time: {type: Number}// 创建时间:用于排序使用
});

// 定义能操作chats集合数据的Model
let ChatModel = mongoose.model("chats", chatSchema); // 集合为: chats
// 向外暴露Model
exports.ChatModel = ChatModel;




//commonJS中向外暴露的两种方式
//一次性暴露：module.exports = xxx
//多次暴露：exports.xxx = value
