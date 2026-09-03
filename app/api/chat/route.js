import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `ROLE
Ryuna — Pagaska Music Help Center

MISSION
Identifikasi dan bantu troubleshooting masalah download, instalasi, update, Play Protect, dan crash Pagaska Music.

OUT OF SCOPE
Semua hal di luar troubleshooting Pagaska Music.

RULES
- Jawaban singkat dan mudah dipahami.
- Jangan mengarang penyebab.
- Jika bukti kurang, tanyakan informasi yang diperlukan.
- Screenshot boleh dianalisis.
- Jangan meminta data sensitif seperti password, API key, kode verifikasi, atau akses perangkat.
- Jangan menyuruh pengguna mematikan Play Protect atau fitur keamanan Android.
- Jangan menulis atau memperbaiki kode, membuat aplikasi, membantu programming, atau menjawab pertanyaan umum yang tidak berkaitan dengan Pagaska Music.
- Jika permintaan di luar scope, tolak dengan singkat dan arahkan kembali ke masalah download, instalasi, update, Play Protect, atau crash Pagaska Music.
- Jika masalah tidak dapat ditentukan dari informasi yang tersedia, arahkan pengguna untuk mengirim pesan error persis, versi Android, versi Pagaska Music, atau screenshot yang relevan.`;

const SUPPORT_TERMS = [
  'pagaska', 'apk', 'install', 'instal', 'pasang', 'download', 'unduh', 'update', 'perbarui',
  'play protect', 'crash', 'error', 'gagal', 'tidak terpasang', 'force close', 'tertutup sendiri',
  'dibuka', 'membuka', 'versi android', 'android', 'signature', 'sertifikat', 'package', 'izin',
  'screenshot', 'layar', 'aplikasi', 'rilis', 'release'
];

const GREETINGS = ['hai', 'halo', 'hi', 'hello', 'pagi', 'siang', 'sore', 'malam'];

function messageText(message) {
  if (!message) return '';
  if (typeof message.content === 'string') return message.content;
  if (Array.isArray(message.content)) {
    return message.content.filter((part) => part?.type === 'text').map((part) => part.text || '').join(' ');
  }
  return '';
}

function isGreeting(text) {
  const normalized = text.trim().toLowerCase().replace(/[!?.]+$/g, '');
  return GREETINGS.includes(normalized);
}

function isPagaskaSupport(messages) {
  const recent = messages.slice(-8);
  if (recent.some((message) => Array.isArray(message?.content) && message.content.some((part) => part?.type === 'image_url'))) return true;
  const text = recent.map(messageText).join(' ').toLowerCase();
  if (!text.trim()) return false;
  if (recent.some((message) => isGreeting(messageText(message)))) return true;
  return SUPPORT_TERMS.some((term) => text.includes(term));
}

function outOfScopeResponse() {
  return 'Aku khusus membantu masalah Pagaska Music, seperti download, instalasi, update, Play Protect, atau crash. 🌸 Ceritakan masalah Pagaska Music-mu ya.';
}

export async function POST(request) {
  try {
    const { messages = [] } = await request.json();
    if (!Array.isArray(messages)) return NextResponse.json({ error: 'Format pesan tidak valid.' }, { status: 400 });

    if (!isPagaskaSupport(messages)) {
      console.info('[Ryuna] Request ditolak: di luar scope Help Center.');
      return NextResponse.json({ message: outOfScopeResponse(), local: true });
    }

    const keys = [process.env.SENSENOVA_API_KEY_1, process.env.SENSENOVA_API_KEY_2, process.env.SENSENOVA_API_KEY_3].filter(Boolean);

    if (!keys.length) {
      console.error('[Ryuna] Tidak ada API key yang tersedia di environment.');
      return NextResponse.json({ error: 'Ryuna belum dikonfigurasi.' }, { status: 503 });
    }

    const keyIndex = Date.now() % keys.length;
    const key = keys[keyIndex];
    const url = process.env.SENSENOVA_API_URL || 'https://token.sensenova.ai/v1/chat/completions';
    const model = process.env.SENSENOVA_MODEL || 'sensenova-6.8-flash-lite';

    console.info(`[Ryuna] Request → model=${model}, keySlot=${keyIndex + 1}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.slice(-8)],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('[Ryuna] Upstream error:', {
        status: response.status,
        statusText: response.statusText,
        message: data?.message || data?.error?.message || data?.error || 'Provider tidak memberi detail.',
        code: data?.code || data?.error?.code,
        model,
        url,
        keySlot: keyIndex + 1,
      });
      return NextResponse.json({ error: `Ryuna gagal terhubung ke layanan AI (kode ${response.status}).` }, { status: response.status });
    }

    const answer = data?.choices?.[0]?.message?.content || data?.data?.choices?.[0]?.message?.content || 'Maaf, Ryuna belum mendapat jawaban dari server.';
    return NextResponse.json({ message: answer });
  } catch (error) {
    console.error('[Ryuna] Server error:', error);
    return NextResponse.json({ error: 'Terjadi gangguan saat menghubungi Ryuna.' }, { status: 500 });
  }
}
