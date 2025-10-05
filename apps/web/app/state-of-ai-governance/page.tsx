// app/state-of-ai-governance/page.tsx
import type { Metadata } from 'next';
import GovernanceClient from '@/components/GovernanceClient';
import ResearchHero from '@/components/ResearchHero';
import { Telemetry } from '@/types/telemetry';
import { headers } from 'next/headers';

export const revalidate = 0;

// --- SEO / Share cards ---
export const metadata: Metadata = {
  title: 'State of AI Governance — LayerZero Research',
  description:
    'Quarterly benchmarks for redactions, blocks, approvals & escalations across industries. See how enterprises adopt AI faster while staying compliant.',
  alternates: {
    canonical: '/state-of-ai-governance',
  },
  openGraph: {
    title: 'State of AI Governance — LayerZero Research',
    description:
      'Redactions, blocks, approvals & escalations across industries — anonymized LayerZero telemetry.',
    url: '/state-of-ai-governance',
    siteName: 'LayerZero',
    images: [
      // Served by app/state-of-ai-governance/opengraph-image.tsx
      {
        url: '/state-of-ai-governance/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'State of AI Governance — LayerZero Research',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'State of AI Governance — LayerZero Research',
    description:
      'Quarterly benchmarks for redactions, blocks, approvals & escalations across industries.',
    images: ['/state-of-ai-governance/opengraph-image'],
    creator: '@', // optional
  },
};

async function getTelemetry(): Promise<Telemetry[]> {
  try {
    const h = headers();
    const proto = h.get('x-forwarded-proto') ?? 'http';
    const host = h.get('x-forwarded-host') ?? h.get('host') ?? `localhost:${process.env.PORT || 3000}`;
    const base = `${proto}://${host}`;

    const res = await fetch(`${base}/api/telemetry`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return (json?.data ?? []) as Telemetry[];
  } catch {
    return [];
  }
}

export default async function StateOfAIGovernancePage() {
  const data = await getTelemetry();

  return (
    <main className="bg-white dark:bg-gray-950">
      <ResearchHero />
      <GovernanceClient initialData={data} />

      {/* Methodology */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Methodology</h2>
          <ul className="mt-3 list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li>Anonymized, aggregated telemetry across participating LayerZero tenants.</li>
            <li>Signals include PII, source code, secrets, regulated content, and custom rules.</li>
            <li>Human-in-the-loop approvals include approver rationales; the system learns to reduce future escalations.</li>
            <li>Industry views reflect tenants that opted into benchmark sharing.</li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-2xl bg-black text-white p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-xl font-semibold">Adopt AI faster, keep control of your data.</div>
            <div className="text-sm text-gray-300">See your own redaction, block, and approval metrics in a live demo.</div>
          </div>
          <div className="flex gap-3">
            <a href="/admin" className="px-4 py-2 rounded-2xl bg-white text-black">Launch Demo</a>
            <a href="/#contact" className="px-4 py-2 rounded-2xl border border-white">Talk to Us</a>
          </div>
        </div>
      </section>
    </main>
  );
}