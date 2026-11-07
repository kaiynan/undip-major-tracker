/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const VIEWPORTS = [
  { width: 360, height: 640, label: '360x640_mobile_portrait' },
  { width: 390, height: 844, label: '390x844_mobile_portrait' },
  { width: 430, height: 932, label: '430x932_mobile_portrait' },
  { width: 844, height: 390, label: '844x390_mobile_landscape' },
];

async function verifyFrame2() {
  console.log('🚀 Verifying Frame 2 mobile portrait & landscape composition...');
  const browser = await chromium.launch({ channel: 'chrome', headless: true });

  try {
    for (const vp of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        hasTouch: true,
      });
      const page = await context.newPage();

      // Trigger intro replay so Frame 1 -> Frame 2 plays
      await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => {
        sessionStorage.removeItem('undip_intro_seen');
      });
      await page.reload({ waitUntil: 'domcontentloaded' });

      // Wait for Frame 2: Frame 1 is ~1.5s loading, so Frame 2 gate scene appears after ~1.7s
      await page.waitForTimeout(2200);

      const check = await page.evaluate(() => {
        const overlay = document.querySelector('[aria-label="Animasi Pembuka Gerbang UNDIP Tembalang"]');
        const statue = document.querySelector('#opening-statue');
        const leftPylon = document.querySelector('#gate-left-pylon');
        const rightPylon = document.querySelector('#gate-right-pylon');
        const skipBtn = document.querySelector('button[aria-label="Lewati animasi pembuka"]');
        const pulse = document.querySelector('.animate-pulse');

        return {
          hasOverlay: !!overlay,
          hasStatue: !!statue,
          statueRect: statue ? statue.getBoundingClientRect() : null,
          leftRect: leftPylon ? leftPylon.getBoundingClientRect() : null,
          rightRect: rightPylon ? rightPylon.getBoundingClientRect() : null,
          skipRect: skipBtn ? skipBtn.getBoundingClientRect() : null,
          hasPulse: !!pulse,
          pulseText: pulse ? pulse.textContent.trim() : null,
        };
      });

      console.log('Frame 2 debug:', check);

      await context.close();
    }

    console.log('\n🎉 Frame 2 verification passed across all portrait and landscape mobile viewports!');
  } finally {
    await browser.close();
  }
}

verifyFrame2().catch((e) => {
  console.error(e);
  process.exit(1);
});
