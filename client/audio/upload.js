const SUPABASE_URL = "https://lrpbvdzbqyhagwoslihh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycGJ2ZHpicXloYWd3b3NsaWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMTM4MDcsImV4cCI6MjA4MzY4OTgwN30.CILcxAsAvVnFKT2I90c_btRzbFHYOT-CwEsRa7hTvK4";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const queue = [];
let processing = false;
export async function addToQueue(blob) {
    const fileName = `voice_${Date.now()}.webm`;

    const { error } = await supabaseClient.storage
        .from('audio')
        .upload(`chunks/${fileName}`, blob, {
            contentType: 'audio/webm', // THIS IS THE FIX
            upsert: false
        });

    if (error) {
        console.error("Upload Error:", error);
    } else {
        console.log("✅ Playable file saved:", fileName);
    }
}