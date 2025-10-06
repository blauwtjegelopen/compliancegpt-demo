// app/trust/page.tsx
import LogoStrip from "@/components/LogoStrip";
import TrustedControls from "@/components/TrustedControls";
import SafeDataFlow from "@/components/SafeDataFlow";
import TrustFAQ from "@/components/TrustFAQ";
import ContactLargeFinal from "@/components/ContactLargeFinal";
import TrustPillars from "@/components/TrustPillars";

// Newly added trust components
import DataLifecycleTimeline from "@/components/DataLifecycleTimeline";
import ZeroRetentionPolicy from "@/components/ZeroRetentionPolicy";
import ByokDataResidency from "@/components/ByokDataResidency";
import PolicyEngineWorkflow from "@/components/PolicyEngineWorkflow";

export default function TrustPage() {
  return (
    <main className="bg-white dark:bg-gray-950">
      {/* Hero */}
      <section
        aria-labelledby="trust-hero"
        className="relative border-b border-gray-200 dark:border-white/10 overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60 dark:opacity-40"
          style={{
            background:
              "radial-gradient(600px 300px at 80% -20%, rgba(6,182,212,.15), transparent 60%), radial-gradient(420px 260px at 10% 10%, rgba(59,130,246,.12), transparent 60%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16 text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-500" />
            <span className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-300 font-medium">
              SOC 2 / ISO-ready • GDPR / HIPAA support
            </span>
          </div>
          <h1
            id="trust-hero"
            className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white"
          >
            Security &amp; Trust at <span className="text-blue-600">LayerZero</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            We safeguard your data with policy, redaction, approvals, and audit—across every integration.
          </p>

          {/* Security Package CTA (top) */}
          <div className="mt-6 flex items-center justify-center">
            <a
              href="/security/LayerZero-Security-Package.pdf"
              download
              className="inline-flex items-center gap-2 rounded-xl bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Download Security Package (PDF)
            </a>
          </div>
        </div>
      </section>

      <LogoStrip />
      <TrustedControls />
      <SafeDataFlow />

      {/* 🔐 Trust Story: Data Lifecycle + Trust Pillars */}
      <DataLifecycleTimeline />
      <ZeroRetentionPolicy />
      <ByokDataResidency />
      <PolicyEngineWorkflow />

      {/* Trust pillars (existing architecture visualization) */}
      <TrustPillars />

      {/* Compliance cards */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-200 mb-10">
          Compliance &amp; Certifications
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-transparent">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">
              SOC 2 Type II
            </h3>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Independent audit of security, availability, and confidentiality controls.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-transparent">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">GDPR</h3>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Data protection by design and default, with EU data residency options.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-transparent">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">HIPAA</h3>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Safeguards for handling PHI; BAAs available for eligible plans.
            </p>
          </div>
        </div>

        {/* Secondary Security Package CTA card */}
        <div className="mt-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              Need details for procurement or security review?
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Download our Security Package with policies, architecture, and audit scope.
            </div>
          </div>
          <a
            href="/security/LayerZero-Security-Package.pdf"
            download
            className="inline-flex items-center gap-2 rounded-xl bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm font-medium hover:opacity-90"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M12 3v12m0 0 4-4m-4 4-4-4M4 21h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Download Security Package
          </a>
        </div>
      </section>

      <TrustFAQ />

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-2xl bg-black dark:bg-gray-800 text-gray-200 p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold">
              Learn more about our security &amp; trust practices
            </h3>
            <p className="mt-2 text-gray-400">
              Explore our security docs or talk with our security team.
            </p>
          </div>
        </div>
      </section>

      {/* Contact anchor target */}
      <div id="contact" className="max-w-6xl mx-auto px-6 pb-16">
        <ContactLargeFinal />
      </div>
    </main>
  );
}