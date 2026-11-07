/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const viewports = [360, 390, 430, 768, 1024, 1440];
const screenshotDir = path.join(__dirname, '../screenshots/section1');

if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  console.log('--- STARTING SECTION 1 PLAYWRIGHT VERIFICATION ---');

  for (const width of viewports) {
    const height = 800;
    const context = await browser.newContext({
      viewport: { width, height },
      isMobile: width < 768,
      hasTouch: width < 768,
    });
    const page = await context.newPage();

    // Ensure clean state without cached intro_seen
    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
      sessionStorage.removeItem('undip_intro_seen');
    });
    await page.reload();

    // 1. Capture Frame 1 (~1000ms in)
    await page.waitForTimeout(1000);
    const frame1HasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`[${width}px] Frame 1 horizontal overflow: ${frame1HasOverflow ? 'FAIL' : 'PASS'}`);
    
    // Check loading indicator text
    const loadingText = await page.locator('text=/Loading \\d+%/').textContent();
    console.log(`[${width}px] Frame 1 Loading Indicator: "${loadingText}"`);

    await page.screenshot({ path: path.join(screenshotDir, `frame1_${width}px.png`) });

    // 2. Capture Frame 2 (~3200ms in, after 400ms top offset transition finishes)
    await page.waitForTimeout(2200); // 1000 + 2200 = 3200ms
    const navVisible = await page.locator('header').isVisible();
    const skipBtn = page.locator('button[aria-label="Lewati animasi pembuka"]');
    const skipBox = await skipBtn.boundingBox();
    const navBox = await page.locator('header').boundingBox();

    console.log(`[${width}px] Frame 2 Navbar visible: ${navVisible}, Skip button: ${skipBox ? `${skipBox.width.toFixed(0)}x${skipBox.height.toFixed(0)}px at y=${skipBox.y.toFixed(0)}` : 'missing'}`);
    if (navBox && skipBox) {
      const skipBelowNav = skipBox.y >= navBox.height - 2;
      console.log(`[${width}px] Frame 2 Skip button below Navbar (${skipBox.y.toFixed(1)} >= ${navBox.height.toFixed(1)}): ${skipBelowNav ? 'PASS' : 'FAIL'}`);
    }
    await page.screenshot({ path: path.join(screenshotDir, `frame2_${width}px.png`) });

    // 3. Capture Frame 3 (~4500ms in)
    await page.waitForTimeout(1300); // 3200 + 1300 = 4500ms
    const frame3HasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`[${width}px] Frame 3 horizontal overflow: ${frame3HasOverflow ? 'FAIL' : 'PASS'}`);
    await page.screenshot({ path: path.join(screenshotDir, `frame3_${width}px.png`) });

    await context.close();
  }

  await browser.close();
  console.log('--- ALL SECTION 1 SCREENSHOTS SAVED TO screenshots/section1 ---');
})();
