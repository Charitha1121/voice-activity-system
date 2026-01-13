import { addToQueue } from './audio/upload.js';

// Connect to the backend signaling server
const socket = io("http://localhost:5000");

const startBtn = document.getElementById('startBtn');
const statusDiv = document.getElementById('status');

// --- 2-WAY LISTENER (One clean listener) ---
socket.on('play-remote-audio', (data) => {
    console.log("🔊 Received signal from server. Playing audio...");
    
    // VISUAL PROOF: Flash background green when receiving audio
    document.body.style.transition = "background 0.3s";
    document.body.style.background = "#004400"; 
    setTimeout(() => document.body.style.background = "#121212", 1000);

    const audio = new Audio(data.url);
    audio.volume = 1.0;
    audio.play().catch(e => {
        console.warn("Playback blocked. Click the page to enable audio.");
        statusDiv.innerText = "⚠️ Click page to enable remote audio";
    });
});

startBtn.addEventListener('click', () => {
    initAudio();
    startBtn.disabled = true;
    startBtn.innerText = "System Active";
    statusDiv.innerText = "Listening for voice...";
});

async function initAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    
    // DSP: High-pass filter to remove background rumble
    const filter = audioContext.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = 100;

    // VAD: Analyser for volume threshold detection
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(filter).connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
            console.log("📤 Voice detected, uploading chunk...");
            addToQueue(e.data, socket); 
        }
    };

    // VAD Logic: Check volume levels
    setInterval(() => {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

        // Threshold of 20 - starts recording if you are speaking
        if (volume > 20) {
            if (mediaRecorder.state === "inactive") {
                statusDiv.innerText = "🎤 Speaking (Broadcasting)...";
                mediaRecorder.start();
                
                // Stop after 3 seconds to create a "chunk"
                setTimeout(() => {
                    if (mediaRecorder.state === "recording") {
                        mediaRecorder.stop();
                        statusDiv.innerText = "✅ Chunk Sent. Listening...";
                    }
                }, 3000);
            }
        }
    }, 500); 
}