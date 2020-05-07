/*消息界面路由容器组件*/

import React, {Component} from "react"
import {connect} from "react-redux"
import {List, Badge} from 'antd-mobile'

const Item = List.Item;
const Brief = Item.Brief;

/*实现的功能：根据聊天时间的早晚显示哪个聊天组在最上面
    对chatMsgs按chat_id进行分组，并得到每个组的lastMsg组成的数组
        1.找出每个聊天的lastMsg,并用一个对象容器来保存{chat_id,lastMsg}
        2.得到lastMsg的数组[{chat_id:lastMsg},{}...]
        3.对lastMsg的数组进行排序（根据creat_time）
    */
function getLastMsg(chatMsgs,userid){
    const lastMsgObjs = {};

    chatMsgs.forEach(msg =>{     //此处的msg表示的是我和某个人的聊天列表

        if (msg.to===userid && !msg.read){
            msg.unReadCount = 1;
        }else{
            msg.unReadCount = 0;
        }

        const chatId = msg.chat_id;

        let lastMsg = lastMsgObjs[chatId];

        if(!lastMsg){
            lastMsgObjs[chatId] = msg

        }else{
            const unReadCount = lastMsg.unReadCount + msg.unReadCount;

            if(msg.create_time > lastMsg.create_time){
                lastMsgObjs[chatId] = msg 
            }
            lastMsgObjs[chatId].unReadCount = unReadCount;

        }
    });

    const lastMsgs = Object.values(lastMsgObjs); 

    lastMsgs.sort(function (m1,m2) {
        return  m2.create_time-m1.create_time;
    });
    return lastMsgs;
}


class Message extends Component {

    render() {
        const {user} = this.props;
        const {users,chatMsgs} = this.props.chat;

        const lastMsgs = getLastMsg(chatMsgs,user._id);

        return (
            <List style={{marginTop:50,marginBottom:50}}>
                {
                    lastMsgs.map(msg => {
                        const targetUserId = msg.to===user._id ? msg.from : msg.to;
                        const targetUser = users[targetUserId];
                        return (
                            <Item
                                key={msg._id}
                                extra={<Badge text={msg.unReadCount}/>}
                                thumb={targetUser.header ? require(`../../assets/images/${targetUser.header}.png`) : null}
                                arrow='horizontal'
                                onClick={() =>this.props.history.push(`/chat/${targetUserId}`) }
                            >
                                {msg.content}
                                <Brief>{targetUser.username}</Brief>
                            </Item>
                        )
                    })
                }
            </List>
        )
    }
}

export default connect(
    state => ({user:state.user,chat:state.chat}),
)(Message)
