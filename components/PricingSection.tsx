'use client';
import Link from 'next/link';

export default function PricingSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
        <p className="mt-2 text-gray-600">Start fast. Scale when you do.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Starter */}
        <div className="rounded-2xl border bg-white p-6 flex flex-col">
          <div className="text-sm font-medium text-gray-500">Starter</div>
          <div className="mt-2 text-4xl font-extrabold">$0</div>
          <div className="text-gray-500 text-sm">/ month</div>
          <ul className="mt-6 space-y-2 text-sm text-gray-700">
            <li>• Up to 10 users</li>
            <li>• Basic PII redaction</li>
            <li>• Audit log (7 days)</li>
          </ul>
          <Link href="/admin" className="mt-6 inline-flex justify-center rounded-xl px-4 py-2 bg-black text-white">
            Launch Demo
          </Link>
        </div>

        {/* Growth (Most popular) */}
        <div className="rounded-2xl border-2 border-black bg-white p-6 shadow-[0_6px_0_#111] flex flex-col relative">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded-full bg-black text-white">Most popular</span>
          <div className="text-sm font-medium text-gray-500">Growth</div>
          <div className="mt-2 text-4xl font-extrabold">$499</div>
          <div className="text-gray-500 text-sm">/ month</div>
          <ul className="mt-6 space-y-2 text-sm text-gray-700">
            <li>• Unlimited users</li>
            <li>• Source code & secrets detection</li>
            <li>• Approvals & policy templates</li>
            <li>• Audit export (90 days)</li>
            <li>• Email support</li>
          </ul>
          <Link href="/admin" className="mt-6 inline-flex justify-center rounded-xl px-4 py-2 bg-black text-white">
            Try Live Demo
          </Link>
        </div>

        {/* Enterprise */}
        <div className="rounded-2xl border bg-white p-6 flex flex-col">
          <div className="text-sm font-medium text-gray-500">Enterprise</div>
          <div className="mt-2 text-4xl font-extrabold">Custom</div>
          <div className="text-gray-500 text-sm">/ annual</div>
          <ul className="mt-6 space-y-2 text-sm text-gray-700">
            <li>• SSO/SAML, SCIM</li>
            <li>• Region routing & zero-retention</li>
            <li>• DLP/EDR integrations</li>
            <li>• SOC 2 package</li>
            <li>• Priority support & SLA</li>
          </ul>
          <button onClick={() => (window as any).openContactSales?.()} className="mt-6 inline-flex justify-center rounded-xl px-4 py-2 border">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  );
}
