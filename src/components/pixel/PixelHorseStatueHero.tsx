'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { retroAudio } from '@/lib/retroAudio';
import { PixelDiponegoroStatue } from './PixelDiponegoroStatue';
import { ChevronUp, ChevronDown, Volume2, VolumeX } from 'lucide-react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';

const subscribeReducedMotion = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
};

const getReducedMotionSnapshot = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const getReducedMotionServerSnapshot = () => false;

interface PixelHorseStatueHeroProps {
  onScrollUp?: () => void;
  onScrollDown?: () => void;
}

export function PixelHorseStatueHero({
  onScrollUp,
  onScrollDown,
}: PixelHorseStatueHeroProps) {
  const router = useRouter();
  const { answeredCount, totalQuestions } = useQuestionnaire();
  const [isStarting, setIsStarting] = useState(false);
  const [transitionFade, setTransitionFade] = useState(false);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const [isMuted, setIsMuted] = useState(() => retroAudio.isMuted());

  const handlePressToPlay = (e?: React.SyntheticEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (isStarting) return;
    setIsStarting(true);
    retroAudio.playStartGame();

    const navigate = () => {
      router.push('/questionnaire');
    };

    if (prefersReducedMotion) {
      setTransitionFade(true);
      setTimeout(navigate, 300);
      return;
    }

    // Horizontal horse running animation toward the right, scenery moves left
    setTimeout(() => {
      setTransitionFade(true);
    }, 750);

    setTimeout(navigate, 1050);
  };

  const handleToggleAudio = () => {
    const nextMuted = retroAudio.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      retroAudio.playBlip(700);
    }
  };

  return (
    <section
      id="patung-kuda"
      className="relative w-full min-h-[92vh] sm:min-h-screen bg-[#1F130E] flex flex-col justify-between overflow-hidden select-none border-y-4 border-[#78350F] scroll-mt-14 sm:scroll-mt-16"
      aria-label="Scene Pangeran Diponegoro Widya Puraya - Sunset Golden Hour"
    >
      {/* ============================================================== */}
      {/* 1. COHESIVE GOLDEN-HOUR SUNSET SKY BACKGROUND */}
      {/* ============================================================== */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Harmonious Sunset Dither Bands (Warm Amber, Peach, Golden Yellow, Terracotta) */}
        <div className="w-full h-[18%] bg-[#3F1D2C]" />
        <div className="w-full h-[18%] bg-[#5C2323]" />
        <div className="w-full h-[18%] bg-[#832B13]" />
        <div className="w-full h-[16%] bg-[#B44310]" />
        <div className="w-full h-[14%] bg-[#D97706]" />
        <div className="w-full h-[10%] bg-[#F59E0B]" />
        <div className="w-full h-[6%] bg-[#FDE68A]" />

        {/* Ambient Sunset Sunbeams & Warm Peach Glow behind Statue */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-gradient-to-b from-[#FEF08A]/35 via-[#F59E0B]/20 to-transparent blur-3xl pointer-events-none" />
      </div>

      {/* ============================================================== */}
      {/* 2. TOP SPATIAL NAVIGATION CUE: SCROLL UP TO REKTORAT */}
      {/* ============================================================== */}
      <div className={`relative z-20 pt-4 sm:pt-6 px-4 flex flex-col items-center transition-opacity duration-300 ${isStarting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={() => {
            retroAudio.playWarp();
            onScrollUp?.();
          }}
          className="group flex flex-col items-center justify-center gap-1 text-[#FDE68A] hover:text-white transition-colors cursor-pointer bg-[#2A160E]/90 hover:bg-[#3D1F13] px-4 py-2 border-2 border-[#F59E0B] shadow-[2px_2px_0_0_#451A03] pixelated active:scale-95 touch-manipulation min-h-[44px]"
          aria-label="Eksplorasi ke Atas: Gedung Rektorat UNDIP (Beranda)"
        >
          <div className="flex items-center gap-1.5 font-pixel text-[9px] sm:text-[10px] tracking-wider uppercase">
            <ChevronUp className="w-4 h-4 animate-bounce text-[#FDE68A]" />
            <span>▲ SCROLL KE ATAS: GEDUNG REKTORAT (BERANDA)</span>
            <ChevronUp className="w-4 h-4 animate-bounce text-[#FDE68A]" />
          </div>
          <span className="text-[10px] text-amber-200/90 font-mono hidden sm:inline">
            [Eksplorasi Rektorat Widya Puraya & Beranda Utama]
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* 3. MAIN VISUAL COMPOSITION: COMPLETE FULL-WHITE DIPONEGORO STATUE */}
      {/* ============================================================== */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto w-full px-2 sm:px-6 my-auto">
        <div className="relative w-full max-w-4xl min-h-[300px] sm:min-h-0 aspect-auto sm:aspect-[16/10] flex items-center justify-center">
          <svg
            viewBox="0 0 900 580"
            className="w-full h-full max-h-[52vh] sm:max-h-[62vh] object-contain overflow-visible"
            style={{ shapeRendering: 'crispEdges' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Sunset Plaza Paving Pattern (Warm Sand & Terracotta Dither) */}
              <pattern id="sunset-plaza" width="4" height="4" patternUnits="userSpaceOnUse">
                <rect width="4" height="4" fill="#78350F" />
                <rect x="0" y="0" width="2" height="2" fill="#92400E" />
                <rect x="2" y="2" width="2" height="2" fill="#5E2A0B" />
              </pattern>

              {/* Sunset Golden Lawn Pattern */}
              <pattern id="sunset-lawn" width="4" height="4" patternUnits="userSpaceOnUse">
                <rect width="4" height="4" fill="#424D23" />
                <rect x="0" y="0" width="2" height="2" fill="#58672D" />
                <rect x="2" y="2" width="2" height="2" fill="#323B19" />
              </pattern>
            </defs>

            {/* SCENERY ENVIRONMENT — Moves toward the left when horse runs right */}
            <g
              id="hero-scenery-environment"
              style={{
                transform: isStarting && !prefersReducedMotion ? 'translate3d(-280px, 0, 0)' : 'translate3d(0, 0, 0)',
                transition: prefersReducedMotion ? 'none' : 'transform 1.15s cubic-bezier(0.4, 0, 0.2, 1)',
                willChange: 'transform',
              }}
            >
              {/* A. DISTANT WIDYA PURAYA AUDITORIUM SILHOUETTE (Sunset Terracotta & Mahogany) */}
              <g opacity="0.95">
                {/* Wide Sloped Polygonal Joglo Roof */}
                <polygon points="100,310 450,200 800,310 760,340 140,340" fill="#3A1700" />
                <polygon points="160,310 450,218 740,310 700,325 200,325" fill="#5B2206" />
                <polygon points="210,310 450,230 690,310 660,320 240,320" fill="#7C2D12" />
                {/* Golden Sunset Roof Ridge */}
                <polygon points="100,310 450,200 450,204 105,312" fill="#FDE68A" opacity="0.9" />
                <polygon points="800,310 450,200 450,204 795,312" fill="#F59E0B" opacity="0.8" />
                {/* Sunset Reflective Windows */}
                <rect x="220" y="300" width="460" height="15" fill="#FCD34D" opacity="0.8" />
                <rect x="220" y="300" width="460" height="4" fill="#FEF3C7" opacity="0.9" />
                {/* Auditorium Base */}
                <rect x="130" y="325" width="640" height="25" fill="#2E1305" />
              </g>

              {/* B. SURROUNDING CAMPUS TREES (Warm Golden-Hour Olive Greens) */}
              <g>
                {/* Left Flanking Trees in Sunset Light */}
                <rect x="30" y="240" width="90" height="100" fill="#2C361A" />
                <rect x="40" y="220" width="70" height="80" fill="#3D4B23" />
                <rect x="55" y="205" width="40" height="50" fill="#536630" />
                <rect x="68" y="320" width="12" height="60" fill="#451A03" />

                <rect x="100" y="260" width="80" height="90" fill="#242D15" />
                <rect x="110" y="245" width="60" height="70" fill="#37431F" />

                {/* Right Flanking Trees in Sunset Light */}
                <rect x="780" y="240" width="90" height="100" fill="#2C361A" />
                <rect x="790" y="220" width="70" height="80" fill="#3D4B23" />
                <rect x="805" y="205" width="40" height="50" fill="#536630" />
                <rect x="820" y="320" width="12" height="60" fill="#451A03" />

                <rect x="720" y="260" width="80" height="90" fill="#242D15" />
                <rect x="730" y="245" width="60" height="70" fill="#37431F" />
              </g>

              {/* C. WIDYA PURAYA PLAZA GROUND & SUNSET FLOWERBEDS */}
              <ellipse cx="450" cy="470" rx="430" ry="85" fill="url(#sunset-lawn)" />
              <ellipse cx="450" cy="470" rx="370" ry="70" fill="#4B5826" />
              {/* Plaza Terracotta Curbing & Stone Pavers */}
              <ellipse cx="450" cy="470" rx="270" ry="45" fill="url(#sunset-plaza)" />
              <ellipse cx="450" cy="470" rx="262" ry="40" fill="#8C4212" />
              <ellipse cx="450" cy="470" rx="258" ry="36" fill="#A1541D" />

              {/* Warm Flowerbeds (Marigold, Crimson, Amber) */}
              <g fill="#DC2626">
                <rect x="210" y="455" width="20" height="8" />
                <rect x="235" y="460" width="22" height="8" fill="#F59E0B" />
                <rect x="265" y="452" width="20" height="8" fill="#D97706" />
                <rect x="615" y="455" width="20" height="8" fill="#F59E0B" />
                <rect x="640" y="460" width="22" height="8" fill="#DC2626" />
                <rect x="670" y="452" width="20" height="8" fill="#F59E0B" />
              </g>

              {/* Plaza Lamp Posts with Warm Golden Sunset Lanterns */}
              <g fill="#3E1A04">
                <rect x="190" y="360" width="4" height="80" />
                <rect x="184" y="355" width="16" height="5" />
                <rect x="186" y="348" width="12" height="7" fill="#FDE68A" />

                <rect x="706" y="360" width="4" height="80" />
                <rect x="700" y="355" width="16" height="5" />
                <rect x="702" y="348" width="12" height="7" fill="#FDE68A" />
              </g>
            </g>

            {/* D. THE PANGERAN DIPONEGORO FULL-WHITE STATUE — Runs toward right on PRESS TO PLAY */}
            <g
              id="hero-running-horse"
              style={{
                transform: isStarting && !prefersReducedMotion ? 'translate3d(750px, 0, 0)' : 'translate3d(0, 0, 0)',
                transition: prefersReducedMotion ? 'none' : 'transform 1.15s cubic-bezier(0.3, 0.1, 0.2, 1)',
                willChange: 'transform',
              }}
            >
              <g className={isStarting && !prefersReducedMotion ? 'animate-horse-gallop-fast' : ''}>
                <PixelDiponegoroStatue lighting="golden" showPedestal={true} />
              </g>
            </g>
          </svg>

          {/* ============================================================== */}
          {/* 4. CENTRAL INTERACTIVE ELEMENT: "PRESS TO PLAY" */}
          {/* ============================================================== */}
          {/* Positioned cleanly below the statue's torso so horse & pointing arm are 100% visible */}
          <div className={`absolute inset-x-0 bottom-1 sm:bottom-4 flex flex-col items-center justify-center pointer-events-none transition-all duration-300 ${isStarting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'}`}>
            <div
              onClick={handlePressToPlay}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePressToPlay(e);
                }
              }}
              className="pointer-events-auto bg-[#1A0E08]/95 backdrop-blur-md px-6 sm:px-10 py-4 sm:py-6 border-4 border-[#F59E0B] shadow-[0_0_35px_rgba(245,158,11,0.6),4px_4px_0_0_#451A03] flex flex-col items-center gap-2 sm:gap-2.5 text-center transition-all hover:scale-105 active:scale-95 cursor-pointer w-[92%] sm:w-auto sm:min-w-[420px] max-w-lg pixelated touch-manipulation select-none"
              aria-label="Tekan untuk Mulai Kuisioner Minat 36 Pertanyaan"
            >
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[9px] sm:text-[10px] text-[#FDE68A] tracking-wider sm:tracking-widest uppercase">
                  UNIVERSITAS DIPONEGORO
                </span>
                <span className="w-2.5 h-2.5 bg-[#F59E0B] inline-block animate-pulse" />
              </div>

              {/* The Central Blinking Retro Arcade Prompt */}
              <button
                type="button"
                onClick={handlePressToPlay}
                disabled={isStarting}
                className="group flex items-center justify-center gap-2 sm:gap-3 py-1.5 px-2 text-[#FDE68A] hover:text-white transition-colors cursor-pointer w-full touch-manipulation min-h-[48px]"
                aria-label="Tekan untuk Mulai Kuisioner Minat 36 Pertanyaan"
              >
                <span className="font-pixel text-base sm:text-2xl md:text-3xl text-[#F59E0B] group-hover:translate-x-[-4px] transition-transform animate-retro-blink shrink-0">
                  ▶
                </span>
                <span className="font-pixel text-lg sm:text-2xl md:text-3xl text-[#FFFFFF] drop-shadow-[0_2px_0_#451A03] sm:drop-shadow-[0_3px_0_#451A03] tracking-normal sm:tracking-wider animate-retro-blink whitespace-nowrap">
                  PRESS TO PLAY
                </span>
                <span className="font-pixel text-base sm:text-2xl md:text-3xl text-[#F59E0B] group-hover:translate-x-[4px] transition-transform animate-retro-blink shrink-0">
                  ◀
                </span>
              </button>

              <p className="text-xs sm:text-sm text-amber-100 font-medium font-sans">
                {answeredCount > 0
                  ? `Lanjutkan Quest Minat (${answeredCount}/${totalQuestions} Terjawab)`
                  : 'Mulai Petualangan 36 Refleksi Minat Akademik'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. BOTTOM SPATIAL NAVIGATION CUE: SCROLL DOWN TO CARA KERJA */}
      {/* ============================================================== */}
      <div className={`relative z-20 pb-20 md:pb-4 px-4 flex flex-col items-center transition-opacity duration-300 ${isStarting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={() => {
            retroAudio.playWarp();
            onScrollDown?.();
          }}
          className="group flex flex-col items-center justify-center gap-1 text-[#FDE68A] hover:text-white transition-colors cursor-pointer bg-[#2A160E]/90 hover:bg-[#3D1F13] px-4 py-2 border-2 border-[#F59E0B] shadow-[2px_2px_0_0_#451A03] pixelated active:scale-95 touch-manipulation min-h-[44px]"
          aria-label="Eksplorasi ke Bawah: Panduan Cara Kerja & Tentang Kami"
        >
          <div className="flex items-center gap-1.5 font-pixel text-[9px] sm:text-[10px] tracking-wider uppercase">
            <ChevronDown className="w-4 h-4 animate-bounce text-[#FDE68A]" />
            <span>▼ SCROLL KE BAWAH: CARA KERJA & TENTANG KAMI</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-[#FDE68A]" />
          </div>
          <span className="text-[10px] text-amber-200/90 font-mono hidden sm:inline">
            [Alur 4 Langkah Petualangan & Visi Platform]
          </span>
        </button>
      </div>

      {/* Floating Retro Sound Control - Repositioned on mobile below scroll cue to prevent overlap */}
      <div className={`absolute top-20 sm:top-4 right-3 sm:right-4 z-30 flex items-center gap-2 transition-opacity duration-300 ${isStarting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          onClick={handleToggleAudio}
          className="bg-[#2A160E]/90 hover:bg-[#3D1F13] text-[#FDE68A] p-2.5 border-2 border-[#F59E0B] shadow-[2px_2px_0_0_#000] pixelated cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          title={isMuted ? 'Aktifkan Suara Retro (SFX: OFF)' : 'Bisukan Suara Retro (SFX: ON)'}
          aria-label={isMuted ? 'Suara mati' : 'Suara hidup'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Cinematic Seamless Cross-Fade directly into Questionnaire */}
      <div
        className={`fixed inset-0 z-50 bg-[#190E08] pointer-events-none transition-opacity duration-350 ease-out ${
          transitionFade ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />
    </section>
  );
}
