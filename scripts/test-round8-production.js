#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * scripts/test-round8-production.js
 *
 * Full Production E2E Verification Suite for Prompt F (Round 8):
 * 1. Favorit persistence across reload & storage blocked in-memory fallback.
 * 2. Bandingkan prodi (2 and 3 IDs) across 390x844 (touch) and 1440x900 (desktop) with 0 horizontal page overflow.
 * 3. Invalid comparison IDs handling.
 * 4. Program detail rich sourced collapsible sections and PSDKU notice.
 * 5. Comprehensive scholarships catalogue with search, filter chips, and tips.
 * 6. Social OG image assets verification (< 300 KB).
 * 7. Zero console errors throughout all tests.
 * 8. Screenshots saved to test-artifacts/round8/.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn } = require('child_process');

const PORT = 3225;
const BASE_URL = `http://localhost:${PORT}`;
const ARTIFACTS_DIR = path.resolve(__dirname, '..', 'test-artifacts', 'round8');
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

async function runRound8Tests() {
  console.log('\n==================================================================');
  console.log('🚀 DEFINE YOUR NEXT MOVE — ROUND 8 PRODUCTION E2E VERIFICATION');
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
    // TEST SUITE 1: FAVORIT PRODI & PERSISTENCE
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 1] Favorit Prodi: Persistence & Storage Fallback ---');
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      await context.addInitScript(() => {
        sessionStorage.setItem('undip_intro_seen', 'true');
      });

      const page = await context.newPage();
      const consoleErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });

      // 1. Visit program-studi directory and favorite 2 programs
      await page.goto(`${BASE_URL}/program-studi`, { waitUntil: 'networkidle' });
      const favButtons = page.locator('button[aria-label*="Favorit"]');
      const count = await favButtons.count();
      assert(count >= 2, 'Directory Favorite Buttons', `Found ${count} favorite buttons on /program-studi`);

      // Click first two favorite buttons
      await favButtons.nth(0).click();
      await page.waitForTimeout(100);
      await favButtons.nth(1).click();
      await page.waitForTimeout(100);

      // Check localStorage
      const storedFavs = await page.evaluate(() => {
        return localStorage.getItem('undip_matcher_favorites_v1');
      });
      assert(
        !!storedFavs && JSON.parse(storedFavs).length === 2,
        'LocalStorage Persistence',
        `Stored ${storedFavs}`
      );

      // 2. Navigate to /favorit page and check rendering
      await page.goto(`${BASE_URL}/favorit`, { waitUntil: 'networkidle' });
      const cardCount = await page.locator('button[aria-label*="Hapus"]').count();
      assert(cardCount === 2, 'Favorit Page Item Count', `Expected 2 favorited cards, found ${cardCount}`);

      // Save screenshot of Favorit page
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'favorit-page.png') });
      console.log('  📸 Screenshot saved: favorit-page.png');

      // 3. Reload page and check persistence
      await page.reload({ waitUntil: 'networkidle' });
      const afterReloadCount = await page.locator('button[aria-label*="Hapus"]').count();
      assert(afterReloadCount === 2, 'Persistence After Page Reload', `Still got ${afterReloadCount} favorites`);

      // 4. Test Blocked Storage Fallback
      const blockedContext = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      await blockedContext.addInitScript(() => {
        sessionStorage.setItem('undip_intro_seen', 'true');
        // Throw on localStorage access
        Object.defineProperty(window, 'localStorage', {
          get: () => {
            throw new Error('Access denied');
          },
        });
      });
      const blockedPage = await blockedContext.newPage();
      await blockedPage.goto(`${BASE_URL}/favorit`, { waitUntil: 'networkidle' });
      const warningText = await blockedPage.locator('text=Penyimpanan browser dinonaktifkan').isVisible();
      assert(warningText, 'Storage Blocked In-Memory Notice', 'Fallback alert rendered cleanly');

      assert(consoleErrors.length === 0, 'Favorit Zero Console Errors', `Errors: ${consoleErrors.join(', ')}`);
      await context.close();
      await blockedContext.close();
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 2: BANDINGKAN PRODI (390px Touch & 1440px Desktop)
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 2] Bandingkan Prodi: Responsive Layouts & 0 Overflow ---');
    {
      const prodiIds = 'ft-sipil,ft-arsitektur,ft-kimia';

      // 2A. Mobile Viewport 390x844 with Touch
      const mobileContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      });
      await mobileContext.addInitScript(() => {
        sessionStorage.setItem('undip_intro_seen', 'true');
      });
      const mobilePage = await mobileContext.newPage();
      const mobileErrors = [];
      mobilePage.on('console', (msg) => {
        if (msg.type() === 'error') mobileErrors.push(msg.text());
      });

      await mobilePage.goto(`${BASE_URL}/bandingkan?ids=${prodiIds}`, { waitUntil: 'networkidle' });

      // Verify zero horizontal page-level overflow
      const overflow = await mobilePage.evaluate(() => {
        const bodyWidth = document.body.scrollWidth;
        const windowWidth = window.innerWidth;
        const docWidth = document.documentElement.scrollWidth;
        return {
          bodyWidth,
          windowWidth,
          docWidth,
          hasOverflow: docWidth > windowWidth || bodyWidth > windowWidth,
        };
      });
      assert(
        !overflow.hasOverflow,
        'Mobile 390px Zero Horizontal Overflow',
        `Window: ${overflow.windowWidth}px, Doc: ${overflow.docWidth}px, Body: ${overflow.bodyWidth}px`
      );

      // Verify 3 columns present
      const headerNames = await mobilePage.locator('th h2').allInnerTexts();
      assert(headerNames.length >= 3, 'Mobile 3 Columns Rendered', `Headers found: ${headerNames.length}`);

      await mobilePage.screenshot({ path: path.join(ARTIFACTS_DIR, 'bandingkan-mobile-390.png') });
      console.log('  📸 Screenshot saved: bandingkan-mobile-390.png');

      assert(mobileErrors.length === 0, 'Mobile Bandingkan Zero Console Errors', `Errors: ${mobileErrors.join(', ')}`);
      await mobileContext.close();

      // 2B. Desktop Viewport 1440x900
      const desktopContext = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      await desktopContext.addInitScript(() => {
        sessionStorage.setItem('undip_intro_seen', 'true');
      });
      const desktopPage = await desktopContext.newPage();
      await desktopPage.goto(`${BASE_URL}/bandingkan?ids=${prodiIds}`, { waitUntil: 'networkidle' });

      // Verify comparison rows
      const quotaRow = await desktopPage.locator('text=Total Daya Tampung').first().isVisible();
      const uktRow = await desktopPage.locator('text=Biaya Kuliah (UKT)').first().isVisible();
      assert(quotaRow && uktRow, 'Desktop Comparison Metrics Rendered', 'Quota & UKT rows present');

      // Verify Salin Tautan & Bagikan buttons
      const copyBtn = await desktopPage.locator('button:has-text("Salin Tautan")').isVisible();
      assert(copyBtn, 'Copy Link Button Visible', 'Salin Tautan button exists');

      await desktopPage.screenshot({ path: path.join(ARTIFACTS_DIR, 'bandingkan-desktop-1440.png') });
      console.log('  📸 Screenshot saved: bandingkan-desktop-1440.png');

      // 2C. Invalid IDs handling
      await desktopPage.goto(`${BASE_URL}/bandingkan?ids=prodi-palsu,prodi-ngasal`, { waitUntil: 'networkidle' });
      const notFoundMessage = await desktopPage.locator('text=Pilih Minimal 2 Program Studi').isVisible();
      const invalidIdNotice = await desktopPage.locator('text=ID tidak valid').isVisible();
      assert(notFoundMessage && invalidIdNotice, 'Invalid Comparison IDs Graceful Handling', 'Shows friendly error and lists invalid IDs');

      await desktopContext.close();
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 3: DETAIL PRODI YANG LEBIH KAYA (SOURCED & COLLAPSIBLE)
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 3] Program Detail: Sourced Rich Information & Collapsibles ---');
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      await context.addInitScript(() => {
        sessionStorage.setItem('undip_intro_seen', 'true');
      });
      const page = await context.newPage();
      const pageErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') pageErrors.push(msg.text());
      });

      // 3A. Semarang program (ft-sipil)
      await page.goto(`${BASE_URL}/program/ft-sipil`, { waitUntil: 'networkidle' });

      // Verify rich detail sections
      const ringkasan = await page.locator('text=Ringkasan Program Studi').isVisible();
      const akreditasi = await page.locator('text=Akreditasi Resmi').isVisible();
      const mkKhas = await page.locator('text=Mata Kuliah Khas & Fokus Keilmuan').isVisible();
      const kompetensi = await page.locator('text=Kompetensi Utama Lulusan').isVisible();
      const prospek = await page.locator('text=Prospek Karier & Peran Profesional').isVisible();
      assert(
        ringkasan && akreditasi && mkKhas && kompetensi && prospek,
        'All Rich Detail Sections Present',
        'Ringkasan, akreditasi, mata kuliah, kompetensi, prospek karier visible'
      );

      // Verify source attribution lines
      const sourceLine = await page.locator('text=Sumber:').first().isVisible();
      const officialBadge = await page.locator('text=Resmi').first().isVisible();
      assert(sourceLine && officialBadge, 'Provenance Attribution & Status Badge', 'Sourced attribution line active');

      // Verify all external links have rel="noopener noreferrer"
      const unsafeLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[target="_blank"]'));
        return links
          .filter((a) => !a.rel.includes('noopener') || !a.rel.includes('noreferrer'))
          .map((a) => a.href);
      });
      assert(unsafeLinks.length === 0, 'Safe External Links (rel="noopener noreferrer")', `Unsafe: ${unsafeLinks.join(', ')}`);

      // Compare picker modal trigger
      const compareWithBtn = page.locator('button:has-text("Bandingkan dengan...")');
      await compareWithBtn.click();
      await page.waitForTimeout(200);
      const modalVisible = await page.locator('text=Pilih program studi mitra').isVisible();
      assert(modalVisible, 'Compare Picker Modal Opened', 'Modal opens on click');
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);

      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'program-detail-sourced.png') });
      console.log('  📸 Screenshot saved: program-detail-sourced.png');

      // 3B. PSDKU program (psdku-pwk-pekalongan)
      await page.goto(`${BASE_URL}/program/psdku-pwk-pekalongan`, { waitUntil: 'networkidle' });
      const psdkuNotice = await page.locator('text=Program PSDKU di Luar Kampus Utama').isVisible();
      assert(psdkuNotice, 'PSDKU Informational Notice Active', 'Banner properly rendered for PSDKU program');

      assert(pageErrors.length === 0, 'Program Detail Zero Console Errors', `Errors: ${pageErrors.join(', ')}`);
      await context.close();
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 4: HALAMAN BEASISWA LENGKAP
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 4] Scholarships Catalogue: Filters, Search & Tips ---');
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
      });
      await context.addInitScript(() => {
        sessionStorage.setItem('undip_intro_seen', 'true');
      });
      const page = await context.newPage();
      const pageErrors = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') pageErrors.push(msg.text());
      });

      await page.goto(`${BASE_URL}/langkah-selanjutnya/beasiswa`, { waitUntil: 'networkidle' });

      // 1. Verify KIP-Kuliah section exists
      const kipkSection = await page.locator('text=Tentang Beasiswa KIP-Kuliah').isVisible();
      assert(kipkSection, 'KIP-Kuliah Section Maintained', 'Existing KIP-Kuliah intact');

      // 2. Verify Catalogue & Filter Chips
      const filterChips = await page.locator('button:has-text("Pemerintah")').isVisible();
      const chipCount = await page.locator('button[aria-pressed]').count();
      assert(filterChips && chipCount >= 8, 'Scholarship Filter Chips Active', `Found ${chipCount} active filter buttons`);

      // 3. Test filtering by "Yayasan"
      await page.locator('button:has-text("Yayasan")').click();
      await page.waitForTimeout(150);
      const tanotoVisible = await page.locator('text=Tanoto Foundation').first().isVisible();
      const biVisible = await page.locator('text=Beasiswa Bank Indonesia').first().isVisible();
      assert(tanotoVisible && !biVisible, 'Filter by Yayasan Accurate', 'Only Yayasan scholarships shown');

      // Reset filter
      await page.locator('button:has-text("Semua Penyelenggara")').click();
      await page.waitForTimeout(150);

      // 4. Test Search input
      const searchInput = page.locator('input[aria-label="Cari beasiswa"]');
      await searchInput.fill('Djarum');
      await page.waitForTimeout(150);
      const djarumVisible = await page.locator('text=Djarum Beasiswa Plus').isVisible();
      const baznasVisible = await page.locator('text=Beasiswa Cendekia BAZNAS').isVisible();
      assert(djarumVisible && !baznasVisible, 'Live Search Filter by Name Accurate', 'Search filtered accurately');

      // Clear search
      await searchInput.fill('');
      await page.waitForTimeout(150);

      // 5. Verify Tips block
      const tipsBlock = await page.locator('text=Tips Sukses Persiapan Beasiswa Kuliah').isVisible();
      assert(tipsBlock, 'Actionable Tips Block Rendered', 'Tips block visible');

      // 6. Cross-link test from UKT page
      await page.goto(`${BASE_URL}/langkah-selanjutnya/biaya-ukt`, { waitUntil: 'networkidle' });
      const crossLink = await page.locator('text=Mencari bantuan biaya? Lihat 9 beasiswa terdata').isVisible();
      assert(crossLink, 'UKT Page Cross-Link to Scholarships', 'Cross-link correctly displayed');

      await page.goto(`${BASE_URL}/langkah-selanjutnya/beasiswa`, { waitUntil: 'networkidle' });
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'beasiswa-catalogue.png') });
      console.log('  📸 Screenshot saved: beasiswa-catalogue.png');

      assert(pageErrors.length === 0, 'Scholarships Zero Console Errors', `Errors: ${pageErrors.join(', ')}`);
      await context.close();
    }

    // -------------------------------------------------------------------------
    // TEST SUITE 5: SOCIAL OPEN GRAPH IMAGES (<300 KB) & PREVIEWS
    // -------------------------------------------------------------------------
    console.log('\n--- [TEST 5] Open Graph Image Assets (< 300 KB) & Previews ---');
    {
      const ogFiles = [
        'og-default.png',
        'og-results.png',
        'og-program-studi.png',
        'og-langkah-selanjutnya.png',
        'og-bandingkan.png',
        'og-favorit.png',
      ];

      for (const file of ogFiles) {
        const filePath = path.join(ROOT_DIR, 'public', 'og', file);
        assert(fs.existsSync(filePath), `OG Asset Exists: ${file}`, `Missing ${file}`);
        const stats = fs.statSync(filePath);
        const sizeKb = Math.round(stats.size / 1024);
        assert(sizeKb < 300, `OG Asset Size < 300KB: ${file}`, `Size: ${sizeKb} KB`);
      }

      // Copy one OG preview to artifacts
      fs.copyFileSync(
        path.join(ROOT_DIR, 'public', 'og', 'og-default.png'),
        path.join(ARTIFACTS_DIR, 'og-preview.png')
      );
      console.log('  📸 Preview saved: og-preview.png');
    }

  } finally {
    await browser.close();
    if (serverProcess) {
      serverProcess.kill();
    }
  }

  console.log('\n==================================================================');
  console.log(`TOTAL ASSERTIONS: ${totalAssertions} | PASSED: ${passedAssertions} | FAILED: ${failures.length}`);
  console.log('==================================================================');

  if (failures.length > 0) {
    console.error('❌ SOME TESTS FAILED:');
    failures.forEach((f) => console.error(`  - [${f.testName}]: ${f.message}`));
    process.exit(1);
  } else {
    console.log('🎉 ALL ROUND 8 PRODUCTION E2E TESTS PASSED WITH 0 ERRORS!');
  }
}

runRound8Tests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
