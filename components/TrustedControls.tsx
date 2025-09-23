// components/TrustedControls.tsx
import { ShieldCheck, Code2, UserCheck } from "lucide-react";

export default function TrustedControls() {
  const controls = [
    {
      title: "Data Protection Guard",
      description:
        "Automatically redact emails, phone numbers, addresses, and personal identifiers before data leaves your tenant.",
      icon: ShieldCheck,
    },
    {
      title: "Code & Secret Detection",
      description:
        "Detect API keys, code snippets, and repository references in real time — preventing leaks before they happen.",
      icon: Code2,
    },
    {
      title: "Approval Workflow",
      description:
        "Escalate sensitive prompts to approvers, then release safely with full audit logging for compliance.",
      icon: UserCheck,
    },
  ];

  return (
    <section className="bg-white dark:bg-transparent">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight dark-copy-strong">
            Trusted Controls
          </h2>
          <p className="mt-3 text-lg max-w-2xl mx-auto dark-copy-strong">
            Essential safeguards that keep your AI adoption safe, compliant, and under control.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {controls.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm
                         dark:border-gray-300 dark:bg-transparent"
            >
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-md
                               bg-blue-50 text-blue-600
                               dark:bg-gray-200 dark:text-blue-700"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold dark-copy-strong">
                    {title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed dark-copy-strong">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}