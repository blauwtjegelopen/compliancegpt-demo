import ContactLargeFinal from "@/components/ContactLargeFinal";
import ContactModal from "@/components/ContactModal";

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
            LayerZero sits between your apps and large language models — filtering, redacting,
            and approving sensitive data in real time. No code changes required.
          </p>
        </div>
      </section>

      {/* Diagram section (inline SVG) */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 text-center mb-6">
          How it works
        </h2>
        <div className="rounded-2xl border bg-white dark:bg-transparent dark:border-white/10 p-6">
          <svg
            viewBox="0 0 960 360"
            className="w-full h-auto text-gray-800 dark:text-gray-200"
            role="img"
            aria-labelledby="lz-diagram-title lz-diagram-desc"
          >
            <title id="lz-diagram-title">LayerZero Integration Flow</title>
            <desc id="lz-diagram-desc">
              Data flows from your app into LayerZero where it is inspected and redacted before being sent to AI providers.
            </desc>

            <defs>
              <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill="currentColor"></path>
              </marker>
              <linearGradient id="lzBg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#EFF6FF" />
                <stop offset="100%" stopColor="#DBEAFE" />
              </linearGradient>
              <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* Left: Your App */}
            <g transform="translate(60,120)">
              <rect width="200" height="120" rx="12" fill="none" stroke="currentColor" strokeOpacity="0.25" />
              <text x="100" y="36" textAnchor="middle" fontSize="16" fontWeight="600">Your App</text>
              <g fontSize="12" opacity="0.8">
                <text x="24" y="66">• Web / Internal tools</text>
                <text x="24" y="86">• Chat, email, CRM</text>
                <text x="24" y="106">• Data pipelines</text>
              </g>
            </g>

            {/* Middle: LayerZero */}
            <g transform="translate(360,85)">
              <rect width="240" height="190" rx="16" fill="url(#lzBg)" stroke="#2563EB" strokeOpacity="0.9" filter="url(#softShadow)" />
              <text x="120" y="40" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1E3A8A">LayerZero</text>
              <g fontSize="12" fill="#1E3A8A" opacity="0.95">
                <g transform="translate(24,70)"><circle r="3" cx="0" cy="0" fill="#2563EB" /><text x="12" y="4">PII &amp; Secrets scanning</text></g>
                <g transform="translate(24,98)"><circle r="3" cx="0" cy="0" fill="#2563EB" /><text x="12" y="4">Inline redaction</text></g>
                <g transform="translate(24,126)"><circle r="3" cx="0" cy="0" fill="#2563EB" /><text x="12" y="4">Policy rules &amp; approvals</text></g>
                <g transform="translate(24,154)"><circle r="3" cx="0" cy="0" fill="#2563EB" /><text x="12" y="4">Audit logs &amp; routing</text></g>
              </g>
            </g>

            {/* Right: AI Providers (logos + names, evenly spaced) */}
            <g transform="translate(660,60)">
              <rect width="240" height="240" rx="14" fill="none" stroke="currentColor" strokeOpacity="0.25" />
              <text x="120" y="28" textAnchor="middle" fontSize="14" fontWeight="600">AI Providers</text>

              {/* Column grid: 2 columns x 3 rows, generous spacing */}
              {/* OpenAI */}
              <g transform="translate(16,54)">
                <rect width="96" height="58" rx="10" fill="none" stroke="currentColor" strokeOpacity="0.25" />
                <g transform="translate(28,18) scale(0.55)">
                  <g fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M-10 -16 a18 18 0 1 1 20 0" />
                    <path d="M-18 -2 a18 18 0 1 1 16 18" />
                    <path d="M8 -18 a18 18 0 1 1 10 18" />
                  </g>
                </g>
                <text x="48" y="48" textAnchor="middle" fontSize="11">OpenAI</text>
              </g>

              {/* Azure */}
              <g transform="translate(128,54)">
                <rect width="96" height="58" rx="10" fill="none" stroke="currentColor" strokeOpacity="0.25" />
                <g transform="translate(48,18)">
                  <path d="M-14,28 L0,0 L14,28 Z" fill="currentColor" opacity="0.9" />
                </g>
                <text x="48" y="48" textAnchor="middle" fontSize="11">Azure</text>
              </g>

              {/* Anthropic */}
              <g transform="translate(16,122)">
                <rect width="96" height="58" rx="10" fill="none" stroke="currentColor" strokeOpacity="0.25" />
                <text x="48" y="30" textAnchor="middle" fontSize="20" fontWeight="700">A</text>
                <text x="48" y="48" textAnchor="middle" fontSize="11">Anthropic</text>
              </g>

              {/* Google Vertex AI */}
              <g transform="translate(128,122)">
                <rect width="96" height="58" rx="10" fill="none" stroke="currentColor" strokeOpacity="0.25" />
                <g transform="translate(48,22)">
                  <polygon points="0,-12 10,-6 10,6 0,12 -10,6 -10,-6" fill="none" stroke="currentColor" strokeWidth="2" />
                </g>
                <text x="48" y="48" textAnchor="middle" fontSize="11">Vertex AI</text>
              </g>

              {/* AWS Bedrock */}
              <g transform="translate(16,190)">
                <rect width="96" height="58" rx="10" fill="none" stroke="currentColor" strokeOpacity="0.25" />
                <g transform="translate(48,24)">
                  <rect x="-12" y="-10" width="24" height="20" rx="3" fill="none" stroke="currentColor" />
                  <path d="M -10 10 Q 0 16 10 10" fill="none" stroke="currentColor" />
                </g>
                <text x="48" y="50" textAnchor="middle" fontSize="11">AWS Bedrock</text>
              </g>

              {/* Local LLMs */}
              <g transform="translate(128,190)">
                <rect width="96" height="58" rx="10" fill="none" stroke="currentColor" strokeOpacity="0.25" />
                <g transform="translate(48,24)">
                  <rect x="-11" y="-11" width="22" height="22" rx="3" fill="none" stroke="currentColor" />
                  <circle cx="0" cy="0" r="4" fill="currentColor" />
                </g>
                <text x="48" y="50" textAnchor="middle" fontSize="11">Local LLMs</text>
              </g>
            </g>

            {/* Arrows */}
            <g stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#arrow)" opacity="0.8">
              <path d="M260,180 C300,180 320,180 360,180"></path>
            </g>
            <text x="310" y="170" fontSize="12" textAnchor="middle" opacity="0.7">Requests</text>

            <g stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#arrow)" opacity="0.8">
              <path d="M600,180 C620,180 640,180 660,180"></path>
            </g>
            <text x="630" y="170" fontSize="12" textAnchor="middle" opacity="0.7">Sanitized requests</text>

            <g stroke="currentColor" strokeWidth="2" fill="none" markerEnd="url(#arrow)" opacity="0.5">
              <path d="M660,220 C640,220 620,220 600,220"></path>
              <path d="M360,220 C340,220 320,220 300,220"></path>
            </g>
            <text x="630" y="235" fontSize="12" textAnchor="middle" opacity="0.6">Responses</text>
            <text x="330" y="235" fontSize="12" textAnchor="middle" opacity="0.6">Approved responses</text>
          </svg>
        </div>
      </section>

      {/* Supported Platforms */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-6 text-center">
          Supported integrations
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center">
          {["OpenAI", "Azure OpenAI", "Anthropic", "Google Vertex AI", "AWS Bedrock", "Local LLMs"].map((provider) => (
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

      {/* Anchor target for navbar "Contact Us" */}
      <div id="contact" className="max-w-6xl mx-auto px-6 pb-16">
        <ContactLargeFinal />
      </div>

      <ContactModal />
    </>
  );
}