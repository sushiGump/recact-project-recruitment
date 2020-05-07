
import React,{Component} from "react"
import {connect} from "react-redux"
import {Button, Result, List, WhiteSpace, Modal} from "antd-mobile";
import Cookies from "js-cookie"

import {resetUser} from "../../redux/actions"

const Item = List.Item;
const Brief = Item.Brief;

class Personal extends Component {
    logout = ()=>{
        Modal.alert("退出","确认退出登录吗？",[
            {text:"取消"},
            {
                text:"确认",
                onPress:()=>{
                    Cookies.remove("userid");
                    this.props.resetUser()
                }
            }
        ])

    };
    render(){
        const {company,username,post,salary,info,header} = this.props.user;
        return (
            <div style={{marginBottom:50,marginTop:50}}>
                <Result
                    img={<img src={require(`../../assets/images/${header}.png`)} alt="header"/>}
                    title={username}
                    message={company}
                />
                <List renderHeader={() => '相关信息'}>
                    <Item multipleLine>
                        <Brief>职位：{post}</Brief>
                        <Brief>简介：{info}</Brief>
                        {salary ? <Brief>薪资：{salary}</Brief> : null}
                    </Item>
                    <WhiteSpace/>
                </List>
                <Button type="warning" onClick={this.logout}>退出登录</Button>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {resetUser}
)(Personal)
