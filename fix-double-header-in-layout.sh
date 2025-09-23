set -euo pipefail

LAYOUT="app/layout.tsx"

if [ ! -f "$LAYOUT" ]; then
  echo "❌ $LAYOUT not found"; exit 1
fi

# macOS vs GNU sed
if sed --version >/dev/null 2>&1; then SEDI=(-i); else SEDI=(-i ''); fi

cp "$LAYOUT" "$LAYOUT.bak"

# 1) Remove ANY raw <header>...</header> blocks (even if there are multiple)
perl -0777 -pe 's/<header\b[\s\S]*?<\/header>//g' -i "$LAYOUT"

# 2) Remove duplicate <Navbar /> usages if they exist (keep none for now)
sed "${SEDI[@]}" -e 's/<Navbar\s*\/>\s*//g' "$LAYOUT"

# 3) Ensure Navbar import exists once
grep -q 'from "@/components/Navbar"' "$LAYOUT" || sed "${SEDI[@]}" '1s;^;import Navbar from "@/components/Navbar";\n;' "$LAYOUT"

# 4) Insert a single <Navbar /> right after the opening <body ...>
perl -0777 -pe 's/(<body[^>]*>)/$1\n      <Navbar \/>/s' -i "$LAYOUT"

# 5) Deduplicate in case of weird merges: collapse multiple Navbar to one
perl -0777 -pe 's/(<Navbar\s*\/>\s*){2,}/<Navbar \/>/g' -i "$LAYOUT"

# 6) Small tidy: collapse extra blank lines
awk 'BEGIN{b=0} { if ($0 ~ /^[[:space:]]*$/) { if(!b){print} b=1 } else { print; b=0 } }' "$LAYOUT" > "$LAYOUT.tmp" && mv "$LAYOUT.tmp" "$LAYOUT"

echo "✅ Fixed. A backup is at $LAYOUT.bak"
echo "→ Confirm now:"
echo "   grep -n '<header' $LAYOUT || echo 'OK: no raw <header> in layout'"
echo "   grep -n '<Navbar' $LAYOUT"
