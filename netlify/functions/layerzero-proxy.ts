// netlify/functions/layerzero-proxy.ts
import type { Handler } from "@netlify/functions";

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const json = (status: number, body: any) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

/** Simple mock builder to keep the demo usable */
function buildMock(messages: ChatMessage[]) {
  const lastUser =
    [...messages].reverse().find((m) => m.role === "user")?.content ?? "";
  const findings = { mocked: true, reason: "quota_or_mock", provider: "mock" };

  return {
    ok: true,
    mock: true,
    note:
      "Using mock response (OpenAI quota exceeded or mock forced). This keeps the demo working.",
    findings,
    data: {
      // Shape your frontend already understands
      content: `Demo response (mock): Processed your prompt:\n\n${lastUser.slice(
        0,
        2000
      )}`,
    },
  };
}

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return json(405, { error: "Method not allowed" });
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const messages: ChatMessage[] = body?.messages ?? [];

    const FORCE_MOCK = process.env.LZ_PROXY_FORCE_MOCK === "1";
    if (FORCE_MOCK) {
      return json(200, buildMock(messages));
    }

    // If you have a custom proxy, forward there; otherwise call OpenAI directly
    const PROXY_URL = process.env.LZ_PROXY_URL;
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

    if (!PROXY_URL && !OPENAI_API_KEY) {
      // No upstream available → mock for demo
      return json(200, buildMock(messages));
    }

    if (PROXY_URL) {
      // Forward to your own proxy (it should return JSON)
      const r = await fetch(PROXY_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages }),
      });

      if (!r.ok) {
        // Try to parse error payload
        let errText = await r.text();
        // Fallback to mock (keeps demo working)
        return json(200, {
          ...buildMock(messages),
          error: "Upstream proxy unreachable",
          detail: errText.slice(0, 500),
        });
      }

      const data = await r.json();
      return json(200, { ok: true, findings: data.findings ?? null, data: data.data ?? data });
    }

    // Direct OpenAI call
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.2,
      }),
    });

    const payload = await r.json();

    if (!r.ok) {
      // If it’s the quota error, fall back to mock
      const code =
        payload?.error?.code || payload?.error?.type || String(r.status);
      if (code === "insufficient_quota" || r.status === 429 || r.status === 402) {
        return json(200, {
          ...buildMock(messages),
          upstream_error: payload?.error || { message: "insufficient_quota" },
        });
      }
      // Other upstream errors → pass through with mock fallback info
      return json(200, {
        ...buildMock(messages),
        upstream_error: payload?.error || { status: r.status },
      });
    }

    // Normal success
    const content =
      payload?.choices?.[0]?.message?.content ??
      payload?.data?.choices?.[0]?.message?.content ??
      "";

    return json(200, {
      ok: true,
      findings: null,
      data: { content },
    });
  } catch (e: any) {
    // Total failure → mock
    return json(200, {
      ...buildMock([]),
      error: "Function error",
      detail: e?.message ?? String(e),
    });
  }
};