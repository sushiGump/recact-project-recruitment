import React,{Component} from "react"
import {List,InputItem,TextareaItem,Button} from "antd-mobile"
import {connect} from "react-redux";
import {Redirect} from "react-router-dom"


import {updateUser} from "../../redux/actions";
import HeaderSelector from "../../components/header-selector/header-selector";
class LaobanInfo extends Component {
    state = {
        header: "", // 头像名称
        post: "", // 职位
        info: "", // 个人或职位简介
        company: "", // 公司名称
        salary: ""   //月薪
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
            return <Redirect to="/laoban"/>
        }
        return (
            <List>
                <HeaderSelector setHeader={this.setHeader}/>
                <InputItem placeholder="请输入招聘职位" onChange={val => this.handleChange("post",val)}>招聘职位：</InputItem>
                <InputItem placeholder="请输入公司名称" onChange={val => this.handleChange("company",val)}>公司名称：</InputItem>
                <InputItem placeholder="请输入招聘薪资" onChange={val => this.handleChange("salary",val)}>招聘薪资：</InputItem>
                <TextareaItem title="职位要求:" rows={3} placeholder="请输入职位要求"
                              onChange={val => this.handleChange("info",val)}/>
                <Button type="primary" onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
            </List>
        )
    }
}
export default connect(
    state => ({user:state.user}),
    {updateUser}
)(LaobanInfo)
