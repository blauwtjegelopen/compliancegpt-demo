// components/ResearchHero.tsx
export default function ResearchHero() {
  return (
    <section className="relative border-b border-gray-200 dark:border-white/10 overflow-hidden">
      {/* soft gradient blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-40"
        style={{
          background:
            "radial-gradient(600px 300px at 80% -20%, rgba(6,182,212,.15), transparent 60%), radial-gradient(400px 220px at 10% 10%, rgba(59,130,246,.12), transparent 60%)",
        }}
      />
      <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500" />
          <span className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 font-medium">
            LayerZero Research
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
          State of AI Governance
        </h1>
        <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
          Quarterly insights from anonymized policy telemetry—redactions, blocks, approvals—and how
          enterprises adopt AI faster while staying compliant.
        </p>
      </div>
    </section>
  );
}