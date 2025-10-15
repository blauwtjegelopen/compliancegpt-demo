// netlify/functions/layerzero-proxy.ts
import type { Handler } from "@netlify/functions";

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "access-control-allow-origin": "*",           // simple CORS (you can lock this down later)
  "access-control-allow-methods": "POST, OPTIONS",
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: JSON_HEADERS, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: JSON_HEADERS,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    // 1) Choose an upstream
    // - Use your own proxy URL if you have one (LayerZero proxy)
    // - Or call OpenAI/Azure directly (example below calls OpenAI)
    const upstream =
      process.env.LZ_PROXY_URL ||
      "https://api.openai.com/v1/chat/completions"; // default to OpenAI

    // 2) Build request to upstream
    // If using OpenAI directly, you need OPENAI_API_KEY set in Netlify env.
    const headers: Record<string, string> = {
      "content-type": "application/json",
    };
    if (process.env.OPENAI_API_KEY) {
      headers.authorization = `Bearer ${process.env.OPENAI_API_KEY}`;
    }
    // Minimal body defaults if user only sends {messages:[...]}
    const payload =
      body && body.messages
        ? {
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: body.messages,
            temperature: 0.2,
          }
        : body;

    const res = await fetch(upstream, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    // Try JSON first, but return text if upstream sent text
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = { text };
    }

    if (!res.ok) {
      return {
        statusCode: res.status,
        headers: JSON_HEADERS,
        body: JSON.stringify({
          error: "Upstream error",
          status: res.status,
          upstream,
          data,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify({ ok: true, data }),
    };
  } catch (e: any) {
    return {
      statusCode: 502,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        error: "Could not reach upstream",
        detail: e?.message || String(e),
      }),
    };
  }
};