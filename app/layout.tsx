import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StreamX - Xem Phim VIP Online',
  description: 'Trải nghiệm xem phim chất lượng cao',
  referrer: 'no-referrer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <body className="bg-[#0d0d0c] text-white antialiased selection:bg-[#e10111] selection:text-white">
        {children}
      </body>
    </html>
  );
}