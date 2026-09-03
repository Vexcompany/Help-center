import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Kamu adalah Ryuna, asisten resmi Pagaska Help Center. Bantu pengguna awam menyelesaikan masalah Pagaska Music dengan bahasa Indonesia yang hangat, singkat, dan mudah diikuti. Jangan pernah menyuruh pengguna mematikan Play Protect atau fitur keamanan Android. Bedakan warning Play Protect, kegagalan instalasi, konflik signature/package, kompatibilitas perangkat, dan crash. Jika informasi tidak cukup, minta pengguna menyalin pesan error persisnya. Jangan meminta password, API key, data pribadi, atau akses perangkat.`;

export async function POST(request) {
  try {
    const { messages = [] } = await request.json();
    const keys = [process.env.SENSENOVA_API_KEY_1, process.env.SENSENOVA_API_KEY_2, process.env.SENSENOVA_API_KEY_3].filter(Boolean);
    if (!keys.length) return NextResponse.json({ error: 'AI belum dikonfigurasi.' }, { status: 503 });

    // Rotate keys server-side so API credentials never reach the browser.
    const key = keys[Date.now() % keys.length];
    const response = await fetch(process.env.SENSENOVA_API_URL || 'https://token.sensenova.cn/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.SENSENOVA_MODEL || 'sensenova-6.8-flash-lite',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.slice(-12)],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.message || 'SenseNova gagal merespons.' }, { status: response.status });
    const answer = data?.choices?.[0]?.message?.content || data?.data?.choices?.[0]?.message?.content || 'Maaf, Ryuna belum mendapat jawaban dari server.';
    return NextResponse.json({ message: answer });
  } catch (error) {
    return NextResponse.json({ error: 'Terjadi gangguan saat menghubungi bantuan AI.' }, { status: 500 });
  }
}
