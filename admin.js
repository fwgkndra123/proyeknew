const SUPABASE_URL = "https://zuathwjzldickgvigffd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // gunakan full key kamu
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function login() {
  const pass = document.getElementById("password").value;
  if (pass === "admin123") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    await tampilkanSemuaAspirasi();
  } else {
    document.getElementById("errorText").textContent = "Password salah!";
  }
}

function logout() {
  document.getElementById("loginBox").style.display = "block";
  document.getElementById("adminPanel").style.display = "none";
  document.getElementById("password").value = "";
  document.getElementById("errorText").textContent = "";
}

async function tampilkanSemuaAspirasi() {
  const { data: aspirasiList, error } = await client
    .from("aspirasi")
    .select("*")
    .order("created_at", { ascending: false });

  const container = document.getElementById("daftarAspirasi");
  container.innerHTML = "";

  if (error) {
    container.innerHTML = "<p>Gagal memuat data.</p>";
    return;
  }

  for (const asp of aspirasiList) {
    const box = document.createElement("div");
    box.className = "aspirasi-box";

    const waktu = new Date(asp.created_at).toLocaleString();

    box.innerHTML = `
      <p><strong>${asp.nama}</strong> <span style="color:gray;">(${waktu})</span></p>
      <p>${asp.isi}</p>
      <div id="komentar-${asp.id}" class="komentar"></div>

      <form data-id="${asp.id}" class="form-komentar">
        <input type="text" name="isi" placeholder="Komentar sebagai Admin..." required />
        <button type="submit">Kirim Komentar</button>
      </form>

      <button onclick="hapusAspirasi('${asp.id}')">🗑 Hapus Aspirasi</button>
    `;

    container.appendChild(box);
    await tampilkanKomentar(asp.id);
  }

  document.querySelectorAll(".form-komentar").forEach(form => {
    form.addEventListener("submit", async function(e) {
      e.preventDefault();
      const aspirasi_id = form.getAttribute("data-id");
      const isi = form.isi.value.trim();
      if (!isi) return;

      await client.from("komentar").insert([{ aspirasi_id, nama: "Admin", isi }]);
      form.reset();
      await tampilkanKomentar(aspirasi_id);
    });
  });
}

async function tampilkanKomentar(aspirasi_id) {
  const { data: komentarList } = await client
    .from("komentar")
    .select("*")
    .eq("aspirasi_id", aspirasi_id)
    .order("created_at", { ascending: true });

  const div = document.getElementById(`komentar-${aspirasi_id}`);
  div.innerHTML = "<strong>Komentar:</strong>";

  if (!komentarList || komentarList.length === 0) {
    div.innerHTML += "<p style='color:gray;'>Belum ada komentar.</p>";
    return;
  }

  komentarList.forEach(k => {
    const waktu = new Date(k.created_at).toLocaleString();
    const p = document.createElement("p");
    p.innerHTML = `<strong>${k.nama}</strong> <span style="font-size: 0.8em; color: gray;">(${waktu})</span><br>${k.isi}`;
    const btn = document.createElement("button");
    btn.textContent = "🗑 Hapus";
    btn.style.marginLeft = "10px";
    btn.onclick = async () => {
      await client.from("komentar").delete().eq("id", k.id);
      await tampilkanKomentar(aspirasi_id);
    };
    p.appendChild(btn);
    div.appendChild(p);
  });
}

async function hapusAspirasi(id) {
  if (confirm("Yakin ingin menghapus aspirasi ini?")) {
    await client.from("komentar").delete().eq("aspirasi_id", id); // hapus komentar dulu
    await client.from("aspirasi").delete().eq("id", id); // lalu aspirasi
    await tampilkanSemuaAspirasi();
  }
}
