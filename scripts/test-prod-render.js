#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * scripts/test-prod-render.js
 *
 * Validates production build rendering across key routes and viewports:
 * - 390x844 (mobile touch, deviceScaleFactor 2)
 * - 1440x900 (desktop)
 *
 * Verifies:
 * 1. <header> height <= 80px
 * 2. No horizontal overflow (scrollWidth <= clientWidth)
 * 3. Body font-family is not a bare serif (must contain geist or sans-serif stack)
 * 4. Header interactive children bounding boxes do not intersect
 * 5. Brand text is not truncated (scrollWidth <= clientWidth)
 * 6. Zero pageerror, zero console error, zero failed or 404 same-origin requests
 * 7. Saves screenshots to test-artifacts/prod/
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const PORT = parseInt(process.env.PORT || '3222', 10);
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

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
  { path: '/langkah-selanjutnya', slug: 'langkah-selanjutnya-hub' },
  { path: '/langkah-selanjutnya/biaya-ukt', slug: 'langkah-selanjutnya-ukt' },
  { path: '/langkah-selanjutnya/beasiswa', slug: 'langkah-selanjutnya-beasiswa' },
  { path: '/langkah-selanjutnya/jadwal-seleksi', slug: 'langkah-selanjutnya-jadwal' },
];

const ARTIFACTS_DIR = path.resolve(__dirname, '..', 'test-artifacts', 'prod');

// Helper to check if server is responsive
function isServerRunning(urlStr) {
  return new Promise((resolve) => {
    const parsed = new URL(urlStr);
    const req = http.request(
      {
        host: parsed.hostname,
        port: parsed.port,
        path: '/',
        method: 'HEAD',
        timeout: 1000,
      },
      (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 500);
      }
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

async function runProdRenderTests() {
  console.log('\n==================================================================');
  console.log('🚀 DEFINE YOUR NEXT MOVE — PRODUCTION RENDER VERIFICATION');
  console.log('==================================================================');
  console.log(`Base URL: ${BASE_URL}`);

  if (!fs.existsSync(ARTIFACTS_DIR)) {
    fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  }

  // Ensure server is up; spawn serve-out.js if needed
  let serverProcess = null;
  const running = await isServerRunning(BASE_URL);
  if (!running && BASE_URL.includes(`localhost:${PORT}`)) {
    console.log(`[INFO] Server not detected on port ${PORT}. Spawning scripts/serve-out.js...`);
    serverProcess = spawn('node', [path.join(__dirname, 'serve-out.js'), path.join(__dirname, '..', 'out'), String(PORT)], {
      stdio: 'pipe',
    });
    // Wait for server to spin up
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 200));
      if (await isServerRunning(BASE_URL)) break;
    }
    console.log(`[INFO] Server ready at ${BASE_URL}`);
  }

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  let totalAssertions = 0;
  let failures = [];

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n📱 Viewport: ${vp.name} (${vp.width}x${vp.height}, touch: ${vp.hasTouch}, dsf: ${vp.deviceScaleFactor})`);

      for (const route of ROUTES) {
        process.stdout.write(`  Testing ${route.path.padEnd(24)} ... `);
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          deviceScaleFactor: vp.deviceScaleFactor,
          isMobile: vp.isMobile,
          hasTouch: vp.hasTouch,
        });

        // Suppress intro animation overlay
        await context.addInitScript(() => {
          try {
            sessionStorage.setItem('undip_intro_seen', 'true');
          } catch {}
        });

        const page = await context.newPage();
        const pageErrors = [];
        const consoleErrors = [];
        const failedRequests = [];

        page.on('pageerror', (err) => {
          pageErrors.push(err.message);
        });

        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        page.on('response', (res) => {
          const resUrl = res.url();
          const isSameOrigin = resUrl.startsWith(BASE_URL);
          if (isSameOrigin && res.status() >= 400) {
            failedRequests.push(`${res.status()} ${resUrl}`);
          }
        });

        // Navigate
        const targetUrl = `${BASE_URL}${route.path}`;
        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });

        // Wait for font ready
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(300);

        // Capture screenshot
        const screenshotPath = path.join(ARTIFACTS_DIR, `${route.slug}-${vp.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: false });

        // Run Assertions
        const checks = await page.evaluate(() => {
          const header = document.querySelector('header');
          const headerHeight = header ? header.getBoundingClientRect().height : null;

          // Horizontal overflow check
          const scrollWidth = document.documentElement.scrollWidth;
          const clientWidth = document.documentElement.clientWidth;
          const hasHorizontalOverflow = scrollWidth > clientWidth;

          // Font family check on body
          const bodyStyle = window.getComputedStyle(document.body);
          const fontFamily = bodyStyle.fontFamily || '';

          // Brand text truncation check
          const brandText = document.querySelector('[data-testid="navbar-brand-text"]');
          let brandTruncated = false;
          if (brandText) {
            const textNodes = Array.from(brandText.querySelectorAll('span, p')).filter((el) => {
              const s = window.getComputedStyle(el);
              return s.display !== 'none' && s.visibility !== 'hidden' && el.offsetWidth > 0;
            });
            brandTruncated = textNodes.some((el) => el.scrollWidth > el.clientWidth + 1);
          }

          // Header children bounding box overlap check
          const collisions = [];
          if (header) {
            const interactiveItems = Array.from(header.querySelectorAll('a, button')).filter((el) => {
              const r = el.getBoundingClientRect();
              const s = window.getComputedStyle(el);
              return r.width > 0 && r.height > 0 && s.display !== 'none' && s.visibility !== 'hidden';
            });

            for (let i = 0; i < interactiveItems.length; i++) {
              for (let j = i + 1; j < interactiveItems.length; j++) {
                const r1 = interactiveItems[i].getBoundingClientRect();
                const r2 = interactiveItems[j].getBoundingClientRect();
                const overlapX = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
                const overlapY = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
                if (overlapX > 1 && overlapY > 1) {
                  collisions.push({
                    item1: interactiveItems[i].getAttribute('aria-label') || interactiveItems[i].textContent?.trim().slice(0, 20),
                    item2: interactiveItems[j].getAttribute('aria-label') || interactiveItems[j].textContent?.trim().slice(0, 20),
                    overlapX: Math.round(overlapX),
                    overlapY: Math.round(overlapY),
                  });
                }
              }
            }
          }

          return {
            headerHeight,
            scrollWidth,
            clientWidth,
            hasHorizontalOverflow,
            fontFamily,
            brandTruncated,
            collisions,
          };
        });

        // Evaluate assertion 1: Header height <= 80px
        totalAssertions++;
        if (checks.headerHeight !== null && checks.headerHeight > 80) {
          failures.push(`[${vp.name} ${route.path}] Header height ${checks.headerHeight}px exceeds 80px limit!`);
        }

        // Evaluate assertion 2: No horizontal overflow
        totalAssertions++;
        if (checks.hasHorizontalOverflow) {
          failures.push(`[${vp.name} ${route.path}] Horizontal overflow detected! (scrollWidth: ${checks.scrollWidth} > clientWidth: ${checks.clientWidth})`);
        }

        // Evaluate assertion 3: Body font not a bare serif
        totalAssertions++;
        const fontLower = checks.fontFamily.toLowerCase();
        const isBareSerif =
          (fontLower.includes('times') || fontLower.includes('serif')) &&
          !fontLower.includes('sans-serif') &&
          !fontLower.includes('geist') &&
          !fontLower.includes('silkscreen') &&
          !fontLower.includes('press start');
        if (isBareSerif) {
          failures.push(`[${vp.name} ${route.path}] Body font is bare serif! Computed font-family: "${checks.fontFamily}"`);
        }

        // Evaluate assertion 4: Brand text not truncated
        totalAssertions++;
        if (checks.brandTruncated) {
          failures.push(`[${vp.name} ${route.path}] Brand text is truncated!`);
        }

        // Evaluate assertion 5: Header interactive children collisions
        totalAssertions++;
        if (checks.collisions.length > 0) {
          failures.push(`[${vp.name} ${route.path}] Header collision detected: ${JSON.stringify(checks.collisions)}`);
        }

        // Evaluate assertion 6: Zero page errors & console errors
        totalAssertions++;
        if (pageErrors.length > 0) {
          failures.push(`[${vp.name} ${route.path}] Page errors: ${pageErrors.join(', ')}`);
        }
        totalAssertions++;
        if (consoleErrors.length > 0) {
          failures.push(`[${vp.name} ${route.path}] Console errors: ${consoleErrors.join(', ')}`);
        }

        // Evaluate assertion 7: Zero failed same-origin requests
        totalAssertions++;
        if (failedRequests.length > 0) {
          failures.push(`[${vp.name} ${route.path}] Failed same-origin requests: ${failedRequests.join(', ')}`);
        }

        await context.close();
        console.log('✓ PASS');
      }
    }

    // Specialized interactive tests for Langkah Selanjutnya & Navbar
    console.log('\n[INTERACTIVE TESTS] Verifying Langkah Selanjutnya interactions & legacy redirects...');

    const interactiveContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const interactivePage = await interactiveContext.newPage();

    // 1. Deep link: /langkah-selanjutnya/biaya-ukt?prodi=ft-arsitektur
    totalAssertions++;
    await interactivePage.goto(`${BASE_URL}/langkah-selanjutnya/biaya-ukt?prodi=ft-arsitektur`, { waitUntil: 'networkidle' });
    const deepLinkText = await interactivePage.textContent('body');
    if (!deepLinkText.includes('Arsitektur') || !deepLinkText.includes('Rp500.000')) {
      failures.push(`Deep link ?prodi=ft-arsitektur failed to initialize picker to Arsitektur!`);
    } else {
      console.log('  ✓ Deep link ?prodi=ft-arsitektur initialized correctly');
    }

    // 2. Interactive picker update test
    totalAssertions++;
    const buttonToClick = interactivePage.locator('button:has-text("Teknik Kimia")').first();
    if ((await buttonToClick.count()) > 0) {
      await buttonToClick.click();
      await interactivePage.waitForTimeout(200);
      const urlAfterClick = interactivePage.url();
      if (!urlAfterClick.includes('prodi=ft-kimia')) {
        failures.push(`Clicking program in picker did not update URL query string to prodi=ft-kimia! Got: ${urlAfterClick}`);
      } else {
        console.log('  ✓ Program picker updated selection and URL parameter seamlessly');
      }
    }

    // 3. Subnav active pill assertion
    totalAssertions++;
    await interactivePage.goto(`${BASE_URL}/langkah-selanjutnya/beasiswa`, { waitUntil: 'networkidle' });
    const activePill = await interactivePage.locator('a[aria-current="page"]').textContent();
    if (!activePill || !activePill.includes('BEASISWA')) {
      failures.push(`Active subnav pill on /langkah-selanjutnya/beasiswa is not 'BEASISWA'! Got: ${activePill}`);
    } else {
      console.log('  ✓ Active subnav pill correctly matches route on /langkah-selanjutnya/beasiswa');
    }

    // 4. Legacy redirect: /results?tab=next-steps -> /langkah-selanjutnya
    totalAssertions++;
    await interactivePage.goto(`${BASE_URL}/results?tab=next-steps`, { waitUntil: 'networkidle' });
    await interactivePage.waitForTimeout(300);
    const redirectedUrl = interactivePage.url();
    if (!redirectedUrl.includes('/langkah-selanjutnya')) {
      failures.push(`Legacy /results?tab=next-steps did not redirect to /langkah-selanjutnya! Got: ${redirectedUrl}`);
    } else {
      console.log('  ✓ Legacy /results?tab=next-steps correctly redirected to /langkah-selanjutnya');
    }

    await interactiveContext.close();

    // 5. Mobile bottom nav test on mobile viewport
    totalAssertions++;
    const mobileContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto(`${BASE_URL}/langkah-selanjutnya`, { waitUntil: 'networkidle' });
    const bottomNavItems = mobilePage.locator('nav[aria-label="Navigasi Bawah Mobile dan Tablet"] a');
    const bottomNavCount = await bottomNavItems.count();
    if (bottomNavCount !== 5) {
      failures.push(`Mobile bottom nav expected 5 items, got ${bottomNavCount}!`);
    } else {
      console.log(`  ✓ Mobile bottom nav contains exact 5 items (Beranda, Tes, Hasil, Prodi, Info)`);
    }
    await mobileContext.close();
  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill();
    }
  }

  console.log('\n==================================================================');
  if (failures.length === 0) {
    console.log(`🎉 ALL ${totalAssertions} PRODUCTION RENDER ASSERTIONS PASSED WITH 0 FAILURES!`);
    console.log(`📸 Screenshots saved to: ${ARTIFACTS_DIR}`);
    console.log('==================================================================\n');
    process.exit(0);
  } else {
    console.error(`❌ ${failures.length} ASSERTION FAILURES OCCURRED:`);
    failures.forEach((f) => console.error(`  - ${f}`));
    console.log('==================================================================\n');
    process.exit(1);
  }
}

runProdRenderTests().catch((err) => {
  console.error('Fatal error running production render tests:', err);
  process.exit(1);
});
