// Vendors the @vercel/speed-insights browser bundle into assets/js so the
// site can load it as a plain <script type="module"> with no bundler.
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'node_modules', '@vercel', 'speed-insights', 'dist', 'index.mjs');
const outDir = path.join(__dirname, '..', 'assets', 'js');
const dest = path.join(outDir, 'speed-insights.mjs');

fs.mkdirSync(outDir, { recursive: true });
fs.copyFileSync(src, dest);
console.log('Vendored @vercel/speed-insights ->', path.relative(process.cwd(), dest));

// Minifies styles.css in place, in this build checkout only — the repo's
// own copy stays commented/formatted for development. Deliberately a plain
// regex pass (strip comments, collapse whitespace, trim around structural
// punctuation) rather than a full parser: it never touches whitespace
// around +/-/* /, which calc() requires on both sides to stay valid, and
// this file has no non-empty quoted content: strings it could mangle.
const cssPath = path.join(__dirname, '..', 'styles.css');
const rawCss = fs.readFileSync(cssPath, 'utf8');
const minifiedCss = rawCss
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim();
fs.writeFileSync(cssPath, minifiedCss);
console.log(`Minified styles.css -> ${rawCss.length} -> ${minifiedCss.length} bytes`);
