'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { retroAudio } from '@/lib/retroAudio';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import {
  Compass,
  Menu,
  X,
  ArrowRight,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
} from 'lucide-react';

interface PixelHudNavbarProps {
  onReplayIntro?: () => void;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export function PixelHudNavbar({
  onReplayIntro,
  activeSection = 'patung-kuda',
  onNavigateSection,
}: PixelHudNavbarProps) {
  const pathname = usePathname();
  const { answeredCount, totalQuestions, isComplete } = useQuestionnaire();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsMuted(retroAudio.isMuted());
  }, []);

  const handleToggleSound = () => {
    const nextMuted = retroAudio.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      retroAudio.playBlip(750);
    }
  };

  const navLinks = [
    { id: 'beranda', label: 'BERANDA (REKTORAT)', href: '/#beranda' },
    { id: 'patung-kuda', label: 'PATUNG KUDA', href: '/#patung-kuda' },
    { id: 'cara-kerja', label: 'CARA KERJA', href: '/#cara-kerja' },
    { id: 'tentang-kami', label: 'TENTANG KAMI', href: '/#tentang-kami' },
    { id: 'jelajahi', label: '67 PRODI', href: '/results' },
  ];

  const handleLinkClick = (id: string, href: string, e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    retroAudio.playSelect();

    if (pathname === '/' && href.startsWith('/#')) {
      e.preventDefault();
      onNavigateSection?.(id);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#081226]/95 backdrop-blur-md border-b-4 border-[#1E3A8A] text-white shadow-[0_4px_16px_rgba(0,0,0,0.5)] select-none pixelated">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Identity / Retro Crest */}
          <Link
            href="/"
            onClick={() => retroAudio.playSelect()}
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#102A56] border-2 border-[#FCD34D] flex items-center justify-center text-[#FCD34D] shadow-[2px_2px_0_0_#000] group-hover:bg-[#1D4ED8] transition-colors">
              <span className="font-pixel text-xs">U</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-pixel text-[11px] sm:text-xs text-white tracking-wide">
                  UNDIP MAJOR MATCHER
                </span>
              </div>
              <p className="text-[10px] text-blue-300/80 font-mono hidden lg:block">
                Eksplorasi Minat Universitas Diponegoro
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links (Retro Arcade Bar) */}
          <nav className="hidden xl:flex items-center gap-2">
            {navLinks.map((item) => {
              const isActive =
                (pathname === '/' && activeSection === item.id) ||
                (pathname === '/results' && item.id === 'jelajahi');

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleLinkClick(item.id, item.href, e)}
                  onMouseEnter={() => retroAudio.playBlip(600)}
                  className={`font-pixel text-[9px] px-2.5 py-1.5 border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1D4ED8] text-[#FCD34D] border-[#FCD34D] shadow-[2px_2px_0_0_#FCD34D]'
                      : 'bg-[#0B1528] text-slate-300 border-[#1E293B] hover:text-white hover:bg-[#1E293B]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls: Audio Toggle, Replay Intro, and Start/Continue CTA */}
          <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l-2 border-[#1E3A8A]">
            {/* Replay Intro Button (if on homepage) */}
            {onReplayIntro && (
              <button
                onClick={() => {
                  retroAudio.playSelect();
                  onReplayIntro();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 font-pixel text-[9px] bg-[#0A1428] hover:bg-[#102A56] text-blue-300 hover:text-[#FCD34D] px-3 py-1.5 border-2 border-[#334155] shadow-[2px_2px_0_0_#000] transition-colors cursor-pointer"
                title="Putar Ulang Animasi Gerbang"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>RESTART INTRO</span>
              </button>
            )}

            {/* Audio SFX Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-[#0A1428] hover:bg-[#102A56] text-[#FCD34D] border border-[#334155] shadow-[2px_2px_0_0_#000] flex items-center gap-1 font-pixel text-[9px] cursor-pointer"
              title={isMuted ? 'Aktifkan Suara Retro' : 'Bisukan Suara'}
              aria-label={isMuted ? 'Suara Mati' : 'Suara Hidup'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline">{isMuted ? 'SFX: OFF' : 'SFX: ON'}</span>
            </button>

            {/* Primary Action Button */}
            {mounted && isComplete ? (
              <Link
                href="/results"
                onClick={() => retroAudio.playSelect()}
                className="font-pixel text-[9px] sm:text-[10px] bg-[#059669] hover:bg-[#10B981] text-white px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-[#064E3B] shadow-[2px_2px_0_0_#000] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>LIHAT HASIL</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <Link
                href="/questionnaire"
                onClick={() => retroAudio.playSelect()}
                className="font-pixel text-[9px] sm:text-[10px] bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0A1128] font-bold px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-[#78350F] shadow-[2px_2px_0_0_#000] inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>
                  {mounted && answeredCount > 0
                    ? `QUEST (${answeredCount}/${totalQuestions})`
                    : 'MULAI KUISIONER'}
                </span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => {
                retroAudio.playBlip(500);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="xl:hidden p-1.5 bg-[#0A1428] text-white border border-[#334155] cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0A1128] border-t-2 border-[#1E3A8A] px-4 py-4 space-y-2 shadow-2xl">
          {navLinks.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => handleLinkClick(item.id, item.href, e)}
              className="block font-pixel text-[10px] py-2 px-3 bg-[#0F1D38] text-slate-200 border border-[#1E3A8A] hover:bg-[#1D4ED8] hover:text-[#FCD34D]"
            >
              {item.label}
            </Link>
          ))}

          {onReplayIntro && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onReplayIntro();
              }}
              className="w-full text-left font-pixel text-[10px] py-2 px-3 bg-[#0F1D38] text-[#FCD34D] border border-[#1E3A8A]"
            >
              ▶ PUTAR ULANG ANIMASI INTRO
            </button>
          )}

          <div className="pt-2">
            <Link
              href="/questionnaire"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block font-pixel text-[10px] py-2.5 px-3 bg-[#F59E0B] text-[#0A1128] font-bold shadow-[2px_2px_0_0_#78350F]"
            >
              MASUK KE KUISIONER (36 PERTANYAAN)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
