// components/IntegrationsDiagram.tsx
export default function IntegrationsDiagram() {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-transparent">
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

        <!-- defs -->
        <defs>
          <!-- Arrowhead uses currentColor so it adapts to light/dark -->
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor"></path>
          </marker>
          <!-- Blue accent for LayerZero box (Tailwind blue-600: #2563EB) -->
          <linearGradient id="lzBg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="#EFF6FF" />
            <stop offset="100%" stop-color="#DBEAFE" />
          </linearGradient>
          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.12" />
          </filter>
        </defs>

        <!-- layout guides -->
        <!-- left column: Your App -->
        <g transform="translate(60,120)">
          <rect
            width="240" height="120" rx="14"
            fill="none"
            stroke="currentColor"
            stroke-opacity="0.25"
            className="dark:opacity-80"
          />
          <text x="120" y="48" text-anchor="middle" font-size="18" font-weight="600">Your App</text>
          <text x="120" y="78" text-anchor="middle" font-size="12" opacity="0.7">
            Web • Backoffice • Internal tools
          </text>
        </g>

        <!-- middle column: LayerZero -->
        <g transform="translate(360,85)">
          <rect
            width="240" height="190" rx="16"
            fill="url(#lzBg)"
            stroke="#2563EB"
            stroke-opacity="0.9"
            filter="url(#softShadow)"
          />
          <text x="120" y="40" text-anchor="middle" font-size="18" font-weight="700" fill="#1E3A8A">
            LayerZero
          </text>

          <!-- bullets -->
          <g font-size="12" fill="#1E3A8A" opacity="0.95">
            <g transform="translate(24,70)">
              <circle r="3" cx="0" cy="0" fill="#2563EB" />
              <text x="12" y="4">PII &amp; Secrets scanning</text>
            </g>
            <g transform="translate(24,98)">
              <circle r="3" cx="0" cy="0" fill="#2563EB" />
              <text x="12" y="4">Inline redaction</text>
            </g>
            <g transform="translate(24,126)">
              <circle r="3" cx="0" cy="0" fill="#2563EB" />
              <text x="12" y="4">Policy rules &amp; approvals</text>
            </g>
            <g transform="translate(24,154)">
              <circle r="3" cx="0" cy="0" fill="#2563EB" />
              <text x="12" y="4">Audit logs &amp; routing</text>
            </g>
          </g>
        </g>

        <!-- right column: Providers -->
        <g transform="translate(660,60)">
          <!-- grid of providers -->
          <g transform="translate(0,0)">
            <rect width="240" height="240" rx="14" fill="none" stroke="currentColor" stroke-opacity="0.25" />
            <text x="120" y="28" text-anchor="middle" font-size="14" font-weight="600">AI Providers</text>

            <!-- cells -->
            <g font-size="12" opacity="0.9">
              <g transform="translate(16,48)">
                <rect width="96" height="48" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.25"/>
                <text x="48" y="30" text-anchor="middle">OpenAI</text>
              </g>
              <g transform="translate(128,48)">
                <rect width="96" height="48" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.25"/>
                <text x="48" y="30" text-anchor="middle">Azure OpenAI</text>
              </g>
              <g transform="translate(16,108)">
                <rect width="96" height="48" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.25"/>
                <text x="48" y="30" text-anchor="middle">Anthropic</text>
              </g>
              <g transform="translate(128,108)">
                <rect width="96" height="48" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.25"/>
                <text x="48" y="30" text-anchor="middle">Vertex AI</text>
              </g>
              <g transform="translate(16,168)">
                <rect width="96" height="48" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.25"/>
                <text x="48" y="30" text-anchor="middle">AWS Bedrock</text>
              </g>
              <g transform="translate(128,168)">
                <rect width="96" height="48" rx="10" fill="none" stroke="currentColor" stroke-opacity="0.25"/>
                <text x="48" y="30" text-anchor="middle">Local LLMs</text>
              </g>
            </g>
          </g>
        </g>

        <!-- arrows -->
        <!-- App -> LayerZero -->
        <g stroke="currentColor" stroke-width="2" fill="none" marker-end="url(#arrow)" opacity="0.8">
          <path d="M300,180 C330,180 330,180 360,180"></path>
        </g>
        <text x="330" y="170" font-size="12" text-anchor="middle" opacity="0.7">Requests</text>

        <!-- LayerZero -> Providers -->
        <g stroke="currentColor" stroke-width="2" fill="none" marker-end="url(#arrow)" opacity="0.8">
          <path d="M600,180 C630,180 630,180 660,180"></path>
        </g>
        <text x="630" y="170" font-size="12" text-anchor="middle" opacity="0.7">Sanitized requests</text>

        <!-- Return path (responses) -->
        <g stroke="currentColor" stroke-width="2" fill="none" marker-end="url(#arrow)" opacity="0.5">
          <path d="M660,220 C630,220 630,220 600,220"></path>
          <path d="M360,220 C330,220 330,220 300,220"></path>
        </g>
        <text x="630" y="235" font-size="12" text-anchor="middle" opacity="0.6">Responses</text>
        <text x="330" y="235" font-size="12" text-anchor="middle" opacity="0.6">Approved responses</text>

        <!-- Legend -->
        <g transform="translate(60,308)" font-size="12" opacity="0.75">
          <rect x="0" y="-14" width="320" height="30" rx="8" fill="none" stroke="currentColor" stroke-opacity="0.2"/>
          <g transform="translate(12,0)">
            <circle r="4" cx="0" cy="0" fill="#2563EB" />
            <text x="10" y="4">Policy checks (redact / allow / escalate)</text>
          </g>
        </g>
      </svg>
    </div>
  );
}