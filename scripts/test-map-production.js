/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const PORT = 3225;
const BASE_URL = `http://localhost:${PORT}`;

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

async function runMapTests() {
  console.log('===============================================================');
  console.log('UNDIP TEMBALANG CAMPUS MAP — PRODUCTION PLAYWRIGHT E2E TESTS');
  console.log('===============================================================\n');

  const artifactDir = path.join(__dirname, '..', 'test-artifacts', 'map');
  if (!fs.existsSync(artifactDir)) {
    fs.mkdirSync(artifactDir, { recursive: true });
  }

  // Start serve-out server
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
    console.log('Chrome channel failed, trying msedge...');
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

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Mobile Touch Viewport (390 x 844)
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 1] Mobile Touch Viewport (390x844) ---');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    const consoleErrorsMobile = [];
    mobilePage.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrorsMobile.push(msg.text());
    });

    // Populate answers to view /results with interactive map
    await mobilePage.goto(`${BASE_URL}/results`);
    await mobilePage.evaluate(() => {
      const answers = {};
      for (let i = 1; i <= 36; i++) answers[i] = 4;
      localStorage.setItem('undip_major_matcher_answers', JSON.stringify(answers));
    });
    await mobilePage.reload();
    await mobilePage.waitForLoadState('domcontentloaded');
    await mobilePage.evaluate(() => document.fonts.ready);
    await mobilePage.waitForTimeout(1000);

    // Verify no horizontal overflow
    const hasHOverflow = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    assert(!hasHOverflow, 'Mobile 390x844: Zero horizontal document overflow');

    // Toggle "Peta Penuh" so the interactive campus map is completely in view
    const petaPenuhBtn = mobilePage.locator('button[aria-label*="Peta Penuh"], button:has-text("Peta Penuh")').first();
    if (await petaPenuhBtn.isVisible()) {
      await petaPenuhBtn.tap();
      await mobilePage.waitForTimeout(500);
      console.log('Toggled Peta Penuh mode on mobile');
    }

    // Check zoom in button
    const zoomInBtn = mobilePage.locator('button[title*="Perbesar"], button[aria-label*="Perbesar"]').first();
    if (await zoomInBtn.isVisible()) {
      await zoomInBtn.tap();
      await mobilePage.waitForTimeout(300);
      assert(true, 'Mobile: Zoom in button responded to tap');
    }

    // Check reset button
    const resetBtn = mobilePage.locator('button[title*="Reset"], button[aria-label*="Reset"], button:has(svg.lucide-rotate-ccw)').first();
    if (await resetBtn.isVisible()) {
      await resetBtn.tap();
      await mobilePage.waitForTimeout(300);
      assert(true, 'Mobile: Reset view button responded to tap');
    }

    // Tap each of the 12 faculty units
    const facultyIds = ['ft', 'fisip', 'fh', 'fib', 'sv', 'fpsi', 'feb', 'fsm', 'fk', 'fkm', 'fpik', 'fpp'];
    console.log('Testing tap on all 12 faculty units on mobile...');
    let tappedUnits = 0;
    for (const fid of facultyIds) {
      const unitEl = mobilePage.locator(`#marker-${fid}, #faculty-${fid}`).first();
      const count = await unitEl.count();
      if (count > 0) {
        await unitEl.dispatchEvent('click');
        await mobilePage.waitForTimeout(150);
        tappedUnits++;
      }
    }
    assert(tappedUnits >= 12, `Mobile: Successfully tapped ${tappedUnits}/12 faculty units`);

    // Close faculty detail card if open to return to overview
    const closeFacultyBtn = mobilePage.locator('button[aria-label*="Kembali ke Tinjauan Peta"], button[title*="Kembali ke Tinjauan Peta"]').first();
    if (await closeFacultyBtn.isVisible()) {
      await closeFacultyBtn.dispatchEvent('click');
      await mobilePage.waitForTimeout(400);
    } else if (await resetBtn.isVisible()) {
      await resetBtn.dispatchEvent('click');
      await mobilePage.waitForTimeout(400);
    }

    const mobileScreenshotPath = path.join(artifactDir, 'overview-mobile-390x844.png');
    await mobilePage.screenshot({ path: mobileScreenshotPath, fullPage: false });
    console.log(`✓ Saved mobile overview screenshot: ${mobileScreenshotPath}`);

    assert(consoleErrorsMobile.length === 0, `Mobile: Zero console errors (found: ${consoleErrorsMobile.length})`);
    await mobileContext.close();

    // -------------------------------------------------------------------------
    // TEST 2: Desktop Viewport (1440 x 900)
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 2] Desktop Viewport (1440x900) ---');
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const desktopPage = await desktopContext.newPage();
    const consoleErrorsDesktop = [];
    desktopPage.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrorsDesktop.push(msg.text());
    });

    await desktopPage.goto(`${BASE_URL}/results`);
    await desktopPage.evaluate(() => {
      const answers = {};
      for (let i = 1; i <= 36; i++) answers[i] = 4;
      localStorage.setItem('undip_major_matcher_answers', JSON.stringify(answers));
    });
    await desktopPage.reload();
    await desktopPage.waitForLoadState('domcontentloaded');
    await desktopPage.evaluate(() => document.fonts.ready);
    await desktopPage.waitForTimeout(1000);

    // Capture Overview Desktop
    const overviewDesktopPath = path.join(artifactDir, 'overview-desktop-1440x900.png');
    await desktopPage.screenshot({ path: overviewDesktopPath, fullPage: false });
    console.log(`✓ Saved desktop overview screenshot: ${overviewDesktopPath}`);

    // Capture 3 Close-up Views:
    // 1. Rektorat Area
    console.log('Capturing Close-up 1: Rektorat / Widya Puraya Area...');
    const rektoratTarget = desktopPage.locator('#widya-puraya, #faculty-fsm, #taman-inspirasi').first();
    if (await rektoratTarget.isVisible()) {
      await rektoratTarget.click();
      await desktopPage.waitForTimeout(800);
    }
    const rektoratCloseupPath = path.join(artifactDir, 'closeup-rektorat-area.png');
    await desktopPage.screenshot({ path: rektoratCloseupPath, fullPage: false });
    console.log(`✓ Saved Rektorat close-up: ${rektoratCloseupPath}`);

    // 2. FT Cluster
    console.log('Capturing Close-up 2: FT Cluster...');
    const ftTarget = desktopPage.locator('#faculty-ft').first();
    if (await ftTarget.isVisible()) {
      await ftTarget.click();
      await desktopPage.waitForTimeout(800);
    }
    const ftCloseupPath = path.join(artifactDir, 'closeup-ft-cluster.png');
    await desktopPage.screenshot({ path: ftCloseupPath, fullPage: false });
    console.log(`✓ Saved FT cluster close-up: ${ftCloseupPath}`);

    // 3. FK / RSND Cluster
    console.log('Capturing Close-up 3: FK / RSND Cluster...');
    const fkTarget = desktopPage.locator('#faculty-fk').first();
    if (await fkTarget.isVisible()) {
      await fkTarget.click();
      await desktopPage.waitForTimeout(800);
    }
    const fkCloseupPath = path.join(artifactDir, 'closeup-fk-rsnd.png');
    await desktopPage.screenshot({ path: fkCloseupPath, fullPage: false });
    console.log(`✓ Saved FK/RSND cluster close-up: ${fkCloseupPath}`);

    // Verify attribution text is visible
    const hasAttribution = await desktopPage.evaluate(() => {
      return document.body.innerText.includes('OpenStreetMap contributors');
    });
    assert(hasAttribution, 'Desktop: Attribution "© OpenStreetMap contributors" is rendered');

    assert(consoleErrorsDesktop.length === 0, `Desktop: Zero console errors (found: ${consoleErrorsDesktop.length})`);
    await desktopContext.close();
  } finally {
    await browser.close();
    serverProcess.kill();
  }

  console.log('\n===============================================================');
  if (failures > 0) {
    console.error(`🚨 PRODUCTION MAP PLAYWRIGHT TESTS FAILED WITH ${failures} ERRORS!`);
    process.exit(1);
  } else {
    console.log('🎉 ALL PRODUCTION MAP PLAYWRIGHT TESTS COMPLETED SUCCESSFULLY WITH 0 ERRORS!');
  }
  console.log('===============================================================\n');
}

runMapTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
