#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * scripts/smoke-live.js
 *
 * Smoke tests a live deployed URL (e.g. on Vercel) against the same
 * render assertions as test-prod-render.js:
 * - Header height <= 80px
 * - No horizontal overflow
 * - Non-serif typography
 * - No navbar collision
 * - No console errors or broken assets
 *
 * Usage:
 *   node scripts/smoke-live.js [https://roadshow-2027.vercel.app]
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const TARGET_URL = (process.argv[2] || 'https://roadshow-2027.vercel.app').replace(/\/$/, '');

const VIEWPORTS = [
  {
    name: 'mobile-390x844',
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  {
    name: 'desktop-1440x900',
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
];

const ROUTES = [
  { path: '/', slug: 'home' },
  { path: '/program-studi', slug: 'program-studi' },
  { path: '/results', slug: 'results' },
  { path: '/questionnaire', slug: 'questionnaire' },
  { path: '/admin', slug: 'admin' },
  { path: '/offline', slug: 'offline' },
  { path: '/program/ft-sipil', slug: 'program-ft-sipil' },
];

const ARTIFACTS_DIR = path.resolve(__dirname, '..', 'test-artifacts', 'live');

async function runLiveSmokeTests() {
  console.log('\n==================================================================');
  console.log(`🌐 DEFINE YOUR NEXT MOVE — LIVE DEPLOY SMOKE TEST`);
  console.log(`Target URL: ${TARGET_URL}`);
  console.log('==================================================================\n');

  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  let totalAssertions = 0;
  let failures = [];

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n📱 Viewport: ${vp.name} (${vp.width}x${vp.height})`);

      for (const route of ROUTES) {
        process.stdout.write(`  Testing ${route.path.padEnd(24)} ... `);
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: vp.deviceScaleFactor,
          isMobile: vp.isMobile,
          hasTouch: vp.hasTouch,
        });

        await context.addInitScript(() => {
          try {
            sessionStorage.setItem('undip_intro_seen', 'true');
          } catch {}
        });

        const page = await context.newPage();
        const pageErrors = [];
        const consoleErrors = [];
        const failedRequests = [];

        page.on('pageerror', (err) => pageErrors.push(err.message));
        page.on('console', (msg) => {
          if (msg.type() === 'error') consoleErrors.push(msg.text());
        });
        page.on('response', (res) => {
          const resUrl = res.url();
          if (resUrl.startsWith(TARGET_URL) && res.status() >= 400) {
            failedRequests.push(`${res.status()} ${resUrl}`);
          }
        });

        try {
          const target = `${TARGET_URL}${route.path}`;
          await page.goto(target, { waitUntil: 'networkidle', timeout: 30000 });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForTimeout(300);

          const screenshotPath = path.join(ARTIFACTS_DIR, `${route.slug}-${vp.name}.png`);
          await page.screenshot({ path: screenshotPath, fullPage: false });

          const checks = await page.evaluate(() => {
            const header = document.querySelector('header');
            const headerHeight = header ? header.getBoundingClientRect().height : null;
            const scrollWidth = document.documentElement.scrollWidth;
            const clientWidth = document.documentElement.clientWidth;
            const hasHorizontalOverflow = scrollWidth > clientWidth;
            const bodyStyle = window.getComputedStyle(document.body);
            const fontFamily = bodyStyle.fontFamily || '';

            const brandText = document.querySelector('[data-testid="navbar-brand-text"]');
            let brandTruncated = false;
            if (brandText) {
              const textNodes = Array.from(brandText.querySelectorAll('span, p')).filter((el) => {
                const s = window.getComputedStyle(el);
                return s.display !== 'none' && s.visibility !== 'hidden' && el.offsetWidth > 0;
              });
              brandTruncated = textNodes.some((el) => el.scrollWidth > el.clientWidth + 1);
            }

            const collisions = [];
            if (header) {
              const items = Array.from(header.querySelectorAll('a, button')).filter((el) => {
                const r = el.getBoundingClientRect();
                const s = window.getComputedStyle(el);
                return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
              });

              for (let i = 0; i < items.length; i++) {
                for (let j = i + 1; j < items.length; j++) {
                  const r1 = items[i].getBoundingClientRect();
                  const r2 = items[j].getBoundingClientRect();
                  const overlapX = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
                  const overlapY = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
                  if (overlapX > 1 && overlapY > 1) {
                    collisions.push({
                      item1: items[i].getAttribute('aria-label') || items[i].textContent?.trim().slice(0, 20),
                      item2: items[j].getAttribute('aria-label') || items[j].textContent?.trim().slice(0, 20),
                    });
                  }
                }
              }
            }

            return { headerHeight, hasHorizontalOverflow, fontFamily, brandTruncated, collisions };
          });

          totalAssertions++;
          if (checks.headerHeight !== null && checks.headerHeight > 80) {
            failures.push(`[${vp.name} ${route.path}] Header height ${checks.headerHeight}px > 80px`);
          }

          totalAssertions++;
          if (checks.hasHorizontalOverflow) {
            failures.push(`[${vp.name} ${route.path}] Horizontal overflow detected!`);
          }

          totalAssertions++;
          const fontLower = checks.fontFamily.toLowerCase();
          const isBareSerif =
            (fontLower.includes('times') || fontLower.includes('serif')) &&
            !fontLower.includes('sans-serif') &&
            !fontLower.includes('geist') &&
            !fontLower.includes('silkscreen');
          if (isBareSerif) {
            failures.push(`[${vp.name} ${route.path}] Body font is bare serif: "${checks.fontFamily}"`);
          }

          totalAssertions++;
          if (checks.brandTruncated) {
            failures.push(`[${vp.name} ${route.path}] Brand text truncated!`);
          }

          totalAssertions++;
          if (checks.collisions.length > 0) {
            failures.push(`[${vp.name} ${route.path}] Header collisions: ${JSON.stringify(checks.collisions)}`);
          }

          totalAssertions++;
          if (pageErrors.length > 0) failures.push(`[${vp.name} ${route.path}] Page error: ${pageErrors.join(', ')}`);
          totalAssertions++;
          if (consoleErrors.length > 0) failures.push(`[${vp.name} ${route.path}] Console error: ${consoleErrors.join(', ')}`);
          totalAssertions++;
          if (failedRequests.length > 0) failures.push(`[${vp.name} ${route.path}] Failed request: ${failedRequests.join(', ')}`);

          console.log('✓ PASS');
        } catch (err) {
          failures.push(`[${vp.name} ${route.path}] Navigation error: ${err.message}`);
          console.log('❌ FAIL');
        } finally {
          await context.close();
        }
      }
    }
  } finally {
    await browser.close();
  }

  console.log('\n==================================================================');
  if (failures.length === 0) {
    console.log(`🎉 ALL ${totalAssertions} LIVE SMOKE ASSERTIONS PASSED!`);
    console.log('==================================================================\n');
    process.exit(0);
  } else {
    console.error(`❌ ${failures.length} LIVE ASSERTIONS FAILED:`);
    failures.forEach((f) => console.error(`  - ${f}`));
    console.log('==================================================================\n');
    process.exit(1);
  }
}

runLiveSmokeTests().catch((err) => {
  console.error('Fatal live smoke test error:', err);
  process.exit(1);
});
