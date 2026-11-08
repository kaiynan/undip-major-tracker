'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ArrowRight, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { retroAudio } from '@/lib/retroAudio';

interface NavItem {
  id: 'beranda' | 'cara-kerja' | 'tentang-kami' | 'jelajahi' | 'admin';
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'beranda', label: 'BERANDA', href: '/#beranda' },
  { id: 'cara-kerja', label: 'CARA KERJA', href: '/#cara-kerja' },
  { id: 'tentang-kami', label: 'TENTANG KAMI', href: '/#tentang-kami' },
  { id: 'jelajahi', label: 'DAFTAR PROGRAM STUDI', href: '/program-studi' },
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

  const getInitialActive = (path: string): 'beranda' | 'cara-kerja' | 'tentang-kami' | 'jelajahi' | 'admin' | null => {
    if (path === '/program-studi' || path.startsWith('/program/')) return 'jelajahi';
    if (path === '/results') return null;
    if (path === '/admin') return 'admin';
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['beranda', 'cara-kerja', 'tentang-kami'].includes(hash)) {
        return hash as 'beranda' | 'cara-kerja' | 'tentang-kami';
      }
    }
    return 'beranda';
  };

  const [activeSection, setActiveSection] = useState<'beranda' | 'cara-kerja' | 'tentang-kami' | 'jelajahi' | 'admin' | null>(() => getInitialActive(pathname));

  // Handle active navigation state on homepage scroll
  useEffect(() => {
    if (pathname !== '/') {
      return;
    }

    const updateActiveSectionOnScroll = () => {
      const scrollY = window.scrollY;
      const caraKerjaEl = document.getElementById('cara-kerja');
      const tentangKamiEl = document.getElementById('tentang-kami');

      const caraKerjaTop = caraKerjaEl ? caraKerjaEl.getBoundingClientRect().top + scrollY - 180 : Infinity;
      const tentangKamiTop = tentangKamiEl ? tentangKamiEl.getBoundingClientRect().top + scrollY - 220 : Infinity;

      if (scrollY >= tentangKamiTop - 50) {
        setActiveSection('tentang-kami');
      } else if (scrollY >= caraKerjaTop - 50) {
        setActiveSection('cara-kerja');
      } else {
        setActiveSection('beranda');
      }
    };

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['beranda', 'cara-kerja', 'tentang-kami'].includes(hash)) {
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
      const element = document.getElementById('beranda');
      if (element) {
        const navOffset = window.innerWidth >= 640 ? 64 : 56;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: Math.max(0, elementPosition - navOffset),
          behavior: 'smooth',
        });
        window.history.pushState(null, '', '#beranda');
      }
    }
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 w-full bg-[#1A0E08]/95 backdrop-blur-md border-b-4 border-[#78350F] text-white select-none pixelated shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
      style={{ position: 'sticky', top: 0, paddingTop: 'env(safe-area-inset-top, 0px)' }}
    >
      <div className="w-full px-2 sm:px-6 xl:px-8">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center h-14 sm:h-16 gap-1 sm:gap-4 w-full">
          {/* 1. Left Column: Brand Identity */}
          <div className="flex items-center justify-start shrink-0">
            <Link
              href="/"
              onClick={(e) => handleNavClick(NAV_ITEMS[0], e)}
              className="flex items-center gap-1 sm:gap-2 group cursor-pointer shrink-0 min-h-[44px] min-w-[44px]"
              aria-label="Undip Major Matcher - Beranda"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#2A160E] border-2 border-[#F59E0B] flex items-center justify-center text-[#FDE68A] shadow-[2px_2px_0_0_#000] group-hover:bg-[#3D1F13] transition-colors shrink-0">
                <span className="font-pixel text-[11px] sm:text-xs">U</span>
              </div>
              <div className="shrink-0 flex flex-col justify-center" data-testid="navbar-brand-text">
                {/* On phone <= 430px: two-line stack with tighter tracking so full name is visible without truncation */}
                <div className="navbar-brand-mobile leading-none gap-0.5">
                  <span className="font-pixel text-[7.5px] text-[#FDE68A] tracking-wider leading-none whitespace-nowrap">
                    UNDIP
                  </span>
                  <span className="font-pixel text-[6.5px] text-white tracking-tight leading-none whitespace-nowrap">
                    MAJOR MATCHER
                  </span>
                </div>
                {/* On screens > 430px: single line */}
                <div className="navbar-brand-desktop gap-1.5">
                  <span className="font-pixel text-[8.5px] md:text-xs text-white tracking-wide shrink-0 whitespace-nowrap">
                    UNDIP MAJOR MATCHER
                  </span>
                </div>
                <p className="navbar-tagline text-[10px] text-amber-200/80 font-mono whitespace-nowrap">
                  Eksplorasi Minat Program Studi Universitas Diponegoro
                </p>
              </div>
            </Link>
          </div>

          {/* 2. Middle Column: Symmetrical Inline Nav (shown only where it fits: >= 1200px) */}
          <div className="flex items-center justify-center min-w-0">
            <nav className="navbar-desktop-nav">
              {NAV_ITEMS.map((item) => {
                const isActive = (pathname !== '/' ? getInitialActive(pathname) : activeSection) === item.id;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(item, e)}
                    onMouseEnter={() => retroAudio.playBlip(620)}
                    className={`navbar-nav-link ${
                      isActive
                        ? 'bg-[#9A3412] text-[#FDE68A] border-[#FDE68A] shadow-[2px_2px_0_0_#F59E0B]'
                        : 'bg-[#2A160E] text-amber-100/80 border-[#78350F] hover:text-white hover:bg-[#3D1F13]'
                    }`}
                  >
                    {item.id === 'jelajahi' ? (
                      <span>
                        <span className="hidden min-[1380px]:inline">DAFTAR </span>
                        PROGRAM STUDI
                      </span>
                    ) : (
                      item.label
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* 3. Right Column: Action Controls with Fixed/Consistent Width */}
          <div className="flex items-center justify-end gap-1 sm:gap-2 shrink-0 pl-1 sm:pl-3 border-l-2 border-[#78350F]/70">
            {/* Replay Intro: icon-only below 1540px, hidden on mobile */}
            <button
              onClick={handleReplayIntro}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 font-pixel text-[9px] bg-[#2A160E] hover:bg-[#3D1F13] text-amber-200 hover:text-[#FDE68A] p-2 min-[1540px]:px-3 py-2 border-2 border-[#78350F] shadow-[2px_2px_0_0_#000] transition-colors cursor-pointer whitespace-nowrap min-h-[44px] min-w-[44px] shrink-0"
              title="Putar Ulang Animasi Gerbang Tembalang"
              aria-label="Putar Ulang Animasi Gerbang Tembalang"
            >
              <RotateCcw className="w-4 h-4 text-[#FDE68A] shrink-0" />
              <span className="navbar-restart-text">RESTART INTRO</span>
            </button>

            {/* Audio Toggle: icon-only below 1480px */}
            <button
              onClick={handleToggleSound}
              className="p-2 min-[1480px]:px-3 min-[1480px]:py-2 bg-[#2A160E] hover:bg-[#3D1F13] text-[#FDE68A] border border-[#78350F] shadow-[2px_2px_0_0_#000] flex items-center justify-center font-pixel text-[9px] cursor-pointer min-h-[44px] min-w-[44px] shrink-0 whitespace-nowrap"
              title={isMuted ? 'Aktifkan Suara Retro' : 'Bisukan Suara'}
              aria-label={isMuted ? 'Suara Mati' : 'Suara Hidup'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="navbar-sfx-text ml-1">{isMuted ? 'SFX: OFF' : 'SFX: ON'}</span>
            </button>

            {/* Main Action CTA */}
            {mounted && isComplete ? (
              <Link
                href="/results"
                onClick={() => retroAudio.playSelect()}
                className="font-pixel text-[7.5px] xs:text-[8.5px] sm:text-xs bg-[#059669] hover:bg-[#10B981] text-white px-1.5 xs:px-2.5 sm:px-4 py-2 border-2 border-[#064E3B] shadow-[2px_2px_0_0_#000] inline-flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer min-h-[44px] shrink-0 whitespace-nowrap"
                aria-label="Lihat Hasil Rekomendasi Program Studi"
              >
                <span>HASIL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href="/questionnaire"
                onClick={() => retroAudio.playSelect()}
                className="font-pixel text-[7.5px] xs:text-[8.5px] sm:text-xs bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0A1128] font-bold px-1.5 xs:px-2.5 sm:px-4 py-2 border-2 border-[#78350F] shadow-[2px_2px_0_0_#000] inline-flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer min-h-[44px] shrink-0 whitespace-nowrap"
                aria-label="Mulai Kuisioner Minat"
              >
                <span>
                  {mounted && answeredCount > 0 ? (
                    <>
                      <span className="max-[360px]:hidden">QUEST </span>({answeredCount}/{totalQuestions})
                    </>
                  ) : (
                    <>
                      <span className="max-[360px]:hidden">MULAI </span>TES
                    </>
                  )}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {/* Mobile / Tablet menu trigger (hidden when inline nav fits: >= 1200px) */}
            <button
              onClick={() => {
                retroAudio.playBlip(500);
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="navbar-mobile-toggle p-2 bg-[#2A160E] hover:bg-[#3D1F13] text-[#FDE68A] border border-[#78350F] cursor-pointer min-h-[44px] min-w-[44px] shrink-0"
              aria-label="Buka Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Menu (hidden when inline nav fits: >= 1140px) */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu bg-[#1A0E08] border-t-2 border-[#78350F] px-4 py-4 space-y-2.5 shadow-2xl animate-fade-in">
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
            aria-label="Putar Ulang Intro"
            className="w-full text-left font-pixel text-[10px] sm:text-xs py-3 px-4 bg-[#24130C] text-[#FDE68A] border border-[#78350F] hover:bg-[#341A10] cursor-pointer min-h-[44px] flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-[#FDE68A] shrink-0" />
            <span>Putar Ulang Intro</span>
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
