document.addEventListener("DOMContentLoaded", async function () {
  const SUPABASE_URL = "https://zuathwjzldickgvigffd.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
  const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const form = document.getElementById("aspirasiForm");
  const namaInput = document.getElementById("nama");
  const isiInput = document.getElementById("isi");
  const statusPesan = document.getElementById("statusPesan");
  const daftar = document.createElement("div");
  document.body.appendChild(daftar);

  // Kirim aspirasi
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
      statusPesan.textContent = "❌ Gagal mengirim aspirasi.";
    } else {
      statusPesan.textContent = "✅ Aspirasi berhasil dikirim!";
      form.reset();
      tampilkanAspirasi(); // refresh data
    }
  });

  // Fungsi tampilkan aspirasi + komentar
  async function tampilkanAspirasi() {
    daftar.innerHTML = "";

    const { data: aspirasiData, error: aspirasiError } = await supabase
      .from("aspirasi")
      .select("*")
      .order("created_at", { ascending: false });

    if (aspirasiError) {
      daftar.innerHTML = "<p>❌ Gagal memuat aspirasi.</p>";
      return;
    }

    for (const asp of aspirasiData) {
      const kotak = document.createElement("div");
      kotak.style.border = "1px solid #ccc";
      kotak.style.borderRadius = "12px";
      kotak.style.padding = "15px";
      kotak.style.marginTop = "20px";
      kotak.style.background = "#fff";

      const waktu = new Date(asp.created_at).toLocaleString();

      kotak.innerHTML = `
        <strong>${asp.nama}</strong> <span style="color:gray; font-size:0.9em;">${waktu}</span>
        <p>${asp.isi}</p>
        <div id="komentar-${asp.id}"></div>
        <form data-id="${asp.id}" class="form-komentar">
          <input type="text" name="nama" placeholder="Nama Anda" required />
          <input type="text" name="isi" placeholder="Tulis komentar..." required />
          <button type="submit">Komentar</button>
        </form>
      `;

      daftar.appendChild(kotak);
      await tampilkanKomentar(asp.id);
    }

    // Tambahkan event untuk form komentar
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

  // Fungsi tampilkan komentar
  async function tampilkanKomentar(aspirasi_id) {
    const { data: komentarData } = await supabase
      .from("komentar")
      .select("*")
      .eq("aspirasi_id", aspirasi_id)
      .order("created_at", { ascending: true });

    const komentarDiv = document.getElementById(`komentar-${aspirasi_id}`);
    komentarDiv.innerHTML = "<strong>Komentar:</strong>";

    if (!komentarData || komentarData.length === 0) {
      komentarDiv.innerHTML += "<p style='color:gray;'>Belum ada komentar.</p>";
      return;
    }

    komentarData.forEach((kom) => {
      const waktu = new Date(kom.created_at).toLocaleString();
      const p = document.createElement("p");
      p.style.margin = "5px 0";
      p.innerHTML = `<strong>${kom.nama}</strong> <span style="color:gray; font-size:0.8em;">${waktu}</span><br>${kom.isi}`;
      komentarDiv.appendChild(p);
    });
  }

  // Inisialisasi awal
  tampilkanAspirasi();
});
