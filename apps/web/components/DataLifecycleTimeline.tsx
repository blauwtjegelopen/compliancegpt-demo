// apps/web/components/DataLifecycleTimeline.tsx
"use client";

type Step = {
  key: string;
  title: string;
  subtitle?: string;
  accent?: "blue" | "emerald" | "amber" | "rose" | "slate";
  icon?: string; // simple emoji for now to avoid extra deps
};

const STEPS: Step[] = [
  { key: "prompt", title: "Prompt", subtitle: "User or App", icon: "🧑‍💻", accent: "slate" },
  {
    key: "layerzero",
    title: "LayerZero",
    subtitle: "Redact · Approve · Audit",
    icon: "🧠",
    accent: "blue",
  },
  { key: "provider", title: "Model Provider", subtitle: "OpenAI · Anthropic · Azure", icon: "🌐", accent: "emerald" },
  { key: "response", title: "Response", subtitle: "Back to User/App", icon: "📬", accent: "slate" },
  { key: "forget", title: "Forget", subtitle: "Zero retention enforced", icon: "🧹", accent: "rose" },
];

const accentClasses: Record<NonNullable<Step["accent"]>, string> = {
  blue: "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  emerald: "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
  amber: "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  rose: "border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300",
  slate: "border-gray-300 bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-white/10",
};

export default function DataLifecycleTimeline() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-10">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 text-center mb-6">
        Data Lifecycle with LayerZero
      </h2>

      {/* Timeline rail */}
      <div className="relative">
        {/* line */}
        <div className="hidden md:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gray-200 dark:bg-white/10" />

        <div className="grid gap-4 md:grid-cols-5">
          {STEPS.map((step, i) => (
            <div key={step.key} className="relative flex flex-col items-center">
              {/* dot on the line (desktop) */}
              <div className="hidden md:block absolute top-1/2 -translate-y-1/2">
                <div className="h-3 w-3 rounded-full bg-gray-300 border border-white dark:bg-white/10 dark:border-gray-900" />
              </div>

              {/* card */}
              <div
                className={`w-full rounded-xl border p-4 text-center shadow-sm ${accentClasses[step.accent || "slate"]}`}
              >
                <div className="text-xl leading-none">{step.icon ?? "•"}</div>
                <div className="mt-2 font-semibold">{step.title}</div>
                {step.subtitle && (
                  <div className="text-xs opacity-80 mt-1">{step.subtitle}</div>
                )}
                {/* Little explainer chips for the key moments */}
                {step.key === "layerzero" && (
                  <div className="mt-3 flex flex-wrap justify-center gap-2 text-[11px]">
                    <span className="px-2 py-1 rounded-full border border-blue-300/60 dark:border-blue-700/40">
                      Inline redaction
                    </span>
                    <span className="px-2 py-1 rounded-full border border-blue-300/60 dark:border-blue-700/40">
                      Approval workflow
                    </span>
                    <span className="px-2 py-1 rounded-full border border-blue-300/60 dark:border-blue-700/40">
                      Event metadata only
                    </span>
                  </div>
                )}
                {step.key === "forget" && (
                  <div className="mt-3 text-[11px] opacity-80">
                    Raw prompts/outputs not persisted
                  </div>
                )}
              </div>

              {/* arrow */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block text-gray-400 absolute right-[-12px] top-1/2 -translate-y-1/2">
                  ➡️
                </div>
              )}
            </div>
          ))}
        </div>

        {/* mobile arrows between stacked cards */}
        <div className="md:hidden flex flex-col items-center mt-2 gap-2 text-gray-400">
          <span>⬇️</span>
          <span>⬇️</span>
          <span>⬇️</span>
          <span>⬇️</span>
        </div>
      </div>

      {/* footnote */}
      <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
        BYOK enforced: your organization’s API keys call the model. LayerZero inspects and redacts in flight,
        stores <em>metadata only</em>, and honors zero-retention for content.
      </p>
    </section>
  );
}