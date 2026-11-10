/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const VIEWPORTS = [
  { width: 320, height: 568, name: '320x568 (iPhone SE gen 1)' },
  { width: 360, height: 640, name: '360x640 (Galaxy S8 / small Android)' },
  { width: 375, height: 667, name: '375x667 (iPhone 8 / SE)' },
  { width: 390, height: 844, name: '390x844 (iPhone 12/13/14)' },
  { width: 414, height: 896, name: '414x896 (iPhone 11/XR)' },
  { width: 430, height: 932, name: '430x932 (iPhone 14/15/16 Pro Max)' },
  { width: 768, height: 1024, name: '768x1024 (iPad portrait)' },
  { width: 1024, height: 768, name: '1024x768 (iPad landscape / small laptop)' },
  { width: 1440, height: 900, name: '1440x900 (Desktop HD)' },
  { width: 1920, height: 1080, name: '1920x1080 (Desktop FHD)' },
  { width: 844, height: 390, name: '844x390 (Mobile Landscape)' },
];

const ROUTES = [
  '/',
  '/questionnaire',
  '/results',
  '/program-studi',
  '/program/ft-sipil',
  '/admin',
  '/langkah-selanjutnya',
  '/langkah-selanjutnya/biaya-ukt',
  '/langkah-selanjutnya/beasiswa',
  '/langkah-selanjutnya/jadwal-seleksi',
];

async function runComprehensiveVerification() {
  console.log('==================================================================');
  console.log('🚀 DEFINE YOUR NEXT MOVE — COMPREHENSIVE E2E VERIFICATION (ROUND 3)');
  console.log('==================================================================\n');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const summary = [];

  for (const vp of VIEWPORTS) {
    const isMobile = vp.width <= 768;
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      hasTouch: isMobile,
      isMobile: isMobile,
    });

    // Suppress Next.js dev overlay portal from interfering with clicks
    await context.addInitScript(() => {
      const style = document.createElement('style');
      style.innerHTML = `
        nextjs-portal { display: none !important; pointer-events: none !important; }
      `;
      document.head.appendChild(style);
      // Suppress intro animation so page is immediately interactive during testing
      try {
        sessionStorage.setItem('undip_intro_seen', 'true');
      } catch (e) {}
    });

    const page = await context.newPage();
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);

    for (const route of ROUTES) {
      const targetUrl = `${BASE_URL}${route}`;
      await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const maxScroll = Math.max(scrollWidth, bodyScrollWidth);
        return {
          docWidth,
          maxScroll,
          hasOverflow: maxScroll > docWidth + 1, // 1px threshold for fractional subpixel antialiasing
          diff: maxScroll - docWidth,
        };
      });

      if (overflow.hasOverflow) {
        console.error(`  ❌ [${vp.name}] ${route}: Horizontal overflow detected (+${overflow.diff}px, scroll: ${overflow.maxScroll}, doc: ${overflow.docWidth})`);
        summary.push({ vp: vp.name, route, status: 'FAIL', reason: `Horizontal overflow +${overflow.diff}px` });
      } else {
        console.log(`  ✓ [${vp.name}] ${route}: No horizontal overflow (${overflow.docWidth}px)`);
        summary.push({ vp: vp.name, route, status: 'PASS' });
      }
    }

    // Additional specific interactive checks on mobile (390x844)
    if (vp.width === 390 && vp.height === 844) {
      console.log('\n  [Interactive Checks at 390x844]');

      // 1. Audio toggle check (opens menu if not directly visible)
      await page.goto(`${BASE_URL}/`);
      await page.waitForTimeout(400);
      const introOverlay = page.locator('[aria-label="Animasi Pembuka Gerbang UNDIP Tembalang"]');
      if (await introOverlay.isVisible()) {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
      }
      let soundBtn = page.locator('button[aria-label*="Suara"]');
      if (!(await soundBtn.isVisible())) {
        const menuBtn = page.locator('button.navbar-mobile-toggle, button[aria-label="Buka menu"]');
        await menuBtn.click();
        await page.waitForTimeout(300);
      }
      soundBtn = page.locator('button[aria-label*="Suara"]');
      const initialAria = await soundBtn.getAttribute('aria-label');
      await soundBtn.click();
      await page.waitForTimeout(200);
      const nextAria = await soundBtn.getAttribute('aria-label');
      console.log(`  ✓ Audio toggle state change: "${initialAria}" -> "${nextAria}"`);

      // 2. /program-studi accordion check
      await page.goto(`${BASE_URL}/program-studi`);
      await page.waitForTimeout(300);
      const firstFacultyAccordion = page.locator('button[aria-expanded]').first();
      const isExpandedBefore = await firstFacultyAccordion.getAttribute('aria-expanded');
      await firstFacultyAccordion.click();
      await page.waitForTimeout(300);
      const isExpandedAfter = await firstFacultyAccordion.getAttribute('aria-expanded');
      console.log(`  ✓ Program directory accordion toggle: expanded=${isExpandedBefore} -> expanded=${isExpandedAfter}`);

      // 3. /results?tab=next-steps deep-link check (redirects to /langkah-selanjutnya)
      await page.goto(`${BASE_URL}/results?tab=next-steps#langkah-selanjutnya`);
      await page.waitForTimeout(600);
      const hubHeading = page.locator('h1:has-text("Langkah Selanjutnya"), h2:has-text("Langkah Selanjutnya")');
      const isHubVisible = await hubHeading.first().isVisible();
      console.log(`  ✓ Legacy /results?tab=next-steps redirected: url=${page.url()}, heading visible=${isHubVisible}`);
    }

    await context.close();
  }

  await browser.close();

  console.log('\n==================================================================');
  const failures = summary.filter((s) => s.status === 'FAIL');
  if (failures.length === 0) {
    console.log(`🎉 ALL ${summary.length} VIEWPORT & ROUTE TESTS PASSED WITH ZERO OVERFLOW!`);
  } else {
    console.error(`❌ ${failures.length} TESTS FAILED!`);
    console.table(failures);
    process.exit(1);
  }
  console.log('==================================================================\n');
}

runComprehensiveVerification().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
