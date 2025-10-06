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
  id: string;
  maskedKey?: string;
  createdAt?: string;
  updatedAt?: string;
};

function maskKey(k: string) {
  if (!k) return "";
  if (k.length <= 8) return "••••";
  return `${k.slice(0, 3)}••••${k.slice(-4)}`;
}

export default function IntegrationsPage() {
  // Admin token (in-memory only) for protected POST/PUT/DELETE
  const [adminToken, setAdminToken] = useState("");

  // Server-backed list
  const [items, setItems] = useState<SavedConfig[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listErr, setListErr] = useState<string | null>(null);

  // Editing
  const [editingId, setEditingId] = useState<string | null>(null);

  // Demo preview (localStorage only)
  const [savedDemo, setSavedDemo] = useState<Omit<SavedConfig, "id"> | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem("lz_integrations_demo") : null;
    if (raw) {
      try {
        setSavedDemo(JSON.parse(raw));
      } catch {}
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

  async function loadList() {
    setLoadingList(true);
    setListErr(null);
    try {
      const res = await fetch("/api/integrations", { method: "GET" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to fetch");
      setItems(
        (Array.isArray(data) ? data : []).map((x: any) => ({
          id: x.id,
          provider: x.provider,
          baseUrl: x.baseUrl ?? "",
          model: x.model ?? "",
          region: x.region ?? "",
          maskedKey: x.maskedKey ?? (x.apiKey ? maskKey(x.apiKey) : undefined),
          createdAt: x.createdAt,
          updatedAt: x.updatedAt,
        }))
      );
    } catch (e: any) {
      setListErr(e?.message || "Failed to fetch");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    loadList();
  }, []);

  async function saveConfig() {
    setSaving(true);
    setTestOk(null);
    setTestErr(null);
    try {
      if (form.provider === "azure" && !form.baseUrl?.trim()) {
        throw new Error("Azure requires a Base URL (e.g. https://<resource>.openai.azure.com)");
      }

      const url = editingId ? `/api/integrations/${editingId}` : "/api/integrations";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "content-type": "application/json",
          ...(adminToken ? { "x-admin-token": adminToken } : {}),
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save config");

      await loadList();

      const nextDemo = {
        provider: form.provider,
        baseUrl: form.baseUrl || undefined,
        model: form.model || undefined,
        region: form.region || undefined,
        maskedKey: maskKey(form.apiKey),
      };
      localStorage.setItem("lz_integrations_demo", JSON.stringify(nextDemo));
      setSavedDemo(nextDemo);

      setForm((f) => ({ ...f, apiKey: "" }));
      setEditingId(null);
    } catch (e: any) {
      alert(e?.message || e);
    } finally {
      setSaving(false);
    }
  }

  async function deleteConfig(id: string) {
    if (!confirm("Delete this integration?")) return;
    try {
      const res = await fetch(`/api/integrations/${id}`, {
        method: "DELETE",
        headers: {
          ...(adminToken ? { "x-admin-token": adminToken } : {}),
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to delete");
      await loadList();
      if (editingId === id) {
        setEditingId(null);
        setForm((f) => ({ ...f, apiKey: "" }));
      }
    } catch (e: any) {
      alert(e?.message || e);
    }
  }

  function startEdit(item: SavedConfig) {
    setEditingId(item.id);
    setForm({
      provider: item.provider,
      apiKey: "",
      baseUrl: item.baseUrl ?? "",
      model: item.model ?? "",
      region: item.region ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm((f) => ({ ...f, apiKey: "" }));
  }

  async function testConnection() {
    setTesting(true);
    setTestOk(null);
    setTestErr(null);
    try {
      // Optional guardrails: Azure needs baseUrl
      if (form.provider === "azure" && !form.baseUrl?.trim()) {
        throw new Error("Azure requires a Base URL to test (e.g. https://<resource>.openai.azure.com)");
      }

      const res = await fetch("/api/integrations/test", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      // If your backend only has OpenAI test implemented, show a friendly notice.
      if (!res.ok) {
        if (data?.error?.includes("unsupported") || data?.error?.includes("not implemented")) {
          throw new Error(
            `Test for "${form.provider}" isn't implemented server-side yet. The connection may still save fine.`
          );
        }
        throw new Error(data?.error || "Test failed");
      }
      setTestOk(data?.message || "Connection OK");
    } catch (e: any) {
      setTestErr(e?.message || "Test failed");
    } finally {
      setTesting(false);
    }
  }

  const providerHelp = useMemo(() => {
    switch (form.provider) {
      case "openai":
        return {
          basePlaceholder: "https://api.openai.com/v1 (optional)",
          modelPlaceholder: "e.g. gpt-4o-mini",
          keyPlaceholder: "sk-********************************",
          baseRequired: false,
        };
      case "anthropic":
        return {
          basePlaceholder: "https://api.anthropic.com (optional)",
          modelPlaceholder: "e.g. claude-3-haiku-20240307",
          keyPlaceholder: "anthropic-key",
          baseRequired: false,
        };
      case "azure":
        return {
          basePlaceholder: "https://<resource>.openai.azure.com (required)",
          modelPlaceholder: "deployment name (e.g. gpt-4o-mini)",
          keyPlaceholder: "azure-openai-key",
          baseRequired: true,
        };
      default:
        return { basePlaceholder: "", modelPlaceholder: "", keyPlaceholder: "", baseRequired: false };
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

      {/* Diagram */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 text-center mb-6">
          How it works
        </h2>
        <HowItWorks variant="flow" />
      </section>

      {/* Position + Modes */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-6 text-center">
          Where LayerZero fits — and how you deploy it
        </h2>

        <div className="rounded-2xl border bg-white p-6 mb-8 dark:border-white/10 dark:bg-transparent">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 text-center">
            Whether employees use ChatGPT in the browser or your apps call an LLM API directly,
            LayerZero intercepts traffic <span className="whitespace-nowrap">before egress</span> — scanning,
            redacting, approving, and auditing in-line.
          </p>
          <div className="grid md:grid-cols-5 gap-4 text-center items-center text-sm text-gray-700 dark:text-gray-300">
            <div className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-white/10">
              🧑‍💻 User / App
              <div className="text-xs text-gray-500 mt-1">Browser · SDK · Internal tool</div>
            </div>
            <div className="text-gray-400">➡️</div>
            <div className="p-4 rounded-xl border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
              🧠 LayerZero Proxy
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">Redact · Approve · Audit</div>
            </div>
            <div className="text-gray-400">➡️</div>
            <div className="p-4 rounded-xl border bg-gray-50 dark:bg-gray-800 dark:border-white/10">
              🌐 LLM Provider
              <div className="text-xs text-gray-500 mt-1">OpenAI · Anthropic · Azure</div>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-4 text-center">
            BYOK: Your organization’s API keys call the model. LayerZero enforces policy and logs events; keys and raw prompts aren’t retained.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Network Proxy",
              badge: "Zero app changes",
              body:
                "Route browser + API traffic through LayerZero (proxy/DNS). Transparent inspection and forwarding with central policy control.",
              bullets: [
                "Covers ChatGPT-in-browser + APIs",
                "Fastest org-wide rollout",
                "Global allow/deny, data regions",
              ],
            },
            {
              title: "SDK Adapter",
              badge: "Developer-friendly",
              body:
                "Swap direct OpenAI/Claude SDKs with LayerZero’s client. Same ergonomics; adds redaction, approvals, and audit.",
              bullets: [
                "Minimal code diff",
                "Per-app policies & routing",
                "Fine-grained observability",
              ],
            },
            {
              title: "Reverse Proxy (BYOK)",
              badge: "Keep your keys",
              body:
                "Your keys, your tenancy. LayerZero redacts then forwards using your credentials; we never store or reuse them.",
              bullets: [
                "Keys remain in your control",
                "Pre-egress redaction",
                "Complete audit trail",
              ],
            },
          ].map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border bg-white p-6 dark:border-white/10 dark:bg-transparent"
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold text-gray-900 dark:text-gray-200">{c.title}</div>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  {c.badge}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{c.body}</p>
              <ul className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Supported */}
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

      {/* Example */}
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

      {/* BYOK Connect + Manage */}
      <section className="max-w-6xl mx-auto px-6 pb-16" id="byok">
        <div className="rounded-2xl border bg-white p-6 dark:border-white/10 dark:bg-transparent">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-4">Connect your provider (BYOK)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Bring your own LLM contract. Keys are validated server-side; for this demo, we also show a local preview.
            In production, keys live in your environment (DB + KMS), never sent to clients.
          </p>

          {/* Admin token */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Admin token (local dev)</label>
            <input
              type="password"
              className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-transparent border-gray-200 dark:border-white/10"
              placeholder="dev-shared-admin-token"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              autoComplete="off"
            />
            <p className="mt-1 text-xs text-gray-500">Needed for create/update/delete API calls.</p>
          </div>

          {/* Provider selector — all enabled now */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            {([
              { id: "openai", title: "OpenAI API", desc: "Best default. Global endpoints." },
              { id: "anthropic", title: "Anthropic (Claude)", desc: "Fast, low-latency models." },
              { id: "azure", title: "Azure OpenAI", desc: "Enterprise deployments." },
            ] as Array<{ id: Provider; title: string; desc: string }>).map((p) => (
              <button
                key={p.id}
                onClick={() => setForm((f) => ({ ...f, provider: p.id }))}
                className={`rounded-xl border p-4 text-left ${
                  form.provider === p.id
                    ? "border-black dark:border-white"
                    : "border-gray-200 dark:border-white/10"
                }`}
              >
                <div className="font-medium">{p.title}</div>
                <div className="text-sm text-gray-500">{p.desc}</div>
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                API Key {editingId ? <span className="text-gray-400">(leave blank to keep)</span> : null}
              </label>
              <input
                type="password"
                className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-transparent border-gray-200 dark:border-white/10"
                placeholder={providerHelp.keyPlaceholder}
                value={form.apiKey}
                onChange={(e) => setForm((f) => ({ ...f, apiKey: e.target.value }))}
                autoComplete="off"
              />
              <p className="mt-1 text-xs text-gray-500">Keep keys server-side in production.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Base URL {providerHelp.baseRequired ? <span className="text-rose-600">*</span> : null}
              </label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm bg-white dark:bg-transparent border-gray-200 dark:border-white/10"
                placeholder={providerHelp.basePlaceholder}
                value={form.baseUrl}
                onChange={(e) => setForm((f) => ({ ...f, baseUrl: e.target.value }))}
              />
              {providerHelp.baseRequired && (
                <p className="mt-1 text-xs text-rose-600">
                  Azure requires a resource URL: e.g. https://&lt;resource&gt;.openai.azure.com
                </p>
              )}
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
                disabled={saving || (!editingId && !form.apiKey)}
                className="rounded-md bg-black text-white px-4 py-2 text-sm disabled:opacity-50 dark:bg-white dark:text-black"
                title={editingId ? "Save changes" : "Create integration"}
              >
                {saving ? (editingId ? "Saving…" : "Creating…") : editingId ? "Save changes" : "Create integration"}
              </button>
              <button
                onClick={testConnection}
                disabled={!form.apiKey || testing || (form.provider === "azure" && !form.baseUrl?.trim())}
                className="rounded-md border px-4 py-2 text-sm dark:border-white/10"
                title="Validate your key against the provider"
              >
                {testing ? "Testing…" : "Test connection"}
              </button>
              {editingId && (
                <button onClick={cancelEdit} className="rounded-md border px-4 py-2 text-sm dark:border-white/10">
                  Cancel edit
                </button>
              )}
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

          {/* Server list + actions */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-900 dark:text-gray-200">Saved integrations</div>
              <button
                onClick={loadList}
                className="text-sm underline text-gray-600 dark:text-gray-400 disabled:opacity-50"
                disabled={loadingList}
              >
                {loadingList ? "Refreshing…" : "Refresh"}
              </button>
            </div>

            {listErr && (
              <div className="mt-2 rounded-md bg-rose-50 text-rose-700 px-3 py-2 text-sm dark:bg-rose-900/20 dark:text-rose-300">
                {listErr}
              </div>
            )}

            <div className="mt-3 rounded-xl border overflow-hidden dark:border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-white/5">
                  <tr className="text-left text-gray-700 dark:text-gray-300">
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Model</th>
                    <th className="py-3 px-4">Base URL</th>
                    <th className="py-3 px-4">Key</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 px-4 text-gray-500 text-center">
                        No integrations yet.
                      </td>
                    </tr>
                  )}
                  {items.map((it) => (
                    <tr key={it.id} className="text-gray-800 dark:text-gray-300">
                      <td className="py-3 px-4 whitespace-nowrap">{it.provider}</td>
                      <td className="py-3 px-4 whitespace-nowrap">{it.model || "-"}</td>
                      <td className="py-3 px-4 whitespace-nowrap max-w-xs truncate" title={it.baseUrl || ""}>
                        {it.baseUrl || "-"}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {it.maskedKey || "••••"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(it)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteConfig(it.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs text-rose-700 dark:text-rose-300 border-gray-300 dark:border-white/10 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Demo preview */}
            <div className="mt-6 rounded-xl border p-4 dark:border-white/10">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current (demo) configuration</div>
              {savedDemo ? (
                <pre className="text-sm bg-gray-50 dark:bg-transparent p-2 rounded">
                  {JSON.stringify(savedDemo, null, 2)}
                </pre>
              ) : (
                <div className="text-sm text-gray-500">No provider connected yet.</div>
              )}
            </div>
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

      {/* Contact */}
      <div id="contact" className="max-w-6xl mx-auto px-6 pb-16">
        <ContactLargeFinal />
      </div>
    </>
  );
}