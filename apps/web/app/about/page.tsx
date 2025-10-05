// app/about/page.tsx
import ContactLargeFinal from '@/components/ContactLargeFinal';

/* --- Inline Roadmap so you can paste this file as-is --- */
function Lane({
  title,
  items,
}: {
  title: string;
  items: { title: string; note?: string; badge?: string }[];
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-transparent">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">{title}</h3>
        {title === 'Now' && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
            In progress
          </span>
        )}
      </div>
      <ul className="space-y-3">
        {items.map((i) => (
          <li
            key={i.title}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-transparent"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-200">{i.title}</div>
                {i.note && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">{i.note}</div>
                )}
              </div>
              {i.badge && (
                <span className="shrink-0 px-2 py-1 rounded-full text-[11px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                  {i.badge}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Roadmap() {
  const shipped = [
    { when: 'Aug 2025', what: 'Company founded' },
    { when: 'Sep 2025', what: 'Private beta with design partners' },
    { when: 'Sep 2025', what: 'Live Admin demo + approval workflow' },
  ];

  const now = [
    { title: 'Public launch', note: 'Live demo & docs', badge: 'Now' },
    { title: 'PII/Secrets guard', note: 'Inline redaction, region routing' },
    { title: 'Admin preview', note: 'Approvals, audit events' },
  ];

  const next = [
    { title: 'SOC 2 Type II', note: 'Audit in progress', badge: 'Q4 2025' },
    { title: 'SAML SSO & SCIM', note: 'Okta, Azure AD', badge: 'Q4 2025' },
    { title: 'SIEM export', note: 'CSV/JSON/API', badge: 'Q1 2026' },
  ];

  const later = [
    { title: 'Policy templates', note: 'Industry presets (finance/health)' },
    { title: 'DLP integrations', note: 'CrowdStrike, Microsoft Purview' },
    { title: 'Granular routing', note: 'Per-dept region policies' },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 pb-14">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200">
          Where we are — and where we’re going
        </h2>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          We’re a new team building fast. Here’s the near-term roadmap and what we’ve shipped so far.
        </p>
      </div>

      {/* Shipped this year only (keeps things fresh) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 mb-8 dark:border-white/10 dark:bg-transparent">
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-300 mb-3">
          Shipped in 2025
        </div>
        <div className="grid sm:grid-cols-3 gap-3">
          {shipped.map((s) => (
            <div
              key={s.what}
              className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-transparent"
            >
              <div className="text-xs text-gray-500 dark:text-gray-400">{s.when}</div>
              <div className="mt-1 font-medium text-gray-900 dark:text-gray-200">{s.what}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Now / Next / Later lanes */}
      <div className="grid md:grid-cols-3 gap-6">
        <Lane title="Now" items={now} />
        <Lane title="Next" items={next} />
        <Lane title="Later" items={later} />
      </div>

      <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
        Roadmap is directional and may change as we learn from customers.
      </p>
    </section>
  );
}
/* --- end Roadmap --- */

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-10">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-gray-200">
              About LayerZero
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              We’re on a mission to make AI safe for every organization—
              enforcing data policies in real time so teams can innovate with confidence.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="/trust"
                className="px-5 py-3 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50
                           dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5"
              >
                Security &amp; Trust
              </a>
              <a
                href="/admin"
                className="px-5 py-3 rounded-md bg-black text-white hover:opacity-90
                           dark:bg-gray-800 dark:text-gray-200"
              >
                Launch Live Demo
              </a>
            </div>
          </div>

          {/* Mirror visual language of the dashboard preview card */}
          <div className="rounded-2xl bg-white shadow p-6 dark:bg-transparent dark:border dark:border-white/10">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">What we do</div>
            <div className="rounded-xl border p-4 dark:border-white/10">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-lg border p-3 dark:border-white/10">
                  <div className="text-xs text-gray-500 dark:text-gray-400">PII / GDPR</div>
                  <div className="text-sm font-medium mt-1 text-gray-900 dark:text-gray-200">
                    Detect &amp; redact names, emails, phones, addresses.
                  </div>
                </div>
                <div className="rounded-lg border p-3 dark:border-white/10">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Source Code &amp; Secrets</div>
                  <div className="text-sm font-medium mt-1 text-gray-900 dark:text-gray-200">
                    Catch tokens, keys, repo refs, code fragments.
                  </div>
                </div>
                <div className="rounded-lg border p-3 dark:border-white/10">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Human-in-the-Loop</div>
                  <div className="text-sm font-medium mt-1 text-gray-900 dark:text-gray-200">
                    Escalate risky prompts for approval—then release safely.
                  </div>
                </div>
                <div className="rounded-lg border p-3 dark:border-white/10">
                  <div className="text-xs text-gray-500 dark:text-gray-400">Audit &amp; Export</div>
                  <div className="text-sm font-medium mt-1 text-gray-900 dark:text-gray-200">
                    Export decisions to your SIEM (CSV/JSON/API).
                  </div>
                </div>
              </div>
              <div className="mt-4 text-right">
                <a className="text-sm underline text-gray-700 dark:text-gray-400" href="/admin">
                  See full dashboard →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">Our Mission</h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              Empower every team to adopt AI safely. We combine real-time policy enforcement
              with transparent controls so security and compliance leaders can move fast—
              without compromising on data protection.
            </p>
          </div>
          <div className="rounded-2xl border bg-white p-5 dark:border-white/10 dark:bg-transparent">
            <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Core Values</div>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>• Security as a Product</li>
              <li>• Transparent by Default</li>
              <li>• Human-Centered Controls</li>
              <li>• Practical, not Theoretical</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Roadmap (replaces old milestones) */}
      <Roadmap />

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="rounded-2xl bg-black text-gray-200 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 dark:bg-gray-800">
          <div>
            <div className="text-xl font-semibold">The foundation of safe AI</div>
            <div className="text-sm text-gray-300">
              Zero-retention mode. Region routing. Audit exports.
            </div>
          </div>
          <div className="flex gap-3">
            <a className="px-4 py-2 rounded-md bg-white text-black hover:bg-gray-100" href="/trust">
              Security &amp; Trust
            </a>
            <a className="px-4 py-2 rounded-md border border-white/70 text-gray-200 hover:bg-white/5" href="/admin">
              Launch Demo
            </a>
          </div>
        </div>
      </section>

      {/* Contact block with anchor */}
      <div id="contact" className="max-w-6xl mx-auto px-6 pb-16">
        <ContactLargeFinal />
      </div>
    </>
  );
}