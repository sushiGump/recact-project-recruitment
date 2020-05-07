import React,{Component} from "react"
import {List,Grid} from "antd-mobile";
import PropTypes from "prop-types"

export default class HeaderSelector extends Component {
    static propTypes ={
        setHeader:PropTypes.func.isRequired
    };

    state = {
        icon:null  //图像对象，默认值使用null
    };

    constructor(props){
        super(props);
        this.headerList = [];
        for (let i = 0;i < 20;i++){
            this.headerList.push({
                text:`头像${i+1}`,
                icon:require(`../../assets/images/头像${i+1}.png`)
                //不能使用import
            })
        }
    }

    handleClick = ({text,icon}) => {

        this.setState({
            icon:icon
        });
        this.props.setHeader(text)
    };

    render(){
        const {icon} = this.state;
        const headers = icon?
            (<div>
                请选择头像:<img src={icon}/>
            </div>) : "请选择头像";

        return (
            <div>
                <List renderHeader={()=> headers}>
                    <Grid data={this.headerList} columnNum={5}
                        onClick={this.handleClick}/>
                </List>
            </div>
        )
    }
}
