'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { PixelGateScene } from './PixelGateScene';
import { retroAudio } from '@/lib/retroAudio';
import { FastForward } from 'lucide-react';
import { APP_NAME, EVENT_NAME, TAGLINE } from '@/config/brand';

interface PixelIntroOverlayProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

export function PixelIntroOverlay({
  onComplete,
}: PixelIntroOverlayProps) {
  // Frame 0: Loading + Logos (clean full-screen, navbar hidden)
  // Frame 1: Wide establishing shot (Gate with distant Horse Statue centered, Navbar visible)
  // Frame 2: Smooth Forward Tracking Zoom toward the Horse Statue
  // Frame 3: Transition wipe into Widya Puraya Hero
  const [frame, setFrame] = useState<0 | 1 | 2 | 3>(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const lastTickStepRef = useRef(0);
  const completePlayedRef = useRef(false);

  // Attempt to resume audio context, unlocking on first pointerdown/keydown
  useEffect(() => {
    retroAudio.resumeContext().catch(() => {});
    const unlock = () => {
      retroAudio.resumeContext().catch(() => {});
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  // Frame 1 Loading SFX: ticks roughly every 10% step (skipped if already passed)
  useEffect(() => {
    if (frame !== 0) return;
    const currentStep = Math.floor(loadingProgress / 10);
    if (currentStep > lastTickStepRef.current && currentStep < 10) {
      lastTickStepRef.current = currentStep;
      retroAudio.playLoadingTick(loadingProgress);
    } else if (loadingProgress >= 100 && !completePlayedRef.current) {
      completePlayedRef.current = true;
      retroAudio.playLoadingComplete();
    }
  }, [loadingProgress, frame]);

  const handleComplete = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('undip_intro_seen', 'true');
      } catch {
        // Sandboxed WebView fallback
      }
    }
    onComplete();
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    retroAudio.playSelect();
    handleComplete();
  }, [handleComplete]);

  // Listen to keyboard shortcut (ESC / Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  // Listen to custom event when user clicks any Navbar link during intro
  useEffect(() => {
    const onSkipEvent = () => handleSkip();
    window.addEventListener('undip:skip-intro', onSkipEvent);
    return () => window.removeEventListener('undip:skip-intro', onSkipEvent);
  }, [handleSkip]);

  useEffect(() => {
    // Frame 1: Loading bar with ease-out timing, reaches 100% at ~1.5s (total duration 1.65s)
    const startTime = Date.now();
    const loadDuration = 1500;

    const loadInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      if (elapsed >= loadDuration) {
        setLoadingProgress(100);
        clearInterval(loadInterval);
      } else {
        const factor = elapsed / loadDuration;
        // Ease-out curve
        const progress = Math.min(99, Math.floor(100 * Math.pow(factor, 0.75)));
        setLoadingProgress(progress);
      }
    }, 30);

    // Frame 2: Gate reveal at 1.65s (Frame 1 reduced ~28% to 1.65s, within 1.5-1.8s)
    const t1 = setTimeout(() => {
      setFrame(1);
      setZoomLevel(1);
      retroAudio.playBlip(520);
    }, 1650);

    // Frame 3: Smooth camera tracking push towards the horse statue (duration 1.4s unchanged)
    const t2 = setTimeout(() => {
      setFrame(2);
      setZoomLevel(2.8);
      retroAudio.playWarp();
    }, 3050);

    // Transition Wipe into landing page (duration 2.0s unchanged)
    const t3 = setTimeout(() => {
      setFrame(3);
    }, 5050);

    // Complete intro at 5.75s
    const t4 = setTimeout(() => {
      handleComplete();
    }, 5750);

    return () => {
      clearInterval(loadInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [handleComplete]);

  return (
    <>
      {/* Top Navbar Cover during Frame 1 to keep Frame 1 clean and full-screen */}
      <div
        className={`fixed top-0 left-0 right-0 z-[55] bg-[#1A0E08] transition-opacity duration-700 pointer-events-none ${
          frame === 0 ? 'opacity-100 pointer-events-auto' : 'opacity-0'
        }`}
        style={{ height: 'var(--navbar-h, 56px)' }}
        aria-hidden="true"
      />

      <div
        className={`fixed left-0 right-0 bottom-0 bg-[#1A0E08] flex flex-col justify-between overflow-hidden select-none transition-all duration-400 ${
          frame === 0 ? 'z-[60]' : 'z-[45]'
        } ${
          frame === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Animasi Pembuka Gerbang UNDIP Tembalang"
        style={{
          top: frame === 0 ? 0 : 'var(--navbar-h, 56px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        {/* Top HUD with Skip Button — visible, tappable >= 44x44px and placed below navbar from Frame 2 */}
        <div className="relative z-30 pt-3 px-3 pb-1 sm:pt-4 sm:px-6 flex items-center justify-end shrink-0">
          <button
            onClick={handleSkip}
            className="font-pixel text-[8.5px] sm:text-[10px] bg-[#0A1428]/95 hover:bg-[#102A56] text-[#FCD34D] hover:text-white px-3 sm:px-4 py-2 border-2 border-[#F59E0B] shadow-[2px_2px_0_0_#78350F] flex items-center justify-center gap-1.5 cursor-pointer pixelated active:scale-95 shrink-0 min-h-[44px] min-w-[44px]"
            aria-label="Lewati animasi pembuka"
          >
            <FastForward className="w-4 h-4 text-[#FCD34D] shrink-0" />
            <span className="hidden sm:inline">LEWATI INTRO [ESC]</span>
            <span className="sm:hidden">LEWATI</span>
          </button>
        </div>

        {/* Main Visual Arena */}
        <div className="relative flex-1 flex items-center justify-center overflow-hidden">
          {/* Frame 0: Dark Screen & Loading Progress */}
          {frame === 0 && (
            <div className="relative z-20 flex flex-col items-center justify-center text-center p-4 sm:p-6 space-y-4 max-w-md w-full animate-in fade-in duration-300">
              {/* Three Logos: Universitas Diponegoro, Sedulur Serang Diponegoro, Gema Saujana (Transparent Background) */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mb-2">
                {/* 1. Universitas Diponegoro (UNDIP) */}
                <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]">
                  <Image
                    src="/logos/undip.png"
                    alt="Universitas Diponegoro"
                    width={96}
                    height={96}
                    priority
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* 2. Sedulur Serang Diponegoro */}
                <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]">
                  <Image
                    src="/logos/sedulur-serang-diponegoro.png"
                    alt="Sedulur Serang Diponegoro"
                    width={96}
                    height={96}
                    priority
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* 3. Gema Saujana */}
                <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center shrink-0 drop-shadow-[0_0_8px_rgba(245,158,11,0.25)]">
                  <Image
                    src="/logos/gema-saujana.png"
                    alt="Gema Saujana"
                    width={96}
                    height={96}
                    priority
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              <div className="font-pixel text-[9px] sm:text-[10px] text-[#93C5FD] tracking-wider uppercase">
                {EVENT_NAME}
              </div>
              <h1 className="font-pixel text-base sm:text-xl md:text-2xl text-white tracking-wide">
                {APP_NAME}
              </h1>
              <p className="font-mono text-xs text-[#FDE68A]">
                {TAGLINE}
              </p>

              {/* Indikator Loading tepat diatas box loading: Loading NN% */}
              <div className="w-full text-center mt-3 mb-1.5" aria-hidden="true">
                <span className="font-pixel text-[10px] sm:text-xs text-[#FCD34D] tracking-wider tabular-nums inline-block">
                  Loading {loadingProgress}%
                </span>
              </div>

              {/* Pixel Loading Bar */}
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={loadingProgress}
                aria-label="Memuat aplikasi"
                className="w-full bg-[#081226] h-3.5 sm:h-4 border-2 border-[#334155] p-0.5 shadow-[2px_2px_0_0_#000]"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#1D4ED8] via-[#F59E0B] to-[#10B981] transition-all duration-150"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Frame 1, 2, 3: Gate Scene with Horse Statue in Center & Smooth Tracking Push */}
          {frame >= 1 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <PixelGateScene
                scale={1}
                zoomLevel={zoomLevel}
                className="w-full h-full"
              />

              {/* Moving Forward Atmosphere in Frame 3 */}
              {frame === 2 && (
                <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-in fade-in duration-300 px-4">
                  <div className="bg-[#0A1428]/85 border-2 border-[#FCD34D] px-4 sm:px-6 py-2 sm:py-2.5 text-center shadow-[4px_4px_0_0_#000] max-w-full">
                    <div className="font-pixel text-[10px] sm:text-xs md:text-sm text-[#FCD34D] motion-safe:animate-pulse tracking-wide leading-relaxed">
                      Memasuki Universitas Diponegoro
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Subtitle / Prompt Bar */}
        <div className="relative z-30 p-3 sm:p-5 text-center bg-[#081226]/90 border-t-2 border-[#1E293B]">
          <p className="font-pixel text-[9px] sm:text-[10px] text-slate-200">
            {TAGLINE}
          </p>
        </div>

        {/* Scanline CRT overlay */}
        <div className="scanlines absolute inset-0 z-40 pointer-events-none opacity-30" />
      </div>
    </>
  );
}
