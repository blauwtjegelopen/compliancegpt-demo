// components/ComplianceAssurance.tsx
export default function ComplianceAssurance() {
  return (
    <section
      aria-labelledby="compliance-title"
      className="bg-white dark:bg-gray-950"
    >
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-3">
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-cyan-500"
          />
          <span className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Compliance & Readiness
          </span>
        </div>

        {/* Title + lead */}
        <h2
          id="compliance-title"
          className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white"
        >
          Audit-ready from day one
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          LayerZero helps you prove controls and ship safely—mapped to SOC&nbsp;2 and ISO standards,
          with sector-specific guardrails for finance and healthcare.
        </p>

        {/* Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* SOC 2 */}
          <div className="group rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40 p-4 transition-shadow hover:shadow-md dark:hover:shadow-none">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10 ring-1 ring-blue-200/60 dark:ring-blue-400/20">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-blue-600 dark:text-blue-400">
                  <path fill="currentColor" d="M12 2l7 4v5c0 5-3.5 9.74-7 11-3.5-1.26-7-6-7-11V6l7-4z" />
                </svg>
              </span>
              <div className="font-semibold text-gray-900 dark:text-white">SOC 2</div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Controls mapped to Security, Availability, and Confidentiality.
            </p>
          </div>

          {/* ISO 27001 */}
          <div className="group rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40 p-4 transition-shadow hover:shadow-md dark:hover:shadow-none">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10 ring-1 ring-emerald-200/60 dark:ring-emerald-400/20">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-emerald-600 dark:text-emerald-400">
                  <path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v5l4 2-.75 1.86L11 13V7h2z" />
                </svg>
              </span>
              <div className="font-semibold text-gray-900 dark:text-white">ISO 27001</div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Policy, access, and auditing aligned to Annex&nbsp;A controls.
            </p>
          </div>

          {/* Healthcare */}
          <div className="group rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40 p-4 transition-shadow hover:shadow-md dark:hover:shadow-none">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-500/10 ring-1 ring-rose-200/60 dark:ring-rose-400/20">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-rose-600 dark:text-rose-400">
                  <path fill="currentColor" d="M10 2h4v6h6v4h-6v6h-4v-6H4V8h6z" />
                </svg>
              </span>
              <div className="font-semibold text-gray-900 dark:text-white">Healthcare Ready</div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              PHI-aware prompts and redaction patterns to support HIPAA workflows.
            </p>
          </div>

          {/* Finance */}
          <div className="group rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40 p-4 transition-shadow hover:shadow-md dark:hover:shadow-none">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10 ring-1 ring-amber-200/60 dark:ring-amber-400/20">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-600 dark:text-amber-400">
                  <path fill="currentColor" d="M3 10l9-7 9 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10z" />
                </svg>
              </span>
              <div className="font-semibold text-gray-900 dark:text-white">Finance Ready</div>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              PCI/PII detection, trading-policy rules, and exportable audit trails.
            </p>
          </div>
        </div>

        {/* Bottom helper line */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need another framework? Map your own controls and evidence.
          </p>
          <a
            href="/trust"
            className="text-sm font-medium text-cyan-700 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded-md px-1.5 py-0.5"
          >
            See Security &amp; Trust →
          </a>
        </div>
      </div>
    </section>
  );
}