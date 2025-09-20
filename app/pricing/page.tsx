'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';

export default function PricingPage(){
  return (
    <div>
      <Navbar />
      <section className="max-w-6xl mx-auto px-6 pt-14">
        <h1 className="text-3xl font-bold">Pricing</h1>
        <p className="text-gray-600 mt-2">Choose the plan that fits. Upgrade anytime.</p>
      </section>
      <PricingSection />
      <Footer />
    </div>
  );
}
