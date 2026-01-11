import { addToQueue } from "./upload.js";

export function setupRecorder(stream) {
    function captureChunk() {
        // Create a fresh recorder for every chunk to generate new headers
        const recorder = new MediaRecorder(stream, { 
            mimeType: 'audio/webm;codecs=opus' 
        });

        const chunks = [];
        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = async () => {
            // Combine the chunks into a finalized, standalone WebM file
            const completeBlob = new Blob(chunks, { type: 'audio/webm' });
            
            if (completeBlob.size > 2000) {
                console.log(`🎤 Standalone Chunk Ready: ${completeBlob.size} bytes`);
                addToQueue(completeBlob);
            }
        };

        recorder.start();

        // Stop after 3 seconds to "seal" the file and start a new one
        setTimeout(() => {
            if (recorder.state === "recording") {
                recorder.stop();
                captureChunk(); // Recursive call for continuous recording
            }
        }, 3000);
    }

    captureChunk();
}