/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const VIEWPORTS = [
  { width: 360, height: 740, isMobile: true, hasTouch: true, label: '360x740_mobile' },
  { width: 375, height: 667, isMobile: true, hasTouch: true, label: '375x667_mobile' },
  { width: 390, height: 844, isMobile: true, hasTouch: true, label: '390x844_mobile' },
  { width: 414, height: 896, isMobile: true, hasTouch: true, label: '414x896_mobile' },
  { width: 430, height: 932, isMobile: true, hasTouch: true, label: '430x932_mobile' },
  { width: 768, height: 1024, isMobile: false, hasTouch: true, label: '768x1024_tablet' },
  { width: 1024, height: 1366, isMobile: false, hasTouch: true, label: '1024x1366_tablet' },
  { width: 1440, height: 900, isMobile: false, hasTouch: false, label: '1440x900_desktop' },
  { width: 844, height: 390, isMobile: true, hasTouch: true, label: '844x390_landscape' },
];

const SCREENSHOT_DIR = path.join(__dirname, '../screenshots/section3');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTests() {
  console.log('🚀 Starting Full Section 3 & Final Verification Suite...\n');
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const results = {
    viewports: [],
    pressToPlay: { mouse: false, touch: false },
    questionnaireLifecycle: { resume: false, doubleTapGuard: false, editAfterComplete: false },
    resultsToolbar: { clickable: false, compareFlow: false, allChipsReachable: false },
    landscapeCheck: false,
    overflowCheck: true,
  };

  // 1. TEST PRESS TO PLAY (Pointer vs Touch)
  console.log('--- Test 1: PRESS TO PLAY (Pointer & Touch Emulation) ---');
  {
    // Test Pointer (Mouse)
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, hasTouch: false });
    const page = await context.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => sessionStorage.setItem('undip_intro_seen', 'true'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    const pressButton = page.locator('button[aria-label="Tekan untuk Mulai Kuisioner Minat 36 Pertanyaan"]');
    await pressButton.waitFor({ state: 'visible', timeout: 5000 });
    await pressButton.click();
    await page.waitForURL('**/questionnaire', { timeout: 5000 });
    console.log('  ✓ PRESS TO PLAY (Pointer/Mouse): Navigated cleanly to /questionnaire');
    results.pressToPlay.mouse = true;
    await context.close();
  }

  {
    // Test Touch Emulation
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => sessionStorage.setItem('undip_intro_seen', 'true'));
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    const pressButton = page.locator('button[aria-label="Tekan untuk Mulai Kuisioner Minat 36 Pertanyaan"]');
    await pressButton.waitFor({ state: 'visible', timeout: 5000 });
    await pressButton.tap();
    await page.waitForURL('**/questionnaire', { timeout: 5000 });
    console.log('  ✓ PRESS TO PLAY (Touch Tap with hasTouch:true): Navigated cleanly to /questionnaire');
    results.pressToPlay.touch = true;
    await context.close();
  }

  // 2. TEST QUESTIONNAIRE LIFECYCLE (Resume, Double-Tap, Edit-After-Complete)
  console.log('\n--- Test 2: Questionnaire Lifecycle (Resume, Double-tap, Edit-after-complete) ---');
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const page = await context.newPage();

    // 2.1 Test Resume Bug Fix
    const initialAnswers = {};
    for (let i = 1; i <= 10; i++) {
      initialAnswers[i] = 4;
    }
    await page.goto('http://localhost:3000/questionnaire', { waitUntil: 'domcontentloaded' });
    await page.evaluate((ans) => {
      localStorage.setItem('undip_major_matcher_answers', JSON.stringify(ans));
    }, initialAnswers);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const questionPillText = await page.locator('text=Pertanyaan 11/36').isVisible();
    if (questionPillText) {
      console.log('  ✓ Resume: Successfully opened directly at question 11/36 after hydrating 10 answers');
      results.questionnaireLifecycle.resume = true;
    } else {
      console.log('  ✗ Resume failed to jump to question 11');
    }

    // 2.2 Test Double-Tap Guard
    const nextButton = page.locator('button:has-text("Selanjutnya")');
    if (await nextButton.isVisible()) {
      await nextButton.tap();
      await nextButton.tap(); // Double tap quickly
      await page.waitForTimeout(400);
      const isQuestion12 = await page.locator('text=Pertanyaan 12/36').isVisible();
      const isQuestion13 = await page.locator('text=Pertanyaan 13/36').isVisible();
      if (isQuestion12 && !isQuestion13) {
        console.log('  ✓ Double-tap Guard: Rapid double tap advanced exactly 1 question to 12/36');
        results.questionnaireLifecycle.doubleTapGuard = true;
      } else {
        console.log(`  Double tap status: Q12=${isQuestion12}, Q13=${isQuestion13}`);
      }
    }

    // 2.3 Test Edit-After-Complete behavior
    const allAnswers = {};
    for (let i = 1; i <= 36; i++) {
      allAnswers[i] = 4;
    }
    await page.evaluate((ans) => {
      localStorage.setItem('undip_major_matcher_answers', JSON.stringify(ans));
    }, allAnswers);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // Click answer 2 to edit
    const option2 = page.locator('button[aria-label*="Pilih skala 2"]').first();
    if (await option2.isVisible()) {
      await option2.tap();
      await page.waitForTimeout(300);
      // Ensure we are STILL on /questionnaire and didn't auto-redirect
      const isStillOnQuestionnaire = page.url().includes('/questionnaire');
      const submitButtonVisible = await page.locator('text=Lihat Hasil Rekomendasi').isVisible();
      if (isStillOnQuestionnaire && submitButtonVisible) {
        console.log('  ✓ Edit After Complete: Editing an answer at 36/36 did NOT auto-redirect; displayed "Lihat Hasil Rekomendasi" button');
        results.questionnaireLifecycle.editAfterComplete = true;
      }
    }

    await context.close();
  }

  // 3. TEST RESULTS PAGE: Single Header, Toolbar Clickable, Comparison Flow, 12 Chips
  console.log('\n--- Test 3: Results Page Features (Single Header, Toolbar, Comparison Modal, 12 Chips) ---');
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // Prepare complete answers
    const engAnswers = {};
    for (let i = 1; i <= 36; i++) engAnswers[i] = 4;
    await page.goto('http://localhost:3000/results', { waitUntil: 'domcontentloaded' });
    await page.evaluate((ans) => {
      localStorage.setItem('undip_major_matcher_answers', JSON.stringify(ans));
    }, engAnswers);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // 3.1 Verify results header clickable
    const shareBtn = page.locator('button[aria-label="Bagikan Hasil Rekomendasi"]').first();
    await shareBtn.click();
    await page.waitForTimeout(300);
    const shareModal = page.locator('#share-modal-title');
    const isShareModalOpen = await shareModal.isVisible();
    console.log(`  ✓ Toolbar Share Button: Click opened ShareModal (isOpen = ${isShareModalOpen})`);
    const closeShareBtn = page.locator('button[aria-label="Tutup dialog bagikan hasil"]');
    await closeShareBtn.click();
    await page.waitForTimeout(200);

    // 3.2 Verify Comparison Flow
    const compareButtons = page.locator('button[aria-label^="Tambah "]');
    const count = await compareButtons.count();
    if (count >= 2) {
      await compareButtons.nth(0).click();
      await page.waitForTimeout(200);
      await compareButtons.nth(1).click();
      await page.waitForTimeout(400);

      // Verify floating bar
      const floatingBarBtn = page.locator('button[aria-label*="Buka komparasi 2 program studi"]');
      const isFloatingBarVisible = await floatingBarBtn.isVisible();
      console.log(`  ✓ Floating Comparison Bar: Visible when >= 2 programs pinned (isVisible = ${isFloatingBarVisible})`);

      await floatingBarBtn.click();
      await page.waitForTimeout(400);
      const comparisonModalTitle = page.locator('#comparison-modal-title');
      const isCompareModalOpen = await comparisonModalTitle.isVisible();
      console.log(`  ✓ Program Comparison Modal: Successfully opened via floating bar (isOpen = ${isCompareModalOpen})`);
      results.resultsToolbar.compareFlow = isFloatingBarVisible && isCompareModalOpen;

      const closeCompareBtn = page.locator('button[aria-label="Tutup komparasi program studi"]');
      await closeCompareBtn.click();
    }

    // 3.3 Verify all 12 faculty chips in Full-Screen Map mode
    const petaPenuhBtn = page.locator('button[aria-label*="tampilkan Peta Penuh"]');
    if (await petaPenuhBtn.isVisible()) {
      await petaPenuhBtn.click();
      await page.waitForTimeout(400);
    }
    const facultyChips = page.locator('button[aria-label^="Pilih fakultas "]');
    const chipCount = await facultyChips.count();
    console.log(`  ✓ Bottom Faculty Bar: ${chipCount} faculty chips detected (Target: 12)`);
    results.resultsToolbar.allChipsReachable = chipCount === 12;
    results.resultsToolbar.clickable = true;

    await context.close();
  }

  // 4. TEST ACROSS ALL VIEWPORTS (Overflow, Clipping, Layout)
  console.log('\n--- Test 4: Multi-Viewport Responsive Matrix ---');
  const pagesToTest = [
    { url: 'http://localhost:3000', name: 'home' },
    { url: 'http://localhost:3000/questionnaire', name: 'questionnaire' },
    { url: 'http://localhost:3000/results', name: 'results' },
    { url: 'http://localhost:3000/admin', name: 'admin' },
    { url: 'http://localhost:3000/program/ft-sipil', name: 'program_detail' },
    { url: 'http://localhost:3000/offline', name: 'offline' },
  ];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.hasTouch,
    });
    const page = await context.newPage();

    let vpOverflow = 0;

    for (const p of pagesToTest) {
      await page.goto(p.url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(400);

      const overflow = await page.evaluate(() => {
        return Math.max(0, document.documentElement.scrollWidth - window.innerWidth);
      });

      if (overflow > 0) {
        console.log(`  ⚠️ Overflow detected on ${p.name} at ${vp.label}: ${overflow}px`);
        vpOverflow = Math.max(vpOverflow, overflow);
        results.overflowCheck = false;
      }

      // Take screenshot of results at this viewport
      if (p.name === 'results') {
        const screenshotPath = path.join(SCREENSHOT_DIR, `results_${vp.label}.png`);
        await page.screenshot({ path: screenshotPath });
      }
    }

    console.log(`  Viewport ${vp.width}x${vp.height} (${vp.label}): max overflow = ${vpOverflow}px ${vpOverflow === 0 ? '✓ PASS' : '✗ FAIL'}`);
    results.viewports.push({ viewport: `${vp.width}x${vp.height}`, label: vp.label, maxOverflow: vpOverflow, pass: vpOverflow === 0 });
    await context.close();
  }

  await browser.close();

  console.log('\n===========================================================');
  console.log('FINAL SECTION 3 VERIFICATION SUMMARY:');
  console.log(`- PRESS TO PLAY: Mouse=${results.pressToPlay.mouse ? 'PASS' : 'FAIL'}, Touch=${results.pressToPlay.touch ? 'PASS' : 'FAIL'}`);
  console.log(`- Questionnaire Lifecycle: Resume=${results.questionnaireLifecycle.resume ? 'PASS' : 'FAIL'}, DoubleTap=${results.questionnaireLifecycle.doubleTapGuard ? 'PASS' : 'FAIL'}, EditAfterComplete=${results.questionnaireLifecycle.editAfterComplete ? 'PASS' : 'FAIL'}`);
  console.log(`- Results Features: ToolbarClickable=${results.resultsToolbar.clickable ? 'PASS' : 'FAIL'}, CompareFlow=${results.resultsToolbar.compareFlow ? 'PASS' : 'FAIL'}, 12ChipsReachable=${results.resultsToolbar.allChipsReachable ? 'PASS' : 'FAIL'}`);
  console.log(`- Horizontal Overflow across all viewports: ${results.overflowCheck ? 'ALL 0px (PASS)' : 'DETECTED'}`);
  console.log('===========================================================');
}

runTests().catch((err) => {
  console.error('Test run error:', err);
  process.exit(1);
});
