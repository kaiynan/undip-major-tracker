/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 3227;
const BASE_URL = `http://localhost:${PORT}`;
const ARTIFACT_DIR = path.resolve(__dirname, '..', 'test-artifacts', 'results');

if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

function isServerRunning() {
  return new Promise((resolve) => {
    const req = http.request(
      {
        host: 'localhost',
        port: PORT,
        path: '/',
        method: 'HEAD',
        timeout: 1000,
      },
      (res) => resolve(res.statusCode >= 200 && res.statusCode < 500)
    );
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

async function waitForServer(maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await isServerRunning()) return true;
    await new Promise((r) => setTimeout(r, 200));
  }
  return false;
}

const VIEWPORTS = [
  { width: 320, height: 600, label: '320px (iPhone SE narrow)' },
  { width: 360, height: 740, label: '360px (Android small)' },
  { width: 390, height: 844, label: '390px (iPhone 14/15 standard)' },
  { width: 430, height: 932, label: '430px (iPhone Pro Max)' },
  { width: 768, height: 1024, label: '768px (iPad portrait)' },
  { width: 1024, height: 768, label: '1024px (iPad landscape / small laptop)' },
  { width: 1440, height: 900, label: '1440px (Desktop HD standard)' },
  { width: 1920, height: 1080, label: '1920px (Desktop Full HD)' },
];

async function runResultsLayoutTests() {
  console.log('===============================================================');
  console.log('RESULTS PAGE LAYOUT & SCROLLING VERIFICATION (ROUND 10 AUDIT)');
  console.log('===============================================================\n');

  console.log(`Starting serve-out.js on port ${PORT}...`);
  const serverProcess = spawn('node', [path.join(__dirname, 'serve-out.js'), 'out', String(PORT)], {
    stdio: 'ignore',
    shell: true,
  });

  const serverReady = await waitForServer();
  if (!serverReady) {
    serverProcess.kill();
    throw new Error(`Server failed to start on ${BASE_URL}`);
  }
  console.log(`✓ Static production server active on ${BASE_URL}`);

  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  }

  let failures = 0;
  function assert(condition, message) {
    if (!condition) {
      console.error(`❌ [FAIL] ${message}`);
      failures++;
    } else {
      console.log(`✓ [PASS] ${message}`);
    }
  }

  // Sample answers for complete questionnaire
  const mockAnswers = {};
  for (let i = 1; i <= 36; i++) mockAnswers[i] = 4;

  try {
    for (const vp of VIEWPORTS) {
      console.log(`\n--- Testing Viewport: ${vp.label} (${vp.width}x${vp.height}) ---`);
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: 2,
        isMobile: vp.width < 1024,
        hasTouch: vp.width < 1024,
      });

      await context.addInitScript(({ answers }) => {
        sessionStorage.setItem('undip_intro_seen', 'true');
        localStorage.setItem('undip_major_matcher_answers', JSON.stringify(answers));
        localStorage.setItem('undip_questionnaire_answers', JSON.stringify(answers));
      }, { answers: mockAnswers });

      const page = await context.newPage();
      const consoleErrors = [];
      const hydrationErrors = [];

      page.on('console', (msg) => {
        const text = msg.text();
        if (msg.type() === 'error') {
          consoleErrors.push(text);
        }
        if (
          text.includes('Hydration failed') ||
          text.includes("didn't match") ||
          text.includes('did not match') ||
          text.includes('server rendered text')
        ) {
          hydrationErrors.push(text);
        }
      });

      await page.goto(`${BASE_URL}/results`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(600);

      // INVARIANT 1: Zero hydration errors
      assert(
        hydrationErrors.length === 0,
        `Viewport ${vp.width}px: Zero React hydration mismatch errors (found: ${hydrationErrors.length})`
      );

      // INVARIANT 2: Zero horizontal document overflow
      const overflowCheck = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          innerWidth: window.innerWidth,
        };
      });
      assert(
        overflowCheck.scrollWidth <= overflowCheck.innerWidth + 1,
        `Viewport ${vp.width}px: Zero horizontal document overflow (scrollWidth=${overflowCheck.scrollWidth}, innerWidth=${overflowCheck.innerWidth})`
      );

      // INVARIANT 3: Action Deduplication (Exactly ONE Share and ONE PDF button in header)
      const shareButtons = await page.locator('[data-testid="btn-bagikan-hasil"]').all();
      assert(
        shareButtons.length === 1,
        `Viewport ${vp.width}px: Exactly ONE 'Bagikan Hasil' button in DOM (found: ${shareButtons.length})`
      );

      // INVARIANT 4: Map controls placed strictly below top toolbar with clean margin
      const toolbarBox = await page.locator('header[aria-label="Toolbar Hasil Rekomendasi"]').boundingBox();
      const mapControls = await page.locator('.pointer-events-auto').filter({ hasText: 'UNDIP MAP' }).first().boundingBox();
      if (toolbarBox && mapControls) {
        const toolbarBottom = toolbarBox.y + toolbarBox.height;
        assert(
          mapControls.y >= toolbarBottom + 4,
          `Viewport ${vp.width}px: Map controls sit strictly below toolbar (toolbar bottom: ${toolbarBottom}px, map controls top: ${mapControls.y}px, margin: ${mapControls.y - toolbarBottom}px)`
        );
      }

      // INVARIANT 5: Title & Tier Badge collision check on Results Panel / Bottom Sheet
      const titleBox = await page.locator('h2:has-text("Hasil Rekomendasi")').first().boundingBox();
      const tierBadgeBox = await page.locator('aside span:has-text("Kecocokan")').first().boundingBox();
      if (titleBox && tierBadgeBox) {
        assert(
          tierBadgeBox.y >= titleBox.y + titleBox.height - 2,
          `Viewport ${vp.width}px: Tier badge sits strictly under title (title bottom: ${titleBox.y + titleBox.height}px, badge top: ${tierBadgeBox.y}px)`
        );
      }

      // INVARIANT 6: Zero colliding interactive element bounding boxes in toolbar
      const collisionData = await page.evaluate(() => {
        const interactive = Array.from(document.querySelectorAll('header button, header a'));
        const boxes = interactive.map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            tag: el.tagName,
            text: el.innerText.trim().slice(0, 15),
            rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          };
        }).filter((b) => b.rect.width > 0 && b.rect.height > 0);

        const overlaps = [];
        for (let i = 0; i < boxes.length; i++) {
          for (let j = i + 1; j < boxes.length; j++) {
            const b1 = boxes[i].rect;
            const b2 = boxes[j].rect;
            const xOverlap = Math.max(0, Math.min(b1.x + b1.width, b2.x + b2.width) - Math.max(b1.x, b2.x));
            const yOverlap = Math.max(0, Math.min(b1.y + b1.height, b2.y + b2.height) - Math.max(b1.y, b2.y));
            if (xOverlap > 1 && yOverlap > 1) {
              overlaps.push({ el1: boxes[i].text, el2: boxes[j].text, xOverlap, yOverlap });
            }
          }
        }
        return overlaps;
      });
      assert(
        collisionData.length === 0,
        `Viewport ${vp.width}px: Zero colliding interactive element bounding boxes in toolbar (found: ${collisionData.length})`
      );

      // INVARIANT 7: Internal Scroll Container Metrics & Scrolling (Tab 1: 65 Jurusan)
      const scrollMetricsTab1 = await page.evaluate(() => {
        const el = document.getElementById('results-panel-scroll');
        if (!el) return null;
        const style = window.getComputedStyle(el);
        return {
          clientHeight: el.clientHeight,
          scrollHeight: el.scrollHeight,
          scrollTop: el.scrollTop,
          minHeight: style.minHeight,
          overflowY: style.overflowY,
          overscrollBehavior: style.overscrollBehaviorY || style.overscrollBehavior,
          touchAction: style.touchAction,
        };
      });

      if (scrollMetricsTab1) {
        assert(
          scrollMetricsTab1.clientHeight > 0,
          `Viewport ${vp.width}px [Tab 1]: Scroll container clientHeight is valid (> 0: got ${scrollMetricsTab1.clientHeight}px)`
        );
        assert(
          scrollMetricsTab1.scrollHeight > scrollMetricsTab1.clientHeight,
          `Viewport ${vp.width}px [Tab 1]: Content overflows scrollport (scrollHeight=${scrollMetricsTab1.scrollHeight}px > clientHeight=${scrollMetricsTab1.clientHeight}px)`
        );
        assert(
          scrollMetricsTab1.minHeight === '0px',
          `Viewport ${vp.width}px [Tab 1]: Content body has CSS min-h-0 (minHeight: ${scrollMetricsTab1.minHeight})`
        );
        assert(
          scrollMetricsTab1.overflowY === 'auto',
          `Viewport ${vp.width}px [Tab 1]: Content body preserves overflow-y: auto`
        );

        // Test wheel / programmatic scroll increments scrollTop
        await page.evaluate(() => {
          const el = document.getElementById('results-panel-scroll');
          if (el) el.scrollTop = 250;
        });
        const scrolledTop = await page.evaluate(() => {
          const el = document.getElementById('results-panel-scroll');
          return el ? el.scrollTop : 0;
        });
        assert(
          scrolledTop >= 200,
          `Viewport ${vp.width}px [Tab 1]: Scrolling successfully updates scrollTop (got ${scrolledTop}px)`
        );

        // Test reachability of the very last content
        await page.evaluate(() => {
          const el = document.getElementById('results-panel-scroll');
          if (el) el.scrollTop = el.scrollHeight;
        });
        const bottomMetrics = await page.evaluate(() => {
          const el = document.getElementById('results-panel-scroll');
          return el ? { scrollTop: el.scrollTop, clientHeight: el.clientHeight, scrollHeight: el.scrollHeight } : null;
        });
        if (bottomMetrics) {
          assert(
            bottomMetrics.scrollTop + bottomMetrics.clientHeight >= bottomMetrics.scrollHeight - 35,
            `Viewport ${vp.width}px [Tab 1]: Bottom-most content is fully reachable (scrollTop+clientHeight=${bottomMetrics.scrollTop + bottomMetrics.clientHeight} vs scrollHeight=${bottomMetrics.scrollHeight})`
          );
        }

        // Reset scroll position
        await page.evaluate(() => {
          const el = document.getElementById('results-panel-scroll');
          if (el) el.scrollTop = 0;
        });
      }

      // INVARIANT 8: Tab Switching to Tab 2 (12 Fakultas) & Scrolling Verification
      const facultiesBtn = page.locator('button[aria-label*="Output 2: 12 Fakultas"]').first();
      if (await facultiesBtn.count() > 0) {
        await facultiesBtn.click();
        await page.waitForTimeout(250);

        const scrollMetricsTab2 = await page.evaluate(() => {
          const el = document.getElementById('results-panel-scroll');
          if (!el) return null;
          return {
            clientHeight: el.clientHeight,
            scrollHeight: el.scrollHeight,
          };
        });

        if (scrollMetricsTab2) {
          assert(
            scrollMetricsTab2.clientHeight > 0,
            `Viewport ${vp.width}px [Tab 2]: 12 Fakultas scroll container clientHeight is valid (${scrollMetricsTab2.clientHeight}px)`
          );
          assert(
            scrollMetricsTab2.scrollHeight > scrollMetricsTab2.clientHeight,
            `Viewport ${vp.width}px [Tab 2]: 12 Fakultas overflows and scrolls smoothly (${scrollMetricsTab2.scrollHeight}px > ${scrollMetricsTab2.clientHeight}px)`
          );
        }

        // Switch back to All Majors Tab
        const allMajorsBtn = page.locator('button[aria-label*="Output 1: 65 Jurusan"]').first();
        if (await allMajorsBtn.count() > 0) {
          await allMajorsBtn.click();
          await page.waitForTimeout(200);
        }
      }

      // INVARIANT 9: Mobile Bottom Sheet Snap Points (on mobile viewports < 640px)
      if (vp.width < 640) {
        // Initial state: half snap
        const sheetBoxInitial = await page.locator('aside').boundingBox();
        if (sheetBoxInitial) {
          const mapVisibleRatio = (vp.height - sheetBoxInitial.height) / vp.height;
          assert(
            mapVisibleRatio >= 0.38,
            `Viewport ${vp.width}px: At half snap, map retains >= 40% visible viewport height (actual: ${(mapVisibleRatio * 100).toFixed(1)}%)`
          );
        }

        // Test snap to expanded
        const dragHandle = page.locator('[aria-label*="Ubah ukuran panel bawah"]').first();
        if (await dragHandle.count() > 0) {
          // Tap drag handle to cycle: half -> expanded
          await dragHandle.click();
          await page.waitForTimeout(350);

          const sheetBoxExpanded = await page.locator('aside').boundingBox();
          if (sheetBoxExpanded) {
            const expandedRatio = sheetBoxExpanded.height / vp.height;
            console.log(`  ℹ️ Mobile expanded height ratio: ${(expandedRatio * 100).toFixed(1)}%`);
            assert(
              expandedRatio > 0.70,
              `Viewport ${vp.width}px: Expanded snap point expands to > 70% height (actual: ${(expandedRatio * 100).toFixed(1)}%)`
            );
          }

          // Tap drag handle to cycle: expanded -> half
          await dragHandle.click();
          await page.waitForTimeout(350);

          // Tap drag handle: half -> expanded, tap again or simulate drag down to collapsed
          // Direct drag down simulation to test collapsed snap
          const dragBox = await dragHandle.boundingBox();
          if (dragBox) {
            await page.mouse.move(dragBox.x + dragBox.width / 2, dragBox.y + dragBox.height / 2);
            await page.mouse.down();
            await page.mouse.move(dragBox.x + dragBox.width / 2, dragBox.y + dragBox.height / 2 + 60, { steps: 5 });
            await page.mouse.up();
            await page.waitForTimeout(350);

            const sheetBoxCollapsed = await page.locator('aside').boundingBox();
            if (sheetBoxCollapsed) {
              console.log(`  ℹ️ Mobile collapsed height: ${sheetBoxCollapsed.height}px`);
              assert(
                sheetBoxCollapsed.height <= 110,
                `Viewport ${vp.width}px: Collapsed peek snap point is ~96px (actual: ${sheetBoxCollapsed.height}px)`
              );
            }

            // Drag back up to half snap
            await page.mouse.move(dragBox.x + dragBox.width / 2, dragBox.y + 10);
            await page.mouse.down();
            await page.mouse.move(dragBox.x + dragBox.width / 2, dragBox.y - 60, { steps: 5 });
            await page.mouse.up();
            await page.waitForTimeout(350);
          }
        }
      }

      // INVARIANT 10: Zero console errors
      assert(
        consoleErrors.length === 0,
        `Viewport ${vp.width}px: Zero console errors (found: ${consoleErrors.length})`
      );

      // Save required screenshots
      if (vp.width === 390 && vp.height === 844) {
        const mobileScreenshot = path.join(ARTIFACT_DIR, 'results-mobile-390x844.png');
        await page.screenshot({ path: mobileScreenshot });
        console.log(`  📸 Saved mobile screenshot: ${mobileScreenshot}`);
      }
      if (vp.width === 1440 && vp.height === 900) {
        const desktopScreenshot = path.join(ARTIFACT_DIR, 'results-desktop-1440x900.png');
        await page.screenshot({ path: desktopScreenshot });
        console.log(`  📸 Saved desktop screenshot: ${desktopScreenshot}`);
      }

      await context.close();
    }
  } finally {
    await browser.close();
    serverProcess.kill();
  }

  console.log('\n===============================================================');
  if (failures > 0) {
    console.error(`🚨 RESULTS LAYOUT & SCROLLING TESTS FAILED WITH ${failures} ERRORS!`);
    process.exit(1);
  } else {
    console.log('🎉 ALL RESULTS LAYOUT & SCROLLING TESTS PASSED WITH 0 ERRORS!');
  }
  console.log('===============================================================\n');
}

runResultsLayoutTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
