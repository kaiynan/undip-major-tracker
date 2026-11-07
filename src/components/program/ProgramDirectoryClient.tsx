'use client';

import React, { useState, useMemo, memo } from 'react';
import Link from 'next/link';
import { Faculty, StudyProgram } from '@/data/types';
import {
  Search,
  Sparkles,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Building2,
  ExternalLink,
  ArrowRight,
  Layers,
  RotateCcw,
} from 'lucide-react';
import { retroAudio } from '@/lib/retroAudio';

interface ProgramDirectoryClientProps {
  faculties: Faculty[];
  programs: StudyProgram[];
}

interface GroupedPrograms {
  faculty: Faculty;
  departmentGroups: {
    departmentName: string | null;
    programs: StudyProgram[];
  }[];
  totalPrograms: number;
}

const ProgramCard = memo(function ProgramCard({
  program,
  faculty,
}: {
  program: StudyProgram;
  faculty?: Faculty;
}) {
  return (
    <article className="flex flex-col justify-between bg-[#1A0E08] border-2 border-[#78350F] hover:border-[#F59E0B] p-4 sm:p-5 rounded-2xl transition-all shadow-[2px_2px_0_0_#000] hover:shadow-[4px_4px_0_0_#78350F]">
      <div>
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <span
            className={`font-pixel text-[8.5px] px-2 py-0.5 rounded border font-bold ${
              program.degreeLevel === 'D4'
                ? 'bg-amber-950 text-amber-300 border-amber-600'
                : 'bg-blue-950 text-sky-300 border-sky-600'
            }`}
          >
            {program.degreeLevel}
          </span>
          <span className="text-[10px] font-mono text-amber-200/80 bg-[#2A160E] px-2 py-0.5 rounded border border-[#78350F]/60">
            {faculty?.shortName || program.facultyId.toUpperCase()}
          </span>
          {program.department && (
            <span className="text-[10px] font-mono text-amber-400/90 bg-[#24130C] px-2 py-0.5 rounded border border-[#78350F]/40 truncate max-w-[200px]">
              {program.department}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="font-pixel text-xs sm:text-sm text-[#FFFBEB] hover:text-[#FDE68A] transition-colors leading-snug break-words mb-2">
          {program.name}
        </h4>

        {/* Short Description */}
        <p className="text-xs text-amber-100/80 leading-relaxed line-clamp-3 mb-4">
          {program.description}
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#78350F]/50 flex items-center justify-between gap-2">
        <Link
          href={`/program/${program.id}`}
          onClick={() => retroAudio.playBlip(720)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-stone-950 font-pixel text-[9px] sm:text-[10px] font-bold border-2 border-amber-600 transition-all cursor-pointer shadow-[2px_2px_0_0_#000] min-h-[44px]"
          aria-label={`Lihat detail lengkap kurikulum dan prospek prodi ${program.name}`}
        >
          <span>Detail</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {program.websiteUrl && (
          <a
            href={program.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-amber-300/70 hover:text-[#FDE68A] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title={`Buka situs web resmi ${program.name}`}
            aria-label={`Situs web resmi ${program.name}`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </article>
  );
});

export function ProgramDirectoryClient({
  faculties,
  programs,
}: ProgramDirectoryClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedDegree, setSelectedDegree] = useState<'all' | 'S1' | 'D4'>('all');
  const [expandedFaculties, setExpandedFaculties] = useState<Record<string, boolean>>(() => {
    // By default, the first faculty is expanded; others collapsed
    const initial: Record<string, boolean> = {};
    faculties.forEach((f, idx) => {
      initial[f.id] = idx === 0;
    });
    return initial;
  });

  const facultyMap = useMemo(() => {
    const map = new Map<string, Faculty>();
    faculties.forEach((f) => map.set(f.id, f));
    return map;
  }, [faculties]);

  // Filtered Programs
  const filteredPrograms = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return programs.filter((p) => {
      if (selectedFaculty !== 'all' && p.facultyId !== selectedFaculty) {
        return false;
      }
      if (selectedDegree !== 'all' && p.degreeLevel !== selectedDegree) {
        return false;
      }
      if (!term) return true;

      const faculty = facultyMap.get(p.facultyId);
      const searchHaystack = [
        p.name,
        p.description,
        p.department || '',
        faculty?.name || '',
        faculty?.shortName || '',
        p.degreeLevel,
        ...(p.competencies || []),
        ...(p.curriculumKeywords || []),
      ]
        .join(' ')
        .toLowerCase();

      return searchHaystack.includes(term);
    });
  }, [programs, searchTerm, selectedFaculty, selectedDegree, facultyMap]);

  // Grouped structure: Faculty -> Department -> Program
  const groupedData: GroupedPrograms[] = useMemo(() => {
    const result: GroupedPrograms[] = [];

    faculties.forEach((fac) => {
      const facPrograms = filteredPrograms.filter((p) => p.facultyId === fac.id);
      if (facPrograms.length === 0) return;

      // Group by department within this faculty
      const deptMap = new Map<string | null, StudyProgram[]>();

      facPrograms.forEach((prog) => {
        const deptKey = prog.department || null;
        if (!deptMap.has(deptKey)) {
          deptMap.set(deptKey, []);
        }
        deptMap.get(deptKey)!.push(prog);
      });

      const departmentGroups: { departmentName: string | null; programs: StudyProgram[] }[] = [];
      deptMap.forEach((programs, departmentName) => {
        departmentGroups.push({ departmentName, programs });
      });

      // Sort department groups: named departments first, then null
      departmentGroups.sort((a, b) => {
        if (!a.departmentName) return 1;
        if (!b.departmentName) return -1;
        return a.departmentName.localeCompare(b.departmentName);
      });

      result.push({
        faculty: fac,
        departmentGroups,
        totalPrograms: facPrograms.length,
      });
    });

    return result;
  }, [faculties, filteredPrograms]);

  const toggleFaculty = (facId: string) => {
    retroAudio.playBlip(550);
    setExpandedFaculties((prev) => ({
      ...prev,
      [facId]: !prev[facId],
    }));
  };

  const handleResetFilters = () => {
    retroAudio.playBlip(500);
    setSearchTerm('');
    setSelectedFaculty('all');
    setSelectedDegree('all');
  };

  return (
    <div className="relative min-h-screen bg-[#140B07] text-slate-100 pb-24 pt-6 px-3 sm:px-6">
      {/* Background Gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#2A111E]/40 via-[#1A0E08] to-[#140B07]" />

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top Subtle CTA Pill */}
        <div className="flex justify-center">
          <Link
            href="/questionnaire"
            onClick={() => retroAudio.playWarp()}
            className="inline-flex items-center gap-2 bg-[#2A160E]/90 hover:bg-[#3D1F13] text-amber-200 hover:text-white px-4 py-2 rounded-full border border-[#F59E0B]/50 font-pixel text-[9px] sm:text-[10px] transition-all shadow-[2px_2px_0_0_#451A03] min-h-[44px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
            <span>Belum tahu cocoknya apa? Mulai tes minat</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FDE68A] shrink-0" />
          </Link>
        </div>

        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#1A0E08] px-3 py-1 rounded-full border border-[#78350F] text-[11px] font-mono text-amber-300">
            <Building2 className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>UNIVERSITAS DIPONEGORO</span>
          </div>
          <h1 className="font-pixel text-xl sm:text-3xl text-white tracking-wide">
            DAFTAR PROGRAM STUDI
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/80 max-w-2xl mx-auto leading-relaxed">
            Eksplorasi lengkap 67 program studi S1 & D4 di 12 Fakultas dan Sekolah UNDIP.
            Dikelompokkan berdasarkan Fakultas dan Departemen resmi.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-[#1F120B] p-4 sm:p-5 rounded-2xl border-2 border-[#78350F] shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari program studi, departemen, atau kompetensi..."
              className="w-full bg-[#140B07] border border-[#78350F] focus:border-[#F59E0B] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-amber-200/40 focus:outline-hidden min-h-[44px]"
              aria-label="Cari program studi"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-200/70 hover:text-white text-xs px-2 py-1 min-h-[44px] flex items-center"
                aria-label="Hapus kata kunci pencarian"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Filter Selectors Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
            {/* Faculty Filter */}
            <div className="flex items-center gap-2 bg-[#140B07] border border-[#78350F] rounded-xl px-3 py-1.5 min-h-[44px]">
              <Building2 className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full bg-transparent text-xs text-amber-100 focus:outline-hidden cursor-pointer"
                aria-label="Filter berdasarkan Fakultas"
              >
                <option value="all" className="bg-[#1A0E08]">Semua Fakultas (12)</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id} className="bg-[#1A0E08]">
                    {f.name} ({f.shortName})
                  </option>
                ))}
              </select>
            </div>

            {/* Degree Level Filter */}
            <div className="flex items-center gap-2 bg-[#140B07] border border-[#78350F] rounded-xl px-3 py-1.5 min-h-[44px]">
              <GraduationCap className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value as 'all' | 'S1' | 'D4')}
                className="w-full bg-transparent text-xs text-amber-100 focus:outline-hidden cursor-pointer"
                aria-label="Filter berdasarkan Jenjang Pendidikan"
              >
                <option value="all" className="bg-[#1A0E08]">Semua Jenjang (S1 & D4)</option>
                <option value="S1" className="bg-[#1A0E08]">Sarjana (S1)</option>
                <option value="D4" className="bg-[#1A0E08]">Sarjana Terapan (D4)</option>
              </select>
            </div>

            {/* Results Count & Reset */}
            <div className="flex items-center justify-between sm:justify-end gap-3 px-1 text-xs sm:col-span-2 md:col-span-1 min-h-[44px]">
              <span className="font-mono text-amber-200/90 font-medium">
                Ditemukan:{' '}
                <strong className="text-[#FDE68A] font-bold">
                  {filteredPrograms.length}
                </strong>{' '}
                prodi
              </span>
              {(searchTerm || selectedFaculty !== 'all' || selectedDegree !== 'all') && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-200 underline font-bold cursor-pointer min-h-[44px]"
                  aria-label="Reset semua filter pencarian"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filter</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        {groupedData.length === 0 && (
          <div className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-8 sm:p-12 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#140B07] border-2 border-[#78350F] flex items-center justify-center text-amber-400 mx-auto">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="font-pixel text-sm sm:text-base text-white">
              Tidak Ada Program Studi Ditemukan
            </h3>
            <p className="text-xs text-amber-200/80 max-w-md mx-auto leading-relaxed">
              Tidak ada program studi yang cocok dengan filter atau kata kunci &ldquo;{searchTerm}&rdquo;.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-amber-400 text-stone-950 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-[2px_2px_0_0_#000] min-h-[44px]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Pencarian & Filter</span>
            </button>
          </div>
        )}

        {/* Grouped Accordion List: Faculty -> Department -> Program */}
        <div className="space-y-4">
          {groupedData.map((group) => {
            const isExpanded = !!expandedFaculties[group.faculty.id] || searchTerm.trim().length > 0;

            return (
              <section
                key={group.faculty.id}
                className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-all"
              >
                {/* Faculty Header (Collapsible Accordion Trigger) */}
                <button
                  onClick={() => toggleFaculty(group.faculty.id)}
                  aria-expanded={isExpanded}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-[#24130C] hover:bg-[#2D180F] transition-colors cursor-pointer border-b border-[#78350F]/70 min-h-[56px]"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded-xl bg-[#140B07] border border-[#78350F] flex items-center justify-center text-[#F59E0B] shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-pixel text-xs sm:text-sm text-[#FDE68A] truncate">
                          {group.faculty.name}
                        </h2>
                        <span className="font-mono text-[10px] text-amber-300 font-bold bg-[#140B07] px-2 py-0.5 rounded border border-[#78350F] shrink-0">
                          {group.faculty.shortName}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-200/70 truncate hidden sm:block mt-0.5">
                        {group.faculty.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="font-mono text-xs bg-[#140B07] text-[#FDE68A] px-2.5 py-1 rounded-full border border-[#78350F] font-bold">
                      {group.totalPrograms} Prodi
                    </span>
                    <div className="text-amber-400">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
                    {group.departmentGroups.map((deptGroup, dIdx) => (
                      <div key={dIdx} className="space-y-3">
                        {/* Department Subheader if exists */}
                        {deptGroup.departmentName && (
                          <div className="flex items-center gap-2 pb-1.5 border-b border-[#78350F]/50">
                            <span className="w-2 h-2 bg-[#F59E0B] rounded-full" />
                            <h3 className="font-pixel text-[10px] sm:text-xs text-amber-300 uppercase tracking-wide">
                              {deptGroup.departmentName}
                            </h3>
                            <span className="text-[10px] text-amber-200/60 font-mono">
                              ({deptGroup.programs.length} prodi)
                            </span>
                          </div>
                        )}

                        {/* Program Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                          {deptGroup.programs.map((program) => (
                            <ProgramCard
                              key={program.id}
                              program={program}
                              faculty={group.faculty}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
