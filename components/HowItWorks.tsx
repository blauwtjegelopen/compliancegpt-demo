// components/HowItWorks.tsx

type Tone = 'blue' | 'cyan' | 'violet' | 'emerald';

type Lane = {
  tone: Tone;
  title: string;
  desc: string;
  steps: { title: string; hint?: string }[];
};

const LANES: Lane[] = [
  {
    tone: 'blue',
    title: 'Ingress & Capture',
    desc:
      'Requests flow from your apps to LayerZero via drop-in proxy, SDK, or API gateway.',
    steps: [
      { title: 'Client apps', hint: 'Web • Mobile • Internal tools' },
      { title: 'Proxy / SDK / API', hint: 'Choose your integration path' },
      { title: 'Normalize', hint: 'Unify shape for policy checks' },
    ],
  },
  {
    tone: 'cyan',
    title: 'Pre-Inference Guardrails',
    desc:
      'Policy engine detects PII, code, secrets, and regulated content — redacts or blocks before any model call.',
    steps: [
      { title: 'Detect', hint: 'PII • Secrets • Source code' },
      { title: 'Act', hint: 'Redact or Block with rationale' },
      { title: 'Approve (optional)', hint: 'Human-in-the-loop' },
    ],
  },
  {
    tone: 'violet',
    title: 'Model Invocation',
    desc:
      'Safe prompt is sent to your chosen provider or local model — nothing leaves boundaries without policy.',
    steps: [
      { title: 'Route', hint: 'OpenAI • Anthropic • Vertex • Bedrock • Local' },
      { title: 'Constrain', hint: 'Provider-specific safety settings' },
      { title: 'Observe', hint: 'Latency • Errors • Tokens' },
    ],
  },
  {
    tone: 'emerald',
    title: 'Post-Processing & Audit',
    desc:
      'Responses are optionally filtered, logged with signatures, and exported to your SIEM or ticketing.',
    steps: [
      { title: 'Sanitize (optional)', hint: 'Strip sensitive echoes' },
      { title: 'Log + Sign', hint: 'Tamper-evident audit trail' },
      { title: 'Export', hint: 'CSV/JSON • SIEM • Webhooks' },
    ],
  },
];

export default function HowItWorks() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-transparent overflow-hidden">
      {/* header */}
      <div className="px-5 py-4 border-b border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/5">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
          End-to-end flow
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          From request capture to policy enforcement and audit export
        </div>
      </div>

      {/* lanes */}
      <div className="divide-y divide-gray-200 dark:divide-white/10">
        {LANES.map((lane, i) => (
          <div key={lane.title} className="p-5">
            <div className="flex items-start gap-4">
              <Badge tone={lane.tone}>{lane.title}</Badge>
              <p className="text-sm text-gray-600 dark:text-gray-300">{lane.desc}</p>
            </div>

            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {lane.steps.map((s) => (
                <div
                  key={s.title}
                  className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-3"
                >
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {s.title}
                  </div>
                  {s.hint && (
                    <div className="text-xs text-gray-600 dark:text-gray-400">{s.hint}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Badge({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) {
  const toneGrad: Record<Tone, string> = {
    blue: 'from-blue-500 to-cyan-400',
    cyan: 'from-cyan-400 to-sky-500',
    violet: 'from-violet-500 to-fuchsia-400',
    emerald: 'from-emerald-500 to-teal-400',
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-xl px-2.5 py-1 text-xs font-semibold
                  text-white bg-gradient-to-br ${toneGrad[tone]}`}
    >
      {children}
    </span>
  );
}