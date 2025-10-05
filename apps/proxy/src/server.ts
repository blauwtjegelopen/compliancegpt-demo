import fastify from "fastify";
import fetch from "node-fetch";
import { sanitize } from "@policy/engine/src/index";
import { DefaultPolicy } from "@policy/engine/src/policies/default";
import cors from "@fastify/cors";

const app = fastify({ logger: true });

// CORS: allow common dev origins (localhost/127.0.0.1/0.0.0.0:3000) and no-origin (curl/Postman)
app.register(cors, {
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    const ok = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0):3000$/i.test(origin);
    cb(null, ok);
  },
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["content-type", "authorization"],
  exposedHeaders: ["x-layerzero-findings"],
});

app.post("/v1/chat/completions", async (req, reply) => {
  const body: any = req.body ?? {};
  const raw = JSON.stringify(body);

  // sanitize before forwarding
  const { output, findings } = sanitize(raw, DefaultPolicy);

  // attempt upstream; fallback to mock echo if it fails
  const forwardUrl = process.env.PROVIDER_URL ?? "http://localhost:4010/echo";
  let data: any = {};
  try {
    const upstream = await fetch(forwardUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: output,
    });
    // if upstream returns non-2xx, treat as failure to keep UX simple
    if (!upstream.ok) throw new Error(`${upstream.status} ${upstream.statusText}`);
    data = await upstream.json().catch(() => ({}));
  } catch (e) {
    // fallback mock response so the UI can proceed
    data = {
      ok: true,
      mock: true,
      note: `Upstream unreachable at ${forwardUrl}. Returning echo payload.`,
      echo: JSON.parse(output || "{}"),
      error: String((e as Error).message || e),
    };
  }

  // expose findings header for the browser
  reply
    .header("x-layerzero-findings", Buffer.from(JSON.stringify(findings)).toString("base64"))
    .header("access-control-expose-headers", "x-layerzero-findings");

  return reply.send(data);
});

app.get("/healthz", async () => ({ ok: true }));

app
  .listen({ port: Number(process.env.PORT ?? 4000), host: "0.0.0.0" })
  .then((addr) => app.log.info(`proxy up on ${addr}`))
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });