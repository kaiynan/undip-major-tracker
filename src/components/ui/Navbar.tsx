'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ArrowRight, Volume2, VolumeX, RotateCcw } from 'lucide-react';
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

const subscribeNoop = () => () => {};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const { answeredCount, totalQuestions, isComplete } = useQuestionnaire();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [isMuted, setIsMuted] = useState(() => (typeof window !== 'undefined' ? retroAudio.isMuted() : false));

  // Expose measured navbar height as --navbar-h CSS variable
  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navRef.current) {
        const height = navRef.current.offsetHeight;
        document.documentElement.style.setProperty('--navbar-h', `${height}px`);
      }
    };
    updateNavbarHeight();
    const observer = new ResizeObserver(updateNavbarHeight);
    if (navRef.current) {
      observer.observe(navRef.current);
    }
    return () => observer.disconnect();
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
      try {
        sessionStorage.removeItem('undip_intro_seen');
      } catch {
        // Safe sandbox fallback
      }
      if (pathname === '/') {
        window.location.reload();
      } else {
        router.push('/');
      }
    }
  };

  const getInitialActive = (path: string): 'beranda' | 'patung-kuda' | 'cara-kerja' | 'jelajahi' | 'tentang-kami' | 'admin' => {
    if (path === '/results' || path.startsWith('/program/')) return 'jelajahi';
    if (path === '/admin') return 'admin';
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['beranda', 'patung-kuda', 'cara-kerja', 'tentang-kami'].includes(hash)) {
        return hash as 'beranda' | 'patung-kuda' | 'cara-kerja' | 'tentang-kami';
      }
    }
    return 'patung-kuda';
  };

  const [activeSection, setActiveSection] = useState<'beranda' | 'patung-kuda' | 'cara-kerja' | 'jelajahi' | 'tentang-kami' | 'admin'>(() => getInitialActive(pathname));

  // Handle active navigation state on homepage scroll
  useEffect(() => {
    if (pathname !== '/') {
      return;
    }

    const updateActiveSectionOnScroll = () => {
      const scrollY = window.scrollY;
      const horseEl = document.getElementById('patung-kuda');
      const caraKerjaEl = document.getElementById('cara-kerja');
      const tentangKamiEl = document.getElementById('tentang-kami');

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

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['beranda', 'patung-kuda', 'cara-kerja', 'tentang-kami'].includes(hash)) {
        setActiveSection(hash as typeof activeSection);
      }
    };

    window.addEventListener('scroll', updateActiveSectionOnScroll, { passive: true });
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('scroll', updateActiveSectionOnScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname]);

  // Hide global navbar on /results to prevent double stacked headers (Requirement 6)
  if (pathname === '/results') {
    return null;
  }

  const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
    // If clicked while intro is playing, cleanly skip intro first
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('undip:skip-intro'));
    }
    setMobileMenuOpen(false);
    retroAudio.playSelect();
    setActiveSection(item.id);

    // If already on homepage and clicking an anchor link
    if (pathname === '/' && item.href.startsWith('/#')) {
      e.preventDefault();
      const targetId = item.href.replace('/#', '');
      const element = document.getElementById(targetId);
      if (element) {
        const navOffset = window.innerWidth >= 640 ? 64 : 56;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: Math.max(0, elementPosition - navOffset),
          behavior: 'smooth',
        });
        window.history.pushState(null, '', `#${targetId}`);
      }
    } else if (pathname === '/' && item.href === '/') {
      e.preventDefault();
      const element = document.getElementById('patung-kuda');
      if (element) {
        const navOffset = window.innerWidth >= 640 ? 64 : 56;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: Math.max(0, elementPosition - navOffset),
          behavior: 'smooth',
        });
        window.history.pushState(null, '', '#patung-kuda');
      }
    }
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 w-full bg-[#1A0E08]/95 backdrop-blur-md border-b-4 border-[#78350F] text-white select-none pixelated shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-[auto_1fr_auto] 2xl:grid-cols-[1fr_auto_1fr] items-center h-14 sm:h-16 gap-2 sm:gap-4">
          {/* 1. Left Column: Brand Identity */}
          <div className="flex items-center justify-start min-w-0 shrink-0">
            <Link
              href="/"
              onClick={(e) => handleNavClick(NAV_ITEMS[0], e)}
              className="flex items-center gap-2 sm:gap-2.5 group cursor-pointer shrink-0 whitespace-nowrap"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#2A160E] border-2 border-[#F59E0B] flex items-center justify-center text-[#FDE68A] shadow-[2px_2px_0_0_#000] group-hover:bg-[#3D1F13] transition-colors shrink-0">
                <span className="font-pixel text-xs sm:text-sm">U</span>
              </div>
              <div className="shrink-0 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <span className="font-pixel text-[8px] xs:text-[9.5px] sm:text-xs text-white tracking-normal sm:tracking-wide shrink-0 whitespace-nowrap">
                    UNDIP MAJOR MATCHER
                  </span>
                </div>
                <p className="text-[10px] text-amber-200/80 font-mono hidden 2xl:block shrink-0 whitespace-nowrap">
                  Eksplorasi Minat Program Studi Universitas Diponegoro
                </p>
              </div>
            </Link>
          </div>

          {/* 2. Middle Column: Symmetrical Inline Nav (2xl+) */}
          <div className="flex items-center justify-center min-w-0">
            <nav className="hidden 2xl:flex items-center gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = (pathname !== '/' ? getInitialActive(pathname) : activeSection) === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(item, e)}
                    onMouseEnter={() => retroAudio.playBlip(620)}
                    className={`font-pixel text-[9px] px-3 py-1.5 border-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
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
          </div>

          {/* 3. Right Column: Action Controls with Fixed/Consistent Width */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0 pl-2 sm:pl-3 border-l-2 border-[#78350F]/70">
            {/* Replay Intro */}
            <button
              onClick={handleReplayIntro}
              className="hidden sm:inline-flex items-center gap-1.5 font-pixel text-[9px] bg-[#2A160E] hover:bg-[#3D1F13] text-amber-200 hover:text-[#FDE68A] px-3 py-2 border-2 border-[#78350F] shadow-[2px_2px_0_0_#000] transition-colors cursor-pointer whitespace-nowrap min-h-[44px]"
              title="Putar Ulang Animasi Gerbang Tembalang"
              aria-label="Putar Ulang Animasi Gerbang Tembalang"
            >
              <RotateCcw className="w-4 h-4 text-[#FDE68A] shrink-0" />
              <span className="hidden md:inline">RESTART INTRO</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 sm:px-3 sm:py-2 bg-[#2A160E] hover:bg-[#3D1F13] text-[#FDE68A] border border-[#78350F] shadow-[2px_2px_0_0_#000] flex items-center justify-center font-pixel text-[9px] cursor-pointer min-h-[44px] min-w-[44px] whitespace-nowrap"
              title={isMuted ? 'Aktifkan Suara Retro' : 'Bisukan Suara'}
              aria-label={isMuted ? 'Suara Mati' : 'Suara Hidup'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden lg:inline ml-1">{isMuted ? 'SFX: OFF' : 'SFX: ON'}</span>
            </button>

            {/* Main Action CTA */}
            {mounted && isComplete ? (
              <Link
                href="/results"
                onClick={() => retroAudio.playSelect()}
                className="font-pixel text-[9px] sm:text-xs bg-[#059669] hover:bg-[#10B981] text-white px-3 sm:px-4 py-2 border-2 border-[#064E3B] shadow-[2px_2px_0_0_#000] inline-flex items-center gap-1.5 cursor-pointer min-h-[44px] whitespace-nowrap"
                aria-label="Lihat Hasil Rekomendasi Program Studi"
              >
                <span>HASIL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href="/questionnaire"
                onClick={() => retroAudio.playSelect()}
                className="font-pixel text-[9px] sm:text-xs bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0A1128] font-bold px-3 sm:px-4 py-2 border-2 border-[#78350F] shadow-[2px_2px_0_0_#000] inline-flex items-center gap-1.5 cursor-pointer min-h-[44px] whitespace-nowrap"
                aria-label="Mulai Kuisioner Minat"
              >
                <span>
                  {mounted && answeredCount > 0
                    ? `QUEST (${answeredCount}/${totalQuestions})`
                    : 'MULAI TES'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Mobile / Tablet menu trigger (2xl:hidden) */}
            <button
              onClick={() => {
                retroAudio.playBlip(500);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="2xl:hidden p-2 bg-[#2A160E] hover:bg-[#3D1F13] text-[#FDE68A] border border-[#78350F] cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Menu (2xl:hidden) */}
      {mobileMenuOpen && (
        <div className="2xl:hidden bg-[#1A0E08] border-t-2 border-[#78350F] px-4 py-4 space-y-2.5 shadow-2xl animate-fade-in">
          {NAV_ITEMS.map((item) => {
            const isActive = (pathname !== '/' ? getInitialActive(pathname) : activeSection) === item.id;
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(item, e)}
                className={`flex items-center font-pixel text-[10px] sm:text-xs py-3 px-4 border transition-colors min-h-[44px] ${
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
            aria-label="Putar ulang animasi intro gerbang"
            className="w-full text-left font-pixel text-[10px] sm:text-xs py-3 px-4 bg-[#24130C] text-[#FDE68A] border border-[#78350F] hover:bg-[#341A10] cursor-pointer min-h-[44px] flex items-center"
          >
            ▶ PUTAR ULANG INTRO GERBANG
          </button>

          <div className="pt-2">
            <Link
              href="/questionnaire"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center flex items-center justify-center font-pixel text-[10px] sm:text-xs py-3.5 px-4 bg-[#F59E0B] text-[#0A1128] font-bold shadow-[2px_2px_0_0_#78350F] active:translate-x-0.5 active:translate-y-0.5 min-h-[44px]"
            >
              MASUK KE KUISIONER (36 PERTANYAAN)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
