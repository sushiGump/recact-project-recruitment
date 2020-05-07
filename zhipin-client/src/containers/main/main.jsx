import React from "react"
import {Route, Switch, Redirect} from "react-router-dom"
import {connect} from "react-redux"
import Cookies from "js-cookie"
import {NavBar} from "antd-mobile";

import {getRedirectTo} from "../../utils/index"
import {getUser} from "../../redux/actions";
import DashenInfo from "../dashen-info/dashen-info"
import LaobanInfo from "../laoban-info/laoban-info"
import Laoban from "../laoban/laoban"
import Dashen from "../dashen/dashen"
import Message from "../message/message"
import Personal from "../personal/personal"
import NotFound from "../../components/not-found/not-found"
import NavFooter from "../../components/nav-footer/nav-footer"
import Chat from "../chat/chat"

/*
为了实现自动登录的业务逻辑分析
    1.userid有值：

        1.)userid是否有值，如果有值继续检查redux中user._id是否有值，如果没有，
            表示登陆过但是目前没有登录，需要在componentDidMount中发送请求获取对应的user信息，在render的判断中先不做任何反应return null

        2.)userid是否有值，如果有值继续检查_id是否有值，如果有值跳转到对应界面，（render中进行）

                2.1)特殊情况：直接请求根路径，则需要根据user.type和user.header跳转到指定界面（render中进行）

    2.userid没值：
        userid是否有值，如果没值，跳转到登录界面（render中进行）

*/


class Main extends React.Component {
    navList = [
        {
            path: "/laoban", // 路由路径
            component: Laoban,
            title: "大神列表",
            icon: "dashen",
            text: "大神"
        },
        {
            path:"/dashen",
            component: Dashen,
            title: "老板列表",
            icon: "laoban",
            text: "老板",
        },
        {
            path:"/message",
            component: Message,
            title: "信息列表",
            icon: "message",
            text: "消息",
        },
        {
            path:"/personal",
            component: Personal,
            title: "用户中心",
            icon: "personal",
            text: "个人",
        }
    ];

    componentDidMount() {           
        const userid = Cookies.get("userid");
        const {_id} = this.props.user;
        if (userid && !_id) {
            
            this.props.getUser()       
        }
    }


    render() {
        const userid = Cookies.get("userid");
        if (!userid) {
            return <Redirect to="/login"/>
        }

        const {_id} = this.props.user;
        const {user,unReadCount} = this.props;
        let path = this.props.location.pathname;
        if (!_id) {
            return null

        } else {

            const {type, header} = this.props.user;
            if (path === "/") {
                path = getRedirectTo(type, header);
                return <Redirect to={path}/>
            }
        }


        const {navList} = this;
        const currentNav = navList.find(nav => nav.path === path);

        if (currentNav){
            if (user.type === "laoban"){
                navList[1].hide = true;
            }else{
                navList[0].hide = true;
            }
        }


        return (
            <div>
                {currentNav ? <NavBar className="sticky-header">{currentNav.title}</NavBar> : null}

                <Switch>
                    {
                        navList.map(nav => <Route path={nav.path} component={nav.component} key={nav.path}/>)
                    }
                    <Route path="/dasheninfo" component={DashenInfo}/>
                    <Route path="/laobaninfo" component={LaobanInfo}/>
                    <Route path="/chat/:userid" component={Chat}/>

                    <Route component={NotFound}/>
                </Switch>

                {currentNav ? <NavFooter navList={navList} unReadCount={unReadCount}/>:null}
            </div>

        )
    }

}

export default connect(
    state => ({user: state.user,unReadCount:state.chat.unReadCount}),
    {getUser}
)(Main)

