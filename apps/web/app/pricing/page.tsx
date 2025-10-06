// apps/web/app/pricing/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

type Tier = "starter" | "team" | "business" | "enterprise";

const TIERS: Record<
  Tier,
  {
    name: string;
    tagline: string;
    monthly: number | "free";
    features: string[];
    cta: { label: string; href: string };
    highlight?: boolean;
    limits?: string[];
  }
> = {
  starter: {
    name: "Starter",
    tagline: "Explore LayerZero in dev or POC",
    monthly: "free",
    features: [
      "Inline PII redaction",
      "Secret scanning",
      "Basic audit log (7 days)",
      "Single region",
      "Community support",
    ],
    limits: ["5k requests / mo", "1 integration"],
    cta: { label: "Start free", href: "/admin" },
  },
  team: {
    name: "Team",
    tagline: "Ship safely with small teams",
    monthly: 99,
    features: [
      "Everything in Starter",
      "Policy approvals",
      "PII + code detectors",
      "Multi-region routing (EU/US)",
      "Role-based access (RBAC)",
      "Export audit log (30 days)",
      "Email alerts",
    ],
    limits: ["100k requests / mo", "3 integrations"],
    cta: { label: "Start Team", href: "/integrations" },
    highlight: true,
  },
  business: {
    name: "Business",
    tagline: "Org-wide governance & scale",
    monthly: 399,
    features: [
      "Everything in Team",
      "Custom classifiers",
      "SAML SSO & SCIM",
      "Data residency controls",
      "Webhooks & SIEM export",
      "Priority support",
      "Audit log (365 days)",
    ],
    limits: ["1M requests / mo", "Unlimited integrations"],
    cta: { label: "Talk to Sales", href: "/contact" },
  },
  enterprise: {
    name: "Enterprise",
    tagline: "Advanced controls for regulated orgs",
    monthly: 0,
    features: [
      "Private cloud / on-prem",
      "KMS integration (BYOKMS)",
      "Custom SLAs",
      "DLP / CASB integrations",
      "Dedicated VPC + peering",
      "White-glove onboarding",
    ],
    limits: ["Custom volume", "Custom contracts"],
    cta: { label: "Contact us", href: "/contact" },
  },
};

// ---- Pricing helpers -------------------------------------------------------
function priceLabel(monthly: number | "free", yearly: boolean) {
  if (monthly === "free") return "Free";
  if (monthly === 0) return "Custom";
  // Yearly = 2 months free => pay 10× monthly once per year
  return yearly ? `$${monthly * 10}/year` : `$${monthly}/mo`;
}

function subLabel(monthly: number | "free", yearly: boolean) {
  if (monthly === "free") return "No credit card required";
  if (monthly === 0) return "Let’s tailor a plan";
  return yearly ? "Billed annually (2 months free)" : "Billed monthly";
}

export default function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <main>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-10 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Start fast. Scale when you do. LayerZero protects prompts and completions
            before they leave your environment.
          </p>
        </div>

        {/* Segmented toggle */}
        <div className="mt-8 inline-flex items-center justify-center">
          <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden dark:border-white/10">
            <button
              aria-pressed={!yearly}
              onClick={() => setYearly(false)}
              className={`px-4 py-2 text-sm focus:outline-none ${
                !yearly
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-white text-gray-700 dark:bg-transparent dark:text-gray-300"
              }`}
            >
              Monthly
            </button>
            <button
              aria-pressed={yearly}
              onClick={() => setYearly(true)}
              className={`px-4 py-2 text-sm border-l border-gray-300 focus:outline-none dark:border-white/10 ${
                yearly
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-white text-gray-700 dark:bg-transparent dark:text-gray-300"
              }`}
            >
              Yearly <span className="ml-1 text-[11px] opacity-80">(2 months free)</span>
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Yearly = pay for 10 months, get 12.
        </div>
      </section>

      {/* Tiers */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="grid md:grid-cols-4 gap-6">
          {Object.entries(TIERS).map(([key, t]) => {
            const isHighlight = t.highlight;
            const monthly = t.monthly;

            return (
              <div
                key={key}
                className={`rounded-2xl border bg-white p-6 shadow-sm dark:bg-transparent dark:border-white/10 ${
                  isHighlight ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">{t.name}</div>
                  {isHighlight && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                      Most popular
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t.tagline}</div>

                <div className="mt-6">
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {priceLabel(monthly, yearly)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{subLabel(monthly, yearly)}</div>
                  {typeof monthly === "number" && yearly && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      One annual payment of <span className="font-medium">${monthly * 10}</span> (normally ${monthly * 12})
                    </div>
                  )}
                </div>

                {t.limits && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.limits.map((lim) => (
                      <span
                        key={lim}
                        className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300"
                      >
                        {lim}
                      </span>
                    ))}
                  </div>
                )}

                <ul className="mt-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={t.cta.href}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm ${
                    key === "enterprise"
                      ? "border border-gray-300 text-gray-800 dark:text-gray-200 dark:border-white/10"
                      : "bg-black text-white dark:bg-white dark:text-black"
                  }`}
                >
                  {t.cta.label}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

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