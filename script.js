const supabase = window.supabaseClient;

document.getElementById("aspirasiForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const isi = document.getElementById("isi").value.trim();
  const status = document.getElementById("pesanSukses");

  if (!nama || !isi) {
    status.textContent = "Nama dan isi aspirasi wajib diisi.";
    status.style.color = "red";
    return;
  }

  const { data, error } = await supabase
    .from("aspirasi")
    .insert([{ nama, isi }]);

  if (error) {
    console.error("Supabase error:", error);
    status.textContent = "Gagal mengirim aspirasi.";
    status.style.color = "red";
  } else {
    status.textContent = "Aspirasi berhasil dikirim!";
    status.style.color = "green";
    document.getElementById("aspirasiForm").reset();
  }
});
