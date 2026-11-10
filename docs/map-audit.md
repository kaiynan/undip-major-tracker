# UNDIP Tembalang Campus Map — Geographic & Landmark Audit (Round 10)

**Date:** 2026-11-10  
**Repository:** `Define Your Next Move` (`undip-major-matcher`)  
**Campus Origin Reference (Widya Puraya Projection Origin):** Lat: `-7.051320°`, Lng: `110.440350°`  
**Projection Engine:** Uniform-Scale Local Equirectangular (`src/lib/campusProjection.ts`, isotropic 1:1 meter scale)  
**Status:** Completed. All 12 faculties and 19 campus landmarks audited against OpenStreetMap real geometry (`map-data/raw/osm-2026-11-09.json`) and verified with local bus stop sanity anchors.

---

## 1. Root Cause Analysis: The Previous Landmark & Building Drift

Prior to Round 10, the campus map suffered from a fundamental geographic inconsistency:
1. **Source Mismatch:** The continuous road network was faithfully projected from OpenStreetMap real geometry (ODbL), but the 12 faculty and landmark locations were placed using a hand-collected "owner ground truth table" marked `source: 'approx'`.
2. **Measured Drift:** As audited in the table below, the owner's hand-collected points differed from the actual named OpenStreetMap buildings by **120 meters to over 770 meters** (e.g. FPsi was off by 770 m, RSND by 687 m, SV by 574 m, FIB by 450 m, Widya Puraya by 388 m, FK by 307 m, FSM by 287 m, and FKM by 251 m).
3. **Cartoon Sprites vs Footprints:** Buildings were rendered as oversized fixed-size cartoon house sprites (180x140 px) instead of real building footprints, causing dense clusters (FT complex, SC / FEB / FISIP) to overlap.
4. **Floating Unsourced Artifacts:** Standalone FT department chips floated arbitrarily without geometry, an unexplained dark-green rotated rectangle appeared near the sports area, and tree icons were scattered across roads and buildings without GIS source.

### The Resolution (Round 10)
- **OSM is the Truth:** Every verified faculty and iconic landmark is matched to its real OpenStreetMap polygon(s) and cluster centroid.
- **Unverified Fallback:** Units and landmarks with no named feature in OSM (notably FEB, Art Centre, Taman Inspirasi, Bundaran Pertama, Patung Kuda, Menara Undip, and Gerbang Utama) are preserved strictly as `source: 'approx'`, rendered with dashed outlines and "(Perkiraan)" styling, hidden at overview zoom (`zoom < 1.6`), and cataloged in `docs/map-owner-checklist.md`.
- **Polygon Footprints:** Faculty buildings are rendered from their real OSM polygons with grid-snapped pixel styling, authentic faculty color themes, and subtle 2.5D wall extrusions. A single clean label is placed at each faculty's cluster centroid.

---

## 2. Full Geographic Audit: Owner Hand-Collected Points vs OSM Truth

The table below catalogs all 25 owner points compared against the true OpenStreetMap named features and cluster centroids:

| Point ID | Unit / Landmark Name | Category | Owner Coordinates | Matched OSM Name & Feature ID | OSM Cluster Centroid | Drift Distance (m) | Verified Status |
|:---|:---|:---|:---:|:---|:---:|:---:|:---:|
| `sv` | Sekolah Vokasi | Faculty | `-7.055820, 110.434890` | Sekolah Vokasi Universitas Diponegoro (`508049846, 508049849`) | `-7.050674, 110.435324` | **574.3 m** | ✓ Verified (2 OSM buildings) |
| `fh` | Fakultas Hukum | Faculty | `-7.052880, 110.436350` | Gedung Fakultas Hukum (`313719455, 573422635`) | `-7.051250, 110.436260` | **181.6 m** | ✓ Verified (2 OSM buildings) |
| `fib` | Fakultas Ilmu Budaya | Faculty | `-7.053950, 110.436820` | Gedung Fak. Ilmu Budaya & Sekretariat (`313719460, 313719488`) | `-7.049901, 110.436774` | **450.3 m** | ✓ Verified (2 OSM buildings) |
| `fisip` | FISIP | Faculty | `-7.052820, 110.437650` | Gedung Fak. Ilmu Sosial dan Ilmu Politik (`313719489`) | `-7.051754, 110.437338` | **123.4 m** | ✓ Verified (1 OSM building) |
| `feb` | Fak. Ekonomika dan Bisnis | Faculty | `-7.052150, 110.438120` | *(Not found by name in OSM)* | `-7.052150, 110.438120` | **0.0 m** | ⚠️ `source: 'approx'` (Awaiting Owner GPS) |
| `ft` | Fakultas Teknik | Faculty | `-7.053150, 110.439920` | Dekanat FT, GKB, Arsitektur, Sipil, Mesin, Elektro, Kimia, PWK, Geodesi, Komputer (23 ways) | `-7.051261, 110.439342` | **219.5 m** | ✓ Verified (23 OSM buildings) |
| `fpp` | Fak. Peternakan & Pertanian | Faculty | `-7.053250, 110.442680` | Gedung FPP & Teknologi Pangan (`313703653, 313703679, 313719457, 313719495`) | `-7.053162, 110.441458` | **135.2 m** | ✓ Verified (4 OSM buildings) |
| `fsm` | Fak. Sains dan Matematika | Faculty | `-7.051450, 110.442150` | Gedung Dekanat FMIPA, Biologi, Geofisika (`313703664, 313703678, 313719456, 573422694`) | `-7.048895, 110.441781` | **287.0 m** | ✓ Verified (4 OSM buildings) |
| `fpik` | Fak. Perikanan & Kelautan | Faculty | `-7.051950, 110.443650` | Kompleks Gedung A–J FPIK (`313703681` s.d. `573954851`, 10 ways) | `-7.050970, 110.442585` | **160.3 m** | ✓ Verified (10 OSM buildings) |
| `fkm` | Fak. Kesehatan Masyarakat | Faculty | `-7.051280, 110.444350` | Gedung Fakultas Kesehatan Masyarakat (`313721936, 313721958`) | `-7.049498, 110.442948` | **251.4 m** | ✓ Verified (2 OSM buildings) |
| `fpsi` | Fakultas Psikologi | Faculty | `-7.054110, 110.438650` | Gedung Fakultas Psikologi (`313721938, 573503265`) | `-7.049074, 110.443440` | **770.0 m** | ✓ Verified (2 OSM buildings) |
| `fk` | Fakultas Kedokteran | Faculty | `-7.052180, 110.445450` | Gedung A/B FK, Ilmu Keperawatan, Ilmu Gizi (`476102020, 476102022, 476436105, 573503274`) | `-7.049648, 110.444335` | **307.2 m** | ✓ Verified (4 OSM buildings) |
| `rektorat` | Gedung Widya Puraya | Landmark | `-7.051320, 110.440350` | Gedung Widya Puraya (`way/313693591`) | `-7.048836, 110.438023` | **388.7 m** | ✓ Verified (OSM building) |
| `perpustakaan` | Perpustakaan Widya Puraya | Landmark | `-7.051320, 110.440350` | Perpustakaan Widya Puraya (`way/313693592`) | `-7.048272, 110.437718` | **456.8 m** | ✓ Verified (OSM building) |
| `gsg` | GSG Prof. Soedarto | Landmark | `-7.051050, 110.439180` | Gedung Prof Soedarto SH (`way/313693582`) | `-7.052796, 110.440353` | **233.3 m** | ✓ Verified (OSM building) |
| `student-centre` | Student Center | Landmark | `-7.053120, 110.438450` | Student Center (`way/508049877`) | `-7.053846, 110.438662` | **84.0 m** | ✓ Verified (OSM building) |
| `masjid-kampus` | Masjid Kampus UNDIP | Landmark | `-7.052670, 110.440270` | Masjid Kampus Universitas Diponegoro (`way/313697399`) | `-7.055093, 110.436926` | **458.2 m** | ✓ Verified (OSM building) |
| `muladi-dome` | Muladi Dome | Landmark | `-7.053420, 110.432950` | Muladi Dome (`way/558963174`) | `-7.053422, 110.432951` | **0.2 m** | ✓ Verified (OSM building) |
| `stadion` | Stadion UNDIP | Landmark | `-7.056070, 110.444850` | Stadion UNDIP (`way/313721963`) | `-7.054647, 110.446517` | **241.6 m** | ✓ Verified (OSM sports feature) |
| `waduk` | Waduk Pendidikan Diponegoro | Landmark | `-7.052820, 110.444740` | Waduk Pendidikan Diponegoro (`way/313724147, node/5539504862`) | `-7.052528, 110.445621` | **102.5 m** | ✓ Verified (OSM water body) |
| `rsnd` | RSND Undip | Landmark | `-7.053120, 110.446380` | Rumah Sakit Nasional Diponegoro (`way/573422707`) | `-7.047685, 110.443403` | **687.8 m** | ✓ Verified (OSM hospital complex) |
| `lab-terpadu` | Laboratorium Terpadu Undip | Landmark | `-7.056500, 110.439000` | Laboratorium Terpadu Undip (`way/573503194`) | `-7.054598, 110.439863` | **230.1 m** | ✓ Verified (OSM building) |
| `ict-centre` | Gedung ICT Centre | Landmark | `-7.051100, 110.440000` | 1. Gedung ICT Centre (`way/313693583`) | `-7.054399, 110.439079` | **379.8 m** | ✓ Verified (OSM building) |
| `career-center` | Undip Career Center | Landmark | `-7.051100, 110.440000` | Undip Career Center (`way/313693586`) | `-7.054149, 110.439227` | **350.6 m** | ✓ Verified (OSM building) |
| `art-centre` | Art Centre Undip | Landmark | `-7.052020, 110.438750` | *(Not found by name in OSM)* | `-7.052020, 110.438750` | **0.0 m** | ⚠️ `source: 'approx'` (Awaiting Owner Survey) |
| `taman-inspirasi`| Taman Inspirasi | Landmark | `-7.052700, 110.439300` | *(Not found by name in OSM)* | `-7.052700, 110.439300` | **0.0 m** | ⚠️ `source: 'approx'` (Awaiting Owner Survey) |
| `bundaran-pertama`| Bundaran Pertama | Landmark | `-7.051600, 110.439500` | *(Not found by name in OSM)* | `-7.051600, 110.439500` | **0.0 m** | ⚠️ `source: 'approx'` (Awaiting Owner Survey) |
| `patung-kuda` | Patung Kuda Undip | Landmark | `-7.051100, 110.440100` | *(Not found by name in OSM)* | `-7.051100, 110.440100` | **0.0 m** | ⚠️ `source: 'approx'` (Awaiting Owner Survey) |
| `menara-undip` | Menara Undip | Landmark | `-7.052800, 110.437900` | *(Not found by name in OSM)* | `-7.052800, 110.437900` | **0.0 m** | ⚠️ `source: 'approx'` (Awaiting Owner Survey) |
| `gerbang-utama` | Pintu Gerbang Utama | Landmark | `-7.049100, 110.439300` | *(Not found by name in OSM)* | `-7.049100, 110.439300` | **0.0 m** | ⚠️ `source: 'approx'` (Awaiting Owner Survey) |

---

## 3. Independent Verification: Campus Bus Stop Sanity Anchors

In OpenStreetMap, the internal campus transit shuttle bus stops are explicitly named after the faculties and complexes they serve. These nodes serve as independent ground anchors to verify the OSM building polygons:

| Bus Stop Node | Coordinates | Target Faculty | Distance to Nearest Polygon | Threshold | Status |
|:---|:---:|:---:|:---:|:---:|:---:|
| `node/10600377422` ("Bus Stop Campus 4 - FH FISIP") | `-7.049496, 110.435633` | FH | **204.2 m** | ≤ 250 m | ✓ PASS |
| `node/10600377423` ("Bus Stop Campus 5 - Vokasi FIB") | `-7.050448, 110.435792` | SV | **18.8 m** | ≤ 250 m | ✓ PASS |
| `node/10600377423` ("Bus Stop Campus 5 - Vokasi FIB") | `-7.050448, 110.435792` | FIB | **77.7 m** | ≤ 250 m | ✓ PASS |
| `node/10600377426` ("Bus Stop 8 - FKM FK") | `-7.048689, 110.442687` | FKM | **78.3 m** | ≤ 250 m | ✓ PASS |
| `node/10600377426` ("Bus Stop 8 - FKM FK") | `-7.048689, 110.442687` | FK | **212.3 m** | ≤ 250 m | ✓ PASS |
| `node/10600377427` ("Bus Stop Campus 9 - FPIK") | `-7.050102, 110.442218` | FPIK | **44.0 m** | ≤ 250 m | ✓ PASS |
| `node/10600377428` ("Bus Stop Campus 10 - FPP") | `-7.052299, 110.441570` | FPP | **41.4 m** | ≤ 250 m | ✓ PASS |
| `node/10600377419` ("Bus Campus Stop 3 - Student Centre") | `-7.053498, 110.438890` | Student Center | **46.4 m** | ≤ 250 m | ✓ PASS |
| `node/10600377429` ("Bus Stop Campus 11 - Lab Terpadu") | `-7.054928, 110.439495` | Lab Terpadu | **54.2 m** | ≤ 250 m | ✓ PASS |

All bus stops independently confirm the true OpenStreetMap polygon locations within 18 meters to 212 meters.

---

## 4. Verification Invariants Status

- **Check 1 (12 Units Representation):** Exactly 12 units mapped. (PASS)
- **Check 2 (OSM Polygon Sources):** 11 faculties verified against real OSM polygons; FEB explicitly flagged as `source: 'approx'`. (PASS)
- **Check 3 (Centroid Precision):** All 11 verified faculties have centroid distance `≤ 0.08m` from matched OSM features (threshold `≤ 40m`). (PASS)
- **Check 4 (Source Attribution):** 100% of campus buildings (1,970), landmarks (18), and faculty locations have valid `source` property. (PASS)
- **Check 5 (Label Collision Avoidance):** 0 label intersections across all 20 overview labels. (PASS)
- **Check 6 (Uniform Scale):** Isotropic px/m ratio deviation = `0.0000%` (threshold `< 0.5%`). (PASS)
- **Check 7 (PSDKU Exclusion):** 0 off-campus PSDKU programs/campuses present on Tembalang map. (PASS)
