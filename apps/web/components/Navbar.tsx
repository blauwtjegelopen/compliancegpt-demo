'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Menu, X } from 'lucide-react';

type NavItem = { label: string; href: string; authOnly?: boolean };

const PUBLIC_NAV: NavItem[] = [
  { label: 'Features', href: '/features' },
  { label: 'Compare', href: '/compare' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Try Demo', href: '/admin/demo' },
];

const AUTH_NAV: NavItem[] = [{ label: 'Admin', href: '/admin', authOnly: true }];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // logo load states for nice fade-in (prevents pop)
  const [logoLoaded, setLogoLoaded] = useState({ light: false, dark: false });

  // close mobile tray on route change
  useEffect(() => setOpen(false), [pathname]);

  // tiny fade on scroll: solidify header & add subtle shadow
  const raf = useRef<number | null>(null);
  useEffect(() => {
    const onScroll = () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 12);
      });
    };
    onScroll(); // initialize on mount
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname?.startsWith(href));

  const items = session?.user ? [...PUBLIC_NAV, ...AUTH_NAV] : PUBLIC_NAV;

  return (
    <header
      className={cx(
        'sticky top-0 z-50 transition-colors',
        // base/backdrop
        'backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-black/30',
        // soft border at top
        'border-b border-transparent',
        // animated states
        scrolled
          ? 'bg-white/95 dark:bg-gray-950/80 border-gray-200/70 dark:border-white/10 shadow-sm'
          : 'bg-white/85 dark:bg-gray-950/60 border-gray-200/40 dark:border-white/5'
      )}
    >
      <nav className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Logo (routes to home) */}
          <Link href="/" className="inline-flex items-center gap-3 h-11" aria-label="LayerZero – Home">
            <span className="relative w-[160px] h-[28px] block">
              {/* Light theme (dark wordmark) */}
              <Image
                src="/logo-wordmark-dark@3x_New.png"
                alt="LayerZero"
                fill
                sizes="160px"
                priority
                className={cx(
                  'absolute inset-0 object-contain transition-opacity duration-300',
                  'opacity-100 dark:opacity-0',
                  logoLoaded.light ? '' : 'opacity-0'
                )}
                onLoadingComplete={() => setLogoLoaded((s) => ({ ...s, light: true }))}
              />
              {/* Dark theme (light wordmark) */}
              <Image
                src="/logo-wordmark-light@3x_New.png"
                alt="LayerZero"
                fill
                sizes="160px"
                priority
                className={cx(
                  'absolute inset-0 object-contain transition-opacity duration-300',
                  'opacity-0 dark:opacity-100',
                  logoLoaded.dark ? '' : 'opacity-0'
                )}
                onLoadingComplete={() => setLogoLoaded((s) => ({ ...s, dark: true }))}
              />
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  'inline-flex items-center rounded-lg px-3 h-11 text-sm transition',
                  'hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-white/10 dark:hover:text-white',
                  isActive(item.href)
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* Auth area */}
            {session?.user ? (
              <div className="ml-2 flex items-center gap-2">
                <span className="hidden lg:inline text-sm text-gray-600 dark:text-gray-400">
                  {session.user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="inline-flex items-center rounded-2xl h-11 px-4 text-sm font-medium border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn(undefined, { callbackUrl: '/admin' })}
                className="ml-2 inline-flex items-center rounded-2xl h-11 px-4 text-sm font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile toggler */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-xl h-11 w-11 border border-gray-300 dark:border-white/10"
          >
            {open ? <Menu className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile tray */}
        {open && (
          <div className="md:hidden pb-3">
            <div className="grid gap-1">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    'rounded-lg px-3 h-11 inline-flex items-center',
                    isActive(item.href)
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
                      : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10'
                  )}
                >
                  {item.label}
                </Link>
              ))}

              {session?.user ? (
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="mt-1 rounded-xl h-11 px-3 text-left inline-flex items-center border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => signIn(undefined, { callbackUrl: '/admin' })}
                  className="mt-1 rounded-xl h-11 px-3 inline-flex items-center bg-black text-white dark:bg-white dark:text-black font-medium"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}