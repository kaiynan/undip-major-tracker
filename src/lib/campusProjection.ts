/**
 * =============================================================================
 * UNDIP Tembalang Campus Map — Uniform-Scale Geospatial Projection
 * =============================================================================
 * Implements a local equirectangular projection centered on Widya Puraya / Rektorat:
 *   x = (lng - lng0) * cos(lat0) * R
 *   y = (lat0 - lat) * R
 *
 * Properties:
 * - Isotropic (exact 1:1 meter scale on both horizontal and vertical axes).
 * - Canvas orientation: +x is East, +y is South (standard screen space).
 * - Origin (0, 0) corresponds to (lat0, lng0).
 * - Round-trip unproject() returns exact coordinates.
 * =============================================================================
 */

export const EARTH_RADIUS_METERS = 6371000;

// Campus origin reference: Rektorat Widya Puraya
export const CAMPUS_ORIGIN = {
  lat: -7.051320,
  lng: 110.440350,
};

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface MapPoint {
  x: number; // meters East from origin
  y: number; // meters South from origin
}

/**
 * Projects a WGS84 (lat, lng) coordinate to local Cartesian meters.
 * +x: East (meters)
 * +y: South (meters, matching canvas top-to-bottom coordinates)
 */
export function project(point: GeoPoint, origin = CAMPUS_ORIGIN): MapPoint {
  const lat0Rad = (origin.lat * Math.PI) / 180;
  const dLngRad = ((point.lng - origin.lng) * Math.PI) / 180;
  const dLatRad = ((origin.lat - point.lat) * Math.PI) / 180; // lat0 - lat makes south positive

  const x = dLngRad * Math.cos(lat0Rad) * EARTH_RADIUS_METERS;
  const y = dLatRad * EARTH_RADIUS_METERS;

  return { x, y };
}

/**
 * Inverse-projects local Cartesian meters back to WGS84 (lat, lng).
 */
export function unproject(point: MapPoint, origin = CAMPUS_ORIGIN): GeoPoint {
  const lat0Rad = (origin.lat * Math.PI) / 180;

  const dLatRad = point.y / EARTH_RADIUS_METERS;
  const lat = origin.lat - (dLatRad * 180) / Math.PI;

  const dLngRad = point.x / (Math.cos(lat0Rad) * EARTH_RADIUS_METERS);
  const lng = origin.lng + (dLngRad * 180) / Math.PI;

  return { lat, lng };
}

/**
 * Calculates standard Haversine distance in meters between two lat/lng coordinates.
 */
export function haversineDistanceMeters(p1: GeoPoint, p2: GeoPoint): number {
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const lat1 = (p1.lat * Math.PI) / 180;
  const lat2 = (p2.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/**
 * Calculates Euclidean distance in projected meter space.
 */
export function projectedDistanceMeters(p1: MapPoint, p2: MapPoint): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}
