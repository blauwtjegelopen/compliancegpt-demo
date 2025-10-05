// apps/web/app/integrations/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import HowItWorks from "@/components/HowItWorks";
import ContactLargeFinal from "@/components/ContactLargeFinal";

type Provider = "openai" | "anthropic" | "azure";
type ConnectPayload = {
  provider: Provider;
  apiKey: string;
  baseUrl?: string;
  model?: string;
  region?: string;
};

type SavedConfig = Omit<ConnectPayload, "apiKey"> & {
  // maskedKey is only for UI display; we never return raw keys from the API
  maskedKey: string;
};

function maskKey(k: string) {
  if (!k) return "";
  if (k.length <= 8) return "••••";
  return `${k.slice(0, 3)}••••${k.slice(-4)}`;
}

export default function IntegrationsPage() {
  // ---- local demo state; in step 2 this will be fetched from DB-backed API
  const [saved, setSaved] = useState<SavedConfig | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("lz_integrations_demo") : null;
    if (raw) {
      try {
        setSaved(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
  }, []);

  const [form, setForm] = useState<ConnectPayload>({
    provider: "openai",
    apiKey: "",
    baseUrl: "",
    model: "gpt-4o-mini",
  });

  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testOk, setTestOk] = useState<null | string>(null);
  const [testErr, setTestErr] = useState<null | string>(null);

  async function saveConfig() {
    setSaving(true);
    setTestOk(null);
    setTestErr(null);
    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save config");

      // persist to localStorage for the demo
      const next: SavedConfig = {
        provider: form.provider,
        baseUrl: form.baseUrl || undefined,
        model: form.model || undefined,
        region: form.region || undefined,
        maskedKey: maskKey(form.apiKey),
      };
      localStorage.setItem("lz_integrations_demo", JSON.stringify(next));
      setSaved(next);
    } catch (e: any) {
      alert(e?.message || e);
    } finally {
      setSaving(false);
    }
  }

  async function testConnection() {
    setTesting(true);
    setTestOk(null);
    setTestErr(null);
    try {
      const res = await fetch("/api/integrations/test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Test failed");
      setTestOk(data?.message || "Connection OK");
    } catch (e: any) {
      setTestErr(e?.message || "Test failed");
    } finally {
      setTesting(false);
    }
  }

  function clearConfig() {
    localStorage.removeItem("lz_integrations_demo");
    setSaved(null);
  }

  const providerHelp = useMemo(() => {
    switch (form.provider) {
      case "openai":
        return {
          basePlaceholder: "https://api.openai.com/v1 (optional)",
          modelPlaceholder: "e.g. gpt-4o-mini",
          keyPlaceholder: "sk-********************************",
        };
      case "anthropic":
        return {
          basePlaceholder: "https://api.anthropic.com (optional)",
          modelPlaceholder: "e.g. claude-3-haiku-20240307",
          keyPlaceholder: "anthropic-key",
        };
      case "azure":
        return {
          basePlaceholder: "https://<resource>.openai.azure.com (required)",
          modelPlaceholder: "your deployment name (e.g. gpt-4o-mini)",
          keyPlaceholder: "azure-openai-key",
        };
      default:
        return { basePlaceholder: "", modelPlaceholder: "", keyPlaceholder: "" };
    }
  }, [form.provider]);

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
          {["OpenAI", "Azure OpenAI", "Anthropic", "Google Vertex AI", "AWS Bedrock", "Local LLMs"].map(
            (provider) => (
              <div
                key={provider}
                className="rounded-xl border bg-white px-4 py-6 text-gray-800 font-medium shadow-sm dark:bg-transparent dark:text-gray-200 dark:border-white/10"
              >
                {provider}
              </div>
            )
          )}
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
              <pre className="text-sm text-gray-800 dark:text-gray-200 bg-transparent">{`"Write a follow-up email to John Doe
about invoice #44532 due next week."`}</pre>
            </div>
            <div className="rounded-xl border p-4 bg-gray-50 dark:bg-gray-800 dark:border-white/10">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">After (sanitized)</div>
              <pre className="text-sm text-gray-800 dark:text-gray-200 bg-transparent">{`"Write a follow-up email to [REDACTED_NAME]
about invoice [REDACTED_NUMBER] due next week."`}</pre>
            </div>
          </div>
        </div>
      </section>

      {/* BYOK Connect card */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-2xl border bg-white p-6 dark:border-white/10 dark:bg-transparent">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4">Connect your provider (BYOK)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Bring your own LLM contract. Keys are sent to the backend for validation only; for this demo they’re
            stored in your browser (localStorage). In step 2 we’ll store them server-side (DB + KMS).
          </p>

          {/* Provider selector */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <button
              onClick={() => setForm((f) => ({ ...f, provider: "openai" }))}
              className={`rounded-xl border p-4 text-left ${
                form.provider === "openai"
                  ? "border-black dark:border-white"
                  : "border-gray-200 dark:border-white/10"
              }`}
            >
              <div className="font-medium">OpenAI API</div>
              <div className="text-sm text-gray-500">Best default. Global endpoints.</div>
            </button>
            <button
              disabled
              title="Coming soon"
              className="rounded-xl border p-4 text-left border-gray-200 dark:border-white/10 opacity-50 cursor-not-allowed"
            >
              <div className="font-medium">Anthropic (Claude)</div>
              <div className="text-sm text-gray-500">Coming soon</div>
            </button>
            <button
              disabled
              title="Coming soon"
              className="rounded-xl border p-4 text-left border-gray-200 dark:border-white/10 opacity-50 cursor-not-allowed"
            >
              <div className="font-medium">Azure OpenAI</div>
              <div className="text-sm text-gray-500">Coming soon</div>
            </button>
            <button
              disabled
              title="Coming soon"
              className="rounded-xl border p-4 text-left border-gray-200 dark:border-white/10 opacity-50 cursor-not-allowed"
            >
              <div className="font-medium">Others</div>
              <div className="text-sm text-gray-500">Bedrock, Vertex, Local (soon)</div>
            </button>
          </div>

          {/* Form */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">API Key</label>
              <input
                type="password"
                className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-transparent border-gray-200 dark:border-white/10"
                placeholder={providerHelp.keyPlaceholder}
                value={form.apiKey}
                onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
                autoComplete="off"
              />
              <p className="mt-1 text-xs text-gray-500">
                Keep keys server-side in production. Never ship to the browser.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Base URL (optional)</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-transparent border-gray-200 dark:border-white/10"
                placeholder={providerHelp.basePlaceholder}
                value={form.baseUrl}
                onChange={(e) => setForm((f) => ({ ...f, baseUrl: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Default Model</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-transparent border-gray-200 dark:border-white/10"
                placeholder={providerHelp.modelPlaceholder}
                value={form.model}
                onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
              />
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={saveConfig}
                disabled={!form.apiKey || saving}
                className="rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-50 dark:bg-white dark:text-black"
              >
                {saving ? "Saving…" : "Save connection"}
              </button>
              <button
                onClick={testConnection}
                disabled={!form.apiKey || testing}
                className="rounded-md border px-4 py-2 text-sm dark:border-white/10"
                title="Validates your key against provider (no token spend for OpenAI)"
              >
                {testing ? "Testing…" : "Test connection"}
              </button>
              <button
                onClick={clearConfig}
                className="rounded-md border px-4 py-2 text-sm dark:border-white/10"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Status */}
          <div className="mt-4">
            {testOk && (
              <div className="rounded-md bg-emerald-50 text-emerald-700 px-3 py-2 text-sm dark:bg-emerald-900/20 dark:text-emerald-300">
                {testOk}
              </div>
            )}
            {testErr && (
              <div className="rounded-md bg-rose-50 text-rose-700 px-3 py-2 text-sm dark:bg-rose-900/20 dark:text-rose-300">
                {testErr}
              </div>
            )}
          </div>

          {/* Current saved (demo) */}
          <div className="mt-6 rounded-xl border p-4 dark:border-white/10">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current (demo) configuration</div>
            {saved ? (
              <pre className="text-sm bg-gray-50 dark:bg-transparent p-2 rounded">
                {JSON.stringify(saved, null, 2)}
              </pre>
            ) : (
              <div className="text-sm text-gray-500">No provider connected yet.</div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-14">
        <div className="rounded-2xl bg-black text-gray-200 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4 dark:bg-gray-800">
          <div>
            <div className="text-xl font-semibold">Add a layer of trust to your AI</div>
            <div className="text-sm text-gray-300">
              Secure adoption starts with integration — drop-in proxy, SDK, or API.
            </div>
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