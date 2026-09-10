import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AnimeModal from '@/components/anime/AnimeModal';
import StoreInitializer from '@/components/StoreInitializer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'UrOtaku - Your Ultimate Anime Streaming Platform',
  description: 'Discover, watch, and discuss your favorite anime with fellow otakus. Stream the latest anime series and join anime communities.',
  keywords: ['anime', 'streaming', 'community', 'manga', 'otaku'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <StoreInitializer />
        <Navbar />
        <main className="min-h-screen pt-16">
          {children}
        </main>
        <Footer />
        <AnimeModal />
      </body>
    </html>
  );
}
