'use client';

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Left side copy */}
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Add a <span className="text-blue-600 font-semibold">layer of trust</span> to your AI
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            <span className="text-blue-600 font-semibold">LayerZero</span> is the foundation of safe AI.
            It detects and redacts PII, source code, secrets, and regulated content in real time,
            keeping your data secure before it leaves your tenant.
          </p>
          <div className="mt-6 flex gap-3">
            <a
              className="px-5 py-3 rounded-2xl bg-black text-white hover:shadow-lg transition"
              href="/admin"
            >
              Launch Live Demo
            </a>
            <button className="px-5 py-3 rounded-2xl border hover:bg-gray-50 transition">
              Contact Us
            </button>
          </div>
          <p className="mt-3 text-sm text-gray-500">
            No code needed. Works with OpenAI, Azure OpenAI, and more.
          </p>
        </div>

        {/* Right side preview card */}
        <div className="rounded-2xl bg-white shadow p-5">
          <div className="text-sm text-gray-500 mb-2">Admin Preview</div>
          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="font-medium">Policy Decision</div>
              <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                Allowed (Redacted)
              </span>
            </div>
            <div className="text-xs text-gray-500 mb-1">Prompt (sanitized)</div>
            <pre className="text-sm bg-gray-50 p-3 rounded-lg overflow-auto">
              "Write a follow-up email to [REDACTED_NAME] about invoice [REDACTED_NUMBER]."
            </pre>
            <div className="grid grid-cols-3 gap-2 mt-4">
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">PII Redactions</div>
                <div className="text-lg font-semibold">18</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">Blocked</div>
                <div className="text-lg font-semibold">2.4%</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-xs text-gray-500">Active Users</div>
                <div className="text-lg font-semibold">1,874</div>
              </div>
            </div>
            <div className="mt-4 text-right">
              <a href="/admin" className="text-sm underline">
                See full dashboard →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}