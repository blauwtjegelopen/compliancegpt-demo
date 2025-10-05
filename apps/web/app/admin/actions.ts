"use server";
export async function routeViaProxy(payload: unknown) {
  const base = process.env.NEXT_PUBLIC_PROXY_URL || "http://localhost:4000";
  const res = await fetch(`${base}/v1/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store"
  });
  const audit = res.headers.get("x-layerzero-findings");
  const findings = audit ? JSON.parse(Buffer.from(audit, "base64").toString("utf8")) : [];
  let data: any = {};
  try { data = await res.json(); } catch {}
  return { data, findings };
}
