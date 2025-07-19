const supabase = window.supabaseClient;

document.getElementById("aspirasiForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const nama = document.getElementById("nama").value.trim();
  const isi = document.getElementById("isi").value.trim();

  if (!nama || !isi) {
    alert("Nama dan isi aspirasi harus diisi!");
    return;
  }

  const { data, error } = await supabase.from("aspirasi").insert([{ nama, isi }]);

  const status = document.getElementById("statusPesan");
  if (error) {
    console.error("Gagal mengirim:", error);
    status.textContent = "Gagal mengirim aspirasi.";
    status.style.color = "red";
  } else {
    status.textContent = "Aspirasi berhasil dikirim!";
    status.style.color = "green";
    document.getElementById("aspirasiForm").reset();
  }
});
