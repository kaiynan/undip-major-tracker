'use client';

import React from 'react';
import Link from 'next/link';
import { StudyProgram, ProgramScore } from '@/data/types';
import { faculties } from '@/data/faculties';
import { getQuotaByProgramId } from '@/data/quotas';
import { TierBadge } from '@/components/ui/TierBadge';
import { ScoreBar } from '@/components/ui/ScoreBar';
import { X, Scale, ArrowRight, ExternalLink, Sparkles, Users, CheckCircle2 } from 'lucide-react';

interface ProgramComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  programIds: string[];
  programs: StudyProgram[];
  getScoreForProgram: (id: string) => ProgramScore | undefined;
  onRemoveProgram: (id: string) => void;
}

export function ProgramComparisonModal({
  isOpen,
  onClose,
  programIds,
  programs,
  getScoreForProgram,
  onRemoveProgram,
}: ProgramComparisonModalProps) {
  if (!isOpen || programIds.length === 0) return null;

  const comparedPrograms = programIds
    .map((id) => {
      const prog = programs.find((p) => p.id === id);
      const score = getScoreForProgram(id);
      const fac = faculties.find((f) => f.id === prog?.facultyId);
      const quota = getQuotaByProgramId(id);
      return prog && score ? { program: prog, score, faculty: fac, quota } : null;
    })
    .filter(Boolean) as {
    program: StudyProgram;
    score: ProgramScore;
    faculty: (typeof faculties)[0] | undefined;
    quota: ReturnType<typeof getQuotaByProgramId>;
  }[];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs overscroll-contain animate-in fade-in duration-150"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="bg-[#24130C] rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-[0_16px_50px_rgba(0,0,0,0.9)] border-2 border-[#78350F] overflow-hidden text-white">
        {/* Header */}
        <div className="px-6 py-5 border-b-2 border-[#78350F] flex items-center justify-between bg-[#190E08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-[#FDE68A] rounded-2xl border border-[#78350F]">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-pixel text-base text-[#FFFBEB]">
                Komparasi Program Studi ({comparedPrograms.length} Dipilih)
              </h3>
              <p className="text-xs text-amber-200/80 mt-0.5">
                Bandingkan kecocokan minat, profil kurikulum, dan daya tampung secara berdampingan.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-amber-200/70 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer"
            title="Tutup Komparasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparedPrograms.map(({ program, score, faculty, quota }) => (
              <div
                key={program.id}
                className="bg-[#190E08] rounded-2xl p-5 border-2 border-[#78350F] flex flex-col justify-between hover:border-[#F59E0B]/70 transition-all shadow-md"
              >
                <div>
                  {/* Top Bar with Remove Button */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold text-amber-200 bg-[#24130C] border border-[#78350F] px-2.5 py-0.5 rounded-md">
                      {program.degreeLevel} • {faculty?.shortName}
                    </span>
                    <button
                      onClick={() => onRemoveProgram(program.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 font-bold transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>

                  <h4 className="font-black text-[#FFFBEB] text-base leading-snug">
                    {program.name}
                  </h4>
                  <p className="text-xs text-amber-200/70 mt-0.5">{faculty?.name}</p>

                  {/* Match Score Box */}
                  <div className="my-4 p-4 bg-[#24130C] rounded-2xl border border-[#78350F] text-center shadow-inner">
                    <div className="text-[10px] uppercase font-bold text-amber-300/80">Skor Kecocokan</div>
                    <div className="text-3xl font-black text-amber-400 mt-0.5">{score.totalScore}%</div>
                    <div className="mt-2 flex justify-center">
                      <TierBadge tier={score.tier} size="sm" />
                    </div>
                  </div>

                  {/* 4 Dimension Scores */}
                  <div className="space-y-2 mb-4 bg-[#24130C] p-3.5 rounded-2xl border border-[#78350F]">
                    <div className="text-[11px] font-bold text-amber-200/90 mb-1">Rincian 4 Dimensi:</div>
                    <ScoreBar label="1. RIASEC" score={score.dimensionScores.riasec} color="bg-blue-600" />
                    <ScoreBar label="2. Bidang Ilmu" score={score.dimensionScores.domain} color="bg-indigo-600" />
                    <ScoreBar label="3. Gaya Belajar" score={score.dimensionScores.learning} color="bg-emerald-600" />
                    <ScoreBar label="4. Kurikulum" score={score.dimensionScores.curriculum} color="bg-amber-600" />
                  </div>

                  {/* Quota Info */}
                  <div className="bg-[#24130C] p-3.5 rounded-2xl border border-[#78350F] text-xs space-y-1 mb-4">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>Daya Tampung: {quota?.totalCapacity ? `${quota.totalCapacity} Kursi` : 'Belum rilis'}</span>
                    </div>
                    {quota?.totalCapacity && (
                      <div className="text-[11px] text-amber-100/80 pt-1">
                        SNBP: {quota.snbpQuota ?? '-'} | SNBT: {quota.snbtQuota ?? '-'} | Mandiri: {quota.mandiriQuota ?? '-'}
                      </div>
                    )}
                  </div>

                  {/* Learning Outcomes Sample */}
                  <div className="text-xs space-y-1.5 mb-4">
                    <div className="font-bold text-amber-300">Fokus Capaian Lulusan:</div>
                    <ul className="space-y-1 text-amber-100/90 text-[11px]">
                      {program.learningOutcomes.slice(0, 2).map((lo, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{lo}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action */}
                <Link
                  href={`/program/${program.id}`}
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#F59E0B] hover:bg-amber-400 text-stone-950 text-xs font-black py-2.5 rounded-xl transition-all mt-2 shadow-[2px_2px_0_0_#000]"
                >
                  <span>Lihat Detail Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t-2 border-[#78350F] bg-[#190E08] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#24130C] hover:bg-[#341A10] border-2 border-[#78350F] text-amber-200 hover:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Tutup Komparasi
          </button>
        </div>
      </div>
    </div>
  );
}
