import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
    console.log("Connect:", socket.id);

    socket.on("audio-chunk", (data) => {
        // Simulates routing audio metadata to other users
        socket.broadcast.emit("remote-audio", { from: socket.id, meta: data });
    });

    socket.on("disconnect", () => console.log("Disconnect:", socket.id));
});

server.listen(5000, () => console.log("🚀 Backend on port 5000"));