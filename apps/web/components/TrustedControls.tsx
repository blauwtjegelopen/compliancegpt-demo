// components/TrustedControls.tsx
export default function TrustedControls() {
  return (
    <section
      aria-labelledby="trusted-controls-title"
      className="bg-white dark:bg-gray-950"
    >
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2
          id="trusted-controls-title"
          className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6"
        >
          Trusted Controls
        </h2>

        <div className="grid sm:grid-cols-3 gap-4">
          {/* GDPR / PII Guard */}
          <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4">
            <div className="font-semibold text-gray-900 dark:text-white">
              GDPR / PII Guard
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Emails, phone numbers, addresses, and names are redacted inline.
            </p>
          </div>

          {/* Source Code & Secrets */}
          <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4">
            <div className="font-semibold text-gray-900 dark:text-white">
              Source Code &amp; Secrets
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Detect code fragments, API keys, and repo references before they
              leave your tenant.
            </p>
          </div>

          {/* AI-Fueled Continuous Red Teaming */}
          <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-4">
            <div className="font-semibold text-gray-900 dark:text-white">
              AI-Fueled Continuous Red Teaming
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Live adversarial tests keep policies sharp; the AI learns and
              adjusts continuously from approvals and blocks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}