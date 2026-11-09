import * as fs from 'fs';
import * as path from 'path';
import { haversineDistanceMeters, GeoPoint } from '../src/lib/campusProjection';

export interface OwnerPoint {
  id: string;
  name: string;
  category: 'faculty' | 'department' | 'landmark' | 'infrastructure';
  facultyId?: string;
  coords: GeoPoint;
  keywords: string[];
}

export interface OsmGeometryNode {
  lat: number;
  lon: number;
}

export interface OsmElement {
  id: string | number;
  type: string;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  geometry?: OsmGeometryNode[];
  tags?: Record<string, string>;
}

export interface CandidateLandmark {
  id: string | number;
  name: string;
  coords: GeoPoint;
  amenity: string;
}

export const OWNER_POINTS: OwnerPoint[] = [
  { id: 'sv', name: 'Sekolah Vokasi', category: 'faculty', facultyId: 'sv', coords: { lat: -7.055820, lng: 110.434890 }, keywords: ['vokasi', 'sekolah vokasi'] },
  { id: 'student-centre', name: 'SC & Menara Undip', category: 'landmark', coords: { lat: -7.053120, lng: 110.438450 }, keywords: ['student center', 'student centre', 'menara undip', 'pkm'] },
  { id: 'fh', name: 'Fakultas Hukum', category: 'faculty', facultyId: 'fh', coords: { lat: -7.052880, lng: 110.436350 }, keywords: ['hukum', 'fakultas hukum', 'satjipto'] },
  { id: 'fib', name: 'Fakultas Ilmu Budaya', category: 'faculty', facultyId: 'fib', coords: { lat: -7.053950, lng: 110.436820 }, keywords: ['budaya', 'ilmu budaya', 'fib'] },
  { id: 'fpsi', name: 'Fakultas Psikologi', category: 'faculty', facultyId: 'fpsi', coords: { lat: -7.054110, lng: 110.438650 }, keywords: ['psikologi', 'magenta'] },
  { id: 'feb', name: 'Fakultas Ekonomika dan Bisnis', category: 'faculty', facultyId: 'feb', coords: { lat: -7.052150, lng: 110.438120 }, keywords: ['ekonomika', 'bisnis', 'feb'] },
  { id: 'art-centre', name: 'Art Centre Undip', category: 'landmark', coords: { lat: -7.052350, lng: 110.439150 }, keywords: ['art centre', 'art center', 'pusat seni'] },
  { id: 'gsg', name: 'GSG Prof. Soedarto', category: 'landmark', coords: { lat: -7.051050, lng: 110.439180 }, keywords: ['soedarto', 'gsg', 'gedung serbaguna', 'muladi dome'] },
  { id: 'bundaran-pertama', name: 'Bundaran Pertama', category: 'infrastructure', coords: { lat: -7.051980, lng: 110.439850 }, keywords: ['bundaran', 'air mancur'] },
  { id: 'rektorat', name: 'Rektorat Widya Puraya', category: 'landmark', coords: { lat: -7.051320, lng: 110.440350 }, keywords: ['widya puraya', 'rektorat', 'bakundip'] },
  { id: 'ft', name: 'Fakultas Teknik', category: 'faculty', facultyId: 'ft', coords: { lat: -7.053150, lng: 110.439920 }, keywords: ['teknik', 'fakultas teknik', 'eko budihardjo'] },
  { id: 'taman-inspirasi', name: 'Taman Inspirasi', category: 'landmark', coords: { lat: -7.052920, lng: 110.439680 }, keywords: ['taman inspirasi', 'inspirasi'] },
  { id: 'teknik-geologi', name: 'Teknik Geologi', category: 'department', coords: { lat: -7.052750, lng: 110.440420 }, keywords: ['geologi', 'teknik geologi'] },
  { id: 'teknik-elektro', name: 'Teknik Elektro', category: 'department', coords: { lat: -7.053480, lng: 110.440580 }, keywords: ['elektro', 'teknik elektro'] },
  { id: 'arsitektur-sipil-pwk', name: 'Arsitektur/Sipil/PWK', category: 'department', coords: { lat: -7.054350, lng: 110.439480 }, keywords: ['arsitektur', 'sipil', 'pwk', 'perencanaan wilayah'] },
  { id: 'komputer-geodesi-perkapalan', name: 'Teknik Komputer/Geodesi/Perkapalan', category: 'department', coords: { lat: -7.053950, lng: 110.440650 }, keywords: ['komputer', 'geodesi', 'perkapalan'] },
  { id: 'mesin-industri-lingkungan-kimia', name: 'Mesin/Industri/Lingkungan/Kimia', category: 'department', coords: { lat: -7.055380, lng: 110.440120 }, keywords: ['mesin', 'industri', 'lingkungan', 'teknik kimia'] },
  { id: 'pertigaan-timur', name: 'Pertigaan Timur', category: 'infrastructure', coords: { lat: -7.051820, lng: 110.441150 }, keywords: ['pertigaan', 'simpang timur'] },
  { id: 'fsm', name: 'Fakultas Sains dan Matematika', category: 'faculty', facultyId: 'fsm', coords: { lat: -7.051450, lng: 110.442150 }, keywords: ['sains', 'matematika', 'fsm', 'acintya prasada'] },
  { id: 'fpp', name: 'Fakultas Peternakan dan Pertanian', category: 'faculty', facultyId: 'fpp', coords: { lat: -7.053250, lng: 110.442680 }, keywords: ['peternakan', 'pertanian', 'fpp'] },
  { id: 'fpik', name: 'Fakultas Perikanan dan Ilmu Kelautan', category: 'faculty', facultyId: 'fpik', coords: { lat: -7.051950, lng: 110.443650 }, keywords: ['perikanan', 'kelautan', 'fpik', 'marine'] },
  { id: 'fkm', name: 'Fakultas Kesehatan Masyarakat', category: 'faculty', facultyId: 'fkm', coords: { lat: -7.051280, lng: 110.444350 }, keywords: ['kesehatan masyarakat', 'fkm'] },
  { id: 'fk', name: 'Fakultas Kedokteran', category: 'faculty', facultyId: 'fk', coords: { lat: -7.052180, lng: 110.445450 }, keywords: ['kedokteran', 'fk', 'soewondo'] },
  { id: 'rsnd', name: 'RSND', category: 'landmark', coords: { lat: -7.053120, lng: 110.446380 }, keywords: ['rsnd', 'rumah sakit nasional diponegoro', 'hospital'] },
  { id: 'fisip', name: 'Fakultas Ilmu Sosial dan Ilmu Politik', category: 'faculty', facultyId: 'fisip', coords: { lat: -7.052820, lng: 110.437650 }, keywords: ['fisip', 'sosial', 'politik'] },
];

export interface AuditResult {
  ownerPoint: OwnerPoint;
  matchedOsmId?: string | number;
  matchedOsmName?: string;
  matchedCoords?: GeoPoint;
  distanceMeters?: number;
  verdict: 'ok' | 'check' | 'wrong' | 'not-found';
  notes: string;
}

export function runAudit(osmElements: OsmElement[] = []): { results: AuditResult[]; candidateLandmarks: CandidateLandmark[] } {
  const results: AuditResult[] = [];
  const candidateLandmarks: CandidateLandmark[] = [];

  // Index named features
  const namedFeatures: { id: string | number; name: string; type: string; coords: GeoPoint; tags: Record<string, string> }[] = [];

  for (const el of osmElements) {
    if (!el.tags || !el.tags.name) continue;

    // Compute coordinate
    let pt: GeoPoint | null = null;
    if (el.lat !== undefined && el.lon !== undefined) {
      pt = { lat: el.lat, lng: el.lon };
    } else if (el.center) {
      pt = { lat: el.center.lat, lng: el.center.lon };
    } else if (el.geometry && el.geometry.length > 0) {
      const avgLat = el.geometry.reduce((acc: number, g) => acc + g.lat, 0) / el.geometry.length;
      const avgLon = el.geometry.reduce((acc: number, g) => acc + g.lon, 0) / el.geometry.length;
      pt = { lat: avgLat, lng: avgLon };
    }

    if (pt) {
      namedFeatures.push({
        id: el.id,
        name: el.tags.name,
        type: el.type,
        coords: pt,
        tags: el.tags,
      });

      // Check candidate landmarks
      const isLandmarkKeyword = /(gerbang|gate|masjid|perpustakaan|auditorium|stadion|lapangan|kolam|embung|danau|rusun|asrama|kantin|halte|taman|tugu|patung|monumen|dome|tower|centre|center|dome)/i.test(
        el.tags.name
      );
      if (isLandmarkKeyword) {
        candidateLandmarks.push({
          id: el.id,
          name: el.tags.name,
          coords: pt,
          amenity: el.tags.amenity || el.tags.building || el.tags.leisure || 'other',
        });
      }
    }
  }

  // Audit each owner point
  for (const op of OWNER_POINTS) {
    let bestMatch: (typeof namedFeatures)[0] | null = null;
    let minDistance = Infinity;

    // Search by keywords and proximity
    for (const nf of namedFeatures) {
      const lowerName = nf.name.toLowerCase();
      const hasKeyword = op.keywords.some((kw) => lowerName.includes(kw));

      const dist = haversineDistanceMeters(op.coords, nf.coords);

      if (hasKeyword) {
        if (dist < minDistance) {
          minDistance = dist;
          bestMatch = nf;
        }
      }
    }

    // If no keyword match, find closest named building within 150m
    if (!bestMatch) {
      for (const nf of namedFeatures) {
        const dist = haversineDistanceMeters(op.coords, nf.coords);
        if (dist < 150 && dist < minDistance) {
          minDistance = dist;
          bestMatch = nf;
        }
      }
    }

    if (!bestMatch) {
      results.push({
        ownerPoint: op,
        verdict: 'not-found',
        notes: 'Tidak ditemukan entitas OSM bernama yang cocok di sekitar koordinat.',
      });
    } else {
      let verdict: 'ok' | 'check' | 'wrong' = 'ok';
      if (minDistance > 120) {
        verdict = 'wrong';
      } else if (minDistance >= 40) {
        verdict = 'check';
      }

      results.push({
        ownerPoint: op,
        matchedOsmId: bestMatch.id,
        matchedOsmName: bestMatch.name,
        matchedCoords: bestMatch.coords,
        distanceMeters: minDistance,
        verdict,
        notes: `Jarak ke OSM feature: ${minDistance.toFixed(1)} m (${bestMatch.name})`,
      });
    }
  }

  return { results, candidateLandmarks };
}

interface GeoJsonFeature {
  id?: string | number;
  type: string;
  properties?: Record<string, string>;
  geometry?: {
    coordinates?: [number, number] | [number, number][][];
  };
}

interface OsmRawPayload {
  elements?: OsmElement[];
  features?: GeoJsonFeature[];
}

// Main CLI runner
function main() {
  console.log('Running map audit script...');
  const rawDir = path.join(__dirname, '../map-data/raw');
  let osmData: OsmRawPayload | null = null;

  if (fs.existsSync(rawDir)) {
    const files = fs.readdirSync(rawDir).filter((f) => f.endsWith('.json') || f.endsWith('.geojson'));
    if (files.length > 0) {
      const targetFile = path.join(rawDir, files[0]);
      console.log(`Reading OSM file: ${targetFile}`);
      const content = fs.readFileSync(targetFile, 'utf8');
      osmData = JSON.parse(content) as OsmRawPayload;
    }
  }

  let elements: OsmElement[] = [];
  if (osmData?.elements) {
    elements = osmData.elements;
  } else if (osmData?.features) {
    elements = osmData.features.map((f: GeoJsonFeature) => {
      const coords = f.geometry?.coordinates;
      let lat: number | undefined;
      let lon: number | undefined;
      let geom: OsmGeometryNode[] | undefined;

      if (Array.isArray(coords) && typeof coords[0] === 'number') {
        lon = coords[0] as number;
        lat = coords[1] as number;
      } else if (Array.isArray(coords) && Array.isArray(coords[0])) {
        const ring = coords[0] as unknown as [number, number][];
        geom = ring.map((c) => ({ lat: c[1], lon: c[0] }));
      }

      return {
        id: f.id || f.properties?.['@id'] || Math.random(),
        type: f.type,
        tags: f.properties || {},
        lat,
        lon,
        geometry: geom,
      };
    });
  }

  const { results, candidateLandmarks } = runAudit(elements);

  console.log(`\nAudit completed for ${results.length} owner points.`);
  console.log(`OSM Elements available: ${elements.length}`);
  console.log(`Candidate landmarks found: ${candidateLandmarks.length}`);

  // Summary counts
  const counts = { ok: 0, check: 0, wrong: 0, 'not-found': 0 };
  for (const r of results) {
    counts[r.verdict]++;
  }
  console.log('Summary:', counts);
}

if (require.main === module) {
  main();
}
