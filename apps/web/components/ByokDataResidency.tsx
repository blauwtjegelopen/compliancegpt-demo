// apps/web/components/ByokDataResidency.tsx
"use client";

export default function ByokDataResidency() {
  return (
    <section className="max-w-6xl mx-auto px-6 pb-16">
      <div className="rounded-2xl border bg-white p-8 md:p-10 dark:border-white/10 dark:bg-transparent">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
            🔐 BYOK &amp; Data Residency
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium text-blue-600 dark:text-blue-400">
              “Your keys. Your region. Your control.”
            </span>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
          LayerZero is built around <strong>Bring Your Own Key (BYOK)</strong> — meaning your organization’s own
          API credentials are used for all outbound calls. We never store, replicate, or rotate them on your
          behalf. Keys are verified in-memory, encrypted in transit, and remain <strong>fully owned by you</strong>.
        </p>

        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
          You can also choose where your data is processed. LayerZero supports <strong>regional data residency</strong>,
          ensuring prompts never leave your approved geography — for example, EU data stays within EU-based proxies
          and cloud regions.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          {[
            {
              emoji: "🔑",
              title: "Bring Your Own Key",
              text: "Use your organization’s API keys. We never store or rotate them.",
            },
            {
              emoji: "🌍",
              title: "Regional control",
              text: "Select EU, US, or APAC routing. Data never crosses your chosen border.",
            },
            {
              emoji: "🧾",
              title: "Audit-ready design",
              text: "Every call is signed and logged with policy metadata for compliance review.",
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