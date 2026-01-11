import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://lrpbvdzbqyhagwoslihh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxycGJ2ZHpicXloYWd3b3NsaWhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMTM4MDcsImV4cCI6MjA4MzY4OTgwN30.CILcxAsAvVnFKT2I90c_btRzbFHYOT-CwEsRa7hTvK4";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
