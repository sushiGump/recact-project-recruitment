
import axios from "axios"
/*axios返回的是promise对象*/

export default function ajax(url,data={},type="GET") {
    if (type==="GET"){      
        let paramStr= "";
        //data:{username:"Tom",password:"123"...}
        //url?username=tom&password=123
        Object.keys(data).forEach((key)=>{        
            paramStr += key + "=" + data[key] +"&";
        });
        if (paramStr){
            paramStr = paramStr.substring(0,paramStr.length-1)
        }
        return axios.get(url + "?" + paramStr)
    }else {               
        return axios.post(url,data)
    }
}
