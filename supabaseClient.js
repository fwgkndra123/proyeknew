if (typeof supabase !== 'undefined') {
  const SUPABASE_URL = "https://zuathwjzldickgvigffd.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1YXRod2p6bGRpY2tndmlnZmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4ODkwNjksImV4cCI6MjA2ODQ2NTA2OX0.OjWkn6GIed1feHeoNmXZCKwD3bvOoQT7aYKQCzKJt8w";
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
  console.error("Supabase library not loaded.");
}
