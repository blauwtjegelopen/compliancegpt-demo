// components/TrustFAQ.tsx
export default function TrustFAQ() {
  const faqs = [
    {
      q: "Do you store prompts or model outputs?",
      a: "By default we operate in a zero-retention posture for prompts and outputs. You can optionally enable short-lived retention for audit purposes, scoped by policy and region.",
    },
    {
      q: "Where is data processed and stored?",
      a: "We support region routing (EU/US/UK) and keep processing and any optional retention in-region. Backups follow the same residency constraints.",
    },
    {
      q: "How do you handle PII and secrets?",
      a: "Inline detectors redact PII (emails, names, phone numbers, addresses) and secrets (API keys, tokens) before they leave your tenant, with policy-based allow/deny rules.",
    },
    {
      q: "Are you SOC 2 / GDPR compliant?",
      a: "We align to SOC 2 controls and GDPR requirements. DPA and SCCs are available on request. Refer to the Compliance section on this page for current attestations.",
    },
    {
      q: "Do you support SSO and provisioning?",
      a: "Yes. SAML SSO and SCIM are available on Growth and Enterprise plans. Role-based access control governs approvals and audit visibility.",
    },
    {
      q: "Can approvers release blocked prompts?",
      a: "Yes—sensitive events can be escalated to approvers via Human-in-the-Loop. Approved content is logged with full audit trail.",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-200 text-center">
        Trust &amp; Security FAQ
      </h2>
      <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 text-center max-w-2xl mx-auto">
        Answers to common questions about our security, privacy, and compliance posture.
      </p>

      <div className="mt-8 space-y-3">
        {faqs.map(({ q, a }, idx) => (
          <details
            key={idx}
            className="group rounded-xl border bg-white dark:bg-transparent border-gray-200 dark:border-white/10 p-4"
          >
            <summary className="flex cursor-pointer items-center justify-between text-left list-none">
              <span className="font-medium text-gray-900 dark:text-gray-200">{q}</span>
              <span
                className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full border text-sm transition-transform
                           border-gray-300 text-gray-600 dark:border-white/20 dark:text-gray-400
                           group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}