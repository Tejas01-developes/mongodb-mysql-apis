import { io } from "../app.js";

io.on("connection",(socket)=>{
console.log("socket connected",socket.id);
socket.on("disconnect",()=>{
    console.log("socket disconnect")
})

socket.on("message",(data)=>{
    console.log(`message recived ${data}`)
    socket.emit("takemessage",data)
})
    
})


