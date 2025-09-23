// components/Footer.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const year = new Date().getFullYear();

  const cols = [
    {
      title: 'Product',
      links: [
        { href: '/features', label: 'Features' },
        { href: '/integrations', label: 'Integrations' },
        { href: '/pricing', label: 'Pricing' },
        { href: '/compare', label: 'Compare' },
      ],
    },
    {
      title: 'Company',
      links: [
        { href: '/about', label: 'About Us' },
        { href: '/trust', label: 'Security & Trust' },
        { href: '/admin', label: 'Admin Demo' },
      ],
    },
    {
      title: 'Get in touch',
      links: [
        // Always anchor to the page’s contact section
        { href: '#contact', label: 'Contact' },
      ],
    },
  ];

  return (
    <footer className="border-t border-gray-800 bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top */}
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" aria-label="LayerZero Home" className="inline-flex items-center">
              {/* Dark background = use light logo */}
              <Image
                src="/logo-wordmark-light@3x_New.png"
                alt="LayerZero"
                width={180}
                height={40}
                className="h-auto"
                priority
              />
            </Link>
            <p className="mt-4 text-sm text-gray-400 max-w-xs">
              The foundation of safe AI—policy, redaction, approvals, and audit across all your apps.
            </p>
          </div>

          {/* Link columns */}
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-sm font-semibold text-white">{c.title}</div>
              <ul className="mt-3 space-y-2">
                {c.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-gray-500">
            © {year} LayerZero. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}