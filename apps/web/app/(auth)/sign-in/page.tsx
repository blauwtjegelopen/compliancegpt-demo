// apps/web/app/(auth)/sign-in/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      // Using Credentials (email-only) as per our auth config
      const res = await signIn('credentials', {
        redirect: true,
        callbackUrl: '/admin',
        email,
      });
      // next-auth handles redirect; res may be null in app router
    } catch (err: any) {
      setError(err?.message || 'Sign-in failed');
      setBusy(false);
    }
  };

  return (
    <main className="min-h-[70vh] flex items-center">
      <section className="max-w-6xl mx-auto px-6 w-full">
        <div className="max-w-md mx-auto rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Sign in</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Use your work email to continue. Only allowed domains can register.
          </p>

          <form onSubmit={onSubmit} className="mt-5 space-y-3">
            <label className="block text-sm text-gray-700 dark:text-gray-300">
              Work email
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-transparent px-3 py-2 text-gray-900 dark:text-gray-100"
              />
            </label>

            {error && (
              <div className="text-sm rounded border border-rose-200 bg-rose-50 p-2 text-rose-800 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold bg-black text-white dark:bg-white dark:text-black disabled:opacity-60"
            >
              {busy ? 'Signing in…' : 'Continue'}
            </button>
          </form>

          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Having trouble? <Link className="underline" href="/contact">Contact support</Link>
          </div>
        </div>
      </section>
    </main>
  );
}