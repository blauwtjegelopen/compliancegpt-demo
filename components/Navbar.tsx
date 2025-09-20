'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:bg-gray-900/80">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo (centered vertically, responsive, theme-aware) */}
        <Link href="/" className="flex items-center h-full" aria-label="LayerZero Home">
          {/* Light mode logo */}
          <Image
            src="/logo-wordmark-light@3x.png"
            alt="LayerZero Logo"
            width={220}
            height={52}
            priority
            className="block dark:hidden h-auto w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
          />
          {/* Dark mode logo */}
          <Image
            src="/logo-wordmark-dark@3x.png"
            alt="LayerZero Logo"
            width={220}
            height={52}
            priority
            className="hidden dark:block h-auto w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
          />
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-5 text-[0.875rem] font-medium">
          <Link
            href="/trust"
            className="relative text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black dark:after:bg-white after:transition-all hover:after:w-full"
          >
            Security &amp; Trust
          </Link>
          <Link
            href="/admin"
            className="relative text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black dark:after:bg-white after:transition-all hover:after:w-full"
          >
            Admin Demo
          </Link>
          <button
            onClick={() => (window as any).openContactSales?.()}
            className="relative text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black dark:after:bg-white after:transition-all hover:after:w-full"
          >
            Contact Us
          </button>
          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black transition-shadow hover:shadow-lg hover:ring-1 hover:ring-black/10 dark:hover:ring-white/20"
          >
            Launch Demo
          </Link>
        </div>
      </nav>
    </header>
  );
}
