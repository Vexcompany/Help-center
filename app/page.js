'use client';

import { useMemo, useRef, useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, Download, HelpCircle, ImagePlus, MessageCircle, ShieldCheck, Smartphone, Sparkles, X } from 'lucide-react';

const problems = [
  { id: 'install', icon: Smartphone, title: 'Tidak bisa install', text: 'Muncul “Aplikasi tidak terpasang” atau instalasi berhenti.' },
  { id: 'protect', icon: ShieldCheck, title: 'Play Protect muncul', text: 'Ada peringatan keamanan saat memasang APK.' },
  { id: 'update', icon: Download, title: 'Tidak bisa update', text: 'Versi baru Pagaska Music menolak dipasang di atas versi lama.' },
  { id: 'crash', icon: AlertTriangle, title: 'Aplikasi crash', text: 'Pagaska Music tertutup sendiri atau tidak bisa dibuka.' },
];

export default function Home() {
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const filtered = useMemo(() => problems.filter((p) => `${p.title} ${p.text}`.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <main>
      <nav className="nav shell"><div className="brand"><span className="brand-mark">P</span><span>Pagaska Music <small>Help Center</small></span></div><a className="nav-link" href="#help">Bantuan</a></nav>
      <section className="hero shell"><div className="hero-copy"><div className="eyebrow"><Sparkles size={15}/> Pusat bantuan resmi Pagaska Music</div><h1>Ada masalah di Pagaska Music?<br/><span>Yuk, kita cari tahu bareng.</span></h1><p>Jangan panik kalau APK tidak bisa dipasang. Pilih masalahmu dan ikuti langkah yang paling mudah dulu.</p><div className="hero-actions"><a className="primary" href="/download">Download Pagaska Music <ArrowRight size={17}/></a><a className="secondary" href="#help"><HelpCircle size={17}/> Saya butuh bantuan</a></div></div><div className="helper-card"><div className="avatar">🌸</div><div><div className="helper-name">Ryuna <span>online</span></div><p>“Hai! Ceritakan apa yang terjadi. Kita cek pelan-pelan, tanpa istilah ribet.”</p></div></div></section>
      <section className="trust shell"><div><CheckCircle2/> Panduan untuk pengguna awam</div><div><ShieldCheck/> Tidak menyuruh mematikan keamanan Android</div><div><Smartphone/> Langkah disesuaikan dengan masalah</div></section>
      <section id="help" className="help shell"><div className="section-head"><div><div className="eyebrow">Bantuan cepat</div><h2>Apa yang terjadi?</h2></div><div className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Cari masalah..." /></div></div><div className="problem-grid">{filtered.map(({ id, icon: Icon, title, text }) => <button key={id} className={`problem ${selected === id ? 'active' : ''}`} onClick={() => setSelected(selected === id ? null : id)}><div className="problem-icon"><Icon size={21}/></div><div className="problem-copy"><strong>{title}</strong><span>{text}</span></div><ArrowRight size={18}/></button>)}</div>{selected && <Guide id={selected}/>}</section>
      <section className="assistant shell"><div className="assistant-icon">🤝</div><div><div className="eyebrow">Butuh bantuan lebih lanjut?</div><h2>Tanya Ryuna</h2><p>Jelaskan masalah dengan bahasa biasa. Ryuna membantu mengidentifikasi masalah dan mengarahkan langkah berikutnya.</p></div><button className="secondary" onClick={() => setChatOpen(true)}><MessageCircle size={17}/> Mulai percakapan</button></section>
      <footer className="footer shell"><span>© 2026 Pagaska Music</span><span>Help Center · Dibuat untuk pengguna Pagaska Music</span></footer>
      {chatOpen && <Chat onClose={() => setChatOpen(false)}/>} 
    </main>
  );
}

function Guide({ id }) {
  const guides = {
    install: { title: 'Aplikasi tidak terpasang', intro: 'Pesan ini belum tentu berarti Pagaska Music rusak. Android memakai pesan umum untuk beberapa penyebab.', steps: ['Pastikan APK selesai diunduh dari sumber resmi Pagaska Music.', 'Jika Pagaska Music versi lama masih terpasang, coba update dari APK resmi yang sama.', 'Pastikan ruang penyimpanan cukup dan APK sesuai perangkat.', 'Kalau tetap gagal, catat pesan yang muncul persis dan hubungi admin Pagaska Music.'] },
    protect: { title: 'Play Protect muncul', intro: 'Play Protect adalah sistem keamanan Android. Jangan mematikannya hanya agar instalasi berjalan.', steps: ['Baca pesan Play Protect dengan teliti.', 'Pastikan APK berasal dari halaman rilis resmi Pagaska Music.', 'Jika tersedia opsi pemeriksaan, ikuti pemeriksaan keamanan tersebut.', 'Jika Google menyebut aplikasi berbahaya, jangan lanjutkan dan kirim detail peringatannya ke admin.'] },
    update: { title: 'Tidak bisa update', intro: 'Update biasanya membutuhkan package name dan signing certificate yang konsisten.', steps: ['Pastikan kamu mengunduh release resmi Pagaska Music terbaru.', 'Jangan memasang APK dari sumber tidak resmi di atas instalasi resmi.', 'Jika Android menyebut signature berbeda, jangan hapus data dulu—hubungi admin untuk diagnosis.', 'Untuk versi yang sangat lama, admin mungkin perlu memberi jalur migrasi khusus.'] },
    crash: { title: 'Pagaska Music crash', intro: 'Kita perlu tahu kapan crash terjadi supaya penyebabnya bisa dipersempit.', steps: ['Coba buka Pagaska Music sekali lagi dan catat kapan aplikasi tertutup.', 'Catat apakah crash terjadi saat startup, mencari lagu, memutar lagu, atau membuka halaman tertentu.', 'Pastikan kamu menggunakan release terbaru.', 'Kirim versi Android, versi Pagaska Music, dan langkah terakhir sebelum crash ke admin.'] },
  };
  const guide = guides[id];
  return <article className="guide"><div className="guide-label">Ryuna menyarankan</div><h3>{guide.title}</h3><p>{guide.intro}</p><ol>{guide.steps.map((s, i) => <li key={i}>{s}</li>)}</ol></article>;
}

const THINKING_STATES = [
  'Ryuna sedang berpikir…',
  'Menyiapkan jawaban yang relevan…',
  'Mencocokkan dengan panduan Pagaska Music…',
  'Merangkai jawaban…',
  'Hampir selesai…',
];

function Chat({ onClose }) {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hai! Aku Ryuna 🌸 Apa yang terjadi saat kamu mencoba memakai Pagaska Music?' }]);
  const [input, setInput] = useState(''); const [busy, setBusy] = useState(false); const [thinkingState, setThinkingState] = useState(0); const [file, setFile] = useState(null); const fileInputRef = useRef(null);

  function chooseFile(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (!selected.type.startsWith('image/')) { alert('Untuk saat ini Ryuna hanya menerima gambar atau screenshot.'); e.target.value = ''; return; }
    if (selected.size > 8 * 1024 * 1024) { alert('Ukuran gambar maksimal 8 MB.'); e.target.value = ''; return; }
    setFile(selected);
  }

  async function send(e) {
    e.preventDefault(); const text = input.trim(); if ((!text && !file) || busy) return;
    const userContent = file ? [{ type: 'text', text: text || 'Tolong bantu identifikasi masalah dari screenshot ini.' }, { type: 'image_url', image_url: { url: await toDataUrl(file) } }] : text;
    const next = [...messages, { role: 'user', content: userContent, displayText: text || 'Mengirim screenshot untuk diperiksa.' }];
    setMessages(next); setInput(''); setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; setBusy(true); setThinkingState(0);
    try { const r = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next.map(({ displayText, ...message }) => message) }) }); const data = await r.json(); setMessages([...next, { role: 'assistant', content: data.message || data.error || 'Maaf, Ryuna sedang tidak tersedia.' }]); } catch { setMessages([...next, { role: 'assistant', content: 'Maaf, koneksi bantuan sedang bermasalah. Coba lagi sebentar.' }]); } finally { setBusy(false); }
  }

  function toDataUrl(blob) { return new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob); }); }

  return <div className="chat-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="chat"><header><div><strong>🌸 Ryuna</strong><span>Pagaska Music Help Assistant</span></div><button onClick={onClose} aria-label="Tutup"><X/></button></header><div className="chat-body">{messages.map((m, i) => <div key={i} className={`bubble ${m.role}`}>{m.role === 'user' ? (m.displayText || (typeof m.content === 'string' ? m.content : 'Screenshot')) : m.content}</div>)}{busy && <div className="bubble assistant thinking"><span>{THINKING_STATES[thinkingState]}</span><i/><i/><i/></div>}</div><form onSubmit={send}><input ref={fileInputRef} className="file-input" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={chooseFile}/><button type="button" className={`attach ${file ? 'selected' : ''}`} onClick={() => fileInputRef.current?.click()} title="Tambahkan screenshot" aria-label="Tambahkan screenshot"><ImagePlus size={18}/></button><div className="composer"><input value={input} onChange={(e) => setInput(e.target.value)} placeholder={file ? file.name : 'Contoh: Pagaska Music tidak bisa di-install'}/>{file && <button type="button" className="clear-file" onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} aria-label="Hapus screenshot"><X size={14}/></button>}</div><button className="primary" disabled={busy}>Kirim</button></form></section></div>;
}

if (typeof window !== 'undefined') {
  // Keep the thinking animation local to the browser; the API remains the source of truth for the answer.
}

export { THINKING_STATES };
