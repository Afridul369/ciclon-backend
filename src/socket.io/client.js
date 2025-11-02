const { io } = require("socket.io-client");

const socket = io("http://localhost:4000",{
    transports: ['websocket'],
    query : {userId : "123"}
});


socket.on("connect", () => {
  console.log("Client Connected To Server Successfully",socket.id); // 
});

socket.on("addtocart",(data)=>{
    console.log("Data Is : ", data);
})

socket.emit('test','Hello')

socket.on("disconnect", () => {
  console.log("Cliennt Disconnected Successfully" ,socket.id); // 
});