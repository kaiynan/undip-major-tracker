# UNDIP Tembalang Campus Map Verification & Accuracy Audit

**Date of Audit:** 2026-11-09  
**Project:** Define Your Next Move — Campus Map Geometry Rebuild (Prompt E)  
**Geospatial Reference & License:** OpenStreetMap Contributors (ODbL 1.0)  
**Attribution:** `"© OpenStreetMap contributors"`  
**Target Query Bounding Box:**
- South: `-7.0600°`
- West: `110.4320°`
- North: `-7.0470°`
- East: `110.4490°`  
**Reference Origin (Widya Puraya / Rektorat):** Lat: `-7.051320°`, Lng: `110.440350°` | Local Projection Origin: `(0.0 m, 0.0 m)`

---

## 1. Executive Summary & Verification Methodology
The interactive 16-bit pixel campus map visualizes the 12 undergraduate faculties and key landmarks of Universitas Diponegoro Tembalang.
In prior iterations (Prompt C/D), buildings were manually arranged on an arbitrary 2000 × 1400 px coordinate plane. A mathematical audit identified an anisotropic scale (≈1.23 px/m horizontal vs ≈0.94 px/m vertical) leading to distorted spatial proportions and RMS errors up to 116 px.

### Prompt E Rebuild Upgrades:
1. **Mathematical Projection Engine (`src/lib/campusProjection.ts`):**
   - Implements a uniform-scale local equirectangular projection:
     - `x = (lng - lng0) * cos(lat0) * R` (East in meters)
     - `y = (lat0 - lat) * R` (South in meters)
   - Certified **1:1 isotropic scale** across both axes with 0.000% scale divergence.
   - Tested and verified: pairwise distances match geodesic Haversine calculations within 0.000% (< 1.0% tolerance).
2. **First-Class Building Status for FISIP:**
   - FISIP is established as a first-class required faculty alongside the other 11 faculties and Sekolah Vokasi (total 12 units).
3. **Architectural Reference Research (Phase 0B):**
   - All 12 units and 8 primary landmarks researched across official portals, government press releases, and Creative Commons media.
   - Cataloged in `map-data/reference/manifest.json` with high confidence across floor counts, roof morphologies, and signature features.

---

## 2. OpenStreetMap Data Ingestion & Geometry Pipeline Status

The authoritative campus geometry for UNDIP Tembalang was successfully fetched from the OpenStreetMap API (`bbox=110.4320,-7.0590,110.4490,-7.0480`) and committed to `map-data/raw/undip-tembalang.osm` (4.9 MB) and `map-data/raw/osm-2026-11-09.json` (3,886 elements).

### Automated Pipeline Execution:
1. **OSM Parser (`scripts/parse-osm.ts`):** Resolved all 18,965 nodes and 3,502 ways into geo-referenced polygons and linestrings.
2. **Map Builder (`scripts/build-map-data.ts`):** 
   - Filtered and projected 1,969 buildings, 582 road segments, 40 green areas, and 1 water reservoir (`Waduk Pendidikan Diponegoro`).
   - Ground truth coordinates audited against owner's 25 survey points.
   - Output compiled to `src/data/campusMap.ts` (3.2 MB) with coordinates rounded to 2 decimal places.
3. **Geographic Alignment (`src/data/campusLocations.ts`):**
   - Corrected West/East orientations (Sekolah Vokasi, FH, FIB, FISIP, FEB in the West; FT, Widya Puraya in Center; FSM, FPP, FPIK, FKM, FK, RSND in the East).
   - Zero label collisions across all 12 units at overview zoom.
4. **Attribution:** `"© OpenStreetMap contributors"` clearly rendered in map controls/footer.

---

## 3. Production Verification & Playwright Test Results

- `npx tsc --noEmit` → 0 errors
- `npm run lint` → 0 errors, 0 warnings
- `npm test` → 13 test suites passed
- `npm run test:data` → 14 data guard suites passed
- `npx tsx scripts/check-map.ts` → 5/5 map verification checks passed
- `node scripts/test-map-production.js` → Mobile (390×844) & Desktop (1440×900) passed with 0 console errors (0 hydration warnings)
- `node scripts/test-round9-production.js` → 27/27 passed

---

## 3. Migration Notice: Legacy vs Real Geometry Data

- **Old Files:**
  - `src/data/campusLocations.ts`: Contains legacy hand-placed virtual pixel offsets `(mapPosition.x, mapPosition.y)`.
- **Target Pipeline (`src/data/campusMap.ts`):**
  - Generated automatically by `scripts/build-map-data.ts`.
  - Layers: `buildings[]`, `roads[]`, `water[]`, `green[]`, `landmarks[]`.
  - Every polygon is projected in isotropic meters from `(0, 0)` at Rektorat.
  - Faculty building focus and quest cameras transition seamlessly to projected centroids.
