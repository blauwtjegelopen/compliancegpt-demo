// apps/web/app/layout.tsx
import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageShell from '@/components/PageShell';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LayerZero',
  description: 'The foundation of safe AI',
  icons: { icon: '/logo-dark@3x.png' },
};

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0b0f19' }, { media: '(prefers-color-scheme: light)', color: '#ffffff' }],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-dvh antialiased`}>
        <PageShell>
          <Navbar />
          {/* Global content container helpers */}
          <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            {children}
          </main>
          <Footer />
        </PageShell>
      </body>
    </html>
  );
}