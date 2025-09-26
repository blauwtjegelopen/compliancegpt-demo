// components/SafeDataFlow.tsx
import React from 'react';

/**
 * SafeDataFlow
 * - Glass cards + soft gradients
 * - Animated dashed connectors (respects prefers-reduced-motion)
 * - Hover mini-cards (no modal)
 * - Dark/Light tuned
 */
export default function SafeDataFlow() {
  return (
    <section aria-labelledby="sdf-title" className="bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-3">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          <span className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Data Flow
          </span>
        </div>

        <h2 id="sdf-title" className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          How <span className="text-blue-600">LayerZero</span> keeps your data safe
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Enforce policy before inference. Redact sensitive fields inline. Approve exceptions with full audit.
        </p>

        {/* Diagram */}
        <div className="relative mt-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-gray-900/50 backdrop-blur p-6">
          {/* Soft background accents */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-70 dark:opacity-50"
            style={{
              background:
                'radial-gradient(520px 220px at 85% -10%, rgba(6,182,212,.12), transparent 60%), radial-gradient(420px 260px at 10% 15%, rgba(59,130,246,.10), transparent 60%)',
            }}
          />

          {/* SVG connectors (animated dashed lines) */}
          <ConnectorSVG />

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
            <FlowNode
              index={0}
              title="Tenant-bound by default"
              subtitle="Data never leaves your boundaries unless policy allows"
              details={[
                'Prompts processed within your tenant where supported',
                'Inline redaction before any model sees sensitive fields',
                'No training on your data',
              ]}
              hoverNote={{
                heading: 'What it does',
                body: 'Keeps prompts and context close to source systems to reduce exposure.',
                why: 'Cuts risk in transit and simplifies compliance reviews.',
              }}
            />

            <FlowNode
              index={1}
              title="Pre-inference guardrail"
              subtitle="Policies applied before the model runs"
              details={[
                'PII, code, secrets detection with configurable rules',
                'Redact or block with human-readable rationale',
                'Segment-specific packs (finance/healthcare, etc.)',
              ]}
              hoverNote={{
                heading: 'What it does',
                body: 'Evaluates every prompt for sensitive content and policy violations.',
                why: 'Prevents leakage and keeps logs consistent for audits.',
              }}
            />

            <FlowNode
              index={2}
              title="Accountable exceptions"
              subtitle="Human-in-the-loop approvals with full audit"
              details={[
                'Escalate medium/high risk prompts to approvers',
                'Capture rationale; decisions learned to reduce escalations',
                'Tamper-evident logs & exportable evidence',
              ]}
              hoverNote={{
                heading: 'What it does',
                body: 'Routes edge cases to reviewers and records decisions.',
                why: 'Maintains velocity while proving control to auditors.',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Small building blocks ---------- */

function FlowNode({
  index,
  title,
  subtitle,
  details,
  hoverNote,
}: {
  index: number;
  title: string;
  subtitle: string;
  details: string[];
  hoverNote: { heading: string; body: string; why: string };
}) {
  return (
    <div
      className={`group relative rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/60
                  ring-1 ring-black/5 dark:ring-white/5 backdrop-blur p-5 transition
                  hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20
                  ${index === 1 ? 'md:translate-y-2' : ''}`}
      style={{ transitionDuration: '250ms' }}
    >
      {/* Icon dot */}
      <span
        className="absolute -top-2 -left-2 h-8 w-8 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500
                   ring-2 ring-white dark:ring-gray-900 flex items-center justify-center text-white text-xs"
      >
        {index + 1}
      </span>

      <div className="relative">
        <div className="text-base font-semibold text-gray-900 dark:text-white">{title}</div>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>

        {/* Expandable detail (no page bloat) */}
        <details className="mt-3 open:animate-[fadeIn_.2s_ease-out]">
          <summary className="cursor-pointer list-none select-none inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
            <Chevron />
            <span>See details</span>
          </summary>
          <ul className="mt-2 space-y-1 pl-6 text-sm text-gray-600 dark:text-gray-300">
            {details.map((d) => (
              <li key={d} className="list-disc">{d}</li>
            ))}
          </ul>
        </details>

        {/* Hover mini-card */}
        <div
          role="tooltip"
          className="pointer-events-none absolute -right-2 top-10 z-10 w-72 opacity-0 translate-y-2
                     rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-3
                     shadow-lg shadow-black/5 dark:shadow-black/30 transition
                     group-hover:opacity-100 group-hover:translate-y-0"
          style={{ transitionDuration: '200ms' }}
        >
          <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">{hoverNote.heading}</div>
          <div className="mt-1 text-sm text-gray-800 dark:text-gray-100">{hoverNote.body}</div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">Why it matters — {hoverNote.why}</div>
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

function ConnectorSVG() {
  /* Animated dashed strokes; disabled for users who prefer reduced motion */
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-x-6 top-1/2 -translate-y-1/2 hidden md:block"
      viewBox="0 0 960 80"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lg" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.7" />
        </linearGradient>
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .dash {
              stroke-dasharray: 6 8;
              animation: dashMove 1.8s linear infinite;
            }
            @keyframes dashMove {
              to { stroke-dashoffset: -60; }
            }
          }
        `}</style>
      </defs>
      {/* Left → Middle */}
      <path d="M80,40 C240,40 240,40 440,40" stroke="url(#lg)" strokeWidth="2" fill="none" className="dash" />
      {/* Middle → Right */}
      <path d="M520,40 C720,40 720,40 880,40" stroke="url(#lg)" strokeWidth="2" fill="none" className="dash" />
      {/* Glowing endpoints */}
      {[80, 440, 520, 880].map((x) => (
        <circle key={x} cx={x} cy={40} r={3} fill="url(#lg)" style={{ filter: 'drop-shadow(0 0 6px rgba(103,232,249,.7))' }} />
      ))}
    </svg>
  );
}