import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import ContactMount from '@/components/ContactMount'; // ✅ fixed path
import Footer from '@/components/Footer'; // ✅ added footer

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LayerZero',
  description: 'The foundation of safe AI',
  icons: {
    icon: '/logo-dark@3x.png', // ✅ favicon added
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ✅ Mount first so it’s always present on every route */}
        <ContactMount />
        <Navbar />
        {children}
        <Footer /> {/* ✅ footer now on all pages */}
      </body>
    </html>
  );
}