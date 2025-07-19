document.addEventListener("DOMContentLoaded", async function () {
  const SUPABASE_URL = "https://zuathwjzldickgvigffd.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // ← isi lengkap di sini
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const form = document.getElementById("aspirasiForm");
  const namaInput = document.getElementById("nama");
  const isiInput = document.getElementById("isi");
  const statusPesan = document.getElementById("statusPesan");
  const daftar = document.getElementById("daftarAspirasi");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const nama = namaInput.value.trim();
    const isi = isiInput.value.trim();

    if (!nama || !isi) {
      statusPesan.textContent = "❌ Nama dan aspirasi wajib diisi.";
      statusPesan.style.color = "red";
      return;
    }

    const { error } = await supabase.from("aspirasi").insert([{ nama, isi }]);
    if (error) {
      statusPesan.textContent = "❌ Gagal mengirim aspirasi.";
      statusPesan.style.color = "red";
    } else {
      statusPesan.textContent = "✅ Aspirasi berhasil dikirim!";
      statusPesan.style.color = "green";
      form.reset();
      tampilkanAspirasi();
    }
  });

  async function tampilkanAspirasi() {
    daftar.innerHTML = "";

    const { data, error } = await supabase
      .from("aspirasi")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      daftar.innerHTML = "<p style='color:red;'>❌ Gagal memuat aspirasi.</p>";
      return;
    }

    for (const asp of data) {
      const kotak = document.createElement("div");
      kotak.className = "aspirasi-box";

      const waktu = new Date(asp.created_at).toLocaleString();
      kotak.innerHTML = `
        <strong>${asp.nama}</strong> <span style="color:gray; font-size:0.9em;">${waktu}</span>
        <p>${asp.isi}</p>
        <div id="komentar-${asp.id}" class="komentar-container"></div>
        <form data-id="${asp.id}" class="form-komentar">
          <input type="text" name="nama" placeholder="Nama Anda" required />
          <input type="text" name="isi" placeholder="Tulis komentar..." required />
          <button type="submit">Komentar</button>
        </form>
      `;

      daftar.appendChild(kotak);
      await tampilkanKomentar(asp.id);
    }

    document.querySelectorAll(".form-komentar").forEach((formK) => {
      formK.addEventListener("submit", async function (e) {
        e.preventDefault();
        const aspirasi_id = formK.getAttribute("data-id");
        const nama = formK.nama.value.trim();
        const isi = formK.isi.value.trim();
        if (!nama || !isi) return;

        await supabase.from("komentar").insert([{ aspirasi_id, nama, isi }]);
        formK.reset();
        await tampilkanKomentar(aspirasi_id);
      });
    });
  }

  async function tampilkanKomentar(aspirasi_id) {
    const komentarDiv = document.getElementById(`komentar-${aspirasi_id}`);
    komentarDiv.innerHTML = "<strong>Komentar:</strong>";

    const { data: komentar } = await supabase
      .from("komentar")
      .select("*")
      .eq("aspirasi_id", aspirasi_id)
      .order("created_at");

    if (!komentar || komentar.length === 0) {
      komentarDiv.innerHTML += "<p style='color:gray;'>Belum ada komentar.</p>";
      return;
    }

    komentar.forEach((k) => {
      const waktu = new Date(k.created_at).toLocaleString();
      const p = document.createElement("p");
      p.innerHTML = `<strong>${k.nama}</strong> <span style="color:gray; font-size:0.8em;">${waktu}</span><br>${k.isi}`;
      komentarDiv.appendChild(p);
    });
  }

  tampilkanAspirasi();
});
