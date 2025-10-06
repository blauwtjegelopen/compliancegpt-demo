// apps/web/components/PolicyEngineWorkflow.tsx
"use client";

export default function PolicyEngineWorkflow() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="rounded-2xl border bg-white p-8 md:p-10 dark:border-white/10 dark:bg-transparent">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
            🔎 Policy Engine &amp; Approval Workflow
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-blue-600 dark:text-blue-400">
              “Approve what matters — automate the rest.”
            </span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
          The LayerZero <strong>Policy Engine</strong> enforces data-handling rules in real time. Prompts are scanned
          and redacted <em>before</em> they reach an external model. If sensitive data or a compliance violation is
          detected, the system can automatically redact it or route it for <strong>human approval</strong> —
          all without persisting the original text.
        </p>

        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
          Approvals, denials, and redaction events are logged as <strong>policy decisions</strong>, not as raw data.
          This means admins get full traceability of what happened, when, and why — without compromising privacy
          or breaking zero-retention guarantees.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          {[
            {
              emoji: "⚙️",
              title: "Real-time enforcement",
              text: "Every prompt is scanned in-flight — redacted or approved instantly.",
            },
            {
              emoji: "👩‍💼",
              title: "Human-in-the-loop",
              text: "Sensitive requests can be paused for manual approval before execution.",
            },
            {
              emoji: "📊",
              title: "Traceable decisions",
              text: "Auditable metadata proves compliance — no content retention required.",
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