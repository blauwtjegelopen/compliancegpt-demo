'use client';

import React from 'react';

export default function HumanInTheLoop() {
  return (
    <section aria-labelledby="hitl-title" className="bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-3">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          <span className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Human in the Loop
          </span>
        </div>

        <h2 id="hitl-title" className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Review risky prompts before they leave your tenant
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Route policy-flagged prompts to approvers, apply redaction or rejection with rationale, and learn from
          decisions to reduce future escalations.
        </p>

        {/* Diagram */}
        <div className="mt-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/40 p-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
            {/* 1. User Prompt */}
            <Stage title="User Prompt" desc="Employee submits prompt" tone="blue" className="lg:col-span-1" />

            <Arrow className="hidden lg:flex" />

            {/* 2. Policy Engine */}
            <Stage
              title="Policy Engine"
              desc="PII / code / secrets detection, policy checks"
              tone="cyan"
              className="lg:col-span-1"
            />

            <Arrow className="hidden lg:flex" />

            {/* 3. Risk Triage */}
            <Stage
              title="Risk Triage"
              desc="Low risk → auto allow; Medium/High → escalation"
              tone="amber"
              className="lg:col-span-1"
            />

            <Arrow className="hidden lg:flex" />

            {/* 4. Human Review (with simulated actions) */}
            <HumanReviewStage className="lg:col-span-1" />

            <Arrow className="hidden lg:flex" />

            {/* 5. Safe Output */}
            <Stage
              title="Safe Output"
              desc="Sanitized prompt sent to model, logged for audit"
              tone="emerald"
              className="lg:col-span-1"
            />
          </div>

          {/* Mobile arrows */}
          <div className="lg:hidden mt-3 flex flex-col items-center gap-2">
            <SmallArrow />
            <SmallArrow />
            <SmallArrow />
            <SmallArrow />
          </div>

          {/* Legend */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <LegendItem color="bg-amber-500" label="Escalation path" />
            <LegendItem color="bg-emerald-500" label="Auto-allow (low risk)" />
            <LegendItem color="bg-cyan-500" label="Policy signals & redaction" />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Works with your approver groups and notification channels.
          </p>
          <a
            href="/admin"
            className="text-sm font-medium text-cyan-700 hover:text-cyan-900 dark:text-cyan-400 dark:hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 rounded-md px-1.5 py-0.5"
          >
            Try the approval flow →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Human Review with simulated states ---------- */

function HumanReviewStage({ className = '' }: { className?: string }) {
  type Action = 'none' | 'approved' | 'redacted' | 'rejected';
  const [action, setAction] = React.useState<Action>('none');
  const [note, setNote] = React.useState('');

  const is = (a: Action) => action === a;

  const badge = {
    none: null,
    approved: (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20 px-2 py-0.5 text-xs">
        <Dot className="text-emerald-500" /> Approved
      </span>
    ),
    redacted: (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/20 px-2 py-0.5 text-xs">
        <Dot className="text-amber-500" /> Redaction applied
      </span>
    ),
    rejected: (
      <span className="inline-flex items-center gap-1 rounded-md bg-rose-600/10 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/20 px-2 py-0.5 text-xs">
        <Dot className="text-rose-500" /> Rejected
      </span>
    ),
  }[action];

  return (
    <div className={`rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1 ring-violet-300/60 dark:ring-violet-400/20 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
            <circle cx="12" cy="12" r="6" fill="currentColor" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-gray-900 dark:text-white">Human Review</div>
            {badge}
          </div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Approver can allow, redact, or reject with rationale.
          </p>

          {/* Mini action footer */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ActionButton
              label="Approve"
              ariaLabel="Approve request"
              active={is('approved')}
              onClick={() => setAction(is('approved') ? 'none' : 'approved')}
              classes={{
                base: 'bg-emerald-600 hover:bg-emerald-700 text-white',
                inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15',
                ring: is('approved') ? 'ring-2 ring-emerald-500/40' : '',
              }}
            />
            <ActionButton
              label="Redact"
              ariaLabel="Apply redaction"
              active={is('redacted')}
              onClick={() => setAction(is('redacted') ? 'none' : 'redacted')}
              classes={{
                base: 'bg-amber-500 hover:bg-amber-600 text-white',
                inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15',
                ring: is('redacted') ? 'ring-2 ring-amber-500/40' : '',
              }}
            />
            <ActionButton
              label="Reject"
              ariaLabel="Reject request"
              active={is('rejected')}
              onClick={() => setAction(is('rejected') ? 'none' : 'rejected')}
              classes={{
                base: 'bg-rose-600 hover:bg-rose-700 text-white',
                inactive: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/15',
                ring: is('rejected') ? 'ring-2 ring-rose-500/40' : '',
              }}
            />
          </div>

          {/* Rationale textarea appears only when a decision is selected */}
          {action !== 'none' && (
            <div className="mt-3">
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Rationale (optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500/30"
                placeholder={
                  action === 'approved'
                    ? 'Why is this safe to proceed?'
                    : action === 'redacted'
                    ? 'What was removed and why?'
                    : 'Why is this risky?'
                }
              />
              {/* Simulated footer status */}
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Decision is staged for audit; no backend calls made in this demo.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Small building blocks ---------- */

function Stage({
  title,
  desc,
  tone,
  className = '',
  children,
}: {
  title: string;
  desc: string;
  tone: 'blue' | 'cyan' | 'amber' | 'violet' | 'emerald';
  className?: string;
  children?: React.ReactNode;
}) {
  const toneMap: Record<string, string> = {
    blue: 'ring-blue-300/60 dark:ring-blue-400/20 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300',
    cyan: 'ring-cyan-300/60 dark:ring-cyan-400/20 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
    amber:
      'ring-amber-300/60 dark:ring-amber-400/20 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300',
    violet:
      'ring-violet-300/60 dark:ring-violet-400/20 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300',
    emerald:
      'ring-emerald-300/60 dark:ring-emerald-400/20 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  };

  return (
    <div className={`rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <span className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg ring-1 ${toneMap[tone]}`}>
          {/* dot icon */}
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
            <circle cx="12" cy="12" r="6" fill="currentColor" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 dark:text-white">{title}</div>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{desc}</p>
          {children}
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

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
      <span className={`inline-block h-2.5 w-2.5 rounded ${color}`} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function Dot({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 8 8" className={`h-2 w-2 ${className}`} aria-hidden="true">
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  );
}

type ActionButtonProps = {
  label: string;
  ariaLabel: string;
  active: boolean;
  onClick: () => void;
  classes: { base: string; inactive: string; ring?: string };
};

function ActionButton({ label, ariaLabel, active, onClick, classes }: ActionButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${active ? `${classes.base} ${classes.ring ?? ''}` : classes.inactive}`}
    >
      {label}
    </button>
  );
}