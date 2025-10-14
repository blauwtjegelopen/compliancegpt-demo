'use client';

import { useState } from 'react';
import Link from 'next/link';

function MobilePreviewToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:block">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="md:hidden inline-flex items-center gap-2 rounded-lg border-subtle bg-white/10 text-white px-3 py-2 text-sm backdrop-blur-sm"
        aria-expanded={open}
        aria-controls="hero-admin-preview"
      >
        {open ? 'Hide preview' : 'View admin preview'}
        <span aria-hidden className="text-gray-300">▸</span>
      </button>

      <div id="hero-admin-preview" className={`${open ? 'mt-3' : 'hidden'} md:block`}>
        {children}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left copy */}
        <div className="min-w-0 max-w-[42rem] w-full">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-white text-balance break-words [overflow-wrap:anywhere]">
            Add a <span className="text-blue-500 font-semibold">layer of trust</span> to your AI
          </h1>

          <p
            className="mt-4 text-base sm:text-lg text-gray-700 dark:text-white/90 break-words [overflow-wrap:anywhere]"
            style={{ wordBreak: 'break-word', hyphens: 'auto' }}
          >
            <span className="text-blue-500 font-semibold">LayerZero</span> is the AI policy enforcement layer for
            your company. It helps enforce data rules, detect PII, source code, secrets, and regulated content in
            real time—before anything leaves your tenant.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="px-5 py-3 rounded-2xl bg-white text-black font-semibold hover:bg-gray-100 transition"
            >
              Launch Live Demo
            </Link>
            <button
              className="px-5 py-3 rounded-2xl border border-gray-300 text-gray-900 hover:bg-gray-50 transition dark:border-white/30 dark:text-white dark:hover:bg-white/10"
              data-contact-trigger="true"
            >
              Contact Us
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-600 dark:text-white/70">
            No code needed. Works with OpenAI, Azure OpenAI, and more.
          </p>
        </div>

        {/* Right preview card — hidden behind toggle on mobile */}
        <MobilePreviewToggle>
          <div className="min-w-0 rounded-2xl bg-white shadow p-5 border border-gray-200 card text-black">
            <div className="text-sm text-gray-600 mb-2">Admin Preview</div>
            <div className="rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="font-medium text-gray-900">Policy Decision</div>
                <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  Allowed (Redacted)
                </span>
              </div>

              <div className="text-xs text-gray-500 mb-1">Prompt (sanitized)</div>
              <pre className="text-sm bg-gray-50 p-3 rounded-lg overflow-x-auto text-gray-800">
"Write a follow-up email to [REDACTED_NAME] about invoice [REDACTED_NUMBER]."
              </pre>

              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="rounded-lg border border-gray-200 p-3">
                  <div className="text-xs text-gray-500">PII Redactions</div>
                  <div className="text-lg font-semibold text-gray-900">18</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-3">
                  <div className="text-xs text-gray-500">Blocked</div>
                  <div className="text-lg font-semibold text-gray-900">2.4%</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-3">
                  <div className="text-xs text-gray-500">Active Users</div>
                  <div className="text-lg font-semibold text-gray-900">1,874</div>
                </div>
              </div>

              <div className="mt-4 text-right">
                <Link href="/admin" className="text-sm underline text-gray-700 hover:text-gray-900">
                  See full dashboard →
                </Link>
              </div>
            </div>
          </div>
        </MobilePreviewToggle>
      </div>
    </section>
  );
}