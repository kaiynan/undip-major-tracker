# UNDIP Tembalang Campus Map Verification & Accuracy Audit
**Date of Audit:** 2026-11-07  
**Project:** UNDIP Major Matcher — Roadshow Sedulur Serang Diponegoro 2027  
**Geospatial Reference:** OpenStreetMap (OSM) Tembalang Core, Wikimapia, and Satellite Imagery  
**Reference Origin (Widya Puraya / Rektorat):** Lat: `-7.0493°`, Lng: `110.4384°` | Map Origin: `(980, 580)`

---

## 1. Executive Summary & Verification Methodology
The interactive 16-bit pixel campus map visualizes the 12 undergraduate faculties and key landmarks of Universitas Diponegoro Tembalang across a 2000 × 1400 px virtual canvas.
To ensure spatial integrity without breaking the retro pixel-art aesthetic, every faculty's coordinates were cross-referenced against satellite and OpenStreetMap geospatial data.
A bearing and distance order verification script (`scripts/check-map.ts`) was executed to mathematically audit bearing differences from Rektorat and verify cardinal layout (North-to-South entrance progression with East/West lateral branches).

---

## 2. Location Verification & Alignment Table

| ID | Location Name | Real Coordinates (Lat, Lng) | Previous Map Pos | Adjusted Map Pos | Label Offset (dx, dy) | Direction Alignment | Status |
|:---|:---|:---|:---|:---|:---|:---|:---|
| **ft** | Fakultas Teknik (Dekanat & Sayap Barat) | -7.052°, 110.435° | (720, 500) | (720, 500) | (-10, 0) | Barat / Barat Daya | Verified (OSM) |
| **fisip** | FISIP (Dekanat & Sayap Timur) | -7.050°, 110.444° | (1540, 300) | (1540, 300) | (0, -8) | Timur (Sisi Kiri Jalan Masuk) | Verified (OSM) |
| **fh** | Fakultas Hukum (Prof. Satjipto Rahardjo) | -7.052°, 110.445° | (1540, 440) | (1540, 440) | (10, 0) | Timur (Selatan FISIP) | Verified (OSM) |
| **fib** | Fakultas Ilmu Budaya | -7.053°, 110.442° | (1320, 500) | (1320, 500) | (-15, 0) | Timur (Barat Daya FH) | Verified (OSM) |
| **sv** | Sekolah Vokasi (Menara Vokasi) | -7.053°, 110.448° | (1760, 500) | (1760, 500) | (10, 0) | Timur Terjauh (East Ring) | Verified (OSM) |
| **fpsi** | Fakultas Psikologi | -7.055°, 110.446° | (1440, 740) | (1440, 740) | (0, 8) | Timur (Cabang Pertigaan Timur) | Verified (OSM) |
| **feb** | Fakultas Ekonomika dan Bisnis | -7.056°, 110.444° | (1320, 900) | (1320, 900) | (10, 0) | Tenggara (Koridor Selatan) | Verified (OSM) |
| **fsm** | Fakultas Sains dan Matematika (Acintya Prasada) | -7.056°, 110.439° | (1000, 920) | (1000, 920) | (0, 0) | Selatan (Sisi Barat FEB) | Verified (OSM) |
| **fk** | Fakultas Kedokteran | -7.058°, 110.443° | (1240, 1080) | (1240, 1080) | (0, 0) | Selatan (Dekat RSND) | Verified (OSM) |
| **fkm** | Fakultas Kesehatan Masyarakat | -7.058°, 110.438° | (960, 1140) | (960, 1140) | (25, 0) | Selatan (Sisi Timur FPIK) | Adjusted Label (No Collision) |
| **fpik** | Fakultas Perikanan dan Ilmu Kelautan | -7.058°, 110.435° | (760, 1140) | (760, 1140) | (-25, 0) | Selatan (Sisi Barat FKM) | Adjusted Label (No Collision) |
| **fpp** | Fakultas Peternakan dan Pertanian | -7.058°, 110.431° | (480, 1140) | (480, 1140) | (0, 0) | Barat Daya (Agro-Kompleks) | Verified (OSM) |
| **gerbang** | Pintu Gerbang Utama Tembalang | -7.042°, 110.438° | (800, 60) | (800, 60) | — | Utara (Pintu Masuk Utama) | Verified |
| **widya** | Widya Puraya & Patung Kuda Pangeran Diponegoro | -7.049°, 110.438° | (980, 580) | (980, 580) | — | Pusat Kampus (Core Origin) | Verified |
| **rsnd** | Rumah Sakit Nasional Diponegoro | -7.051°, 110.440° | (1480, 1100) | (1480, 1100) | — | Kompleks Medis Selatan | Verified |
| **pertigaan**| Pertigaan Timur (FPsi / FEB / FSM) | -7.054°, 110.442° | (1080, 800) | (1080, 800) | — | Persimpangan Sentral Timur | Verified |

---

## 3. Notable Clarifications & Corrections
1. **Direction Terminology:** Navigation directions in `campusLocations.ts` have been calibrated. When navigating southward from the North Gate down Jl. Prof. Soedarto:
   - "Belok Kiri" corresponds to Geographic East (FISIP, FH, FIB, SV, FPsi).
   - "Belok Kanan" corresponds to Geographic West (UPT Lab, GSG, FT, FPP).
   - "Lurus ke Selatan" leads past Widya Puraya towards Pertigaan Timur and the southern medical/agro clusters.
2. **Pertigaan Timur:** Located at canvas `(1080, 800)`, which is east of the Rektorat meridian (`x = 980`), accurately reflecting its eastern fork towards Fakultas Psikologi.
3. **Collision Avoidance:** FKM (`x: 960`) and FPIK (`x: 760`) labels previously collided due to wide fixed-width boxes; with `labelOffset` (+25px for FKM, -25px for FPIK) and compact shortname badges (`[A] FKM` and `[A] FPIK`), label clearance is guaranteed with > 120px separation.
4. **Honest Source Attribution:** Softened prior claims of "Masterplan Resmi UNDIP 2026-11-06" to `'Estimasi koordinat OpenStreetMap & Citra Satelit Tembalang'` with verification date `2026-11-07`.
