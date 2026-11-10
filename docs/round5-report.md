# Define Your Next Move — Round 5 Verification & Final Report
## Roadshow Sedulur Serang Diponegoro 2027

**Date:** 2026-11-08  
**Target Environment:** Next.js 16.4.5 (Turbopack) / React 19.3.0 / Tailwind CSS v4 / `output: "export"`  
**Production Test Host:** `http://localhost:3222` (`scripts/serve-out.js` serving `out/`)  
**Commit Range:** `b459e4b..be8f76a` on branch `main` (Pushed to GitHub)

---

## 1. Commit Log by Section

Strictly following the 1 commit per numbered section discipline:

| Section | Commit | Message | Key Changes |
|---|---|---|---|
| **Section 1** | `b459e4b` | `feat(navbar): add unified grouped menu and 5-item mobile bottom nav (Section 1)` | Top bar inline links for $\ge 1024$px, single `MENU` button, unified 3-group menu drawer, 5-item mobile bottom navigation with active route detection. |
| **Section 2** | `44b0a1f` | `feat(routes): create langkah-selanjutnya hub and modularize next-steps sections (Section 2)` | Created hub `/langkah-selanjutnya` and layout with 3-pill sticky subnav and linear reading loop; modularized `UKTSection`, `KIPKSection`, `CalendarSection`, and `StatusBadge`; removed duplicate tab from `/results` with redirection. |
| **Section 3** | `0869730` | `feat(ukt): add dedicated biaya kuliah ukt page with interactive program picker (Section 3)` | Dedicated `/langkah-selanjutnya/biaya-ukt` page; searchable interactive program selector with `<Suspense>` URL sync (`?prodi=<id>`), Golongan 1–8/7 nominal breakdown, official SK Rektor evidence citations. |
| **Section 4** | `661c927` | `feat(beasiswa): add dedicated beasiswa kip-kuliah page with metadata and official links (Section 4)` | Dedicated `/langkah-selanjutnya/beasiswa` page; KIP-Kuliah criteria, benefits, registration flow, official portal links, and status badges. |
| **Section 5** | `0a3fe28` | `feat(jadwal): add dedicated jadwal seleksi page with computed quota distribution (Section 5)` | Dedicated `/langkah-selanjutnya/jadwal-seleksi` page; vertical timeline per pathway (SNBP, SNBT, UM), dynamically computed seat distribution from `quotas.ts` (SK Rektor 41/2026). |
| **Section 8** | `50e3527` | `feat(offline): add langkah-selanjutnya routes to service worker precache and static metadata (Section 8)` | Updated `public/sw.js` cache version to `v6`, added all 4 new routes to offline precache assets, added static OpenGraph/Twitter metadata for all pages. |
| **Section 9** | `be8f76a` | `test(prod): verify all round 5 routes, navbar menu, and data integrity (Section 9)` | Extended `test-data-integrity.ts` with Guards 7–9, updated `test-prod-render.js`, `test-navbar.js`, `test-touch-reset.js`, and `verify-full-e2e.js` across production build. |

---

## 2. Production Build Verification

- **Build Command:** `npm run build` (`next build` with Turbopack)
- **Compile & Static Generation:**
  - TypeScript checked in 2.1s (0 errors)
  - 81/81 static pages prerendered (SSG):
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
    * `● /program/[id]` (67 programs)
    * `○ /questionnaire`
    * `○ /results`
- **Postbuild CSS Check (`scripts/test-build-css.js`):**
  - Emitted CSS: `out/_next/static/chunks/34v298d5-2tft.css` (109.6 KB)
  - Tailwind markers (`--tw-`): 1,156
  - Utility markers: `.flex{` (1), `.grid{` (1), `.hidden{` (1), `.relative{` (1), `.fixed{` (1)
  - Result: **PASSED**

---

## 3. Playwright Test Matrix against Production Export (`http://localhost:3222`)

Ran automated suites using `scripts/run-all-prod-tests.js`:

### 3.1 Suite 1: Production Render Verification (`scripts/test-prod-render.js`)
- **Total Assertions:** 181 assertions passed (0 failures, 0 errors)
- **Viewports Tested:**
  - `mobile-390x844` (touch: true, dsf: 2): all 11 routes passed with zero console errors, zero uncaught exceptions, and zero horizontal overflow.
  - `desktop-1440x900` (touch: false, dsf: 1): all 11 routes passed with zero errors.
- **Interactive Verification Checks:**
  1. Deep link `?prodi=ft-arsitektur` initializes with Arsitektur selected.
  2. Program picker selection change updates URL search param and reflects correct UKT table.
  3. Active subnav pill correctly matches current sub-route (`/langkah-selanjutnya/beasiswa`).
  4. Legacy `/results?tab=next-steps#langkah-selanjutnya` redirects cleanly to `/langkah-selanjutnya`.
  5. Mobile bottom navigation contains exactly 5 items (`BERANDA`, `TES`, `HASIL`, `PRODI`, `INFO`) and highlights `INFO` for all `/langkah-selanjutnya/*` pages.

### 3.2 Suite 2: Automated Navbar Overlap & Viewport Sweep (`scripts/test-navbar.js`)
- **Range:** 320px to 2560px with 20px step (113 distinct viewports).
- **Routes Tested:** `/`, `/results`, `/program-studi`.
- **Results:** 339 checks passed with **0 element collisions, 0 brand truncations, and 0 horizontal overflows**. Top bar height maintained at $\le 68\text{px}$ on desktop and $\le 60\text{px}$ on mobile.

### 3.3 Suite 3: Touch Reset Suite (`scripts/test-touch-reset.js`)
- All 6 phone reset controls verified with $\ge 44\text{px}$ tap targets:
  1. Questionnaire Reset Button & Confirmation Modal (`width: 78.5px, height: 44px`)
  2. Results Header Retake Button (`width: 44px, height: 44px`)
  3. Results Panel Bottom Retake Button (`width: 361px, height: 46px`)
  4. Map Reset Camera / Overview Buttons (`toolbar: 40x44px`, `dock: 107x44px`)
  5. Putar Ulang Intro in Mobile Menu (`width: 361px, height: 44px`, opens intro overlay)
  6. Reset Filter in Results List (`width: 62.7px, height: 44px`)

### 3.4 Suite 4: Full E2E & Multi-Device Sweep (`scripts/verify-full-e2e.js`)
- **Device Viewports Tested:**
  - 320x568 (iPhone SE gen 1)
  - 360x640 (Galaxy S8 / small Android)
  - 375x667 (iPhone 8 / SE)
  - 390x844 (iPhone 12/13/14)
  - 414x896 (iPhone 11/XR)
  - 430x932 (iPhone 14/15/16 Pro Max)
  - 768x1024 (iPad portrait)
  - 1024x768 (iPad landscape / small laptop)
  - 1440x900 (Desktop HD)
  - 1920x1080 (Desktop FHD)
  - 844x390 (Mobile Landscape)
- **Routes Checked:** All 10 core routes across all 11 viewports ($11 \times 10 = 110$ checks).
- **Result:** **110/110 passed with ZERO horizontal overflow** (`scrollWidth === clientWidth`).

---

## 4. Data Integrity & Guard Verification (`scripts/test-data-integrity.ts`)

- **Command:** `npm run test:data`
- **Output:** 0 errors across 9 guard categories:
  - **Guard 1:** Official evidence citations present on all data.
  - **Guard 2:** Valid retrieval dates.
  - **Guard 3:** No unauthorized numeric amounts in KIP-Kuliah and Calendar data.
  - **Guard 4:** Verified department evidence for vocational and undergraduate programs.
  - **Guard 5:** Academic year consistency (2026/2027) and individual quota breakdown sums.
  - **Guard 6:** UKT group validity (Golongan 1–8 for Sarjana, Golongan 1–7 for Vokasi).
  - **Guard 7 (New):** Quota sum invariant across the university: Total SNBP + Total SNBT + Total Mandiri = 100% of Total Capacity (verified across all 67 programs).
  - **Guard 8 (New):** Prohibited standalone "KIP-K" abbreviations across `src/data` and `src/components` (strictly standardized to "KIP-Kuliah").
  - **Guard 9 (New):** Prohibited misleading "100%" scholarship claims across all copy.

---

## 5. Offline Support & PWA Precache

- `public/sw.js` cache version incremented to `undip-major-matcher-v6`.
- Precache manifest includes all new static assets:
  - `/langkah-selanjutnya`
  - `/langkah-selanjutnya/biaya-ukt`
  - `/langkah-selanjutnya/beasiswa`
  - `/langkah-selanjutnya/jadwal-seleksi`
- Full offline fallback configured with `/offline` service worker fallback.

---

## 6. GitHub Repository Status

- Branch: `main`
- Status: Clean working tree
- Up-to-date with remote: `kaiynan/undip-major-tracker`
- Verified commits pushed: `321a414..be8f76a`
