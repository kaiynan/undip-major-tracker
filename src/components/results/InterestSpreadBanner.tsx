'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, Scale } from 'lucide-react';
import { ConsultCta } from '@/components/contact/ConsultCta';

interface InterestSpreadBannerProps {
  gap1_5?: number;
  className?: string;
  topProgramNames?: string[];
}

/**
 * Peringatan afirmatif "Minat Tersebar" saat selisih skor prodi #1 dan #5 <= INTEREST_SPREAD_THRESHOLD.
 *
 * Memberi panduan netral dan solutif kepada pengguna untuk menyimpan ke Favorit,
 * membandingkan program studi, atau berkonsultasi dengan tim pendamping SERADIP.
 *
 * Tidak pernah mengubah formula perhitungan maupun urutan pemeringkatan.
 */
export function InterestSpreadBanner({
  className = '',
  topProgramNames = [],
}: InterestSpreadBannerProps) {
  return (
    <div
      data-testid="interest-spread-banner"
      className={`bg-[#24130C] rounded-2xl p-4 sm:p-5 border-2 border-amber-500/80 shadow-[0_4px_20px_rgba(0,0,0,0.5)] text-slate-100 space-y-3.5 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 sm:p-2.5 bg-[#78350F] border border-[#F59E0B] rounded-xl text-[#FDE68A] shrink-0 mt-0.5">
          <Compass className="w-5 h-5 text-amber-400" />
        </div>
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[9px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded font-black tracking-wider uppercase">
              Minat Tersebar
            </span>
          </div>
          <p className="text-xs sm:text-sm text-amber-100/95 leading-relaxed font-sans pt-0.5">
            Minatmu cukup tersebar, jadi beberapa prodi di peringkat atas nilainya berdekatan. Coba simpan ke Favorit dan bandingkan beberapa prodi, atau konsultasi dengan SERADIP.
          </p>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-1 border-t border-[#78350F]/70">
        <Link
          href="/favorit"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-stone-950 bg-[#F59E0B] hover:bg-amber-400 border-2 border-amber-600 transition-all shadow-[2px_2px_0_0_#000] cursor-pointer min-h-[44px]"
        >
          <Scale className="w-4 h-4 text-stone-950" />
          <span>Lihat Favorit & Bandingkan</span>
        </Link>

        {/* Consult CTA (Section 4) - Gracefully hides if contact is not configured */}
        <ConsultCta
          variant="inline"
          topProgramNames={topProgramNames}
          buttonText="Konsultasi SERADIP"
        />
      </div>
    </div>
  );
}
