#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * scripts/test-build-css.js
 *
 * Verifies that the production build emitted by Next.js / Tailwind v4
 * actually includes the compiled Tailwind utility classes and CSS variables.
 * Fails with exit code 1 if Tailwind utilities are missing (e.g. if built with --webpack).
 */

const fs = require('fs');
const path = require('path');

const outNextDir = path.resolve(__dirname, '..', 'out', '_next');

if (!fs.existsSync(outNextDir)) {
  console.error('\n❌ [BUILD-CSS-CHECK ERROR] "out/_next" directory not found.');
  console.error('Please run "npm run build" before checking emitted CSS.\n');
  process.exit(1);
}

function findCssFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findCssFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.css')) {
      results.push(fullPath);
    }
  }
  return results;
}

const cssFiles = findCssFiles(outNextDir);

if (cssFiles.length === 0) {
  console.error('\n❌ [BUILD-CSS-CHECK ERROR] No .css files found under out/_next/');
  console.error('Build did not emit any CSS stylesheet.\n');
  process.exit(1);
}

console.log(`\n🔍 Found ${cssFiles.length} CSS file(s) in out/_next:`);
let combinedCss = '';
let totalBytes = 0;

for (const file of cssFiles) {
  const relPath = path.relative(path.resolve(__dirname, '..'), file);
  const content = fs.readFileSync(file, 'utf8');
  totalBytes += content.length;
  combinedCss += content + '\n';
  console.log(`   - ${relPath} (${(content.length / 1024).toFixed(1)} KB)`);
}

console.log(`   Total CSS payload: ${(totalBytes / 1024).toFixed(1)} KB`);

// 1. Check for Tailwind markers
const hasTwMarker = combinedCss.includes('--tw-') || combinedCss.includes('@layer');
if (!hasTwMarker) {
  console.error('\n❌ [BUILD-CSS-CHECK FAILED] No Tailwind marker found (--tw- or @layer).');
  console.error('Tailwind v4 was NOT compiled into the CSS stylesheet.\n');
  process.exit(1);
}

// 2. Required essential utility classes
const requiredUtilities = [
  '.flex{',
  '.hidden{',
  '.grid{',
  '.fixed{',
  '.relative{',
];

const missingUtilities = [];

for (const util of requiredUtilities) {
  if (!combinedCss.includes(util)) {
    missingUtilities.push(util);
  }
}

if (missingUtilities.length > 0) {
  console.error('\n❌ [BUILD-CSS-CHECK FAILED] Essential Tailwind utilities missing from emitted CSS:');
  for (const missing of missingUtilities) {
    console.error(`   - Missing: "${missing}"`);
  }
  console.error('\nRoot Cause: Tailwind CSS was not processed during build (e.g. Next.js --webpack flag used instead of Turbopack).');
  console.error('Action: Ensure "next build" is used with Turbopack so @tailwindcss/turbopack processes CSS.\n');
  process.exit(1);
}

// Count exact occurrences for reporting
const flexCount = (combinedCss.match(/\.flex\{/g) || []).length;
const gridCount = (combinedCss.match(/\.grid\{/g) || []).length;
const hiddenCount = (combinedCss.match(/\.hidden\{/g) || []).length;
const relativeCount = (combinedCss.match(/\.relative\{/g) || []).length;
const fixedCount = (combinedCss.match(/\.fixed\{/g) || []).length;
const twMarkerCount = (combinedCss.match(/--tw-/g) || []).length;

console.log('\n✅ [BUILD-CSS-CHECK PASSED] All Tailwind v4 markers and utilities verified:');
console.log(`   - Tailwind markers (--tw-): ${twMarkerCount}`);
console.log(`   - .flex{: ${flexCount}`);
console.log(`   - .grid{: ${gridCount}`);
console.log(`   - .hidden{: ${hiddenCount}`);
console.log(`   - .relative{: ${relativeCount}`);
console.log(`   - .fixed{: ${fixedCount}`);
console.log('Production build has fully styled CSS and is ready for deployment!\n');
process.exit(0);
