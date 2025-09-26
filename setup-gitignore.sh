#!/bin/bash
set -e

echo "→ Ensuring we're in the project root (looking for package.json)…"
if [ ! -f package.json ]; then
  echo "✖ No package.json found. Run this script from the project root."
  exit 1
fi

# Backup existing .gitignore if it exists
if [ -f .gitignore ]; then
  echo "→ Backing up existing .gitignore to .gitignore.bak"
  cp .gitignore .gitignore.bak
fi

echo "→ Writing .gitignore rules…"
cat > .gitignore <<'EOF'
# Node dependencies
node_modules/

# Next.js build outputs
.next/
out/
dist/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env.local
.env.development.local
.env.test.local
.env.production.local

# Backup / editor files
*.bak
.DS_Store

# Vercel local settings
.vercel/
EOF

echo "✅ .gitignore created/updated!"
echo ""
echo "Next:"
echo "  git add .gitignore"
echo "  git commit -m 'chore: update .gitignore'"
echo "  git push"