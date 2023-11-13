import express from "express";
import { Server } from "socket.io";
const app = express();
app.use(express.static("public"));
const PORT = 3000;
let connectedSockets = new Set();
const server = app.listen(PORT, () => {
    console.log(`server is listening on PORT ${PORT}`);
});
const io = new Server(server);
io.on("connection", (socket) => {
    console.log(socket.id);
    connectedSockets.add(socket.id);
    io.emit("client-total", connectedSockets.size);
    socket.on("disconnect", () => {
        console.log(`disconneted socket : ${socket.id}`);
        connectedSockets.delete(socket.id);
        io.emit("client-total", connectedSockets.size);
    });
    socket.on('message',(data)=>{
        console.log(data);
        socket.broadcast.emit("chatMessage",data);
    })
});
