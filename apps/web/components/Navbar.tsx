"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import clsx from "clsx";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const items = [
    { href: "/features", label: "Features" },
    { href: "/integrations", label: "Integrations" },
    { href: "/pricing", label: "Pricing" },
    { href: "/trust", label: "Security & Trust" },
    { href: "/compare", label: "Compare" }, // ✅ Compare visible
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur dark:bg-gray-900/80">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo (acts as Home) */}
        <Link aria-label="LayerZero Home" href="/" className="flex items-center h-full">
          {/* Light mode logo */}
          <Image
            src="/logo-wordmark-dark@3x_New.png"
            alt="LayerZero Logo (black)"
            width={240}
            height={52}
            priority
            className="block dark:hidden h-auto w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
          />
          {/* Dark mode logo */}
          <Image
            src="/logo-wordmark-light@3x_New.png"
            alt="LayerZero Logo (white)"
            width={240}
            height={52}
            priority
            className="hidden dark:block h-auto w-[180px] sm:w-[200px] md:w-[220px] lg:w-[240px]"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-5 text-[0.875rem] font-medium">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "relative text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white",
                "after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black dark:after:bg-white after:transition-all hover:after:w-full",
                isActive(item.href) && "text-black dark:text-white after:w-full"
              )}
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/#contact"
            className="relative text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white
                       after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-black dark:after:bg-white
                       after:transition-all hover:after:w-full"
          >
            Contact
          </Link>

          {/* Right side actions */}
          {session ? (
            <>
              <Link
                href="/admin"
                className="px-3 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black transition-shadow hover:shadow-lg hover:ring-1 hover:ring-black/10 dark:hover:ring-white/20"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-3 py-2 rounded-xl border border-gray-300 dark:border-white/15 hover:bg-gray-50 dark:hover:bg-white/10"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/admin/demo"
                className="px-3 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black transition-shadow hover:shadow-lg hover:ring-1 hover:ring-black/10 dark:hover:ring-white/20"
              >
                Try Demo
              </Link>
              <button
                onClick={() => signIn(undefined, { callbackUrl: "/admin" })}
                className="px-3 py-2 rounded-xl border border-gray-300 dark:border-white/15 hover:bg-gray-50 dark:hover:bg-white/10"
              >
                Sign In
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-gray-700 dark:text-gray-200"
          aria-label="Toggle Menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden border-t bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col gap-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={clsx(
                  "py-2",
                  "text-gray-800 dark:text-gray-200",
                  isActive(item.href) && "font-semibold"
                )}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="py-2 text-gray-800 dark:text-gray-200"
            >
              Contact
            </Link>

            <div className="pt-2 flex items-center gap-2">
              {session ? (
                <>
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex-1 px-3 py-3 rounded-xl text-center bg-black text-white dark:bg-white dark:text-black"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="flex-1 px-3 py-3 rounded-xl border border-gray-300 dark:border-white/15"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/admin/demo"
                    onClick={() => setOpen(false)}
                    className="flex-1 px-3 py-3 rounded-xl text-center bg-black text-white dark:bg-white dark:text-black"
                  >
                    Try Demo
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      signIn(undefined, { callbackUrl: "/admin" });
                    }}
                    className="flex-1 px-3 py-3 rounded-xl border border-gray-300 dark:border-white/15"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}