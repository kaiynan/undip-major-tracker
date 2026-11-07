'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  campusFacultyLocations,
  campusLandmarks,
  CampusFacultyLocation,
} from '@/data/campusLocations';
import { FacultyBuildingIllustration } from './PixelFacultyBuildings';
import { faculties } from '@/data/faculties';
import { FacultyScore } from '@/data/types';
import {
  Compass,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Building2,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';

interface PixelCampusMapProps {
  selectedFacultyId: string | null;
  onSelectFaculty?: (facultyId: string | null) => void;
  facultyScores?: FacultyScore[];
  mode?: 'overview' | 'detail';
  className?: string;
  heightClass?: string;
}

export function PixelCampusMap({
  selectedFacultyId,
  onSelectFaculty,
  facultyScores = [],
  mode = 'overview',
  className = '',
  heightClass = 'h-[440px] sm:h-[540px] md:h-[620px]',
}: PixelCampusMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [userZoom, setUserZoom] = useState<number>(1);
  const [manualPan, setManualPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredFacultyId, setHoveredFacultyId] = useState<string | null>(null);

  // Score lookup map
  const scoreMap = useMemo(() => {
    const map = new Map<string, FacultyScore>();
    for (const fs of facultyScores) {
      map.set(fs.facultyId, fs);
    }
    return map;
  }, [facultyScores]);

  // Selected faculty location info
  const selectedLocation = useMemo(() => {
    if (!selectedFacultyId) return null;
    return campusFacultyLocations.find((loc) => loc.id === selectedFacultyId) || null;
  }, [selectedFacultyId]);

  // Reset zoom & pan when faculty changes or cleared
  useEffect(() => {
    setUserZoom(1);
    setManualPan({ x: 0, y: 0 });
  }, [selectedFacultyId]);

  // Map dimensions
  const MAP_WIDTH = 2000;
  const MAP_HEIGHT = 1400;

  // Camera target calculation
  const cameraTransform = useMemo(() => {
    if (!selectedLocation) {
      // Full overview: scale 1, centered at (1000, 700)
      const scale = 1 * userZoom;
      const tx = (1 - scale) * (MAP_WIDTH / 2) + manualPan.x;
      const ty = (1 - scale) * (MAP_HEIGHT / 2) + manualPan.y;
      return `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
    } else {
      // Zoom into selected faculty
      const baseZoom = 2.1;
      const scale = baseZoom * userZoom;
      // Target center
      const targetX = selectedLocation.mapPosition.x;
      const targetY = selectedLocation.mapPosition.y;
      const tx = (MAP_WIDTH / 2 - targetX * scale) + manualPan.x;
      const ty = (MAP_HEIGHT / 2 - targetY * scale) + manualPan.y;
      return `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
    }
  }, [selectedLocation, userZoom, manualPan]);

  const handleZoomIn = () => setUserZoom((prev) => Math.min(prev + 0.3, 2.5));
  const handleZoomOut = () => setUserZoom((prev) => Math.max(prev - 0.3, 0.7));
  const handleReset = () => {
    setUserZoom(1);
    setManualPan({ x: 0, y: 0 });
    if (onSelectFaculty) onSelectFaculty(null);
  };

  return (
    <div
      ref={mapContainerRef}
      className={`relative w-full ${heightClass} bg-[#190E08] rounded-3xl border-2 border-[#78350F] overflow-hidden select-none shadow-[0_8px_30px_rgba(0,0,0,0.5)] ${className}`}
    >
      {/* 1. Golden-Hour Compass & Title HUD Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2.5 bg-[#190E08]/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#78350F] shadow-md pointer-events-auto">
        <div className="w-7 h-7 rounded-xl bg-[#78350F] text-[#FDE68A] flex items-center justify-center border border-[#F59E0B]">
          <Compass className="w-4 h-4 text-[#FDE68A] animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[9px] text-[#FDE68A] uppercase tracking-wider">
              PETA KAMPUS UNDIP TEMBALANG
            </span>
            <span className="text-[10px] text-amber-400 font-bold bg-[#78350F]/70 px-2 py-0.5 rounded-full border border-[#F59E0B]/50">
              16-BIT GIS
            </span>
          </div>
          <p className="text-[11px] text-amber-200/80 font-medium">
            {selectedLocation
              ? `${selectedLocation.name} (${selectedLocation.zone})`
              : 'Bird\'s-Eye Overview • Jelajahi 12 Fakultas & Landmark'}
          </p>
        </div>
      </div>

      {/* 2. Map Camera Controls HUD (Zoom In/Out, Reset, Overview) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#190E08]/90 backdrop-blur-md p-1.5 rounded-2xl border border-[#78350F] shadow-md pointer-events-auto">
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-xl text-amber-200 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer"
          title="Perbesar Peta"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-xl text-amber-200 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer"
          title="Perkecil Peta"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-[#78350F]/70 mx-0.5" />
        <button
          onClick={handleReset}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            !selectedLocation
              ? 'bg-[#78350F] text-[#FDE68A] border border-[#F59E0B]'
              : 'text-amber-200/80 hover:bg-[#78350F] hover:text-white'
          }`}
          title="Kembali ke Pandangan Seluruh Kampus"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Overview</span>
        </button>
      </div>

      {/* 3. Interactive Faculty Quick Filter Bar (Bottom HUD) */}
      <div className="absolute bottom-3 inset-x-3 sm:inset-x-4 z-20 pointer-events-auto">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 bg-[#190E08]/90 backdrop-blur-md rounded-2xl border border-[#78350F] scrollbar-thin scrollbar-thumb-amber-700/50">
          <button
            onClick={() => onSelectFaculty?.(null)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !selectedFacultyId
                ? 'bg-[#F59E0B] text-[#190E08] font-black shadow-xs'
                : 'text-amber-200/80 hover:bg-[#78350F]/60'
            }`}
          >
            Semua ({campusFacultyLocations.length})
          </button>
          {campusFacultyLocations.map((loc) => {
            const isSelected = selectedFacultyId === loc.id;
            const score = scoreMap.get(loc.id);
            return (
              <button
                key={loc.id}
                onClick={() => onSelectFaculty?.(loc.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#78350F] text-[#FDE68A] border-[#F59E0B] shadow-sm'
                    : 'text-amber-100/90 hover:bg-[#2A150D] border-transparent'
                }`}
              >
                <span>{loc.shortName}</span>
                {score && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      score.tier === 'S'
                        ? 'bg-amber-400 text-stone-900'
                        : score.tier === 'A'
                        ? 'bg-blue-400 text-stone-900'
                        : 'bg-stone-700 text-amber-200'
                    }`}
                  >
                    {score.tier}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. THE 16-BIT RETRO CAMPUS MAP CANVAS (Virtual 2000 x 1400 px) */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{
          transformOrigin: '50% 50%',
          transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          className="w-full h-full object-cover"
          style={{
            transform: cameraTransform,
            transformOrigin: '50% 50%',
            transition: 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
            shapeRendering: 'crispEdges',
          }}
        >
          {/* DEFINITIONS & TEXTURES */}
          <defs>
            {/* Paving Pattern */}
            <pattern id="campusPaving" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#2E180E" />
              <rect x="0" y="0" width="18" height="9" fill="#3D2114" />
              <rect x="10" y="10" width="18" height="9" fill="#381D10" />
            </pattern>
            {/* Grass/Forest Texture */}
            <pattern id="campusForest" width="24" height="24" patternUnits="userSpaceOnUse">
              <rect width="24" height="24" fill="#15240E" />
              <rect x="2" y="2" width="8" height="8" fill="#1C3013" />
              <rect x="14" y="14" width="8" height="8" fill="#233A18" />
            </pattern>
          </defs>

          {/* BASE TERRAIN: Tembalang Hills & Campus Lawn */}
          <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="#141E0D" />
          <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#campusForest)" opacity="0.6" />

          {/* WATER FEATURE: Waduk Pendidikan Diponegoro (Danau Undip) */}
          <g id="waduk-undip">
            <path
              d="M 1200 580 C 1280 540, 1360 560, 1420 620 C 1450 670, 1400 740, 1320 750 C 1240 760, 1180 700, 1170 650 Z"
              fill="#0369A1"
              stroke="#0284C7"
              strokeWidth="6"
            />
            <path
              d="M 1220 600 C 1270 570, 1340 580, 1380 630 C 1400 660, 1370 710, 1310 720 C 1260 730, 1200 680, 1200 640 Z"
              fill="#0284C7"
              opacity="0.7"
            />
            {/* Water reflections */}
            <line x1="1240" y1="620" x2="1320" y2="620" stroke="#7DD3FC" strokeWidth="3" opacity="0.8" />
            <line x1="1260" y1="650" x2="1350" y2="650" stroke="#7DD3FC" strokeWidth="3" opacity="0.8" />
            <line x1="1230" y1="680" x2="1310" y2="680" stroke="#7DD3FC" strokeWidth="3" opacity="0.8" />
            {/* Lake label */}
            <text x="1300" y="775" fill="#38BDF8" fontSize="14" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Waduk Pendidikan Undip
            </text>
          </g>

          {/* CAMPUS ROAD NETWORK (Jl. Prof. Soedarto Ring Road & Avenues) */}
          <g id="roads" fill="none" stroke="#3D2619" strokeLinecap="square">
            {/* Main Outer Ring Road (Jl. Prof. Soedarto) */}
            <path
              d="M 700 80 L 700 320 M 700 320 C 500 340, 360 500, 360 700 C 360 900, 420 1140, 620 1220 L 1000 1260 C 1200 1260, 1500 1160, 1660 950 C 1720 850, 1720 700, 1660 550 C 1580 400, 1400 300, 1050 300 L 700 300"
              strokeWidth="42"
            />
            {/* Central Roundabouts and Connecting Roads */}
            <circle cx="780" cy="320" r="70" strokeWidth="32" />
            <line x1="780" y1="390" x2="920" y2="520" strokeWidth="36" />
            <line x1="920" y1="520" x2="1200" y2="520" strokeWidth="32" />
            <line x1="920" y1="520" x2="920" y2="880" strokeWidth="36" />
            <line x1="920" y1="880" x2="1180" y2="860" strokeWidth="32" />
            <line x1="500" y1="460" x2="700" y2="350" strokeWidth="28" />
            <line x1="380" y1="640" x2="700" y2="640" strokeWidth="28" />
            <line x1="620" y1="1060" x2="920" y2="1060" strokeWidth="28" />
            <line x1="1220" y1="380" x2="1000" y2="320" strokeWidth="28" />
            <line x1="1360" y1="220" x2="1220" y2="380" strokeWidth="24" />
            <line x1="1440" y1="440" x2="1200" y2="520" strokeWidth="28" />
            <line x1="1540" y1="560" x2="1680" y2="780" strokeWidth="28" />
          </g>

          {/* Road Asphalt Inner Fill */}
          <g id="road-asphalt" fill="none" stroke="#523423" strokeLinecap="square">
            <path
              d="M 700 80 L 700 320 M 700 320 C 500 340, 360 500, 360 700 C 360 900, 420 1140, 620 1220 L 1000 1260 C 1200 1260, 1500 1160, 1660 950 C 1720 850, 1720 700, 1660 550 C 1580 400, 1400 300, 1050 300 L 700 300"
              strokeWidth="32"
            />
            <circle cx="780" cy="320" r="70" strokeWidth="24" />
            <line x1="780" y1="390" x2="920" y2="520" strokeWidth="26" />
            <line x1="920" y1="520" x2="1200" y2="520" strokeWidth="24" />
            <line x1="920" y1="520" x2="920" y2="880" strokeWidth="26" />
            <line x1="920" y1="880" x2="1180" y2="860" strokeWidth="24" />
            <line x1="500" y1="460" x2="700" y2="350" strokeWidth="20" />
            <line x1="380" y1="640" x2="700" y2="640" strokeWidth="20" />
            <line x1="620" y1="1060" x2="920" y2="1060" strokeWidth="20" />
            <line x1="1220" y1="380" x2="1000" y2="320" strokeWidth="20" />
            <line x1="1360" y1="220" x2="1220" y2="380" strokeWidth="18" />
            <line x1="1440" y1="440" x2="1200" y2="520" strokeWidth="20" />
            <line x1="1540" y1="560" x2="1680" y2="780" strokeWidth="20" />
          </g>

          {/* Road White Striped Markings */}
          <g id="road-markings" stroke="#FDE68A" strokeWidth="3" strokeDasharray="14 14" fill="none">
            <path d="M 700 80 L 700 320" />
            <circle cx="780" cy="320" r="70" />
            <line x1="780" y1="390" x2="920" y2="520" />
            <line x1="920" y1="520" x2="920" y2="880" />
          </g>

          {/* CAMPUS PEDESTRIAN PATHWAYS & PLAZAS */}
          <rect x="840" y="460" width="160" height="140" fill="url(#campusPaving)" stroke="#78350F" strokeWidth="2" />
          <circle cx="780" cy="320" r="46" fill="#166534" stroke="#14532D" strokeWidth="4" />

          {/* PANGERAN DIPONEGORO MONUMENT CIRCLE */}
          <g id="monumen-bundaran-kuda" transform="translate(745, 285)">
            <rect x="25" y="45" width="20" height="12" fill="#E2E8F0" />
            {/* White equestrian statue silhouette */}
            <path d="M 32 30 L 42 22 L 40 35 L 45 42 L 30 45 L 26 38 Z" fill="#FFFFFF" />
            <circle cx="36" cy="20" r="3" fill="#FFFFFF" />
            <text x="35" y="68" fill="#FDE68A" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Bundaran Kuda
            </text>
          </g>

          {/* CENTRAL LANDMARK: GEDUNG REKTORAT & WIDYA PURAYA */}
          <g
            id="landmark-rektorat"
            transform="translate(820, 440)"
            className="cursor-pointer"
            onClick={() => onSelectFaculty?.(null)}
          >
            <FacultyBuildingIllustration facultyId="rektorat" />
            <rect x="20" y="105" width="160" height="20" fill="#190E08" rx="6" />
            <text x="100" y="119" fill="#FDE68A" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Gedung Rektorat (Widya Puraya)
            </text>
          </g>

          {/* GSG (Gedung Serba Guna Prof. Sudarto) */}
          <g id="landmark-gsg" transform="translate(420, 400)">
            <polygon points="40,40 100,10 160,40" fill="#78350F" />
            <polygon points="20,70 100,35 180,70" fill="#9A3412" />
            <rect x="30" y="70" width="140" height="30" fill="#FEF3C7" />
            <text x="100" y="115" fill="#FDE68A" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              GSG Prof. Sudarto
            </text>
          </g>

          {/* MASJID KAMPUS DIPONEGORO */}
          <g id="landmark-masjid" transform="translate(640, 440)">
            <circle cx="80" cy="50" r="28" fill="#047857" />
            <rect x="50" y="55" width="60" height="35" fill="#F8FAFC" />
            <polygon points="120,75 125,20 130,75" fill="#065F46" />
            <text x="80" y="105" fill="#A7F3D0" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Masjid Kampus
            </text>
          </g>

          {/* CAMPUS ENTRANCE GATE (Gerbang Utama Tembalang) */}
          <g id="gerbang-tembalang" transform="translate(630, 40)">
            <rect x="20" y="30" width="18" height="50" fill="#78350F" />
            <rect x="102" y="30" width="18" height="50" fill="#78350F" />
            <polygon points="10,30 70,10 130,30" fill="#B45309" />
            <rect x="38" y="24" width="64" height="6" fill="#F59E0B" />
            <text x="70" y="94" fill="#FDE68A" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Gerbang Utama Tembalang
            </text>
          </g>

          {/* 12 VERIFIED FACULTY SITES & ARCHITECTURAL BUILDINGS */}
          {campusFacultyLocations.map((loc) => {
            const isSelected = selectedFacultyId === loc.id;
            const isHovered = hoveredFacultyId === loc.id;
            const score = scoreMap.get(loc.id);

            // Building position offset (center illustration on coordinate)
            const posX = loc.mapPosition.x - 90;
            const posY = loc.mapPosition.y - 60;

            return (
              <g
                key={loc.id}
                id={`faculty-${loc.id}`}
                transform={`translate(${posX}, ${posY})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={() => onSelectFaculty?.(loc.id)}
                onMouseEnter={() => setHoveredFacultyId(loc.id)}
                onMouseLeave={() => setHoveredFacultyId(null)}
              >
                {/* Visual pulse aura when selected */}
                {isSelected && (
                  <circle
                    cx="90"
                    cy="60"
                    r="95"
                    fill="#F59E0B"
                    opacity="0.2"
                    className="animate-pulse"
                  />
                )}

                {/* The 16-Bit Architectural Illustration */}
                <FacultyBuildingIllustration
                  facultyId={loc.id}
                  isHighlighted={isSelected || isHovered}
                />

                {/* Ground Pin Label & Tier Marker */}
                <g transform="translate(10, 105)">
                  <rect
                    x="0"
                    y="0"
                    width="160"
                    height="28"
                    rx="8"
                    fill={isSelected ? '#78350F' : '#190E08'}
                    stroke={isSelected ? '#F59E0B' : '#78350F'}
                    strokeWidth={isSelected ? '2' : '1'}
                    opacity="0.95"
                  />
                  <text
                    x="12"
                    y="18"
                    fill={isSelected ? '#FFFBEB' : '#FDE68A'}
                    fontSize="12"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {loc.shortName} • {loc.name.replace('Fakultas ', '').replace('Sekolah ', '')}
                  </text>

                  {/* Tier Pill */}
                  {score && (
                    <g transform="translate(136, 4)">
                      <rect
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        rx="5"
                        fill={
                          score.tier === 'S'
                            ? '#F59E0B'
                            : score.tier === 'A'
                            ? '#3B82F6'
                            : '#78350F'
                        }
                      />
                      <text
                        x="10"
                        y="14"
                        fill="#FFFFFF"
                        fontSize="11"
                        fontWeight="black"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {score.tier}
                      </text>
                    </g>
                  )}
                </g>
              </g>
            );
          })}

          {/* TREES AND GREENERY SCATTERED ALONG PATHS */}
          <g id="campus-trees" fill="#166534" stroke="#14532D" strokeWidth="2">
            {[
              [520, 240], [580, 260], [640, 220], [860, 240], [920, 200],
              [340, 520], [320, 600], [330, 780], [380, 880], [420, 1000],
              [780, 780], [840, 820], [740, 920], [780, 1020], [860, 1140],
              [1100, 420], [1160, 360], [1480, 340], [1520, 460], [1620, 640],
              [1480, 760], [1560, 860], [1400, 980], [1300, 1080], [1160, 1180],
            ].map(([tx, ty], i) => (
              <g key={i} transform={`translate(${tx}, ${ty})`}>
                <rect x="6" y="14" width="4" height="8" fill="#451A03" />
                <polygon points="8,0 0,14 16,14" fill="#15803D" />
                <polygon points="8,4 2,12 14,12" fill="#22C55E" />
              </g>
            ))}
          </g>
        </svg>
      </div>

      {/* 5. Selected Faculty Architectural & Geographic Card (In Zoomed Mode) */}
      {selectedLocation && (
        <div className="absolute bottom-16 left-4 right-4 sm:right-auto sm:max-w-md z-20 bg-[#24130C]/95 backdrop-blur-md p-4 sm:p-5 rounded-3xl border-2 border-[#F59E0B] shadow-2xl text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[9px] bg-[#78350F] text-[#FDE68A] px-2.5 py-0.5 rounded-full border border-[#F59E0B]">
                  {selectedLocation.zone}
                </span>
                <span className="text-[11px] text-amber-200/70 font-mono">
                  {selectedLocation.realCoordinates.lat.toFixed(4)}°, {selectedLocation.realCoordinates.lng.toFixed(4)}°
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-[#FFFBEB] mt-1">
                {selectedLocation.name}
              </h3>
              <p className="text-xs text-amber-200/90 font-medium mt-0.5">
                {selectedLocation.landmarkName}
              </p>
            </div>
            <button
              onClick={() => onSelectFaculty?.(null)}
              className="text-xs font-bold text-amber-200/80 hover:text-white bg-[#190E08] hover:bg-[#78350F] px-2.5 py-1 rounded-xl border border-[#78350F] transition-colors"
            >
              Tutup
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-[#78350F]/70 space-y-1.5 text-xs text-amber-100/85">
            <p className="leading-relaxed">
              <strong className="text-[#FDE68A]">Ciri Khas Arsitektur:</strong>{' '}
              {selectedLocation.architecturalStyle.facadeDescription}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedLocation.architecturalStyle.distinctiveFeatures.map((feat, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-[#190E08] text-amber-200 px-2 py-0.5 rounded-md border border-[#78350F]/60"
                >
                  • {feat}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
