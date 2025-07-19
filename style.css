document.addEventListener("DOMContentLoaded", async function () {
  const SUPABASE_URL = "https://zuathwjzldickgvigffd.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1YXRod2p6bGRpY2tndmlnZmZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4ODkwNjksImV4cCI6MjA2ODQ2NTA2OX0.OjWkn6GIed1feHeoNmXZCKwD3bvOoQT7aYKQCzKJt8w";

  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const halamanAdmin = document.getElementById("adminBox");
  const daftarAdmin = document.getElementById("adminDaftarAspirasi");
  const loginBox = document.getElementById("loginBox");
  const loginError = document.getElementById("loginError");

  const form = document.getElementById("aspirasiForm");
  const namaInput = document.getElementById("nama");
  const isiInput = document.getElementById("isi");
  const statusPesan = document.getElementById("statusPesan");
  const daftar = document.getElementById("daftarAspirasi");

  if (form) {
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
        console.error(error);
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
        p.innerHTML = `<strong>${kom.nama}</strong> <span style='color:gray; font-size:0.8em;'>${waktu}</span><br>${kom.isi}`;
        divKomentar.appendChild(p);
      });
    }

    tampilkanAspirasi();
  }

  if (loginBox && halamanAdmin) {
    window.loginAdmin = async function () {
      const pass = document.getElementById("adminPassword").value;
      if (pass !== "admin123") {
        loginError.textContent = "Password salah!";
        return;
      }
      loginBox.style.display = "none";
      halamanAdmin.style.display = "block";
      tampilkanAspirasiAdmin();
    };

    window.logoutAdmin = function () {
      loginBox.style.display = "block";
      halamanAdmin.style.display = "none";
    };

    async function tampilkanAspirasiAdmin() {
      daftarAdmin.innerHTML = "";
      const { data: aspirasiData, error } = await supabaseClient
        .from("aspirasi")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        daftarAdmin.innerHTML = "<p>❌ Gagal memuat aspirasi.</p>";
        console.error(error);
        return;
      }

      for (const asp of aspirasiData) {
        const box = document.createElement("div");
        box.className = "aspirasi-box";
        const waktu = new Date(asp.created_at).toLocaleString();

        box.innerHTML = `
          <strong>${asp.nama}</strong> <span style='color:gray;'>${waktu}</span>
          <p>${asp.isi}</p>
          <button onclick="hapusAspirasi('${asp.id}')">Hapus Aspirasi</button>
          <div id="admin-komentar-${asp.id}" class="komentar-container"></div>
          <form data-id="${asp.id}" class="admin-komentar-form">
            <input type="text" name="isi" placeholder="Komentar sebagai Admin" required />
            <button type="submit">Kirim Komentar</button>
          </form>
        `;

        daftarAdmin.appendChild(box);
        await tampilkanKomentarAdmin(asp.id);
      }

      document.querySelectorAll(".admin-komentar-form").forEach((formK) => {
        formK.addEventListener("submit", async function (e) {
          e.preventDefault();
          const aspirasi_id = formK.getAttribute("data-id");
          const isi = formK.isi.value.trim();

          if (!isi) return;

          await supabaseClient.from("komentar").insert([{ aspirasi_id, nama: "Admin", isi }]);
          formK.reset();
          await tampilkanKomentarAdmin(aspirasi_id);
        });
      });
    }

    async function tampilkanKomentarAdmin(aspirasi_id) {
      const { data: komentarData } = await supabaseClient
        .from("komentar")
        .select("*")
        .eq("aspirasi_id", aspirasi_id)
        .order("created_at", { ascending: true });

      const target = document.getElementById(`admin-komentar-${aspirasi_id}`);
      target.innerHTML = "<strong>Komentar:</strong>";

      if (!komentarData || komentarData.length === 0) {
        target.innerHTML += "<p style='color:gray;'>Belum ada komentar.</p>";
        return;
      }

      komentarData.forEach((kom) => {
        const waktu = new Date(kom.created_at).toLocaleString();
        const p = document.createElement("p");
        p.innerHTML = `<strong>${kom.nama}</strong> <span style='color:gray; font-size:0.8em;'>${waktu}</span><br>${kom.isi}`;

        const btn = document.createElement("button");
        btn.textContent = "Hapus";
        btn.onclick = async () => {
          await supabaseClient.from("komentar").delete().eq("id", kom.id);
          await tampilkanKomentarAdmin(aspirasi_id);
        };

        p.appendChild(document.createElement("br"));
        p.appendChild(btn);
        target.appendChild(p);
      });
    }

    window.hapusAspirasi = async function (id) {
      await supabaseClient.from("komentar").delete().eq("aspirasi_id", id);
      await supabaseClient.from("aspirasi").delete().eq("id", id);
      tampilkanAspirasiAdmin();
    };
  }
});
