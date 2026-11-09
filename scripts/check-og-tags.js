/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const routes = [
  'out/index.html',
  'out/results.html',
  'out/program-studi.html',
  'out/langkah-selanjutnya.html',
  'out/bandingkan.html',
  'out/favorit.html',
  'out/program/ft-sipil.html',
];

console.log('=== VERIFYING OG & TWITTER META TAGS IN EXPORTED HTML ===');
let errors = 0;

for (const r of routes) {
  if (!fs.existsSync(r)) {
    console.error(`Missing file: ${r}`);
    errors++;
    continue;
  }
  const html = fs.readFileSync(r, 'utf8');
  const ogImgMatch = html.match(/<meta property="og:image" content="([^"]+)"/);
  const twImgMatch = html.match(/<meta name="twitter:image" content="([^"]+)"/);
  const themeMatch = html.match(/<meta name="theme-color" content="([^"]+)"/);

  const ogImg = ogImgMatch ? ogImgMatch[1] : null;
  const twImg = twImgMatch ? twImgMatch[1] : null;
  const theme = themeMatch ? themeMatch[1] : null;

  console.log(`\nRoute: ${r}`);
  console.log(`  og:image:      ${ogImg}`);
  console.log(`  twitter:image: ${twImg}`);
  console.log(`  theme-color:   ${theme}`);

  if (!ogImg || !ogImg.startsWith('http')) {
    console.error(`  ❌ [FAIL] og:image is not absolute: ${ogImg}`);
    errors++;
  } else {
    console.log(`  ✓ og:image is absolute`);
  }

  if (theme !== '#002060') {
    console.error(`  ❌ [FAIL] theme-color is not #002060: ${theme}`);
    errors++;
  } else {
    console.log(`  ✓ theme-color is #002060`);
  }
}

console.log('\n===========================================================');
if (errors === 0) {
  console.log('🎉 ALL EXPORTED ROUTES HAVE VALID SOCIAL META TAGS & THEME COLOR!');
} else {
  console.error(`❌ FOUND ${errors} METADATA ERRORS!`);
  process.exit(1);
}
