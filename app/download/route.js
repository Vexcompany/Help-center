import { NextResponse } from 'next/server';

const REPO = 'Vexcompany/Pagaska-Music';

export async function GET() {
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      return new NextResponse('Release Pagaska Music belum tersedia.', { status: 404 });
    }

    const release = await response.json();
    const apk = release.assets?.find((asset) => asset.name.toLowerCase().endsWith('.apk'));

    if (!apk?.browser_download_url) {
      return new NextResponse('APK Pagaska Music belum tersedia pada release terbaru.', { status: 404 });
    }

    return NextResponse.redirect(apk.browser_download_url, 302);
  } catch {
    return new NextResponse('Download Pagaska Music sedang tidak tersedia.', { status: 503 });
  }
}
