import './globals.css';
import type { Metadata } from 'next';
import ContactModal from '@/components/ContactModal';

export const metadata: Metadata = {
  title: 'LayerZero',
  description: 'The foundation of safe AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
        {/* Contact modal mounted globally */}
        <ContactModal />
      </body>
    </html>
  );
}
