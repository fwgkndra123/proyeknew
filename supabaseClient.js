const SUPABASE_URL = "https://zuathwjzldickgvigffd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOi..."; // kunci kamu (jangan bocorkan ke orang lain)

window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
