import React, {Component} from "react"
import {connect} from "react-redux"
import {NavBar, List, InputItem, Grid,Icon} from "antd-mobile";
import QueueAnim from "rc-queue-anim"


import {sendMsg,readMsg} from "../../redux/actions"

const Item = List.Item;

class Chat extends Component {
    state = {
        content: "",
        isShow: false,  //默认为不显示
    };

    componentDidMount() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight)
    }

    componentWillUnmount() {
      
        const from = this.props.match.params.userid;
        const to = this.props.user._id;

        this.props.readMsg(from,to);
    }

    componentWillMount() {
        const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
            "😀", "😃", "😄,", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😜",
            "😉", "😊", "😇", "😍", "😘", "😗", "☺", "😚", "😙", "😋", "😛", "😜",
            "😉", "😊", "😇", "😍", "😘", "😗", "☺", "😚", "😙", "😋", "😛", "🤐",
            "😝", "🤗", "🤔"];
        this.emojis = emojis.map(emoji => ({text: emoji}))
    }

    toggleShow = () => {
        const isShow = !this.state.isShow;
        //设置isShow的状态
        this.setState({isShow});

        // 异步手动派发resize事件,解决表情列表显示的bug
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'))
        }, 0)
    };


    handleSend = () => {
        const from = this.props.user._id;
        const to = this.props.match.params.userid;
        const content = this.state.content.trim();

        if (content) {
            this.props.sendMsg({from, to, content});
            this.setState({
                content: "",
                isShow: false
            });
        }

    };

    render() {

        const {user} = this.props;
        const {users, chatMsgs} = this.props.chat;

        const meId = user._id;

        if (!users[meId]) {
            return null;
        }

        const targetId = this.props.match.params.userid;
        const chatId = [meId, targetId].sort().join("_");

        const msgs = chatMsgs.filter(msg => msg.chat_id === chatId);

        const targetHeader = users[targetId].header;
        const targetIcon = targetHeader ? require(`../../assets/images/${targetHeader}.png`) : null;

        return (
            <div id="chat-page">
                <NavBar
                    icon={<Icon type="left"/>}
                    className="sticky-header"
                    onLeftClick={()=>this.props.history.goBack()}
                >
                    {users[targetId].username}
                </NavBar>
                <List style={{marginTop:50,marginBottom:50}}>
                    <QueueAnim type="alpha" delay={100}>
                        {
                            msgs.map(msg => {
                                if (targetId === msg.from) {     //对方发给我的
                                    return (<Item
                                        key={msg._id}
                                        thumb={targetIcon}
                                    >
                                        {msg.content}
                                    </Item>)
                                } else {
                                    return (<Item
                                        key={msg._id}
                                        className="chat-me"
                                        extra='我'
                                    >
                                        {msg.content}
                                    </Item>)
                                }
                            })
                        }
                    </QueueAnim>
                </List>
                <div className="am-tab-bar">

                    <InputItem
                        placeholder="请输入消息"
                        onChange={val => this.setState({content: val})}
                        onFocus={() => {
                            this.setState({isShow: false})
                        }}
                        value={this.state.content}
                        extra={
                            <span>
                                 <span onClick={this.toggleShow}>😄</span>
                                 <span onClick={this.handleSend}>发送</span>
                            </span>
                        }
                    />

                    {
                        this.state.isShow ? (
                            <Grid
                                data={this.emojis}
                                columnNum={8}
                                isCarousel={true}
                                carouselMaxRow={4}
                                onClick={(emoji) => {
                                    this.setState({content: this.state.content + emoji.text})
                                }}
                            />
                        ) : null
                    }

                </div>
            </div>
        )
    }
}

export default connect(
    state=> ({user: state.user,chat: state.chat}),
    {sendMsg,readMsg}
)(Chat)
