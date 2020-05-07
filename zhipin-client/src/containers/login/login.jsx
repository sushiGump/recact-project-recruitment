import React,{Component} from "react"
import {
    Button,
    List,
    NavBar,
    WhiteSpace,
    WingBlank,
    InputItem
} from "antd-mobile";
import {connect} from "react-redux"
import {Redirect} from "react-router-dom"

import {login} from "../../redux/actions";
import Logo from "../../components/logo/logo";

const ListItem = List.Item;

class Login extends Component{
    state={
        username:"",            //用户名
        password:"",            //密码
    };

    handleChange = (val,name)=>{
        this.setState({[name]: val})  //属性名不是name，而是name的值

    };

    login = () => {
        this.props.login(this.state)
    };

    toRegister = () => {
        this.props.history.replace('./register')
    };

    render(){
        const {msg,redirectTo} = this.props.user;
        if (redirectTo){
            return <Redirect to={redirectTo}/>
        }

        return(
            <div>
                <NavBar>
                    Gump&nbsp;&nbsp;直&nbsp;聘
                </NavBar>
                <Logo/>
                <WingBlank>
                    <List>
                        {msg? <div className="messageError">{msg}</div> : null}
                        <InputItem placeholder="请输入用户名" onChange={val => this.handleChange(val,"username")}>用户名：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <InputItem placeholder="请输入密码" type="password" onChange={val => this.handleChange(val,"password")}>密&nbsp;&nbsp;码：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <Button type="primary" onClick={this.login}>登录</Button>
                        <WhiteSpace></WhiteSpace>
                        <Button onClick={this.toRegister}>未有账户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {login}
)(Login)
