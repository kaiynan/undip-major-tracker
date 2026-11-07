'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { FacultyScore, StudyProgram } from '@/data/types';
import { faculties } from '@/data/faculties';
import { getQuotaByProgramId } from '@/data/quotas';
import { TierBadge } from '@/components/ui/TierBadge';
import { PixelCampusMap } from '@/components/pixel/PixelCampusMap';
import {
  Building2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Trophy,
  Users,
  MapPin,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface FacultyTierListProps {
  facultyScores: FacultyScore[];
  programs: StudyProgram[];
  selectedFacultyId?: string | null;
  onSelectFaculty?: (facultyId: string | null) => void;
}

export function FacultyTierList({
  facultyScores,
  programs,
  selectedFacultyId: externalSelectedFacultyId,
  onSelectFaculty,
}: FacultyTierListProps) {
  // Map programId to studyProgram
  const programMap = useMemo(() => {
    const map = new Map<string, StudyProgram>();
    for (const p of programs) {
      map.set(p.id, p);
    }
    return map;
  }, [programs]);

  // Map facultyId to Faculty
  const facultyMap = useMemo(() => {
    const map = new Map<string, (typeof faculties)[0]>();
    for (const f of faculties) {
      map.set(f.id, f);
    }
    return map;
  }, []);

  // Selected faculty for automatic camera zoom exploration on the 16-bit campus map
  const [internalSelectedFacultyId, setInternalSelectedFacultyId] = useState<string | null>(
    facultyScores.length > 0 ? facultyScores[0].facultyId : null
  );

  const activeFacultyId = externalSelectedFacultyId !== undefined ? externalSelectedFacultyId : internalSelectedFacultyId;

  // Top faculties expanded by default
  const [expandedFaculties, setExpandedFaculties] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (facultyScores.length > 0) initial[facultyScores[0].facultyId] = true;
    if (facultyScores.length > 1) initial[facultyScores[1].facultyId] = true;
    return initial;
  });

  const facultyCardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleSelectFaculty = (facultyId: string | null) => {
    setInternalSelectedFacultyId(facultyId);
    if (onSelectFaculty) {
      onSelectFaculty(facultyId);
    }
    if (facultyId) {
      setExpandedFaculties((prev) => ({
        ...prev,
        [facultyId]: true,
      }));
      setTimeout(() => {
        const el = facultyCardRefs.current[facultyId];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 200);
    }
  };

  const toggleExpand = (facultyId: string) => {
    setExpandedFaculties((prev) => {
      const willExpand = !prev[facultyId];
      if (willExpand) {
        handleSelectFaculty(facultyId);
      }
      return {
        ...prev,
        [facultyId]: willExpand,
      };
    });
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    for (const fs of facultyScores) all[fs.facultyId] = true;
    setExpandedFaculties(all);
  };

  const collapseAll = () => {
    setExpandedFaculties({});
  };

  return (
    <div className="space-y-4">
      {/* Informative Banner about Faculty Aggregate Formula */}
      <div className="bg-[#190E08] rounded-2xl p-4 sm:p-5 border-2 border-[#78350F] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#78350F] text-[#FDE68A] border border-[#F59E0B] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-[#FDE68A]" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#FFFBEB] text-sm sm:text-base font-pixel">
              Peringkat Fakultas & Sekolah
            </h3>
            <p className="text-[11px] sm:text-xs text-amber-200/80 mt-0.5 leading-relaxed max-w-2xl">
              Skor agregat dihitung dari rata-rata nilai hingga 3 prodi dengan kecocokan tertinggi di fakultas (<strong className="text-amber-300 font-mono">Score_F = (S1 + S2 + S3) / n</strong>). Klik kartu atau tombol <strong className="text-amber-300">Fokus di Peta</strong> untuk melihat arsitektur 16-bit di peta kampus.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={expandAll}
            className="text-xs font-bold px-3 py-1.5 bg-[#24130C] border border-[#78350F] rounded-xl text-amber-200 hover:text-white hover:bg-[#341A10] transition-colors cursor-pointer"
          >
            Buka Semua
          </button>
          <button
            onClick={collapseAll}
            className="text-xs font-bold px-3 py-1.5 bg-[#24130C] border border-[#78350F] rounded-xl text-amber-200 hover:text-white hover:bg-[#341A10] transition-colors cursor-pointer"
          >
            Tutup Semua
          </button>
        </div>
      </div>

      {/* Faculty Leaderboard Cards */}
      <div className="space-y-3.5">
        {facultyScores.map((facultyScore, index) => {
          const faculty = facultyMap.get(facultyScore.facultyId);
          if (!faculty) return null;

          const isExpanded = !!expandedFaculties[facultyScore.facultyId];
          const isSelected = activeFacultyId === facultyScore.facultyId;
          const isTopRank = index === 0;

          // Top 3 programs for highlight pill
          const topPrograms = facultyScore.programScores.slice(0, 3);

          return (
            <div
              key={faculty.id}
              ref={(el) => {
                facultyCardRefs.current[faculty.id] = el;
              }}
              className={`bg-[#190E08] rounded-2xl border-2 transition-all overflow-hidden ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/50 bg-[#25140C] shadow-lg'
                  : isTopRank
                  ? 'border-[#F59E0B] bg-[#21120B]'
                  : 'border-[#78350F] shadow-xs hover:border-[#F59E0B]/60 hover:bg-[#1E100A]'
              }`}
            >
              {/* Faculty Summary Header */}
              <div
                onClick={() => toggleExpand(faculty.id)}
                className={`p-5 sm:p-6 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected ? 'bg-[#2E180E]/70' : 'hover:bg-[#24130C]/60'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  {/* Rank Badge */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs font-mono ${
                      index === 0
                        ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300'
                        : index === 1
                        ? 'bg-amber-200 text-stone-950 font-bold'
                        : index === 2
                        ? 'bg-amber-100 text-stone-950 font-bold'
                        : 'bg-[#24130C] text-amber-200 border border-[#78350F]'
                    }`}
                  >
                    {index === 0 ? <Trophy className="w-5 h-5 text-stone-950" /> : `#${index + 1}`}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      <TierBadge tier={facultyScore.tier} size="sm" />
                      <span className="text-[11px] font-bold text-[#FDE68A] bg-[#24130C] px-2 py-0.5 rounded border border-[#78350F]">
                        {faculty.shortName}
                      </span>
                      <span className="text-[11px] text-amber-200/70 font-medium">
                        {facultyScore.programScores.length} Prodi
                      </span>
                      {isSelected && (
                        <span className="font-pixel text-[8px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded border border-amber-600 font-bold animate-pulse">
                          FOKUS PETA
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-[#FFFBEB] truncate">
                      {faculty.name}
                    </h3>

                    <p className="text-xs text-amber-100/75 mt-0.5 line-clamp-1 max-w-xl">
                      {faculty.description}
                    </p>

                    {/* Top 3 Major Highlights Pills */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-1 text-xs text-amber-200/80">
                      <span className="font-bold text-amber-200/60 text-[10px] uppercase tracking-wider mr-1 font-mono">
                        Top Rekomendasi:
                      </span>
                      {topPrograms.map((ps) => {
                        const prog = programMap.get(ps.programId);
                        return (
                          <span
                            key={ps.programId}
                            className="inline-flex items-center gap-1 bg-[#24130C] border border-[#78350F] px-2 py-0.5 rounded text-[11px] font-semibold"
                          >
                            <span className="text-amber-100 font-bold truncate max-w-[140px]">{prog?.name}</span>
                            <span className="text-amber-400 font-black font-mono">{ps.totalScore}%</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Aggregate Score & Action Buttons */}
                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectFaculty(faculty.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#F59E0B] text-stone-950 border border-[#F59E0B] font-black shadow-xs'
                        : 'bg-[#24130C] text-[#FDE68A] hover:bg-[#341A10] border border-[#78350F]'
                    }`}
                    title="Zoom kamera peta ke fakultas ini"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span>{isSelected ? 'Terfokus di Peta' : 'Fokus di Peta'}</span>
                  </button>

                  <div className="text-right">
                    <div className="text-[10px] font-mono font-semibold text-amber-200/60 uppercase tracking-wider">
                      Skor Agregat
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">
                      {facultyScore.aggregateScore}%
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-[#24130C] border border-[#78350F] flex items-center justify-center text-amber-200">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Nested Program Study List (Expanded State) */}
              {isExpanded && (
                <div className="border-t-2 border-[#78350F] bg-[#140B07] p-4 sm:p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#78350F]/70">
                    <div className="text-xs font-bold text-[#FDE68A] font-mono">
                      Semua Program Studi di {faculty.shortName} (Skor Minat HMIM)
                    </div>
                    {faculty.websiteUrl && (
                      <a
                        href={faculty.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-200 transition-colors"
                      >
                        <span>Situs Resmi {faculty.shortName}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    {facultyScore.programScores.map((ps, pIndex) => {
                      const prog = programMap.get(ps.programId);
                      if (!prog) return null;
                      const quota = getQuotaByProgramId(prog.id);

                      return (
                        <div
                          key={prog.id}
                          className="bg-[#190E08] rounded-xl p-3.5 sm:p-4 border border-[#78350F]/80 hover:border-[#F59E0B]/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-white"
                        >
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className="w-6 h-6 rounded-md bg-[#24130C] text-amber-300 border border-[#78350F]/70 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {pIndex + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                                <TierBadge tier={ps.tier} size="sm" />
                                <span className="text-[10px] font-bold text-amber-200/80 bg-[#24130C] px-1.5 py-0.5 rounded border border-[#78350F]/60">
                                  {prog.degreeLevel}
                                </span>
                              </div>
                              <h4 className="font-extrabold text-[#FFFBEB] text-sm leading-snug truncate">
                                {prog.name}
                              </h4>
                              <p className="text-[11px] text-amber-100/70 line-clamp-1">
                                {prog.description}
                              </p>

                              {/* Admissions Quotas */}
                              {quota && (
                                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10px] text-amber-200/70 font-mono">
                                  <span className="font-semibold text-[#FDE68A] flex items-center gap-1">
                                    <Users className="w-3 h-3 text-amber-400" />
                                    Daya Tampung: {quota.totalCapacity}
                                  </span>
                                  <span>•</span>
                                  <span>SNBP: {quota.snbpQuota}</span>
                                  <span>•</span>
                                  <span>SNBT: {quota.snbtQuota}</span>
                                  <span>•</span>
                                  <span>Mandiri: {quota.mandiriQuota}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Individual Program Score & Action */}
                          <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#78350F]/60 shrink-0">
                            <div className="text-right">
                              <div className="text-[10px] font-mono text-amber-200/60 font-medium">Skor HMIM</div>
                              <div className="text-base sm:text-lg font-black text-amber-400 font-mono">{ps.totalScore}%</div>
                            </div>

                            <Link
                              href={`/program/${prog.id}`}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#78350F] hover:bg-[#8D3F12] text-[#FFFBEB] border border-[#F59E0B] font-bold text-xs rounded-xl transition-colors shadow-xs"
                            >
                              <span>Detail</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
