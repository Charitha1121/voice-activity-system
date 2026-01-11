import express from "express";
import http from "http";
import { Server } from "socket.io";
import { supabase } from "./supabase.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("audio", async (audioBlob) => {
    console.log("🎧 Received audio event from", socket.id);

    const buffer = Buffer.from(await audioBlob.arrayBuffer());
    const fileName = `audio_${Date.now()}.webm`;

    const { error } = await supabase.storage
      .from("audio")
      .upload(fileName, buffer, {
        contentType: "audio/webm",
      });

    if (error) {
      console.error("❌ Upload error:", error.message);
    } else {
      console.log("✅ Audio uploaded:", fileName);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
