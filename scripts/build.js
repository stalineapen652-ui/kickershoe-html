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
