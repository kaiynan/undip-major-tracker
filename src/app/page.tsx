'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PixelIntroOverlay } from '@/components/pixel/PixelIntroOverlay';
import { PixelHorseStatueHero } from '@/components/pixel/PixelHorseStatueHero';
import { PixelRectorateScene } from '@/components/pixel/PixelRectorateScene';
import { PixelCaraKerjaScene } from '@/components/pixel/PixelCaraKerjaScene';
import { PixelTentangKamiScene } from '@/components/pixel/PixelTentangKamiScene';
import { retroAudio } from '@/lib/retroAudio';

export default function HomePage() {
  const [showIntro, setShowIntro] = useState<boolean | null>(null);
  const [activeSection, setActiveSection] = useState<'beranda' | 'patung-kuda' | 'cara-kerja' | 'tentang-kami'>('patung-kuda');
  const hasCenteredHero = useRef(false);

  // Check sessionStorage on client mount safely for WebViews
  useEffect(() => {
    try {
      const seen = sessionStorage.getItem('undip_intro_seen');
      if (!seen) {
        setShowIntro(true);
      } else {
        setShowIntro(false);
        // If intro was already seen, center on the horse statue hero on first visit
        if (!hasCenteredHero.current && !window.location.hash) {
          hasCenteredHero.current = true;
          setTimeout(() => {
            scrollToSection('patung-kuda', false);
          }, 100);
        }
      }
    } catch {
      setShowIntro(false);
    }
  }, []);

  // Listen to hash changes or section visibility
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['beranda', 'patung-kuda', 'cara-kerja', 'tentang-kami'].includes(hash)) {
        setActiveSection(hash as typeof activeSection);
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Track active section via IntersectionObserver for spatial awareness
  useEffect(() => {
    const sectionIds = ['beranda', 'patung-kuda', 'cara-kerja', 'tentang-kami'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
              setActiveSection(id as typeof activeSection);
            }
          });
        },
        { threshold: [0.35, 0.6] }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [showIntro]);

  const scrollToSection = (sectionId: string, smooth = true) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navOffset = window.innerWidth >= 640 ? 64 : 56;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: smooth ? 'smooth' : 'auto',
      });
      window.history.replaceState(null, '', `#${sectionId}`);
      setActiveSection(sectionId as typeof activeSection);
    }
  };

  const handleIntroComplete = () => {
    setShowIntro(false);
    retroAudio.playWarp();
    // After gate intro, user enters and arrives directly at Patung Kuda Pangeran Diponegoro hero
    setTimeout(() => {
      scrollToSection('patung-kuda', false);
    }, 50);
  };

  return (
    <div className="relative min-h-screen bg-[#190E08] text-slate-100 overflow-x-hidden selection:bg-[#F59E0B] selection:text-[#190E08]">
      {/* 1. INTRO ANIMATION OVERLAY (Gerbang UNDIP Tembalang) */}
      {showIntro && (
        <PixelIntroOverlay onComplete={handleIntroComplete} />
      )}

      {/* 2. SPATIAL EXPLORATION WORLD */}
      <main className="relative flex flex-col w-full">
        {/* SPATIAL LEVEL 1 (UP): GEDUNG REKTORAT UNDIP (BERANDA) */}
        <PixelRectorateScene
          onReturnToHorse={() => scrollToSection('patung-kuda')}
        />

        {/* SPATIAL LEVEL 2 (CENTER HERO): PATUNG KUDA PANGERAN DIPONEGORO (PRESS TO PLAY) */}
        <PixelHorseStatueHero
          onScrollUp={() => scrollToSection('beranda')}
          onScrollDown={() => scrollToSection('cara-kerja')}
        />

        {/* SPATIAL LEVEL 3 (DOWN): CARA KERJA */}
        <PixelCaraKerjaScene />

        {/* SPATIAL LEVEL 4 (FURTHER DOWN): TENTANG KAMI */}
        <PixelTentangKamiScene />
      </main>

      {/* Retro CRT Scanline Texture across background */}
      <div className="scanlines fixed inset-0 z-10 pointer-events-none opacity-40" />
    </div>
  );
}
