// Vendors the @vercel/speed-insights and @vercel/analytics browser bundles
// into assets/js so the site can load them as plain <script type="module">
// with no bundler.
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'assets', 'js');
fs.mkdirSync(outDir, { recursive: true });

// Vendor Speed Insights
const speedInsightsSrc = path.join(__dirname, '..', 'node_modules', '@vercel', 'speed-insights', 'dist', 'index.mjs');
const speedInsightsDest = path.join(outDir, 'speed-insights.mjs');
fs.copyFileSync(speedInsightsSrc, speedInsightsDest);
console.log('Vendored @vercel/speed-insights ->', path.relative(process.cwd(), speedInsightsDest));

// Vendor Web Analytics
const analyticsSrc = path.join(__dirname, '..', 'node_modules', '@vercel', 'analytics', 'dist', 'index.mjs');
const analyticsDest = path.join(outDir, 'analytics.mjs');
fs.copyFileSync(analyticsSrc, analyticsDest);
console.log('Vendored @vercel/analytics ->', path.relative(process.cwd(), analyticsDest));
