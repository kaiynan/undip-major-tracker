'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  campusFacultyLocations,
} from '@/data/campusLocations';
import { FacultyBuildingIllustration } from './PixelFacultyBuildings';
import { CampusRoadNetwork } from './CampusRoadNetwork';
import { FacultyScore } from '@/data/types';
import {
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
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
  className = '',
  heightClass = 'h-[440px] sm:h-[540px] md:h-[620px]',
}: PixelCampusMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [userZoom, setUserZoom] = useState<number>(1);
  const [manualPan, setManualPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredFacultyId, setHoveredFacultyId] = useState<string | null>(null);

  // Reset zoom & pan during render when faculty changes
  const [prevFacultyId, setPrevFacultyId] = useState<string | null>(selectedFacultyId);
  if (prevFacultyId !== selectedFacultyId) {
    setPrevFacultyId(selectedFacultyId);
    setUserZoom(1);
    setManualPan({ x: 0, y: 0 });
  }

  // Native non-passive wheel listener
  useEffect(() => {
    const el = mapContainerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.15 : 0.15;
      setUserZoom((prev) => Math.min(Math.max(0.7, prev + delta), 2.5));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

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

          {/* REAL OSM CAMPUS ROAD NETWORK */}
          <CampusRoadNetwork />

          {/* WATER FEATURE: Waduk Pendidikan Diponegoro (Danau Undip) */}
          <g id="waduk-undip">
            <polygon
              points="1632.8,625.6 1611.9,527.0 1574.5,540.5 1560.8,547.9 1545.6,550.3 1533.3,549.4 1519.0,552.0 1516.6,556.6 1516.4,562.1 1513.9,567.9 1509.9,571.8 1502.3,571.5 1496.2,570.6 1492.3,579.0 1486.0,592.8 1485.9,600.5 1490.1,629.3 1489.9,657.3 1484.1,675.8 1482.4,684.5 1473.0,687.4 1446.9,691.8 1455.0,697.1 1467.8,705.5 1488.0,715.2 1500.7,717.6 1534.8,715.0 1535.7,716.1 1554.4,702.8 1570.7,681.1 1565.8,659.4 1578.0,638.7 1632.8,625.6"
              fill="#0369A1"
              stroke="#0284C7"
              strokeWidth="4"
              opacity="0.85"
            />
            <rect x="1465" y="605" width="145" height="18" fill="#190E08" rx="4" stroke="#0284C7" strokeWidth="1" />
            <text x="1537" y="618" fill="#38BDF8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Waduk Pendidikan Undip
            </text>
          </g>

          {/* REAL OSM GREEN SPACES */}
          <g id="campus-green-parks">
            <polygon
              points="751.7,287.6 751.4,297.5 770.0,326.2 776.3,323.0 793.7,313.9 808.8,304.4 850.9,281.3 828.7,248.7 814.8,244.4 804.0,248.5 791.2,254.2 781.7,260.2 769.1,269.7 753.4,280.3 751.7,287.6"
              fill="#15803D"
              stroke="#166534"
              strokeWidth="2"
              opacity="0.85"
            />
          </g>

          {/* CAMPUS PEDESTRIAN PATHWAYS & PLAZAS */}
          <rect x="910" y="420" width="180" height="120" fill="url(#campusPaving)" stroke="#78350F" strokeWidth="2" rx="4" />
          <circle cx="1000" cy="480" r="38" fill="#166534" stroke="#14532D" strokeWidth="3" />

          {/* PANGERAN DIPONEGORO MONUMENT CIRCLE */}
          <g id="monumen-bundaran-kuda" transform="translate(975, 455)">
            <rect x="20" y="42" width="16" height="10" fill="#E2E8F0" />
            <path d="M 26 28 L 34 22 L 32 32 L 36 38 L 24 40 L 21 34 Z" fill="#FFFFFF" />
            <circle cx="29" cy="20" r="2.5" fill="#FFFFFF" />
            <text x="28" y="60" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Patung Kuda Undip
            </text>
          </g>

          {/* CENTRAL LANDMARK: GEDUNG REKTORAT & WIDYA PURAYA */}
          <g
            id="landmark-rektorat"
            transform="translate(910, 410)"
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
          <g id="landmark-gsg" transform="translate(800, 395)">
            <polygon points="35,28 85,5 135,28" fill="#78350F" />
            <polygon points="15,48 85,22 155,48" fill="#9A3412" />
            <rect x="25" y="48" width="120" height="30" fill="#FEF3C7" />
            <text x="85" y="93" fill="#FDE68A" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              GSG Prof. Sudarto
            </text>
          </g>

          {/* MASJID KAMPUS DIPONEGORO */}
          <g id="landmark-masjid" transform="translate(620, 890)">
            <circle cx="50" cy="35" r="24" fill="#047857" />
            <rect x="25" y="40" width="50" height="30" fill="#F8FAFC" />
            <polygon points="85,60 90,15 95,60" fill="#065F46" />
            <text x="50" y="85" fill="#A7F3D0" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Masjid Kampus
            </text>
          </g>

          {/* CAMPUS ENTRANCE GATE (Gerbang Utama Tembalang) */}
          <g id="gerbang-tembalang" transform="translate(885, 235)">
            <rect x="20" y="30" width="18" height="40" fill="#78350F" />
            <rect x="102" y="30" width="18" height="40" fill="#78350F" />
            <polygon points="10,30 70,10 130,30" fill="#B45309" />
            <rect x="38" y="24" width="64" height="6" fill="#F59E0B" />
            <text x="70" y="84" fill="#FDE68A" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
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

                {/* Ground Pin Label & Tier Marker (Badge first, compact width) */}
                {(() => {
                  const offsetX = loc.labelOffset?.x || 0;
                  const offsetY = loc.labelOffset?.y || 0;
                  const shortTitle = loc.shortName;
                  const hasScore = !!score;
                  const textX = hasScore ? 28 : 10;
                  const pillWidth = hasScore ? (shortTitle.length > 3 ? 88 : 78) : (shortTitle.length > 3 ? 66 : 54);
                  const pillHeight = 24;

                  return (
                    <g transform={`translate(${10 + offsetX}, ${105 + offsetY})`}>
                      <rect
                        x="0"
                        y="0"
                        width={pillWidth}
                        height={pillHeight}
                        rx="6"
                        fill={isSelected ? '#78350F' : '#190E08'}
                        stroke={isSelected ? '#F59E0B' : '#78350F'}
                        strokeWidth={isSelected ? '2' : '1'}
                        opacity="0.95"
                      />

                      {score && (
                        <g transform="translate(3, 2.5)">
                          <rect
                            x="0"
                            y="0"
                            width="19"
                            height="19"
                            rx="4"
                            fill={
                              score.tier === 'S'
                                ? '#F59E0B'
                                : score.tier === 'A'
                                ? '#3B82F6'
                                : score.tier === 'B'
                                ? '#F97316'
                                : '#78350F'
                            }
                          />
                          <text
                            x="9.5"
                            y="13.5"
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

                      <text
                        x={textX}
                        y="16"
                        fill={isSelected ? '#FFFBEB' : '#FDE68A'}
                        fontSize="11.5"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        {shortTitle}
                      </text>
                    </g>
                  );
                })()}
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

      {/* Map Attribution Badge */}
      <div className="absolute bottom-2 right-2 z-10 text-[9px] font-mono text-amber-200/70 bg-black/60 px-2 py-0.5 rounded border border-[#78350F]/40 backdrop-blur-xs select-none">
        © OpenStreetMap contributors
      </div>
    </div>
  );
}
