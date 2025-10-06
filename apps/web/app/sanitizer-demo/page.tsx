// apps/web/app/sanitizer-demo/page.tsx
"use client";

import { useState, useTransition } from "react";
import { ArrowRight, EyeOff } from "lucide-react";
import { routeViaProxy } from "@/lib/proxy";

export default function SanitizerDemo() {
  const [input, setInput] = useState(
    "Write a follow-up email to John Doe about invoice #44532 due next week. My email is jane.doe@example.com"
  );
  const [result, setResult] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <main className="max-w-3xl mx-auto px-6 pt-16 pb-20">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-gray-200">
        Sanitizer Demo
      </h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Sends your prompt through the LayerZero Proxy, which redacts PII & secrets before forwarding upstream.
      </p>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-transparent">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          Prompt
        </label>
        <textarea
          className="w-full min-h-[160px] rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-black/10 text-gray-900 dark:text-gray-200 bg-white dark:bg-transparent border-gray-200 dark:border-white/10"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="mt-3">
          <button
            onClick={() =>
              startTransition(async () => {
                setResult(null);
                const payload = { messages: [{ role: "user", content: input }] };
                const res = await routeViaProxy(payload);
                setResult(res);
              })
            }
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black text-sm disabled:opacity-50"
            disabled={isPending || !input.trim()}
          >
            {isPending ? "Sending…" : "Send via Proxy"}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 mb-1">
              <EyeOff className="h-3.5 w-3.5" />
              Proxy findings
            </div>
            <pre className="text-sm bg-gray-50 dark:bg-transparent p-2 rounded overflow-auto">
{JSON.stringify(result.findings ?? [], null, 2)}
            </pre>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-white/10 p-3">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Upstream response
            </div>
            <pre className="text-sm bg-gray-50 dark:bg-transparent p-2 rounded overflow-auto">
{JSON.stringify(result.data ?? result, null, 2)}
            </pre>

            {result?.error && (
              <div className="mt-2 text-sm rounded border border-rose-200 bg-rose-50 p-2 text-rose-800 dark:border-rose-900/40 dark:bg-rose-900/20 dark:text-rose-300">
                Proxy error: {result.error}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}