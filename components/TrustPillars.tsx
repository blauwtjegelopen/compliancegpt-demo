// components/TrustPillars.tsx
import React, { useState } from 'react';

/**
 * TrustPillars
 * - Renamed pillars with crisp POV
 * - Glass cards, hover elevation, gradient accents
 * - Expandable details + copy-to-clipboard snippets
 * - Optional “evidence” link targets where available
 */
export default function TrustPillars() {
  return (
    <section aria-labelledby="pillars-title" className="bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="inline-flex items-center gap-2 mb-3">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          <span className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Trust Pillars
          </span>
        </div>

        <h2 id="pillars-title" className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          The trust foundation for <span className="text-blue-600">LayerZero</span>
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Tenant-bound by design. Guardrails before inference. Accountable exceptions. Evidence on demand.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <PillarCard
            tone="blue"
            title="Tenant-Bound by Design"
            lead="Data stays within your boundaries by default."
            bullets={[
              'Regional hosting & data residency options',
              'No training on customer data',
              'Inline redaction before model access',
            ]}
            snippetLabel="Sample residency policy (JSON)"
            snippet={`{
  "policies": {
    "dataResidency": ["eu-west-1", "eu-central-1"],
    "trainingOptOut": true
  }
}`}
            evidenceHref="/security/LayerZero-Security-Package.pdf"
          />

          <PillarCard
            tone="cyan"
            title="Pre-Inference Guardrail"
            lead="Policy checks run before any model call."
            bullets={[
              'PII / code / secrets detection',
              'Redact or block with rationale',
              'Industry-specific rule packs',
            ]}
            snippetLabel="PII rule example (JSON)"
            snippet={`{
  "rules": [
    { "id": "pii.email", "action": "redact" },
    { "id": "secrets.apiKey", "action": "block" }
  ]
}`}
            evidenceHref="/security/LayerZero-Security-Package.pdf"
          />

          <PillarCard
            tone="violet"
            title="Accountable Exceptions"
            lead="Escalations route to approvers; decisions are logged."
            bullets={[
              'Reviewer groups with SLAs',
              'Rationale captured for evidence',
              'System learns to cut future escalations',
            ]}
            snippetLabel="Approval policy (JSON)"
            snippet={`{
  "approvals": {
    "riskThreshold": "medium",
    "groups": ["Security", "Compliance"],
    "requireRationale": true
  }
}`}
            evidenceHref="/security/LayerZero-Security-Package.pdf"
          />

          <PillarCard
            tone="emerald"
            title="Prove Compliance Anytime"
            lead="Tamper-evident logs and exportable evidence."
            bullets={[
              'Immutable audit trail with signatures',
              'CSV/JSON exports for auditors',
              'Integrates with ticketing & SIEM',
            ]}
            snippetLabel="Audit export request (JSON)"
            snippet={`{
  "export": {
    "format": "csv",
    "range": "2025-01..2025-06",
    "fields": ["timestamp","actor","action","ruleId","rationale"]
  }
}`}
            evidenceHref="/security/LayerZero-Security-Package.pdf"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------- Small building blocks ---------- */

function PillarCard({
  tone,
  title,
  lead,
  bullets,
  snippetLabel,
  snippet,
  evidenceHref,
}: {
  tone: 'blue' | 'cyan' | 'violet' | 'emerald';
  title: string;
  lead: string;
  bullets: string[];
  snippetLabel: string;
  snippet: string;
  evidenceHref?: string;
}) {
  const [copied, setCopied] = useState(false);

  const toneRing: Record<string, string> = {
    blue: 'ring-blue-300/40 dark:ring-blue-400/20',
    cyan: 'ring-cyan-300/40 dark:ring-cyan-400/20',
    violet: 'ring-violet-300/40 dark:ring-violet-400/20',
    emerald: 'ring-emerald-300/40 dark:ring-emerald-400/20',
  };
  const toneBadge: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-400',
    cyan: 'from-cyan-400 to-blue-500',
    violet: 'from-violet-500 to-fuchsia-400',
    emerald: 'from-emerald-500 to-teal-400',
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div
      className={`group relative rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/60
                  ring-1 ring-inset ${toneRing[tone]} backdrop-blur p-5 transition
                  hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20`}
      style={{ transitionDuration: '250ms' }}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl
                      text-white text-[11px] font-semibold bg-gradient-to-br ${toneBadge[tone]}`}
        >
          ★
        </span>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{lead}</p>

          {/* Expandable details */}
          <details className="mt-3 open:animate-[fadeIn_.2s_ease-out]">
            <summary className="cursor-pointer list-none select-none inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
              <Chevron />
              <span>See details</span>
            </summary>
            <ul className="mt-2 space-y-1 pl-6 text-sm text-gray-600 dark:text-gray-300">
              {bullets.map((b) => (
                <li key={b} className="list-disc">{b}</li>
              ))}
            </ul>
          </details>

          {/* Snippet + actions */}
          <div className="mt-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-200">{snippetLabel}</div>
              <div className="flex items-center gap-2">
                {evidenceHref && (
                  <a
                    href={evidenceHref}
                    className="text-xs rounded-md px-2 py-1 border border-gray-300 dark:border-white/10
                               bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    Evidence
                  </a>
                )}
                <button
                  type="button"
                  onClick={copy}
                  className="text-xs rounded-md px-2 py-1 border border-gray-300 dark:border-white/10
                             bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
            <pre className="mt-2 text-[11px] leading-relaxed text-gray-700 dark:text-gray-200 overflow-x-auto">
              <code>{snippet}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform">
      <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}