"use client";

import { FormEvent, useState } from "react";

export default function ContactLargeFinal() {
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    alert("Thanks! We’ll be in touch soon.");
    setPending(false);
  }

  return (
    <section className="relative overflow-hidden rounded-2xl border border-black/10 shadow-sm dark:border-white/10">
      {/* Dark top bar */}
      <div className="h-2 w-full bg-neutral-900 dark:bg-black" />

      <div className="grid lg:grid-cols-2 bg-gray-50 dark:bg-neutral-800">
        {/* Left column: copy + USPs */}
        <div className="p-6 sm:p-8">
          <header className="mb-4">
            <h2 className="text-lg font-semibold leading-tight">Talk to us</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Tell us about your project and we’ll reach out with next steps.
            </p>
          </header>

          <ul className="mt-3 space-y-3">
            <li className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500"
              />
              <div>
                <p className="text-sm font-medium">Fast path to a compliant MVP</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  From discovery to pilot, we help you ship quickly with guardrails.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-1 h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600"
              />
              <div>
                <p className="text-sm font-medium">Secure, enterprise-ready integrations</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  SSO, audit logs, data controls, and sensible defaults for teams.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-1 h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600"
              />
              <div>
                <p className="text-sm font-medium">BYOK & tenancy isolation</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Keep ownership of your LLM keys and enforce org-level policies.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right column: form */}
        <div className="p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-3">
            <input
              type="text"
              name="name"
              required
              placeholder="Your name"
              className="w-full rounded-md border px-3 py-2 dark:border-white/10 dark:bg-transparent"
            />
            <input
              type="text"
              name="company"
              placeholder="Company"
              className="w-full rounded-md border px-3 py-2 dark:border-white/10 dark:bg-transparent"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="you@company.com"
              className="w-full rounded-md border px-3 py-2 dark:border-white/10 dark:bg-transparent"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              className="w-full rounded-md border px-3 py-2 dark:border-white/10 dark:bg-transparent"
            />
            <textarea
              name="details"
              required
              placeholder="Tell us about your project…"
              className="h-24 w-full resize-y rounded-md border px-3 py-2 dark:border-white/10 dark:bg-transparent"
            />

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                We’ll only use your info to contact you about this inquiry.
              </p>
              <button
                type="submit"
                disabled={pending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-70"
              >
                {pending ? "Sending…" : "Share your project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}