
import {combineReducers} from "redux";

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

import {getRedirectTo} from "../utils"



const initUser = {
    username:"",
    type:"",
    msg:"",
    redirectTo:""  //需要自动重定向的路由路径
};

function user(state=initUser,action) {
    switch (action.type) {
        case AUTH_SUCCESS:      
            const {type,header} = action.data;
            //授权成功后应该跳转到某一页面
            return {...action.data,redirectTo: getRedirectTo(type,header)};
        case ERROR_MSG:         
            return {...state,msg:action.data};
        case RECEIVE_USER:        
            return action.data;
        case RESET_USER:         
            return {...initUser,msg:action.data};
        default:
            return state;
    }
}


const initUserList = [];

function userList(state=initUserList,action) {
    if (action.type === RECEIVE_USER_LIST) {
        return action.data;
    } else {
        return state
    }
}


//产生chat状态的reducer
const initChat = {
    users:{},       //所有用户信息的对象 
    chatMsgs:[],    //当前用户(相当于1对多的关系)相关msg(每一条)的数组
    unReadCount:0   //总的未读数量
};
function chat(state=initChat,action) {
    switch (action.type) {
        case RECEIVE_MSG_LIST:
            const {users,chatMsgs,userid} = action.data;
            return  {
                users,
                chatMsgs,
                unReadCount:chatMsgs.reduce((preTotal,msg) => preTotal + (!msg.read&&msg.to===userid?1:0),0)
            };
        case RECEIVE_MSG: //data:chatMsg  //与我有关的msg消息列表
            //const {chatMsg,userid}= action.data;中userid属于重复声明

            const {chatMsg}= action.data;   //chatMsg实际上就是msg
            return  {
                users:state.users,
                chatMsgs:[...state.chatMsgs,chatMsg],
                unReadCount:state.unReadCount + (!chatMsg.read&&chatMsg.to===action.data.userid?1:0)
            };
        case MSG_READ:
            const {count,from,to} = action.data;
            return {
                users: state.users,
                /*先要找到每一条消息中未读的，并且修改他们数据结构中（属性）的read为true*/
                chatMsgs:state.chatMsgs.map(msg =>{
                    if (msg.from===from && msg.to===to && !msg.read){
                        return {...msg,read:true} 
                    }else{   
                        return msg;
                    }
                }),

                unReadCount:state.unReadCount - count  /*用之前状态中的未读消息数量减去从后台获取并传递过来的已读消息的数量*/

            };
        default:
            return state;
    }
}

export default combineReducers({
    user,
    userList,
    chat
})
/*向外暴露的状态的结构：{ user:{}，userList:[],chat:{} }*/


