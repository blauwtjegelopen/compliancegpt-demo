#!/usr/bin/env bash
set -euo pipefail

echo "→ Ensuring we're in the project root (looking for package.json)…"
if [[ ! -f package.json ]]; then
  echo "❌ package.json not found. Run this from your Next.js project root."
  exit 1
fi

echo "→ Creating vercel.json…"
cat > vercel.json <<'JSON'
{
  "version": 2,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "0" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
      ]
    },
    {
      "source": "/_next/static/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*\\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2?))",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
JSON

echo "→ Creating GitHub Actions workflow…"
mkdir -p .github/workflows
cat > .github/workflows/ci.yml <<'YAML'
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Use Node.js 20.x
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint --if-present

      - name: Type check
        run: npm run type-check --if-present

      - name: Build
        run: npm run build
YAML

echo "→ Backing up package.json…"
cp package.json package.json.bak

echo "→ Ensuring scripts in package.json…"
ensure_with_jq() {
  jq '
    .scripts = (.scripts // {}) |
    .scripts["lint"] = (.scripts["lint"] // "next lint") |
    .scripts["type-check"] = (.scripts["type-check"] // "tsc --noEmit") |
    .scripts["build"] = (.scripts["build"] // "next build") |
    .scripts["dev"] = (.scripts["dev"] // "next dev") |
    .scripts["start"] = (.scripts["start"] // "next start")
  ' package.json > package.json.tmp && mv package.json.tmp package.json
}

ensure_with_node() {
  node -e '
    const fs = require("fs");
    const p = JSON.parse(fs.readFileSync("package.json","utf8"));
    p.scripts = p.scripts || {};
    p.scripts["lint"] = p.scripts["lint"] || "next lint";
    p.scripts["type-check"] = p.scripts["type-check"] || "tsc --noEmit";
    p.scripts["build"] = p.scripts["build"] || "next build";
    p.scripts["dev"] = p.scripts["dev"] || "next dev";
    p.scripts["start"] = p.scripts["start"] || "next start";
    fs.writeFileSync("package.json", JSON.stringify(p, null, 2) + "\n");
  '
}

if command -v jq >/dev/null 2>&1; then
  ensure_with_jq
else
  echo "  jq not found; using Node fallback."
  ensure_with_node
fi

echo "✅ Done."
echo
echo "Next:"
echo "  git add vercel.json .github/workflows/ci.yml package.json package.json.bak"
echo '  git commit -m "chore: add vercel headers, caching, and CI; ensure scripts"'
echo "  git push"