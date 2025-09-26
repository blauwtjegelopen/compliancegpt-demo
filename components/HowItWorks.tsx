// components/HowItWorks.tsx
'use client';

import React from 'react';

type Tone = 'blue' | 'cyan' | 'violet' | 'emerald';

function Badge({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) {
  const map: Record<Tone, string> = {
    blue: 'from-blue-500 to-cyan-400',
    cyan: 'from-cyan-400 to-blue-500',
    violet: 'from-violet-500 to-fuchsia-400',
    emerald: 'from-emerald-500 to-teal-400',
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs font-semibold text-white bg-gradient-to-br ${map[tone]}`}
    >
      {children}
    </span>
  );
}

export default function HowItWorks({
  variant = 'flow',
}: {
  variant?: 'flow' | 'swimlanes';
}) {
  if (variant === 'swimlanes') {
    const lanes: Array<{
      title: string;
      desc: string;
      tone: Tone;
      steps: string[];
    }> = [
      {
        title: 'Apps & Users',
        desc: 'Prompts & data from your SaaS and internal tools.',
        tone: 'blue',
        steps: ['Chat app', 'Docs & Wiki', 'CRM / Tickets'],
      },
      {
        title: 'LayerZero (Policy)',
        desc: 'Detect, redact, or block before any model call.',
        tone: 'cyan',
        steps: ['PII/Secrets detection', 'Redaction / Block', 'Approval Escalation'],
      },
      {
        title: 'Model Providers',
        desc: 'Your chosen LLMs (cloud or on-prem).',
        tone: 'violet',
        steps: ['OpenAI / Azure', 'Anthropic', 'Vertex / Bedrock'],
      },
      {
        title: 'Audit & Export',
        desc: 'Evidence on demand for compliance.',
        tone: 'emerald',
        steps: ['Signed logs', 'CSV/JSON export', 'SIEM/Ticketing'],
      },
    ];

    return (
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-transparent overflow-hidden">
        {lanes.map((lane, i) => (
          <div key={lane.title} className={`bg-white dark:bg-gray-900 p-5 ${i > 0 ? 'border-t border-gray-200 dark:border-white/10' : ''}`}>
            <div className="flex items-start gap-4">
              <Badge tone={lane.tone}>{lane.title}</Badge>
              <p className="text-sm text-gray-600 dark:text-gray-300">{lane.desc}</p>
            </div>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {lane.steps.map((s) => (
                <div
                  key={s}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default "flow" variant
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent p-6">
      <div className="grid md:grid-cols-3 gap-6 items-center">
        {/* Sources */}
        <div className="space-y-3">
          <Badge tone="blue">Apps & Users</Badge>
          {['Chat app', 'Docs & Wiki', 'CRM / Tickets'].map((s) => (
            <div
              key={s}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
            >
              {s}
            </div>
          ))}
        </div>

        {/* LayerZero */}
        <div className="relative">
          <div className="absolute inset-y-0 -left-4 -right-4 hidden md:block">
            <svg viewBox="0 0 100 6" preserveAspectRatio="none" className="w-full h-6">
              <path d="M0 3 H100" stroke="currentColor" className="text-gray-300 dark:text-white/15" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/60 backdrop-blur p-5 ring-1 ring-inset ring-cyan-300/40 dark:ring-cyan-400/20">
            <div className="flex items-center gap-2">
              <Badge tone="cyan">LayerZero Policy</Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400">pre-inference</span>
            </div>
            <div className="mt-3 grid sm:grid-cols-3 gap-3">
              {['PII/Secrets detection', 'Redaction / Block', 'Approval Escalation'].map((s) => (
                <div
                  key={s}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Providers */}
        <div className="space-y-3">
          <Badge tone="violet">Model Providers</Badge>
          {['OpenAI / Azure', 'Anthropic', 'Vertex / Bedrock'].map((s) => (
            <div
              key={s}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* Audit */}
      <div className="mt-6">
        <Badge tone="emerald">Audit & Export</Badge>
        <div className="mt-3 grid sm:grid-cols-3 gap-3">
          {['Signed logs', 'CSV/JSON export', 'SIEM/Ticketing'].map((s) => (
            <div
              key={s}
              className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}