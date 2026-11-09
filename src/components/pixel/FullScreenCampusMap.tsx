'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  campusFacultyLocations,
} from '@/data/campusLocations';
import { FacultyBuildingIllustration } from './PixelFacultyBuildings';
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

export function FullScreenCampusMap({
  selectedFacultyId,
  onSelectFaculty,
  facultyScores = [],
  className = '',
  isForegroundOpen = true,
  isPanelOpen,
}: FullScreenCampusMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize panel open state (supports both isPanelOpen and isForegroundOpen)
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

  // Dynamic Camera Math: Left-offset when panel is open, perfect center when collapsed
  const recalculateCamera = useCallback(() => {
    if (!selectedLocation) {
      // Campus full overview
      setZoom(1);
      setPan({ x: 0, y: 0 });
      return;
    }

    const vw = viewportSize.width;
    const vh = viewportSize.height;

    // Base scale factor from virtual map (2000x1400) to viewport
    const baseScale = Math.max(vw / MAP_WIDTH, vh / MAP_HEIGHT);
    const targetZoom = 2.4;
    const totalScale = baseScale * targetZoom;

    const targetX = selectedLocation.mapPosition.x;
    const targetY = selectedLocation.mapPosition.y;
    const mapCenterX = MAP_WIDTH / 2; // 1000
    const mapCenterY = MAP_HEIGHT / 2; // 700

    const isDesktop = vw >= 640;

    let deltaScreenX = 0;
    let deltaScreenY = 0;

    if (panelOpen) {
      if (isDesktop) {
        // Desktop: Panel is docked on the right side
        // Panel width scales with breakpoints: sm:580px, lg:660px, xl:720px
        let panelWidth = 580;
        if (vw >= 1280) panelWidth = 720;
        else if (vw >= 1024) panelWidth = 660;

        panelWidth = Math.min(panelWidth, vw * 0.55);

        // Target center of unobstructed map area: (vw - panelWidth) / 2
        // Offset from viewport center (vw / 2):
        // (vw - panelWidth) / 2 - vw / 2 = -panelWidth / 2
        deltaScreenX = -panelWidth / 2;
        deltaScreenY = 0;
      } else {
        // Mobile (< 640px): Panel is docked at bottom as a bottom sheet
        const panelHeight = Math.min(vh * 0.52, 420);
        const headerHeight = 60;
        deltaScreenX = 0;
        deltaScreenY = -(panelHeight - headerHeight) / 2;
      }
    } else {
      // Panel is collapsed ("Peta Penuh" mode):
      // Building smoothly glides to the EXACT CENTER of the entire screen!
      deltaScreenX = 0;
      deltaScreenY = 0;
    }

    // Mathematical formula to place map coordinate (targetX, targetY)
    // at screen offset (deltaScreenX, deltaScreenY) relative to viewport center:
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

  // Native wheel zoom listener with { passive: false } to properly allow e.preventDefault()
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY > 0 ? -0.15 : 0.15;
      setZoom((prev) => Math.min(Math.max(0.65, prev + zoomDelta), 3.2));
    };

    container.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', onNativeWheel);
    };
  }, []);

  // Keyboard zoom shortcuts (+ / -)
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
        setZoom((prev) => Math.min(prev + 0.35, 3.2));
      } else if (e.key === '-' || e.key === '_' || e.key === 'Subtract') {
        e.preventDefault();
        setZoom((prev) => Math.max(prev - 0.35, 0.65));
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
      const nextZoom = Math.min(3.2, Math.max(0.65, pinchStartZoomRef.current * ratio));
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

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.35, 3.2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.35, 0.65));
  const handleResetOverview = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    onSelectFaculty?.(null);
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
      {/* 1. TOP-LEFT HUD: VIRTUAL CAMPUS COMPASS & CONTROLS (Positioned cleanly below header toolbar) */}
      <div
        className="absolute left-3 sm:left-4 z-20 flex flex-wrap items-center gap-2 pointer-events-auto"
        style={{ top: 'calc(var(--navbar-h, 56px) + 72px)' }}
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
                16-BIT
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

      {/* 2. BOTTOM HUD: QUICK FACULTY EXPLORATION SELECTOR DOCK WITH EDGE FADES (Shown in Full-Screen Map Mode) */}
      {!panelOpen && (
        <div className="absolute bottom-4 inset-x-3 sm:inset-x-4 z-20 pointer-events-auto max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="relative">
            {/* Left Edge Fade */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#190E08] to-transparent pointer-events-none z-10 rounded-l-2xl" />
            {/* Right Edge Fade */}
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

          {/* WADUK PENDIDIKAN DIPONEGORO (REAL OSM WATER RESERVOIR) */}
          <g id="waduk-pendidikan-undip">
            <polygon
              points="1632.8,625.6 1611.9,527.0 1574.5,540.5 1560.8,547.9 1545.6,550.3 1533.3,549.4 1519.0,552.0 1516.6,556.6 1516.4,562.1 1513.9,567.9 1509.9,571.8 1502.3,571.5 1496.2,570.6 1492.3,579.0 1486.0,592.8 1485.9,600.5 1490.1,629.3 1489.9,657.3 1484.1,675.8 1482.4,684.5 1473.0,687.4 1446.9,691.8 1455.0,697.1 1467.8,705.5 1488.0,715.2 1500.7,717.6 1534.8,715.0 1535.7,716.1 1554.4,702.8 1570.7,681.1 1565.8,659.4 1578.0,638.7 1632.8,625.6"
              fill="#0284C7"
              stroke="#0369A1"
              strokeWidth="4"
              opacity="0.85"
            />
            <rect x="1465" y="605" width="145" height="18" fill="#190E08" rx="4" stroke="#0284C7" strokeWidth="1" />
            <text x="1537" y="618" fill="#BAE6FD" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
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
            {/* Lapangan Basket GKB FT */}
            <polygon
              points="933.6,428.2 950.3,436.6 937.4,463.1 920.3,454.3 933.6,428.2"
              fill="#B45309"
              stroke="#F59E0B"
              strokeWidth="1.5"
            />
            {/* Lapangan Futsal & Stadion Area */}
            <polygon
              points="1599.8,821.9 1604.5,832.0 1597.7,835.2 1593.2,825.4 1562.5,839.5 1551.4,815.4 1540.6,792.0 1609.0,760.5 1630.7,807.6 1599.8,821.9"
              fill="#15803D"
              stroke="#86EFAC"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
          </g>

          {/* PEDESTRIAN PLAZAS & LAPANGAN WIDYA PURAYA */}
          <rect x="910" y="420" width="180" height="120" fill="url(#fullCampusPaving)" stroke="#78350F" strokeWidth="2" rx="4" />
          <circle cx="1000" cy="480" r="38" fill="#166534" stroke="#14532D" strokeWidth="3" />

          {/* 1. PINTU GERBANG UTAMA TEMBALANG */}
          <g id="gerbang-tembalang" transform="translate(885, 235)">
            <rect x="20" y="30" width="18" height="40" fill="#78350F" />
            <rect x="102" y="30" width="18" height="40" fill="#78350F" />
            <polygon points="10,30 70,10 130,30" fill="#B45309" />
            <rect x="38" y="24" width="64" height="6" fill="#F59E0B" />
            <text x="70" y="84" fill="#FDE68A" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Gerbang Utama Tembalang
            </text>
          </g>

          {/* 2. UPT LABORATORIUM TERPADU */}
          <g id="landmark-upt-lab" transform="translate(820, 290)">
            <rect x="10" y="15" width="105" height="32" fill="#1E293B" stroke="#0284C7" strokeWidth="2" rx="4" />
            <rect x="15" y="19" width="24" height="10" fill="#38BDF8" opacity="0.8" />
            <rect x="45" y="19" width="24" height="10" fill="#38BDF8" opacity="0.8" />
            <rect x="10" y="50" width="105" height="16" fill="#190E08" rx="4" stroke="#78350F" strokeWidth="1" />
            <text x="62" y="62" fill="#93C5FD" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              UPT Lab Terpadu
            </text>
          </g>

          {/* 3. GEDUNG PMB & TREK JOGGING LAMA */}
          <g id="landmark-pmb" transform="translate(940, 290)">
            <ellipse cx="55" cy="24" rx="45" ry="18" fill="none" stroke="#DC2626" strokeWidth="4" strokeDasharray="5 3" />
            <rect x="20" y="12" width="70" height="24" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" rx="3" />
            <rect x="12" y="46" width="86" height="16" fill="#190E08" rx="4" stroke="#78350F" strokeWidth="1" />
            <text x="55" y="58" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              PMB & Jogging Track
            </text>
          </g>

          {/* 4. GSG PROF. SOEDARTO */}
          <g id="landmark-gsg" transform="translate(800, 395)">
            <polygon points="35,28 85,5 135,28" fill="#78350F" />
            <polygon points="15,48 85,22 155,48" fill="#9A3412" />
            <rect x="25" y="48" width="120" height="30" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" rx="2" />
            <rect x="15" y="82" width="140" height="18" fill="#190E08" rx="4" stroke="#F59E0B" strokeWidth="1" />
            <text x="85" y="95" fill="#FDE68A" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              GSG Prof. Soedarto
            </text>
          </g>

          {/* 5. BUNDARAN PERTAMA */}
          <g id="bundaran-pertama" transform="translate(905, 513)">
            <circle cx="40" cy="40" r="28" fill="#15803D" stroke="#166534" strokeWidth="3" />
            <circle cx="40" cy="40" r="14" fill="#FDE68A" opacity="0.8" />
            <text x="40" y="78" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Bundaran Pertama
            </text>
          </g>

          {/* 6. ART CENTRE UNDIP */}
          <g id="landmark-art-centre" transform="translate(820, 560)">
            <polygon points="10,24 45,8 80,24" fill="#9A3412" />
            <rect x="15" y="24" width="60" height="22" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" rx="2" />
            <rect x="5" y="50" width="80" height="16" fill="#190E08" rx="4" stroke="#78350F" strokeWidth="1" />
            <text x="45" y="62" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Art Centre Undip
            </text>
          </g>

          {/* 7. STUDENT CENTRE & MENARA UNDIP TOWER */}
          <g id="landmark-sc-tower" transform="translate(730, 640)">
            {/* UNDIP Tower high-rise */}
            <rect x="65" y="5" width="38" height="65" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" rx="2" />
            <rect x="70" y="10" width="28" height="8" fill="#38BDF8" opacity="0.75" />
            <rect x="70" y="22" width="28" height="8" fill="#38BDF8" opacity="0.75" />
            <rect x="70" y="34" width="28" height="8" fill="#38BDF8" opacity="0.75" />
            {/* Student Centre */}
            <rect x="10" y="32" width="50" height="38" fill="#451A03" stroke="#F59E0B" strokeWidth="1.5" rx="3" />
            <polygon points="10,32 35,18 60,32" fill="#D97706" />
            <rect x="5" y="74" width="105" height="16" fill="#190E08" rx="4" stroke="#78350F" strokeWidth="1" />
            <text x="57" y="86" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              SC & Menara Undip
            </text>
          </g>

          {/* 8. TAMAN INSPIRASI */}
          <g id="landmark-taman-inspirasi" transform="translate(880, 630)">
            <ellipse cx="45" cy="24" rx="35" ry="16" fill="#15803D" stroke="#166534" strokeWidth="2" />
            <rect x="35" y="14" width="20" height="10" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" />
            <text x="45" y="48" fill="#86EFAC" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Taman Inspirasi
            </text>
          </g>

          {/* 9. BUNDARAN PATUNG KUDA PANGERAN DIPONEGORO (WIDYA PURAYA) */}
          <g id="bundaran-kuda" transform="translate(975, 455)">
            <rect x="20" y="42" width="16" height="10" fill="#E2E8F0" />
            <path d="M 26 28 L 34 22 L 32 32 L 36 38 L 24 40 L 21 34 Z" fill="#FFFFFF" />
            <circle cx="29" cy="20" r="2.5" fill="#FFFFFF" />
            <text x="28" y="60" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Patung Kuda Undip
            </text>
          </g>

          {/* 10. GEDUNG REKTORAT (WIDYA PURAYA) */}
          <g
            id="landmark-rektorat"
            transform="translate(910, 410)"
            className="cursor-pointer"
            onClick={() => onSelectFaculty?.(null)}
          >
            <FacultyBuildingIllustration facultyId="rektorat" />
            <rect x="20" y="105" width="160" height="22" fill="#190E08" rx="6" stroke="#F59E0B" strokeWidth="1" />
            <text x="100" y="120" fill="#FDE68A" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Gedung Rektorat (Widya Puraya)
            </text>
          </g>

          {/* 11. GEDUNG TEKNIK GEOLOGI */}
          <g id="landmark-geologi" transform="translate(968, 619)">
            <rect x="10" y="10" width="75" height="26" fill="#78350F" stroke="#F59E0B" strokeWidth="1" rx="4" />
            <text x="47" y="26" fill="#FEF3C7" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Teknik Geologi
            </text>
          </g>

          {/* 12. TEKNIK ELEKTRO */}
          <g id="landmark-elektro" transform="translate(975, 700)">
            <rect x="10" y="10" width="90" height="30" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" rx="4" />
            <polygon points="45,10 55,-3 65,10" fill="#3B82F6" />
            <text x="55" y="26" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Teknik Elektro
            </text>
          </g>

          {/* 13. KOMPLEKS ARSITEKTUR, TEKNIK SIPIL, & PWK */}
          <g id="landmark-sipil-arsitektur-pwk" transform="translate(840, 790)">
            <rect x="10" y="10" width="125" height="35" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" rx="4" />
            <polygon points="10,10 72,-3 135,10" fill="#475569" />
            <rect x="10" y="48" width="125" height="16" fill="#190E08" rx="4" stroke="#78350F" strokeWidth="1" />
            <text x="72" y="60" fill="#94A3B8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Arsitektur • Sipil • PWK
            </text>
          </g>

          {/* 14. TEKNIK KOMPUTER, GEODESI, & PERKAPALAN */}
          <g id="landmark-komputer-geodesi" transform="translate(980, 750)">
            <rect x="10" y="10" width="105" height="32" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" rx="4" />
            <text x="62" y="24" fill="#38BDF8" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Teknik Komputer
            </text>
            <text x="62" y="36" fill="#94A3B8" fontSize="7.5" textAnchor="middle" fontFamily="monospace">
              Geodesi • Perkapalan
            </text>
          </g>

          {/* 15. PERTIGAAN TIGA ARAH TIMUR */}
          <g id="pertigaan-timur" transform="translate(1068, 516)">
            <circle cx="20" cy="20" r="13" fill="#78350F" stroke="#F59E0B" strokeWidth="2" />
            <text x="20" y="42" fill="#FDE68A" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Pertigaan Timur
            </text>
          </g>

          {/* 16. KOMPLEKS MESIN, INDUSTRI, LINGKUNGAN, & KIMIA */}
          <g id="landmark-mesin-industri-kimia" transform="translate(910, 910)">
            <rect x="10" y="10" width="125" height="36" fill="#334155" stroke="#94A3B8" strokeWidth="1" rx="4" />
            <text x="72" y="26" fill="#FEF3C7" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Mesin • Industri
            </text>
            <text x="72" y="39" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">
              Lingkungan • Kimia
            </text>
          </g>

          {/* 17. RUMAH SAKIT NASIONAL DIPONEGORO (RSND) */}
          <g id="landmark-rsnd" transform="translate(1600, 630)">
            <rect x="10" y="15" width="115" height="46" fill="#F8FAFC" stroke="#047857" strokeWidth="2.5" rx="6" />
            <rect x="55" y="22" width="22" height="22" fill="#047857" rx="3" />
            <polygon points="64,25 68,25 68,41 64,41" fill="#FFFFFF" />
            <polygon points="58,31 74,31 74,35 58,35" fill="#FFFFFF" />
            <rect x="5" y="66" width="125" height="17" fill="#190E08" rx="5" stroke="#047857" strokeWidth="1" />
            <text x="67" y="79" fill="#A7F3D0" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Kompleks RSND Undip
            </text>
          </g>

          {/* 12 VERIFIED FACULTY SITES (Normal Map Markers) */}
          {campusFacultyLocations.map((loc) => {
            const isSelected = selectedFacultyId === loc.id;
            const isHovered = hoveredFacultyId === loc.id;
            const score = scoreMap.get(loc.id);

            const posX = loc.mapPosition.x - 90;
            const posY = loc.mapPosition.y - 60;

            // When this faculty is selected in zoom mode, we render the large hero illustration below instead
            if (isSelected && zoom >= 2.0) {
              return null;
            }

            return (
              <g
                key={loc.id}
                id={`marker-${loc.id}`}
                tabIndex={0}
                role="button"
                data-no-drag="true"
                aria-label={`Fakultas ${loc.name} (${loc.shortName}) - Tekan Enter untuk membuka daftar program studi`}
                transform={`translate(${posX}, ${posY})`}
                className="cursor-pointer transition-transform duration-300 focus:outline-hidden"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  hasMovedRef.current = false;
                }}
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
                {/* Transparent Hit Area for Touch & Mouse precision */}
                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="140"
                  fill="transparent"
                  pointerEvents="all"
                  className="cursor-pointer"
                />

                {isSelected && (
                  <circle cx="90" cy="60" r="95" fill="#F59E0B" opacity="0.25" className="animate-pulse motion-reduce:animate-none" />
                )}

                <FacultyBuildingIllustration facultyId={loc.id} isHighlighted={isSelected || isHovered} mode="overview" />

                {/* Ground Marker Label: badge first, compact width, counter-scaled on phones */}
                {(() => {
                  const offsetX = loc.labelOffset?.x || 0;
                  const offsetY = loc.labelOffset?.y || 0;
                  const shortTitle = loc.shortName;
                  const hasScore = !!score;
                  const textX = hasScore ? 28 : 10;
                  const pillWidth = hasScore ? (shortTitle.length > 3 ? 88 : 78) : (shortTitle.length > 3 ? 66 : 54);
                  const pillHeight = 24;
                  const counterScale = Math.min(1.6, Math.max(1, 1.25 / zoom));

                  return (
                    <g
                      transform={`translate(${10 + offsetX}, ${105 + offsetY}) scale(${counterScale})`}
                      style={{ transformOrigin: '0 0' }}
                    >
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

          {/* ============================================================== */}
          {/* REQUIREMENT 5: ZOOMED-IN HERO BUILDING VISUALIZATION           */}
          {/* Prominent, large, highly-detailed 16-bit building illustration */}
          {/* ============================================================== */}
          {selectedLocation && zoom >= 2.0 && (
            <g
              id={`hero-${selectedLocation.id}`}
              transform={`translate(${selectedLocation.mapPosition.x - 230}, ${selectedLocation.mapPosition.y - 170})`}
              className="transition-all duration-500 ease-out animate-fade-in"
            >
              {/* Highlight Aura */}
              <circle cx="230" cy="150" r="190" fill="#F59E0B" opacity="0.12" className="animate-pulse motion-reduce:animate-none" />

              {/* The Majestic 16-Bit Hero Building Recreation */}
              <foreignObject x="0" y="0" width="460" height="300">
                <FacultyBuildingIllustration facultyId={selectedLocation.id} mode="hero" isHighlighted />
              </foreignObject>
            </g>
          )}

          {/* CAMPUS TREES & FORESTRY (Optimized via SVG <use>) */}
          <g id="campus-trees">
            {[
              [520, 240], [580, 260], [640, 220], [860, 240], [920, 200],
              [340, 520], [320, 600], [330, 780], [380, 880], [420, 1000],
              [780, 780], [840, 820], [740, 920], [780, 1020], [860, 1140],
              [1100, 420], [1160, 360], [1480, 340], [1520, 460], [1620, 640],
              [1480, 760], [1560, 860], [1400, 980], [1300, 1080], [1160, 1180],
            ].map(([tx, ty], i) => (
              <use key={i} href="#pixel-tree" x={tx} y={ty} />
            ))}
          </g>
        </svg>
      </div>

      {/* 4. Mini Legend, North Arrow & Simplified Campus Disclaimer */}
      <div className="absolute bottom-4 left-3 z-10 hidden sm:flex flex-col gap-1.5 bg-[#190E08]/90 backdrop-blur-md p-2.5 rounded-2xl border border-[#78350F] shadow-lg text-[10px] pointer-events-none max-w-xs">
        <div className="flex items-center gap-3">
          {/* North Arrow */}
          <div className="flex items-center gap-1 bg-[#24130C] px-2 py-0.5 rounded border border-[#78350F] text-[#FDE68A]">
            <span className="font-pixel text-[#F59E0B] text-[9px] font-bold">▲</span>
            <span className="font-pixel text-white text-[9px] font-bold">U</span>
            <span className="font-mono text-[9px] text-amber-200/80 ml-0.5">UTARA</span>
          </div>
          {/* Tier Legend */}
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

      {/* 4. FACULTY CAMPUS TOUR PANEL / BOTTOM SHEET (Prompt G Round 9) */}
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
