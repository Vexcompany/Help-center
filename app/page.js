'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Download, HelpCircle, MessageCircle, ShieldCheck, Smartphone, Sparkles } from 'lucide-react';

const problems = [
  { id: 'install', icon: Smartphone, title: 'Tidak bisa install', text: 'Muncul “Aplikasi tidak terpasang” atau instalasi berhenti.' },
  { id: 'protect', icon: ShieldCheck, title: 'Play Protect muncul', text: 'Ada peringatan keamanan saat memasang APK.' },
  { id: 'update', icon: Download, title: 'Tidak bisa update', text: 'Versi baru Pagaska menolak dipasang di atas versi lama.' },
  { id: 'crash', icon: AlertTriangle, title: 'Aplikasi crash', text: 'Pagaska tertutup sendiri atau tidak bisa dibuka.' },
];

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => problems.filter((p) => `${p.title} ${p.text}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <main>
      <nav className="nav shell">
        <div className="brand"><span className="brand-mark">P</span><span>Pagaska <small>Help Center</small></span></div>
        <a className="nav-link" href="#help">Bantuan</a>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={15}/> Pusat bantuan resmi Pagaska</div>
          <h1>Kalau Pagaska bermasalah,<br/><span>kita cari tahu bareng.</span></h1>
          <p>Jangan panik kalau APK tidak bisa dipasang. Pilih masalahmu dan ikuti langkah yang paling mudah dulu.</p>
          <div className="hero-actions">
            <a className="primary" href="https://github.com/Vexcompany/Pagaska-Music/releases">Download Pagaska <ArrowRight size={17}/></a>
            <a className="secondary" href="#help"><HelpCircle size={17}/> Saya butuh bantuan</a>
          </div>
        </div>
        <div className="helper-card">
          <div className="avatar">🌸</div>
          <div>
            <div className="helper-name">Ryuna <span>online</span></div>
            <p>“Hai! Ceritakan apa yang terjadi. Kita cek pelan-pelan, tanpa istilah ribet.”</p>
          </div>
        </div>
      </section>

      <section className="trust shell">
        <div><CheckCircle2/> Panduan untuk pengguna awam</div>
        <div><ShieldCheck/> Tidak menyuruh mematikan keamanan Android</div>
        <div><Smartphone/> Langkah disesuaikan dengan masalah</div>
      </section>

      <section id="help" className="help shell">
        <div className="section-head">
          <div><div className="eyebrow">Bantuan cepat</div><h2>Apa yang terjadi?</h2></div>
          <div className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari masalah..." /></div>
        </div>
        <div className="problem-grid">
          {filtered.map(({ id, icon: Icon, title, text }) => (
            <button key={id} className={`problem ${selected === id ? 'active' : ''}`} onClick={() => setSelected(selected === id ? null : id)}>
              <div className="problem-icon"><Icon size={21}/></div><div className="problem-copy"><strong>{title}</strong><span>{text}</span></div><ArrowRight size={18}/>
            </button>
          ))}
        </div>
        {selected && <Guide id={selected}/>} 
      </section>

      <section className="assistant shell">
        <div className="assistant-icon">🤝</div>
        <div><div className="eyebrow">Butuh bantuan lebih lanjut?</div><h2>Tanya Ryuna</h2><p>Nanti bagian ini bisa kita sambungkan ke AI untuk membantu membaca keluhan dan mengarahkan pengguna ke solusi yang tepat.</p></div>
        <button className="secondary" onClick={() => alert('AI helper akan tersedia setelah backend SenseNova dipasang.') }><MessageCircle size={17}/> Mulai percakapan</button>
      </section>

      <footer className="footer shell"><span>© 2026 Pagaska</span><span>Help Center · Dibuat untuk komunitas Pagaska</span></footer>
    </main>
  );
}

function Guide({ id }) {
  const guides = {
    install: { title: 'Aplikasi tidak terpasang', intro: 'Pesan ini belum tentu berarti Pagaska rusak. Android memakai pesan umum untuk beberapa penyebab.', steps: ['Pastikan APK selesai diunduh dari sumber resmi Pagaska.', 'Jika Pagaska versi lama masih terpasang, coba update dari APK resmi yang sama.', 'Pastikan ruang penyimpanan cukup dan APK sesuai perangkat.', 'Kalau tetap gagal, catat pesan yang muncul persis dan hubungi admin Pagaska.'] },
    protect: { title: 'Play Protect muncul', intro: 'Play Protect adalah sistem keamanan Android. Jangan mematikannya hanya agar instalasi berjalan.', steps: ['Baca pesan Play Protect dengan teliti.', 'Pastikan APK berasal dari halaman rilis resmi Pagaska.', 'Jika tersedia opsi pemeriksaan, ikuti pemeriksaan keamanan tersebut.', 'Jika Google menyebut aplikasi berbahaya, jangan lanjutkan dan kirim detail peringatannya ke admin.'] },
    update: { title: 'Tidak bisa update', intro: 'Update biasanya membutuhkan package name dan signing certificate yang konsisten.', steps: ['Pastikan kamu mengunduh release resmi Pagaska terbaru.', 'Jangan memasang APK dari sumber tidak resmi di atas instalasi resmi.', 'Jika Android menyebut signature berbeda, jangan hapus data dulu—hubungi admin untuk diagnosis.', 'Untuk versi yang sangat lama, admin mungkin perlu memberi jalur migrasi khusus.'] },
    crash: { title: 'Pagaska crash', intro: 'Kita perlu tahu kapan crash terjadi supaya penyebabnya bisa dipersempit.', steps: ['Coba buka Pagaska sekali lagi dan catat kapan aplikasi tertutup.', 'Catat apakah crash terjadi saat startup, mencari lagu, memutar lagu, atau membuka halaman tertentu.', 'Pastikan kamu menggunakan release terbaru.', 'Kirim versi Android, versi Pagaska, dan langkah terakhir sebelum crash ke admin.'] },
  };
  const guide = guides[id];
  return <article className="guide"><div className="guide-label">Ryuna menyarankan</div><h3>{guide.title}</h3><p>{guide.intro}</p><ol>{guide.steps.map((s, i) => <li key={i}>{s}</li>)}</ol></article>;
}
