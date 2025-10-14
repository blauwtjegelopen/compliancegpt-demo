'use client';

import Hero from '@/components/Hero';
import LogoStrip from '@/components/LogoStrip';
import TrustedControls from '@/components/TrustedControls';
import HumanInTheLoop from '@/components/HumanInTheLoop'; // ⬅️ new
import ComplianceAssurance from '@/components/ComplianceAssurance';
import VisionStrip from '@/components/VisionStrip'; // ⬅️ new
import BlackCTABanner from '@/components/BlackCTABanner';
import PricingGrid from '@/components/PricingGrid'; // ✅ replaces old PricingSection
import FAQSection from '@/components/FAQSection';
import ContactLargeFinal from '@/components/ContactLargeFinal';
// ⬇️ removed ContactModal import

export default function Home() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <TrustedControls />
      <HumanInTheLoop /> {/* ⬅️ new section with mini footer */}
      <ComplianceAssurance />
      <VisionStrip /> {/* ⬅️ new executive-level vision statement */}
      <BlackCTABanner />
      <PricingGrid showHeading /> {/* ✅ updated reference */}
      <FAQSection />

      {/* Anchor target */}
      <div id="contact" className="max-w-6xl mx-auto px-6 pb-16">
        <ContactLargeFinal />
      </div>
    </>
  );
}