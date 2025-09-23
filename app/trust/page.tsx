import LogoStrip from "@/components/LogoStrip";
import TrustedControls from "@/components/TrustedControls";
import TrustFAQ from "@/components/TrustFAQ";
import ContactLargeFinal from "@/components/ContactLargeFinal";

export default function TrustPage() {
  return (
    <main>
      {/* Intro */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200">
          Security &amp; Trust
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          At LayerZero, protecting your data and ensuring compliance is at the heart of everything we do.
        </p>
      </section>

      <LogoStrip />
      <TrustedControls />

      {/* Compliance */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-200 mb-10">
          Compliance &amp; Certifications
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-white/10 dark:bg-transparent">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200">SOC 2 Type II</h3>
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
      </section>

      <TrustFAQ />

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-2xl bg-black dark:bg-gray-800 text-gray-200 p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold">Learn more about our security &amp; trust practices</h3>
            <p className="mt-2 text-gray-400">
              Explore our security docs or talk with our security team.
            </p>
          </div>
          <div className="flex gap-4">
            <a href="/trust" className="px-5 py-2 rounded-md bg-white text-black font-medium hover:bg-gray-100">
              Security Docs
            </a>
            <a href="#contact" className="px-5 py-2 rounded-md border border-gray-300 text-gray-200 font-medium hover:bg-gray-700">
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* Anchor target */}
      <div id="contact" className="max-w-6xl mx-auto px-6 pb-16">
        <ContactLargeFinal />
      </div>
    </main>
  );
}