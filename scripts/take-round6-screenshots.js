/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3222';
const OUT_DIR = path.join(__dirname, '..', 'docs', 'screenshots', 'round6');

async function capture() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  try {
    // 1. Jadwal seleksi at 390px
    console.log('Capturing jadwal-seleksi at 390px...');
    const ctxMobile = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    await ctxMobile.addInitScript(() => sessionStorage.setItem('undip_intro_seen', 'true'));
    const p1 = await ctxMobile.newPage();
    await p1.goto(`${BASE_URL}/langkah-selanjutnya/jadwal-seleksi#jalur-um`, { waitUntil: 'networkidle' });
    await p1.evaluate(() => document.fonts.ready);
    await p1.waitForTimeout(500);
    const umElMobile = await p1.$('#jalur-um');
    if (umElMobile) {
      await umElMobile.screenshot({ path: path.join(OUT_DIR, 'jadwal-seleksi-um-mobile-390.png') });
    } else {
      await p1.screenshot({ path: path.join(OUT_DIR, 'jadwal-seleksi-mobile-390.png'), fullPage: true });
    }
    await ctxMobile.close();

    // 2. Jadwal seleksi at 1440px
    console.log('Capturing jadwal-seleksi at 1440px...');
    const ctxDesktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await ctxDesktop.addInitScript(() => sessionStorage.setItem('undip_intro_seen', 'true'));
    const p2 = await ctxDesktop.newPage();
    await p2.goto(`${BASE_URL}/langkah-selanjutnya/jadwal-seleksi#jalur-um`, { waitUntil: 'networkidle' });
    await p2.evaluate(() => document.fonts.ready);
    await p2.waitForTimeout(500);
    const umElDesktop = await p2.$('#jalur-um');
    if (umElDesktop) {
      await umElDesktop.screenshot({ path: path.join(OUT_DIR, 'jadwal-seleksi-um-desktop-1440.png') });
    } else {
      await p2.screenshot({ path: path.join(OUT_DIR, 'jadwal-seleksi-desktop-1440.png') });
    }
    await ctxDesktop.close();

    // 3. Program studi PSDKU group
    console.log('Capturing /program-studi PSDKU group...');
    const ctxProdi = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctxProdi.addInitScript(() => sessionStorage.setItem('undip_intro_seen', 'true'));
    const p3 = await ctxProdi.newPage();
    await p3.goto(`${BASE_URL}/program-studi`, { waitUntil: 'networkidle' });
    await p3.evaluate(() => document.fonts.ready);
    await p3.waitForTimeout(500);
    // Find PSDKU button or section
    const psdkuBtn = await p3.$('button:has-text("PSDKU (Kampus Luar Semarang)")');
    if (psdkuBtn) {
      await psdkuBtn.click();
      await p3.waitForTimeout(300);
    }
    await p3.screenshot({ path: path.join(OUT_DIR, 'program-studi-psdku.png') });
    await ctxProdi.close();

    // 4. /results leaderboard without PSDKU
    console.log('Capturing /results leaderboard...');
    const ctxResults = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctxResults.addInitScript(() => {
      sessionStorage.setItem('undip_intro_seen', 'true');
      const mockAnswers = {};
      for (let i = 1; i <= 36; i++) {
        mockAnswers[i] = ((i % 5) + 1);
      }
      localStorage.setItem('undip_questionnaire_answers', JSON.stringify(mockAnswers));
    });
    const p4 = await ctxResults.newPage();
    await p4.goto(`${BASE_URL}/results`, { waitUntil: 'networkidle' });
    await p4.evaluate(() => document.fonts.ready);
    await p4.waitForTimeout(600);
    await p4.screenshot({ path: path.join(OUT_DIR, 'results-leaderboard.png') });
    await ctxResults.close();

    console.log('✅ All screenshots saved to', OUT_DIR);
  } finally {
    await browser.close();
  }
}

capture().catch((err) => {
  console.error('Error taking screenshots:', err);
  process.exit(1);
});
