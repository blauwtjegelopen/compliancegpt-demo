// app/integrations/page.tsx
import HowItWorks from "@/components/HowItWorks";
import ContactLargeFinal from "@/components/ContactLargeFinal";

export default function IntegrationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-gray-200">
            Integrations made simple
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            LayerZero sits between your apps and large language models—filtering, redacting,
            and approving sensitive data in real time. No code changes required.
          </p>
        </div>
      </section>

      {/* Diagram (polished) */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 text-center mb-6">
          How it works
        </h2>
        <HowItWorks variant="flow" />
      </section>

      {/* Supported Platforms */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-6 text-center">
          Supported integrations
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center">
          {[
            "OpenAI",
            "Azure OpenAI",
            "Anthropic",
            "Google Vertex AI",
            "AWS Bedrock",
            "Local LLMs",
          ].map((provider) => (
            <div
              key={provider}
              className="rounded-xl border bg-white px-4 py-6 text-gray-800 font-medium shadow-sm dark:bg-transparent dark:text-gray-200 dark:border-white/10"
            >
              {provider}
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          Don’t see your stack? LayerZero works anywhere via API or reverse proxy.
        </p>
      </section>

      {/* Deployment options */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Drop-in Proxy",
              description:
                "Point your application at LayerZero’s endpoint. Requests are filtered and forwarded instantly to your provider.",
            },
            {
              title: "SDK Integration",
              description:
                "Embed policy enforcement directly in your app using our lightweight client libraries.",
            },
            {
              title: "API Gateway",
              description:
                "Connect via REST API to control data before it ever leaves your environment.",
            },
          ].map((opt) => (
            <div
              key={opt.title}
              className="rounded-2xl border bg-white p-6 dark:border-white/10 dark:bg-transparent"
            >
              <div className="font-semibold text-gray-900 dark:text-gray-200">{opt.title}</div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{opt.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Example workflow */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-2xl border bg-white p-6 dark:border-white/10 dark:bg-transparent">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-6">
            Example: Prompt redaction in action
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-xl border p-4 bg-gray-50 dark:bg-gray-800 dark:border-white/10">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Before</div>
              <pre className="text-sm text-gray-800 dark:text-gray-200 bg-transparent">
{`"Write a follow-up email to John Doe
about invoice #44532 due next week."`}
              </pre>
            </div>
            <div className="rounded-xl border p-4 bg-gray-50 dark:bg-gray-800 dark:border-white/10">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">After (sanitized)</div>
              <pre className="text-sm text-gray-800 dark:text-gray-200 bg-transparent">
{`"Write a follow-up email to [REDACTED_NAME]
about invoice [REDACTED_NUMBER] due next week."`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="rounded-2xl bg-black text-gray-200 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 dark:bg-gray-800">
          <div>
            <div className="text-xl font-semibold">Add a layer of trust to your AI</div>
            <div className="text-sm text-gray-300">Secure adoption starts with integration — drop-in proxy, SDK, or API.</div>
          </div>
          <div className="flex gap-3">
            <a className="px-4 py-2 rounded-md bg-white text-black hover:bg-gray-100" href="/trust">
              Security &amp; Trust
            </a>
            <a className="px-4 py-2 rounded-md border border-white/70 text-gray-200 hover:bg-white/5" href="/admin">
              Launch Demo
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