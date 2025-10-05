'use client';

import { useState, useMemo } from 'react';
import clsx from 'clsx';

export default function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  // Base monthly prices
  const base = { starter: 50, growth: 500 };

  // Yearly: pay 10 months (2 free) -> effective monthly = price * 10 / 12
  const computed = useMemo(() => {
    if (billing === 'monthly') {
      return {
        starterMonthly: base.starter,
        growthMonthly: base.growth,
        starterSubline: '/mo',
        growthSubline: '/mo',
        // For consistency with Enterprise card:
        starterCaption: 'Billed monthly',
        growthCaption: 'Billed monthly',
      };
    }
    const starterEff = +(base.starter * (10 / 12)).toFixed(2); // €41.67
    const growthEff = +(base.growth * (10 / 12)).toFixed(2);   // €416.67
    return {
      starterMonthly: starterEff,
      growthMonthly: growthEff,
      starterSubline: '/mo • billed yearly',
      growthSubline: '/mo • billed yearly',
      starterCaption: '€' + base.starter * 10 + ' /year (2 months free)',
      growthCaption: '€' + base.growth * 10 + ' /year (2 months free)',
    };
  }, [billing]);

  const toggleBtn = (active: boolean) =>
    clsx(
      'px-4 py-2 rounded-lg text-sm transition',
      active
        ? 'bg-black text-white'
        : 'text-gray-700 hover:bg-gray-50'
    );

  const saveBadge =
    billing === 'yearly' ? (
      <span className="ml-2 inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
        save 2 months
      </span>
    ) : null;

  return (
    <section className="max-w-6xl mx-auto px-6 py-16" id="pricing">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
        <p className="mt-2 text-gray-600">Start fast. Scale when you do.</p>

        {/* Billing toggle */}
        <div className="mt-5 inline-flex items-center rounded-xl border bg-white p-1">
          <button
            type="button"
            aria-pressed={billing === 'monthly'}
            className={toggleBtn(billing === 'monthly')}
            onClick={() => setBilling('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            aria-pressed={billing === 'yearly'}
            className={toggleBtn(billing === 'yearly')}
            onClick={() => setBilling('yearly')}
          >
            Yearly {saveBadge}
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        {/* Starter */}
        <div className="relative rounded-2xl border bg-white p-6 flex flex-col">
          <div className="mb-4">
            <div className="text-sm text-gray-500">Up to 5 users</div>
            <h3 className="text-xl font-semibold">Starter</h3>
          </div>
          <div className="mb-2">
            <div className="flex items-end gap-2">
              <div className="text-3xl font-extrabold">
                €{computed.starterMonthly}
              </div>
              <div className="text-gray-500">{computed.starterSubline}</div>
            </div>
            <div className="text-xs text-gray-500">
              {billing === 'yearly' ? computed.starterCaption : 'Billed monthly'}
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-700 mb-6 mt-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
              <span>PII/code/secrets redaction</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
              <span>Policy guardrails</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
              <span>Basic audit exports</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
              <span>Email support</span>
            </li>
          </ul>
          <div className="mt-auto">
            <a className="block text-center w-full rounded-xl px-4 py-2 border hover:bg-gray-50" href="/admin">
              Start Free Trial
            </a>
          </div>
        </div>

        {/* Growth (Most Popular) */}
        <div className="relative rounded-2xl border bg-white p-6 flex flex-col ring-2 ring-black">
          <span className="absolute -top-3 left-6 rounded-full bg-black text-white text-xs px-2 py-1">
            Most Popular
          </span>
          <div className="mb-4">
            <div className="text-sm text-gray-500">Up to 50 users</div>
            <h3 className="text-xl font-semibold">Growth</h3>
          </div>
          <div className="mb-2">
            <div className="flex items-end gap-2">
              <div className="text-3xl font-extrabold">
                €{computed.growthMonthly}
              </div>
              <div className="text-gray-500">{computed.growthSubline}</div>
            </div>
            <div className="text-xs text-gray-500">
              {billing === 'yearly' ? computed.growthCaption : 'Billed monthly'}
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-700 mb-6 mt-2">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
              <span>Everything in Starter</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
              <span>Human-in-the-loop approvals</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
              <span>SAML SSO &amp; SCIM</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
              <span>SIEM export (CSV/JSON/API)</span>
            </li>
          </ul>
          <div className="mt-auto">
            <a className="block text-center w-full rounded-xl px-4 py-2 bg-black text-white hover:opacity-90" href="/admin">
              Choose Growth
            </a>
          </div>
        </div>

        {/* Enterprise */}
        <div className="relative rounded-2xl border bg-white p-6 flex flex-col">
          <div className="mb-4">
            <div className="text-sm text-gray-500">Unlimited</div>
            <h3 className="text-xl font-semibold">Enterprise</h3>
          </div>
          <div className="mb-4">
            <div className="flex items-end gap-2">
              <div className="text-3xl font-extrabold">Custom</div>
              <div className="text-gray-500">Tailored for your org</div>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-gray-700 mb-6">
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
              <span>Custom policies &amp; workflows</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
              <span>Dedicated region routing</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
              <span>Onboarding &amp; training</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-black" />
              <span>Priority support &amp; SLA</span>
            </li>
          </ul>
          <div className="mt-auto">
            <button className="w-full rounded-xl border px-4 py-2 hover:bg-gray-50">Contact Us</button>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-gray-500">
        Prices in EUR. You can switch plans anytime. Taxes may apply.
      </p>
    </section>
  );
}