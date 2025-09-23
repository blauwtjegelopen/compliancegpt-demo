set -euo pipefail

# choose sed (GNU vs macOS)
if sed --version >/dev/null 2>&1; then
  SED_INPLACE=(-i)
else
  SED_INPLACE=(-i '')
fi

# 1) Ensure layout owns Navbar/Footer just once
if [ -f app/layout.tsx ]; then
  # remove any inline <header>/<footer> tags from layout (we'll keep components instead)
  perl -0777 -pe 's/<header\b[\s\S]*?<\/header>//g; s/<footer\b[\s\S]*?<\/footer>//g' -i app/layout.tsx || true

  # make sure Navbar/Footer components are used once
  grep -q "@/components/Navbar" app/layout.tsx || sed "${SED_INPLACE[@]}" '1s;^;import Navbar from "@/components/Navbar";\n;' app/layout.tsx
  grep -q "@/components/Footer" app/layout.tsx || sed "${SED_INPLACE[@]}" '1s;^;import Footer from "@/components/Footer";\n;' app/layout.tsx

  # inject <Navbar /> right after <body ...> and <Footer /> before </body>
  perl -0777 -pe '
    s/(<body[^>]*>)/$1\n      <Navbar \/>/s;
    s/<\/main>\s*<\/body>/<\/main>\n      <Footer \/>\n    <\/body>/s;
  ' -i app/layout.tsx || true
fi

# 2) Remove ANY inline <header> / <footer> from page files and drop Navbar/Footer component usage there
TARGETS=$(ls app/*/page.tsx 2>/dev/null; echo app/page.tsx)
for f in $TARGETS; do
  [ -f "$f" ] || continue
  cp "$f" "$f.bak"

  # strip raw <header>...</header> and <footer>...</footer> blocks
  perl -0777 -pe 's/<header\b[\s\S]*?<\/header>//g; s/<footer\b[\s\S]*?<\/footer>//g' -i "$f" || true

  # remove Navbar/Footer imports if present
  sed "${SED_INPLACE[@]}" \
    -e '/from.*@\/components\/Navbar/d' \
    -e '/from.*@\/components\/Footer/d' \
    "$f"

  # remove component usage if present
  sed "${SED_INPLACE[@]}" \
    -e 's/<Navbar[[:space:]]*\/>//g' \
    -e 's/<Footer[[:space:]]*\/>//g' \
    "$f"

  # collapse extra blank lines
  awk 'BEGIN{b=0} { if ($0 ~ /^[[:space:]]*$/) { if(!b){print} b=1 } else { print; b=0 } }' "$f" > "$f.tmp" && mv "$f.tmp" "$f"
done

echo "→ Done. Backups created as *.bak. Your dev server should hot-reload."
