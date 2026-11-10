'use client';

import React, { useMemo } from 'react';
import { campusMapData } from '@/data/campusMap';

const CANVAS_X = 1000;
const CANVAS_Y = 480;

export interface CampusBuildingsLayerProps {
  selectedFacultyId: string | null;
  hoveredFacultyId: string | null;
  onSelectFaculty?: (facultyId: string | null) => void;
  onHoverFaculty?: (facultyId: string | null) => void;
  zoom?: number;
}

// Authentic palette for each faculty
const FACULTY_COLORS: Record<string, { roof: string; wall: string; stroke: string; highlight: string }> = {
  ft: { roof: '#991B1B', wall: '#7F1D1D', stroke: '#450A0A', highlight: '#EF4444' },
  fisip: { roof: '#C2410C', wall: '#9A3412', stroke: '#7C2D12', highlight: '#F97316' },
  fh: { roof: '#B91C1C', wall: '#991B1B', stroke: '#451A03', highlight: '#DC2626' },
  fib: { roof: '#B45309', wall: '#78350F', stroke: '#451A03', highlight: '#F59E0B' },
  sv: { roof: '#2563EB', wall: '#1D4ED8', stroke: '#1E3A8A', highlight: '#60A5FA' },
  fpsi: { roof: '#EA580C', wall: '#C2410C', stroke: '#7C2D12', highlight: '#FB923C' },
  feb: { roof: '#D97706', wall: '#B45309', stroke: '#78350F', highlight: '#FBBF24' },
  fsm: { roof: '#0284C7', wall: '#0369A1', stroke: '#0C4A6E', highlight: '#38BDF8' },
  fk: { roof: '#059669', wall: '#047857', stroke: '#064E3B', highlight: '#34D399' },
  fkm: { roof: '#0D9488', wall: '#0F766E', stroke: '#134E4A', highlight: '#2DD4BF' },
  fpik: { roof: '#0284C7', wall: '#0369A1', stroke: '#075985', highlight: '#38BDF8' },
  fpp: { roof: '#16A34A', wall: '#15803D', stroke: '#14532D', highlight: '#4ADE80' },
};

// Iconic landmarks special styling
const LANDMARK_STYLES: Record<string, { roof: string; wall: string; stroke: string; label: string }> = {
  'osm-bld-313693591': { roof: '#F59E0B', wall: '#B45309', stroke: '#78350F', label: 'Widya Puraya' },
  'osm-bld-313693592': { roof: '#38BDF8', wall: '#0284C7', stroke: '#0369A1', label: 'Perpustakaan' },
  'osm-bld-313693582': { roof: '#F97316', wall: '#C2410C', stroke: '#7C2D12', label: 'GSG Soedarto' },
  'osm-bld-508049877': { roof: '#D97706', wall: '#92400E', stroke: '#78350F', label: 'Student Center' },
  'osm-bld-313697399': { roof: '#10B981', wall: '#047857', stroke: '#064E3B', label: 'Masjid Kampus' },
  'osm-bld-558963174': { roof: '#06B6D4', wall: '#0891B2', stroke: '#155E75', label: 'Muladi Dome' },
  'osm-bld-573422707': { roof: '#F8FAFC', wall: '#CBD5E1', stroke: '#059669', label: 'RSND Undip' },
  'osm-bld-573503194': { roof: '#3B82F6', wall: '#1D4ED8', stroke: '#1E3A8A', label: 'Lab Terpadu' },
  'osm-bld-313693583': { roof: '#0EA5E9', wall: '#0284C7', stroke: '#075985', label: 'ICT Centre' },
  'osm-bld-313693586': { roof: '#8B5CF6', wall: '#6D28D9', stroke: '#4C1D95', label: 'Career Center' },
};

export function CampusBuildingsLayer({
  selectedFacultyId,
  hoveredFacultyId,
  onSelectFaculty,
  onHoverFaculty,
  zoom = 1,
}: CampusBuildingsLayerProps) {
  // Pre-calculate SVG polygon strings and styling
  const renderedBuildings = useMemo(() => {
    return campusMapData.buildings.map((b) => {
      if (!b.projectedPolygon || b.projectedPolygon.length < 3) return null;

      // Project into virtual canvas coordinates
      const canvasPts = b.projectedPolygon.map((pt) => ({
        x: Math.round(CANVAS_X + pt.x),
        y: Math.round(CANVAS_Y + pt.y),
      }));

      const roofPoints = canvasPts.map((p) => `${p.x},${p.y}`).join(' ');

      // Isometric depth offset for wall extrusion
      const wallHeight = Math.max(3, Math.min(8, (b.levels || 2) * 2));
      const wallPoints = canvasPts.map((p) => `${p.x},${p.y + wallHeight}`).join(' ');

      const isFaculty = !!b.facultyId;
      const isApprox = b.source === 'approx';
      const lmStyle = LANDMARK_STYLES[b.id];

      return {
        building: b,
        roofPoints,
        wallPoints,
        isFaculty,
        isApprox,
        lmStyle,
      };
    }).filter(Boolean);
  }, []);

  return (
    <g id="campus-real-buildings" style={{ shapeRendering: 'crispEdges' }}>
      {/* 1. Base Wall Extrusions (Shadow & 2.5D depth) */}
      <g id="building-walls" opacity="0.9">
        {renderedBuildings.map((item) => {
          if (!item) return null;
          const { building: b, wallPoints, isFaculty, lmStyle } = item;
          let wallColor = '#1C1917';

          if (isFaculty && b.facultyId && FACULTY_COLORS[b.facultyId]) {
            wallColor = FACULTY_COLORS[b.facultyId].wall;
          } else if (lmStyle) {
            wallColor = lmStyle.wall;
          }

          return (
            <polygon
              key={`wall-${b.id}`}
              points={wallPoints}
              fill={wallColor}
            />
          );
        })}
      </g>

      {/* 2. Roof Polygons */}
      <g id="building-roofs">
        {renderedBuildings.map((item) => {
          if (!item) return null;
          const { building: b, roofPoints, isFaculty, isApprox, lmStyle } = item;
          const isSelected = isFaculty && b.facultyId === selectedFacultyId;
          const isHovered = isFaculty && b.facultyId === hoveredFacultyId;

          let roofColor = '#292524';
          let strokeColor = '#44403C';
          let strokeWidth = 1;

          if (isFaculty && b.facultyId && FACULTY_COLORS[b.facultyId]) {
            const pal = FACULTY_COLORS[b.facultyId];
            roofColor = isSelected ? pal.highlight : pal.roof;
            strokeColor = isSelected ? '#FDE68A' : pal.stroke;
            strokeWidth = isSelected ? 2.5 : isHovered ? 2 : 1.2;
          } else if (lmStyle) {
            roofColor = lmStyle.roof;
            strokeColor = lmStyle.stroke;
            strokeWidth = 1.5;
          }

          // Approx buildings (FEB) get dashed stroke
          const strokeDash = isApprox ? '4 3' : undefined;
          const opacity = isApprox ? (zoom < 1.6 ? 0.4 : 0.85) : 0.95;

          return (
            <polygon
              key={`roof-${b.id}`}
              id={`bld-${b.id}`}
              points={roofPoints}
              fill={roofColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDash}
              opacity={opacity}
              className={`transition-colors duration-200 ${isFaculty ? 'cursor-pointer' : ''}`}
              onClick={(e) => {
                if (isFaculty && b.facultyId) {
                  e.stopPropagation();
                  onSelectFaculty?.(b.facultyId);
                }
              }}
              onMouseEnter={() => {
                if (isFaculty && b.facultyId) {
                  onHoverFaculty?.(b.facultyId);
                }
              }}
              onMouseLeave={() => {
                if (isFaculty) {
                  onHoverFaculty?.(null);
                }
              }}
            />
          );
        })}
      </g>
    </g>
  );
}
