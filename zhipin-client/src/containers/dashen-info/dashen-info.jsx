import React,{Component} from "react"
import {List,InputItem,TextareaItem,Button} from "antd-mobile"
import {connect} from "react-redux";
import {Redirect} from "react-router-dom"

import HeaderSelector from "../../components/header-selector/header-selector";
import {updateUser} from "../../redux/actions";
class DashenInfo extends Component {
    state = {
        header: "", // 头像名称
        post: "", // 职位
        info: "", // 个人或职位简介
    };

    setHeader = (header) =>{
        this.setState({
            header
        })
    };

    handleChange = (name,value) => {
        this.setState({
            [name]:value
        })
    };

    save = () => {
        this.props.updateUser(this.state);
    };

    render(){
        const {header} = this.props.user;
        if(header){
            return <Redirect to="/dashen"/>
        }

        return (
            <List>
                <HeaderSelector setHeader={this.setHeader}/>
                <InputItem placeholder="请输入求职岗位" onChange={val => this.handleChange("post",val)}>求职岗位：</InputItem>
                <TextareaItem title="个人介绍:" rows={3} placeholder="请输入个人介绍"
                              onChange={val => this.handleChange("info",val)}/>
                <Button type="primary" onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
            </List>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {updateUser}
)(DashenInfo)
