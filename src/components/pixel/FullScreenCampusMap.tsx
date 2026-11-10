'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  campusFacultyLocations,
  campusLandmarks,
} from '@/data/campusLocations';
import { CampusBuildingsLayer } from './CampusBuildingsLayer';
import { CampusRoadNetwork } from './CampusRoadNetwork';
import { FacultyMapTourSheet } from './FacultyMapTourSheet';
import { FacultyScore } from '@/data/types';
import {
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

interface FullScreenCampusMapProps {
  selectedFacultyId: string | null;
  onSelectFaculty?: (facultyId: string | null) => void;
  facultyScores?: FacultyScore[];
  className?: string;
  isForegroundOpen?: boolean;
  isPanelOpen?: boolean;
  onToggleForeground?: () => void;
}

// 8 Verified iconic landmarks shown at overview zoom (< 1.6)
const OVERVIEW_KEY_LANDMARKS = new Set([
  'widya-puraya',
  'gsg',
  'student-centre',
  'masjid-kampus',
  'muladi-dome',
  'stadion',
  'waduk',
  'rsnd',
]);

// Trees placed strictly within real OSM green polygons (Taman Widya Puraya, Taman Rusa, etc.)
const VERIFIED_GREEN_TREES = [
  [770, 270], [790, 280], [810, 260], [830, 275], // Taman Widya Puraya
  [935, 760], [960, 775],                         // Taman Rusa
  [1580, 790], [1610, 810],                       // Taman Stadion
  [1150, 710], [1180, 720],                       // Taman Agro FPP
  [570, 430], [590, 450],                         // Selasar Hijau FH/FISIP
  [415, 390], [430, 375],                         // Selasar Hijau SV
];

export function FullScreenCampusMap({
  selectedFacultyId,
  onSelectFaculty,
  facultyScores = [],
  className = '',
  isForegroundOpen = true,
  isPanelOpen,
}: FullScreenCampusMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize panel open state
  const panelOpen = isPanelOpen !== undefined ? isPanelOpen : isForegroundOpen;

  // Map virtual dimensions
  const MAP_WIDTH = 2000;
  const MAP_HEIGHT = 1400;

  // Viewport tracking for precise responsive camera math
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({
    width: 1920,
    height: 1080,
  });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setViewportSize({
          width: containerRef.current.clientWidth || window.innerWidth,
          height: containerRef.current.clientHeight || window.innerHeight,
        });
      } else if (typeof window !== 'undefined') {
        setViewportSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Camera state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredFacultyId, setHoveredFacultyId] = useState<string | null>(null);

  // Lookup map for faculty scores
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

  // Dynamic Camera Math: Fits 12 units on overview without clipping, zooms into selected unit
  const recalculateCamera = useCallback(() => {
    const vw = viewportSize.width;
    const vh = viewportSize.height;
    const isDesktop = vw >= 640;

    // Base scale factor from virtual map (2000x1400) to viewport
    const baseScale = Math.max(vw / MAP_WIDTH, vh / MAP_HEIGHT);

    if (!selectedLocation) {
      // -----------------------------------------------------------------------
      // OVERVIEW CAMERA: Bounding box fit calculation for 12 units (x: 445-1440, y: 210-685)
      // -----------------------------------------------------------------------
      const bboxMinX = 380;
      const bboxMaxX = 1520;
      const bboxMinY = 160;
      const bboxMaxY = 740;
      const bboxWidth = bboxMaxX - bboxMinX; // 1140
      const bboxHeight = bboxMaxY - bboxMinY; // 580
      const bboxCenterX = (bboxMinX + bboxMaxX) / 2; // 950
      const bboxCenterY = (bboxMinY + bboxMaxY) / 2; // 450

      let availW = vw * 0.92;
      let availH = vh * 0.88;
      let deltaScreenX = 0;
      let deltaScreenY = 0;

      if (panelOpen) {
        if (isDesktop) {
          let panelWidth = 580;
          if (vw >= 1280) panelWidth = 720;
          else if (vw >= 1024) panelWidth = 660;
          panelWidth = Math.min(panelWidth, vw * 0.55);
          availW = (vw - panelWidth) * 0.92;
          deltaScreenX = -panelWidth / 2;
        } else {
          // Mobile sheet docked at bottom
          const sheetHeight = Math.min(vh * 0.52, 420);
          availH = (vh - sheetHeight) * 0.90;
          deltaScreenY = -sheetHeight / 2;
        }
      }

      const scaleX = availW / (bboxWidth * baseScale);
      const scaleY = availH / (bboxHeight * baseScale);
      const overviewZoom = Math.min(scaleX, scaleY, 1.05);

      const totalScale = baseScale * overviewZoom;
      const targetPanX = deltaScreenX - (bboxCenterX - MAP_WIDTH / 2) * totalScale;
      const targetPanY = deltaScreenY - (bboxCenterY - MAP_HEIGHT / 2) * totalScale;

      setZoom(overviewZoom);
      setPan({ x: targetPanX, y: targetPanY });
      return;
    }

    // -------------------------------------------------------------------------
    // DETAIL CAMERA: Zoomed into selected faculty centroid
    // -------------------------------------------------------------------------
    const targetZoom = 2.4;
    const totalScale = baseScale * targetZoom;
    const targetX = selectedLocation.mapPosition.x;
    const targetY = selectedLocation.mapPosition.y;
    const mapCenterX = MAP_WIDTH / 2; // 1000
    const mapCenterY = MAP_HEIGHT / 2; // 700

    let deltaScreenX = 0;
    let deltaScreenY = 0;

    if (panelOpen) {
      if (isDesktop) {
        let panelWidth = 580;
        if (vw >= 1280) panelWidth = 720;
        else if (vw >= 1024) panelWidth = 660;
        panelWidth = Math.min(panelWidth, vw * 0.55);
        deltaScreenX = -panelWidth / 2;
      } else {
        const panelHeight = Math.min(vh * 0.52, 420);
        const headerHeight = 60;
        deltaScreenX = 0;
        deltaScreenY = -(panelHeight - headerHeight) / 2;
      }
    }

    const targetPanX = deltaScreenX - (targetX - mapCenterX) * totalScale;
    const targetPanY = deltaScreenY - (targetY - mapCenterY) * totalScale;

    setZoom(targetZoom);
    setPan({ x: targetPanX, y: targetPanY });
  }, [selectedLocation, panelOpen, viewportSize]);

  useEffect(() => {
    const animId = requestAnimationFrame(() => {
      recalculateCamera();
    });
    return () => cancelAnimationFrame(animId);
  }, [recalculateCamera]);

  // Native wheel zoom listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.15 : 0.15;
      setZoom((prev) => Math.min(Math.max(0.45, prev + zoomDelta), 3.4));
    };

    container.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onNativeWheel);
    };
  }, []);

  // Keyboard zoom shortcuts (+ / - / arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === '+' || e.key === '=' || e.key === 'Add') {
        e.preventDefault();
        setZoom((prev) => Math.min(prev + 0.35, 3.4));
      } else if (e.key === '-' || e.key === '_' || e.key === 'Subtract') {
        e.preventDefault();
        setZoom((prev) => Math.max(prev - 0.35, 0.45));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setPan((prev) => ({ ...prev, x: prev.x + 60 }));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setPan((prev) => ({ ...prev, x: prev.x - 60 }));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setPan((prev) => ({ ...prev, y: prev.y + 60 }));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setPan((prev) => ({ ...prev, y: prev.y - 60 }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pointer drag panning & multi-touch pinch zoom
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartZoomRef = useRef<number>(1);
  const touchStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const hasMovedRef = useRef<boolean>(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as Element)?.closest('button, a, input, select, textarea, [role="button"], [data-no-drag]')) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    } catch {}

    if (pointersRef.current.size === 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      touchStartPosRef.current = { x: e.clientX, y: e.clientY };
      hasMovedRef.current = false;
    } else if (pointersRef.current.size === 2) {
      const coords = Array.from(pointersRef.current.values());
      const dist = Math.hypot(coords[1].x - coords[0].x, coords[1].y - coords[0].y);
      pinchStartDistRef.current = dist;
      pinchStartZoomRef.current = zoom;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2 && pinchStartDistRef.current) {
      const coords = Array.from(pointersRef.current.values());
      const currentDist = Math.hypot(coords[1].x - coords[0].x, coords[1].y - coords[0].y);
      const ratio = currentDist / pinchStartDistRef.current;
      const nextZoom = Math.min(3.4, Math.max(0.45, pinchStartZoomRef.current * ratio));
      setZoom(nextZoom);
      hasMovedRef.current = true;
    } else if (pointersRef.current.size === 1 && isDragging) {
      const moveDist = Math.hypot(
        e.clientX - touchStartPosRef.current.x,
        e.clientY - touchStartPosRef.current.y
      );
      if (moveDist > 6) {
        hasMovedRef.current = true;
      }
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    pointersRef.current.delete(e.pointerId);
    try {
      (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    } catch {}

    if (pointersRef.current.size === 0) {
      setIsDragging(false);
      pinchStartDistRef.current = null;
      setTimeout(() => {
        hasMovedRef.current = false;
      }, 120);
    } else if (pointersRef.current.size === 1) {
      const remaining = Array.from(pointersRef.current.values())[0];
      setDragStart({ x: remaining.x - pan.x, y: remaining.y - pan.y });
      pinchStartDistRef.current = null;
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.35, 3.4));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.35, 0.45));
  const handleResetOverview = () => {
    onSelectFaculty?.(null);
    recalculateCamera();
  };

  const cameraTransform = useMemo(() => {
    return `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`;
  }, [pan, zoom]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      aria-label="Peta Interaktif Kampus UNDIP Tembalang (Gunakan tanda panah untuk menggeser, + dan - untuk zoom)"
      className={`fixed inset-0 w-full h-full bg-[#140B07] overflow-hidden select-none touch-none focus:outline-none ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* 1. TOP-LEFT HUD: VIRTUAL CAMPUS COMPASS & CONTROLS (Strictly below --map-toolbar-h with clean margin) */}
      <div
        className="absolute left-3 sm:left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-auto"
        style={{ top: 'calc(var(--navbar-h, 56px) + var(--map-toolbar-h, 50px) + 16px)' }}
      >
        <div className="flex items-center gap-2 bg-[#190E08]/90 backdrop-blur-md px-3 py-2 rounded-2xl border-2 border-[#78350F] shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
          <div className="w-7 h-7 rounded-xl bg-[#78350F] text-[#FDE68A] flex items-center justify-center border border-[#F59E0B]">
            <Compass className="w-4 h-4 text-[#FDE68A] animate-spin-slow motion-reduce:animate-none" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-[8px] sm:text-[9px] text-[#FDE68A] tracking-wider uppercase">
                UNDIP MAP
              </span>
              <span className="text-[9px] text-amber-300 font-bold bg-[#78350F] px-1.5 py-0.2 rounded border border-[#F59E0B]/60">
                16-BIT GIS
              </span>
            </div>
            <p className="text-[11px] text-amber-100 font-medium truncate max-w-[140px] sm:max-w-[200px]">
              {selectedLocation ? selectedLocation.shortName : 'Tinjauan Kampus'}
            </p>
          </div>
        </div>

        {/* Camera Navigation Controls */}
        <div className="flex items-center gap-1.5 bg-[#190E08]/90 backdrop-blur-md p-1.5 rounded-2xl border-2 border-[#78350F] shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
          <button
            onClick={handleZoomIn}
            className="p-2 sm:p-2.5 rounded-xl text-amber-200 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Perbesar Peta (+)"
            aria-label="Perbesar Peta (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 sm:p-2.5 rounded-xl text-amber-200 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Perkecil Peta (-)"
            aria-label="Perkecil Peta (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-[#78350F] mx-0.5" />
          <button
            onClick={handleResetOverview}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
              !selectedLocation
                ? 'bg-[#78350F] text-[#FDE68A] border border-[#F59E0B]'
                : 'text-amber-200 hover:bg-[#78350F] hover:text-white'
            }`}
            title="Kembali ke Tinjauan Seluruh Kampus"
            aria-label="Kembali ke Tinjauan Seluruh Kampus"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </button>
        </div>
      </div>

      {/* 2. BOTTOM HUD: QUICK FACULTY EXPLORATION SELECTOR DOCK */}
      {!panelOpen && (
        <div className="absolute bottom-4 inset-x-3 sm:inset-x-4 z-20 pointer-events-auto max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#190E08] to-transparent pointer-events-none z-10 rounded-l-2xl" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#190E08] to-transparent pointer-events-none z-10 rounded-r-2xl" />
            <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 px-4 bg-[#190E08]/90 backdrop-blur-md rounded-2xl border-2 border-[#78350F] shadow-[0_6px_20px_rgba(0,0,0,0.6)] scrollbar-none">
              <button
                onClick={() => handleResetOverview()}
                aria-label={`Tampilkan tinjauan seluruh kampus (${campusFacultyLocations.length} lokasi)`}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center ${
                  !selectedFacultyId
                    ? 'bg-[#F59E0B] text-stone-900 font-black shadow-xs'
                    : 'text-amber-200/90 hover:bg-[#78350F]/70'
                }`}
              >
                Overview ({campusFacultyLocations.length})
              </button>
              {campusFacultyLocations.map((loc) => {
                const isSelected = selectedFacultyId === loc.id;
                const score = scoreMap.get(loc.id);
                return (
                  <button
                    key={loc.id}
                    onClick={() => onSelectFaculty?.(loc.id)}
                    aria-label={`Pilih fakultas ${loc.name} di peta`}
                    className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border min-h-[44px] ${
                      isSelected
                        ? 'bg-[#78350F] text-[#FDE68A] border-[#F59E0B] shadow-md'
                        : 'text-amber-100 hover:bg-[#2A150D] border-transparent'
                    }`}
                  >
                    <span>{loc.shortName}</span>
                    {score && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                          score.tier === 'S'
                            ? 'bg-amber-400 text-stone-950'
                            : score.tier === 'A'
                            ? 'bg-blue-400 text-stone-950'
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
        </div>
      )}

      {/* 3. THE 16-BIT FULL-SCREEN INTERACTIVE CANVAS */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{
          transformOrigin: '50% 50%',
          transition: isDragging ? 'none' : 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <svg
          viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full object-cover"
          style={{
            transform: cameraTransform,
            transformOrigin: '50% 50%',
            transition: isDragging ? 'none' : 'transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)',
            shapeRendering: 'crispEdges',
          }}
        >
          {/* DEFINITIONS & TEXTURES */}
          <defs>
            <g id="pixel-tree">
              <rect x="6" y="14" width="4" height="8" fill="#451A03" />
              <polygon points="8,0 0,14 16,14" fill="#15803D" />
              <polygon points="8,4 2,12 14,12" fill="#22C55E" />
            </g>
            <pattern id="fullCampusPaving" width="24" height="24" patternUnits="userSpaceOnUse">
              <rect width="24" height="24" fill="#2E180E" />
              <rect x="0" y="0" width="22" height="11" fill="#3D2114" />
              <rect x="12" y="12" width="22" height="11" fill="#381D10" />
            </pattern>
            <pattern id="fullCampusForest" width="28" height="28" patternUnits="userSpaceOnUse">
              <rect width="28" height="28" fill="#141E0D" />
              <rect x="2" y="2" width="10" height="10" fill="#1B2B12" />
              <rect x="16" y="16" width="10" height="10" fill="#223617" />
            </pattern>
          </defs>

          {/* BASE MAP TERRAIN */}
          <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="#141E0D" />
          <rect x="0" y="0" width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#fullCampusForest)" opacity="0.65" />

          {/* CONTINUOUS CAMPUS ROAD NETWORK (REAL OSM GEOMETRY) */}
          <CampusRoadNetwork />

          {/* REAL OSM WATER FEATURE: WADUK PENDIDIKAN DIPONEGORO */}
          <g id="waduk-pendidikan-undip">
            <polygon
              points="1632.8,625.6 1611.9,527.0 1574.5,540.5 1560.8,547.9 1545.6,550.3 1533.3,549.4 1519.0,552.0 1516.6,556.6 1516.4,562.1 1513.9,567.9 1509.9,571.8 1502.3,571.5 1496.2,570.6 1492.3,579.0 1486.0,592.8 1485.9,600.5 1490.1,629.3 1489.9,657.3 1484.1,675.8 1482.4,684.5 1473.0,687.4 1446.9,691.8 1455.0,697.1 1467.8,705.5 1488.0,715.2 1500.7,717.6 1534.8,715.0 1535.7,716.1 1554.4,702.8 1570.7,681.1 1565.8,659.4 1578.0,638.7 1632.8,625.6"
              fill="#0284C7"
              stroke="#0369A1"
              strokeWidth="4"
              opacity="0.85"
            />
            <rect x="1510" y="625" width="145" height="18" fill="#190E08" rx="4" stroke="#0284C7" strokeWidth="1" />
            <text x="1582" y="638" fill="#BAE6FD" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Waduk Pendidikan Undip
            </text>
          </g>

          {/* REAL OSM GREEN SPACES & PARKS */}
          <g id="campus-green-parks">
            {/* Taman Widya Puraya */}
            <polygon
              points="751.7,287.6 751.4,297.5 770.0,326.2 776.3,323.0 793.7,313.9 808.8,304.4 850.9,281.3 828.7,248.7 814.8,244.4 804.0,248.5 791.2,254.2 781.7,260.2 769.1,269.7 753.4,280.3 751.7,287.6"
              fill="#15803D"
              stroke="#166534"
              strokeWidth="2"
              opacity="0.85"
            />
            {/* Taman Stadion Undip */}
            <polygon
              points="1599.8,821.9 1604.5,832.0 1597.7,835.2 1593.2,825.4 1562.5,839.5 1551.4,815.4 1540.6,792.0 1609.0,760.5 1630.7,807.6 1599.8,821.9"
              fill="#15803D"
              stroke="#86EFAC"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          </g>

          {/* REAL BUILDINGS LAYER: DRAWN FROM REAL OSM POLYGONS */}
          <CampusBuildingsLayer
            selectedFacultyId={selectedFacultyId}
            hoveredFacultyId={hoveredFacultyId}
            onSelectFaculty={onSelectFaculty}
            onHoverFaculty={setHoveredFacultyId}
            zoom={zoom}
          />

          {/* 12 FACULTY CLUSTER LABELS (ONE LABEL AT CLUSTER CENTROID, ZERO OVERLAP) */}
          {campusFacultyLocations.map((loc) => {
            const isSelected = selectedFacultyId === loc.id;
            const isHovered = hoveredFacultyId === loc.id;
            const score = scoreMap.get(loc.id);

            const offsetX = loc.labelOffset?.x || 0;
            const offsetY = loc.labelOffset?.y || 0;
            const shortTitle = loc.shortName;
            const hasScore = !!score;
            const isApprox = loc.source === 'approx';

            const pillWidth = hasScore ? (shortTitle.length > 3 ? 88 : 78) : (shortTitle.length > 3 ? 66 : 54);
            const pillHeight = 24;
            const textX = hasScore ? 28 : 10;
            const counterScale = Math.min(1.4, Math.max(0.9, 1.15 / zoom));

            // Centroid ground position
            const posX = loc.mapPosition.x;
            const posY = loc.mapPosition.y;

            return (
              <g
                key={loc.id}
                id={`marker-${loc.id}`}
                tabIndex={0}
                role="button"
                data-no-drag="true"
                aria-label={`Fakultas ${loc.name} (${loc.shortName}) - Klik untuk melihat profil fakultas`}
                transform={`translate(${posX}, ${posY})`}
                className="cursor-pointer focus:outline-hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectFaculty?.(loc.id);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    onSelectFaculty?.(loc.id);
                  }
                }}
                onMouseEnter={() => setHoveredFacultyId(loc.id)}
                onMouseLeave={() => setHoveredFacultyId(null)}
              >
                {/* Hit area */}
                <circle cx="0" cy="0" r="30" fill="transparent" pointerEvents="all" />

                {/* Pulse ring when selected */}
                {isSelected && (
                  <circle cx="0" cy="0" r="45" fill="#F59E0B" opacity="0.3" className="animate-pulse motion-reduce:animate-none" />
                )}

                {/* Center ground pin marker */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 6 : 4.5}
                  fill={isSelected ? '#F59E0B' : '#FEF3C7'}
                  stroke="#78350F"
                  strokeWidth="2"
                />

                {/* Leader line if label has offset */}
                {(offsetX !== 0 || offsetY !== 0) && (
                  <line
                    x1="0"
                    y1="0"
                    x2={offsetX}
                    y2={18 + offsetY}
                    stroke="#F59E0B"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Label Box */}
                <g
                  transform={`translate(${-pillWidth / 2 + offsetX}, ${18 + offsetY}) scale(${counterScale})`}
                  style={{ transformOrigin: `${pillWidth / 2}px 0px` }}
                >
                  <rect
                    x="0"
                    y="0"
                    width={pillWidth}
                    height={pillHeight}
                    rx="6"
                    fill={isSelected ? '#78350F' : isHovered ? '#2A150D' : '#190E08'}
                    stroke={isSelected ? '#F59E0B' : isHovered ? '#FDE68A' : isApprox ? '#D97706' : '#78350F'}
                    strokeWidth={isSelected ? '2' : '1'}
                    strokeDasharray={isApprox ? '3 2' : undefined}
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
              </g>
            );
          })}

          {/* LANDMARKS LABELS (Decluttered: 8 key landmarks at overview, rest at zoom >= 1.6) */}
          {campusLandmarks.map((lm) => {
            const isOverviewKey = OVERVIEW_KEY_LANDMARKS.has(lm.id);
            const isApprox = lm.source === 'approx';

            // Hide non-key landmarks at overview zoom
            if (zoom < 1.6 && !isOverviewKey) {
              return null;
            }

            const posX = lm.mapPosition.x;
            const posY = lm.mapPosition.y;
            const labelWidth = Math.min(130, lm.name.length * 6.5 + 16);

            return (
              <g
                key={lm.id}
                id={`lm-marker-${lm.id}`}
                transform={`translate(${posX}, ${posY})`}
                className="select-none pointer-events-none"
              >
                {/* Landmark Pin */}
                <circle cx="0" cy="0" r="3.5" fill={isApprox ? '#F59E0B' : '#38BDF8'} stroke="#190E08" strokeWidth="1.5" />

                {/* Landmark Name Box */}
                <g transform={`translate(${-labelWidth / 2}, 10)`}>
                  <rect
                    x="0"
                    y="0"
                    width={labelWidth}
                    height="18"
                    rx="4"
                    fill="#190E08"
                    stroke={isApprox ? '#B45309' : '#0284C7'}
                    strokeWidth="1"
                    strokeDasharray={isApprox ? '3 2' : undefined}
                    opacity="0.9"
                  />
                  <text
                    x={labelWidth / 2}
                    y="12.5"
                    fill={isApprox ? '#FDE68A' : '#BAE6FD'}
                    fontSize="8.5"
                    fontWeight="bold"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    {lm.name.length > 20 ? lm.name.slice(0, 19) + '…' : lm.name}
                  </text>
                </g>
              </g>
            );
          })}

          {/* TREES PLACED STRICTLY WITHIN VERIFIED GREEN POLYGONS */}
          <g id="campus-trees">
            {VERIFIED_GREEN_TREES.map(([tx, ty], i) => (
              <use key={i} href="#pixel-tree" x={tx} y={ty} />
            ))}
          </g>
        </svg>
      </div>

      {/* 4. Mini Legend, North Arrow & Simplified Campus Disclaimer */}
      <div className="absolute bottom-4 left-3 z-10 hidden sm:flex flex-col gap-1.5 bg-[#190E08]/90 backdrop-blur-md p-2.5 rounded-2xl border border-[#78350F] shadow-lg text-[10px] pointer-events-none max-w-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#24130C] px-2 py-0.5 rounded border border-[#78350F] text-[#FDE68A]">
            <span className="font-pixel text-[#F59E0B] text-[9px] font-bold">▲</span>
            <span className="font-pixel text-white text-[9px] font-bold">U</span>
            <span className="font-mono text-[9px] text-amber-200/80 ml-0.5">UTARA</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-amber-100">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> S</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#3B82F6]" /> A</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#F97316]" /> B</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-[#78350F]" /> C</span>
          </div>
        </div>
        <p className="text-[9px] text-amber-200/70 font-mono italic">
          Ilustrasi kampus — posisi bangunan disederhanakan
        </p>
      </div>

      {/* 5. FACULTY CAMPUS TOUR PANEL / BOTTOM SHEET */}
      {selectedFacultyId && (
        <FacultyMapTourSheet
          facultyId={selectedFacultyId}
          onClose={() => onSelectFaculty?.(null)}
          onFocusFaculty={(id) => {
            onSelectFaculty?.(id);
            recalculateCamera();
          }}
          isFocusedOnMap={zoom >= 1.8}
        />
      )}

      {/* Map Attribution Badge */}
      <div className="absolute bottom-2 right-2 z-10 text-[9px] font-mono text-amber-200/70 bg-black/60 px-2 py-0.5 rounded border border-[#78350F]/40 backdrop-blur-xs select-none">
        © OpenStreetMap contributors
      </div>
    </div>
  );
}
