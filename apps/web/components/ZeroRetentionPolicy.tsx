// apps/web/components/ZeroRetentionPolicy.tsx
"use client";

export default function ZeroRetentionPolicy() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="rounded-2xl border bg-white p-8 md:p-10 dark:border-white/10 dark:bg-transparent">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
            🧩 Zero Retention, Full Accountability
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-blue-600 dark:text-blue-400">
              “We show what happened, not what was said.”
            </span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
          LayerZero operates under a <strong>zero data retention policy</strong> — we never store your prompts,
          completions, or model responses. All processing happens <strong>in-memory</strong> and is discarded
          immediately after redaction or policy evaluation.
        </p>

        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
          What remains is a <strong>redacted audit trail</strong> that records actions, not content — allowing you
          to trace policy decisions and governance workflows without ever exposing sensitive data.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          {[
            {
              emoji: "✅",
              title: "No prompt retention",
              text: "Nothing recoverable, nothing stored — full ephemeral processing.",
            },
            {
              emoji: "🧠",
              title: "Redacted audit metadata",
              text: "Structured logs that prove compliance without revealing content.",
            },
            {
              emoji: "🛡️",
              title: "Provable privacy",
              text: "Trust, traceability, and compliance — with zero exposure risk.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border bg-gray-50 p-4 text-gray-700 dark:bg-gray-800 dark:border-white/10 dark:text-gray-300"
            >
              <div className="font-medium mb-1">
                {item.emoji} {item.title}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{item.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}