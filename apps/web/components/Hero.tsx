'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { EyeOff } from 'lucide-react';

export default function Hero() {
  const [loadingPreview, setLoadingPreview] = useState(true);

  // Doherty Threshold-style loading shimmer (<400 ms)
  useEffect(() => {
    const t = setTimeout(() => setLoadingPreview(false), 380);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative">
      <div className="bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* --- Left copy --- */}
            <div className="min-w-0 max-w-[42rem]">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white text-balance">
                Build <span className="text-blue-500">AI you can trust</span>.
              </h1>

              <p className="mt-4 text-base sm:text-lg text-white/80">
                <span className="text-blue-500 font-semibold">LayerZero</span> is the AI policy enforcement layer for your company.
                It detects <span className="text-blue-400">PII</span>, <span className="text-blue-400">source code</span>,
                and <span className="text-blue-400">secrets</span> in real time — before anything leaves your tenant.
              </p>

              {/* CTAs with ≥ 44 px tap targets */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/admin"
                  className="inline-flex h-11 items-center justify-center px-5 rounded-2xl bg-white text-black font-semibold hover:bg-gray-100 transition"
                >
                  Launch Live Demo
                </Link>
                <a
                  href="#contact"
                  className="inline-flex h-11 items-center justify-center px-5 rounded-2xl border border-white/30 text-white hover:bg-white/10 transition"
                >
                  Contact Us
                </a>
              </div>

              <p className="mt-3 text-sm text-white/60">
                No code needed. Works with <span className="text-blue-400">OpenAI</span>, <span className="text-blue-400">Azure OpenAI</span>, and more.
              </p>
            </div>

            {/* --- Right preview with shimmer --- */}
            <div className="min-w-0 rounded-2xl bg-white/5 backdrop-blur-sm shadow p-5 border border-white/10">
              <div className="text-sm text-white/70 mb-2">Admin Preview</div>
              <div className="rounded-xl border border-white/10 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-medium text-white">Policy Decision</div>
                  <span className="px-2 py-1 rounded-full text-xs bg-emerald-900/30 text-emerald-300">
                    Allowed (Redacted)
                  </span>
                </div>

                <div className="text-xs text-white/60 mb-1">Prompt (sanitized)</div>

                {loadingPreview ? (
                  <div className="relative overflow-hidden rounded-lg border border-white/10">
                    <div className="h-24 bg-white/5" />
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <style jsx>{`
                      @keyframes shimmer {
                        100% {
                          transform: translateX(100%);
                        }
                      }
                    `}</style>
                  </div>
                ) : (
                  <pre className="text-sm bg-white/[0.03] border border-white/10 p-3 rounded-lg overflow-auto text-white/90">
{`"Write a follow-up email to [REDACTED_NAME] about invoice [REDACTED_NUMBER]."`}
                  </pre>
                )}

                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[
                    { k: 'PII Redactions', v: '18' },
                    { k: 'Blocked', v: '2.4%' },
                    { k: 'Active Users', v: '1,874' },
                  ].map((m) => (
                    <div key={m.k} className="rounded-lg border border-white/10 p-3">
                      <div className="text-xs text-white/60">{m.k}</div>
                      <div className="text-lg font-semibold text-white">{m.v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 text-right">
                  <Link
                    href="/admin"
                    className="text-sm underline text-white/80 hover:text-white"
                  >
                    See full dashboard →
                  </Link>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 text-xs text-white/60">
                <EyeOff className="h-4 w-4" />
                Inline redaction and secret scanning enabled
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}