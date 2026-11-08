'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { retroAudio } from '@/lib/retroAudio';
import {
  Banknote,
  GraduationCap,
  Calendar,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Home,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';

interface SubNavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SUBNAV_ITEMS: SubNavItem[] = [
  {
    id: 'biaya-ukt',
    label: 'BIAYA KULIAH (UKT)',
    href: '/langkah-selanjutnya/biaya-ukt',
    icon: Banknote,
  },
  {
    id: 'beasiswa',
    label: 'BEASISWA KIP-KULIAH',
    href: '/langkah-selanjutnya/beasiswa',
    icon: GraduationCap,
  },
  {
    id: 'jadwal-seleksi',
    label: 'JADWAL SELEKSI',
    href: '/langkah-selanjutnya/jadwal-seleksi',
    icon: Calendar,
  },
];

export default function LangkahSelanjutnyaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Determine current active subnav
  const activeSubnav = SUBNAV_ITEMS.find((item) => pathname === item.href);

  // Compute Linear Reading Loop (Prev / Next)
  const getLinearNavigation = () => {
    if (pathname === '/langkah-selanjutnya') {
      return {
        prev: null,
        next: { label: 'Biaya Kuliah (UKT)', href: '/langkah-selanjutnya/biaya-ukt' },
      };
    }
    if (pathname === '/langkah-selanjutnya/biaya-ukt') {
      return {
        prev: { label: 'Hub Informasi', href: '/langkah-selanjutnya' },
        next: { label: 'Beasiswa KIP-Kuliah', href: '/langkah-selanjutnya/beasiswa' },
      };
    }
    if (pathname === '/langkah-selanjutnya/beasiswa') {
      return {
        prev: { label: 'Biaya Kuliah (UKT)', href: '/langkah-selanjutnya/biaya-ukt' },
        next: { label: 'Jadwal Seleksi', href: '/langkah-selanjutnya/jadwal-seleksi' },
      };
    }
    if (pathname === '/langkah-selanjutnya/jadwal-seleksi') {
      return {
        prev: { label: 'Beasiswa KIP-Kuliah', href: '/langkah-selanjutnya/beasiswa' },
        next: { label: 'Kembali ke Beranda', href: '/' },
      };
    }
    return { prev: null, next: null };
  };

  const { prev, next } = getLinearNavigation();

  return (
    <div className="min-h-screen bg-[#0F0804] text-white flex flex-col justify-between selection:bg-[#F59E0B] selection:text-black w-full max-w-full overflow-x-clip">
      <div className="w-full max-w-full">
        {/* 1. Breadcrumbs */}
        <div className="bg-[#1A0E08]/80 border-b border-[#78350F]/60 px-3 sm:px-6 py-2.5 w-full">
          <div className="max-w-5xl mx-auto flex items-center gap-1.5 text-[10px] sm:text-xs font-pixel text-amber-200/80 overflow-x-auto whitespace-nowrap scrollbar-none">
            <Link
              href="/"
              onClick={() => retroAudio.playSelect()}
              className="flex items-center gap-1 hover:text-[#FDE68A] transition-colors p-1 shrink-0"
            >
              <Home className="w-3.5 h-3.5" />
              <span>BERANDA</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-amber-500/60 shrink-0" />

            <Link
              href="/langkah-selanjutnya"
              onClick={() => retroAudio.playSelect()}
              className={`hover:text-[#FDE68A] transition-colors p-1 shrink-0 ${
                pathname === '/langkah-selanjutnya' ? 'text-[#FDE68A] font-bold' : ''
              }`}
            >
              LANGKAH SELANJUTNYA
            </Link>

            {activeSubnav && (
              <>
                <ChevronRight className="w-3 h-3 text-amber-500/60 shrink-0" />
                <span className="text-[#FDE68A] font-bold p-1 truncate max-w-[140px] sm:max-w-none">
                  {activeSubnav.label}
                </span>
              </>
            )}
          </div>
        </div>

        {/* 2. Sticky 3-Pill Subnav */}
        <nav
          aria-label="Sub-navigasi Langkah Selanjutnya"
          className="sticky z-30 bg-[#1A0E08]/95 backdrop-blur-md border-b-2 border-[#78350F] px-2 sm:px-4 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.5)] w-full"
          style={{ top: 'var(--navbar-h, 56px)' }}
        >
          <div className="max-w-5xl mx-auto flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-0.5">
            {SUBNAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => retroAudio.playSelect()}
                  className={`font-pixel text-[8px] sm:text-[9.5px] px-3 sm:px-4 py-2.5 border-2 rounded-xl transition-all flex items-center gap-1.5 sm:gap-2 shrink-0 min-h-[44px] cursor-pointer ${
                    isActive
                      ? 'bg-[#9A3412] text-[#FDE68A] border-[#FDE68A] shadow-[2px_2px_0_0_#F59E0B]'
                      : 'bg-[#24130C] hover:bg-[#341A10] text-amber-100/90 border-[#78350F] hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* 3. Main Content Area */}
        <main id="main-content" className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
          {children}

          {/* 4. Previous / Next Linear Reading Controls */}
          {(prev || next) && (
            <div className="mt-8 pt-6 border-t-2 border-[#78350F]/60 flex items-center justify-between gap-3 flex-wrap">
              {prev ? (
                <Link
                  href={prev.href}
                  onClick={() => retroAudio.playSelect()}
                  className="inline-flex items-center gap-2 bg-[#24130C] hover:bg-[#341A10] text-amber-200 hover:text-white px-4 py-2.5 rounded-xl border border-[#78350F] font-pixel text-[8.5px] sm:text-[10px] min-h-[44px] transition-colors shadow-xs"
                >
                  <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                  <span>‹ {prev.label}</span>
                </Link>
              ) : (
                <div />
              )}

              {next && (
                <Link
                  href={next.href}
                  onClick={() => retroAudio.playSelect()}
                  className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#FBBF24] text-stone-950 font-bold px-4 py-2.5 rounded-xl border-2 border-[#78350F] font-pixel text-[8.5px] sm:text-[10px] min-h-[44px] transition-colors shadow-[2px_2px_0_0_#000]"
                >
                  <span>{next.label} ›</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              )}
            </div>
          )}
        </main>
      </div>

      {/* 5. Common Official Disclaimer Footer */}
      <footer className="border-t-2 border-[#78350F] bg-[#140B07] px-4 py-6 text-center text-xs text-amber-200/70 space-y-3">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 font-mono text-[11px] text-amber-300">
          <ShieldAlert className="w-4 h-4 text-[#F59E0B] shrink-0" />
          <span>Sumber Resmi: SK Rektor UNDIP & Kepmendikbudristek RI</span>
        </div>
        <p className="max-w-2xl mx-auto font-mono text-[10px] leading-relaxed text-amber-200/60">
          Seluruh besaran tarif UKT dan daya tampung diambil langsung dari dokumen resmi SK Rektor. Informasi KIP-Kuliah dan jadwal seleksi mengikuti ketentuan SNPMB tahun berjalan tanpa manipulasi angka.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-1 font-mono text-xs">
          <a
            href="https://pmb.undip.ac.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 underline min-h-[44px] py-2"
          >
            <span>Portal PMB UNDIP</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-[#78350F]">•</span>
          <a
            href="https://snpmb.bppp.kemdikbud.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 underline min-h-[44px] py-2"
          >
            <span>Portal SNPMB Kemdikbud</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span className="text-[#78350F]">•</span>
          <a
            href="https://kip-kuliah.kemdikbud.go.id"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 underline min-h-[44px] py-2"
          >
            <span>Portal KIP-Kuliah</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
}
