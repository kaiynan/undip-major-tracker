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
  name: string;
  facultyId?: string;
  category: 'faculty' | 'public' | 'department' | 'administrative';
  polygon: GeoPoint[];
  projectedPolygon: MapPoint[];
  centroid: GeoPoint;
  projectedCentroid: MapPoint;
  levels: number;
  tags: Record<string, string>;
  source: 'osm' | 'owner' | 'approx';
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
  name: string;
  coords: GeoPoint;
  projectedCoords: MapPoint;
  category: string;
  description?: string;
  source: 'osm' | 'owner' | 'approx';
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

  for (const el of elements) {
    const tags = el.tags || {};

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

      // Identify faculty unit
      let facultyId: string | undefined = undefined;
      const lowerName = name.toLowerCase();
      for (const op of OWNER_POINTS) {
        if (op.facultyId && op.keywords.some((kw) => lowerName.includes(kw))) {
          facultyId = op.facultyId;
          break;
        }
      }

      const styleRef = facultyId ? manifestMap.get(facultyId)?.observed : null;

      buildings.push({
        id: `osm-bld-${el.id}`,
        name,
        facultyId,
        category: facultyId ? 'faculty' : 'public',
        polygon: polygon.map(roundGeo),
        projectedPolygon,
        centroid: roundGeo(centroid),
        projectedCentroid,
        levels,
        tags,
        source: 'osm',
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
      // Filter out roads completely outside canvas
      const isNearCampus = projected.some(pt => pt.x >= -900 && pt.x <= 900 && pt.y >= -500 && pt.y <= 800);
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

    // 5. Landmarks / Amenities
    if (tags.name && (tags.amenity || tags.historic || tags.tourism)) {
      let pt: GeoPoint | null = null;
      if (el.lat !== undefined && el.lon !== undefined) {
        pt = { lat: el.lat, lng: el.lon };
      } else if (el.geometry && el.geometry.length > 0) {
        pt = calculateCentroid(el.geometry.map((g) => ({ lat: g.lat, lng: g.lon })));
      }
      if (pt) {
        const proj = project(pt);
        if (proj.x >= -900 && proj.x <= 900 && proj.y >= -500 && proj.y <= 800) {
          landmarks.push({
            id: `osm-lm-${el.id}`,
            name: tags.name,
            coords: roundGeo(pt),
            projectedCoords: roundPoint(proj),
            category: tags.amenity || tags.historic || 'landmark',
            source: 'osm',
          });
        }
      }
    }
  }

  // Ensure all 12 faculties have building representation
  const requiredFaculties = ['ft', 'fisip', 'fh', 'fib', 'sv', 'fpsi', 'feb', 'fsm', 'fk', 'fkm', 'fpik', 'fpp'];
  for (const facId of requiredFaculties) {
    const hasMatch = buildings.some((b) => b.facultyId === facId);
    if (!hasMatch) {
      const ownerPt = OWNER_POINTS.find((op) => op.facultyId === facId);
      if (ownerPt) {
        let closestBld: CampusBuilding | null = null;
        let minDist = Infinity;
        for (const b of buildings) {
          if (!b.facultyId) {
            const dist = haversineDistanceMeters(b.centroid, ownerPt.coords);
            if (dist < minDist && dist <= 120) {
              minDist = dist;
              closestBld = b;
            }
          }
        }
        if (closestBld) {
          closestBld.facultyId = facId;
          closestBld.name = `Gedung ${ownerPt.name}`;
          closestBld.category = 'faculty';
          const styleRef = manifestMap.get(facId)?.observed;
          if (styleRef) {
            closestBld.style = {
              roofType: styleRef.roofType,
              mainColors: styleRef.mainColors,
              facade: styleRef.facade,
              signatureFeatures: styleRef.signatureFeatures,
              entranceSide: styleRef.entranceSide,
            };
          }
        }
      }
    }
  }

  // Ensure all owner landmarks are cataloged
  for (const op of OWNER_POINTS) {
    if (!op.facultyId) {
      const exists = landmarks.some((lm) => lm.name.toLowerCase().includes(op.keywords[0]));
      if (!exists) {
        const proj = project(op.coords);
        landmarks.push({
          id: `owner-lm-${op.id}`,
          name: op.name,
          coords: roundGeo(op.coords),
          projectedCoords: roundPoint(proj),
          category: op.category,
          source: 'owner',
        });
      }
    }
  }

  // Calculate overall bounds in projected meters
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
  const code = `// =============================================================================
// AUTOMATICALLY GENERATED FROM REAL GEOMETRY BY scripts/build-map-data.ts
// DO NOT EDIT DIRECTLY. Source: OpenStreetMap (© OpenStreetMap contributors)
// Generated: ${mapData.generatedAt}
// =============================================================================

export interface CampusBuilding {
  id: string;
  name: string;
  facultyId?: string;
  category: 'faculty' | 'public' | 'department' | 'administrative';
  polygon: { lat: number; lng: number }[];
  projectedPolygon: { x: number; y: number }[];
  centroid: { lat: number; lng: number };
  projectedCentroid: { x: number; y: number };
  levels: number;
  tags: Record<string, string>;
  source: 'osm' | 'owner' | 'approx';
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
  name: string;
  coords: { lat: number; lng: number };
  projectedCoords: { x: number; y: number };
  category: string;
  description?: string;
  source: 'osm' | 'owner' | 'approx';
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
  console.log(`✓ Generated ${outPath} with ${mapData.buildings.length} buildings, ${mapData.roads.length} roads, ${mapData.water.length} water bodies, ${mapData.green.length} green areas, and ${mapData.landmarks.length} landmarks.`);
}

if (require.main === module) {
  main();
}
