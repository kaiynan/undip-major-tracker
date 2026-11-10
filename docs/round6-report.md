# Define Your Next Move — Round 6 Verification & Final Report
## Jalur UM Mandiri, PSDKU & Branding Roadshow 2027

**Date:** 2026-11-09  
**Target Environment:** Next.js 16.4.5 (Turbopack) / React 19.3.0 / Tailwind CSS v4 / `output: "export"`  
**Production Test Host:** `http://localhost:3222` (`scripts/serve-out.js` serving `out/`)  
**Commit Range:** `11a6ebc..67c7fef` on branch `main`

---

## 1. Commit Log by Section

Strictly following the 1 commit per numbered section discipline:

| Section | Commit | Message | Key Changes |
|---|---|---|---|
| **Section 1: Jalur UM Mandiri** | `11a6ebc` | `feat(mandiri): add Jalur Ujian Mandiri block, cross-links, neutral UKT copy, and evidence guards (Section 1)` | Added `JalurMandiriBlock` with responsive cards (< 640px) and table (>= 640px) at anchor `#jalur-um`; typed 4 sub-pathways with status `reference` and roadshow evidence; neutral UKT text; cross-links between UKT and UM block; updated 404 URL with root PMB link; added audit missing sources entries. |
| **Section 2: PSDKU** | `e3a641a` | `feat(psdku): add 5 PSDKU programs, campus badges, directory group, and presentation layer exclusion (Section 2)` | Added 5 official PSDKU programs (PWK Pekalongan, TI Batang, Agribisnis Batang, Informatika Rembang, Adm Publik Rembang) sourced from SK Rektor 41/2026 (Dayatampung 13,250 total) and SK UKT hlm. 3; total programs = 70 (65 Semarang + 5 PSDKU); clean presentation-layer exclusion (`pScores` and `fScores` calculate only Semarang 65); added PSDKU campus badges and dedicated directory accordion group; added Guard 10. |
| **Section 3: Branding Roadshow 2027** | `67c7fef` | `feat(brand): centralize brand config, add Unlock The Unseen theme and tagline (Section 3)` | Centralized all branding in `src/config/brand.ts` (`APP_NAME`, `APP_NAME_SHORT`, `TAGLINE`, `THEME`, `EVENT_NAME`, `SITE_URL`); replaced raw hardcoded strings across UI, metadata, PWA manifest, and SW cache; added theme & event to footer and Tentang Kami; added Guard 11 in `test-data-integrity.ts` preventing un-centralized literals; updated `test-navbar.js` to stress-test ~22 char brand names at <= 430px. |

---

## 2. Production Build Verification

- **Build Command:** `npm run build` (`next build` with Turbopack)
- **Compilation & Static Generation:**
  - TypeScript checked in 3.6s (0 errors)
  - 84/84 static pages prerendered (SSG):
    * `○ /`
    * `○ /_not-found`
    * `○ /admin`
    * `○ /langkah-selanjutnya`
    * `○ /langkah-selanjutnya/beasiswa`
    * `○ /langkah-selanjutnya/biaya-ukt`
    * `○ /langkah-selanjutnya/jadwal-seleksi`
    * `○ /manifest.webmanifest`
    * `○ /offline`
    * `○ /program-studi`
    * `● /program/[id]` (70 programs: 65 Semarang + 5 PSDKU)
    * `○ /questionnaire`
    * `○ /results`
- **Postbuild CSS Check (`scripts/test-build-css.js`):**
  - Emitted CSS: `out/_next/static/chunks/3mqo604j9a3vj.css` (111.2 KB)
  - Tailwind markers (`--tw-`): 1,157
  - Utility classes: `.flex{` (1), `.grid{` (1), `.hidden{` (1), `.relative{` (1), `.fixed{` (1)
  - Result: **PASSED**

---

## 3. Test Suites & Data Integrity Guards

### 3.1 Unit & Recommendation Engine Tests (`src/lib/engine.test.ts`)
- **11 Test Suites, 100% Passed:**
  - Test 1: Questionnaire Completeness (36 questions across 4 dimensions)
  - Test 2: Database Counts (12 faculties, 70 study programs: 65 Semarang + 5 PSDKU)
  - Test 3: Cosine Similarity Vector Verification
  - Test 4: Dimension Score Normalization
  - Test 5: Tier Classification Thresholds (S, A, B, C, D)
  - Test 6: Study Program Discrimination
  - Test 7: Faculty Aggregate Score Calculation
  - Test 8: Consistency Rule (Tab 1 vs Tab 2 scores identical)
  - Test 9: Determinism & Partial Response Safety
  - Test 10: Quota Database Completeness & Score Invariance
  - **Test 11 (New): PSDKU Exclusion Verification:**
    * 3 distinct randomized/synthetic answer sets verified.
    * 0 PSDKU programs appear in ranked output (`pScores` length = 65).
    * Faculty aggregate scores (`fScores`) computed strictly from non-PSDKU programs.

### 3.2 Automated Data Integrity & Guard Tests (`scripts/test-data-integrity.ts`)
- **11 Guards, 100% Passed:**
  - Guard 1: Official Evidence & File Verification
  - Guard 2: Date Validity
  - Guard 3: Unauthorized Rupiah Amount Scanner (with Roadshow panitia reference allowance & negative trap)
  - Guard 4: Department Evidence Verification
  - Guard 5: Quota Academic Year & Sum Exactness (Sum = 13,250 across all 70 programs)
  - Guard 6: UKT Monotonicity & Group Structure
  - Guard 7: Mandatory Step Hub Links & Disclaimers
  - Guard 8: Responsive Layout Constraints
  - Guard 9: No 100% Scholarship Claims
  - **Guard 10 (New): Program Counts Consistency:** Validated 70 total listed, 65 ranked, 5 PSDKU; caught and prevented stale hardcoded counts.
  - **Guard 11 (New): Centralized Brand Usage:** Verified no un-centralized raw "UNDIP Major Matcher" string literals in `src/` outside `brand.ts`; negative trap confirmed active detection.

### 3.3 Navbar Responsive & Brand Stress Tests (`scripts/test-navbar.js`)
- **Total Checks:** 351 checks across 113 viewport widths (320px to 2560px) on `/`, `/results`, `/program-studi`.
- **Mobile Brand Stress Test:** Tested ~22 character brand name at mobile viewports <= 430px (320px, 360px, 390px, 430px).
- **Result:** 0 collisions, 0 brand truncations, 0 horizontal overflows.

---

## 4. Visual Verification Screenshots

Captured on production build (`http://localhost:3222`):
1. **Jalur UM Mandiri Block (Mobile 390px):** `docs/screenshots/round6/jadwal-seleksi-um-mobile-390.png`
2. **Jalur UM Mandiri Block (Desktop 1440px):** `docs/screenshots/round6/jadwal-seleksi-um-desktop-1440.png`
3. **PSDKU Directory Accordion & Campus Badges:** `docs/screenshots/round6/program-studi-psdku.png`
4. **Results Leaderboard (65 Ranked Programs, 0 PSDKU Leakage):** `docs/screenshots/round6/results-leaderboard.png`

---

## 5. Conclusion & Ready for Prompt D (Round 7)
Round 6 is complete, verified, and committed. The codebase meets all data integrity rules, accessibility standards, responsive constraints, and test requirements. We are ready to proceed with Prompt D (Round 7): Shareable Result Card (Canvas 2D) and Client-Side PDF Export.
