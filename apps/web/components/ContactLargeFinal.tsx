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
    <section
      className="
        relative overflow-hidden rounded-2xl border shadow-sm
        border-black/10 dark:border-white/10
        bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950
      "
    >
      {/* Accent top bar */}
      <div className="h-2 w-full bg-neutral-900 dark:bg-blue-500" />

      <div
        className="
          grid lg:grid-cols-2
          bg-gray-50/70 dark:bg-transparent
        "
      >
        {/* Left column: copy + USPs */}
        <div
          className="
            p-6 sm:p-8
            bg-white/70 dark:bg-white/[0.03]
            backdrop-blur
            border-b lg:border-b-0 lg:border-r
            border-black/5 dark:border-white/10
          "
        >
          <header className="mb-4">
            <h2 className="text-lg font-semibold leading-tight text-gray-900 dark:text-white">
              Talk to us
            </h2>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              Tell us about your project and we’ll reach out with next steps.
            </p>
          </header>

          <ul className="mt-4 space-y-4">
            <li className="flex items-start gap-3">
              <span aria-hidden className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Fast path to a compliant MVP
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  From discovery to pilot, we help you ship quickly with guardrails.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span aria-hidden className="mt-1 h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-slate-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Secure, enterprise-ready integrations
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  SSO, audit logs, data controls, and sensible defaults for teams.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <span aria-hidden className="mt-1 h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-slate-500" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  BYOK & tenancy isolation
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Keep ownership of your LLM keys and enforce org-level policies.
                </p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right column: form */}
        <div className="p-6 sm:p-8">
          <form onSubmit={onSubmit} className="space-y-3">
            {/* Accessible (visually hidden) labels */}
            <label className="sr-only" htmlFor="contact-name">Your name</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              required
              placeholder="Your name"
              className="
                w-full rounded-md border px-3 py-2
                text-gray-900 placeholder-gray-400
                dark:text-gray-100 dark:placeholder-gray-400
                border-gray-300 dark:border-white/15
                bg-white dark:bg-slate-900/50
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
              "
            />

            <label className="sr-only" htmlFor="contact-company">Company</label>
            <input
              id="contact-company"
              type="text"
              name="company"
              placeholder="Company"
              className="
                w-full rounded-md border px-3 py-2
                text-gray-900 placeholder-gray-400
                dark:text-gray-100 dark:placeholder-gray-400
                border-gray-300 dark:border-white/15
                bg-white dark:bg-slate-900/50
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
              "
            />

            <label className="sr-only" htmlFor="contact-email">Work email</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              required
              placeholder="you@company.com"
              className="
                w-full rounded-md border px-3 py-2
                text-gray-900 placeholder-gray-400
                dark:text-gray-100 dark:placeholder-gray-400
                border-gray-300 dark:border-white/15
                bg-white dark:bg-slate-900/50
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
              "
            />

            <label className="sr-only" htmlFor="contact-phone">Phone number</label>
            <input
              id="contact-phone"
              type="tel"
              name="phone"
              placeholder="Phone number"
              className="
                w-full rounded-md border px-3 py-2
                text-gray-900 placeholder-gray-400
                dark:text-gray-100 dark:placeholder-gray-400
                border-gray-300 dark:border-white/15
                bg-white dark:bg-slate-900/50
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
              "
            />

            <label className="sr-only" htmlFor="contact-details">Project details</label>
            <textarea
              id="contact-details"
              name="details"
              required
              placeholder="Tell us about your project…"
              className="
                h-28 w-full resize-y rounded-md border px-3 py-2
                text-gray-900 placeholder-gray-400
                dark:text-gray-100 dark:placeholder-gray-400
                border-gray-300 dark:border-white/15
                bg-white dark:bg-slate-900/50
                focus:outline-none focus:ring-2 focus:ring-blue-500/40
              "
            />

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                We’ll only use your info to contact you about this inquiry.
              </p>
              <button
                type="submit"
                disabled={pending}
                className="
                  rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-70
                  bg-blue-600 text-white hover:bg-blue-700
                  dark:bg-blue-500 dark:hover:bg-blue-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500/40
                "
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