'use client';

import { useState } from 'react';

type QA = { q: string; a: string };

const faqs: QA[] = [
  { q: 'How do you block PII and secrets?', a: 'We scan prompts and responses in-stream for patterns (emails, phone numbers, names, addresses), code fragments, and key formats. Matches are redacted or blocked according to your policy before any data leaves your tenant.' },
  { q: 'Do you support Azure OpenAI?', a: 'Yes. LayerZero sits in front of OpenAI and Azure OpenAI via a drop-in proxy—no app rewrites required. You can route by region, enable zero-retention, and keep audit logs.' },
  { q: 'Can approvers release blocked prompts?', a: 'Yes. Risky prompts are escalated to approvers in a human-in-the-loop flow. Approvers can release once, edit, or add rules so similar prompts pass automatically.' },
  { q: 'How is data stored?', a: 'We operate with zero-retention by default. Policy decisions and redaction metadata can be exported to your SIEM; you control retention in your environment.' },
  { q: 'SSO / SAML / SCIM?', a: 'Growth and Enterprise plans support SAML SSO and SCIM user provisioning with major IdPs.' },
  { q: 'Exports?', a: 'CSV/JSON/API exports for audit trails and analytics are available; you can stream events to your SIEM as well.' },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number>(-1);
  const toggle = (i: number) => setOpen((prev) => (prev === i ? -1 : i));

  return (
    <section id="faq" className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
        <p className="mt-2 text-gray-600">Everything you need to know about rolling out AI safely.</p>
      </div>

      <div className="space-y-3">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          const panelId = `faq-panel-${i}`;
          const btnId = `faq-button-${i}`;
          return (
            <div key={i} className="rounded-xl border bg-white shadow-sm">
              <button
                id={btnId}
                type="button"
                className="w-full px-4 py-4 flex items-center justify-between text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-black/10 rounded-xl"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
              >
                <span className="font-medium">{item.q}</span>
                <span
                  className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border text-sm transition-transform"
                  aria-hidden="true"
                  style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                  title={isOpen ? 'Collapse' : 'Expand'}
                >
                  +
                </span>
              </button>

              {/* Render the answer ONLY when open */}
              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className="px-4 pb-4 pt-0"
                >
                  <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}