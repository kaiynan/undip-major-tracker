'use client';

import React, { useState, useEffect, useRef, useSyncExternalStore, useCallback } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ArrowRight, Volume2, VolumeX, RotateCcw, ChevronRight } from 'lucide-react';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { retroAudio } from '@/lib/retroAudio';

interface InlineNavItem {
  id: 'beranda' | 'jelajahi' | 'langkah-selanjutnya';
  label: string;
  href: string;
}

const INLINE_NAV_ITEMS: InlineNavItem[] = [
  { id: 'beranda', label: 'BERANDA', href: '/#beranda' },
  { id: 'jelajahi', label: 'DAFTAR PROGRAM STUDI', href: '/program-studi' },
  { id: 'langkah-selanjutnya', label: 'LANGKAH SELANJUTNYA', href: '/langkah-selanjutnya' },
];

const subscribeNoop = () => () => {};

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLDivElement>(null);

  const { answeredCount, totalQuestions, isComplete } = useQuestionnaire();
  const [menuOpen, setMenuOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [isMuted, setIsMuted] = useState(() => (typeof window !== 'undefined' ? retroAudio.isMuted() : false));

  // Determine active section for scroll anchors on homepage
  const [activeSection, setActiveSection] = useState<'beranda' | 'cara-kerja' | 'tentang-kami' | null>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['beranda', 'cara-kerja', 'tentang-kami'].includes(hash)) {
        return hash as 'beranda' | 'cara-kerja' | 'tentang-kami';
      }
    }
    return 'beranda';
  });

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

  // Sync scroll on homepage for anchor highlighting
  useEffect(() => {
    if (pathname !== '/') return;

    const handleScroll = () => {
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

    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['beranda', 'cara-kerja', 'tentang-kami'].includes(hash)) {
        setActiveSection(hash as 'beranda' | 'cara-kerja' | 'tentang-kami');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleHash);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHash);
    };
  }, [pathname]);

  // Close menu on route change during render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  // Close handler with focus return
  const closeMenu = useCallback((returnFocus = true) => {
    setMenuOpen(false);
    if (returnFocus) {
      setTimeout(() => {
        menuButtonRef.current?.focus();
      }, 50);
    }
  }, []);

  // Close menu on Escape or outside click/tap
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu(true);
      }
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        menuPanelRef.current &&
        !menuPanelRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        closeMenu(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [menuOpen, closeMenu]);

  // Body scroll lock on mobile when sheet is open (< 1024px)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isMobile = window.innerWidth < 1024;
    if (menuOpen && isMobile) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [menuOpen]);

  // Sound toggle
  const handleToggleSound = () => {
    const nextMuted = retroAudio.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      retroAudio.playBlip(750);
    }
  };

  // Replay intro
  const handleReplayIntro = () => {
    closeMenu(false);
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

  // Anchor navigation handler
  const handleAnchorClick = (targetId: string, e: React.MouseEvent) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('undip:skip-intro'));
    }
    closeMenu(false);
    retroAudio.playSelect();

    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) {
        const navOffset = window.innerWidth >= 640 ? 64 : 56;
        const pos = el.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: Math.max(0, pos - navOffset),
          behavior: 'smooth',
        });
        window.history.pushState(null, '', `#${targetId}`);
        setActiveSection(targetId as 'beranda' | 'cara-kerja' | 'tentang-kami');
      }
    }
  };

  const isInlineActive = (item: InlineNavItem) => {
    if (item.id === 'beranda') {
      return pathname === '/' && (!activeSection || activeSection === 'beranda');
    }
    if (item.id === 'jelajahi') {
      return pathname === '/program-studi' || pathname.startsWith('/program/');
    }
    if (item.id === 'langkah-selanjutnya') {
      return pathname.startsWith('/langkah-selanjutnya');
    }
    return false;
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
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new CustomEvent('undip:skip-intro'));
                }
                closeMenu(false);
                retroAudio.playSelect();
              }}
              className="flex items-center gap-1 sm:gap-2 group cursor-pointer shrink-0 min-h-[44px] min-w-[44px]"
              aria-label="Undip Major Matcher - Beranda"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#2A160E] border-2 border-[#F59E0B] flex items-center justify-center text-[#FDE68A] shadow-[2px_2px_0_0_#000] group-hover:bg-[#3D1F13] transition-colors shrink-0">
                <span className="font-pixel text-[11px] sm:text-xs">U</span>
              </div>
              <div className="shrink-0 flex flex-col justify-center" data-testid="navbar-brand-text">
                {/* On phone <= 430px: two-line stack so full name is visible without truncation */}
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

          {/* 2. Middle Column: Inline Nav (visible at >= lg / 1024px) */}
          <div className="flex items-center justify-center min-w-0">
            <nav className="navbar-desktop-nav" aria-label="Navigasi Utama">
              {INLINE_NAV_ITEMS.map((item) => {
                const active = isInlineActive(item);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      if (item.id === 'beranda') {
                        handleAnchorClick('beranda', e);
                      } else {
                        retroAudio.playSelect();
                      }
                    }}
                    onMouseEnter={() => retroAudio.playBlip(620)}
                    className={`navbar-nav-link ${
                      active
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

          {/* 3. Right Column: Action Controls (Primary CTA + Single MENU button) */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0 pl-1 sm:pl-3 border-l-2 border-[#78350F]/70">
            {/* Primary CTA */}
            {mounted && isComplete ? (
              <Link
                href="/results"
                onClick={() => retroAudio.playSelect()}
                className="font-pixel text-[7.5px] xs:text-[8.5px] sm:text-xs bg-[#059669] hover:bg-[#10B981] text-white px-2 xs:px-3 sm:px-4 py-2 border-2 border-[#064E3B] shadow-[2px_2px_0_0_#000] inline-flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer min-h-[44px] shrink-0 whitespace-nowrap"
                aria-label="Lihat Hasil Rekomendasi Program Studi"
              >
                <span>HASIL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href="/questionnaire"
                onClick={() => retroAudio.playSelect()}
                className="font-pixel text-[7.5px] xs:text-[8.5px] sm:text-xs bg-[#F59E0B] hover:bg-[#FBBF24] text-[#0A1128] font-bold px-2 xs:px-3 sm:px-4 py-2 border-2 border-[#78350F] shadow-[2px_2px_0_0_#000] inline-flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer min-h-[44px] shrink-0 whitespace-nowrap"
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

            {/* Single MENU Trigger Button */}
            <button
              ref={menuButtonRef}
              onClick={() => {
                retroAudio.playBlip(520);
                setMenuOpen(!menuOpen);
              }}
              className={`p-2 xl:px-3 xl:py-2 flex items-center justify-center gap-1.5 font-pixel text-[9px] border transition-colors cursor-pointer min-h-[44px] min-w-[44px] shrink-0 ${
                menuOpen
                  ? 'bg-[#9A3412] text-[#FDE68A] border-[#FDE68A] shadow-[2px_2px_0_0_#F59E0B]'
                  : 'bg-[#2A160E] hover:bg-[#3D1F13] text-[#FDE68A] border-[#78350F] shadow-[2px_2px_0_0_#000]'
              }`}
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              aria-controls="navbar-menu-panel"
            >
              {menuOpen ? <X className="w-4 h-4 text-[#FDE68A] shrink-0" /> : <Menu className="w-4 h-4 text-[#FDE68A] shrink-0" />}
              <span className="navbar-menu-label whitespace-nowrap">MENU</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Unified Grouped Menu Panel */}
      {menuOpen && (
        <>
          {/* Backdrop on mobile/tablet */}
          <div
            className="lg:hidden fixed inset-0 top-[var(--navbar-h,56px)] bg-black/60 backdrop-blur-xs z-40 animate-fade-in"
            onClick={() => closeMenu(false)}
            aria-hidden="true"
          />

          <div
            id="navbar-menu-panel"
            ref={menuPanelRef}
            role="dialog"
            aria-label="Menu Navigasi"
            className="z-50 animate-fade-in bg-[#1A0E08] border-b-4 border-[#78350F] shadow-2xl select-none text-white fixed lg:absolute left-0 right-0 lg:left-auto lg:right-2 xl:right-6 top-[var(--navbar-h,56px)] lg:top-full lg:mt-2 w-full lg:w-84 max-h-[calc(100dvh-var(--navbar-h,56px))] lg:max-h-[85vh] overflow-y-auto pixel-border-md p-4 space-y-4"
          >
            {/* GROUP 1: JELAJAHI */}
            <div>
              <div className="font-pixel text-[8.5px] text-[#F59E0B] uppercase tracking-wider mb-1.5 pb-1 border-b border-[#78350F]/70 flex items-center justify-between">
                <span>Jelajahi</span>
              </div>
              <div className="space-y-1">
                <Link
                  href="/#cara-kerja"
                  onClick={(e) => handleAnchorClick('cara-kerja', e)}
                  className={`flex items-center justify-between px-3 py-2 font-pixel text-[9px] border transition-colors min-h-[44px] ${
                    pathname === '/' && activeSection === 'cara-kerja'
                      ? 'bg-[#9A3412] text-[#FDE68A] border-[#FDE68A]'
                      : 'bg-[#24130C] text-amber-100 hover:text-white border-[#78350F] hover:bg-[#341A10]'
                  }`}
                >
                  <span>Cara Kerja</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-300/70" />
                </Link>
                <Link
                  href="/#tentang-kami"
                  onClick={(e) => handleAnchorClick('tentang-kami', e)}
                  className={`flex items-center justify-between px-3 py-2 font-pixel text-[9px] border transition-colors min-h-[44px] ${
                    pathname === '/' && activeSection === 'tentang-kami'
                      ? 'bg-[#9A3412] text-[#FDE68A] border-[#FDE68A]'
                      : 'bg-[#24130C] text-amber-100 hover:text-white border-[#78350F] hover:bg-[#341A10]'
                  }`}
                >
                  <span>Tentang Kami</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-300/70" />
                </Link>
              </div>
            </div>

            {/* GROUP 2: INFORMASI MASUK UNDIP */}
            <div>
              <Link
                href="/langkah-selanjutnya"
                onClick={() => {
                  retroAudio.playSelect();
                  closeMenu(false);
                }}
                className={`font-pixel text-[8.5px] uppercase tracking-wider mb-1.5 pb-1 border-b border-[#78350F]/70 flex items-center justify-between transition-colors ${
                  pathname === '/langkah-selanjutnya'
                    ? 'text-[#FDE68A]'
                    : 'text-[#F59E0B] hover:text-[#FDE68A]'
                }`}
                aria-label="Menuju Hub Informasi Masuk UNDIP"
              >
                <span>Informasi Masuk UNDIP</span>
                <span className="text-[7.5px] font-mono text-amber-300/80">BUKA HUB ›</span>
              </Link>
              <div className="space-y-1">
                <Link
                  href="/langkah-selanjutnya/biaya-ukt"
                  onClick={() => {
                    retroAudio.playSelect();
                    closeMenu(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 font-pixel text-[9px] border transition-colors min-h-[44px] ${
                    pathname === '/langkah-selanjutnya/biaya-ukt'
                      ? 'bg-[#9A3412] text-[#FDE68A] border-[#FDE68A]'
                      : 'bg-[#24130C] text-amber-100 hover:text-white border-[#78350F] hover:bg-[#341A10]'
                  }`}
                >
                  <span>Biaya Kuliah (UKT)</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-300/70" />
                </Link>
                <Link
                  href="/langkah-selanjutnya/beasiswa"
                  onClick={() => {
                    retroAudio.playSelect();
                    closeMenu(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 font-pixel text-[9px] border transition-colors min-h-[44px] ${
                    pathname === '/langkah-selanjutnya/beasiswa'
                      ? 'bg-[#9A3412] text-[#FDE68A] border-[#FDE68A]'
                      : 'bg-[#24130C] text-amber-100 hover:text-white border-[#78350F] hover:bg-[#341A10]'
                  }`}
                >
                  <span>Beasiswa KIP-Kuliah</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-300/70" />
                </Link>
                <Link
                  href="/langkah-selanjutnya/jadwal-seleksi"
                  onClick={() => {
                    retroAudio.playSelect();
                    closeMenu(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 font-pixel text-[9px] border transition-colors min-h-[44px] ${
                    pathname === '/langkah-selanjutnya/jadwal-seleksi'
                      ? 'bg-[#9A3412] text-[#FDE68A] border-[#FDE68A]'
                      : 'bg-[#24130C] text-amber-100 hover:text-white border-[#78350F] hover:bg-[#341A10]'
                  }`}
                >
                  <span>Jadwal Seleksi</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-300/70" />
                </Link>
              </div>
            </div>

            {/* GROUP 3: LAINNYA */}
            <div>
              <div className="font-pixel text-[8.5px] text-[#F59E0B] uppercase tracking-wider mb-1.5 pb-1 border-b border-[#78350F]/70 flex items-center justify-between">
                <span>Lainnya</span>
              </div>
              <div className="space-y-1">
                <Link
                  href="/admin"
                  onClick={() => {
                    retroAudio.playSelect();
                    closeMenu(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2 font-pixel text-[9px] border transition-colors min-h-[44px] ${
                    pathname === '/admin'
                      ? 'bg-[#9A3412] text-[#FDE68A] border-[#FDE68A]'
                      : 'bg-[#24130C] text-amber-100 hover:text-white border-[#78350F] hover:bg-[#341A10]'
                  }`}
                >
                  <span>Algoritma HMIM</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-300/70" />
                </Link>

                <button
                  onClick={handleReplayIntro}
                  className="w-full text-left font-pixel text-[9px] px-3 py-2 bg-[#24130C] hover:bg-[#341A10] text-[#FDE68A] border border-[#78350F] cursor-pointer min-h-[44px] flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-3.5 h-3.5 text-[#FDE68A] shrink-0" />
                    <span>Putar Ulang Intro</span>
                  </div>
                  <span className="font-mono text-[8px] text-amber-300/60">[RESET]</span>
                </button>

                <button
                  onClick={handleToggleSound}
                  className="w-full text-left font-pixel text-[9px] px-3 py-2 bg-[#24130C] hover:bg-[#341A10] text-[#FDE68A] border border-[#78350F] cursor-pointer min-h-[44px] flex items-center justify-between transition-colors"
                  aria-label={isMuted ? 'Aktifkan Suara' : 'Bisukan Suara'}
                >
                  <div className="flex items-center gap-2">
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400 shrink-0" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    <span>{isMuted ? 'Suara: Mati' : 'Suara: Nyala'}</span>
                  </div>
                  <span className={`font-pixel text-[7.5px] px-1.5 py-0.5 border ${isMuted ? 'bg-red-950/80 text-red-300 border-red-700' : 'bg-emerald-950/80 text-emerald-300 border-emerald-600'}`}>
                    {isMuted ? 'OFF' : 'ON'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
