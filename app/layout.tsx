import './globals.css';
import type { Metadata } from 'next';
import VipAuthModal from '@/components/VipAuthModal';

export const metadata: Metadata = {
  title: 'Xem Phim Online - Streaming Web do sinh viên UTE DN phát triển',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=Inter:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#131313] text-[#e5e2e1] antialiased min-h-screen">
        <VipAuthModal />
        {children}
      </body>
    </html>
  );
}