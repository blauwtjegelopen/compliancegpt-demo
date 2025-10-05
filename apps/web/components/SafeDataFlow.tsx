// components/SafeDataFlow.tsx
'use client';

import { Server, Scissors, Gavel, Radar } from 'lucide-react';

export default function SafeDataFlow() {
  return (
    <section className="bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="inline-flex items-center gap-2 mb-3">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          <span className="text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Data Flow
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          How <span className="text-blue-600">LayerZero</span> keeps your data safe
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
          Every prompt passes through strict safeguards—protecting sensitive information and keeping AI use
          compliant, explainable, and under your control.
        </p>

        {/* Flow cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <FlowCard
            icon={<Server className="h-5 w-5" />}
            title="Data stays in your environment"
            text="Your information never leaves your tenant. Processing happens where your security team already has visibility and control."
            tone="blue"
          />
          <FlowCard
            icon={<Scissors className="h-5 w-5" />}
            title="Sensitive info is removed"
            text="PII, source code, and regulated content are automatically detected and redacted before reaching the model."
            tone="cyan"
          />
          <FlowCard
            icon={<Gavel className="h-5 w-5" />}
            title="Policies enforce decisions"
            text="Custom rules block or allow actions with full audit trails, so every exception is explainable and accountable."
            tone="violet"
          />
          <FlowCard
            icon={<Radar className="h-5 w-5" />}
            title="Continuous assurance"
            text="AI-powered red teaming stress-tests safeguards in the background and adapts controls as new risks emerge."
            tone="emerald"
          />
        </div>
      </div>
    </section>
  );
}

function FlowCard({
  icon,
  title,
  text,
  tone = 'blue',
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  tone?: 'blue' | 'cyan' | 'violet' | 'emerald';
}) {
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

  return (
    <div
      className={`group relative rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-gray-900/60
                  ring-1 ring-inset ${toneRing[tone]} backdrop-blur p-5 transition
                  hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20`}
      style={{ transitionDuration: '240ms' }}
    >
      {/* soft gradient header accent */}
      <div
        aria-hidden="true"
        className={`absolute inset-x-0 -top-px h-10 rounded-t-2xl opacity-70 blur-sm pointer-events-none
                    bg-gradient-to-r ${toneBadge[tone]}`}
      />
      <div className="relative flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl
                      text-white bg-gradient-to-br ${toneBadge[tone]}`}
        >
          {icon}
        </span>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{text}</p>
        </div>
      </div>
      {/* underline on hover */}
      <div
        aria-hidden="true"
        className={`absolute bottom-0 left-5 right-5 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition
                    bg-gradient-to-r ${toneBadge[tone]}`}
      />
    </div>
  );
}