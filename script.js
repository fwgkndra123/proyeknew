document.addEventListener("DOMContentLoaded", function () {
  const SUPABASE_URL = "https://zuathwjzldickgvigffd.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // samakan dengan milikmu

  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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

    const { error } = await supabase.from("aspirasi").insert([{ nama, isi }]);

    if (error) {
      statusPesan.textContent = "Gagal mengirim aspirasi.";
      console.error(error);
    } else {
      statusPesan.textContent = "Aspirasi berhasil dikirim!";
      form.reset();
    }
  });
});
