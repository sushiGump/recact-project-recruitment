/*
    包含多个action creator
        异步action函数：发Ajax请求要用异步action
        同步action函数：每一个action-type都对应一个同步action
*/

import io from "socket.io-client"


import {
    reqRegister,
    reqLogin,
    reqUpdateUser,
    reqUser,
    reqUserList,
    reqChatMsgList,
    reqReadMsg
} from "../api/index"
import {
    AUTH_SUCCESS,
    ERROR_MSG,
    RECEIVE_USER,
    RESET_USER,
    RECEIVE_USER_LIST,
    RECEIVE_MSG_LIST,
    RECEIVE_MSG,
    MSG_READ
} from "./action-types";

/*单例对象：单一的实例
    1.创建对象之前：判断对象是否已经创建存在，只有不存在才去创建
    2.创建对象之后：保存对象
*/


function initIO(dispatch,userid) {
    //1.创建对象之前：判断对象是否已经创建存在，只有不存在才去创建
    if(!io.socket){
        io.socket = io('ws://localhost:4000');

        io.socket.on("receiveMsg",function (chatMsg) {
            console.log("客户端接收到服务器端发送的消息",chatMsg)
            if (userid === chatMsg.from || userid === chatMsg.to){
                dispatch(receiveMsg({chatMsg,userid}))
            }
        });
    }
}

//异步获取消息列表数据的工具函数
async function getMsgList(dispatch,userid) {
    initIO(dispatch,userid);
    const response = await reqChatMsgList();
    const result = response.data;
    if (result.code === 0){
        const {users,chatMsgs} = result.data;
        dispatch(receiveMsgList({users,chatMsgs,userid}))
    }
}


//授权成功
export const authSuccess = (user) => ({type:AUTH_SUCCESS,data:user});

//错误提示信息
export const  errorMsg = (msg) => ({type:ERROR_MSG,data:msg});

//接收并更新用户信息
export const  receiveUser = (user) => ({type:RECEIVE_USER,data:user});

//返回登录界面并重置用户信息
export const  resetUser = (msg) => ({type:RESET_USER,data:msg});

//接收用户信息列表
const receiveUserList = (userList)=>({type:RECEIVE_USER_LIST,data:userList});

//接收消息列表
const receiveMsgList = ({users,chatMsgs,userid}) => ({type:RECEIVE_MSG_LIST,data:{users,chatMsgs,userid}});

//接收一个消息
const receiveMsg = ({chatMsg,userid}) => ({type:RECEIVE_MSG,data:{chatMsg,userid}});

//读取了某个聊天消息
const msgRead = ({count,from,to}) =>({type:MSG_READ,data:{count,from,to}});



//发送注册请求
export const register = (user) => {
    const {username, password, passwordChecked, type} = user;
    //前台的表单信息验证
    if (!username){
        return errorMsg("请输入正确的用户名");
    }else if (password !==passwordChecked){
        return errorMsg("两次密码不一致");
    }else if (!password){
        return errorMsg("请输入正确的密码");
    }

    return async dispatch => {
        const response = await reqRegister({username, password,type});
        const result = response.data;       //{code:0/1,data:user,msg:""}

        if (result.code ===0){      
            getMsgList(dispatch,result.data._id);
            dispatch(authSuccess(result.data))
        }else{                      
            dispatch(errorMsg(result.msg))
        }

    }
};


//发送登录请求
export const login = ({username, password}) => {
    if (!username){
        return errorMsg("请输入正确的用户名");
    } else if (!password){
        return errorMsg("请输入正确的密码");
    }
    return async dispatch => {

        const response = await reqLogin({username, password});
        const result = response.data;       //{code:0/1,data:user,msg:""}

        if (result.code ===0){      
            getMsgList(dispatch,result.data._id);
            dispatch(authSuccess(result.data))
        }else{                     
            dispatch(errorMsg(result.msg))
        }

    }
};


//发送更新用户信息请求
export const updateUser = (user) => {
    return async dispatch => {
        const response = await reqUpdateUser(user);    
        const result = response.data;                  

        if(result.code === 0){
            dispatch(receiveUser(result.data))
        }else {
            dispatch(resetUser(result.msg))
        }
    }

};


//发送根据cookie获取用户信息请求（实现自动登录）
export const getUser = () => {
    return async dispatch => {
        const response = await reqUser();
        const result = response.data;
        if(result.code ===0){
            getMsgList(dispatch,result.data._id);
            dispatch(receiveUser(result.data))
        }else {
            dispatch(resetUser(result.msg))
        }
    };

};


//获取用户信息列表
export const getUserList = (type) =>{
    return async dispatch => {
        const response = await reqUserList(type);
        const result = response.data;
        if (result.code === 0){
            dispatch(receiveUserList(result.data))
        }
    }
};


//发送消息
export const sendMsg = ({from, to, content}) => {
    return dispatch => {
        console.log('客户端向服务器发送消息', {from, to, content})

        io.socket.emit('sendMsg', {from, to, content})
    }
};


// 读取消息
export const readMsg = (from,to) => {
    return async dispatch =>{
        const response = await reqReadMsg(from);
        // debugger
        const result = response.data;

        if (result.code === 0){
            const count = result.data;
            dispatch(msgRead({count,from,to}))
        }
    }
};
