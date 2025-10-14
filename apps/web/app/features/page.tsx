'use client';

import Link from 'next/link';
import {
  ShieldCheck,
  KeySquare,
  EyeOff,
  UserCheck,
  FileSearch,
  Gauge,
  Globe2,
  Workflow,
  Lock,
  Brain,
  ClipboardCheck,
  Server,
  Boxes,
  Activity,
  History,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import BlackCTABanner from '@/components/BlackCTABanner';
import ContactLargeFinal from '@/components/ContactLargeFinal';

export default function FeaturesPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-gray-200">
          Powerful features to deploy AI safely
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          LayerZero detects and redacts sensitive data in real time, enforces policy
          guardrails, and gives security teams full visibility and control.
        </p>
      </section>

      {/* Feature grid */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: 'GDPR / PII Guard', desc: 'Emails, phone numbers, addresses, names—redacted inline before leaving your tenant.' },
            { title: 'Source Code & Secrets', desc: 'Detect code fragments, API keys, credentials, and repo references.' },
            { title: 'Policy Guardrails', desc: 'Allow/deny patterns, domains, models, and destinations with override workflows.' },
            { title: 'Human-in-the-Loop', desc: 'Escalate risky prompts to approvers; release with audit trail.' },
            { title: 'Region Routing', desc: 'Route inference by region to satisfy data residency requirements.' },
            { title: 'Zero-Retention Mode', desc: 'Opt into strict retention controls for regulated workloads.' },
          ].map((f) => (
            <div key={f.title} className="rounded-xl border bg-white p-5 dark:bg-transparent dark:border-white/10">
              <div className="font-semibold text-gray-900 dark:text-gray-200">{f.title}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Admin preview-style card */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="rounded-2xl bg-white dark:bg-transparent dark:border-white/10 border shadow p-6">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Live Preview</div>
          <div className="rounded-xl border dark:border-white/10 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium text-gray-900 dark:text-gray-200">Policy Decision</div>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                Allowed (Redacted)
              </span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Prompt (sanitized)</div>
            <pre className="text-sm bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-white/10 p-3 rounded-lg overflow-auto text-gray-900 dark:text-gray-300">
{`"Write a follow-up email to [REDACTED_NAME] about invoice [REDACTED_NUMBER]."`}
            </pre>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="rounded-lg border dark:border-white/10 p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">PII Redactions</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">18</div>
              </div>
              <div className="rounded-lg border dark:border-white/10 p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">Blocked</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">2.4%</div>
              </div>
              <div className="rounded-lg border dark:border-white/10 p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400">Active Users</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">1,874</div>
              </div>
            </div>
            <div className="mt-4 text-right">
              <a className="text-sm underline text-gray-700 dark:text-gray-400" href="/admin">
                See full dashboard →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Expanded marketing feature sections */}
      <section className="max-w-6xl mx-auto px-6 pb-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Deploy guardrails with confidence
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mb-6">
          LayerZero adds the compliance layer your AI stack has been missing—helping you ship faster,
          while staying audit-ready and compliant.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              icon: <ShieldCheck className="h-5 w-5" />,
              title: 'Compliance Mapping',
              desc: 'Map controls to SOC 2, ISO 27001, HIPAA, and PCI automatically.',
            },
            {
              icon: <Brain className="h-5 w-5" />,
              title: 'Rules AI Builder',
              desc: 'Paste policy language and let AI propose structured regex rules you can review and deploy.',
            },
            {
              icon: <Workflow className="h-5 w-5" />,
              title: 'Approval Workflow',
              desc: 'Route sensitive prompts to approvers, auto-redact, or block as needed.',
            },
            {
              icon: <Globe2 className="h-5 w-5" />,
              title: 'Region Routing',
              desc: 'Pin requests to EU, US, or APAC regions for data residency compliance.',
            },
            {
              icon: <FileSearch className="h-5 w-5" />,
              title: 'Full Audit Logs',
              desc: 'Every decision, redaction, and override is logged and exportable to SIEM or CSV.',
            },
            {
              icon: <KeySquare className="h-5 w-5" />,
              title: 'Source Code Guard',
              desc: 'Catch keys, tokens, and repo secrets before they leak to vendors.',
            },
            {
              icon: <Boxes className="h-5 w-5" />,
              title: 'Multi-Model Support',
              desc: 'Works seamlessly with OpenAI, Azure OpenAI, Anthropic, and others.',
            },
            {
              icon: <Gauge className="h-5 w-5" />,
              title: 'Performance Guardrails',
              desc: 'Rate limits, payload caps, and retry logic to ensure stable experiences.',
            },
            {
              icon: <Lock className="h-5 w-5" />,
              title: 'Zero Retention Mode',
              desc: 'Disable storage entirely for regulated workloads such as healthcare and finance.',
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent p-5 hover:shadow-sm transition"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-white/10 dark:text-blue-300">
                  {f.icon}
                </div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{f.title}</div>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">How it works</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: <Activity className="h-5 w-5" />,
              title: 'Intercept',
              desc: 'Your app points to the LayerZero proxy—no code changes required.',
            },
            {
              icon: <ClipboardCheck className="h-5 w-5" />,
              title: 'Evaluate',
              desc: 'Redaction and policy evaluation happen inline, before the LLM sees data.',
            },
            {
              icon: <History className="h-5 w-5" />,
              title: 'Audit',
              desc: 'Decisions, findings, and redactions are logged with full traceability.',
            },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-transparent p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-white/10 dark:text-blue-300">
                  {step.icon}
                </div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{step.title}</div>
              </div>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <BlackCTABanner />

      {/* Contact anchor target */}
      <div id="contact" className="max-w-6xl mx-auto px-6 pb-16">
        <ContactLargeFinal />
      </div>
    </>
  );
}