document.addEventListener("DOMContentLoaded", function () {
  const SUPABASE_URL = "https://zuathwjzldickgvigffd.supabase.co";
  const SUPABASE_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1YXRod2p6bGRpY2tndmlnZmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4ODkwNjksImV4cCI6MjA2ODQ2NTA2OX0.OjWkn6GIed1feHeoNmXZCKwD3bvOoQT7aYKQCzKJt8w";

  // Ganti nama agar tidak konflik dengan library
  const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const form = document.getElementById("aspirasiForm");
  const namaInput = document.getElementById("nama");
  const isiInput = document.getElementById("isi");
  const statusPesan = document.getElementById("statusPesan");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const nama = namaInput.value.trim();
    const isi = isiInput.value.trim();

    if (!nama || !isi) {
      statusPesan.textContent = "Nama dan aspirasi wajib diisi.";
      return;
    }

    const { error } = await client.from("aspirasi").insert([{ nama, isi }]);

    if (error) {
      statusPesan.textContent = "❌ Gagal mengirim aspirasi.";
      console.error(error);
    } else {
      statusPesan.textContent = "✅ Aspirasi berhasil dikirim!";
      form.reset();
    }
  });
});
