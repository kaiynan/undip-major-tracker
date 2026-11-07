'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Menu, X, ArrowRight, Volume2, VolumeX, Sparkles, RotateCcw } from 'lucide-react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { retroAudio } from '@/lib/retroAudio';

interface NavItem {
  id: 'beranda' | 'patung-kuda' | 'cara-kerja' | 'jelajahi' | 'tentang-kami' | 'admin';
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'beranda', label: 'BERANDA', href: '/#beranda' },
  { id: 'patung-kuda', label: 'PATUNG KUDA', href: '/#patung-kuda' },
  { id: 'cara-kerja', label: 'CARA KERJA', href: '/#cara-kerja' },
  { id: 'tentang-kami', label: 'TENTANG KAMI', href: '/#tentang-kami' },
  { id: 'jelajahi', label: '67 PRODI', href: '/results' },
  { id: 'admin', label: 'ALGORITMA HMIM', href: '/admin' },
];

export function Navbar() {
  const pathname = usePathname();
  const { answeredCount, totalQuestions, isComplete } = useQuestionnaire();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

  const handleReplayIntro = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('undip_intro_seen');
      if (pathname === '/') {
        window.location.reload();
      } else {
        window.location.href = '/';
      }
    }
  };

  const getInitialActive = () => {
    if (pathname === '/results' || pathname.startsWith('/program/')) return 'jelajahi';
    if (pathname === '/admin') return 'admin';
    return 'patung-kuda';
  };

  const [activeSection, setActiveSection] = useState<'beranda' | 'patung-kuda' | 'cara-kerja' | 'jelajahi' | 'tentang-kami' | 'admin'>(getInitialActive);

  // Handle active navigation state for both routes and homepage anchor scrolling
  useEffect(() => {
    if (pathname === '/results' || pathname.startsWith('/program/')) {
      setActiveSection('jelajahi');
      return;
    }
    if (pathname === '/admin') {
      setActiveSection('admin');
      return;
    }
    if (pathname !== '/') {
      return;
    }

    const updateActiveSectionOnScroll = () => {
      const scrollY = window.scrollY;
      const berandaEl = document.getElementById('beranda');
      const horseEl = document.getElementById('patung-kuda');
      const caraKerjaEl = document.getElementById('cara-kerja');
      const tentangKamiEl = document.getElementById('tentang-kami');

      const berandaTop = berandaEl ? berandaEl.getBoundingClientRect().top + scrollY - 140 : 0;
      const horseTop = horseEl ? horseEl.getBoundingClientRect().top + scrollY - 180 : 400;
      const caraKerjaTop = caraKerjaEl ? caraKerjaEl.getBoundingClientRect().top + scrollY - 180 : Infinity;
      const tentangKamiTop = tentangKamiEl ? tentangKamiEl.getBoundingClientRect().top + scrollY - 220 : Infinity;

      if (scrollY >= tentangKamiTop - 50) {
        setActiveSection('tentang-kami');
      } else if (scrollY >= caraKerjaTop - 50) {
        setActiveSection('cara-kerja');
      } else if (scrollY >= horseTop - 100) {
        setActiveSection('patung-kuda');
      } else {
        setActiveSection('beranda');
      }
    };

    const hash = window.location.hash;
    if (hash === '#cara-kerja') {
      setActiveSection('cara-kerja');
    } else if (hash === '#tentang-kami') {
      setActiveSection('tentang-kami');
    } else if (hash === '#beranda') {
      setActiveSection('beranda');
    } else if (hash === '#patung-kuda') {
      setActiveSection('patung-kuda');
    } else {
      updateActiveSectionOnScroll();
    }

    window.addEventListener('scroll', updateActiveSectionOnScroll, { passive: true });
    return () => window.removeEventListener('scroll', updateActiveSectionOnScroll);
  }, [pathname]);

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    setMobileMenuOpen(false);
    retroAudio.playSelect();
    setActiveSection(item.id);

    // If already on homepage and clicking an anchor link
    if (pathname === '/' && item.href.startsWith('/#')) {
      e.preventDefault();
      const targetId = item.href.replace('/#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${targetId}`);
      }
    } else if (pathname === '/' && item.href === '/') {
      e.preventDefault();
      const element = document.getElementById('patung-kuda');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', '#patung-kuda');
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1A0E08]/95 backdrop-blur-md border-b-4 border-[#78350F] text-white select-none pixelated shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          {/* Brand Identity / Retro Pixel Badge */}
          <Link
            href="/"
            onClick={(e) => handleNavClick(NAV_ITEMS[0], e)}
            className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#2A160E] border-2 border-[#F59E0B] flex items-center justify-center text-[#FDE68A] shadow-[2px_2px_0_0_#000] group-hover:bg-[#3D1F13] transition-colors shrink-0">
              <span className="font-pixel text-xs sm:text-sm">U</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-pixel text-[9px] sm:text-xs text-white tracking-wide truncate">
                  UNDIP MAJOR MATCHER
                </span>
              </div>
              <p className="text-[10px] text-amber-200/80 font-mono hidden lg:block">
                Eksplorasi Minat Program Studi Universitas Diponegoro
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(item, e)}
                  onMouseEnter={() => retroAudio.playBlip(620)}
                  className={`font-pixel text-[9px] px-3 py-1.5 border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#9A3412] text-[#FDE68A] border-[#FDE68A] shadow-[2px_2px_0_0_#F59E0B]'
                      : 'bg-[#2A160E] text-amber-100/80 border-[#78350F] hover:text-white hover:bg-[#3D1F13]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 pl-2 sm:pl-4 border-l-2 border-[#78350F]/70 shrink-0">
            {/* Replay / Restart Intro Button */}
            <button
              onClick={handleReplayIntro}
              className="hidden sm:inline-flex items-center gap-1.5 font-pixel text-[9px] bg-[#2A160E] hover:bg-[#3D1F13] text-amber-200 hover:text-[#FDE68A] px-3 py-1.5 border-2 border-[#78350F] shadow-[2px_2px_0_0_#000] transition-colors cursor-pointer"
              title="Putar Ulang Animasi Gerbang Tembalang"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#FDE68A]" />
              <span>RESTART INTRO</span>
            </button>

            {/* Audio Toggle Button */}
            <button
              onClick={handleToggleSound}
              className="p-1.5 sm:px-2.5 sm:py-1.5 bg-[#2A160E] hover:bg-[#3D1F13] text-[#FDE68A] border border-[#78350F] shadow-[2px_2px_0_0_#000] flex items-center justify-center font-pixel text-[9px] cursor-pointer min-h-[36px] min-w-[36px]"
              title={isMuted ? 'Aktifkan Suara Retro' : 'Bisukan Suara'}
              aria-label={isMuted ? 'Suara Mati' : 'Suara Hidup'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden md:inline ml-1">{isMuted ? 'SFX: OFF' : 'SFX: ON'}</span>
            </button>

            {/* Main Action CTA */}
            {mounted && isComplete ? (
              <Link
                href="/results"
                onClick={() => retroAudio.playSelect()}
                className="font-pixel text-[8.5px] sm:text-[10px] bg-[#059669] hover:bg-[#10B981] text-white px-2.5 sm:px-4 py-1.5 sm:py-2 border-2 border-[#064E3B] shadow-[2px_2px_0_0_#000] inline-flex items-center gap-1 sm:gap-1.5 cursor-pointer min-h-[36px]"
              >
                <span>HASIL</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            ) : (
              <Link
                href="/questionnaire"
                onClick={() => retroAudio.playSelect()}
                className="font-pixel text-[8.5px] sm:text-[10px] bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0A1128] font-bold px-2 sm:px-4 py-1.5 sm:py-2 border-2 border-[#78350F] shadow-[2px_2px_0_0_#000] inline-flex items-center gap-1 sm:gap-1.5 cursor-pointer min-h-[36px]"
              >
                <span>
                  {mounted && answeredCount > 0
                    ? `QUEST (${answeredCount}/${totalQuestions})`
                    : 'MULAI TES'}
                </span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => {
                retroAudio.playBlip(500);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="xl:hidden p-1.5 bg-[#2A160E] hover:bg-[#3D1F13] text-[#FDE68A] border border-[#78350F] cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#1A0E08] border-t-2 border-[#78350F] px-4 py-4 space-y-2 shadow-2xl animate-fade-in">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(item, e)}
                className={`block font-pixel text-[10px] py-2.5 px-3 border transition-colors ${
                  isActive
                    ? 'bg-[#9A3412] text-[#FDE68A] border-[#FDE68A] shadow-[2px_2px_0_0_#000]'
                    : 'bg-[#24130C] text-amber-100 border-[#78350F] hover:bg-[#341A10]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              handleReplayIntro();
            }}
            className="w-full text-left font-pixel text-[10px] py-2.5 px-3 bg-[#24130C] text-[#FDE68A] border border-[#78350F] hover:bg-[#341A10] cursor-pointer"
          >
            ▶ PUTAR ULANG INTRO GERBANG
          </button>

          <div className="pt-2">
            <Link
              href="/questionnaire"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block font-pixel text-[10px] py-3 px-3 bg-[#F59E0B] text-[#0A1128] font-bold shadow-[2px_2px_0_0_#78350F] active:translate-x-0.5 active:translate-y-0.5"
            >
              MASUK KE KUISIONER (36 PERTANYAAN)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
