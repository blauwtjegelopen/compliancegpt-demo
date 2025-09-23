import ContactLargeFinal from "@/components/ContactLargeFinal";
import ContactModal from "@/components/ContactModal";

export default function ComparePage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-10">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-gray-200">
            LayerZero vs. Using an LLM Directly
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            What changes when you route prompts through LayerZero? In short:
            less risk, more control, same developer speed.
          </p>
        </div>
      </section>

      {/* TL;DR */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="rounded-2xl border bg-white p-6 dark:bg-transparent dark:border-white/10">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Risk
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                PII/code leakage prevented
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Inline redaction and deny rules block sensitive data from ever
                leaving your tenant.
              </p>
            </div>
            <div>
              <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Control
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                Approvals, audit, routing
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Human-in-the-loop for edge cases, with full audit logs and
                region/provider routing.
              </p>
            </div>
            <div>
              <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Effort
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">
                Drop-in integration
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Keep your current app and LLM—point traffic via LayerZero’s
                proxy or SDK. No rewrites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4 text-center">
          Head-to-head comparison
        </h2>

        <div className="overflow-x-auto rounded-2xl border bg-white dark:bg-transparent dark:border-white/10">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b dark:border-white/10">
                <th className="text-left px-4 py-4 font-semibold text-gray-900 dark:text-gray-200 w-[28%]">
                  Capability
                </th>
                <th className="text-left px-4 py-4 font-semibold text-gray-900 dark:text-gray-200">
                  Using an LLM Directly
                </th>
                <th className="text-left px-4 py-4 font-semibold text-gray-900 dark:text-gray-200">
                  With LayerZero In Front
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-white/10">
              {[
                {
                  cap: "PII / GDPR protection",
                  direct: "Manual patterns or none; high risk of accidental leakage.",
                  lz: "Automatic detection & inline redaction before the LLM.",
                },
                {
                  cap: "Source code & secrets",
                  direct: "Developers must remember not to paste code/keys; risky.",
                  lz: "Detectors for tokens, repo refs, code fragments; block/clean.",
                },
                {
                  cap: "Policy enforcement",
                  direct: "Custom middleware per app; inconsistent across teams.",
                  lz: "Central allow/deny rules applied consistently across apps.",
                },
                {
                  cap: "Approvals (HITL)",
                  direct: "Typically missing; ad-hoc Slack/share links for reviews.",
                  lz: "Built-in approver workflow for sensitive operations.",
                },
                {
                  cap: "Audit & reporting",
                  direct: "Scattered logs; no unified visibility for compliance.",
                  lz: "Unified audit trail; export to SIEM (CSV/JSON/API).",
                },
                {
                  cap: "Provider/region routing",
                  direct: "Hardwired to one provider/region; slow to change.",
                  lz: "Route by policy to regions/providers per department/use case.",
                },
                {
                  cap: "Integration effort",
                  direct: "Embed SDKs & write custom checks in every app.",
                  lz: "Drop-in proxy or SDK; central policy managed once.",
                },
                {
                  cap: "Latency impact",
                  direct: "Raw provider latency.",
                  lz: "Small overhead (policy+redaction) with caching where safe.",
                },
                {
                  cap: "Data retention",
                  direct: "Depends on provider defaults; hard to validate.",
                  lz: "Zero-retention mode; explicit data handling guarantees.",
                },
              ].map((row) => (
                <tr key={row.cap}>
                  <td className="align-top px-4 py-4 font-medium text-gray-900 dark:text-gray-200">
                    {row.cap}
                  </td>
                  <td className="align-top px-4 py-4 text-gray-700 dark:text-gray-300">
                    {row.direct}
                  </td>
                  <td className="align-top px-4 py-4 text-gray-700 dark:text-gray-300">
                    {row.lz}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
          LayerZero adds policy, approvals, and audit on top of your existing providers—no vendor lock-in.
        </p>
      </section>

      {/* Impact Examples */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Customer Support",
              before: `“Find Jane Doe’s overdue invoice and draft a note.”`,
              after: `“Find [REDACTED_NAME]’s overdue invoice [REDACTED_NUMBER] and draft a note.”`,
              impact: "PII removed automatically; safe prompt remains useful.",
            },
            {
              title: "Engineering",
              before: `“Summarize this stack trace from repo foo/private and my API key ABCD-...”`,
              after: `“Summarize this stack trace from repo [REDACTED_REPO] and [REDACTED_KEY].”`,
              impact: "No tokens or repo paths leave the tenant.",
            },
            {
              title: "Finance & Legal",
              before: `“Extract names/IBANs from these invoices for a report.”`,
              after: `“Extract [REDACTED_NAME]/[REDACTED_IBAN] from these invoices for a report.”`,
              impact: "Sensitive fields masked; approvers can selectively release.",
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border bg-white p-6 dark:bg-transparent dark:border-white/10"
            >
              <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
                {c.title}
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="rounded-xl border p-3 bg-gray-50 dark:bg-gray-800 dark:border-white/10">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Before</div>
                  <pre className="text-sm text-gray-800 dark:text-gray-200 bg-transparent whitespace-pre-wrap">
                    {c.before}
                  </pre>
                </div>
                <div className="rounded-xl border p-3 bg-gray-50 dark:bg-gray-800 dark:border-white/10">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">After</div>
                  <pre className="text-sm text-gray-800 dark:text-gray-200 bg-transparent whitespace-pre-wrap">
                    {c.after}
                  </pre>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                {c.impact}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Callout */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="rounded-2xl bg-black text-gray-200 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 dark:bg-gray-800">
          <div>
            <div className="text-xl font-semibold">Adopt AI—without the compliance headache</div>
            <div className="text-sm text-gray-300">
              Keep your current LLMs. Add LayerZero for redaction, approvals, and audit.
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

      {/* Contact anchor target */}
      <div id="contact" className="max-w-6xl mx-auto px-6 pb-16">
        <ContactLargeFinal />
      </div>

      <ContactModal />
    </>
  );
}