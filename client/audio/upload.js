const SUPABASE_URL = "https://lrpbvdzbqyhagwoslihh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycGJ2ZHpicXloYWd3b3NsaWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMTM4MDcsImV4cCI6MjA4MzY4OTgwN30.CILcxAsAvVnFKT2I90c_btRzbFHYOT-CwEsRa7hTvK4";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Ensure socket is accessible here (imported or global)
// import { socket } from '../app.js'; 

/*export async function addToQueue(blob) {
    const fileName = `voice_${Date.now()}.webm`;

    // 1. Upload to Supabase
    const { data, error } = await supabaseClient.storage
        .from('audio')
        .upload(`chunks/${fileName}`, blob, {
            contentType: 'audio/webm',
            upsert: false
        });

    if (error) {
        console.error("Upload Error:", error);
    } else {
        console.log("✅ Playable file saved:", fileName);

        // 2. Get the Public URL
        const { data: urlData } = supabaseClient.storage
            .from('audio')
            .getPublicUrl(`chunks/${fileName}`);
        
        const publicUrl = urlData.publicUrl;

        // 3. 2-way trigger: Tell the server to notify other users
        if (typeof socket !== 'undefined') {
            socket.emit('audio-uploaded', { url: publicUrl });
            console.log("📡 Socket signaling sent for 2-way sync");
        }
    }
}*/
export async function addToQueue(blob, socket) {
    const fileName = `voice_${Date.now()}.webm`;

    const { data, error } = await supabaseClient.storage
        .from('audio')
        .upload(`chunks/${fileName}`, blob, {
            contentType: 'audio/webm',
            upsert: false
        });

    if (error) {
        console.error("Upload Error:", error);
    } else {
        // --- THIS IS THE CRITICAL 2-WAY ADDITION ---
        const { data: urlData } = supabaseClient.storage
            .from('audio')
            .getPublicUrl(`chunks/${fileName}`);
        
        const publicUrl = urlData.publicUrl;

        console.log("✅ Uploaded. Signaling other users...");
        
        // Tell the server to broadcast this URL
        socket.emit('audio-uploaded', { url: publicUrl });
    }
}