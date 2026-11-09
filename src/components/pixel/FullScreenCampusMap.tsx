'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
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
  X,
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
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
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
    if ((e.target as HTMLElement)?.closest('button, a, input, select, textarea, [data-no-drag]')) return;
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

          {/* CONTINUOUS CAMPUS ROAD NETWORK */}
          <CampusRoadNetwork />

          {/* PEDESTRIAN PLAZAS & LAPANGAN WIDYA PURAYA */}
          <rect x="860" y="500" width="240" height="160" fill="url(#fullCampusPaving)" stroke="#78350F" strokeWidth="3" />
          <circle cx="980" cy="580" r="55" fill="#166534" stroke="#14532D" strokeWidth="4" />
          <circle cx="800" cy="340" r="42" fill="#166534" stroke="#14532D" strokeWidth="3" />

          {/* 1. PINTU GERBANG UTAMA TEMBALANG */}
          <g id="gerbang-tembalang" transform="translate(730, 20)">
            <rect x="20" y="30" width="18" height="50" fill="#78350F" />
            <rect x="102" y="30" width="18" height="50" fill="#78350F" />
            <polygon points="10,30 70,10 130,30" fill="#B45309" />
            <rect x="38" y="24" width="64" height="6" fill="#F59E0B" />
            <text x="70" y="94" fill="#FDE68A" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Gerbang Utama Tembalang
            </text>
          </g>

          {/* 2. UPT LABORATORIUM TERPADU (Right of Entrance) */}
          <g id="landmark-upt-lab" transform="translate(560, 60)">
            <rect x="10" y="15" width="120" height="40" fill="#1E293B" stroke="#0284C7" strokeWidth="2" rx="4" />
            <rect x="20" y="20" width="30" height="12" fill="#38BDF8" opacity="0.8" />
            <rect x="60" y="20" width="30" height="12" fill="#38BDF8" opacity="0.8" />
            <rect x="15" y="60" width="110" height="18" fill="#190E08" rx="4" stroke="#78350F" strokeWidth="1" />
            <text x="70" y="73" fill="#93C5FD" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              UPT Lab Terpadu
            </text>
          </g>

          {/* 3. GEDUNG PMB & TREK JOGGING LAMA (Left of Entrance) */}
          <g id="landmark-pmb" transform="translate(970, 60)">
            <ellipse cx="65" cy="30" rx="55" ry="24" fill="none" stroke="#DC2626" strokeWidth="6" strokeDasharray="6 3" />
            <rect x="25" y="15" width="80" height="30" fill="#FEF3C7" stroke="#B45309" strokeWidth="2" rx="4" />
            <rect x="15" y="58" width="100" height="18" fill="#190E08" rx="4" stroke="#78350F" strokeWidth="1" />
            <text x="65" y="71" fill="#FDE68A" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              PMB & Jogging Track
            </text>
          </g>

          {/* 4. STUDENT CENTRE & MENARA UNDIP TOWER */}
          <g id="landmark-sc-tower" transform="translate(1160, 70)">
            {/* UNDIP Tower high-rise */}
            <rect x="70" y="5" width="40" height="70" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" rx="2" />
            <rect x="75" y="10" width="30" height="8" fill="#38BDF8" opacity="0.75" />
            <rect x="75" y="24" width="30" height="8" fill="#38BDF8" opacity="0.75" />
            <rect x="75" y="38" width="30" height="8" fill="#38BDF8" opacity="0.75" />
            {/* Student Centre */}
            <rect x="10" y="35" width="55" height="40" fill="#451A03" stroke="#F59E0B" strokeWidth="2" rx="4" />
            <polygon points="10,35 37,20 65,35" fill="#D97706" />
            <rect x="5" y="80" width="115" height="18" fill="#190E08" rx="4" stroke="#78350F" strokeWidth="1" />
            <text x="62" y="93" fill="#FDE68A" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              SC & Menara Undip
            </text>
          </g>

          {/* 5. GEDUNG TEKNIK GEOLOGI */}
          <g id="landmark-geologi" transform="translate(660, 210)">
            <rect x="10" y="10" width="80" height="30" fill="#78350F" stroke="#F59E0B" strokeWidth="1" rx="4" />
            <text x="50" y="28" fill="#FEF3C7" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Teknik Geologi
            </text>
          </g>

          {/* 6. BUNDARAN PERTAMA */}
          <g id="bundaran-pertama" transform="translate(760, 300)">
            <circle cx="40" cy="40" r="30" fill="#15803D" stroke="#166534" strokeWidth="3" />
            <circle cx="40" cy="40" r="14" fill="#FDE68A" opacity="0.8" />
            <text x="40" y="78" fill="#FDE68A" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Bundaran Pertama
            </text>
          </g>

          {/* 7. GSG PROF. SOEDARTO */}
          <g id="landmark-gsg" transform="translate(500, 280)">
            <polygon points="40,35 100,5 160,35" fill="#78350F" />
            <polygon points="20,60 100,28 180,60" fill="#9A3412" />
            <rect x="30" y="60" width="140" height="35" fill="#FEF3C7" />
            <text x="100" y="110" fill="#FDE68A" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              GSG Prof. Soedarto
            </text>
          </g>

          {/* 8. KOMPLEKS ARSITEKTUR, TEKNIK SIPIL, & PWK */}
          <g id="landmark-sipil-arsitektur-pwk" transform="translate(1100, 190)">
            <rect x="10" y="10" width="130" height="40" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" rx="4" />
            <polygon points="10,10 75,-5 140,10" fill="#475569" />
            <rect x="10" y="55" width="130" height="18" fill="#190E08" rx="4" stroke="#78350F" strokeWidth="1" />
            <text x="75" y="68" fill="#94A3B8" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Arsitektur • Sipil • PWK
            </text>
          </g>

          {/* 9. TEKNIK KOMPUTER, GEODESI, & PERKAPALAN */}
          <g id="landmark-komputer-geodesi" transform="translate(910, 310)">
            <rect x="10" y="10" width="110" height="35" fill="#0F172A" stroke="#38BDF8" strokeWidth="1" rx="4" />
            <text x="65" y="26" fill="#38BDF8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Teknik Komputer
            </text>
            <text x="65" y="38" fill="#94A3B8" fontSize="8" textAnchor="middle" fontFamily="monospace">
              Geodesi • Perkapalan
            </text>
          </g>

          {/* 10. TAMAN INSPIRASI */}
          <g id="landmark-taman-inspirasi" transform="translate(660, 560)">
            <ellipse cx="45" cy="30" rx="35" ry="20" fill="#15803D" stroke="#166534" strokeWidth="2" />
            <rect x="35" y="18" width="20" height="12" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" />
            <text x="45" y="58" fill="#86EFAC" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Taman Inspirasi
            </text>
          </g>

          {/* 11. BUNDARAN PATUNG KUDA PANGERAN DIPONEGORO (WIDYA PURAYA) */}
          <g id="bundaran-kuda" transform="translate(945, 545)">
            <rect x="25" y="45" width="20" height="12" fill="#E2E8F0" />
            <path d="M 32 30 L 42 22 L 40 35 L 45 42 L 30 45 L 26 38 Z" fill="#FFFFFF" />
            <circle cx="36" cy="20" r="3" fill="#FFFFFF" />
            <text x="35" y="68" fill="#FDE68A" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Patung Kuda Undip
            </text>
          </g>

          {/* 12. GEDUNG REKTORAT (WIDYA PURAYA) */}
          <g
            id="landmark-rektorat"
            transform="translate(890, 410)"
            className="cursor-pointer"
            onClick={() => onSelectFaculty?.(null)}
          >
            <FacultyBuildingIllustration facultyId="rektorat" />
            <rect x="20" y="105" width="160" height="22" fill="#190E08" rx="6" stroke="#F59E0B" strokeWidth="1" />
            <text x="100" y="120" fill="#FDE68A" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Gedung Rektorat (Widya Puraya)
            </text>
          </g>

          {/* 13. ART CENTRE UNDIP */}
          <g id="landmark-art-centre" transform="translate(1260, 340)">
            <polygon points="10,30 50,10 90,30" fill="#9A3412" />
            <rect x="15" y="30" width="70" height="25" fill="#FEF3C7" stroke="#78350F" strokeWidth="1" rx="2" />
            <text x="50" y="68" fill="#FDE68A" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Art Centre Undip
            </text>
          </g>

          {/* 14. TEKNIK ELEKTRO */}
          <g id="landmark-elektro" transform="translate(800, 660)">
            <rect x="10" y="10" width="100" height="35" fill="#1E293B" stroke="#F59E0B" strokeWidth="1" rx="4" />
            <polygon points="50,10 60,-5 70,10" fill="#3B82F6" />
            <text x="60" y="28" fill="#FDE68A" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Teknik Elektro
            </text>
          </g>

          {/* 15. PERTIGAAN TIGA ARAH TIMUR */}
          <g id="pertigaan-timur" transform="translate(1040, 770)">
            <circle cx="20" cy="20" r="14" fill="#78350F" stroke="#F59E0B" strokeWidth="2" />
            <text x="20" y="44" fill="#FDE68A" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Pertigaan Timur
            </text>
          </g>

          {/* 16. KOMPLEKS MESIN, INDUSTRI, LINGKUNGAN, & KIMIA */}
          <g id="landmark-mesin-industri-kimia" transform="translate(540, 940)">
            <rect x="10" y="10" width="130" height="40" fill="#334155" stroke="#94A3B8" strokeWidth="1" rx="4" />
            <text x="75" y="28" fill="#FEF3C7" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
              Mesin • Industri
            </text>
            <text x="75" y="42" fill="#94A3B8" fontSize="9" textAnchor="middle" fontFamily="monospace">
              Lingkungan • Kimia
            </text>
          </g>

          {/* 17. RUMAH SAKIT NASIONAL DIPONEGORO (RSND) */}
          <g id="landmark-rsnd" transform="translate(1420, 1060)">
            <rect x="10" y="15" width="120" height="50" fill="#F8FAFC" stroke="#047857" strokeWidth="3" rx="6" />
            <rect x="58" y="22" width="24" height="24" fill="#047857" rx="3" />
            <polygon points="68,26 72,26 72,42 68,42" fill="#FFFFFF" />
            <polygon points="62,32 78,32 78,36 62,36" fill="#FFFFFF" />
            <rect x="5" y="72" width="130" height="18" fill="#190E08" rx="6" stroke="#047857" strokeWidth="1" />
            <text x="70" y="85" fill="#A7F3D0" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
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
                transform={`translate(${posX}, ${posY})`}
                className="cursor-pointer transition-transform duration-300"
                onClick={() => {
                  if (hasMovedRef.current) return;
                  onSelectFaculty?.(loc.id);
                }}
                onMouseEnter={() => setHoveredFacultyId(loc.id)}
                onMouseLeave={() => setHoveredFacultyId(null)}
              >
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

      {/* 4. FLOATING ARCHITECTURAL DETAILS CARD (IN FOCUS MODE) */}
      {selectedLocation && (
        <div className="absolute top-16 left-3 right-3 sm:right-auto sm:top-auto sm:bottom-6 sm:left-4 max-w-sm sm:w-84 z-20 bg-[#24130C]/95 backdrop-blur-md p-3.5 sm:p-5 rounded-3xl border-2 border-[#F59E0B] shadow-[0_8px_30px_rgba(0,0,0,0.7)] text-white pointer-events-auto animate-fade-in">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[8px] sm:text-[9px] bg-[#78350F] text-[#FDE68A] px-2.5 py-0.5 rounded-full border border-[#F59E0B]">
                  {selectedLocation.zone}
                </span>
                <span className="text-[10px] text-amber-200/70 font-mono">
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
              className="p-2.5 rounded-xl text-amber-200 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Kembali ke Tinjauan Peta"
              aria-label="Kembali ke Tinjauan Peta"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-[#78350F]/70 space-y-1.5 text-xs text-amber-100/95">
            <p className="leading-relaxed">
              <strong className="text-[#FDE68A]">Karakter Arsitektur:</strong>{' '}
              {selectedLocation.architecturalStyle.facadeDescription}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {selectedLocation.architecturalStyle.distinctiveFeatures.map((feat, i) => (
                <span
                  key={i}
                  className="text-xs bg-[#190E08] text-amber-200 px-2.5 py-1 rounded-md border border-[#78350F]/60"
                >
                  • {feat}
                </span>
              ))}
            </div>
            <div className="pt-2 text-xs text-amber-200/80 flex items-center justify-between">
              <span>Sumber: {selectedLocation.referenceSource}</span>
              <span>Pembaruan: {selectedLocation.verificationDate}</span>
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
