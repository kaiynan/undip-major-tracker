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

  const facultyIds = ['ft', 'fisip', 'fh', 'fib', 'sv', 'fpsi', 'feb', 'fsm', 'fk', 'fkm', 'fpik', 'fpp'];

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

    await mobilePage.goto(`${BASE_URL}/results`);
    await mobilePage.evaluate(() => {
      const answers = {};
      for (let i = 1; i <= 36; i++) answers[i] = 4;
      localStorage.setItem('undip_major_matcher_answers', JSON.stringify(answers));
    });
    await mobilePage.reload();
    await mobilePage.waitForLoadState('domcontentloaded');
    await mobilePage.evaluate(() => document.fonts.ready);
    await mobilePage.waitForTimeout(800);

    // Verify no horizontal overflow
    const hasHOverflow = await mobilePage.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    assert(!hasHOverflow, 'Mobile 390x844: Zero horizontal document overflow');

    // 1. Overview Mobile Screenshot
    const overviewMobilePath = path.join(artifactDir, 'overview-mobile-390x844.png');
    await mobilePage.screenshot({ path: overviewMobilePath });
    console.log(`✓ Saved mobile overview screenshot: ${overviewMobilePath}`);

    // Tap each of the 12 faculty units and verify panel opens
    console.log('Testing tap on all 12 faculty units on mobile...');
    let tappedMobileCount = 0;
    for (const fid of facultyIds) {
      const marker = mobilePage.locator(`#marker-${fid}`).first();
      if (await marker.count() > 0) {
        await marker.dispatchEvent('click');
        await mobilePage.waitForTimeout(200);

        // Verify sheet/card opens
        const sheetVisible = await mobilePage.locator('[aria-label*="Detail Fakultas"], [aria-label*="Peta"]').count() > 0;
        if (sheetVisible) tappedMobileCount++;

        // Close to reset
        const closeBtn = mobilePage.locator('button[aria-label*="Tutup"], button:has-text("Tutup")').first();
        if (await closeBtn.isVisible()) {
          await closeBtn.dispatchEvent('click');
          await mobilePage.waitForTimeout(100);
        }
      }
    }
    assert(tappedMobileCount === 12, `Mobile: Tapped all 12 units with panel confirmation (${tappedMobileCount}/12)`);

    // Reset view
    const resetBtnMobile = mobilePage.locator('button[title*="Tinjauan"], button[title*="Overview"]').first();
    if (await resetBtnMobile.isVisible()) {
      await resetBtnMobile.click();
      await mobilePage.waitForTimeout(300);
    }

    // Capture 3 Zoomed Views on Mobile:
    // a) Rektorat - Taman Area
    console.log('Mobile: Capturing Zoomed View 1: Rektorat–Taman Area...');
    const fsmMarkerMobile = mobilePage.locator('#marker-fsm').first();
    if (await fsmMarkerMobile.count() > 0) {
      await fsmMarkerMobile.dispatchEvent('click');
      await mobilePage.waitForTimeout(600);
      await mobilePage.screenshot({ path: path.join(artifactDir, 'zoomed-rektorat-taman-390x844.png') });
      console.log('✓ Saved mobile zoomed view: Rektorat–Taman');
    }

    // b) FT Cluster
    console.log('Mobile: Capturing Zoomed View 2: FT Cluster...');
    const ftMarkerMobile = mobilePage.locator('#marker-ft').first();
    if (await ftMarkerMobile.count() > 0) {
      await ftMarkerMobile.dispatchEvent('click');
      await mobilePage.waitForTimeout(600);
      await mobilePage.screenshot({ path: path.join(artifactDir, 'zoomed-ft-cluster-390x844.png') });
      console.log('✓ Saved mobile zoomed view: FT Cluster');
    }

    // c) FK / FKM / RSND
    console.log('Mobile: Capturing Zoomed View 3: FK / FKM / RSND Cluster...');
    const fkMarkerMobile = mobilePage.locator('#marker-fk').first();
    if (await fkMarkerMobile.count() > 0) {
      await fkMarkerMobile.dispatchEvent('click');
      await mobilePage.waitForTimeout(600);
      await mobilePage.screenshot({ path: path.join(artifactDir, 'zoomed-fk-fkm-rsnd-390x844.png') });
      console.log('✓ Saved mobile zoomed view: FK/FKM/RSND');
    }

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
    await desktopPage.waitForTimeout(800);

    // 1. Overview Desktop Screenshot
    const overviewDesktopPath = path.join(artifactDir, 'overview-desktop-1440x900.png');
    await desktopPage.screenshot({ path: overviewDesktopPath });
    console.log(`✓ Saved desktop overview screenshot: ${overviewDesktopPath}`);

    // Tap each of the 12 faculty units on desktop
    console.log('Testing tap on all 12 faculty units on desktop...');
    let tappedDesktopCount = 0;
    for (const fid of facultyIds) {
      const marker = desktopPage.locator(`#marker-${fid}`).first();
      if (await marker.count() > 0) {
        await marker.dispatchEvent('click');
        await desktopPage.waitForTimeout(200);

        const tourSheet = desktopPage.locator('[aria-label*="Detail Fakultas"], [aria-label*="Peta"]').first();
        if (await tourSheet.count() > 0) tappedDesktopCount++;

        const closeBtn = desktopPage.locator('button[aria-label*="Tutup"], button:has-text("Tutup")').first();
        if (await closeBtn.isVisible()) {
          await closeBtn.dispatchEvent('click');
          await desktopPage.waitForTimeout(100);
        }
      }
    }
    assert(tappedDesktopCount === 12, `Desktop: Tapped all 12 units with panel confirmation (${tappedDesktopCount}/12)`);

    // Reset view
    const resetBtnDesktop = desktopPage.locator('button[title*="Tinjauan"], button[title*="Overview"]').first();
    if (await resetBtnDesktop.isVisible()) {
      await resetBtnDesktop.click();
      await desktopPage.waitForTimeout(300);
    }

    // Capture 3 Zoomed Views on Desktop:
    // a) Rektorat - Taman Area
    console.log('Desktop: Capturing Zoomed View 1: Rektorat–Taman Area...');
    const fsmMarkerDesktop = desktopPage.locator('#marker-fsm').first();
    if (await fsmMarkerDesktop.count() > 0) {
      await fsmMarkerDesktop.dispatchEvent('click');
      await desktopPage.waitForTimeout(600);
      await desktopPage.screenshot({ path: path.join(artifactDir, 'zoomed-rektorat-taman-1440x900.png') });
      console.log('✓ Saved desktop zoomed view: Rektorat–Taman');
    }

    // b) FT Cluster
    console.log('Desktop: Capturing Zoomed View 2: FT Cluster...');
    const ftMarkerDesktop = desktopPage.locator('#marker-ft').first();
    if (await ftMarkerDesktop.count() > 0) {
      await ftMarkerDesktop.dispatchEvent('click');
      await desktopPage.waitForTimeout(600);
      await desktopPage.screenshot({ path: path.join(artifactDir, 'zoomed-ft-cluster-1440x900.png') });
      console.log('✓ Saved desktop zoomed view: FT Cluster');
    }

    // c) FK / FKM / RSND
    console.log('Desktop: Capturing Zoomed View 3: FK / FKM / RSND Cluster...');
    const fkMarkerDesktop = desktopPage.locator('#marker-fk').first();
    if (await fkMarkerDesktop.count() > 0) {
      await fkMarkerDesktop.dispatchEvent('click');
      await desktopPage.waitForTimeout(600);
      await desktopPage.screenshot({ path: path.join(artifactDir, 'zoomed-fk-fkm-rsnd-1440x900.png') });
      console.log('✓ Saved desktop zoomed view: FK/FKM/RSND');
    }

    // Verify attribution text
    const hasAttribution = await desktopPage.evaluate(() => {
      return document.body.innerText.includes('OpenStreetMap contributors');
    });
    assert(hasAttribution, 'Desktop: Attribution "© OpenStreetMap contributors" is visible');

    // Verify caption text
    const hasCaption = await desktopPage.evaluate(() => {
      return document.body.innerText.includes('Ilustrasi kampus — posisi bangunan disederhanakan');
    });
    assert(hasCaption, 'Desktop: Caption "Ilustrasi kampus — posisi bangunan disederhanakan" is visible');

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
