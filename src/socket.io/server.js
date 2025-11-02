const { Server } = require("socket.io");
let io = null;

module.exports = {
    initSocket : (httpServer) => {
        try {
            io = new Server(httpServer , {
                cors : {
                    origin : "*",
                }
            });

            // server notify when client is connected or not
            io.on("connection", (socket)=>{
                console.log("User Connected :", socket.id);
                const userId = socket.handshake.query.userId;
                console.log(userId);
                socket.join(userId);
                socket.on("disconnect", ()=>{
                console.log("User Disconnected :");
                })
                socket.on('test' ,(data)=>{
                    console.log('Data From Client Side ', data);
                })
            })
        } catch (error) {
            console.log(error);
        }
    },
    getIo : ()=>{
        if (!io !== null) {
            return io;
        }
    }
}
