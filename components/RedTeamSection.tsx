// components/RedTeamSection.tsx
export default function RedTeamSection() {
  return (
    <section aria-labelledby="redteam-title" className="bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-rose-500" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Adversarial Testing
          </span>
        </div>

        <h2 id="redteam-title" className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Red-team your prompts and policies before attackers do
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Automatically probe models and guardrails with jailbreaks, leakage attempts, and policy edge cases.
          Track weaknesses, create fixes, and re-run tests on every change.
        </p>

        {/* Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            icon={<ShieldIcon />}
            title="Attack Library"
            body="Prebuilt jailbreaks & exfiltration patterns updated continuously."
          />
          <Card
            icon={<TargetIcon />}
            title="Scenario Builder"
            body="Compose domain-specific tests: finance, healthcare, source-code leaks."
          />
          <Card
            icon={<GraphIcon />}
            title="Risk Scoring"
            body="Quantify pass/fail, severity, & policy coverage across runs."
          />
          <Card
            icon={<ReplayIcon />}
            title="CI Re-runs"
            body="Gate deploys: fail builds when critical tests regress."
          />
        </div>

        {/* Mini table of “last run” (simulated) */}
        <div className="mt-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-gray-900/40 p-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 dark:text-gray-400">
                  <th className="py-2">Suite</th>
                  <th className="py-2">Cases</th>
                  <th className="py-2">Pass</th>
                  <th className="py-2">Fail</th>
                  <th className="py-2">Risk</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 dark:text-gray-100">
                <Row suite="PII Exfiltration" cases="36" pass="34" fail="2" risk="Medium" />
                <Row suite="Source-Code Leakage" cases="24" pass="24" fail="0" risk="Low" />
                <Row suite="Financial Disclosures" cases="18" pass="16" fail="2" risk="Medium" />
                <Row suite="Jailbreak Resilience" cases="40" pass="35" fail="5" risk="High" />
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Export results to your SIEM. Open API for custom tests.
          </p>
          <div className="flex gap-2">
            <a
              href="/admin"
              className="rounded-xl px-3.5 py-2 text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
            >
              Run a red-team demo
            </a>
            <button
              type="button"
              className="rounded-xl border px-3.5 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 border-gray-300 dark:border-white/15 hover:bg-gray-50 dark:hover:bg-white/5"
              aria-pressed="false"
            >
              View last report
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --- Small building blocks --- */

function Card({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-rose-300/60 dark:ring-rose-400/20 bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300">
          {icon}
        </span>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{body}</p>
        </div>
      </div>
    </div>
  );
}

function Row({ suite, cases, pass, fail, risk }: { suite: string; cases: string; pass: string; fail: string; risk: string }) {
  const riskColor =
    risk === "High"
      ? "text-rose-600 dark:text-rose-400"
      : risk === "Medium"
      ? "text-amber-600 dark:text-amber-400"
      : "text-emerald-600 dark:text-emerald-400";
  return (
    <tr className="border-t border-gray-100 dark:border-white/10">
      <td className="py-2">{suite}</td>
      <td className="py-2">{cases}</td>
      <td className="py-2">{pass}</td>
      <td className="py-2">{fail}</td>
      <td className={`py-2 ${riskColor}`}>{risk}</td>
    </tr>
  );
}

/* Icons (inline, no external deps) */
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M12 3l7 3v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-3z" fill="currentColor" />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M12 2v2m8 8h2M4 12H2m10 8v2m5-7a5 5 0 11-10 0 5 5 0 0110 0z" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
function GraphIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M4 20V4m0 12l4-4 3 3 6-6" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}
function ReplayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M12 6V3L8 7l4 4V8a6 6 0 11-6 6" stroke="currentColor" strokeWidth="2" fill="none" />
    </svg>
  );
}