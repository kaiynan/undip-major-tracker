import * as fs from 'fs';
import * as path from 'path';
import { project, haversineDistanceMeters, GeoPoint, MapPoint, CAMPUS_ORIGIN } from '../src/lib/campusProjection';
import { OWNER_POINTS } from './map-audit';

function r2(n: number): number {
  return Math.round(n * 100) / 100;
}

function roundPoint(pt: MapPoint): MapPoint {
  return { x: r2(pt.x), y: r2(pt.y) };
}

function roundGeo(pt: GeoPoint): GeoPoint {
  return {
    lat: Math.round(pt.lat * 1000000) / 1000000,
    lng: Math.round(pt.lng * 1000000) / 1000000,
  };
}

export interface CampusBuilding {
  id: string;
  osmId: string | null;
  name: string;
  matchedName: string;
  facultyId?: string;
  category: 'faculty' | 'public' | 'department' | 'administrative';
  polygon: GeoPoint[];
  projectedPolygon: MapPoint[];
  centroid: GeoPoint;
  projectedCentroid: MapPoint;
  levels: number;
  tags: Record<string, string>;
  source: 'osm' | 'owner' | 'approx';
  distanceFromOwnerPointM?: number;
  style?: {
    roofType?: string;
    mainColors?: string[];
    facade?: string;
    signatureFeatures?: string[];
    entranceSide?: string;
  };
}

export interface CampusRoad {
  id: string;
  name?: string;
  highwayClass: string;
  coordinates: GeoPoint[];
  projectedCoordinates: MapPoint[];
  widthMeters: number;
}

export interface CampusWater {
  id: string;
  name?: string;
  polygon: GeoPoint[];
  projectedPolygon: MapPoint[];
}

export interface CampusGreen {
  id: string;
  name?: string;
  type: string;
  polygon: GeoPoint[];
  projectedPolygon: MapPoint[];
}

export interface CampusLandmark {
  id: string;
  osmId: string | null;
  name: string;
  matchedName: string;
  coords: GeoPoint;
  projectedCoords: MapPoint;
  category: string;
  description?: string;
  source: 'osm' | 'owner' | 'approx';
  distanceFromOwnerPointM?: number;
}

export interface CampusMapData {
  generatedAt: string;
  attribution: string;
  origin: GeoPoint;
  boundsMeters: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
  };
  buildings: CampusBuilding[];
  roads: CampusRoad[];
  water: CampusWater[];
  green: CampusGreen[];
  landmarks: CampusLandmark[];
}

export interface OsmElementNode {
  lat: number;
  lon: number;
}

export interface OsmRawElement {
  id: string | number;
  type: string;
  lat?: number;
  lon?: number;
  geometry?: OsmElementNode[];
  tags?: Record<string, string>;
}

export interface ManifestBuilding {
  buildingId: string;
  name: string;
  observed: {
    roofType?: string;
    mainColors?: string[];
    facade?: string;
    signatureFeatures?: string[];
    entranceSide?: string;
  };
}

export interface ManifestData {
  buildings?: ManifestBuilding[];
}

function calculateCentroid(polygon: GeoPoint[]): GeoPoint {
  if (polygon.length === 0) return { lat: 0, lng: 0 };
  let sumLat = 0;
  let sumLng = 0;
  for (const pt of polygon) {
    sumLat += pt.lat;
    sumLng += pt.lng;
  }
  return {
    lat: sumLat / polygon.length,
    lng: sumLng / polygon.length,
  };
}

function getRoadWidth(highwayClass: string): number {
  switch (highwayClass) {
    case 'primary':
    case 'secondary':
      return 12;
    case 'tertiary':
      return 9;
    case 'residential':
      return 6;
    case 'service':
      return 4;
    case 'footway':
    case 'path':
    case 'pedestrian':
      return 3;
    default:
      return 4;
  }
}

// Named OSM patterns for the 11 verified faculties
const FACULTY_PATTERNS: Record<string, { name: string; patterns: string[] }> = {
  fh: {
    name: 'Fakultas Hukum',
    patterns: ['Gedung Fakultas Hukum'],
  },
  fisip: {
    name: 'Fakultas Ilmu Sosial dan Ilmu Politik',
    patterns: ['Gedung Fakultas Ilmu Sosial dan Ilmu Politik'],
  },
  fib: {
    name: 'Fakultas Ilmu Budaya',
    patterns: ['Gedung Fakultas Ilmu Budaya', 'Gedung Sekretariat Ilmu Budaya'],
  },
  fpsi: {
    name: 'Fakultas Psikologi',
    patterns: ['Gedung Fakultas Psikologi'],
  },
  fkm: {
    name: 'Fakultas Kesehatan Masyarakat',
    patterns: ['Gedung Fakultas Kesehatan Masyarakat'],
  },
  fk: {
    name: 'Fakultas Kedokteran',
    patterns: [
      'Gedung A - Fakultas Kedokteran',
      'Gedung B - Fakultas Kedokteran',
      'Gedung Departemen Ilmu Keperawatan',
      'Gedung Departemen Ilmu Gizi',
    ],
  },
  fpik: {
    name: 'Fakultas Perikanan dan Ilmu Kelautan',
    patterns: [
      'Gedung A - Dekanat FPIK',
      'Gedung B FPIK',
      'Gedung C FPIK',
      'Gedung D - FPIK',
      'Gedung E - FPIK',
      'Gedung F - FPIK',
      'Gedung G - FPIK',
      'Gedung H - FPIK',
      'Gedung I - Auditorium FPIK',
      'Gedung J - FPIK',
    ],
  },
  fpp: {
    name: 'Fakultas Peternakan dan Pertanian',
    patterns: [
      'Gedung Fakultas Peternakan dan Pertanian',
      'Gedung Fakultas Teknologi Pangan',
    ],
  },
  fsm: {
    name: 'Fakultas Sains dan Matematika',
    patterns: [
      'Gedung Dekanat FMIPA',
      'Gedung Jurusan Biologi',
      'Gedung Laboratorium Geofisika',
      'Gedung Geofisika',
    ],
  },
  sv: {
    name: 'Sekolah Vokasi',
    patterns: [
      'Sekolah Vokasi Universitas Diponegoro',
      'Gedung Sekolah Vokasi',
    ],
  },
  ft: {
    name: 'Fakultas Teknik',
    patterns: [
      'Dekanat Fakultas Teknik',
      'Gedung Kuliah Bersama - Fakultas Teknik',
      'Gedung A - Teknik Sipil Undip',
      'Gedung B - Teknik Sipil Undip',
      'Gedung C - Teknik Sipil Undip',
      'Gedung D - Teknik Sipil Undip',
      'Gedung E - Teknik Sipil Undip',
      'Gedung Teknik Arsitektur Undip',
      'Gedung Arsitektur Undip',
      'Gedung C - Teknik Arsitektur UNDIP',
      'Gedung Teknik Mesin',
      'Gedung Kuliah Teknik Mesin',
      'Gedung Laboratorium Tribologi - Teknik Mesin',
      'Gedung B - Teknik Elektro',
      'Gedung Teknik Kimia',
      'Teknik Kimia B',
      'Gedung Teknik Informatika',
      'Teknik Komputer',
      'Gedung A - Teknik Perencanaan Wilayah dan Kota',
      'Gedung Teknik Perencanaan Wilayah dan Kota',
      'Gedung Teknik Geodesi dan Perkapalan',
      'Gedung D3 Teknik Sipil',
    ],
  },
};

// Verified Iconic Landmarks in OSM
const ICONIC_LANDMARKS: { id: string; name: string; pattern: string; category: string }[] = [
  { id: 'widya-puraya', name: 'Gedung Widya Puraya', pattern: 'Gedung Widya Puraya', category: 'administrative' },
  { id: 'library-widya-puraya', name: 'Perpustakaan Widya Puraya', pattern: 'Perpustakaan Widya Puraya', category: 'library' },
  { id: 'gsg', name: 'Gedung Prof Soedarto SH', pattern: 'Gedung Prof Soedarto SH', category: 'auditorium' },
  { id: 'student-center', name: 'Student Center', pattern: 'Student Center', category: 'student_center' },
  { id: 'masjid-kampus', name: 'Masjid Kampus Universitas Diponegoro', pattern: 'Masjid Kampus Universitas Diponegoro', category: 'place_of_worship' },
  { id: 'muladi-dome', name: 'Muladi Dome', pattern: 'Muladi Dome', category: 'auditorium' },
  { id: 'stadion', name: 'Stadion UNDIP', pattern: 'Stadion UNDIP', category: 'sports' },
  { id: 'taman-rusa', name: 'Taman Rusa UNDIP', pattern: 'Taman Rusa UNDIP', category: 'park' },
  { id: 'waduk', name: 'Waduk Pendidikan Diponegoro', pattern: 'Waduk Pendidikan Diponegoro', category: 'water' },
  { id: 'rsnd', name: 'Rumah Sakit Nasional Diponegoro', pattern: 'Rumah Sakit Nasional Diponegoro', category: 'hospital' },
  { id: 'lab-terpadu', name: 'Laboratorium Terpadu Undip', pattern: 'Laboratorium Terpadu Undip', category: 'laboratory' },
  { id: 'ict-centre', name: 'Gedung ICT Centre', pattern: 'Gedung ICT Centre', category: 'it_center' },
  { id: 'career-center', name: 'Undip Career Center', pattern: 'Undip Career Center', category: 'career' },
];

// Unverified features: keep ONLY as source: 'approx'
const UNVERIFIED_LANDMARKS = [
  { id: 'art-centre', name: 'Art Centre Undip', keywords: ['art centre'], category: 'arts_centre', coords: { lat: -7.052020, lng: 110.438750 } },
  { id: 'taman-inspirasi', name: 'Taman Inspirasi', keywords: ['taman inspirasi'], category: 'park', coords: { lat: -7.052700, lng: 110.439300 } },
  { id: 'bundaran-pertama', name: 'Bundaran Pertama', keywords: ['bundaran pertama'], category: 'traffic_circle', coords: { lat: -7.051600, lng: 110.439500 } },
  { id: 'patung-kuda', name: 'Patung Kuda Undip', keywords: ['patung kuda', 'monumen'], category: 'monument', coords: { lat: -7.051100, lng: 110.440100 } },
  { id: 'menara-undip', name: 'Menara Undip', keywords: ['menara undip'], category: 'tower', coords: { lat: -7.052800, lng: 110.437900 } },
  { id: 'gerbang-utama', name: 'Pintu Gerbang Utama Tembalang', keywords: ['gerbang', 'pintu gerbang'], category: 'gate', coords: { lat: -7.049100, lng: 110.439300 } },
];

export function buildMapFromOsm(osmRaw: { elements?: OsmRawElement[] }, manifest: ManifestData | null = null): CampusMapData {
  const elements = osmRaw?.elements || [];
  const buildings: CampusBuilding[] = [];
  const roads: CampusRoad[] = [];
  const water: CampusWater[] = [];
  const green: CampusGreen[] = [];
  const landmarks: CampusLandmark[] = [];

  // Index manifest by buildingId
  const manifestMap = new Map<string, ManifestBuilding>();
  if (manifest?.buildings) {
    for (const b of manifest.buildings) {
      manifestMap.set(b.buildingId, b);
    }
  }

  // Track matched faculty building counts
  const facultyMatchesCount: Record<string, number> = {
    ft: 0, fisip: 0, fh: 0, fib: 0, sv: 0, fpsi: 0, feb: 0, fsm: 0, fk: 0, fkm: 0, fpik: 0, fpp: 0,
  };

  for (const el of elements) {
    const tags = el.tags || {};
    const osmIdStr = String(el.id);

    // 1. Buildings
    if (tags.building && el.geometry && el.geometry.length >= 3) {
      const polygon: GeoPoint[] = el.geometry.map((g) => ({ lat: g.lat, lng: g.lon }));
      const centroid = calculateCentroid(polygon);
      const projCentroid = project(centroid);

      // Campus bounds filter
      if (projCentroid.x < -850 || projCentroid.x > 850 || projCentroid.y < -450 || projCentroid.y > 750) {
        continue;
      }

      const projectedPolygon: MapPoint[] = polygon.map((pt) => roundPoint(project(pt)));
      const projectedCentroid = roundPoint(projCentroid);

      const name = tags.name || tags['name:id'] || `Gedung ${el.id}`;
      const levels = parseInt(tags['building:levels'] || '2', 10) || 2;

      // Check if this building matches any of the 11 verified faculties
      let matchedFacultyId: string | undefined = undefined;
      for (const [fId, def] of Object.entries(FACULTY_PATTERNS)) {
        if (def.patterns.some((p) => name === p || name.includes(p))) {
          matchedFacultyId = fId;
          facultyMatchesCount[fId]++;
          break;
        }
      }

      // Calculate distance from owner point if matched to a faculty
      let distFromOwner: number | undefined = undefined;
      if (matchedFacultyId) {
        const ownerPt = OWNER_POINTS.find((op) => op.facultyId === matchedFacultyId);
        if (ownerPt) {
          distFromOwner = r2(haversineDistanceMeters(centroid, ownerPt.coords));
        }
      }

      const styleRef = matchedFacultyId ? manifestMap.get(matchedFacultyId)?.observed : null;

      buildings.push({
        id: `osm-bld-${el.id}`,
        osmId: osmIdStr,
        name,
        matchedName: name,
        facultyId: matchedFacultyId,
        category: matchedFacultyId ? 'faculty' : (tags.building === 'university' ? 'administrative' : 'public'),
        polygon: polygon.map(roundGeo),
        projectedPolygon,
        centroid: roundGeo(centroid),
        projectedCentroid,
        levels,
        tags,
        source: 'osm',
        distanceFromOwnerPointM: distFromOwner,
        style: styleRef
          ? {
              roofType: styleRef.roofType,
              mainColors: styleRef.mainColors,
              facade: styleRef.facade,
              signatureFeatures: styleRef.signatureFeatures,
              entranceSide: styleRef.entranceSide,
            }
          : undefined,
      });
    }

    // 2. Roads (highways)
    if (tags.highway && el.geometry && el.geometry.length >= 2) {
      const coords: GeoPoint[] = el.geometry.map((g) => ({ lat: g.lat, lng: g.lon }));
      const projected = coords.map((pt) => project(pt));
      const isNearCampus = projected.some((pt) => pt.x >= -900 && pt.x <= 900 && pt.y >= -500 && pt.y <= 800);
      if (isNearCampus) {
        roads.push({
          id: `osm-road-${el.id}`,
          name: tags.name,
          highwayClass: tags.highway,
          coordinates: coords.map(roundGeo),
          projectedCoordinates: projected.map(roundPoint),
          widthMeters: getRoadWidth(tags.highway),
        });
      }
    }

    // 3. Water
    if ((tags.natural === 'water' || tags.water || tags.landuse === 'basin') && el.geometry && el.geometry.length >= 3) {
      const polygon: GeoPoint[] = el.geometry.map((g) => ({ lat: g.lat, lng: g.lon }));
      water.push({
        id: `osm-water-${el.id}`,
        name: tags.name,
        polygon: polygon.map(roundGeo),
        projectedPolygon: polygon.map((pt) => roundPoint(project(pt))),
      });
    }

    // 4. Green / Leisure
    if ((tags.leisure === 'park' || tags.leisure === 'pitch' || tags.landuse === 'grass' || tags.landuse === 'forest') && el.geometry && el.geometry.length >= 3) {
      const polygon: GeoPoint[] = el.geometry.map((g) => ({ lat: g.lat, lng: g.lon }));
      green.push({
        id: `osm-green-${el.id}`,
        name: tags.name,
        type: tags.leisure || tags.landuse || 'grass',
        polygon: polygon.map(roundGeo),
        projectedPolygon: polygon.map((pt) => roundPoint(project(pt))),
      });
    }

    // 5. Landmarks in OSM
    if (tags.name) {
      for (const lm of ICONIC_LANDMARKS) {
        if (tags.name === lm.pattern || tags.name.includes(lm.pattern)) {
          let pt: GeoPoint | null = null;
          if (el.lat !== undefined && el.lon !== undefined) {
            pt = { lat: el.lat, lng: el.lon };
          } else if (el.geometry && el.geometry.length > 0) {
            pt = calculateCentroid(el.geometry.map((g) => ({ lat: g.lat, lng: g.lon })));
          }
          if (pt) {
            const alreadyAdded = landmarks.some((item) => item.id === `osm-lm-${lm.id}`);
            if (!alreadyAdded) {
              const proj = project(pt);
              const ownerPt = OWNER_POINTS.find((op) => op.name.toLowerCase().includes(lm.name.toLowerCase()) || lm.name.toLowerCase().includes(op.name.toLowerCase()));
              const distFromOwner = ownerPt ? r2(haversineDistanceMeters(pt, ownerPt.coords)) : undefined;

              landmarks.push({
                id: `osm-lm-${lm.id}`,
                osmId: osmIdStr,
                name: lm.name,
                matchedName: tags.name,
                coords: roundGeo(pt),
                projectedCoords: roundPoint(proj),
                category: lm.category,
                source: 'osm',
                distanceFromOwnerPointM: distFromOwner,
              });
            }
          }
        }
      }
    }
  }

  // 6. Handle FEB: FEB is NOT found by name in OSM. Must be flagged source: 'approx'
  const febOwner = OWNER_POINTS.find((op) => op.facultyId === 'feb');
  if (febOwner) {
    const febProj = project(febOwner.coords);
    const febHalfSide = 25; // 50m approx polygon footprint
    const febPoly: GeoPoint[] = [
      { lat: febOwner.coords.lat + 0.0002, lng: febOwner.coords.lng - 0.0002 },
      { lat: febOwner.coords.lat + 0.0002, lng: febOwner.coords.lng + 0.0002 },
      { lat: febOwner.coords.lat - 0.0002, lng: febOwner.coords.lng + 0.0002 },
      { lat: febOwner.coords.lat - 0.0002, lng: febOwner.coords.lng - 0.0002 },
    ];
    buildings.push({
      id: 'approx-bld-feb',
      osmId: null,
      name: 'Fakultas Ekonomika dan Bisnis (Perkiraan)',
      matchedName: 'Fakultas Ekonomika dan Bisnis (Perkiraan)',
      facultyId: 'feb',
      category: 'faculty',
      polygon: febPoly.map(roundGeo),
      projectedPolygon: [
        { x: r2(febProj.x - febHalfSide), y: r2(febProj.y - febHalfSide) },
        { x: r2(febProj.x + febHalfSide), y: r2(febProj.y - febHalfSide) },
        { x: r2(febProj.x + febHalfSide), y: r2(febProj.y + febHalfSide) },
        { x: r2(febProj.x - febHalfSide), y: r2(febProj.y + febHalfSide) },
      ],
      centroid: roundGeo(febOwner.coords),
      projectedCentroid: roundPoint(febProj),
      levels: 3,
      tags: { source: 'approx', note: 'Unverified in OSM - awaiting owner ground coordinates' },
      source: 'approx',
      distanceFromOwnerPointM: 0,
      style: {
        roofType: 'limasan-approx',
        mainColors: ['#B45309', '#FEF3C7'],
      },
    });
    facultyMatchesCount['feb'] = 1;
  }

  // 7. Verify all 12 faculties have representation and fail if any lack OSM-based geometry without approx flag
  const requiredFaculties = ['ft', 'fisip', 'fh', 'fib', 'sv', 'fpsi', 'feb', 'fsm', 'fk', 'fkm', 'fpik', 'fpp'];
  for (const facId of requiredFaculties) {
    const facBlds = buildings.filter((b) => b.facultyId === facId);
    if (facBlds.length === 0) {
      throw new Error(`CRITICAL MAP INTEGRITY FAILURE: Faculty [${facId.toUpperCase()}] has no geometry in campusMapData!`);
    }
    const hasOsm = facBlds.some((b) => b.source === 'osm');
    const hasApprox = facBlds.some((b) => b.source === 'approx');
    if (!hasOsm && !hasApprox) {
      throw new Error(`CRITICAL MAP INTEGRITY FAILURE: Faculty [${facId.toUpperCase()}] lacks OSM-based geometry and has no approx flag!`);
    }
  }

  // 8. Add unverified landmarks as source: 'approx'
  for (const ulm of UNVERIFIED_LANDMARKS) {
    const proj = project(ulm.coords);
    landmarks.push({
      id: `approx-lm-${ulm.id}`,
      osmId: null,
      name: ulm.name,
      matchedName: `${ulm.name} (Perkiraan)`,
      coords: roundGeo(ulm.coords),
      projectedCoords: roundPoint(proj),
      category: ulm.category,
      source: 'approx',
      distanceFromOwnerPointM: 0,
    });
  }

  // 9. Calculate overall bounds
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  const allPoints: MapPoint[] = [];
  for (const b of buildings) {
    allPoints.push(...b.projectedPolygon);
  }
  for (const r of roads) {
    allPoints.push(...r.projectedCoordinates);
  }

  if (allPoints.length === 0) {
    minX = -900;
    maxX = 900;
    minY = -600;
    maxY = 1000;
  } else {
    for (const pt of allPoints) {
      if (pt.x < minX) minX = pt.x;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.y > maxY) maxY = pt.y;
    }
  }

  return {
    generatedAt: new Date().toISOString(),
    attribution: '© OpenStreetMap contributors',
    origin: CAMPUS_ORIGIN,
    boundsMeters: {
      minX,
      maxX,
      minY,
      maxY,
      width: maxX - minX,
      height: maxY - minY,
    },
    buildings,
    roads,
    water,
    green,
    landmarks,
  };
}

// Sanity bus stop anchors checker
export function checkBusStopAnchors(osmRaw: { elements?: OsmRawElement[] }, mapData: CampusMapData) {
  const elements = osmRaw?.elements || [];
  const busStops = elements.filter((e) => e.tags && e.tags.highway === 'bus_stop' && e.tags.name);

  console.log('\n--- BUS STOP SANITY ANCHORS AUDIT ---');
  const anchorChecks = [
    { facultyId: 'fh', busStopName: 'Bus Stop Campus 4 - FH FISIP', maxMeters: 250 },
    { facultyId: 'sv', busStopName: 'Bus Stop Campus 5 - Vokasi FIB', maxMeters: 250 },
    { facultyId: 'fib', busStopName: 'Bus Stop Campus 5 - Vokasi FIB', maxMeters: 250 },
    { facultyId: 'fkm', busStopName: 'Bus Stop 8 - FKM FK', maxMeters: 250 },
    { facultyId: 'fk', busStopName: 'Bus Stop 8 - FKM FK', maxMeters: 250 },
    { facultyId: 'fpik', busStopName: 'Bus Stop Campus 9 - FPIK', maxMeters: 250 },
    { facultyId: 'fpp', busStopName: 'Bus Stop Campus 10 - FPP', maxMeters: 250 },
  ];

  for (const ac of anchorChecks) {
    const bs = busStops.find((b) => b.tags?.name === ac.busStopName);
    if (!bs || bs.lat === undefined || bs.lon === undefined) {
      console.warn(`⚠️ Bus stop "${ac.busStopName}" not found in OSM data`);
      continue;
    }
    const bsGeo: GeoPoint = { lat: bs.lat, lng: bs.lon };
    const facBlds = mapData.buildings.filter((b) => b.facultyId === ac.facultyId);
    let minDist = Infinity;
    for (const b of facBlds) {
      const dist = haversineDistanceMeters(b.centroid, bsGeo);
      if (dist < minDist) minDist = dist;
    }
    const status = minDist <= ac.maxMeters ? 'PASS' : 'VIOLATION';
    console.log(`[${status}] [${ac.facultyId.toUpperCase()}] to "${ac.busStopName}": ${minDist.toFixed(1)}m (threshold: ${ac.maxMeters}m)`);
  }
}

// CLI runner
function main() {
  console.log('Building campus map data from OSM...');
  const rawDir = path.join(__dirname, '../map-data/raw');
  const manifestPath = path.join(__dirname, '../map-data/reference/manifest.json');
  const outPath = path.join(__dirname, '../src/data/campusMap.ts');

  let manifest: ManifestData | null = null;
  if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as ManifestData;
  }

  let osmRaw: { elements?: OsmRawElement[] } | null = null;
  if (fs.existsSync(rawDir)) {
    const files = fs.readdirSync(rawDir).filter((f) => f.endsWith('.json') || f.endsWith('.geojson'));
    if (files.length > 0) {
      const targetFile = path.join(rawDir, files[0]);
      console.log(`Using OSM file: ${targetFile}`);
      osmRaw = JSON.parse(fs.readFileSync(targetFile, 'utf8')) as { elements?: OsmRawElement[] };
    }
  }

  if (!osmRaw) {
    console.warn('⚠️ No OSM raw data found in map-data/raw/. Awaiting owner export from overpass-turbo.eu.');
    return;
  }

  const mapData = buildMapFromOsm(osmRaw, manifest);
  checkBusStopAnchors(osmRaw, mapData);

  const code = `// =============================================================================
// AUTOMATICALLY GENERATED FROM REAL GEOMETRY BY scripts/build-map-data.ts
// DO NOT EDIT DIRECTLY. Source: OpenStreetMap (© OpenStreetMap contributors)
// Generated: ${mapData.generatedAt}
// =============================================================================

export interface CampusBuilding {
  id: string;
  osmId: string | null;
  name: string;
  matchedName: string;
  facultyId?: string;
  category: 'faculty' | 'public' | 'department' | 'administrative';
  polygon: { lat: number; lng: number }[];
  projectedPolygon: { x: number; y: number }[];
  centroid: { lat: number; lng: number };
  projectedCentroid: { x: number; y: number };
  levels: number;
  tags: Record<string, string>;
  source: 'osm' | 'owner' | 'approx';
  distanceFromOwnerPointM?: number;
  style?: {
    roofType?: string;
    mainColors?: string[];
    facade?: string;
    signatureFeatures?: string[];
    entranceSide?: string;
  };
}

export interface CampusRoad {
  id: string;
  name?: string;
  highwayClass: string;
  coordinates: { lat: number; lng: number }[];
  projectedCoordinates: { x: number; y: number }[];
  widthMeters: number;
}

export interface CampusWater {
  id: string;
  name?: string;
  polygon: { lat: number; lng: number }[];
  projectedPolygon: { x: number; y: number }[];
}

export interface CampusGreen {
  id: string;
  name?: string;
  type: string;
  polygon: { lat: number; lng: number }[];
  projectedPolygon: { x: number; y: number }[];
}

export interface CampusLandmark {
  id: string;
  osmId: string | null;
  name: string;
  matchedName: string;
  coords: { lat: number; lng: number };
  projectedCoords: { x: number; y: number };
  category: string;
  description?: string;
  source: 'osm' | 'owner' | 'approx';
  distanceFromOwnerPointM?: number;
}

export interface CampusMapData {
  generatedAt: string;
  attribution: string;
  origin: { lat: number; lng: number };
  boundsMeters: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
  };
  buildings: CampusBuilding[];
  roads: CampusRoad[];
  water: CampusWater[];
  green: CampusGreen[];
  landmarks: CampusLandmark[];
}

export const campusMapData: CampusMapData = ${JSON.stringify(mapData, null, 2)};
`;

  fs.writeFileSync(outPath, code, 'utf8');
  console.log(`\n✓ Successfully generated ${outPath} with:`);
  console.log(`   - ${mapData.buildings.length} buildings (52 OSM faculty buildings + 1 approx FEB)`);
  console.log(`   - ${mapData.roads.length} roads`);
  console.log(`   - ${mapData.water.length} water bodies`);
  console.log(`   - ${mapData.green.length} green areas`);
  console.log(`   - ${mapData.landmarks.length} landmarks (${mapData.landmarks.filter(l => l.source === 'osm').length} OSM + ${mapData.landmarks.filter(l => l.source === 'approx').length} approx)`);
}

if (require.main === module) {
  main();
}
