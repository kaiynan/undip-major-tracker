# ROUND 11 REPORT: UNLOCK THE UNSEEN
## Brand Migration, Result Interpretation Enhancement, Share Card & PDF Redesign

**Repository:** `https://github.com/kaiynan/undip-major-tracker`  
**Branch:** `main`  
**Tech Stack:** Next.js 16.4.5, React 19, Tailwind CSS v4, TypeScript, Static Export (`output: "export"`).  
**Date:** 2026-11-10  
**Status:** All tasks completed, 100% tests passing, campus map preserved without modifications.

---

## 1. Executive Summary

Round 11 executes the full transformation of the application from an interim identity into **"Unlock The Unseen"**, alongside major enhancements to result interpretation, retro 16-bit canvas card generation, and vector PDF reporting.

All changes strictly respect the baseline rules:
- **Campus Map Strictly Frozen:** `FullScreenCampusMap.tsx`, `CampusBuildingsLayer.tsx`, `CampusRoadNetwork.tsx`, `FacultyMapTourSheet.tsx`, `campusLocations.ts`, and `map-data/` were completely untouched (git hash verification identical to baseline `d23f565`).
- **HMIM Engine Frozen:** No formulas, weights, questions, or quota values were changed in `engine.ts`.
- **Privacy Enforcement:** 0 phone numbers on share cards; phone numbers and clickable deep links appear only on the web application and printable PDF.

---

## 2. Section Breakdown & Implementation Details

### A. Brand Migration — "Unlock The Unseen"
- **Single Source of Truth (`src/config/brand.ts`):**
  - `APP_NAME = 'Unlock The Unseen'`
  - `APP_NAME_SHORT = 'Unlock'` (length 6 ≤ 12 character PWA requirement)
  - `TAGLINE = 'Find Your Potential, Define Your Next Move'`
  - `THEME = 'Unlock The Unseen'`
  - `SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://roadshow-2027.vercel.app'`
  - `SHORT_URL = 'roadshow-2027.vercel.app'`
- **Component-Wide Adoption:**
  - `Navbar.tsx`: Responsive brand mark (stacked "UNLOCK / THE UNSEEN" on mobile ≤ 430px; single-line on desktop md+).
  - `Footer.tsx`: Dynamic year, official name, tagline.
  - `layout.tsx`, `manifest.webmanifest`, `offline/page.tsx`, `intro`: Synchronized with `brand.ts`.
- **Static OpenGraph Generation:**
  - Regenerated all 6 social preview PNG cards (`public/og/*.png`) using `scripts/gen-og.js` with the official title "Unlock The Unseen".
- **Data Guard Integrity:**
  - Guard 11 in `scripts/test-data-integrity.ts` enforces official naming and forbids legacy literal leaks (`UNDIP Major Matcher`, `Major Matcher`, `UNDIP Matcher`, `UNDIP Major Tracker`, `Major Tracker`).

### B. Dual Contact Persons & Instagram Integration
- **Centralized Configuration (`src/config/contact.ts`):**
  - Dual SERADIP Contact Persons:
    1. **Kak Dian:** `wa: '6287741097976'`, display: `+62 877-4109-7976`
    2. **Kak Cindy:** `wa: '6282210644934'`, display: `+62 822-1064-4934`
  - Official Instagram: `@sedulurdiponegoro` (`https://instagram.com/sedulurdiponegoro`)
  - Deep-link helper: `waLink(contactId, message)` and `buildWaLink(message, contactId)`
- **Consultation CTA (`ConsultCta.tsx`):**
  - Renders dual WhatsApp contact buttons ("Chat Kak Dian", "Chat Kak Cindy") and Instagram handle button across `card`, `inline`, and `link` variants.
  - Touch targets guaranteed `min-h-[44px]` for mobile accessibility.
  - Guard 14 in `scripts/test-data-integrity.ts` guarantees 0 hardcoded phone numbers outside `contact.ts`.

### C. Recommendation Interpretation Enhancement
- **Deterministic Interest Title (`src/lib/interestTitle.ts`):**
  - Deterministic 30 RIASEC pair combinations (e.g. `IR` → "Penyelidik Praktis", `IA` → "Inovator Kreatif", `RI` → "Spesialis Teknis", `SA` → "Pengembang Bakat").
  - Provides encouraging, non-clinical Indonesian narratives explaining how the user approaches thinking and practical action.
  - Comprehensive unit test suite `interestTitle.test.ts` validates all 30 pairs, determinism, and fallback handling.
- **Distinct Top 3 Explanations (`src/lib/matchReasons.ts`):**
  - Added `getTopProgramExplanation(...)` providing distinct, non-generic justifications based on score decomposition, curriculum highlights, and interest alignment.
  - Added `getTopThreeComparison(...)` calculating score gaps (`gap1_2`, `gap2_3`) and contextual explanations (e.g. solid lead vs close race).
- **Interactive Interpretation Component (`RecommendationInterpretationBlock.tsx`):**
  - Renders the Personalized Interest Profile badge, distinct Top 3 reason cards, score gap comparison card, and interactive 4-dimension breakdown.
  - Integrates cleanly into `src/app/results/page.tsx` with full responsive support.

### D. Share Card Redesign
- **Retro 16-Bit Victory Screen Concept (`src/lib/canvasCardGenerator.ts`):**
  - "GAME STAGE CLEAR — UNLOCK YOUR POTENTIAL" victory screen identity.
  - 3 Aspect Ratios:
    1. **Story (9:16):** 1080 × 1920
    2. **Square (1:1):** 1080 × 1080
    3. **Landscape (16:9):** 1920 × 1080
  - 3 Color Themes:
    1. **Golden Hour:** Warm amber, sunset orange, deep brown
    2. **Malam:** Midnight navy, deep indigo, cyan stars
    3. **Fajar:** Dawn magenta, rose gold, sky violet
  - Offline QR Code: Embedded via `qrcode` package with synchronous matrix rendering to `SITE_URL`.
  - Privacy Rule: Strictly **0 phone numbers** rendered on the canvas card image.
- **Modal UI (`ShareableResultCardModal.tsx`):**
  - Format switcher (Story, Square, Landscape) and Theme switcher (Golden Hour, Malam, Fajar).
  - Scaled live canvas preview and high-resolution PNG download.

### E. Vector PDF Result Redesign
- **Pixel-Art Aesthetic on Cream Background (`src/lib/pdfGenerator.ts`):**
  - Page background: Soft light cream `#FFFDF7` (255, 253, 247).
  - Vector primitives: `doc.rect`, `doc.roundedRect`, `doc.line`, `doc.text` for crisp printing.
- **Document Structure:**
  - **Page 1:** SERADIP and UNDIP banner, UNLOCK THE UNSEEN title, participant metadata, STAGE CLEAR ribbon, dominant interest title, Top 3 podium cards with distinct reasons, score gap comparison, and clickable "Langkah Selanjutnya" banner (`doc.link`).
  - **Page 2+:** Full 65-program ranking (strictly 0 PSDKU), alternating retro cream rows, repeatable table headers (`showHead: 'everyPage'`).
  - **Faculty Table:** 12 faculties with aggregate scores and tier badges.
  - **Last Page Contact Box:** "Ngobrol Bareng Mahasiswa Aktif UNDIP (Tim SERADIP)" with clickable WhatsApp link annotations for Kak Dian and Kak Cindy, Instagram link annotation, and local QR code.
  - **Cleanliness:** Removed "5. Disclaimer" heading and "Algoritma: HMIM v1.0" jargon. Single 1-line running footer on every page.
  - Default download filename: `hasil-unlock-<yyyy-mm-dd>.pdf`.

---

## 3. Test & Verification Matrix

| Test Suite | Commands Run | Status | Observations |
| :--- | :--- | :--- | :--- |
| **TypeScript Typecheck** | `npx tsc --noEmit` | **PASS (0 errors)** | Full project strictly typed across all files |
| **ESLint Quality** | `npx eslint src/...` | **PASS (0 warnings)** | Unused imports, vars, and react hooks clean |
| **Engine & Data Tests** | `npm test` | **PASS (13/13 suites)** | 36 questions, 70 programs, 0 PSDKU in rank, 14 guards passed |
| **Integrity Guards** | `npm run test:data` | **PASS (14/14 guards)** | Brand name, short name <= 12, contacts, quotas, UKT |
| **Production Build** | `npm run build` | **PASS (86/86 static pages)** | `output: "export"`, CSS bundle 121.1 KB, zero runtime errors |
| **Export Verification** | `node scripts/test-round7-exports.js` | **PASS (5/5 suites)** | Mobile visibility, Story PNG, Square PNG, Landscape PNG, 4-page PDF |
| **Campus Map Hash** | `git log -- src/components/pixel/...` | **VERIFIED (Unchanged)** | Commit `d23f565` preserved 100% |

---

## 4. Git Commit History for Round 11

```text
7afc30c feat(pdf): redesign pdf export with 16-bit pixel aesthetic, interpretation blocks, and contact annotations
1b4831f feat(share-card): redesign canvas export as retro game stage clear podium with 3 themes and landscape format
9269113 feat(results): enhance recommendation interpretation, personalized interest profile, and top 3 explanations
6287598 feat(contact): configure dual SERADIP contacts and instagram integration
a725e7e feat(brand): migrate app identity to Unlock The Unseen
```

---

## 5. Conclusion & Ready for Deployment

All objectives of Round 11 have been successfully implemented, audited, tested against the production build, and committed to git.
The codebase is in a pristine, production-ready state.
