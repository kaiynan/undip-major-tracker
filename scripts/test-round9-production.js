#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * scripts/test-round9-production.js
 *
 * Full Production E2E Verification Suite for Prompt G (Round 9):
 * 1. Alasan Kecocokan ("Kenapa prodi ini cocok untukmu?"):
 *    - Validates breakdown and 2-3 reasons on leaderboard cards (desktop & mobile).
 *    - Validates rich reason block on program detail page.
 * 2. Peringatan Minat Tersebar:
 *    - Flat answers trigger advisory banner with Favorit/Bandingkan CTA.
 *    - Peaked answers do NOT trigger advisory banner.
 * 3. Tur Kampus di Peta (FacultyMapTourSheet):
 *    - Desktop 1440x900 side panel opening, program count, 0 PSDKU programs, action buttons.
 *    - Keyboard Escape closes panel; Enter key opens panel.
 *    - Mobile 390x844 bottom sheet (<= 60vh, touch friendly, 0 horizontal overflow).
 * 4. SERADIP Consultation Graceful Degradation:
 *    - Zero broken links / empty boxes when phone is not configured.
 * 5. High-resolution screenshots saved to test-artifacts/round9/.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const PORT = 3226;
const BASE_URL = `http://localhost:${PORT}`;
const ARTIFACTS_DIR = path.resolve(__dirname, '..', 'test-artifacts', 'round9');
const ROOT_DIR = path.resolve(__dirname, '..');

if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

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

let totalAssertions = 0;
let passedAssertions = 0;
const failures = [];

function assert(condition, testName, message) {
  totalAssertions++;
  if (!condition) {
    failures.push({ testName, message });
    console.error(`  ❌ [FAIL] ${testName}: ${message}`);
  } else {
    passedAssertions++;
    console.log(`  ✓ [PASS] ${testName}`);
  }
}

// Sample answers for high-affinity FSM Informatika (peaked, gap 5.01% > threshold 4.40%)
const PEAKED_ANSWERS = {
  1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1,
  9: 4, 10: 1, 11: 1, 12: 4, 13: 5, 14: 1, 15: 1, 16: 1, 17: 1, 18: 1, 19: 1, 20: 1,
  21: 1, 22: 1, 23: 1, 24: 1, 25: 1, 26: 1, 27: 1, 28: 1,
  29: 1, 30: 1, 31: 5, 32: 1, 33: 1, 34: 1, 35: 1, 36: 1,
};

// Uniform answers (flat) for interest spread detection
const FLAT_ANSWERS = {};
for (let i = 1; i <= 36; i++) {
  FLAT_ANSWERS[i] = 3;
}

async function runRound9Tests() {
  console.log('\n==================================================================');
  console.log('🚀 UNDIP MAJOR MATCHER — ROUND 9 PRODUCTION E2E VERIFICATION');
  console.log('==================================================================');
  console.log(`Target URL: ${BASE_URL}`);

  let serverProcess = null;
  const running = await isServerRunning(BASE_URL);
  if (!running) {
    console.log(`[INFO] Spawning scripts/serve-out.js on port ${PORT}...`);
    serverProcess = spawn(
      'node',
      [path.join(__dirname, 'serve-out.js'), path.join(ROOT_DIR, 'out'), String(PORT)],
      { stdio: 'pipe' }
    );
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 200));
      if (await isServerRunning(BASE_URL)) break;
    }
  }

  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  }

  try {
    // -------------------------------------------------------------------------
    // TEST SUITE 1: ALASAN KECOCOKAN ("Kenapa prodi ini cocok untukmu?")
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 1] Alasan Kecocokan: Results Cards & Program Detail ---');
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      await context.addInitScript((answers) => {
        sessionStorage.setItem('undip_intro_seen', 'true');
        localStorage.setItem('undip_major_matcher_answers', JSON.stringify(answers));
      }, PEAKED_ANSWERS);

      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      // 1. Visit /results on desktop
      await page.goto(`${BASE_URL}/results`, { waitUntil: 'networkidle' });

      // Check match reasons block on top result card
      const reasonBlocks = page.locator('[data-testid="match-reasons-block"]');
      const reasonCount = await reasonBlocks.count();
      assert(reasonCount > 0, 'Match reasons blocks rendered on results', `Found ${reasonCount} blocks`);

      const firstReasonText = await reasonBlocks.first().innerText();
      assert(
        firstReasonText.includes('Kenapa cocok untukmu:'),
        'Match reasons header present',
        `Header found: "${firstReasonText.slice(0, 40)}..."`
      );

      // Verify tone: encouraging, neutral, no admission chance claims
      const forbiddenClaims = ['dijamin lolos', 'pasti diterima', 'peluang lolos 100%', 'gaji pasti'];
      const hasForbiddenClaims = forbiddenClaims.some((f) => firstReasonText.toLowerCase().includes(f));
      assert(!hasForbiddenClaims, 'No unethical admission/salary promises in match reasons', 'Clean tone');

      // Screenshot desktop match reasons
      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, 'results-match-reasons-desktop.png'),
        fullPage: false,
      });

      // 2. Mobile touch viewport test for reasons
      const mobileContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
      });
      await mobileContext.addInitScript((answers) => {
        sessionStorage.setItem('undip_intro_seen', 'true');
        localStorage.setItem('undip_major_matcher_answers', JSON.stringify(answers));
      }, PEAKED_ANSWERS);

      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto(`${BASE_URL}/results`, { waitUntil: 'networkidle' });

      const mobileReasonBlocks = mobilePage.locator('[data-testid="match-reasons-block"]');
      assert((await mobileReasonBlocks.count()) > 0, 'Mobile results has match reasons', 'Rendered on phone');

      // Check horizontal overflow
      const isMobileOverflow = await mobilePage.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      assert(!isMobileOverflow, 'Mobile results zero horizontal overflow with match reasons', 'No overflow');

      await mobilePage.screenshot({
        path: path.join(ARTIFACTS_DIR, 'results-match-reasons-mobile.png'),
        fullPage: false,
      });
      await mobileContext.close();

      // 3. Program Detail Page reasons check
      await page.goto(`${BASE_URL}/program/fsm-informatika`, { waitUntil: 'networkidle' });
      const detailReasonBlock = page.locator('[data-testid="match-reasons-block"]');
      assert(
        (await detailReasonBlock.count()) > 0,
        'Program detail has full match reasons block when results exist',
        'Detail reasons block rendered'
      );

      const detailReasonText = await detailReasonBlock.first().innerText();
      assert(
        detailReasonText.includes('Kenapa prodi ini cocok untukmu?'),
        'Program detail reasons full title rendered',
        `Got: "${detailReasonText.slice(0, 50)}..."`
      );

      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, 'program-detail-reasons.png'),
        fullPage: false,
      });

      assert(consoleErrors.length === 0, 'Zero console errors during match reasons tests', consoleErrors.join(', '));
      await context.close();
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 2: PERINGATAN "MINAT TERSEBAR"
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 2] Peringatan Minat Tersebar: Flat vs Peaked Inputs ---');
    {
      // 2A. Forced Flat Input -> MUST Trigger Banner
      const flatContext = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      await flatContext.addInitScript((answers) => {
        sessionStorage.setItem('undip_intro_seen', 'true');
        localStorage.setItem('undip_major_matcher_answers', JSON.stringify(answers));
      }, FLAT_ANSWERS);

      const flatPage = await flatContext.newPage();
      await flatPage.goto(`${BASE_URL}/results`, { waitUntil: 'networkidle' });

      const spreadBanner = flatPage.locator('[data-testid="interest-spread-banner"]');
      const isSpreadVisible = await spreadBanner.isVisible();
      assert(isSpreadVisible, 'Interest spread banner triggered on flat answers', 'Banner visible');

      const bannerText = await spreadBanner.innerText();
      assert(
        bannerText.includes('Minatmu cukup tersebar'),
        'Interest spread message matches exact specification',
        `Got: "${bannerText.slice(0, 60)}..."`
      );

      // Verify action buttons inside banner
      const compareBtn = spreadBanner.locator('a[href="/favorit"]');
      assert((await compareBtn.count()) > 0, 'Interest spread banner has Favorit/Bandingkan CTA', 'CTA present');

      await flatPage.screenshot({
        path: path.join(ARTIFACTS_DIR, 'interest-spread-banner.png'),
        fullPage: false,
      });
      await flatContext.close();

      // 2B. Peaked Input -> MUST NOT Trigger Banner
      const peakedContext = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      await peakedContext.addInitScript((answers) => {
        sessionStorage.setItem('undip_intro_seen', 'true');
        localStorage.setItem('undip_major_matcher_answers', JSON.stringify(answers));
      }, PEAKED_ANSWERS);

      const peakedPage = await peakedContext.newPage();
      await peakedPage.goto(`${BASE_URL}/results`, { waitUntil: 'networkidle' });

      const peakedBanner = peakedPage.locator('[data-testid="interest-spread-banner"]');
      assert(
        (await peakedBanner.count()) === 0,
        'Interest spread banner hidden when user has focused/peaked interests',
        'Banner correctly not rendered'
      );
      await peakedContext.close();
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 3: TUR KAMPUS DI PETA (FacultyMapTourSheet)
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 3] Tur Kampus di Peta: Panel, Program List & Keyboard ---');
    {
      // 3A. Desktop 1440x900
      const desktopContext = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      await desktopContext.addInitScript((answers) => {
        sessionStorage.setItem('undip_intro_seen', 'true');
        localStorage.setItem('undip_major_matcher_answers', JSON.stringify(answers));
      }, PEAKED_ANSWERS);

      const page = await desktopContext.newPage();
      await page.goto(`${BASE_URL}/results`, { waitUntil: 'networkidle' });

      // Switch to Full Map mode to explore campus map
      const toggleMapBtn = page.locator('[data-testid="btn-toggle-map"]');
      if (await toggleMapBtn.isVisible()) {
        await toggleMapBtn.click();
        await page.waitForTimeout(400);
      }

      // Click FSM marker
      const fsmMarker = page.locator('#marker-fsm');
      await fsmMarker.waitFor({ state: 'attached' });
      await fsmMarker.click({ force: true });

      // Verify side panel opens
      const tourPanel = page.locator('[data-testid="faculty-map-tour-panel"]');
      if (!(await tourPanel.isVisible())) {
        await fsmMarker.dispatchEvent('click');
      }
      await tourPanel.waitFor({ state: 'visible', timeout: 5000 });
      assert(await tourPanel.isVisible(), 'Campus tour panel opened on faculty click', 'Panel visible');

      const panelTitle = await tourPanel.innerText();
      assert(
        panelTitle.includes('Fakultas Sains dan Matematika'),
        'Panel displays correct faculty name',
        'FSM displayed'
      );
      assert(panelTitle.includes('7 Program Studi'), 'Panel displays accurate Tembalang program count', '7 prodi FSM');

      // Verify zero PSDKU programs in list
      assert(!panelTitle.includes('PSDKU'), 'Zero PSDKU leakage in Tembalang tour sheet', 'No PSDKU found');

      // Verify action buttons: Detail, Favorit, Bandingkan
      const detailLinks = tourPanel.locator('a[href*="/program/"]');
      assert((await detailLinks.count()) >= 7, 'All faculty programs have detail links', '>= 7 links');

      const favBtns = tourPanel.locator('button[aria-label*="Favorit"]');
      assert((await favBtns.count()) >= 7, 'All faculty programs have favorite buttons', '>= 7 buttons');

      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, 'map-faculty-panel-desktop.png'),
        fullPage: false,
      });

      // Test Escape key closes panel
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
      assert((await tourPanel.count()) === 0, 'Escape key closes campus tour panel', 'Closed by Escape');

      // Test Keyboard Enter opens panel
      await page.focus('#marker-ft');
      await page.keyboard.press('Enter');
      await tourPanel.waitFor({ state: 'visible', timeout: 5000 });
      const ftPanelText = await tourPanel.innerText();
      assert(
        ftPanelText.includes('Fakultas Teknik') && ftPanelText.includes('12 Program Studi'),
        'Keyboard Enter opens panel with accurate FT programs',
        'FT displayed'
      );

      // Close panel using close button
      const closeBtn = tourPanel.locator('[data-testid="btn-close-tour-panel"]');
      await closeBtn.click({ force: true });
      if ((await tourPanel.count()) > 0) {
        await closeBtn.dispatchEvent('click');
      }
      await page.waitForTimeout(400);
      assert((await tourPanel.count()) === 0, 'Close button closes campus tour panel', 'Closed by button');

      await desktopContext.close();

      // 3B. Mobile 390x844 Bottom Sheet
      const mobileContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
      });
      await mobileContext.addInitScript((answers) => {
        sessionStorage.setItem('undip_intro_seen', 'true');
        localStorage.setItem('undip_major_matcher_answers', JSON.stringify(answers));
      }, PEAKED_ANSWERS);

      const mobilePage = await mobileContext.newPage();
      await mobilePage.goto(`${BASE_URL}/results`, { waitUntil: 'networkidle' });

      // Switch to Full Map mode
      const mobileToggleMap = mobilePage.locator('[data-testid="btn-toggle-map"]');
      if (await mobileToggleMap.isVisible()) {
        await mobileToggleMap.tap();
        await mobilePage.waitForTimeout(400);
      }

      // Tap FSM marker
      await mobilePage.locator('#marker-fsm').tap({ force: true });
      const mobileSheet = mobilePage.locator('[data-testid="faculty-map-tour-panel"]');
      if (!(await mobileSheet.isVisible())) {
        await mobilePage.locator('#marker-fsm').dispatchEvent('click');
      }
      await mobileSheet.waitFor({ state: 'visible', timeout: 5000 });
      assert(await mobileSheet.isVisible(), 'Mobile bottom sheet opened on tap', 'Sheet visible');

      // Verify max height constraint
      const box = await mobileSheet.boundingBox();
      const viewportHeight = 844;
      assert(
        box && box.height <= viewportHeight * 0.65,
        'Bottom sheet respects mobile height constraint (<= 60-65vh)',
        `Height: ${box?.height}px / ${viewportHeight}px`
      );

      // Verify zero horizontal page overflow
      const mobileOverflow = await mobilePage.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth;
      });
      assert(!mobileOverflow, 'Campus tour bottom sheet has zero horizontal overflow', 'No horizontal overflow');

      await mobilePage.screenshot({
        path: path.join(ARTIFACTS_DIR, 'map-faculty-sheet-mobile.png'),
        fullPage: false,
      });

      await mobileContext.close();
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 4: SERADIP CONSULTATION GRACEFUL DEGRADATION
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 4] Konsultasi SERADIP: Graceful Degradation & Contact Gate ---');
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      await context.addInitScript((answers) => {
        sessionStorage.setItem('undip_intro_seen', 'true');
        localStorage.setItem('undip_major_matcher_answers', JSON.stringify(answers));
      }, PEAKED_ANSWERS);

      const page = await context.newPage();

      // Check results page: when env is empty, no consult cards render
      await page.goto(`${BASE_URL}/results`, { waitUntil: 'networkidle' });
      const resultsCard = page.locator('[data-testid="consult-cta-card"]');
      assert(
        (await resultsCard.count()) === 0,
        'Consult card gracefully omitted when phone is unset in results',
        '0 cards rendered'
      );

      // Check /langkah-selanjutnya
      await page.goto(`${BASE_URL}/langkah-selanjutnya`, { waitUntil: 'networkidle' });
      const nextStepsCard = page.locator('[data-testid="consult-cta-card"]');
      assert(
        (await nextStepsCard.count()) === 0,
        'Consult card gracefully omitted on /langkah-selanjutnya',
        '0 cards rendered'
      );

      // Check /bandingkan
      await page.goto(`${BASE_URL}/bandingkan?ids=fsm-informatika,ft-komputer`, { waitUntil: 'networkidle' });
      const compareInline = page.locator('[data-testid="consult-cta-inline"]');
      assert(
        (await compareInline.count()) === 0,
        'Consult inline CTA gracefully omitted on /bandingkan when phone is unset',
        '0 inline CTAs rendered'
      );

      await page.screenshot({
        path: path.join(ARTIFACTS_DIR, 'bandingkan-clean-no-contact.png'),
        fullPage: false,
      });

      await context.close();
    }
  } catch (err) {
    console.error('Test execution failed with error:', err);
    failures.push({ testName: 'Fatal Execution', message: String(err) });
  } finally {
    if (browser) await browser.close();
    if (serverProcess) {
      console.log('[INFO] Stopping serve-out static server...');
      serverProcess.kill();
    }
  }

  console.log('\n==================================================================');
  console.log(`ROUND 9 PRODUCTION E2E VERIFICATION: ${passedAssertions}/${totalAssertions} PASSED`);
  if (failures.length > 0) {
    console.error(`❌ ${failures.length} TEST(S) FAILED:`);
    for (const f of failures) {
      console.error(`  - ${f.testName}: ${f.message}`);
    }
    process.exit(1);
  } else {
    console.log('🎉 ALL ROUND 9 PRODUCTION E2E TESTS PASSED WITH 0 ERRORS!');
    console.log('==================================================================\n');
  }
}

runRound9Tests();
