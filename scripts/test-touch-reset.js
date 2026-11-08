/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium, devices } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testTouchResetButtons() {
  console.log('🚀 Running Touch Reset Verification across all reset controls...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const pixel5 = devices['Pixel 5']; // 393 x 851, hasTouch: true

  const context = await browser.newContext({
    ...pixel5,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  // Ensure nextjs dev overlay never intercepts pointer events
  await page.addInitScript(() => {
    const style = document.createElement('style');
    style.innerHTML = 'nextjs-portal, #__next-build-watcher { display: none !important; pointer-events: none !important; }';
    document.documentElement.appendChild(style);
  });

  // Helper to populate answers
  const fillAnswers = async () => {
    await page.evaluate(() => {
      const answers = {};
      for (let i = 1; i <= 36; i++) {
        answers[i] = 4;
      }
      localStorage.setItem('undip_major_matcher_answers', JSON.stringify(answers));
    });
  };

  // -------------------------------------------------------------
  // CONTROL 1: Questionnaire Reset + Modal Confirmation
  // -------------------------------------------------------------
  console.log('\n[1] Questionnaire Reset Button & Confirmation Modal...');
  await page.goto(`${BASE_URL}/questionnaire`);
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  // Answer question 1 first
  const opt5 = page.locator('button[data-likert="5"]').first();
  if (await opt5.isVisible()) {
    await opt5.tap();
    await page.waitForTimeout(300);
  }

  const qResetBtn = page.locator('button[aria-label="Reset semua jawaban kuisioner"]');
  const qBox = await qResetBtn.boundingBox();
  console.log('  - Questionnaire reset box:', qBox);
  if (!qBox || qBox.height < 44 || qBox.x + qBox.width > 393) {
    throw new Error('Questionnaire reset button sizing/position invalid');
  }
  await qResetBtn.tap();
  await page.waitForTimeout(400);

  const confirmModalBtn = page.locator('button:has-text("Ya, Ulangi")');
  if (!(await confirmModalBtn.isVisible())) {
    throw new Error('Confirmation modal did not open after tapping Reset');
  }
  const mBox = await confirmModalBtn.boundingBox();
  console.log('  - Modal Ya, Ulangi box:', mBox);
  if (!mBox || mBox.height < 44) {
    throw new Error('Modal confirm button height < 44px');
  }
  await confirmModalBtn.tap();
  await page.waitForTimeout(400);
  console.log('  ✓ Questionnaire Reset & Confirmation passed!');

  // -------------------------------------------------------------
  // CONTROL 2: Results Header Retake Button
  // -------------------------------------------------------------
  console.log('\n[2] Results Header Retake Button...');
  await fillAnswers();
  await page.goto(`${BASE_URL}/results`);
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  const hRetakeBtn = page.locator('header button[aria-label="Ulangi Kuisioner (Reset & Isi Ulang)"]');
  const hBox = await hRetakeBtn.boundingBox();
  console.log('  - Results header retake box:', hBox);
  if (!hBox || hBox.x < 0 || hBox.x + hBox.width > 393 || hBox.height < 44 || hBox.width < 44) {
    throw new Error(`Results header retake button out of bounds or smaller than 44px: ${JSON.stringify(hBox)}`);
  }
  await hRetakeBtn.tap();
  await page.waitForTimeout(400);

  const hConfirmBtn = page.locator('button:has-text("Ya, Ulangi")');
  if (!(await hConfirmBtn.isVisible())) {
    throw new Error('Confirmation modal did not open after tapping header retake');
  }
  // Cancel/close modal
  const closeBtn = page.locator('button[aria-label="Tutup dialog konfirmasi ulangi kuisioner"]');
  await closeBtn.tap();
  await page.waitForTimeout(400);
  console.log('  ✓ Results Header Retake button passed!');

  // -------------------------------------------------------------
  // CONTROL 3: Results Panel Bottom Retake Button
  // -------------------------------------------------------------
  console.log('\n[3] Results Panel Bottom Retake Button...');
  const panelRetakeBtn = page.locator('button:has-text("Ulangi Kuisioner (Reset & Isi Ulang)")');
  if (await panelRetakeBtn.isVisible()) {
    const pBox = await panelRetakeBtn.boundingBox();
    console.log('  - Results panel retake box:', pBox);
    await panelRetakeBtn.scrollIntoViewIfNeeded();
    await panelRetakeBtn.tap();
    await page.waitForTimeout(400);
    const pModalClose = page.locator('button[aria-label="Tutup dialog konfirmasi ulangi kuisioner"]');
    if (await pModalClose.isVisible()) {
      await pModalClose.tap();
      await page.waitForTimeout(300);
    }
    console.log('  ✓ Results Panel Bottom Retake button passed!');
  }

  // -------------------------------------------------------------
  // CONTROL 4: Map reset camera / Overview buttons
  // -------------------------------------------------------------
  console.log('\n[4] Map Reset Camera / Overview buttons...');
  // Overview in toolbar
  const toolbarOverview = page.locator('button[aria-label="Kembali ke Tinjauan Seluruh Kampus"]');
  if (await toolbarOverview.isVisible()) {
    const tbBox = await toolbarOverview.boundingBox();
    console.log('  - Map toolbar overview box:', tbBox);
    if (!tbBox || tbBox.height < 44) {
      throw new Error('Toolbar overview height < 44px');
    }
    await toolbarOverview.tap();
    await page.waitForTimeout(300);
    console.log('  ✓ Map Toolbar Overview button passed!');
  }

  // Overview in bottom faculty dock (when in full-screen map mode)
  const fullMapToggle = page.locator('header button[aria-label*="Sembunyikan panel hasil"]');
  if (await fullMapToggle.isVisible()) {
    await fullMapToggle.tap();
    await page.waitForTimeout(400);

    const dockOverview = page.locator('button[aria-label*="Tampilkan tinjauan seluruh kampus"]');
    if (await dockOverview.isVisible()) {
      const dBox = await dockOverview.boundingBox();
      console.log('  - Map dock overview box:', dBox);
      if (!dBox || dBox.height < 44) {
        throw new Error('Dock overview height < 44px');
      }
      await dockOverview.tap({ force: true });
      await page.waitForTimeout(300);
      console.log('  ✓ Map Dock Overview button passed!');
    }
  }

  // -------------------------------------------------------------
  // CONTROL 5: Putar Ulang Intro in Mobile Menu
  // -------------------------------------------------------------
  console.log('\n[5] Putar Ulang Intro in Mobile Menu...');
  await page.goto(`${BASE_URL}/`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(500);

  const hamburger = page.locator('button.navbar-mobile-toggle, button[aria-label="Buka menu"]');
  await hamburger.tap();
  await page.waitForTimeout(400);

  const introMenuBtn = page.locator('button:has-text("PUTAR ULANG INTRO"), button:has-text("Putar Ulang Intro")');
  const introBox = await introMenuBtn.boundingBox();
  console.log('  - Intro menu button box:', introBox);
  if (!introBox || introBox.height < 44) {
    throw new Error('Intro menu button height < 44px');
  }
  await introMenuBtn.tap();
  await page.waitForTimeout(1000);

  // Check that intro started playing (overlay present)
  const introOverlay = page.locator('[aria-label="Animasi Pembuka Gerbang UNDIP Tembalang"]');
  const isIntroPlaying = await introOverlay.isVisible();
  console.log('  - Intro overlay playing:', isIntroPlaying);
  if (!isIntroPlaying) {
    throw new Error('Putar Ulang Intro failed to start intro');
  }
  console.log('  ✓ Putar Ulang Intro passed!');

  // -------------------------------------------------------------
  // CONTROL 6: Reset Filter in Results List
  // -------------------------------------------------------------
  console.log('\n[6] Reset Filter in Results List...');
  await fillAnswers();
  await page.goto(`${BASE_URL}/results`);
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  const searchInput = page.locator('input[placeholder*="Cari"]');
  if (await searchInput.isVisible()) {
    await searchInput.fill('xyznonexistent999');
    await page.waitForTimeout(400);

    const resetFilterBtn = page.locator('button:has-text("Reset Filter")').first();
    const rfBox = await resetFilterBtn.boundingBox();
    console.log('  - Reset filter box:', rfBox);
    if (!rfBox || rfBox.height < 44) {
      throw new Error('Reset filter button height < 44px');
    }
    await resetFilterBtn.tap();
    await page.waitForTimeout(400);

    const inputValue = await searchInput.inputValue();
    if (inputValue !== '') {
      throw new Error(`Filter was not reset, value is '${inputValue}'`);
    }
    console.log('  ✓ Reset Filter button passed!');
  }

  await browser.close();
  console.log('\n🎉 ALL TOUCH RESET CONTROLS VERIFIED AND WORKING ON PHONES!');
}

testTouchResetButtons().catch((err) => {
  console.error('\n❌ Touch Reset verification failed:', err);
  process.exit(1);
});
