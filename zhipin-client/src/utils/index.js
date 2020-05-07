/*包含n个工具函数的模块*/

/*
用户主界面路由：
    laoban:'/laoban'
    dashen:'/dashen'
用户信息完善界面路由：
    laoban:'/laobaninfo'
    dashen:'/dasheninfo'

判断用户类型?                 user.type
判断是否已经完善信息?          user.header是否有值
*/

export function getRedirectTo(type,header) {
    let path;
    if (type ==="laoban"){
        path = "laoban"
    }else {
        path = "dashen"
    }

    if (!header){       //header没有值，返回信息完善界面的path
        path += "info";
    }

    return  path
}
