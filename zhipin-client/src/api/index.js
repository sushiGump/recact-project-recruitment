/*
    给接口定义对应的Ajax请求函数
            是包含了n个接口请求的函数模块

    函数返回值为：promise
*/
/*export function f() {

}*/

import ajax from "./ajax";

/*注册接口的请求函数*/
export const reqRegister = (user)=> ajax("/register",user,"POST");
//user:{username,password,type}

/*登录接口的请求函数*/
export const reqLogin = (user)=> ajax("/login",user,"POST");

/*更新用户信息接口的请求函数*/
export const reqUpdateUser = (user)=> ajax("/update",user,"POST");

/*根据cookie中的userid获取user信息的请求函数*/
export const reqUser = ()=> ajax("/user");

/*获取用户列表*/
export const reqUserList = (type) => ajax("/userlist", {type});

/*获取当前用户的聊天消息列表*/
export const reqChatMsgList = () => ajax("msglist");

/* 修改指定消息为已读*/
export const reqReadMsg = (from) => ajax("/readmsg", {from},"POST");
