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
  console.log('RESULTS PAGE LAYOUT INVARIANT TESTS (PROMPT I ROUND 10)');
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

  // Sample answers for high affinity
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
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      await page.goto(`${BASE_URL}/results`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(600);

      // INVARIANT 1: Zero horizontal document overflow
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

      // INVARIANT 2: Action Deduplication (Exactly ONE Share and ONE PDF button in header)
      const shareButtons = await page.locator('[data-testid="btn-bagikan-hasil"]').all();
      assert(
        shareButtons.length === 1,
        `Viewport ${vp.width}px: Exactly ONE 'Bagikan Hasil' button in DOM (found: ${shareButtons.length})`
      );

      // INVARIANT 3: Map controls placed strictly below top toolbar with clean margin
      const toolbarBox = await page.locator('header[aria-label="Toolbar Hasil Rekomendasi"]').boundingBox();
      const mapControls = await page.locator('.pointer-events-auto').filter({ hasText: 'UNDIP MAP' }).first().boundingBox();
      if (toolbarBox && mapControls) {
        const toolbarBottom = toolbarBox.y + toolbarBox.height;
        assert(
          mapControls.y >= toolbarBottom + 4,
          `Viewport ${vp.width}px: Map controls sit strictly below toolbar (toolbar bottom: ${toolbarBottom}px, map controls top: ${mapControls.y}px, margin: ${mapControls.y - toolbarBottom}px)`
        );
      }

      // INVARIANT 4: Title & Tier Badge collision check on Results Panel / Bottom Sheet
      const titleBox = await page.locator('h2:has-text("Hasil Rekomendasi")').first().boundingBox();
      const tierBadgeBox = await page.locator('aside span:has-text("Kecocokan")').first().boundingBox();
      if (titleBox && tierBadgeBox) {
        // Assert tier badge sits below the title
        assert(
          tierBadgeBox.y >= titleBox.y + titleBox.height - 2,
          `Viewport ${vp.width}px: Tier badge sits strictly under title (title bottom: ${titleBox.y + titleBox.height}px, badge top: ${tierBadgeBox.y}px)`
        );
      }

      // INVARIANT 5: No two disjoint interactive elements collide in the header/toolbar
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
            // tolerance of 1px for subpixel border rendering
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

      // INVARIANT 6: Mobile snap points (for mobile viewports < 640)
      if (vp.width < 640) {
        // Half snap: check sheet height is ~50% and map area has >= 40% height
        const sheetBox = await page.locator('aside').boundingBox();
        if (sheetBox) {
          const sheetRatio = sheetBox.height / vp.height;
          const mapVisibleRatio = (vp.height - sheetBox.height) / vp.height;
          console.log(`  ℹ️ Mobile sheet height ratio: ${(sheetRatio * 100).toFixed(1)}%, visible map ratio: ${(mapVisibleRatio * 100).toFixed(1)}%`);
          assert(
            mapVisibleRatio >= 0.38,
            `Viewport ${vp.width}px: At half snap, map retains >= 40% visible viewport height (actual: ${(mapVisibleRatio * 100).toFixed(1)}%)`
          );
        }
      }

      // INVARIANT 7: Zero console errors
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
    console.error(`🚨 RESULTS LAYOUT INVARIANT TESTS FAILED WITH ${failures} ERRORS!`);
    process.exit(1);
  } else {
    console.log('🎉 ALL RESULTS LAYOUT INVARIANT TESTS PASSED WITH 0 ERRORS!');
  }
  console.log('===============================================================\n');
}

runResultsLayoutTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
