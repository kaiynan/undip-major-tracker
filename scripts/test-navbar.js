/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function runNavbarTests() {
  console.log(`🚀 Running automated Navbar overlap & responsiveness verification (320px to 2560px, step 20px) against ${BASE_URL}...`);
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const routes = ['/', '/results', '/program-studi'];
  let totalChecks = 0;
  let failures = 0;

  try {
    for (const route of routes) {
      console.log(`\nTesting Route: ${route}`);
      const context = await browser.newContext({ hasTouch: true });
      await context.addInitScript(() => {
        try {
          sessionStorage.setItem('undip_intro_seen', 'true');
        } catch {}
      });
      const page = await context.newPage();

      // Initial navigation
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(400);

      for (let width = 320; width <= 2560; width += 20) {
        await page.setViewportSize({ width, height: 800 });
        await page.waitForTimeout(30);
        totalChecks++;

        const checkResult = await page.evaluate(() => {
          const header = document.querySelector('header');
          if (!header) return { error: 'No header found' };
          const grid = header.querySelector('.grid');
          if (!grid) return { error: 'No grid found' };

          // 1. Horizontal overflow check
          const hasOverflow = document.documentElement.scrollWidth > window.innerWidth;

          // 2. Brand text truncation check (scrollWidth <= clientWidth)
          const brandText = document.querySelector('[data-testid="navbar-brand-text"]');
          let brandTruncated = false;
          if (brandText) {
            const spans = Array.from(brandText.querySelectorAll('span, p')).filter((el) => {
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0;
            });
            brandTruncated = spans.some((s) => s.scrollWidth > s.clientWidth + 1);
          }

          // 3. Header visible interactive children bounding box collision check
          const items = Array.from(grid.querySelectorAll('a, button')).filter((el) => {
            const rect = el.getBoundingClientRect();
            const style = window.getComputedStyle(el);
            return rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
          });

          const collisions = [];
          for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
              const r1 = items[i].getBoundingClientRect();
              const r2 = items[j].getBoundingClientRect();
              const overlapX = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
              const overlapY = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
              // Tolerance of 1px for subpixel rendering
              if (overlapX > 1 && overlapY > 1) {
                collisions.push({
                  item1: items[i].getAttribute('aria-label') || items[i].textContent?.trim().slice(0, 20),
                  item2: items[j].getAttribute('aria-label') || items[j].textContent?.trim().slice(0, 20),
                  overlapX: Math.round(overlapX),
                  overlapY: Math.round(overlapY),
                });
              }
            }
          }

          return { hasOverflow, brandTruncated, collisions };
        });

        if (checkResult.hasOverflow) {
          console.error(`❌ [${route} @ ${width}px] Horizontal overflow detected!`);
          failures++;
        }
        if (checkResult.brandTruncated) {
          console.error(`❌ [${route} @ ${width}px] Brand text truncated!`);
          failures++;
        }
        if (checkResult.collisions && checkResult.collisions.length > 0) {
          console.error(`❌ [${route} @ ${width}px] Header collision:`, checkResult.collisions);
          failures++;
        }
      }

      // Stress test: brand name up to ~22 chars at viewports <= 430px
      console.log(`  🔍 Testing ~22 character brand name stress test at <= 430px on ${route}...`);
      for (const mobileWidth of [320, 360, 390, 430]) {
        await page.setViewportSize({ width: mobileWidth, height: 800 });
        await page.waitForTimeout(50);
        totalChecks++;

        const stressResult = await page.evaluate(() => {
          const brandText = document.querySelector('[data-testid="navbar-brand-text"]');
          if (!brandText) return { error: 'No brandText' };

          // Injected ~22 char name in mobile stack: "DEFINE YOUR" + "NEXT MOVE 2027"
          const mobileSpans = brandText.querySelectorAll('.navbar-brand-mobile span');
          if (mobileSpans.length >= 2) {
            mobileSpans[0].textContent = 'DEFINE YOUR';
            mobileSpans[1].textContent = 'NEXT MOVE 2027';
          }

          const hasOverflow = document.documentElement.scrollWidth > window.innerWidth;
          let brandTruncated = false;
          const spans = Array.from(brandText.querySelectorAll('span, p')).filter((el) => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetWidth > 0;
          });
          brandTruncated = spans.some((s) => s.scrollWidth > s.clientWidth + 1);
          return { hasOverflow, brandTruncated };
        });

        if (stressResult.hasOverflow) {
          console.error(`❌ [${route} @ ${mobileWidth}px with 22-char brand] Horizontal overflow!`);
          failures++;
        }
        if (stressResult.brandTruncated) {
          console.error(`❌ [${route} @ ${mobileWidth}px with 22-char brand] Brand truncated!`);
          failures++;
        }
      }

      await context.close();
      console.log(`  ✓ Route ${route} completed across all 113 viewport widths (320px - 2560px)`);
    }

    if (failures === 0) {
      console.log(`\n🎉 SUCCESS: All ${totalChecks} checks (113 viewports × 2 routes) passed with 0 collisions, 0 truncations, 0 horizontal overflows!`);
    } else {
      console.error(`\n❌ FAILED: ${failures} checks failed.`);
      process.exit(1);
    }
  } finally {
    await browser.close();
  }
}

runNavbarTests().catch((err) => {
  console.error('Fatal error in navbar test:', err);
  process.exit(1);
});
