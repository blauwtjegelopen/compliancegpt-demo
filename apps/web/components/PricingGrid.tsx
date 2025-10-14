// apps/web/components/PricingGrid.tsx
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

function priceLabel(monthly: number | "free", yearly: boolean) {
  if (monthly === "free") return "Free";
  if (monthly === 0) return "Custom";
  return yearly ? `$${monthly * 10}/year` : `$${monthly}/mo`;
}
function subLabel(monthly: number | "free", yearly: boolean) {
  if (monthly === "free") return "No credit card required";
  if (monthly === 0) return "Let’s tailor a plan";
  return yearly ? "Billed annually (2 months free)" : "Billed monthly";
}

export default function PricingGrid({
  defaultYearly = true,
  showHeading = true,
}: {
  defaultYearly?: boolean;
  showHeading?: boolean;
}) {
  const [yearly, setYearly] = useState(defaultYearly);

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 text-gray-900 dark:text-gray-100">
      {showHeading && (
        <div className="text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
              Start fast. Scale when you do. LayerZero protects prompts and completions
              before they leave your environment.
            </p>
          </div>

          {/* Toggle */}
          <div className="mt-6 inline-flex items-center justify-center">
            <div className="inline-flex rounded-lg border overflow-hidden border-gray-300 dark:border-white/10 bg-white dark:bg-white/5">
              <button
                aria-pressed={!yearly}
                onClick={() => setYearly(false)}
                className={`px-4 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                  !yearly
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-transparent text-gray-700 dark:text-gray-300"
                }`}
              >
                Monthly
              </button>
              <button
                aria-pressed={yearly}
                onClick={() => setYearly(true)}
                className={`px-4 py-2 text-sm border-l border-gray-300 dark:border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
                  yearly
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-transparent text-gray-700 dark:text-gray-300"
                }`}
              >
                Yearly <span className="ml-1 text-[11px] opacity-80">(2 months free)</span>
              </button>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Yearly = pay for 10 months, get 12.
          </div>
        </div>
      )}

      {/* Tiers */}
      <div className="mt-10 grid md:grid-cols-4 gap-6">
        {Object.entries(TIERS).map(([key, t]) => {
          const isHighlight = t.highlight;
          const monthly = t.monthly;

          return (
            <div
              key={key}
              className={[
                "rounded-2xl p-6 shadow-sm border transition-colors",
                "bg-white border-gray-200",
                "dark:bg-white/[0.04] dark:border-white/10",
                isHighlight ? "ring-2 ring-blue-500 dark:ring-blue-400" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{t.name}</div>
                {isHighlight && (
                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                    Most popular
                  </span>
                )}
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">{t.tagline}</div>

              <div className="mt-6">
                <div className="text-3xl font-bold">{priceLabel(monthly, yearly)}</div>
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

              <ul className="mt-5 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1 select-none text-gray-500 dark:text-gray-500">•</span>
                    <span className="text-gray-800 dark:text-gray-200">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={t.cta.href}
                className={[
                  "mt-6 inline-flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors",
                  key === "enterprise"
                    ? "border border-gray-300 text-gray-800 hover:bg-gray-50 " +
                      "dark:border-white/15 dark:text-gray-100 dark:hover:bg-white/[0.06]"
                    : "bg-black text-white hover:bg-black/90 " +
                      "dark:bg-white dark:text-black dark:hover:bg-white/90",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
                ].join(" ")}
              >
                {t.cta.label}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}