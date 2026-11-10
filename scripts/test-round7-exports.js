/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3222';
const ARTIFACTS_DIR = path.join(__dirname, '..', 'test-artifacts');

// Ensure artifacts dir exists
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

// Deterministic answers for 36 questions
const mockAnswers = {};
for (let i = 1; i <= 36; i++) {
  mockAnswers[i] = ((i % 5) + 1);
}

// PSDKU prodi names that must NEVER appear in the PDF export or ranked card
const PSDKU_PRODI_NAMES = [
  'Perencanaan Wilayah dan Kota (Pekalongan)',
  'Teknik Industri (Batang)',
  'Agribisnis (Batang)',
  'Informatika (Rembang)',
  'Administrasi Publik (Rembang)',
  'PSDKU',
];

async function runRound7Verification() {
  console.log('==================================================================');
  console.log('🚀 DEFINE YOUR NEXT MOVE — ROUND 7 EXPORT VERIFICATION (PLAYWRIGHT)');
  console.log('   Target URL:', BASE_URL);
  console.log('==================================================================\n');

  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Mobile (390x844) Viewport — Visibility without scrolling
    // -------------------------------------------------------------------------
    console.log('[TEST 1] Mobile Viewport (390x844 touch)...');
    const mobileCtx = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });

    await mobileCtx.addInitScript(({ answers }) => {
      sessionStorage.setItem('undip_intro_seen', 'true');
      localStorage.setItem('undip_major_matcher_answers', JSON.stringify(answers));
      localStorage.setItem('undip_questionnaire_answers', JSON.stringify(answers));
    }, { answers: mockAnswers });

    const mobilePage = await mobileCtx.newPage();
    await mobilePage.goto(`${BASE_URL}/results`, { waitUntil: 'networkidle' });
    await mobilePage.evaluate(() => document.fonts.ready);
    await mobilePage.waitForTimeout(600);

    // Assert "Bagikan Hasil" button is visible within initial 390x844 viewport without scrolling
    const shareBtnMobile = await mobilePage.$('[data-testid="btn-bagikan-hasil"]');
    if (!shareBtnMobile) {
      throw new Error('Bagikan Hasil button [data-testid="btn-bagikan-hasil"] not found on mobile page');
    }

    const shareBtnBox = await shareBtnMobile.boundingBox();
    if (!shareBtnBox) {
      throw new Error('Could not calculate bounding box for Bagikan Hasil button');
    }

    console.log(`  ✓ Bagikan Hasil button position on 390x844: y=${shareBtnBox.y}, height=${shareBtnBox.height}`);
    if (shareBtnBox.y + shareBtnBox.height > 844) {
      throw new Error(`Bagikan Hasil button is below the fold on 390x844 viewport (y=${shareBtnBox.y})`);
    }
    console.log('  ✓ Bagikan Hasil button is fully visible above the fold on 390x844!');

    // Open Share Modal on mobile
    await shareBtnMobile.click();
    await mobilePage.waitForSelector('#shareable-card-modal-title', { state: 'visible', timeout: 5000 });
    await mobilePage.waitForTimeout(1000); // Allow canvas to render pixel fonts

    const mobileModalScreenshot = path.join(ARTIFACTS_DIR, 'round7-share-modal-mobile.png');
    await mobilePage.screenshot({ path: mobileModalScreenshot });
    console.log(`  ✓ Mobile modal screenshot saved to ${mobileModalScreenshot}`);

    await mobileCtx.close();

    // -------------------------------------------------------------------------
    // TEST 2: Desktop (1440x900) — Shareable Card Story & Square formats
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Desktop Viewport (1440x900) — Canvas Card Formats & Download...');
    const desktopCtx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      acceptDownloads: true,
    });

    await desktopCtx.addInitScript(({ answers }) => {
      sessionStorage.setItem('undip_intro_seen', 'true');
      localStorage.setItem('undip_major_matcher_answers', JSON.stringify(answers));
      localStorage.setItem('undip_questionnaire_answers', JSON.stringify(answers));
    }, { answers: mockAnswers });

    const desktopPage = await desktopCtx.newPage();
    await desktopPage.goto(`${BASE_URL}/results`, { waitUntil: 'networkidle' });
    await desktopPage.evaluate(() => document.fonts.ready);
    await desktopPage.waitForTimeout(600);

    // Open Share Modal
    const shareBtnDesktop = await desktopPage.$('[data-testid="btn-bagikan-hasil"]');
    if (!shareBtnDesktop) {
      throw new Error('Bagikan Hasil button not found on desktop');
    }
    await shareBtnDesktop.click();
    await desktopPage.waitForSelector('#shareable-card-modal-title', { state: 'visible', timeout: 5000 });

    // Fill optional nickname
    const nicknameInput = await desktopPage.$('#nickname-input');
    if (nicknameInput) {
      await nicknameInput.fill('Budi Diponegoro');
      console.log('  ✓ Filled nickname "Budi Diponegoro" (held strictly in component state)');
    }
    await desktopPage.waitForTimeout(800);

    // 1. Download Story format (1080x1920)
    console.log('  Testing Story Format (1080x1920)...');
    const downloadPromiseStory = desktopPage.waitForEvent('download', { timeout: 10000 });
    const downloadBtn = await desktopPage.$('button:has-text("Unduh PNG")');
    if (!downloadBtn) {
      throw new Error('Unduh PNG button not found in modal');
    }
    await downloadBtn.click();
    const downloadStory = await downloadPromiseStory;
    const storyCardPath = path.join(ARTIFACTS_DIR, 'round7-card-story.png');
    await downloadStory.saveAs(storyCardPath);

    const storyStats = fs.statSync(storyCardPath);
    console.log(`  ✓ Story card downloaded: ${storyStats.size} bytes saved to ${storyCardPath}`);
    if (storyStats.size === 0) {
      throw new Error('Story card file is 0 bytes');
    }

    // 2. Switch to Square format (1080x1080)
    console.log('  Testing Square Format (1080x1080)...');
    const squareFormatBtn = await desktopPage.$('button[aria-label="Format Square 1080x1080 (1:1)"]');
    if (!squareFormatBtn) {
      throw new Error('Square format button not found');
    }
    await squareFormatBtn.click();
    await desktopPage.waitForTimeout(800);

    const downloadPromiseSquare = desktopPage.waitForEvent('download', { timeout: 10000 });
    await downloadBtn.click();
    const downloadSquare = await downloadPromiseSquare;
    const squareCardPath = path.join(ARTIFACTS_DIR, 'round7-card-square.png');
    await downloadSquare.saveAs(squareCardPath);

    const squareStats = fs.statSync(squareCardPath);
    console.log(`  ✓ Square card downloaded: ${squareStats.size} bytes saved to ${squareCardPath}`);
    if (squareStats.size === 0) {
      throw new Error('Square card file is 0 bytes');
    }

    // 3. Switch to Landscape format (1920x1080)
    console.log('  Testing Landscape Format (1920x1080)...');
    const landscapeFormatBtn = await desktopPage.$('button[aria-label="Format Landscape 1920x1080 (16:9)"]');
    if (!landscapeFormatBtn) {
      throw new Error('Landscape format button not found');
    }
    await landscapeFormatBtn.click();
    await desktopPage.waitForTimeout(800);

    const downloadPromiseLandscape = desktopPage.waitForEvent('download', { timeout: 10000 });
    await downloadBtn.click();
    const downloadLandscape = await downloadPromiseLandscape;
    const landscapeCardPath = path.join(ARTIFACTS_DIR, 'round11-card-landscape.png');
    await downloadLandscape.saveAs(landscapeCardPath);

    const landscapeStats = fs.statSync(landscapeCardPath);
    console.log(`  ✓ Landscape card downloaded: ${landscapeStats.size} bytes saved to ${landscapeCardPath}`);
    if (landscapeStats.size === 0) {
      throw new Error('Landscape card file is 0 bytes');
    }

    // Close modal
    const closeBtn = await desktopPage.$('button[title="Tutup dialog"]');
    if (closeBtn) {
      await closeBtn.click();
      await desktopPage.waitForTimeout(300);
    }

    // -------------------------------------------------------------------------
    // TEST 3: PDF Export Download & Generation Verification
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] PDF Export Download & Structure Verification...');
    const pdfBtn = await desktopPage.$('[data-testid="btn-unduh-pdf-hasil"]');
    if (!pdfBtn) {
      throw new Error('Unduh PDF Hasil button [data-testid="btn-unduh-pdf-hasil"] not found');
    }

    console.log('  Clicking Unduh PDF Hasil and awaiting browser download event...');
    const pdfDownloadPromise = desktopPage.waitForEvent('download', { timeout: 15000 });
    await pdfBtn.click();
    const pdfDownload = await pdfDownloadPromise;
    const pdfFilePath = path.join(ARTIFACTS_DIR, 'hasil-undip-matcher.pdf');
    await pdfDownload.saveAs(pdfFilePath);

    const pdfStats = fs.statSync(pdfFilePath);
    console.log(`  ✓ PDF downloaded: ${pdfStats.size} bytes saved to ${pdfFilePath}`);
    if (pdfStats.size === 0) {
      throw new Error('Downloaded PDF is 0 bytes');
    }

    // Inspect PDF using pdf-lib
    const pdfBytes = fs.readFileSync(pdfFilePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pageCount = pdfDoc.getPageCount();
    console.log(`  ✓ PDF page count: ${pageCount} pages (Requirement: >= 2 pages)`);
    if (pageCount < 2) {
      throw new Error(`PDF must have at least 2 pages, got ${pageCount}`);
    }

    // -------------------------------------------------------------------------
    // TEST 4: High-Fidelity PDF Page Rendering & Text Inspection via PDF.js
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Rendering PDF Pages to Images & Inspecting Content...');
    const renderPage = await desktopCtx.newPage();
    await renderPage.goto('about:blank');
    await renderPage.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js' });

    const base64Pdf = pdfBytes.toString('base64');

    // Extract text & render pages
    const pdfData = await renderPage.evaluate(async ({ base64, numPages }) => {
      const pdfjsLib = window['pdfjs-dist/build/pdf'];
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const loadingTask = pdfjsLib.getDocument({ data: atob(base64) });
      const pdf = await loadingTask.promise;

      let aggregatedText = '';
      const renderedPages = [];

      for (let p = 1; p <= numPages; p++) {
        const page = await pdf.getPage(p);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((i) => i.str).join(' ');
        aggregatedText += `\n--- PAGE ${p} ---\n` + pageText;

        // Render to canvas at 2x resolution
        const scale = 2.0;
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        renderedPages.push({
          pageNumber: p,
          dataUrl: canvas.toDataURL('image/png'),
        });
      }

      return { aggregatedText, renderedPages };
    }, { base64: base64Pdf, numPages: pageCount });

    // Assert PSDKU exclusion in PDF text
    console.log('  Checking for PSDKU exclusion in PDF text...');
    for (const psdkuName of PSDKU_PRODI_NAMES) {
      if (pdfData.aggregatedText.includes(psdkuName)) {
        throw new Error(`Leakage detected! PDF content contains forbidden PSDKU string: "${psdkuName}"`);
      }
    }
    console.log('  ✓ 100% PSDKU Free: 0 PSDKU programs found in PDF document');

    // Assert Top Ranked Program exists in PDF text
    console.log('  Checking that ranked programs appear in PDF text...');
    const requiredSections = [
      'Peringkat Program Studi',
      'Peringkat Fakultas',
      'Profil Minat',
      'Roadshow Sedulur Serang Diponegoro 2027',
    ];
    for (const sec of requiredSections) {
      if (!pdfData.aggregatedText.includes(sec)) {
        throw new Error(`PDF missing expected section header: "${sec}"`);
      }
    }
    console.log('  ✓ All required sections (Program Studi, Fakultas, Profil, Roadshow) verified in PDF');

    // Save rendered pages as artifacts
    for (const rp of pdfData.renderedPages) {
      const pagePngPath = path.join(ARTIFACTS_DIR, `round7-pdf-page-${rp.pageNumber}.png`);
      const base64Data = rp.dataUrl.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(pagePngPath, Buffer.from(base64Data, 'base64'));
      console.log(`  ✓ Rendered PDF page ${rp.pageNumber} saved to ${pagePngPath}`);
    }

    // -------------------------------------------------------------------------
    // TEST 5: Questionnaire End-of-Flow PDF Button Visibility
    // -------------------------------------------------------------------------
    console.log('\n[TEST 5] Questionnaire End-of-Flow PDF Button Verification...');
    await desktopPage.goto(`${BASE_URL}/questionnaire`, { waitUntil: 'networkidle' });
    await desktopPage.waitForTimeout(600);

    const qPdfBtn = await desktopPage.$('[data-testid="btn-unduh-pdf-hasil"]');
    if (!qPdfBtn) {
      throw new Error('Unduh PDF Hasil button not found at end of questionnaire flow when complete');
    }
    console.log('  ✓ Unduh PDF Hasil button verified visible at questionnaire completion');

    await desktopCtx.close();
    console.log('\n==================================================================');
    console.log('🎉 ALL ROUND 7 EXPORT VERIFICATION TESTS PASSED SUCCESSFULLY!');
    console.log('==================================================================\n');
  } finally {
    await browser.close();
  }
}

runRound7Verification().catch((err) => {
  console.error('\n❌ VERIFICATION TEST FAILED:', err);
  process.exit(1);
});
