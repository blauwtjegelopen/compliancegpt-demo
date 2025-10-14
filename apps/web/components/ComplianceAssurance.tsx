// components/ComplianceAssurance.tsx
import Link from "next/link";

export default function ComplianceAssurance() {
  return (
    <section
      aria-labelledby="compliance-title"
      className="bg-white dark:bg-gradient-to-b dark:from-gray-950 dark:to-gray-900 transition-colors"
    >
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-3">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          <span className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Compliance & Readiness
          </span>
        </div>

        {/* Title + lead */}
        <h2
          id="compliance-title"
          className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100"
        >
          Audit-ready from day one
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300 max-w-2xl">
          LayerZero helps you prove controls and ship safely—mapped to SOC&nbsp;2 and ISO standards,
          with sector-specific guardrails for finance and healthcare.
        </p>

       {/* ✅ Launch Demo button (legible in dark mode) */}
<div className="mt-6">
  <Link
    href="/admin"
    aria-label="Launch the LayerZero demo"
    className="inline-flex items-center justify-center px-5 py-3 rounded-2xl font-semibold transition-colors
               bg-blue-600 text-white hover:bg-blue-700
               dark:bg-blue-500 dark:text-white dark:hover:bg-blue-400
               focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
  >
    Launch Demo
  </Link>
</div>

        {/* Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "SOC 2",
              color: "blue",
              icon: (
                <path
                  fill="currentColor"
                  d="M12 2l7 4v5c0 5-3.5 9.74-7 11-3.5-1.26-7-6-7-11V6l7-4z"
                />
              ),
              desc: "Controls mapped to Security, Availability, and Confidentiality.",
            },
            {
              title: "ISO 27001",
              color: "emerald",
              icon: (
                <path
                  fill="currentColor"
                  d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 5v5l4 2-.75 1.86L11 13V7h2z"
                />
              ),
              desc: "Policy, access, and auditing aligned to Annex A controls.",
            },
            {
              title: "Healthcare Ready",
              color: "rose",
              icon: (
                <path fill="currentColor" d="M10 2h4v6h6v4h-6v6h-4v-6H4V8h6z" />
              ),
              desc: "PHI-aware prompts and redaction patterns to support HIPAA workflows.",
            },
            {
              title: "Finance Ready",
              color: "amber",
              icon: (
                <path fill="currentColor" d="M3 10l9-7 9 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10z" />
              ),
              desc: "PCI/PII detection, trading-policy rules, and exportable audit trails.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`group rounded-xl border p-4 bg-white dark:bg-white/[0.04]
                          border-gray-200 dark:border-white/10 hover:shadow-md dark:hover:bg-white/[0.06]
                          transition-all`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex h-8 w-8 items-center justify-center rounded-lg
                              bg-${card.color}-50 dark:bg-${card.color}-500/10
                              ring-1 ring-${card.color}-200/60 dark:ring-${card.color}-400/20`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 text-${card.color}-600 dark:text-${card.color}-400`}
                  >
                    {card.icon}
                  </svg>
                </span>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  {card.title}
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom helper line */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need another framework? Map your own controls and evidence.
          </p>
          <a
            href="/trust"
            className="text-sm font-medium text-cyan-700 hover:text-cyan-900 
                       dark:text-cyan-400 dark:hover:text-cyan-300
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40
                       rounded-md px-1.5 py-0.5 transition-colors"
          >
            See Security &amp; Trust →
          </a>
        </div>
      </div>
    </section>
  );
}