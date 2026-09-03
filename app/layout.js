import './globals.css';

export const metadata = {
  title: 'Pagaska Help Center',
  description: 'Panduan instalasi, troubleshooting, dan bantuan resmi Pagaska.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
