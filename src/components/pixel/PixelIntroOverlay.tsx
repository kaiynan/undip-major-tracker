'use client';

import React, { useState, useEffect } from 'react';
import { PixelGateScene } from './PixelGateScene';
import { retroAudio } from '@/lib/retroAudio';
import { FastForward } from 'lucide-react';

interface PixelIntroOverlayProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

export function PixelIntroOverlay({
  onComplete,
  forcePlay = false,
}: PixelIntroOverlayProps) {
  // Step 0: Loading
  // Step 1: Wide establishing shot (Gate with distant Horse Statue centered)
  // Step 2: Smooth Forward Tracking Zoom toward the Horse Statue
  // Step 3: Transition wipe into Widya Puraya Hero
  const [frame, setFrame] = useState<0 | 1 | 2 | 3>(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Keyboard Escape or Space to skip intro
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    // Frame 0: Loading bar (0 to 1.1s)
    const loadInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadInterval);
          return 100;
        }
        return prev + 25;
      });
    }, 120);

    // Frame 1: Gate reveal (wide shot with horse statue in center) at 1.1s
    const t1 = setTimeout(() => {
      setFrame(1);
      setZoomLevel(1);
      retroAudio.playBlip(520);
    }, 1100);

    // Frame 2: Smooth camera tracking push towards the horse statue at 2.4s
    const t2 = setTimeout(() => {
      setFrame(2);
      setZoomLevel(2.8); // Smoothly zooms into the center opening
      retroAudio.playWarp();
    }, 2400);

    // Frame 3: Transition Wipe at 4.6s
    const t3 = setTimeout(() => {
      setFrame(3);
    }, 4600);

    // Complete at 5.3s
    const t4 = setTimeout(() => {
      handleComplete();
    }, 5300);

    return () => {
      clearInterval(loadInterval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleSkip = () => {
    retroAudio.playSelect();
    handleComplete();
  };

  const handleComplete = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('undip_intro_seen', 'true');
      } catch {
        // Sandboxed WebView fallback
      }
    }
    onComplete();
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#1A0E08] flex flex-col justify-between overflow-hidden select-none transition-opacity duration-700 ${
        frame === 3 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Animasi Pembuka Gerbang UNDIP Tembalang"
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {/* Top HUD with Skip Button */}
      <div className="relative z-30 p-3 sm:p-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#F59E0B] inline-block animate-pulse shrink-0" />
          <span className="font-pixel text-[8px] sm:text-[10px] text-[#FCD34D] tracking-wider sm:tracking-widest uppercase truncate">
            {frame === 0 && 'FRAME 1/4: INISIALISASI...'}
            {frame === 1 && (
              <>
                <span className="hidden sm:inline">FRAME 2/4: GERBANG UNDIP — PATUNG KUDA DIPONEGORO TERLIHAT</span>
                <span className="sm:hidden">FRAME 2/4: GERBANG UNDIP</span>
              </>
            )}
            {frame === 2 && (
              <>
                <span className="hidden sm:inline">FRAME 3/4: MENDEKATI PATUNG KUDA DIPONEGORO...</span>
                <span className="sm:hidden">FRAME 3/4: MENDEKATI PATUNG</span>
              </>
            )}
            {frame === 3 && 'FRAME 4/4: WIDYA PURAYA'}
          </span>
        </div>

        <button
          onClick={handleSkip}
          className="font-pixel text-[8.5px] sm:text-[10px] bg-[#0A1428]/95 hover:bg-[#102A56] text-[#FCD34D] hover:text-white px-3 sm:px-3.5 py-2 sm:py-1.5 border-2 border-[#F59E0B] shadow-[2px_2px_0_0_#78350F] flex items-center gap-1.5 cursor-pointer pixelated active:scale-95 shrink-0 min-h-[38px] sm:min-h-[32px]"
          aria-label="Lewati animasi pembuka"
        >
          <FastForward className="w-3.5 h-3.5 text-[#FCD34D]" />
          <span className="hidden sm:inline">LEWATI INTRO [ESC]</span>
          <span className="sm:hidden">LEWATI</span>
        </button>
      </div>

      {/* Main Visual Arena */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Frame 0: Dark Screen & Loading Progress */}
        {frame === 0 && (
          <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 space-y-4 max-w-md w-full animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-[#102A56] border-4 border-[#F59E0B] flex items-center justify-center text-white mb-2 shadow-[4px_4px_0_0_#000]">
              <span className="font-pixel text-2xl text-[#FCD34D] animate-retro-blink">◆</span>
            </div>

            <div className="font-pixel text-xs sm:text-sm text-[#93C5FD] tracking-widest uppercase">
              UNIVERSITAS DIPONEGORO
            </div>
            <h1 className="font-pixel text-lg sm:text-2xl text-white tracking-wide">
              UNDIP MAJOR MATCHER
            </h1>
            <div className="font-pixel text-[9px] text-[#FCD34D]">
              RETRO ADVENTURE EDITION
            </div>

            {/* Pixel Loading Bar */}
            <div className="w-full bg-[#081226] h-5 border-2 border-[#334155] p-0.5 shadow-[2px_2px_0_0_#000]">
              <div
                className="h-full bg-gradient-to-r from-[#1D4ED8] via-[#F59E0B] to-[#10B981] transition-all duration-150"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <span className="font-mono text-[10px] text-slate-300">
              MEMUAT DUNIA PIXEL TEMBALANG ({loadingProgress}%)
            </span>
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

            {/* Cinematic Establishing Title in Frame 1 */}
            {frame === 1 && (
              <div className="absolute top-[16%] z-30 text-center px-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-[#0A1428]/90 border-2 border-[#F59E0B] px-6 py-2.5 inline-block shadow-[4px_4px_0_0_#000]">
                  <div className="font-pixel text-[9px] text-[#93C5FD] uppercase tracking-widest">
                    GERBANG KAMPUS UNDIP TEMBALANG
                  </div>
                  <div className="font-pixel text-sm sm:text-lg text-[#FCD34D] mt-1">
                    PATUNG KUDA DIPONEGORO DI DEPAN
                  </div>
                </div>
              </div>
            )}

            {/* Moving Forward Atmosphere in Frame 2 */}
            {frame === 2 && (
              <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-in fade-in duration-300">
                <div className="bg-[#0A1428]/85 border-2 border-[#FCD34D] px-6 py-2.5 text-center shadow-[4px_4px_0_0_#000]">
                  <div className="font-pixel text-xs sm:text-sm text-[#FCD34D] animate-pulse">
                    MENDEKATI PATUNG KUDA WIDYA PURAYA...
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Subtitle / Prompt Bar */}
      <div className="relative z-30 p-4 sm:p-5 text-center bg-[#081226]/90 border-t-2 border-[#1E293B]">
        <p className="font-pixel text-[9px] sm:text-[10px] text-slate-200">
          &ldquo;ENTER UNDIP. EXPLORE YOUR WORLD. DISCOVER YOUR FUTURE.&rdquo;
        </p>
      </div>

      {/* Scanline CRT overlay */}
      <div className="scanlines absolute inset-0 z-40 pointer-events-none opacity-30" />
    </div>
  );
}
