/* eslint-disable @typescript-eslint/no-require-imports */
// =============================================================================
// undip-major-matcher — Static Open Graph (OG) 1200x630 Image Generator
// =============================================================================
// Generates on-brand, high-fidelity social share cards (PNG, 1200x630, <300KB)
// for major routes using Playwright with embedded self-hosted fonts.
// =============================================================================

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'og');
const FONTS_DIR = path.join(ROOT_DIR, 'public', 'fonts');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Convert local fonts to Base64 data URIs for deterministic offline rendering
const silkscreen700Base64 = fs.readFileSync(path.join(FONTS_DIR, 'silkscreen-700.woff2')).toString('base64');
const geistSansBase64 = fs.readFileSync(path.join(FONTS_DIR, 'geist-sans.woff2')).toString('base64');
const geistMonoBase64 = fs.readFileSync(path.join(FONTS_DIR, 'geist-mono.woff2')).toString('base64');

// Brand configuration from brand.ts
const APP_NAME = 'Unlock The Unseen';
const TAGLINE = 'Find Your Potential, Define Your Next Move';
const EVENT_NAME = 'Roadshow Sedulur Serang Diponegoro 2027';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://roadshow-2027.vercel.app';
const SHORT_URL = SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');

const CARDS = [
  {
    fileName: 'og-default.png',
    eyebrow: 'UNIVERSITAS DIPONEGORO • ROADSHOW SERADIP 2027',
    title: APP_NAME,
    subtitle: TAGLINE,
    badge: '70 PROGRAM STUDI • HMIM INTEREST MATCHING',
    footer: `${SHORT_URL} • Unlock The Unseen`,
  },
  {
    fileName: 'og-results.png',
    eyebrow: 'HASIL EVALUASI HMIM • UNIVERSITAS DIPONEGORO',
    title: 'Hasil Rekomendasi Jurusan',
    subtitle: 'Analisis Profil Minat 4 Dimensi, Skor Keselarasan, & Tier Peringkat Prodi',
    badge: 'HASIL AKURAT • DECOUPLED FROM QUOTAS',
    footer: `${SHORT_URL} • Hasil Kuisioner Minat`,
  },
  {
    fileName: 'og-program-studi.png',
    eyebrow: 'DIREKTORI LENGKAP KAMPUS UNDIP',
    title: 'Direktori 70 Program Studi',
    subtitle: 'Daya Tampung SNBP/SNBT/Mandiri, UKT Resmi, Kurikulum, & Akreditasi',
    badge: '12 FAKULTAS & SEKOLAH • S1 & D4',
    footer: `${SHORT_URL} • Direktori Program Studi`,
  },
  {
    fileName: 'og-langkah-selanjutnya.png',
    eyebrow: 'PANDUAN STUDI & BIAYA PENDIDIKAN',
    title: 'Biaya, Beasiswa & Jadwal',
    subtitle: 'Struktur Golongan UKT 1–8, Beasiswa KIP-Kuliah, & Kalender Seleksi Masuk',
    badge: 'SK REKTOR RESMI • 9 BEASISWA TERVERIFIKASI',
    footer: `${SHORT_URL} • Langkah Selanjutnya`,
  },
  {
    fileName: 'og-bandingkan.png',
    eyebrow: 'KOMPARASI MULTI-JURUSAN • FITUR RESMI',
    title: 'Bandingkan Program Studi',
    subtitle: 'Komparasi Berdampingan: Kuota Masuk, Tarif UKT, Mata Kuliah & Prospek Kerja',
    badge: '2–3 PRODI SEKALIGUS • CETAK RAMAH A4',
    footer: `${SHORT_URL} • Bandingkan Pilihan`,
  },
  {
    fileName: 'og-favorit.png',
    eyebrow: 'DAFTAR PILIHAN PRIBADI',
    title: 'Program Studi Favoritku',
    subtitle: 'Simpan, Pantau, dan Siapkan Strategi Masuk untuk Jurusan Impianmu di UNDIP',
    badge: 'TERSINKRONISASI OFFLINE • MAKSIMAL 12 PRODI',
    footer: `${SHORT_URL} • Jurusan Favorit`,
  },
];

function generateHtml(card) {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    @font-face {
      font-family: 'Silkscreen';
      src: url('data:font/woff2;base64,${silkscreen700Base64}') format('woff2');
      font-weight: 700;
      font-style: normal;
    }
    @font-face {
      font-family: 'Geist Sans';
      src: url('data:font/woff2;base64,${geistSansBase64}') format('woff2');
      font-weight: 400 700;
      font-style: normal;
    }
    @font-face {
      font-family: 'Geist Mono';
      src: url('data:font/woff2;base64,${geistMonoBase64}') format('woff2');
      font-weight: 700;
      font-style: normal;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background: #140B07;
      font-family: 'Geist Sans', system-ui, sans-serif;
      color: #FFFBEB;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    /* Golden-hour ambient backdrop */
    .bg-gradient {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.22) 0%, transparent 60%),
                  radial-gradient(circle at 15% 85%, rgba(120, 53, 15, 0.35) 0%, transparent 55%),
                  linear-gradient(135deg, #24130C 0%, #190E08 55%, #140B07 100%);
    }

    /* Pixel Grid Texture Overlay */
    .grid-overlay {
      position: absolute;
      inset: 0;
      background-size: 24px 24px;
      background-image:
        linear-gradient(to right, rgba(245, 158, 11, 0.04) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(245, 158, 11, 0.04) 1px, transparent 1px);
      pointer-events: none;
    }

    /* Container Card Frame */
    .frame {
      position: relative;
      width: 1120px;
      height: 550px;
      background: rgba(36, 19, 12, 0.95);
      border: 3px solid #78350F;
      box-shadow: 0 0 0 1px #F59E0B, 0 20px 60px rgba(0, 0, 0, 0.85);
      border-radius: 28px;
      padding: 48px 56px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    /* Top Accent Line */
    .top-bar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #F59E0B 0%, #D97706 40%, #B45309 80%, #78350F 100%);
    }

    /* Header Eyebrow */
    .eyebrow-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .eyebrow {
      font-family: 'Geist Mono', monospace;
      font-size: 13px;
      letter-spacing: 0.15em;
      color: #FDE68A;
      font-weight: 700;
      background: rgba(120, 53, 15, 0.6);
      padding: 6px 14px;
      border-radius: 8px;
      border: 1px solid rgba(245, 158, 11, 0.5);
    }

    .badge {
      font-family: 'Geist Mono', monospace;
      font-size: 12px;
      letter-spacing: 0.08em;
      color: #34D399;
      background: rgba(6, 78, 59, 0.6);
      border: 1px solid rgba(16, 185, 129, 0.5);
      padding: 6px 14px;
      border-radius: 8px;
      font-weight: 700;
    }

    /* Main Typography */
    .main-content {
      margin-top: 10px;
    }

    .title {
      font-family: 'Silkscreen', cursive, sans-serif;
      font-size: 46px;
      line-height: 1.15;
      color: #FFFBEB;
      text-shadow: 3px 3px 0 #000;
      margin-bottom: 18px;
      letter-spacing: 0.02em;
    }

    .subtitle {
      font-family: 'Geist Sans', sans-serif;
      font-size: 20px;
      line-height: 1.45;
      color: #FDE68A;
      opacity: 0.92;
      max-width: 960px;
      font-weight: 400;
    }

    /* Footer Branding */
    .footer-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 2px solid rgba(120, 53, 15, 0.7);
      padding-top: 22px;
    }

    .footer-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .icon-box {
      width: 42px;
      height: 42px;
      background: #F59E0B;
      border: 2px solid #D97706;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 2px 2px 0 #000;
      color: #140B07;
      font-family: 'Silkscreen', cursive;
      font-size: 20px;
      font-weight: 700;
    }

    .footer-brand {
      font-family: 'Silkscreen', cursive;
      font-size: 14px;
      color: #FFFBEB;
      letter-spacing: 0.04em;
    }

    .footer-sub {
      font-family: 'Geist Mono', monospace;
      font-size: 11px;
      color: rgba(253, 230, 138, 0.7);
      letter-spacing: 0.05em;
    }

    .footer-url {
      font-family: 'Geist Mono', monospace;
      font-size: 13px;
      color: #F59E0B;
      letter-spacing: 0.05em;
      font-weight: 700;
    }
  </style>
</head>
<body>
  <div class="bg-gradient"></div>
  <div class="grid-overlay"></div>

  <div class="frame">
    <div class="top-bar"></div>

    <div class="eyebrow-row">
      <div class="eyebrow">${card.eyebrow}</div>
      <div class="badge">${card.badge}</div>
    </div>

    <div class="main-content">
      <h1 class="title">${card.title}</h1>
      <p class="subtitle">${card.subtitle}</p>
    </div>

    <div class="footer-row">
      <div class="footer-left">
        <div class="icon-box">U</div>
        <div>
          <div class="footer-brand">${APP_NAME}</div>
          <div class="footer-sub">${EVENT_NAME}</div>
        </div>
      </div>
      <div class="footer-url">${card.footer}</div>
    </div>
  </div>
</body>
</html>`;
}

async function generateAllOgImages() {
  console.log('===========================================================');
  console.log('GENERATING OPEN GRAPH (OG) SOCIAL SHARING CARDS (1200x630)');
  console.log('===========================================================\n');

  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome', headless: true });
  } catch {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
  }
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });

  for (const card of CARDS) {
    const outputPath = path.join(OUTPUT_DIR, card.fileName);
    const html = generateHtml(card);

    await page.setContent(html, { waitUntil: 'load' });
    // Brief settle time to ensure custom fonts are painted
    await page.waitForTimeout(150);

    await page.screenshot({
      path: outputPath,
      type: 'png',
    });

    const stats = fs.statSync(outputPath);
    const sizeKb = Math.round(stats.size / 1024);

    console.log(`  ✓ Generated ${card.fileName} (${sizeKb} KB)`);
    if (sizeKb > 300) {
      console.warn(`  ⚠️ Warning: ${card.fileName} exceeds 300 KB (${sizeKb} KB)!`);
    }
  }

  await browser.close();
  console.log('\n===========================================================');
  console.log('🎉 ALL 6 OG CARDS GENERATED SUCCESSFULLY IN public/og/');
  console.log('===========================================================');
}

generateAllOgImages().catch((err) => {
  console.error('Error generating OG images:', err);
  process.exit(1);
});
