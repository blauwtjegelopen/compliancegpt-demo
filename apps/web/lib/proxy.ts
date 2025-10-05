// apps/web/lib/proxy.ts
export async function routeViaProxy(payload: unknown): Promise<{ data: any; findings: unknown; error?: string }> {
  try {
    const res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await res.text().catch(() => "");
    // Try to parse JSON either way
    let data: any = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { raw: text }; }

    // Audit header (optional)
    const audit = res.headers.get("x-layerzero-findings");
    let findings: unknown = [];
    try {
      findings = audit ? JSON.parse(typeof atob !== "undefined" ? atob(audit) : Buffer.from(audit, "base64").toString("utf8")) : [];
    } catch {
      findings = [];
    }

    if (!res.ok) {
      // Return an error string instead of throwing, so the page can render it
      return { data, findings, error: `(${res.status} ${res.statusText}) ${text?.slice(0, 300)}` };
    }

    return { data, findings };
  } catch (err: any) {
    return { data: {}, findings: [], error: String(err?.message || err) };
  }
}