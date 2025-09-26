'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navItems = [
    { href: '/features', label: 'Features' },
    { href: '/integrations', label: 'Integrations' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/trust', label: 'Security & Trust' },
    { href: '/compare', label: 'Compare' },
    { href: '/state-of-ai-governance', label: 'Research' }, // ⬅️ new
    { href: '/admin', label: 'Admin Demo' },
    { href: '/about', label: 'About Us' },
  ];

  // Scroll to #contact if present; otherwise fall back to home contact
  const goToContact = () => {
    const el = typeof document !== 'undefined' ? document.getElementById('contact') : null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = '/#contact';
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:bg-gray-900/80">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" aria-label="LayerZero Home" className="flex items-center h-full">
          {/* White logo on dark backgrounds */}
          <Image
            alt="LayerZero Logo (white)"
            src="/logo-wordmark-light@3x_New.png"
            className="hidden dark:block h-auto w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
            width={240}
            height={52}
            priority
            sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, (max-width: 1024px) 220px, 240px"
          />
          {/* Dark text logo on light backgrounds */}
          <Image
            alt="LayerZero Logo (black)"
            src="/logo-wordmark-dark@3x_New.png"
            className="block dark:hidden h-auto w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
            width={240}
            height={52}
            priority
            sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, (max-width: 1024px) 220px, 240px"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5 text-[0.875rem] font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white
                         after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px]
                         after:bg-black dark:after:bg-white after:transition-all hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}

          {/* Contact Us scrolls to ContactLargeFinal with fallback */}
          <button
            type="button"
            onClick={goToContact}
            className="relative text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white
                       after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px]
                       after:bg-black dark:after:bg-white after:transition-all hover:after:w-full"
          >
            Contact Us
          </button>

          <Link
            href="/admin"
            className="px-3 py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black
                       transition-shadow hover:shadow-lg hover:ring-1 hover:ring-black/10 dark:hover:ring-white/20"
          >
            Launch Demo
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-200"
          aria-label="Toggle Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t bg-white/90 dark:bg-gray-900/90 backdrop-blur">
          <div className="max-w-6xl mx-auto px-6 py-4 grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-2 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setTimeout(goToContact, 0);
              }}
              className="block text-left px-2 py-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-white/5"
            >
              Contact Us
            </button>

            <Link
              href="/admin"
              className="block text-center mt-2 px-3 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black"
              onClick={() => setOpen(false)}
            >
              Launch Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}