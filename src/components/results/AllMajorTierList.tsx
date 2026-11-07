'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ProgramScore, StudyProgram } from '@/data/types';
import { faculties } from '@/data/faculties';
import { getQuotaByProgramId } from '@/data/quotas';
import { TierBadge } from '@/components/ui/TierBadge';
import { ScoreBar } from '@/components/ui/ScoreBar';
import {
  Search,
  Sparkles,
  ArrowRight,
  Layers,
  Scale,
  Users,
  MapPin,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ProgramCardProps {
  score: ProgramScore;
  index: number;
  program: StudyProgram;
  faculty?: (typeof faculties)[0];
  quota?: ReturnType<typeof getQuotaByProgramId>;
  isComparing: boolean;
  isExpanded: boolean;
  isTopRank: boolean;
  onToggleComparison: (programId: string) => void;
  onSelectFaculty: (facultyId: string) => void;
  onToggleExpand: (programId: string) => void;
}

const ProgramCard = React.memo(function ProgramCard({
  score,
  index,
  program,
  faculty,
  quota,
  isComparing,
  isExpanded,
  isTopRank,
  onToggleComparison,
  onSelectFaculty,
  onToggleExpand,
}: ProgramCardProps) {
  return (
    <div
      className={`bg-[#190E08] rounded-2xl border-2 transition-all overflow-hidden ${
        isTopRank
          ? 'border-[#F59E0B] ring-2 ring-amber-400/40 shadow-lg bg-[#22130B]'
          : 'border-[#78350F] shadow-xs hover:border-[#F59E0B]/70 hover:bg-[#20120B]'
      }`}
    >
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-5">
          {/* Main Program Identity & Hierarchy */}
          <div className="flex items-start gap-3 sm:gap-3.5 flex-1 min-w-0">
            {/* Rank Number Badge */}
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 shadow-2xs font-mono ${
                index === 0
                  ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300'
                  : index === 1
                  ? 'bg-amber-200 text-stone-950 font-bold'
                  : index === 2
                  ? 'bg-amber-100 text-stone-950 font-bold'
                  : 'bg-[#24130C] text-amber-200 border border-[#78350F]'
              }`}
            >
              {index === 0 ? <Sparkles className="w-5 h-5 text-stone-950" /> : `#${index + 1}`}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                <TierBadge tier={score.tier} size="sm" />
                <span className="text-xs font-bold text-[#FDE68A] bg-[#24130C] px-2.5 py-1 rounded border border-[#78350F]">
                  {faculty?.shortName}
                </span>
                <span className="text-xs font-semibold text-amber-200/90 bg-[#24130C] px-2.5 py-1 rounded border border-[#78350F]/60">
                  Jenjang {program.degreeLevel}
                </span>
                {quota && (
                  <span className="text-xs text-amber-200 flex items-center gap-1 bg-[#24130C] px-2.5 py-1 rounded border border-[#78350F]/60">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    Daya Tampung: <strong className="text-[#FDE68A]">{quota.totalCapacity}</strong>
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-black text-[#FFFBEB] tracking-tight truncate sm:whitespace-normal">
                {program.name}
              </h3>

              <p className="text-xs sm:text-sm text-amber-100/90 mt-1 line-clamp-2 leading-relaxed">
                {program.description}
              </p>

              {/* Admissions Quota Breakdown Badges */}
              {quota && (
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="font-semibold text-amber-200/90 uppercase tracking-wider text-xs mr-1 font-mono">
                    Kuota TA {quota.academicYear} — dapat berubah{quota.lastVerified ? ` (data per ${quota.lastVerified})` : ''}:
                  </span>
                  <span className="px-2.5 py-1 bg-[#24130C] text-blue-300 rounded border border-blue-900/60 font-medium font-mono text-xs">
                    SNBP: <strong className="text-blue-200">{quota.snbpQuota}</strong> ({quota.totalCapacity && quota.snbpQuota ? Math.round((quota.snbpQuota / quota.totalCapacity) * 100) : '-'}%)
                  </span>
                  <span className="px-2.5 py-1 bg-[#24130C] text-emerald-300 rounded border border-emerald-900/60 font-medium font-mono text-xs">
                    SNBT: <strong className="text-emerald-200">{quota.snbtQuota}</strong> ({quota.totalCapacity && quota.snbtQuota ? Math.round((quota.snbtQuota / quota.totalCapacity) * 100) : '-'}%)
                  </span>
                  <span className="px-2.5 py-1 bg-[#24130C] text-amber-300 rounded border border-amber-900/60 font-medium font-mono text-xs">
                    Mandiri: <strong className="text-amber-200">{quota.mandiriQuota}</strong> ({quota.totalCapacity && quota.mandiriQuota ? Math.round((quota.mandiriQuota / quota.totalCapacity) * 100) : '-'}%)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Score & Actions Right Column */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-[#78350F]/70 shrink-0 min-w-0 max-w-full">
            <div className="text-left md:text-right">
              <div className="text-xs font-mono font-semibold text-amber-200/90 uppercase tracking-wider">
                Skor Keselarasan
              </div>
              <div className="text-xl sm:text-3xl font-black text-amber-400 font-mono">
                {score.totalScore}%
              </div>
              <div className="w-28 mt-1 hidden md:block">
                <ScoreBar label="" score={score.totalScore} showPercentage={false} isDark />
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              {/* Comparison Pin Button */}
              <button
                onClick={() => onToggleComparison(program.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border min-h-[44px] ${
                  isComparing
                    ? 'bg-[#F59E0B] text-stone-950 border-[#F59E0B] font-black shadow-xs'
                    : 'bg-[#24130C] text-amber-200 border-[#78350F] hover:bg-[#341A10]'
                }`}
                title={isComparing ? 'Hapus dari pembanding' : 'Tambah ke pembanding'}
                aria-label={isComparing ? `Hapus ${program.name} dari pembanding` : `Tambah ${program.name} ke pembanding`}
              >
                <Scale className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isComparing ? 'Dipilih' : 'Bandingkan'}
                </span>
              </button>

              {/* Quick Focus on Map Button */}
              <button
                onClick={() => onSelectFaculty(program.facultyId)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#24130C] hover:bg-[#341A10] text-[#FDE68A] border border-[#78350F] transition-colors cursor-pointer min-h-[44px]"
                title="Fokus peta ke fakultas prodi ini"
                aria-label={`Fokus peta ke fakultas ${program.name}`}
              >
                <MapPin className="w-4 h-4 text-[#F59E0B]" />
                <span className="hidden sm:inline">Peta</span>
              </button>

              {/* Detail Link */}
              <Link
                href={`/program/${program.id}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-[#78350F] hover:bg-[#8D3F12] text-[#FFFBEB] border border-[#F59E0B] transition-colors shadow-xs min-h-[44px]"
                aria-label={`Lihat detail lengkap ${program.name}`}
              >
                <span>Detail</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Breakdown Accordion Toggle */}
              <button
                onClick={() => onToggleExpand(score.programId)}
                className="p-2.5 rounded-xl text-amber-200/90 hover:text-white hover:bg-[#24130C] border border-[#78350F]/60 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Lihat rincian 4 dimensi"
                aria-label={isExpanded ? `Tutup rincian 4 dimensi ${program.name}` : `Lihat rincian 4 dimensi ${program.name}`}
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-amber-300" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-amber-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Dimension Breakdown Accordion (4 Analytical Pillars) */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-[#78350F]/70 bg-[#140B07] rounded-xl p-3 sm:p-5">
            <div className="text-xs font-extrabold text-[#FDE68A] uppercase tracking-wider mb-3 font-mono">
              Rincian Kecocokan 4 Dimensi HMIM (Hierarchical Matching):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              <div className="bg-[#190E08] p-3 rounded-xl border border-[#78350F]/80">
                <div className="text-xs text-amber-200/90 font-semibold font-mono">1. RIASEC (20%)</div>
                <div className="text-base font-black text-amber-400 font-mono mt-0.5">
                  {score.dimensionScores.riasec}%
                </div>
                <div className="w-full mt-1.5">
                  <ScoreBar label="" score={score.dimensionScores.riasec} showPercentage={false} isDark />
                </div>
              </div>

              <div className="bg-[#190E08] p-3 rounded-xl border border-[#78350F]/80">
                <div className="text-xs text-amber-200/90 font-semibold font-mono">2. Bidang Ilmu (35%)</div>
                <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
                  {score.dimensionScores.domain}%
                </div>
                <div className="w-full mt-1.5">
                  <ScoreBar label="" score={score.dimensionScores.domain} showPercentage={false} isDark color="bg-emerald-400" />
                </div>
              </div>

              <div className="bg-[#190E08] p-3 rounded-xl border border-[#78350F]/80">
                <div className="text-xs text-amber-200/90 font-semibold font-mono">3. Gaya Belajar (20%)</div>
                <div className="text-base font-black text-sky-400 font-mono mt-0.5">
                  {score.dimensionScores.learning}%
                </div>
                <div className="w-full mt-1.5">
                  <ScoreBar label="" score={score.dimensionScores.learning} showPercentage={false} isDark color="bg-sky-400" />
                </div>
              </div>

              <div className="bg-[#190E08] p-3 rounded-xl border border-[#78350F]/80">
                <div className="text-xs text-amber-200/90 font-semibold font-mono">4. Kurikulum (25%)</div>
                <div className="text-base font-black text-amber-400 font-mono mt-0.5">
                  {score.dimensionScores.curriculum}%
                </div>
                <div className="w-full mt-1.5">
                  <ScoreBar label="" score={score.dimensionScores.curriculum} showPercentage={false} isDark color="bg-amber-400" />
                </div>
              </div>
            </div>

            {/* Curriculum Keywords Tags */}
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-amber-200/90 uppercase tracking-wider mr-1 font-mono">
                Kata Kunci Kurikulum:
              </span>
              {program.curriculumKeywords.map((kw: string, i: number) => (
                <span
                  key={i}
                  className="bg-[#190E08] border border-[#78350F] text-amber-200 px-2.5 py-1 rounded text-xs font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

interface AllMajorTierListProps {
  programScores: ProgramScore[];
  programs: StudyProgram[];
  comparisonIds: string[];
  onToggleComparison: (programId: string) => void;
  selectedFaculty?: string | null;
  onSelectFaculty?: (facultyId: string | null) => void;
}

export const AllMajorTierList = React.memo(function AllMajorTierList({
  programScores,
  programs,
  comparisonIds,
  onToggleComparison,
  selectedFaculty: externalSelectedFaculty,
  onSelectFaculty: externalOnSelectFaculty,
}: AllMajorTierListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [internalSelectedFaculty, setInternalSelectedFaculty] = useState<string>('all');
  const selectedFaculty =
    externalSelectedFaculty !== undefined && externalSelectedFaculty !== null
      ? externalSelectedFaculty
      : internalSelectedFaculty;
  const setSelectedFaculty = (facId: string | null) => {
    setInternalSelectedFaculty(facId || 'all');
    externalOnSelectFaculty?.(facId);
  };

  const [selectedDegree, setSelectedDegree] = useState<string>('all');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [selectedPathway, setSelectedPathway] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'quota' | 'name'>('score');
  const [expandedScoreId, setExpandedScoreId] = useState<string | null>(null);

  // Virtualization / progressive card loading to keep initial DOM nodes low
  const [visibleCount, setVisibleCount] = useState(16);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleCount(16);
  }, [searchTerm, selectedFaculty, selectedDegree, selectedTier, selectedPathway, sortBy]);

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

  // Filtered program scores
  const filteredScores = useMemo(() => {
    return programScores.filter((score) => {
      const program = programMap.get(score.programId);
      if (!program) return false;

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesName = program.name.toLowerCase().includes(term);
        const matchesDesc = program.description.toLowerCase().includes(term);
        const matchesFaculty =
          facultyMap.get(program.facultyId)?.name.toLowerCase().includes(term) || false;
        const matchesKeywords = program.curriculumKeywords.some((k: string) =>
          k.toLowerCase().includes(term)
        );
        if (!matchesName && !matchesDesc && !matchesFaculty && !matchesKeywords) return false;
      }

      // Faculty filter
      if (selectedFaculty !== 'all' && program.facultyId !== selectedFaculty) {
        return false;
      }

      // Degree filter
      if (selectedDegree !== 'all' && program.degreeLevel !== selectedDegree) {
        return false;
      }

      // Tier filter
      if (selectedTier !== 'all' && score.tier !== selectedTier) {
        return false;
      }

      // Pathway filter
      if (selectedPathway !== 'all') {
        const quota = getQuotaByProgramId(score.programId);
        if (!quota) return false;
        if (selectedPathway === 'snbp' && (!quota.snbpQuota || quota.snbpQuota <= 0)) return false;
        if (selectedPathway === 'snbt' && (!quota.snbtQuota || quota.snbtQuota <= 0)) return false;
        if (selectedPathway === 'mandiri' && (!quota.mandiriQuota || quota.mandiriQuota <= 0)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'quota') {
        const qA = getQuotaByProgramId(a.programId)?.totalCapacity ?? -1;
        const qB = getQuotaByProgramId(b.programId)?.totalCapacity ?? -1;
        return qB - qA;
      }
      if (sortBy === 'name') {
        const nameA = programMap.get(a.programId)?.name || '';
        const nameB = programMap.get(b.programId)?.name || '';
        return nameA.localeCompare(nameB);
      }
      return b.totalScore - a.totalScore;
    });
  }, [
    programScores,
    programMap,
    facultyMap,
    searchTerm,
    selectedFaculty,
    selectedDegree,
    selectedTier,
    selectedPathway,
    sortBy,
  ]);

  // Paginated visible slice
  const visibleScores = useMemo(() => {
    return filteredScores.slice(0, visibleCount);
  }, [filteredScores, visibleCount]);

  // Auto-load more when sentinel scrolls into view
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visibleCount >= filteredScores.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 16, filteredScores.length));
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount, filteredScores.length]);

  // Tier counts
  const tierCounts = useMemo(() => {
    const counts = { S: 0, A: 0, B: 0, C: 0, D: 0 };
    for (const s of programScores) {
      if (counts[s.tier] !== undefined) {
        counts[s.tier]++;
      }
    }
    return counts;
  }, [programScores]);

  return (
    <div className="space-y-6">
      {/* Active Faculty Filter Indicator from Map */}
      {selectedFaculty !== 'all' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 sm:p-4 text-xs flex items-center justify-between gap-3 text-amber-200">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-[8px] bg-amber-500 text-stone-900 px-2 py-0.5 rounded font-black">
              FOKUS PETA
            </span>
            <span>
              Menampilkan program studi <strong>{facultyMap.get(selectedFaculty)?.name}</strong>
            </span>
          </div>
          <button
            onClick={() => setSelectedFaculty('all')}
            className="text-xs font-bold text-amber-300 hover:text-white underline cursor-pointer shrink-0"
          >
            Tampilkan Semua Prodi
          </button>
        </div>
      )}

      {/* Filters and Search Bar Container */}
      <div className="bg-[#190E08] rounded-2xl p-4 sm:p-6 border-2 border-[#78350F] shadow-inner space-y-4 text-amber-100">
        {/* Tier Pills Filter */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-[#78350F]/70">
          <span className="text-xs font-bold text-amber-200/90 uppercase tracking-wider mr-2 hidden sm:inline font-mono">
            Filter Tier:
          </span>
          <button
            onClick={() => setSelectedTier('all')}
            aria-label={`Tampilkan semua tier prodi (${programScores.length} program)`}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] flex items-center ${
              selectedTier === 'all'
                ? 'bg-[#F59E0B] text-stone-950 font-black shadow-xs'
                : 'bg-[#24130C] text-amber-200/90 hover:bg-[#341A10] border border-[#78350F]'
            }`}
          >
            Semua ({programScores.length})
          </button>
          {(['S', 'A', 'B', 'C', 'D'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              aria-label={`Filter berdasarkan Tier ${t} (${tierCounts[t]} program studi)`}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border min-h-[44px] ${
                selectedTier === t
                  ? 'bg-[#F59E0B] text-stone-950 border-[#F59E0B] font-black shadow-xs'
                  : 'bg-[#24130C] text-amber-200/90 border-[#78350F] hover:bg-[#341A10]'
              }`}
            >
              <span>Tier {t}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                  selectedTier === t
                    ? 'bg-stone-950 text-amber-300'
                    : 'bg-[#190E08] text-amber-200 border border-[#78350F]/70'
                }`}
              >
                {tierCounts[t]}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Select Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-amber-200/80 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari prodi, bidang studi, atau kata kunci..."
              value={searchTerm}
              aria-label="Cari program studi, bidang studi, atau kata kunci kurikulum"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-[#24130C] border border-[#78350F] rounded-xl focus:outline-hidden focus:border-[#F59E0B] transition-all text-[#FFFBEB] placeholder:text-stone-400 min-h-[44px]"
            />
          </div>

          {/* Faculty Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedFaculty}
              aria-label="Filter berdasarkan Fakultas atau Sekolah"
              onChange={(e) => setSelectedFaculty(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#24130C] border border-[#78350F] rounded-xl focus:outline-hidden focus:border-[#F59E0B] font-medium text-amber-100 cursor-pointer min-h-[44px]"
            >
              <option value="all">Semua Fakultas & Sekolah ({faculties.length})</option>
              {faculties.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.shortName} — {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Degree Dropdown */}
          <div className="sm:col-span-2">
            <select
              value={selectedDegree}
              aria-label="Filter berdasarkan Jenjang Pendidikan"
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#24130C] border border-[#78350F] rounded-xl focus:outline-hidden focus:border-[#F59E0B] font-medium text-amber-100 cursor-pointer min-h-[44px]"
            >
              <option value="all">Semua Jenjang</option>
              <option value="S1">Sarjana (S1)</option>
              <option value="D4">Vokasi (D4)</option>
            </select>
          </div>

          {/* Pathway Dropdown */}
          <div className="sm:col-span-3">
            <select
              value={selectedPathway}
              aria-label="Filter berdasarkan Jalur Penerimaan Mahasiswa"
              onChange={(e) => setSelectedPathway(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-[#24130C] border border-[#78350F] rounded-xl focus:outline-hidden focus:border-[#F59E0B] font-medium text-amber-100 cursor-pointer min-h-[44px]"
            >
              <option value="all">Semua Jalur Penerimaan</option>
              <option value="snbp">Tersedia Jalur SNBP</option>
              <option value="snbt">Tersedia Jalur SNBT</option>
              <option value="mandiri">Tersedia Jalur Mandiri</option>
            </select>
          </div>
        </div>

        {/* Sort and Count Sub-bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-200/90 pt-2 border-t border-[#78350F]/60">
          <div className="flex items-center gap-3">
            <span>
              Menampilkan <strong className="text-[#FDE68A]">{filteredScores.length}</strong> dari <strong className="text-[#FDE68A]">{programScores.length}</strong> program studi
            </span>
            {(searchTerm || selectedFaculty !== 'all' || selectedDegree !== 'all' || selectedTier !== 'all' || selectedPathway !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedFaculty('all');
                  setSelectedDegree('all');
                  setSelectedTier('all');
                  setSelectedPathway('all');
                  setSortBy('score');
                }}
                aria-label="Reset semua filter pencarian dan seleksi prodi"
                className="text-xs text-amber-400 hover:text-amber-200 underline font-bold cursor-pointer min-h-[44px] flex items-center"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-amber-200/90 font-medium flex items-center gap-1 font-mono">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Urutkan:</span>
            </span>
            <select
              value={sortBy}
              aria-label="Urutkan daftar program studi"
              onChange={(e) => setSortBy(e.target.value as 'score' | 'quota' | 'name')}
              className="px-3 py-2 bg-[#24130C] border border-[#78350F] rounded-xl text-xs font-bold text-amber-200 focus:outline-hidden focus:border-[#F59E0B] cursor-pointer min-h-[44px]"
            >
              <option value="score">Skor Kecocokan (Tertinggi)</option>
              <option value="quota">Daya Tampung (Terbanyak)</option>
              <option value="name">Nama Prodi (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Program Cards / List */}
      <div className="space-y-4">
        {filteredScores.length === 0 ? (
          <div className="bg-[#190E08] rounded-2xl p-12 text-center border-2 border-[#78350F] text-amber-200/70">
            <Layers className="w-12 h-12 mx-auto text-amber-400/60 mb-3" />
            <h4 className="font-extrabold text-[#FFFBEB] text-base">Tidak Ada Program Studi Ditemukan</h4>
            <p className="text-xs text-amber-200/70 mt-1 max-w-sm mx-auto">
              Tidak ada jurusan yang cocok dengan filter yang dipilih. Coba reset filter atau gunakan kata kunci lain.
            </p>
          </div>
        ) : (
          visibleScores.map((score, index) => {
            const program = programMap.get(score.programId);
            if (!program) return null;
            const faculty = facultyMap.get(program.facultyId);
            const quota = getQuotaByProgramId(program.id);
            const isComparing = comparisonIds.includes(program.id);
            const isExpanded = expandedScoreId === score.programId;
            const isTopRank = index === 0 && selectedFaculty === 'all' && selectedTier === 'all';

            return (
              <ProgramCard
                key={score.programId}
                score={score}
                index={index}
                program={program}
                faculty={faculty}
                quota={quota}
                isComparing={isComparing}
                isExpanded={isExpanded}
                isTopRank={isTopRank}
                onToggleComparison={onToggleComparison}
                onSelectFaculty={setSelectedFaculty}
                onToggleExpand={(id) => setExpandedScoreId(expandedScoreId === id ? null : id)}
              />
            );
          })
        )}

        {/* Sentinel & Load More Controls */}
        {filteredScores.length > visibleCount && (
          <div className="pt-3 pb-2 flex flex-col items-center gap-2">
            <div ref={sentinelRef} className="h-4 w-full" />
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 16, filteredScores.length))}
              className="font-pixel text-[10px] sm:text-xs bg-[#78350F] hover:bg-[#8D3F12] text-[#FDE68A] px-4 py-2.5 rounded-xl border-2 border-[#F59E0B] shadow-md transition-all cursor-pointer flex items-center gap-2 min-h-[44px]"
              aria-label={`Tampilkan lebih banyak prodi, tersisa ${filteredScores.length - visibleCount}`}
            >
              <span>Tampilkan Lebih Banyak ({filteredScores.length - visibleCount} prodi lagi)</span>
              <ChevronDown className="w-4 h-4 text-amber-300" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});
