'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { retroAudio } from '@/lib/retroAudio';
import { PixelButton } from './PixelUiComponents';
import {
  ArrowRight,
  ChevronDown,
  Layers,
  Wrench,
  Activity,
  Binary,
  BarChart3,
  Scale,
  Anchor,
  BookOpen,
} from 'lucide-react';

const ACADEMIC_DOMAINS = [
  {
    id: 'engineering',
    name: 'Rekayasa & Teknologi',
    faculty: 'Fakultas Teknik & Sekolah Vokasi',
    Icon: Wrench,
    description:
      'Perancangan infrastruktur fisik, rekayasa sipil, sistem mesin modern, elektro, arsitektur, dan sistem industri terapan.',
    majors: ['Teknik Sipil', 'Teknik Mesin', 'Teknik Kimia', 'Teknik Elektro', 'Arsitektur', 'TISPA (D4)'],
  },
  {
    id: 'health',
    name: 'Kesehatan & Medis',
    faculty: 'Fakultas Kedokteran & FKM',
    Icon: Activity,
    description:
      'Ilmu diagnosis biologis manusia, penatalaksanaan klinis, terapi gizi, kedokteran gigi, farmasi, dan kesehatan masyarakat.',
    majors: ['Kedokteran', 'Keperawatan', 'Gizi', 'Kedokteran Gigi', 'Farmasi', 'Kesehatan Masyarakat'],
  },
  {
    id: 'science-data',
    name: 'Sains Eksakta & Komputasi',
    faculty: 'Fakultas Sains dan Matematika',
    Icon: Binary,
    description:
      'Eksplorasi hukum fundamental alam, matematika murni, sains aktuaria, kecerdasan artifisial, dan rekayasa perangkat lunak.',
    majors: ['Informatika', 'Sistem Informasi', 'Statistika', 'Bioteknologi', 'Matematika', 'Fisika'],
  },
  {
    id: 'economics',
    name: 'Ekonomi & Bisnis',
    faculty: 'Fakultas Ekonomika dan Bisnis',
    Icon: BarChart3,
    description:
      'Tata kelola pasar modal, model bisnis rintisan (startup), audit kepatuhan keuangan, dan strategi moneter makroekonomi.',
    majors: ['Manajemen', 'Akuntansi', 'Ekonomi', 'Bisnis Digital', 'Ekonomi Islam', 'Akuntansi Pajak (D4)'],
  },
  {
    id: 'law-social',
    name: 'Hukum & Sosial Humaniora',
    faculty: 'Fakultas Hukum & FISIP',
    Icon: Scale,
    description:
      'Yurisprudensi hukum perdata/pidana, diplomasi hubungan internasional, komunikasi media digital, dan kebijakan publik.',
    majors: ['Hukum', 'Ilmu Komunikasi', 'Hubungan Internasional', 'Administrasi Publik', 'Ilmu Pemerintahan'],
  },
  {
    id: 'maritime-agriculture',
    name: 'Kelautan & Agrikultur',
    faculty: 'FPP & FPIK UNDIP',
    Icon: Anchor,
    description:
      'Pemanfaatan hayati pesisir tropis tropis, oseanografi samudra, agribisnis berkelanjutan, dan ketahanan pangan nasional.',
    majors: ['Ilmu Kelautan', 'Oseanografi', 'Akuakultur', 'Agribisnis', 'Peternakan', 'Teknologi Pangan'],
  },
  {
    id: 'humanities',
    name: 'Humaniora & Psikologi',
    faculty: 'Fakultas Ilmu Budaya & Psikologi',
    Icon: BookOpen,
    description:
      'Dinamika kejiwaan manusia, linguistik komparatif bahasa asing, kearsipan informasi digital, dan antropologi budaya nusantara.',
    majors: ['Psikologi', 'Sastra Inggris', 'Sastra Jepang', 'Antropologi Sosial', 'Ilmu Perpustakaan'],
  },
];

interface PixelRectorateSceneProps {
  onReturnToHorse?: () => void;
}

export function PixelRectorateScene({ onReturnToHorse }: PixelRectorateSceneProps) {
  const [activeDomainTab, setActiveDomainTab] = useState(0);
  const [showDomainExplorer, setShowDomainExplorer] = useState(false);

  // Dynamic Camera Zoom state for the Rectorate background:
  // Zooms smoothly from 1.35x (closer shot at bottom boundary near horse statue)
  // to 1.0x (maximum zoom-out full vista) as user reaches the Beranda homepage.
  const [cameraZoom, setCameraZoom] = useState(1.0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // When container is visible, calculate relative scroll position
      // Top of container near 0 => full vista (1.0x)
      // Bottom of container near viewport center => entering from horse statue (1.35x)
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const progress = Math.min(1, Math.max(0, rect.bottom / (windowHeight + rect.height * 0.5)));
        const zoom = 1.0 + (progress > 0.6 ? (progress - 0.6) * 0.85 : 0);
        setCameraZoom(Math.min(1.35, Math.max(1.0, zoom)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      ref={containerRef}
      id="beranda"
      className="relative w-full min-h-[95vh] sm:min-h-screen bg-[#1F130E] text-slate-100 flex flex-col justify-between overflow-hidden select-none border-b-4 border-[#78350F] scroll-mt-14"
      aria-label="Scene Gedung Rektorat UNDIP - Beranda Utama"
    >
      {/* ============================================================== */}
      {/* 1. PERMANENT BACKGROUND LAYER: GEDUNG REKTORAT UNDIP */}
      {/* (Authentic white walls, reddish-brown tile roof, golden-hour sunset) */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-out"
          style={{
            transform: `scale(${cameraZoom})`,
            transformOrigin: '50% 65%',
          }}
        >
          <svg
            viewBox="0 0 1200 560"
            className="w-full h-full object-cover"
            style={{ shapeRendering: 'crispEdges' }}
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Reddish-Brown Terracotta Roof Tile Texture */}
              <pattern id="rec-roof-tile" width="8" height="6" patternUnits="userSpaceOnUse">
                <rect width="8" height="6" fill="#7C2D12" />
                <rect x="0" y="0" width="7" height="3" fill="#9A3412" />
                <rect x="0" y="3" width="4" height="3" fill="#B45309" />
                <rect x="4" y="3" width="4" height="3" fill="#C2410C" />
              </pattern>

              {/* Rektorat Dark Sunset Glass Windows Texture */}
              <pattern id="rec-glass-sunset" width="16" height="12" patternUnits="userSpaceOnUse">
                <rect width="16" height="12" fill="#2A160E" />
                <rect x="0" y="0" width="15" height="11" fill="#451A03" />
                <rect x="0" y="0" width="14" height="3" fill="#F59E0B" opacity="0.6" />
                <rect x="0" y="3" width="7" height="6" fill="#D97706" opacity="0.4" />
              </pattern>

              {/* Ceremonial Plaza Warm Sand Pavers */}
              <pattern id="rec-plaza-sand" width="8" height="8" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill="#5E4E42" />
                <rect x="0" y="0" width="7" height="7" fill="#7D6B5C" />
                <rect x="0" y="0" width="3" height="3" fill="#9C8977" />
              </pattern>
            </defs>

            {/* --- A. COHESIVE GOLDEN-HOUR SUNSET SKY --- */}
            <rect x="0" y="0" width="1200" height="40" fill="#3F1D2C" />
            <rect x="0" y="40" width="1200" height="40" fill="#5C2323" />
            <rect x="0" y="80" width="1200" height="45" fill="#832B13" />
            <rect x="0" y="125" width="1200" height="45" fill="#B44310" />
            <rect x="0" y="170" width="1200" height="45" fill="#D97706" />
            <rect x="0" y="215" width="1200" height="40" fill="#F59E0B" />
            <rect x="0" y="255" width="1200" height="30" fill="#FDE68A" />

            {/* Radiant Setting Sun in Upper Sky */}
            <g>
              <rect x="550" y="35" width="100" height="100" fill="#FEF08A" opacity="0.75" />
              <rect x="565" y="20" width="70" height="130" fill="#FDE047" opacity="0.85" />
              <rect x="580" y="10" width="40" height="150" fill="#FFFFFF" />
              {/* Soft Sunset Rays */}
              <polygon points="600,80 400,0 480,0" fill="#FEF08A" opacity="0.18" />
              <polygon points="600,80 720,0 800,0" fill="#FEF08A" opacity="0.18" />
            </g>

            {/* Pixel Sunset Clouds */}
            <g fill="#FFFBEB" opacity="0.85">
              <rect x="80" y="60" width="160" height="20" fill="#FDE68A" />
              <rect x="110" y="50" width="100" height="10" fill="#FEF3C7" />
              <rect x="900" y="70" width="180" height="22" fill="#FDE68A" />
              <rect x="940" y="60" width="110" height="10" fill="#FEF3C7" />
            </g>

            {/* Distant Hills of Tembalang (Mount Ungaran Profile) */}
            <polygon points="0,270 200,200 450,240 600,190 850,245 1050,195 1200,225 1200,290 0,290" fill="#7C2D12" opacity="0.6" />
            <polygon points="0,280 180,240 380,265 600,225 800,260 1020,220 1200,250 1200,300 0,300" fill="#58672D" />

            {/* Background Campus Canopy (Golden-Hour Olive Greens) */}
            <g fill="#37431F">
              {Array.from({ length: 42 }).map((_, i) => (
                <rect
                  key={`rec-canopy-${i}`}
                  x={i * 30 - 15}
                  y={250 + (i % 3) * 5}
                  width="28"
                  height="35"
                  fill={i % 2 === 0 ? '#4D5E29' : '#37431F'}
                />
              ))}
            </g>

            {/* --- B. AUTHENTIC GEDUNG REKTORAT UNIVERSITAS DIPONEGORO --- */}
            {/* Real architectural color scheme:
                - Roofs: Terracotta Reddish-Brown tiles (#7C2D12, #9A3412, #B45309, #C2410C)
                - Walls: White & Warm-White (#FFFFFF, #F8FAFC, #F1F5F9, #E2E8F0)
                - Accents: Subtle gray, warm beige, dark brown
            */}

            {/* 1. LEFT ADMINISTRATION WING (White Facade with Reddish-Brown Roof Trim) */}
            <rect x="140" y="210" width="310" height="120" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
            {/* Wing Terracotta Roof Band */}
            <polygon points="135,210 455,210 445,198 145,198" fill="url(#rec-roof-tile)" />
            <rect x="135" y="208" width="320" height="3" fill="#D97706" />
            {/* Left Wing Horizontal Floor Bands & Vertical Colonnade */}
            {Array.from({ length: 4 }).map((_, r) => (
              <g key={`l-win-row-${r}`}>
                <rect x="150" y={222 + r * 25} width="290" height="2" fill="#CBD5E1" />
                {Array.from({ length: 9 }).map((_, c) => (
                  <rect
                    key={`l-win-${r}-${c}`}
                    x={160 + c * 31}
                    y={225 + r * 25}
                    width="22"
                    height="16"
                    fill="url(#rec-glass-sunset)"
                    stroke="#E2E8F0"
                    strokeWidth="1"
                  />
                ))}
              </g>
            ))}

            {/* 2. RIGHT ADMINISTRATION WING (Symmetrical White Facade) */}
            <rect x="750" y="210" width="310" height="120" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="2" />
            {/* Wing Terracotta Roof Band */}
            <polygon points="745,210 1065,210 1055,198 755,198" fill="url(#rec-roof-tile)" />
            <rect x="745" y="208" width="320" height="3" fill="#D97706" />
            {/* Right Wing Horizontal Floor Bands & Windows */}
            {Array.from({ length: 4 }).map((_, r) => (
              <g key={`r-win-row-${r}`}>
                <rect x="760" y={222 + r * 25} width="290" height="2" fill="#CBD5E1" />
                {Array.from({ length: 9 }).map((_, c) => (
                  <rect
                    key={`r-win-${r}-${c}`}
                    x={770 + c * 31}
                    y={225 + r * 25}
                    width="22"
                    height="16"
                    fill="url(#rec-glass-sunset)"
                    stroke="#E2E8F0"
                    strokeWidth="1"
                  />
                ))}
              </g>
            ))}

            {/* 3. CENTRAL MONUMENTAL TOWER COMPLEX (WHITE WALLS & STEPPED JOGLO ROOF) */}
            {/* White Tower Facade Walls */}
            <rect x="420" y="130" width="360" height="200" fill="#FFFFFF" />
            <rect x="430" y="135" width="340" height="195" fill="#F8FAFC" />
            {/* Vertical White Structural Piers */}
            <rect x="420" y="130" width="16" height="200" fill="#E2E8F0" />
            <rect x="764" y="130" width="16" height="200" fill="#E2E8F0" />

            {/* --- DISTINCTIVE STEPPED REDDISH-BROWN JOGLO ROOFS --- */}
            {/* Tier 1: Lowest Broad Roof Tier (Reddish-Brown Tiles) */}
            <polygon points="340,210 600,165 860,210" fill="#7C2D12" />
            <polygon points="350,208 600,167 850,208" fill="url(#rec-roof-tile)" />
            <line x1="340" y1="210" x2="600" y2="165" stroke="#F59E0B" strokeWidth="2" />
            <line x1="860" y1="210" x2="600" y2="165" stroke="#D97706" strokeWidth="2" />

            {/* Tier 2: Mid Stepped Roof Tier (Terracotta) */}
            <polygon points="380,165 600,118 820,165" fill="#9A3412" />
            <polygon points="390,163 600,120 810,163" fill="url(#rec-roof-tile)" />
            <line x1="380" y1="165" x2="600" y2="118" stroke="#FDE68A" strokeWidth="2" />

            {/* Tier 3: Upper Crown Pyramid (Iconic UNDIP Stepped Joglo Peak) */}
            <polygon points="425,118 600,52 775,118" fill="#7C2D12" />
            <polygon points="435,116 600,55 765,116" fill="url(#rec-roof-tile)" />
            <polygon points="450,114 600,60 750,114" fill="#B45309" />
            {/* Golden Sunset Ridge Finial at the Peak */}
            <rect x="595" y="38" width="10" height="18" fill="#F59E0B" />
            <rect x="597" y="40" width="6" height="14" fill="#FDE68A" />
            <polygon points="593,42 600,32 607,42" fill="#FCD34D" />

            {/* Central Tower Windows & Atrium Glass (4 Floors) */}
            {Array.from({ length: 4 }).map((_, r) => (
              <g key={`c-win-row-${r}`}>
                {Array.from({ length: 8 }).map((_, c) => (
                  <rect
                    key={`c-win-${r}-${c}`}
                    x={470 + c * 33}
                    y={150 + r * 22}
                    width="24"
                    height="15"
                    fill="url(#rec-glass-sunset)"
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                ))}
              </g>
            ))}

            {/* Official UNDIP Crest / Clock Emblem on Central Pediment */}
            <circle cx="600" cy="115" r="16" fill="#0C2340" />
            <circle cx="600" cy="115" r="14" fill="#F59E0B" />
            <circle cx="600" cy="115" r="11" fill="#102A56" />
            <rect x="599" y="108" width="2" height="8" fill="#FDE68A" />
            <rect x="599" y="114" width="6" height="2" fill="#FDE68A" />

            {/* --- GRAND ENTRANCE PORTICO (MONUMENTAL WHITE PILLARS) --- */}
            {/* Portico Entablature (White with Golden Inscription) */}
            <rect x="460" y="250" width="280" height="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <rect x="460" y="250" width="280" height="3" fill="#F59E0B" />
            <text
              x="600"
              y="259"
              fontFamily="'Press Start 2P', monospace"
              fontSize="5"
              fill="#0A1128"
              textAnchor="middle"
              fontWeight="bold"
            >
              UNIVERSITAS DIPONEGORO
            </text>

            {/* Monumental White Columns */}
            <rect x="480" y="262" width="16" height="68" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <rect x="535" y="262" width="16" height="68" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <rect x="648" y="262" width="16" height="68" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            <rect x="704" y="262" width="16" height="68" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
            {/* Column Sunlit Highlights */}
            <rect x="492" y="262" width="4" height="68" fill="#FEF3C7" opacity="0.6" />
            <rect x="547" y="262" width="4" height="68" fill="#FEF3C7" opacity="0.6" />
            <rect x="660" y="262" width="4" height="68" fill="#FEF3C7" opacity="0.6" />
            <rect x="716" y="262" width="4" height="68" fill="#FEF3C7" opacity="0.6" />

            {/* Grand Entrance Doors */}
            <rect x="572" y="278" width="56" height="52" fill="#451A03" stroke="#D97706" strokeWidth="2" />
            <rect x="576" y="282" width="48" height="48" fill="#F59E0B" opacity="0.75" />

            {/* --- C. CEREMONIAL FORECOURT, NATIONAL FLAGPOLE & PLAZA --- */}
            {/* Paver Promenade */}
            <rect x="0" y="330" width="1200" height="230" fill="url(#rec-plaza-sand)" />
            <rect x="0" y="330" width="1200" height="8" fill="#E2E8F0" />
            <rect x="0" y="380" width="1200" height="180" fill="#4B5826" />

            {/* The Indonesian National Flag (Merah-Putih) on Ceremonial Flagpole */}
            <rect x="597" y="215" width="6" height="125" fill="#E2E8F0" />
            {/* Merah (Red Top) */}
            <rect x="603" y="218" width="36" height="12" fill="#DC2626" />
            {/* Putih (White Bottom) */}
            <rect x="603" y="230" width="36" height="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />

            {/* UNDIP Blue Banner Flagpole */}
            <rect x="670" y="235" width="4" height="105" fill="#CBD5E1" />
            <rect x="674" y="238" width="28" height="18" fill="#0C2340" />
            <rect x="680" y="244" width="14" height="6" fill="#F59E0B" />

            {/* Landscaped Campus Shrubbery & Flowerbeds */}
            <rect x="280" y="345" width="140" height="20" fill="#3D4B23" />
            <rect x="780" y="345" width="140" height="20" fill="#3D4B23" />
            <rect x="290" y="342" width="120" height="5" fill="#DC2626" />
            <rect x="790" y="342" width="120" height="5" fill="#F59E0B" />
          </svg>
        </div>

        {/* --- D. CONTROLLED SUBTLE BLUR & GOLDEN-HOUR SUNSET VIGNETTE OVERLAY --- */}
        {/* Keeps Gedung Rektorat recognizably intact while making foreground content pristine & readable */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#1F130E]/75 via-[#1A0E08]/60 to-[#1F130E]/90 backdrop-blur-[2.5px]"
          aria-hidden="true"
        />
      </div>

      {/* ============================================================== */}
      {/* 2. TOP SPATIAL NAVIGATION CUE: RETURN DOWN TO PATUNG KUDA */}
      {/* ============================================================== */}
      <div className="relative z-20 pt-4 px-4 flex flex-col items-center">
        <button
          onClick={() => {
            retroAudio.playWarp();
            onReturnToHorse?.();
          }}
          className="group flex items-center gap-2 text-[#FDE68A] hover:text-white transition-colors cursor-pointer bg-[#2A160E]/90 hover:bg-[#3D1F13] px-4 py-1.5 border-2 border-[#F59E0B] shadow-[2px_2px_0_0_#451A03] pixelated"
          aria-label="Kembali ke Patung Kuda Pangeran Diponegoro"
        >
          <span className="font-pixel text-[9px] sm:text-[10px] tracking-wider uppercase">
            ▼ KE PATUNG KUDA (PRESS TO PLAY)
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 3. FOREGROUND LAYER: CLEAN, MINIMAL & SPACIOUS HOMEPAGE HERO */}
      {/* (No "Beranda Resmi", No "Kampus Tembalang", No "2024/2025") */}
      {/* ============================================================== */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center">
        {/* Main Headline: Engaging, Crisp & Dominant */}
        <h1 className="font-pixel text-xl sm:text-3xl lg:text-4xl text-white tracking-wide leading-relaxed sm:leading-snug drop-shadow-[0_4px_0_#451A03] max-w-3xl mb-4 sm:mb-6">
          TEMUKAN JURUSAN IMPIANMU DI UNIVERSITAS DIPONEGORO
        </h1>

        {/* Supporting Description: Clean, Concise & Direct */}
        <p className="text-sm sm:text-base lg:text-lg text-amber-100/90 max-w-2xl mx-auto leading-relaxed font-normal mb-8 sm:mb-10">
          Eksplorasi kecocokan minat dan potensi akademikmu untuk program studi Sarjana dan Vokasi di Universitas Diponegoro.
        </p>

        {/* Academic Domains Exploration Trigger */}
        <div className="flex flex-col items-center justify-center w-full sm:w-auto">
          <PixelButton
            variant="ghost"
            size="lg"
            className="w-full sm:w-auto bg-[#2A160E]/85 text-[#FDE68A] hover:bg-[#3D1F13] border-2 border-[#F59E0B] shadow-[2px_2px_0_0_#451A03]"
            onClick={() => setShowDomainExplorer((prev) => !prev)}
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span>{showDomainExplorer ? 'Tutup Bidang Studi' : 'Jelajahi 7 Rumpun Ilmu'}</span>
            </span>
          </PixelButton>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. OPTIONAL SECONDARY SECTION: 7 ACADEMIC DOMAINS EXPLORATION */}
      {/* (Cleanly separated so the primary hero stays spacious & minimal) */}
      {/* ============================================================== */}
      {showDomainExplorer && (
        <div className="relative z-20 w-full max-w-5xl mx-auto px-3 sm:px-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-300 min-w-0">
          <div className="w-full max-w-full min-w-0 bg-[#1A0E08]/95 border-4 border-[#F59E0B] p-4 sm:p-7 pixelated shadow-[0_10px_35px_rgba(0,0,0,0.8)] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b-2 border-[#78350F] min-w-0">
              <div className="min-w-0">
                <span className="font-pixel text-[10px] text-[#F59E0B] tracking-wider uppercase block">
                  PANDUAN EKSPLORASI AKADEMIK
                </span>
                <h3 className="font-pixel text-xs sm:text-sm text-white mt-1 break-words">
                  7 Rumpun Bidang Ilmu Universitas Diponegoro
                </h3>
              </div>
              <Link
                href="/program-studi"
                className="font-pixel text-[9px] sm:text-[10px] text-[#FDE68A] hover:text-white inline-flex items-center gap-1.5 shrink-0 break-words min-h-[44px]"
              >
                <span>Lihat Daftar Program Studi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Domain Tabs with Edge Fades */}
            <div className="relative w-full max-w-full min-w-0 mb-3">
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#1A0E08] to-transparent pointer-events-none z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#1A0E08] to-transparent pointer-events-none z-10" />
              <div className="flex overflow-x-auto gap-2 pb-2 px-1 scrollbar-none w-full min-w-0">
                {ACADEMIC_DOMAINS.map((domain, idx) => {
                  const IconComponent = domain.Icon;
                  return (
                    <button
                      key={domain.id}
                      onClick={() => {
                        retroAudio.playBlip(600);
                        setActiveDomainTab(idx);
                      }}
                      className={`font-pixel text-[9px] sm:text-[10px] py-2.5 px-3 whitespace-nowrap border-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 min-h-[44px] ${
                        activeDomainTab === idx
                          ? 'bg-[#9A3412] text-[#FDE68A] border-[#FDE68A] shadow-[2px_2px_0_0_#F59E0B]'
                          : 'bg-[#2A160E] text-amber-200/70 border-[#78350F] hover:text-white hover:bg-[#3D1F13]'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5 shrink-0" />
                      <span>{domain.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Domain Details */}
            {(() => {
              const current = ACADEMIC_DOMAINS[activeDomainTab];
              const DomainIcon = current.Icon;
              return (
                <div className="w-full max-w-full min-w-0 bg-[#24130C] border-2 border-[#78350F] p-4 sm:p-5 mt-2">
                  <div className="flex items-center gap-3 mb-3 min-w-0">
                    <div className="w-9 h-9 bg-[#1A0E08] border border-[#78350F] flex items-center justify-center text-[#FDE68A] shrink-0">
                      <DomainIcon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-pixel text-xs sm:text-sm text-[#FDE68A] break-words">{current.name}</h4>
                      <p className="text-xs text-amber-200/80 font-mono break-words">{current.faculty}</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-4 break-words">
                    {current.description}
                  </p>
                  <div className="min-w-0">
                    <span className="font-pixel text-[9px] text-[#F59E0B] block mb-2 uppercase">
                      Contoh Program Studi:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {current.majors.map((m, i) => (
                        <span
                          key={i}
                          className="font-mono text-xs px-2.5 py-1 bg-[#1A0E08] border border-[#78350F] text-amber-100 break-words"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Subtle bottom edge indicator to Horse Statue */}
      <div className="relative z-20 pb-4 text-center">
        <button
          onClick={() => {
            retroAudio.playWarp();
            onReturnToHorse?.();
          }}
          className="text-amber-200/70 hover:text-[#FDE68A] font-pixel text-[8px] sm:text-[9px] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
          <span>SCROLL KE BAWAH UNTUK INTERAKSI PATUNG KUDA DIPONEGORO</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
        </button>
      </div>
    </section>
  );
}
