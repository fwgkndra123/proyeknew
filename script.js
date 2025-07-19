document.addEventListener("DOMContentLoaded", async function () {
  const SUPABASE_URL = "https://zuathwjzldickgvigffd.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." // Ganti dengan KEY lengkap Anda

  // ✅ GANTI nama variabel agar tidak bentrok!
  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

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
      statusPesan.textContent = "Nama dan aspirasi wajib diisi.";
      return;
    }

    const { error } = await supabaseClient.from("aspirasi").insert([{ nama, isi }]);

    if (error) {
      statusPesan.textContent = "❌ Gagal mengirim aspirasi.";
      console.error(error);
    } else {
      statusPesan.textContent = "✅ Aspirasi berhasil dikirim!";
      form.reset();
      tampilkanAspirasi();
    }
  });

  async function tampilkanAspirasi() {
    daftar.innerHTML = "";

    const { data: aspirasiData, error } = await supabaseClient
      .from("aspirasi")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      daftar.innerHTML = "<p>❌ Gagal memuat aspirasi.</p>";
      return;
    }

    for (const asp of aspirasiData) {
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

        await supabaseClient.from("komentar").insert([{ aspirasi_id, nama, isi }]);
        formK.reset();
        await tampilkanKomentar(aspirasi_id);
      });
    });
  }

  async function tampilkanKomentar(aspirasi_id) {
    const { data: komentarData } = await supabaseClient
      .from("komentar")
      .select("*")
      .eq("aspirasi_id", aspirasi_id)
      .order("created_at", { ascending: true });

    const divKomentar = document.getElementById(`komentar-${aspirasi_id}`);
    divKomentar.innerHTML = "<strong>Komentar:</strong>";

    if (!komentarData || komentarData.length === 0) {
      divKomentar.innerHTML += "<p style='color:gray;'>Belum ada komentar.</p>";
      return;
    }

    komentarData.forEach((kom) => {
      const waktu = new Date(kom.created_at).toLocaleString();
      const p = document.createElement("p");
      p.innerHTML = `<strong>${kom.nama}</strong> <span style="color:gray; font-size:0.8em;">${waktu}</span><br>${kom.isi}`;
      divKomentar.appendChild(p);
    });
  }

  tampilkanAspirasi();
});
