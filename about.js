// ==========================================
// DATA UTAMA & CONFIGURATION AS PROJECT
// ==========================================
let listKeranjang = [];
let backupHomeHTML = "";

// Mengambil backup struktur HTML utama saat halaman pertama kali dimuat
window.addEventListener('DOMContentLoaded', () => {
    backupHomeHTML = document.getElementById('konten-utama').innerHTML;
});

// ==========================================
// 1. FUNGSI NAVIGASI MENU UTAMA (DINAMIS)
// ==========================================
function pindahMenu(targetMenu, elemenKlik) {
    const mainKonten = document.getElementById('konten-utama');
    
    if (elemenKlik) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        elemenKlik.classList.add('active');
    }

    if (targetMenu === 'home' || targetMenu === 'shop') {
        mainKonten.innerHTML = backupHomeHTML;
        inisialisasiUlangFungsiTab(); // Pasang kembali fungsi klik tab produk
        if (targetMenu === 'shop') {
            keBagianProduk();
        }
    } else if (targetMenu === 'blog') {
        mainKonten.innerHTML = `
            <div style="padding: 40px 0; text-align: center;">
                <h2 style="font-size: 28px; margin-bottom: 12px;">📰 AS Project Blog</h2>
                <p style="color: #64748b;">Temukan tips seputar dunia kepenulisan, trik editing video, dan inspirasi desain menarik di sini.</p>
                <hr style="margin: 30px auto; width: 80px; border-color: #2563eb;">
                <p style="font-style: italic; color: #94a3b8;">Belum ada artikel yang diterbitkan.</p>
            </div>`;
    } else if (targetMenu === 'contact') {
        mainKonten.innerHTML = `
            <div style="padding: 40px 0; max-width: 500px; margin: 0 auto;">
                <h2 style="font-size: 28px; margin-bottom: 12px; text-align: center;">📞 Hubungi Kami</h2>
                <p style="color: #64748b; text-align: center; margin-bottom: 30px;">Konsultasikan kebutuhan project Word, Editing, atau Design Anda langsung ke AS project.</p>
                <form onsubmit="event.preventDefault(); alert('Pesan Anda berhasil dikirim!');" style="display: flex; flex-direction: column; gap: 16px;">
                    <input type="text" placeholder="Nama Lengkap" required style="padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-family: inherit;">
                    <input type="email" placeholder="Alamat Email" required style="padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-family: inherit;">
                    <textarea placeholder="Ceritakan detail project yang Anda butuhkan..." rows="4" required style="padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-family: inherit; resize: none;"></textarea>
                    <button class="btn-primary" style="justify-content: center; width: 100%;">Kirim Penawaran</button>
                </form>
            </div>`;
    }
}

// ==========================================
// 2. FUNGSI SCROLLING & SHORTCUT KATEGORI
// ==========================================
function keBagianProduk() {
    const elemenProduk = document.getElementById('bagian-produk');
    if (elemenProduk) {
        elemenProduk.scrollIntoView({ behavior: 'smooth' });
    }
}

function filterKategoriLangsung(namaKategori) {
    keBagianProduk();
    const targetTab = document.querySelector(`.tab-btn[data-category="${namaKategori}"]`);
    if (targetTab) {
        targetTab.click();
    }
}

// ==========================================
// 3. LOGIKA UNTUK FILTER TAB PRODUK (FIXED)
// ==========================================
function inisialisasiUlangFungsiTab() {
    const tombolTabs = document.querySelectorAll('.tab-btn');
    const kartuProduk = document.querySelectorAll('.product-card');

    tombolTabs.forEach(tombol => {
        tombol.addEventListener('click', function() {
            const tabAktif = document.querySelector('.tab-btn.active');
            if (tabAktif) tabAktif.classList.remove('active');
            
            this.classList.add('active');

            const kategoriDipilih = this.getAttribute('data-category');

            kartuProduk.forEach(card => {
                const kategoriProduk = card.getAttribute('data-cat');
                if (kategoriDipilih === 'all' || kategoriProduk === kategoriDipilih) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}
// Jalankan otomatis saat web dibuka pertama kali
setTimeout(inisialisasiUlangFungsiTab, 100);

// ==========================================
// 4. INTERAKSI BELANJA & KERANJANG KE WHATSAPP
// ==========================================
function tambahKeKeranjang(namaProduk, harga) {
    const produkAda = listKeranjang.find(item => item.name === namaProduk);
    if (produkAda) {
        produkAda.qty += 1;
    } else {
        listKeranjang.push({ name: namaProduk, price: harga, qty: 1 });
    }
    perbaruiBadgeNavigasi();
    alert(`👍 "${namaProduk}" berhasil ditambahkan ke rencana project.`);
}

function perbaruiBadgeNavigasi() {
    const totalQty = listKeranjang.reduce((total, item) => total + item.qty, 0);
    document.getElementById('cart-count').innerText = totalQty;
}

// Fitur Klik Ikon Tas Keranjang Belanja
document.getElementById('cart-btn').addEventListener('click', () => {
    if (listKeranjang.length === 0) {
        alert("Keranjang project kamu masih kosong nih!");
        return;
    }

    let strukBelanja = "🛒 DETAIL RENCANA PROJECT KAMU:\n\n";
    let teksWA = "Halo AS Project, saya mau order layanan berikut:%0A%0A";
    let totalBayar = 0;

    listKeranjang.forEach((item, index) => {
        let subTotal = item.price * item.qty;
        totalBayar += subTotal;
        
        strukBelanja += `${index + 1}. ${item.name} (${item.qty}x) = Rp ${subTotal.toLocaleString('id-ID')}\n`;
        teksWA += `${index + 1}. ${item.name} (${item.qty}x) = Rp ${subTotal.toLocaleString('id-ID')}%0A`;
    });

    strukBelanja += `\n---------------------------------\n`;
    strukBelanja += `Estimasi Total Biaya: Rp ${totalBayar.toLocaleString('id-ID')}\n\n`;
    strukBelanja += `Apakah Anda ingin melanjutkan ke pembayaran via WhatsApp (QRIS/E-Wallet)?`;

    teksWA += `%0A---------------------------------%0A`;
    teksWA += `*Total Biaya: Rp ${totalBayar.toLocaleString('id-ID')}*%0A%0A`;
    teksWA += `Mohon info untuk sistem pembayaran digitalnya (QRIS/E-Wallet).`;

    // Sistem Konfirmasi yang bertindak sebagai Tombol "Bayar Sekarang"
    let konfirmasiBayar = confirm(strukBelanja);

    if (konfirmasiBayar) {
        // GANTI NOMOR DI BAWAH INI dengan nomor WhatsApp bisnis kamu (awali dengan 62)
        let nomorWA = "6283826262187"; 
        window.open(`https://api.whatsapp.com/send?phone=${nomorWA}&text=${teksWA}`, '_blank');
    }
});

// ==========================================
// 5. UTILITY ICONS ACTION
// ==========================================
function tombolCari() {
    let kataKunci = prompt("Layanan apa yang sedang Anda cari di AS project?");
    if (kataKunci) alert(`Mencari layanan "${kataKunci}"...`);
}

function tombolUser() {
    alert("Fitur akun Client belum diaktifkan.");
}
