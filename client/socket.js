const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("✅ Connected to server:", socket.id);
});

// MIC CAPTURE
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.start(500); // send audio every 500ms

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      socket.emit("audio", event.data);
    }
  };
});
