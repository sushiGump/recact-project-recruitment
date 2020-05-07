module.exports = function (server) {
    const ChatModel = require( "../db/models").ChatModel;
    // 得到 IO 对象
    const io = require("socket.io")(server);

    io.on('connection',(socket) => {

        socket.on('sendMsg',  ({from,to,content}) => {
            console.log('服务器接收到浏览器的消息', {from,to,content});

            //用于标识是谁和谁之间的通讯，from-to/to-from,为了固定统一，使用排序
            const chat_id = [from,to].sort().join("_");
            const create_time = Date.now();

            const chatModel = new ChatModel({chat_id,from,to,create_time,content});

            chatModel.save((error, chatMsg) => {
                io.emit('receiveMsg', chatMsg);
                console.log("--")
            })


        })
    })
};
