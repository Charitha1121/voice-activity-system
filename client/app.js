// client/app.js
import { setupVAD } from "./audio/vad.js";
import { setupRecorder } from "./audio/recorder.js";
import { drawWaveform } from "./audio/visualizer.js";
const startBtn = document.getElementById("startBtn");

startBtn.onclick = async () => {
    // 1. Get the direct mic stream
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // 2. Setup AudioContext ONLY for VAD and Visualization
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();
    source.connect(analyser);

    // 3. Initialize VAD and Visualizer
    setupVAD(analyser);
    drawWaveform(analyser);

    // 4. Pass the RAW hardware stream to the recorder
    // This bypasses any "routing silence" issues
    setupRecorder(stream); 

    startBtn.disabled = true;
};