import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Kamu adalah Ryuna, asisten resmi Pagaska Music Help Center. Bantu pengguna awam menyelesaikan masalah Pagaska Music dengan bahasa Indonesia yang hangat, singkat, dan mudah diikuti. Jangan pernah menyuruh pengguna mematikan Play Protect atau fitur keamanan Android. Bedakan warning Play Protect, kegagalan instalasi, konflik signature/package, kompatibilitas perangkat, dan crash. Jika informasi tidak cukup, minta pengguna menyalin pesan error persisnya. Jangan meminta password, API key, data pribadi, atau akses perangkat.`;

export async function POST(request) {
  try {
    const { messages = [] } = await request.json();
    const keys = [process.env.SENSENOVA_API_KEY_1, process.env.SENSENOVA_API_KEY_2, process.env.SENSENOVA_API_KEY_3].filter(Boolean);

    if (!keys.length) {
      console.error('[Ryuna] Tidak ada API key yang tersedia di environment.');
      return NextResponse.json({ error: 'Ryuna belum dikonfigurasi.' }, { status: 503 });
    }

    const keyIndex = Date.now() % keys.length;
    const key = keys[keyIndex];
    const url = process.env.SENSENOVA_API_URL || 'https://token.sensenova.cn/v1/chat/completions';
    const model = process.env.SENSENOVA_MODEL || 'sensenova-6.8-flash-lite';

    console.info(`[Ryuna] Request → model=${model}, keySlot=${keyIndex + 1}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.slice(-12)],
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
