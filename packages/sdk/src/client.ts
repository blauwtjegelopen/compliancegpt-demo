export async function completeChat(payload: unknown, base = process.env.NEXT_PUBLIC_PROXY_URL) {
  const res = await fetch(`${base}/v1/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  const audit = res.headers.get("x-layerzero-findings");
  let findings: unknown = [];
  try {
    findings = audit ? JSON.parse(Buffer.from(audit, "base64").toString("utf8")) : [];
  } catch {}
  return { data: await res.json().catch(() => ({})), findings };
}
