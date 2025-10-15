// apps/web/lib/proxy.ts
export async function routeViaProxy(payload: any) {
  const isBrowser = typeof window !== "undefined";
  const base =
    // Allow override
    process.env.NEXT_PUBLIC_PROXY_URL ||
    // On Netlify, use the function route
    "/.netlify/functions/layerzero-proxy";

  const devBase =
    process.env.NEXT_PUBLIC_DEV_PROXY ||
    "http://127.0.0.1:4000/v1/chat/completions"; // your local proxy if running

  const endpoint =
    process.env.NODE_ENV === "development" ? devBase : base;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    // Normalize a bit so your UI can read consistently
    return {
      ok: res.ok,
      data: data?.data ?? data,
      findings: data?.findings, // if your proxy adds it
      error: !res.ok ? (data?.error || `HTTP ${res.status}`) : undefined,
    };
  } catch (e: any) {
    return {
      ok: false,
      error: e?.message || "fetch failed",
    };
  }
}