import PricingSection from '@/components/PricingSection';
import ContactLargeFinal from '@/components/ContactLargeFinal';

export default function PricingPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Simple, transparent pricing
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">
          Start fast. Scale when you do.
        </p>
      </section>

      {/* Pricing cards */}
      <PricingSection />

      {/* FAQ nudge */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="rounded-2xl bg-white dark:bg-transparent border dark:border-white/10 p-6">
          <div className="font-semibold text-gray-900 dark:text-gray-200">
            Questions about plans?
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            We’ll help you choose the right option for your team size, risk profile, and compliance needs.
          </p>
          <div className="mt-4">
            <a className="inline-block px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black" href="/#faq">
              Read FAQs
            </a>
          </div>
        </div>
      </section>

      {/* Contact anchor target */}
      <div id="contact" className="max-w-6xl mx-auto px-6 pb-16">
        <ContactLargeFinal />
      </div>
    </>
  );
}