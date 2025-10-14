// apps/web/app/pricing/page.tsx
"use client";

import Link from "next/link";
import PricingGrid from "@/components/PricingGrid";

export default function PricingPage() {
  return (
    <main>
      {/* Pricing grid with built-in heading + toggle */}
      <PricingGrid defaultYearly={true} showHeading={true} />

      {/* Comparison */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4 text-center">Compare plans</h2>
        <div className="rounded-2xl border bg-white overflow-x-auto dark:bg-transparent dark:border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-white/5">
              <tr className="text-left text-gray-700 dark:text-gray-300">
                <th className="p-4">Feature</th>
                <th className="p-4">Starter</th>
                <th className="p-4">Team</th>
                <th className="p-4">Business</th>
                <th className="p-4">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {[
                ["Inline PII redaction", "•", "•", "•", "•"],
                ["Secret scanning", "•", "•", "•", "•"],
                ["Policy approvals", "—", "•", "•", "•"],
                ["Custom classifiers", "—", "—", "•", "•"],
                ["Multi-region routing", "—", "EU/US", "EU/US", "Global"],
                ["Audit log retention", "7 days", "30 days", "365 days", "Custom"],
                ["SSO / SCIM", "—", "—", "•", "•"],
                ["Private cloud / On-prem", "—", "—", "—", "•"],
              ].map((row) => (
                <tr key={row[0]} className="text-gray-800 dark:text-gray-300">
                  {row.map((cell, idx) => (
                    <td key={idx} className="p-4">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add-ons */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4 text-center">Add-ons</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Extra audit retention",
              body: "Extend retention to 3+ years for compliance (SOC 2, ISO 27001, GDPR).",
            },
            {
              title: "Dedicated region",
              body: "Pin data to a specific region (e.g., EU-only) for residency requirements.",
            },
            {
              title: "Premium support",
              body: "24×7 support, DRI escalation, and response SLAs.",
            },
          ].map((a) => (
            <div key={a.title} className="rounded-2xl border bg-white p-6 dark:bg-transparent dark:border-white/10">
              <div className="font-semibold text-gray-900 dark:text-gray-200">{a.title}</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{a.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4 text-center">Pricing FAQs</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: "How does yearly billing work?",
              a: "Choose Yearly to get 2 months free. You’ll pay 10× the monthly price upfront and receive 12 months of service.",
            },
            {
              q: "What counts as a request?",
              a: "Each proxied call to an LLM (prompt → completion) counts as one request. Batch or streaming still counts as one.",
            },
            {
              q: "Can we Bring Our Own Keys (BYOK)?",
              a: "Yes. You connect your organization’s OpenAI, Azure OpenAI, or Anthropic keys. Keys remain under your control.",
            },
            {
              q: "Do you offer on-prem or private cloud?",
              a: "Enterprise supports private cloud and on-prem deployments with custom SLAs and networking (VPC peering).",
            },
          ].map((f) => (
            <div key={f.q} className="rounded-2xl border bg-white p-6 dark:bg-transparent dark:border-white/10">
              <div className="font-medium text-gray-900 dark:text-gray-200">{f.q}</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-2xl bg-black text-gray-200 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 dark:bg-gray-800">
          <div>
            <div className="text-xl font-semibold">Add a layer of trust to your AI</div>
            <div className="text-sm text-gray-300">
              Start with the free plan, upgrade when you’re ready.
            </div>
          </div>
          <div className="flex gap-3">
            <Link className="px-4 py-2 rounded-md bg-white text-black hover:bg-gray-100" href="/admin">
              Launch Demo
            </Link>
            <Link className="px-4 py-2 rounded-md border border-white/70 text-gray-200 hover:bg-white/5" href="/contact">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}