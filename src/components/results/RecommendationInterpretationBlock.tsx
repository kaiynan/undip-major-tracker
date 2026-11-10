'use client';

import React, { useState } from 'react';
import { DimensionScore, ProgramScore, StudyProgram } from '@/data/types';
import { faculties } from '@/data/faculties';
import { getInterestTitle } from '@/lib/interestTitle';
import { getTopThreeComparison } from '@/lib/matchReasons';
import { TierBadge } from '@/components/ui/TierBadge';
import { Trophy, BarChart3, Layers } from 'lucide-react';

export interface RecommendationInterpretationBlockProps {
  programScores: ProgramScore[];
  programs: StudyProgram[];
  dimensionScores: DimensionScore | null;
  userSummary?: {
    topRiasec: { code: string; label: string; score: number }[];
    topDomain: { code: string; label: string; score: number };
    topLearning: { code: string; label: string; score: number };
    topCurriculum?: { code: string; label: string; score: number };
  } | null;
  nickname?: string;
  className?: string;
}

export function RecommendationInterpretationBlock({
  programScores,
  programs,
  dimensionScores,
  userSummary,
  nickname,
  className = '',
}: RecommendationInterpretationBlockProps) {
  const [showDimensionDetail, setShowDimensionDetail] = useState(false);

  // Derive interest title from top RIASEC
  const interestTitle = React.useMemo(() => {
    return getInterestTitle(userSummary?.topRiasec);
  }, [userSummary?.topRiasec]);

  // Build faculty lookup map
  const facultyMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const f of faculties) {
      map[f.id] = f.name;
    }
    return map;
  }, []);

  // Compute top 3 detailed comparisons
  const topThreeComp = React.useMemo(() => {
    if (!dimensionScores || !programScores || programScores.length === 0) return null;
    return getTopThreeComparison(
      dimensionScores,
      programScores.slice(0, 3).map((p) => ({
        programId: p.programId,
        totalScore: p.totalScore,
        tier: p.tier,
      })),
      programs,
      facultyMap
    );
  }, [dimensionScores, programScores, programs, facultyMap]);

  if (!topThreeComp || topThreeComp.explanations.length === 0) {
    return null;
  }

  const p1 = topThreeComp.explanations[0];
  const p2 = topThreeComp.explanations[1];
  const p3 = topThreeComp.explanations[2];

  // Headline string
  const headline = nickname && nickname.trim()
    ? `Hasil Eksplorasi Minat ${nickname.trim()}`
    : 'Hasil Eksplorasi Minatmu';

  return (
    <div
      data-testid="recommendation-interpretation-block"
      className={`bg-[#190E08] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-[#78350F] shadow-xl space-y-5 ${className}`}
    >
      {/* 1. Header: Personal Interest Profile */}
      <div className="border-b border-[#78350F]/70 pb-4 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[8px] sm:text-[9px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded font-black border border-amber-400">
              STAGE CLEAR
            </span>
            <span className="text-xs text-amber-300 font-bold font-mono">
              PROFIL MINAT AKADEMIK
            </span>
          </div>
          <span className="font-pixel text-[9px] text-amber-200/70">
            {interestTitle.codePair}
          </span>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-black text-[#FFFBEB] font-sans">
            {headline}
          </h3>
          <div className="mt-1 flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-bold text-amber-300 font-pixel">
              {interestTitle.title}
            </span>
            <span className="text-xs text-amber-200/80 font-mono">
              ({interestTitle.subtitle})
            </span>
          </div>
        </div>

        {/* Interest Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          {userSummary?.topDomain && (
            <span className="bg-[#2A160E] border border-amber-600/70 text-amber-200 px-2.5 py-1 rounded-lg">
              Domain: <strong className="text-white">{userSummary.topDomain.label}</strong>
            </span>
          )}
          {userSummary?.topLearning && (
            <span className="bg-[#2A160E] border border-amber-700/60 text-amber-200 px-2.5 py-1 rounded-lg">
              Aktivitas: <strong className="text-white">{userSummary.topLearning.label}</strong>
            </span>
          )}
          {userSummary?.topCurriculum && (
            <span className="bg-[#2A160E] border border-amber-800/60 text-amber-200 px-2.5 py-1 rounded-lg">
              Kurikulum: <strong className="text-white">{userSummary.topCurriculum.label}</strong>
            </span>
          )}
        </div>

        {/* Narrative interpretation */}
        <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed pt-1">
          {interestTitle.narrative}
        </p>
      </div>

      {/* 2. Top 3 Distinct Recommendation Explanations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-pixel text-[9.5px] sm:text-xs text-amber-300 uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Mengapa 3 Program Studi Ini Direkomendasikan?</span>
          </h4>
          <span className="text-[10px] text-amber-200/60 font-mono">Top 3 Ranking</span>
        </div>

        <div className="space-y-3">
          {topThreeComp.explanations.map((item, idx) => {
            const isFirst = idx === 0;
            return (
              <div
                key={item.programId}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  isFirst
                    ? 'bg-[#24130C] border-amber-500 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-[#1D0F09] border-[#78350F]/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-pixel text-xs font-bold shrink-0 mt-0.5 ${
                        idx === 0
                          ? 'bg-amber-400 text-stone-950'
                          : idx === 1
                          ? 'bg-amber-200 text-stone-950'
                          : 'bg-amber-100 text-stone-950'
                      }`}
                    >
                      #{item.rank}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h5 className="font-bold text-sm sm:text-base text-white truncate">
                          {item.programName}
                        </h5>
                        <TierBadge tier={item.tier as 'S' | 'A' | 'B' | 'C' | 'D'} size="sm" />
                      </div>
                      <span className="text-[11px] text-amber-200/80 font-mono">
                        {item.facultyName} • Kecocokan {item.score}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specific Reason */}
                <p className="text-xs text-amber-100/95 mt-2.5 leading-relaxed">
                  <strong className="text-amber-300">Alasan Utama: </strong>
                  {item.primaryReason}
                </p>

                {/* Dimension Contribution & Exploration Tip */}
                <div className="mt-2 pt-2 border-t border-[#78350F]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px]">
                  <span className="text-amber-200/80">
                    Dimensi Unggul: <strong className="text-white">{item.dominantDimension.name}</strong> ({item.dominantDimension.weightPercent}% bobot)
                  </span>
                  <span className="text-amber-300/80 font-sans">
                    {item.explorationTip}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Comparison & Score Gap Analysis */}
      {p1 && p2 && (
        <div className="bg-[#140B07] rounded-xl p-3.5 sm:p-4 border border-[#78350F]/80 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 font-pixel text-[9px]">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>ANALISIS SELISIH SKOR REKOMENDASI</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="bg-[#24130C] px-2.5 py-1 rounded border border-[#78350F] text-amber-100">
              #1 ke #2: <strong className="text-amber-300">+{topThreeComp.gap1_2}%</strong>
            </span>
            {p3 && (
              <span className="bg-[#24130C] px-2.5 py-1 rounded border border-[#78350F] text-amber-100">
                #2 ke #3: <strong className="text-amber-300">+{topThreeComp.gap2_3}%</strong>
              </span>
            )}
          </div>

          <p className="text-xs text-amber-100/80 leading-relaxed font-sans">
            {topThreeComp.comparisonSummary}
          </p>

          <p className="text-[10px] text-amber-200/50 italic leading-snug pt-1 border-t border-[#78350F]/40">
            * Selisih skor mencerminkan tingkat keselarasan minat dalam model HMIM, bukan ukuran kemampuan akademik, kepastian kecocokan mutlak, ataupun probabilitas diterima di UNDIP.
          </p>
        </div>
      )}

      {/* 4. Four-Dimension Breakdown Toggle */}
      <div className="pt-1">
        <button
          onClick={() => setShowDimensionDetail(!showDimensionDetail)}
          aria-label={showDimensionDetail ? 'Sembunyikan rincian 4 dimensi' : 'Tampilkan rincian 4 dimensi HMIM'}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[#24130C] hover:bg-[#341A10] border border-[#78350F] text-xs font-bold text-amber-200 transition-colors cursor-pointer min-h-[44px]"
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>Rincian 4 Dimensi Profil Minatmu</span>
          </div>
          <span className="text-[10px] font-mono text-amber-300/80">
            {showDimensionDetail ? 'TUTUP ▲' : 'BUKA ▼'}
          </span>
        </button>

        {showDimensionDetail && dimensionScores && (
          <div className="mt-2.5 p-4 rounded-xl bg-[#140B07] border border-[#78350F] space-y-3 animate-in fade-in duration-200 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="font-semibold text-white">1. RIASEC — Minat Kerja Vokasional (20%)</span>
                <span className="text-amber-300 font-mono">
                  {userSummary?.topRiasec?.[0]?.label || '-'}
                </span>
              </div>
              <div className="w-full bg-[#24130C] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, Math.round(dimensionScores.riasec.reduce((a, b) => a + b, 0) / (dimensionScores.riasec.length || 1)))}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-amber-200/70">
                Mengukur keselarasan orientasi kerja dan aktivitas keprofesian.
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#78350F]/40">
              <div className="flex justify-between">
                <span className="font-semibold text-white">2. Domain Keilmuan — Rumpun Bidang (35%)</span>
                <span className="text-emerald-300 font-mono">
                  {userSummary?.topDomain?.label || '-'}
                </span>
              </div>
              <div className="w-full bg-[#24130C] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, Math.round(dimensionScores.domain.reduce((a, b) => a + b, 0) / (dimensionScores.domain.length || 1)))}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-amber-200/70">
                Pilar bobot tertinggi: mengukur ketertarikan pada rumpun ilmu yang dipelajari.
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#78350F]/40">
              <div className="flex justify-between">
                <span className="font-semibold text-white">3. Gaya Belajar — Preferensi Aktivitas (20%)</span>
                <span className="text-sky-300 font-mono">
                  {userSummary?.topLearning?.label || '-'}
                </span>
              </div>
              <div className="w-full bg-[#24130C] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-400 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, Math.round(dimensionScores.learning.reduce((a, b) => a + b, 0) / (dimensionScores.learning.length || 1)))}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-amber-200/70">
                Mengukur kecocokan dengan metode belajar (praktik, riset, diskusi, perancangan).
              </p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-[#78350F]/40">
              <div className="flex justify-between">
                <span className="font-semibold text-white">4. Kurikulum &amp; Kompetensi (25%)</span>
                <span className="text-amber-400 font-mono">
                  {userSummary?.topCurriculum?.label || '-'}
                </span>
              </div>
              <div className="w-full bg-[#24130C] h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{
                    width: `${Math.min(100, Math.round(dimensionScores.curriculum.reduce((a, b) => a + b, 0) / (dimensionScores.curriculum.length || 1)))}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-amber-200/70">
                Mengukur ketertarikan pada materi kuliah spesifik dan kompetensi lulusan.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
