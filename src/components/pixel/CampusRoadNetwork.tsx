'use client';

import React, { useMemo } from 'react';
import { campusMapData } from '@/data/campusMap';

const CANVAS_X = 1000;
const CANVAS_Y = 480;

/**
 * Continuous Campus Road Network for UNDIP Tembalang
 * Rendered directly from real OpenStreetMap geometry (© OpenStreetMap contributors)
 * Projected with uniform isotropic scale centered on Widya Puraya.
 */
export function CampusRoadNetwork() {
  const { arterialPath, localPath, servicePath } = useMemo(() => {
    const art: string[] = [];
    const loc: string[] = [];
    const srv: string[] = [];

    for (const road of campusMapData.roads) {
      if (!road.projectedCoordinates || road.projectedCoordinates.length < 2) continue;
      const d = road.projectedCoordinates
        .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${(CANVAS_X + pt.x).toFixed(1)} ${(CANVAS_Y + pt.y).toFixed(1)}`)
        .join(' ');

      if (road.highwayClass === 'secondary' || road.highwayClass === 'tertiary') {
        art.push(d);
      } else if (road.highwayClass === 'residential') {
        loc.push(d);
      } else {
        srv.push(d);
      }
    }

    return {
      arterialPath: art.join(' '),
      localPath: loc.join(' '),
      servicePath: srv.join(' '),
    };
  }, []);

  return (
    <g id="campus-road-network" style={{ shapeRendering: 'crispEdges' }}>
      {/* 1. Road Base Foundation / Trench Shadows */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {servicePath && <path d={servicePath} stroke="#1A0E08" strokeWidth="14" opacity="0.8" />}
        {localPath && <path d={localPath} stroke="#1E100A" strokeWidth="22" />}
        {arterialPath && <path d={arterialPath} stroke="#190E08" strokeWidth="32" />}
      </g>

      {/* 2. Road Pavement / Asphalt Layer */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {servicePath && <path d={servicePath} stroke="#2D170E" strokeWidth="8" />}
        {localPath && <path d={localPath} stroke="#3D2114" strokeWidth="16" />}
        {arterialPath && <path d={arterialPath} stroke="#4A2818" strokeWidth="24" />}
      </g>

      {/* 3. Road Surface Curbs & Inner Highlights */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        {localPath && <path d={localPath} stroke="#542E1C" strokeWidth="8" opacity="0.6" />}
        {arterialPath && <path d={arterialPath} stroke="#5C321E" strokeWidth="14" />}
      </g>

      {/* 4. Arterial Centerline Dashes (Golden Hour Road Stripes) */}
      <g fill="none" strokeLinecap="butt" strokeLinejoin="round">
        {arterialPath && (
          <path
            d={arterialPath}
            stroke="#D97706"
            strokeWidth="2.5"
            strokeDasharray="14 10"
            opacity="0.85"
          />
        )}
      </g>

      {/* 5. Bundaran Pertama & Widya Puraya Plazas */}
      <circle cx="945" cy="553" r="28" fill="#15803D" stroke="#78350F" strokeWidth="5" />
      <circle cx="945" cy="553" r="14" fill="#F59E0B" opacity="0.85" />

      <circle cx="1000" cy="480" r="32" fill="#166534" stroke="#78350F" strokeWidth="5" />
      <circle cx="1000" cy="480" r="16" fill="#FDE68A" opacity="0.8" />
    </g>
  );
}
