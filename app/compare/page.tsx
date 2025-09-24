import ContactLargeFinal from "@/components/ContactLargeFinal";

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
              <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Risk</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">PII/code leakage prevented</div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Inline redaction and deny rules block sensitive data from ever leaving your tenant.
              </p>
            </div>
            <div>
              <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Control</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">Approvals, audit, routing</div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Human-in-the-loop for edge cases, with full audit logs and region/provider routing.
              </p>
            </div>
            <div>
              <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">Effort</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">Drop-in integration</div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Keep your current app and LLM—point traffic via LayerZero’s proxy or SDK. No rewrites.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4 text-center">Head-to-head comparison</h2>
        <div className="overflow-x-auto rounded-2xl border bg-white dark:bg-transparent dark:border-white/10">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b dark:border-white/10">
                <th className="text-left px-4 py-4 font-semibold text-gray-900 dark:text-gray-200 w-[28%]">Capability</th>
                <th className="text-left px-4 py-4 font-semibold text-gray-900 dark:text-gray-200">Using an LLM Directly</th>
                <th className="text-left px-4 py-4 font-semibold text-gray-900 dark:text-gray-200">With LayerZero In Front</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-white/10">
              {[
                { cap: "PII / GDPR protection", direct: "Manual patterns or none; high risk of accidental leakage.", lz: "Automatic detection & inline redaction before the LLM." },
                { cap: "Source code & secrets", direct: "Developers must remember not to paste code/keys; risky.", lz: "Detectors for tokens, repo refs, code fragments; block/clean." },
                { cap: "Policy enforcement", direct: "Custom middleware per app; inconsistent across teams.", lz: "Central allow/deny rules applied consistently across apps." },
                { cap: "Approvals (HITL)", direct: "Typically missing; ad-hoc Slack/share links for reviews.", lz: "Built-in approver workflow for sensitive operations." },
                { cap: "Audit & reporting", direct: "Scattered logs; no unified visibility for compliance.", lz: "Unified audit trail; export to SIEM (CSV/JSON/API)." },
                { cap: "Provider/region routing", direct: "Hardwired to one provider/region; slow to change.", lz: "Route by policy to regions/providers per department/use case." },
                { cap: "Integration effort", direct: "Embed SDKs & write custom checks in every app.", lz: "Drop-in proxy or SDK; central policy managed once." },
                { cap: "Latency impact", direct: "Raw provider latency.", lz: "Small overhead (policy+redaction) with caching where safe." },
                { cap: "Data retention", direct: "Depends on provider defaults; hard to validate.", lz: "Zero-retention mode; explicit data handling guarantees." },
              ].map((row) => (
                <tr key={row.cap}>
                  <td className="align-top px-4 py-4 font-medium text-gray-900 dark:text-gray-200">{row.cap}</td>
                  <td className="align-top px-4 py-4 text-gray-700 dark:text-gray-300">{row.direct}</td>
                  <td className="align-top px-4 py-4 text-gray-700 dark:text-gray-300">{row.lz}</td>
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
      {/* ...keep impact examples, callout as before... */}

      {/* Contact anchor target */}
      <div id="contact" className="max-w-6xl mx-auto px-6 pb-16">
        <ContactLargeFinal />
      </div>
    </>
  );
}