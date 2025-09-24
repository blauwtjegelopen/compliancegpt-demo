import BlackCTABanner from '@/components/BlackCTABanner';
import ContactLargeFinal from '@/components/ContactLargeFinal';

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-gray-200">
          Powerful features to deploy AI safely
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          LayerZero detects and redacts sensitive data in real time, enforces policy
          guardrails, and gives security teams full visibility and control.
        </p>
      </section>

      {/* Feature grid */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: 'GDPR / PII Guard', desc: 'Emails, phone numbers, addresses, names—redacted inline before leaving your tenant.' },
            { title: 'Source Code & Secrets', desc: 'Detect code fragments, API keys, credentials, and repo references.' },
            { title: 'Policy Guardrails', desc: 'Allow/deny patterns, domains, models, and destinations with override workflows.' },
            { title: 'Human-in-the-Loop', desc: 'Escalate risky prompts to approvers; release with audit trail.' },
            { title: 'Region Routing', desc: 'Route inference by region to satisfy data residency requirements.' },
            { title: 'Zero-Retention Mode', desc: 'Opt into strict retention controls for regulated workloads.' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border bg-white p-5 dark:bg-transparent dark:border-white/10">
              <div className="font-semibold text-gray-900 dark:text-gray-200">{f.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin preview-style card */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="rounded-2xl bg-white dark:bg-transparent dark:border-white/10 border shadow p-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Live Preview</div>
          <div className="rounded-xl border dark:border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-gray-900 dark:text-gray-200">Policy Decision</div>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                Allowed (Redacted)
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Prompt (sanitized)</div>
            <pre className="text-sm bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-white/10 p-3 rounded-lg overflow-auto text-gray-900 dark:text-gray-300">
{`"Write a follow-up email to [REDACTED_NAME] about invoice [REDACTED_NUMBER]."`}
            </pre>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="rounded-lg border dark:border-white/10 p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">PII Redactions</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">18</div>
              </div>
              <div className="rounded-lg border dark:border-white/10 p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">Blocked</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">2.4%</div>
              </div>
              <div className="rounded-lg border dark:border-white/10 p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">Active Users</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">1,874</div>
              </div>
            </div>
            <div className="mt-4 text-right">
              <a className="text-sm underline text-gray-700 dark:text-gray-400" href="/admin">
                See full dashboard →
              </a>
            </div>
          </div>
        </div>
      </section>

      <BlackCTABanner />

      {/* Contact anchor target */}
      <div id="contact" className="max-w-6xl mx-auto px-6 pb-16">
        <ContactLargeFinal />
      </div>
    </>
  );
}