import fs from 'node:fs';

const file = 'app/layout.tsx';
if (!fs.existsSync(file)) {
  console.error(`❌ ${file} not found`);
  process.exit(1);
}

let src = fs.readFileSync(file, 'utf8');
const original = src;

// 1) Remove ANY raw <header> ... </header> blocks.
src = src.replace(/<header\b[\s\S]*?<\/header>/g, '');

// 2) Remove ALL existing <Navbar ... /> (we'll reinsert a single one).
src = src.replace(/<Navbar\b[^>]*\/>\s*/g, '');

// 3) Ensure import exists once (add at top if missing).
if (!/from ["']@\/components\/Navbar["']/.test(src)) {
  src = `import Navbar from "@/components/Navbar";\n` + src;
}

// 4) Insert a single <Navbar /> right after the opening <body ...>
if (/<body[^>]*>/.test(src)) {
  src = src.replace(/<body[^>]*>/, (m) => `${m}\n      <Navbar />`);
}

// 5) De-dupe just in case (collapse multiples to one).
src = src.replace(/(?:<Navbar\b[^>]*\/>\s*){2,}/g, '<Navbar />');

// 6) Light tidy: collapse >2 blank lines to max 2.
src = src.replace(/\n{3,}/g, '\n\n');

if (src !== original) {
  fs.writeFileSync(file, src, 'utf8');
  console.log('✅ Updated app/layout.tsx');
} else {
  console.log('ℹ️ No changes made (already clean).');
}
