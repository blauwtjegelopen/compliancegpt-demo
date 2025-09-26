// components/TrustPage.tsx
'use client';

import React from 'react';

export default function TrustPage() {
  return (
    <main className="bg-white dark:bg-gray-950">
      {/* Hero */}
      <section aria-labelledby="trust-hero" className="relative border-b border-gray-200 dark:border-white/10 overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-40"
          style={{
            background:
              'radial-gradient(600px 300px at 80% -20%, rgba(6,182,212,.15), transparent 60%), radial-gradient(420px 260px at 10% 10%, rgba(59,130,246,.12), transparent 60%)',
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500" />
            <span className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 font-medium">
              SOC 2 / ISO 27001 ready
            </span>
          </div>
          <h1 id="trust-hero" className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            Security & Trust at <span className="text-blue-600">LayerZero</span>
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600 dark:text-gray-300">
            The AI policy enforcement layer you can rely on for privacy, compliance, and auditability.
          </p>
        </div>
      </section>

      {/* Compliance badges */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/70 dark:bg-gray-900/50 backdrop-blur p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>GDPR</Badge>
            <Badge>SOC 2 (readiness)</Badge>
            <Badge>ISO 27001 (readiness)</Badge>
            <Badge>HIPAA enablement</Badge>
            <Badge>FINRA alignment</Badge>
          </div>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
            Controls mapped to common frameworks. We’ll share our security package on request.
          </p>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="max-w-6xl mx-auto px-6 pb-4">
        <div className="grid md:grid-cols-3 gap-4">
          <Pillar
            title="Data residency & tenant isolation"
            body="Processing stays tenant-bound. No training on your data. Optional region pinning for data residency."
            icon={<Dot />}
          />
          <Pillar
            title="Audit logging & traceability"
            body="Every decision is logged with policy, redaction, block/allow, and rationale for full audit trails."
            icon={<Dot />}
          />
          <Pillar
            title="Human-in-the-loop & explainability"
            body="Route risky prompts to approvers. Provide clear reasons. The system learns to reduce escalations."
            icon={<Dot />}
          />
        </div>
      </section>

      {/* Mini diagram: Policy Enforcement Layer */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-6">
          <div className="mb-4">
            <div className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Policy Enforcement Layer
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your rules, enforced in real time
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 items-stretch">
            <Stage title="Input" desc="Employee / app prompt" tone="blue" className="lg:col-span-1" />
            <Arrow className="hidden lg:flex" />
            <Stage title="Detection" desc="PII / code / secrets / regulated" tone="cyan" className="lg:col-span-1" />
            <Arrow className="hidden lg:flex" />
            <Stage title="Policy checks" desc="Your rules & industry controls" tone="amber" className="lg:col-span-1" />
            <Arrow className="hidden lg:flex" />
            <Stage title="Approval (optional)" desc="Human-in-the-loop review" tone="violet" className="lg:col-span-1" />
            <Arrow className="hidden lg:flex" />
            <Stage title="Safe output" desc="Sanitized, logged, auditable" tone="emerald" className="lg:col-span-1" />
          </div>
          {/* Mobile arrows */}
          <div className="lg:hidden mt-3 flex flex-col items-center gap-2">
            <SmallArrow /><SmallArrow /><SmallArrow /><SmallArrow />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-2xl bg-black text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xl font-semibold">Want the full security package?</div>
            <div className="text-sm text-gray-300">Policies, architecture, DPA template, and pen-test summary.</div>
          </div>
          <div className="flex gap-3">
            <a href="/#contact" className="px-4 py-2 rounded-2xl bg-white text-black">Request info</a>
            <a href="/admin" className="px-4 py-2 rounded-2xl border border-white">See the admin demo</a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------- Small building blocks ---------- */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-full border border-gray-200 dark:border-white/10
                 bg-gray-50 dark:bg-white/5 px-3 py-1 text-xs font-medium
                 text-gray-700 dark:text-gray-200"
    >
      {children}
    </span>
  );
}

function Pillar({ title, body, icon }: { title: string; body: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1
                         ring-blue-300/60 dark:ring-blue-400/20 bg-blue-50 dark:bg-blue-500/10
                         text-blue-700 dark:text-blue-300">
          {icon ?? <Dot />}
        </span>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{body}</p>
        </div>
      </div>
    </div>
  );
}

function Stage({
  title,
  desc,
  tone,
  className = '',
}: {
  title: string;
  desc: string;
  tone: 'blue' | 'cyan' | 'amber' | 'violet' | 'emerald';
  className?: string;
}) {
  const toneMap: Record<string, string> = {
    blue: 'ring-blue-300/60 dark:ring-blue-400/20 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300',
    cyan: 'ring-cyan-300/60 dark:ring-cyan-400/20 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    amber: 'ring-amber-300/60 dark:ring-amber-400/20 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300',
    violet: 'ring-violet-300/60 dark:ring-violet-400/20 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300',
    emerald: 'ring-emerald-300/60 dark:ring-emerald-400/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  };

  return (
    <div className={`rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1 ${toneMap[tone]}`}>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
            <circle cx="12" cy="12" r="6" fill="currentColor" />
          </svg>
        </span>
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function Arrow({ className = '' }: { className?: string }) {
  return (
    <div className={`items-center justify-center ${className}`}>
      <svg viewBox="0 0 56 24" className="mx-auto h-6 w-14 text-gray-300 dark:text-white/20" aria-hidden="true">
        <path d="M0 12h48m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function SmallArrow() {
  return (
    <svg viewBox="0 0 56 24" className="h-6 w-14 text-gray-300 dark:text-white/20" aria-hidden="true">
      <path d="M0 12h48m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Dot() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
      <circle cx="12" cy="12" r="6" fill="currentColor" />
    </svg>
  );
}