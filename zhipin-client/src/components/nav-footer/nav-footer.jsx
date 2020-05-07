/*导航底部的UI组件*/
import React,{Component} from "react"
import {TabBar} from "antd-mobile";
import PropTypes from "prop-types"
import {withRouter} from "react-router-dom"

const Item = TabBar.Item;

/*
    希望在非路由组件中使用路由库的API?
    withRoute函数：向外暴露一个包装的组件，其内部会向组件中传入一些路由组件特有的属性：history/location/math
*/

class NavFooter extends Component {
    static propTypes ={
        navList:PropTypes.array.isRequired,
        unReadCount:PropTypes.number.isRequired
    };

    render(){
        let {navList,unReadCount} = this.props;
        navList = navList.filter(nav => !nav.hide);

        const path = this.props.location.pathname;

        return (
            <TabBar>
                {
                    navList.map(nav => (
                        <Item key={nav.path}
                              badge={nav.path==="/message"?unReadCount:0}
                              title={nav.text}
                              icon={{uri:require(`./images/${nav.icon}.png`)}}
                              selected={path === nav.path}
                              selectedIcon={{uri:require(`./images/${nav.icon}-selected.png`)}}
                              onPress={() => this.props.history.replace(nav.path)}
                        />
                    ))
                }

            </TabBar>
        )
    }
}
export default withRouter(NavFooter)
