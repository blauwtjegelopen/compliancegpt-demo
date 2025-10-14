'use client';

import React, { useState } from 'react';

type QA = { q: string; a: string };

const faqs: QA[] = [
  {
    q: 'How do you block PII and secrets?',
    a: 'We scan prompts and responses in-stream for patterns (emails, phone numbers, names, addresses), code fragments, and key formats. Matches are redacted or blocked according to your policy before any data leaves your tenant.',
  },
  {
    q: 'Do you support Azure OpenAI?',
    a: 'Yes. LayerZero sits in front of OpenAI and Azure OpenAI via a drop-in proxy—no app rewrites required. You can route by region, enable zero-retention, and keep audit logs.',
  },
  {
    q: 'Can approvers release blocked prompts?',
    a: 'Yes. Risky prompts are escalated to approvers in a human-in-the-loop flow. Approvers can release once, edit, or add rules so similar prompts pass automatically.',
  },
  {
    q: 'How is data stored?',
    a: 'We operate with zero-retention by default. Policy decisions and redaction metadata can be exported to your SIEM; you control retention in your environment.',
  },
  {
    q: 'SSO / SAML / SCIM?',
    a: 'Growth and Enterprise plans support SAML SSO and SCIM user provisioning with major IdPs.',
  },
  {
    q: 'Exports?',
    a: 'CSV/JSON/API exports for audit trails and analytics are available; you can stream events to your SIEM as well.',
  },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number>(-1);
  const toggle = (i: number) => setOpen(prev => (prev === i ? -1 : i));

  return (
    <section id="faq" className="max-w-6xl mx-auto px-6 py-16 text-gray-900 dark:text-gray-200">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Everything you need to know about rolling out AI safely.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          const panelId = `faq-panel-${i}`;
          const btnId = `faq-button-${i}`;
          return (
            <div
              key={i}
              className="rounded-xl border shadow-sm transition-colors bg-white border-gray-200 dark:bg-gray-900 dark:border-white/10"
            >
              <button
                id={btnId}
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="w-full px-4 py-4 flex items-center justify-between text-left text-gray-900 dark:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl"
              >
                <span className="font-medium">{item.q}</span>
                <span
                  aria-hidden="true"
                  className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border text-sm transition-transform border-gray-300 text-gray-500 dark:border-white/20 dark:text-gray-400"
                  style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  title={isOpen ? 'Collapse' : 'Expand'}
                >
                  +
                </span>
              </button>

              {isOpen && (
                <div id={panelId} role="region" aria-labelledby={btnId} className="px-4 pb-4 pt-0">
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}