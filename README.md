# 🎙️ Production-Grade AI Voice Activity System

![Web Audio API](https://img.shields.io/badge/Web_Audio_API-Enabled-blue)
![Supabase](https://img.shields.io/badge/Storage-Supabase-green)
![Socket.io](https://img.shields.io/badge/Real--time-Socket.io-black)

A high-performance audio engineering solution featuring real-time **Voice Activity Detection (VAD)**, Digital Signal Processing (DSP), and asynchronous cloud synchronization.

---

## 🚀 Key Technical Features

* **Continuous VAD Logic:** Utilizes the Web Audio API `AnalyserNode` to calculate RMS and Decibel levels. The system only triggers uploads when audio exceeds a `-60dB` threshold, saving bandwidth and storage.
* **Recursive Segmenting (Metadata Fix):** Solves the "Invalid Data" issue common in `MediaRecorder` by implementing a recursive pattern. By stopping and restarting the recorder every 3 seconds, every chunk is "sealed" with a valid EBML header, making it a playable standalone file.
* **DSP Pipeline:** Includes a **High-Pass Biquad Filter** (set at 100Hz) to remove ambient low-end rumble and a **Gain Node** for signal normalization.
* **Async Upload Queue:** A custom-built queue system manages network backpressure, ensuring smooth uploads to the cloud without blocking the main UI thread.
* **Cloud Integration:** Fully integrated with **Supabase Storage** with explicit MIME-type handling (`audio/webm`) for instant cross-platform playback.
* **Real-time Visualization:** A high-frequency Canvas-based waveform visualizer providing 60fps feedback on microphone sensitivity.

---

## 🛠️ Architecture Overview



The system follows a modular "Plug-and-Play" architecture:
1.  **Audio Engine:** Processes raw mic input through a filter and gain chain.
2.  **Logic Engine:** Monitors decibel levels to validate speech.
3.  **Recording Engine:** Captures 3-second segments and "seals" them as playable WebM files.
4.  **Network Engine:** Pushes data to Supabase and broadcasts events via Socket.io.

---

## 📂 Project Structure

```text
├── client/
│   ├── audio/
│   │   ├── recorder.js   # Recursive 3s segment logic
│   │   ├── upload.js     # Supabase async queue & MIME-type handling
│   │   ├── vad.js        # RMS-to-Decibel threshold logic
│   │   └── visualizer.js # Canvas waveform rendering
│   ├── app.js            # Main AudioContext orchestrator
│   └── index.html        # UI Entry point
├── server/
│   └── index.js          # Socket.io broadcast & signaling server
└── README.md