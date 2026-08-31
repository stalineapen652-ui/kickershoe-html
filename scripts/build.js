// Builds the deployable site into dist/ — copies only what the live site
// actually needs (HTML, styles.css minified, robots.txt, sitemap.xml,
// assets/) and vendors the Speed Insights bundle. Everything NOT copied
// here (docs/, README.md, package.json, scripts/, .claude/, node_modules)
// simply never exists in dist/, so Vercel — which serves outputDirectory
// "dist" per vercel.json — never has it to serve. The repo root itself is
// untouched; `npm run dev` still serves it directly for local preview.
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const dist = path.join(root, 'dist');

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });

const topLevelFiles = [
  '404.html', 'about.html', 'index.html',
  'issue-001.html', 'issue-002.html', 'issue-003.html', 'issue-004.html',
  'robots.txt', 'sitemap.xml', 'favicon.ico',
];
for (const file of topLevelFiles) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}
console.log(`Copied ${topLevelFiles.length} top-level files -> dist/`);

// Minify styles.css into dist/ — a plain regex pass (strip comments,
// collapse whitespace, trim around structural punctuation) rather than a
// full parser: it never touches whitespace around +/-, which calc()
// requires on both sides to stay valid, and this file has no non-empty
// quoted content: strings it could mangle. The repo's own styles.css is
// untouched; this only ever writes to dist/.
const rawCss = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const minifiedCss = rawCss
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{}:;,])\s*/g, '$1')
  .replace(/;}/g, '}')
  .trim();
fs.writeFileSync(path.join(dist, 'styles.css'), minifiedCss);
console.log(`Minified styles.css -> dist/styles.css (${rawCss.length} -> ${minifiedCss.length} bytes)`);

// Copy assets/ recursively (icons, images, logo, js/speed-insights-init.js).
function copyDir(src, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
copyDir(path.join(root, 'assets'), path.join(dist, 'assets'));
console.log('Copied assets/ -> dist/assets/');

// Vendor the @vercel/speed-insights browser bundle so the site can load it
// as a plain <script type="module"> with no bundler. Copied to both dist/
// (what ships) and the source assets/js/ (git-ignored) so `npm run dev`,
// which serves the repo root directly without a build, can also resolve
// speed-insights-init.js's relative import of it.
const speedInsightsSrc = path.join(root, 'node_modules', '@vercel', 'speed-insights', 'dist', 'index.mjs');
fs.copyFileSync(speedInsightsSrc, path.join(dist, 'assets', 'js', 'speed-insights.mjs'));
fs.mkdirSync(path.join(root, 'assets', 'js'), { recursive: true });
fs.copyFileSync(speedInsightsSrc, path.join(root, 'assets', 'js', 'speed-insights.mjs'));
console.log('Vendored @vercel/speed-insights -> dist/assets/js/ and assets/js/');
