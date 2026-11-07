'use client';

import React, { useEffect, useState } from 'react';
import { PixelDiponegoroStatue } from './PixelDiponegoroStatue';

interface PixelQuestionnaireBackgroundProps {
  isAdvancing?: boolean;
}

/**
 * Full-screen continuous side-scrolling parallax background for the Questionnaire.
 * Features subtle golden-hour sky, distant Joglo roof silhouettes, midground trees,
 * and a bottom paved trail moving continuously toward the left (giving the impression
 * that the user travels forward toward the right).
 * High visual contrast and dark vignette overlay ensure zero disturbance to text readability.
 */
export function PixelQuestionnaireBackground({ isAdvancing = false }: PixelQuestionnaireBackgroundProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Golden-Hour Sunset Sky Bands */}
      <div className="absolute inset-0 bg-[#140B07]">
        <div className="w-full h-[20%] bg-[#2A111E]" />
        <div className="w-full h-[20%] bg-[#3D1717]" />
        <div className="w-full h-[20%] bg-[#5C2310]" />
        <div className="w-full h-[18%] bg-[#832B0D]" />
        <div className="w-full h-[12%] bg-[#B44310]" />
        <div className="w-full h-[10%] bg-[#D97706]/40" />
      </div>

      {/* 2. Distant Horizon: Joglo Rooflines & Tembalang Campus Silhouettes (Slowest Layer) */}
      <div
        className={`absolute bottom-24 inset-x-0 h-40 opacity-30 ${
          prefersReducedMotion
            ? ''
            : isAdvancing
            ? 'animate-scroll-slow-advancing'
            : 'animate-scroll-slow'
        }`}
      >
        <div className="flex w-[200%] h-full">
          {[0, 1].map((copy) => (
            <div key={copy} className="w-1/2 h-full relative">
              <svg
                viewBox="0 0 1200 160"
                className="w-full h-full object-cover"
                preserveAspectRatio="none"
                style={{ shapeRendering: 'crispEdges' }}
              >
                {/* Distant Auditorium Joglo Roof 1 */}
                <polygon points="80,120 220,50 360,120" fill="#451A03" />
                <polygon points="120,120 220,65 320,120" fill="#5B2206" />
                <rect x="180" y="115" width="80" height="40" fill="#2E1305" />

                {/* Distant Library & Faculty Towers */}
                <rect x="420" y="60" width="100" height="95" fill="#3D1A06" />
                <polygon points="410,60 470,25 530,60" fill="#5B2206" />

                {/* Distant Auditorium Joglo Roof 2 */}
                <polygon points="680,120 840,45 1000,120" fill="#451A03" />
                <polygon points="730,120 840,60 950,120" fill="#5B2206" />
                <rect x="800" y="115" width="80" height="40" fill="#2E1305" />

                {/* Soft Horizon Line */}
                <rect x="0" y="145" width="1200" height="15" fill="#2E1305" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Midground Layer: Campus Trees & Vegetation (Medium Speed Layer) */}
      <div
        className={`absolute bottom-12 inset-x-0 h-32 opacity-35 ${
          prefersReducedMotion
            ? ''
            : isAdvancing
            ? 'animate-scroll-mid-advancing'
            : 'animate-scroll-mid'
        }`}
      >
        <div className="flex w-[200%] h-full">
          {[0, 1].map((copy) => (
            <div key={copy} className="w-1/2 h-full relative">
              <svg
                viewBox="0 0 1200 128"
                className="w-full h-full object-cover"
                preserveAspectRatio="none"
                style={{ shapeRendering: 'crispEdges' }}
              >
                {/* Tree Cluster 1 */}
                <rect x="40" y="30" width="50" height="60" fill="#1F2812" />
                <rect x="48" y="15" width="34" height="45" fill="#2D3A1A" />
                <rect x="60" y="75" width="10" height="50" fill="#3B1703" />

                {/* Tree Cluster 2 */}
                <rect x="260" y="20" width="60" height="70" fill="#1F2812" />
                <rect x="270" y="10" width="40" height="50" fill="#36471E" />
                <rect x="285" y="70" width="10" height="55" fill="#3B1703" />

                {/* Tree Cluster 3 */}
                <rect x="540" y="35" width="45" height="55" fill="#1F2812" />
                <rect x="548" y="22" width="30" height="40" fill="#2D3A1A" />
                <rect x="558" y="75" width="8" height="50" fill="#3B1703" />

                {/* Tree Cluster 4 */}
                <rect x="820" y="18" width="70" height="75" fill="#1F2812" />
                <rect x="832" y="8" width="46" height="55" fill="#36471E" />
                <rect x="850" y="75" width="12" height="50" fill="#3B1703" />

                {/* Tree Cluster 5 */}
                <rect x="1040" y="28" width="55" height="65" fill="#1F2812" />
                <rect x="1050" y="15" width="35" height="45" fill="#2D3A1A" />
                <rect x="1062" y="75" width="10" height="50" fill="#3B1703" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Foreground Paved Ground Path (Fastest Layer) */}
      <div
        className={`absolute bottom-0 inset-x-0 h-14 opacity-40 ${
          prefersReducedMotion
            ? ''
            : isAdvancing
            ? 'animate-scroll-fast-advancing'
            : 'animate-scroll-fast'
        }`}
      >
        <div className="flex w-[200%] h-full">
          {[0, 1].map((copy) => (
            <div key={copy} className="w-1/2 h-full bg-[#1E0F07] border-t-2 border-[#542308] relative">
              <svg
                viewBox="0 0 600 56"
                className="w-full h-full object-cover"
                preserveAspectRatio="none"
                style={{ shapeRendering: 'crispEdges' }}
              >
                {/* Stepped Paving Tiles */}
                <g fill="#451A03" opacity="0.7">
                  <rect x="0" y="10" width="70" height="8" />
                  <rect x="90" y="10" width="70" height="8" />
                  <rect x="180" y="10" width="70" height="8" />
                  <rect x="270" y="10" width="70" height="8" />
                  <rect x="360" y="10" width="70" height="8" />
                  <rect x="450" y="10" width="70" height="8" />
                  <rect x="540" y="10" width="70" height="8" />

                  <rect x="40" y="24" width="70" height="8" fill="#5E2405" />
                  <rect x="130" y="24" width="70" height="8" fill="#5E2405" />
                  <rect x="220" y="24" width="70" height="8" fill="#5E2405" />
                  <rect x="310" y="24" width="70" height="8" fill="#5E2405" />
                  <rect x="400" y="24" width="70" height="8" fill="#5E2405" />
                  <rect x="490" y="24" width="70" height="8" fill="#5E2405" />
                </g>
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Readability Protective Vignette & Dark Tint Over Entire Page */}
      <div className="absolute inset-0 bg-[#190E08]/75 backdrop-blur-[0.5px]" />
    </div>
  );
}

interface PixelQuestionnaireHorseHeaderProps {
  currentQuestionNumber: number;
  totalQuestions: number;
  isAdvancing?: boolean;
}

/**
 * Dedicated Panoramic Adventure Viewport Banner at the top of the questionnaire.
 * Displays Pangeran Diponegoro on his white equestrian horse facing right,
 * continuously traveling rightward through the scrolling campus environment.
 * Accelerates forward with a brisk gallop when moving to the next question.
 */
export function PixelQuestionnaireHorseHeader({
  currentQuestionNumber,
  totalQuestions,
  isAdvancing = false,
}: PixelQuestionnaireHorseHeaderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener('change', listener);
      return () => mq.removeEventListener('change', listener);
    }
  }, []);

  return (
    <div className="w-full h-24 sm:h-28 rounded-2xl sm:rounded-3xl border-2 border-[#78350F] bg-[#1A0E08] overflow-hidden relative shadow-[0_4px_20px_rgba(0,0,0,0.5)] mb-6 select-none pixelated">
      {/* Golden-Hour Sunset Sky in Viewport */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#3D1717] via-[#7C2D12] to-[#B44310] opacity-90" />

      {/* Distant Scenery Moving Left */}
      <div
        className={`absolute inset-0 opacity-60 ${
          prefersReducedMotion
            ? ''
            : isAdvancing
            ? 'animate-scroll-mid-advancing'
            : 'animate-scroll-mid'
        }`}
      >
        <div className="flex w-[200%] h-full">
          {[0, 1].map((copy) => (
            <div key={copy} className="w-1/2 h-full relative">
              <svg
                viewBox="0 0 600 112"
                className="w-full h-full object-cover"
                preserveAspectRatio="none"
                style={{ shapeRendering: 'crispEdges' }}
              >
                {/* Joglo Roof Profile in background */}
                <polygon points="120,70 200,35 280,70" fill="#451A03" opacity="0.8" />
                <polygon points="400,70 480,35 560,70" fill="#451A03" opacity="0.8" />

                {/* Distant trees */}
                <rect x="50" y="40" width="28" height="40" fill="#243013" />
                <rect x="55" y="30" width="18" height="30" fill="#37481F" />
                <rect x="320" y="40" width="30" height="40" fill="#243013" />
                <rect x="326" y="28" width="18" height="30" fill="#37481F" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Viewport Ground Track (Moving Left under the Horse Hooves) */}
      <div
        className={`absolute bottom-0 inset-x-0 h-7 ${
          prefersReducedMotion
            ? ''
            : isAdvancing
            ? 'animate-scroll-fast-advancing'
            : 'animate-scroll-fast'
        }`}
      >
        <div className="flex w-[200%] h-full">
          {[0, 1].map((copy) => (
            <div key={copy} className="w-1/2 h-full bg-[#2E1206] border-t-2 border-[#78350F] relative">
              <svg
                viewBox="0 0 400 28"
                className="w-full h-full object-cover"
                preserveAspectRatio="none"
                style={{ shapeRendering: 'crispEdges' }}
              >
                {/* Paving stones moving left */}
                <rect x="10" y="4" width="40" height="6" fill="#78350F" />
                <rect x="65" y="4" width="40" height="6" fill="#78350F" />
                <rect x="120" y="4" width="40" height="6" fill="#78350F" />
                <rect x="175" y="4" width="40" height="6" fill="#78350F" />
                <rect x="230" y="4" width="40" height="6" fill="#78350F" />
                <rect x="285" y="4" width="40" height="6" fill="#78350F" />
                <rect x="340" y="4" width="40" height="6" fill="#78350F" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================== */}
      {/* THE WHITE PANGERAN DIPONEGORO HORSE & RIDER — GALLOPING RIGHT */}
      {/* ============================================================== */}
      <div
        className="absolute bottom-2 left-6 sm:left-12 z-10 transition-transform duration-350 ease-out"
        style={{
          transform: isAdvancing && !prefersReducedMotion ? 'translate3d(36px, 0, 0)' : 'translate3d(0, 0, 0)',
        }}
      >
        <div
          className={
            prefersReducedMotion
              ? ''
              : isAdvancing
              ? 'animate-horse-gallop-fast'
              : 'animate-horse-gallop'
          }
        >
          {/* Framed SVG showing the complete white horse & rider without stone pedestal */}
          <svg
            viewBox="310 80 340 260"
            className="w-24 sm:w-28 h-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)]"
            style={{ shapeRendering: 'crispEdges' }}
            preserveAspectRatio="xMidYMid meet"
          >
            <PixelDiponegoroStatue lighting="golden" showPedestal={false} />
          </svg>
        </div>
      </div>

      {/* Top Overlay Badges */}
      <div className="absolute top-2.5 inset-x-3 sm:inset-x-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[8px] sm:text-[9px] text-[#FDE68A] bg-[#1A0E08]/90 px-2.5 py-1 border border-[#F59E0B] shadow-[2px_2px_0_0_#451A03]">
            EKSPEDISI MINAT UNDIP
          </span>
          <span className="w-1.5 h-1.5 bg-[#F59E0B] inline-block animate-pulse" />
        </div>

        <span className="font-pixel text-[8px] sm:text-[9px] text-amber-200/90 bg-[#1A0E08]/90 px-2.5 py-1 border border-[#78350F] shadow-[2px_2px_0_0_#000]">
          SOAL {String(currentQuestionNumber).padStart(2, '0')} / {totalQuestions}
        </span>
      </div>
    </div>
  );
}
