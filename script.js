<script type="module">
  const SUPABASE_URL = "https://zuathwjzldickgvigffd.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
  const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  async function login() {
    const pass = document.getElementById("password").value;
    if (pass !== "admin123") {
      document.getElementById("salah").textContent = "Password salah!";
      return;
    }

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminBox").style.display = "block";

    const { data, error } = await client
      .from("aspirasi")
      .select("*, komentar(*)")
      .order("created_at", { ascending: false });

    const ul = document.getElementById("daftarAspirasi");
    ul.innerHTML = "";

    if (error) return console.error("Gagal ambil data:", error);

    data.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${item.nama}</strong>: ${item.isi}
        <br><small>${new Date(item.created_at).toLocaleString()}</small>
        <ul>
          ${(item.komentar || []).map(k => `<li>💬 ${k.isi}</li>`).join("")}
        </ul>
        <button onclick="hapusAspirasi('${item.id}')">🗑 Hapus</button>
        <hr>
      `;
      ul.appendChild(li);
    });
  }

  async function hapusAspirasi(id) {
    const konfirmasi = confirm("Yakin ingin menghapus aspirasi ini?");
    if (!konfirmasi) return;

    // Hapus komentar dulu (foreign key)
    await client.from("komentar").delete().eq("aspirasi_id", id);
    await client.from("aspirasi").delete().eq("id", id);
    alert("Aspirasi terhapus");
    login(); // refresh
  }

  function logout() {
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("adminBox").style.display = "none";
    document.getElementById("password").value = "";
    document.getElementById("daftarAspirasi").innerHTML = "";
    document.getElementById("salah").textContent = "";
  }
</script>
