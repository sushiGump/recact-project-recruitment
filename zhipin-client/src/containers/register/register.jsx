import React,{Component} from "react"
import {
    Button,
    List,
    NavBar,
    Radio,
    WhiteSpace,
    WingBlank,
    InputItem
} from "antd-mobile";
import {connect} from "react-redux";
import {Redirect} from "react-router-dom"

import Logo from "../../components/logo/logo";
import {register} from "../../redux/actions"

const ListItem = List.Item;

 class Register extends Component{
    state={
        username:"",            //用户名
        password:"",            //密码
        passwordChecked:"",     //确认密码
        type:"laoban"                 //用户类型
    };

    handleChange = (val,name)=>{
        this.setState({[name]: val}) 
    };

    register = () => {
        // console.log(this.state)
        this.props.register(this.state)     
    };

    toLogin = () => {
        this.props.history.replace('./login')
    };

    render(){
        const {type} = this.state;
        const {msg,redirectTo} = this.props.user;
        if (redirectTo){
            return <Redirect to={redirectTo}/>
        }

        return(
            <div>
                <NavBar>
                    硅&nbsp;谷&nbsp;直&nbsp;聘
                </NavBar>
                <Logo/>
                <WingBlank>
                    <List>
                        {msg? <div className="messageError">{msg}</div> : null}
                        <InputItem placeholder="请输入用户名" onChange={val => this.handleChange(val,"username")}>用户名：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <InputItem placeholder="请输入密码" type="password" onChange={val => this.handleChange(val,"password")}>密&nbsp;&nbsp;码：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <InputItem placeholder="请输入确认密码" type="password" onChange={val => this.handleChange(val,"passwordChecked")}>确认密码：</InputItem>
                        <WhiteSpace></WhiteSpace>
                        <ListItem>
                            <span>用户类型</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={type==="dashen"} onChange={()=>this.handleChange("dashen","type")}>大神</Radio>&nbsp;&nbsp;&nbsp;&nbsp;
                            <Radio checked={type==="laoban"} onChange={()=>this.handleChange("laoban","type")}>老板</Radio>
                        </ListItem>
                        <WhiteSpace></WhiteSpace>
                        <Button type="primary" onClick={this.register}>注册</Button>
                        <WhiteSpace></WhiteSpace>
                        <Button onClick={this.toLogin}>已有账户</Button>
                    </List>
                </WingBlank>
            </div>
        )
    }
}

export default connect(
    state => ({user:state.user}),   
    ({register})
)(Register)
