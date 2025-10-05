// apps/web/app/api/proxy/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE = "http://127.0.0.1:4000"; // force IPv4 to match proxy bind

function withTimeout(init: RequestInit, timeoutMs = 4000) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  return { init: { ...init, signal: ac.signal }, cleanup: () => clearTimeout(t) };
}

export async function GET() {
  const { init, cleanup } = withTimeout({ method: "GET" });
  try {
    const r = await fetch(`${BASE}/healthz`, init);
    const txt = await r.text();
    return new Response(txt, { status: r.status, headers: { "content-type": "application/json" } });
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: "proxy health unreachable", target: `${BASE}/healthz`, detail: String(e?.message || e) }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  } finally {
    cleanup();
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const { init, cleanup } = withTimeout({
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
  try {
    const up = await fetch(`${BASE}/v1/chat/completions`, init);
    const text = await up.text();
    const audit = up.headers.get("x-layerzero-findings") ?? "";
    return new Response(text, {
      status: up.status,
      headers: {
        "content-type": "application/json",
        "x-layerzero-findings": audit,
        "access-control-expose-headers": "x-layerzero-findings",
      },
    });
  } catch (e: any) {
    return new Response(
      JSON.stringify({
        error: "Could not reach LayerZero proxy",
        target: `${BASE}/v1/chat/completions`,
        detail: String(e?.message || e),
      }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  } finally {
    cleanup();
  }
}