export function setupVAD(analyser) {
    const data = new Uint8Array(analyser.fftSize);
    const threshold = -60; // dB threshold

    function check() {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        const db = 20 * Math.log10(rms || 0.00001);

        window.isSpeaking = db > threshold; // Global flag for recorder
        requestAnimationFrame(check);
    }
    check();
}