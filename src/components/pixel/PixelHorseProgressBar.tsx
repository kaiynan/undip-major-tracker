'use client';

import React, { useEffect, useState } from 'react';
import { PixelDiponegoroStatue } from './PixelDiponegoroStatue';

interface PixelHorseProgressBarProps {
  answeredCount: number;
  totalQuestions: number;
  isAdvancing?: boolean;
  isGallopingAway?: boolean;
}

/**
 * 16-Bit Pixel Art Pangeran Diponegoro Horse Progress Bar.
 * - The white equestrian statue acts as the physical progress indicator moving along
 *   a paved stone track from Gerbang Tembalang (0%) to Gedung Widya Puraya (100%).
 * - Progress P = (Questions Answered / 36) * 100%.
 * - Smooth running animation only when progressing/advancing; stationary idle stance when reading.
 * - When isGallopingAway is true (questionnaire submission), the horse accelerates off-screen to the right.
 */
export function PixelHorseProgressBar({
  answeredCount,
  totalQuestions = 36,
  isAdvancing = false,
  isGallopingAway = false,
}: PixelHorseProgressBarProps) {
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

  // Calculate actual completion percentage strictly: (Answered / 36) * 100
  const progressPercentage = Math.min(100, Math.max(0, Math.round((answeredCount / totalQuestions) * 100)));

  // Milestones along the track (every 9 questions / 25%)
  const milestones = [
    { label: '0%', text: 'Gerbang', count: 0 },
    { label: '25%', text: 'RIASEC', count: 9 },
    { label: '50%', text: 'Bidang Ilmu', count: 18 },
    { label: '75%', text: 'Gaya Belajar', count: 27 },
    { label: '100%', text: 'Widya Puraya', count: 36 },
  ];

  return (
    <div className="w-full bg-[#1F100A] rounded-2xl sm:rounded-3xl border-2 border-[#78350F] p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] select-none mb-6">
      {/* 1. Top HUD Info: Questions Counter and Completion Percentage */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[8px] sm:text-[9px] text-[#FDE68A] bg-[#78350F] px-2.5 py-1 border border-[#F59E0B] shadow-[2px_2px_0_0_#451A03]">
            PROGRES EKSPEDISI
          </span>
          <span className="text-amber-200/80 font-bold hidden sm:inline">
            Menuju Gedung Widya Puraya
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-amber-200/90 font-mono font-bold text-xs sm:text-sm">
            <strong className="text-[#FDE68A] text-sm sm:text-base">{answeredCount}</strong> / {totalQuestions} Soal
          </span>
          <span className="font-pixel text-[9px] sm:text-[10px] text-[#FFFBEB] bg-[#9A3412] px-2 py-0.5 rounded-lg border border-[#F59E0B]">
            {progressPercentage}%
          </span>
        </div>
      </div>

      {/* 2. THE HORSE PROGRESS TRACK CONTAINER */}
      <div className="relative pt-8 pb-3 px-2">
        {/* Milestone Flags & Markers */}
        <div className="absolute top-0 inset-x-4 flex justify-between text-[10px] text-amber-200/60 font-mono font-medium pointer-events-none">
          {milestones.map((ms, idx) => {
            const isReached = answeredCount >= ms.count;
            return (
              <div
                key={idx}
                className={`flex flex-col items-center transition-colors duration-300 ${
                  isReached ? 'text-[#FDE68A] font-bold' : 'text-stone-500'
                }`}
              >
                <span>{ms.label}</span>
                <span className="text-[9px] hidden sm:inline">{ms.text}</span>
              </div>
            );
          })}
        </div>

        {/* The Paved Stone Physical Track */}
        <div className="relative w-full h-4 bg-[#120804] rounded-full border-2 border-[#542308] overflow-hidden p-0.5 shadow-inner">
          {/* Active Golden-Hour Progress Fill */}
          <div
            className="h-full bg-gradient-to-r from-[#EA580C] via-[#F59E0B] to-[#FDE68A] rounded-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(245,158,11,0.5)]"
            style={{ width: `${progressPercentage}%` }}
          />

          {/* Stepped Paving Stone Details */}
          <div className="absolute inset-0 flex justify-between px-1 pointer-events-none opacity-40">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="w-1 h-full bg-[#78350F]" />
            ))}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. THE WHITE PANGERAN DIPONEGORO HORSE PROGRESS INDICATOR      */}
        {/* ============================================================== */}
        <div
          className="absolute z-20 pointer-events-none transition-all ease-out"
          style={{
            top: '-24px',
            left: isGallopingAway
              ? '130%'
              : `calc(${progressPercentage}% - ${progressPercentage > 90 ? '48px' : progressPercentage < 10 ? '4px' : '26px'})`,
            transitionDuration: isGallopingAway
              ? '1200ms'
              : isAdvancing
              ? '450ms'
              : '500ms',
            transitionTimingFunction: isGallopingAway
              ? 'cubic-bezier(0.4, 0, 0.2, 1)'
              : 'cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Gallop motion class active ONLY when advancing or galloping away */}
          <div
            className={
              prefersReducedMotion
                ? ''
                : isGallopingAway
                ? 'animate-horse-gallop-fast'
                : isAdvancing
                ? 'animate-horse-gallop'
                : ''
            }
          >
            {/* The Approved Full-White Pangeran Diponegoro Equestrian Statue */}
            <svg
              viewBox="310 80 340 260"
              className="w-14 sm:w-16 h-auto drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] filter"
              style={{ shapeRendering: 'crispEdges' }}
              preserveAspectRatio="xMidYMid meet"
            >
              <PixelDiponegoroStatue lighting="golden" showPedestal={false} />
            </svg>
          </div>
        </div>

        {/* Milestone Landmark Indicators on Track */}
        <div className="absolute top-10 inset-x-2 flex justify-between pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-[#78350F] border border-[#F59E0B]" />
          <div className={`w-2.5 h-2.5 rounded-full border transition-colors ${answeredCount >= 9 ? 'bg-[#F59E0B] border-[#FDE68A]' : 'bg-[#2E1206] border-[#542308]'}`} />
          <div className={`w-2.5 h-2.5 rounded-full border transition-colors ${answeredCount >= 18 ? 'bg-[#F59E0B] border-[#FDE68A]' : 'bg-[#2E1206] border-[#542308]'}`} />
          <div className={`w-2.5 h-2.5 rounded-full border transition-colors ${answeredCount >= 27 ? 'bg-[#F59E0B] border-[#FDE68A]' : 'bg-[#2E1206] border-[#542308]'}`} />
          <div className={`w-2.5 h-2.5 rounded-full border transition-colors ${answeredCount >= 36 ? 'bg-[#10B981] border-[#6EE7B7]' : 'bg-[#2E1206] border-[#542308]'}`} />
        </div>
      </div>
    </div>
  );
}
