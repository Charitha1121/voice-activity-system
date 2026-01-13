import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on('audio-uploaded', (data) => {
        console.log("📢 New audio ready at:", data.url);
        // This sends the URL to all OTHER connected browsers (like Edge)
        socket.broadcast.emit('play-remote-audio', { url: data.url });
    });
    socket.on('new-audio', (data) => {
    // This sends the message to EVERYONE ELSE connected
    socket.broadcast.emit('play-audio', data);
});
});

server.listen(5000, () => console.log("🚀 Backend running on port 5000"));