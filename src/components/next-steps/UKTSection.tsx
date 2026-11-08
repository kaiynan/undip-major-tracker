'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { nextStepsData } from '@/data/nextSteps';
import { programUKTList, ProgramUKT } from '@/data/ukt';
import { faculties } from '@/data/faculties';
import { StatusBadge } from './StatusBadge';
import { retroAudio } from '@/lib/retroAudio';
import {
  Banknote,
  Search,
  ExternalLink,
  ShieldCheck,
  Info,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface UKTSectionProps {
  embedded?: boolean;
}

export function UKTSection({ embedded = false }: UKTSectionProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial program from query param `?prodi=<id>` if provided
  const prodiQuery = searchParams ? searchParams.get('prodi') : null;

  const [selectedProgramId, setSelectedProgramId] = useState<string>(() => {
    if (prodiQuery && programUKTList.some((p) => p.programId === prodiQuery)) {
      return prodiQuery;
    }
    return 'ft-sipil';
  });

  // Keep in sync during render if query param changes
  const [prevProdiQuery, setPrevProdiQuery] = useState(prodiQuery);
  if (prodiQuery !== prevProdiQuery) {
    setPrevProdiQuery(prodiQuery);
    if (prodiQuery && programUKTList.some((p) => p.programId === prodiQuery)) {
      setSelectedProgramId(prodiQuery);
    }
  }

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<string>('all');
  const [selectedDegree, setSelectedDegree] = useState<'all' | 'S1' | 'D4'>('all');

  const { ukt } = nextStepsData;

  const facultyMap = useMemo(() => {
    const map = new Map<string, string>();
    faculties.forEach((f) => map.set(f.id, f.name));
    return map;
  }, []);

  const selectedProgramUKT = useMemo(() => {
    return (
      programUKTList.find((p) => p.programId === selectedProgramId) ||
      programUKTList[0]
    );
  }, [selectedProgramId]);

  const filteredPrograms = useMemo(() => {
    return programUKTList.filter((p) => {
      const matchesSearch =
        p.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.programId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFaculty =
        selectedFaculty === 'all' || p.facultyId === selectedFaculty;
      const matchesDegree =
        selectedDegree === 'all' || p.degreeLevel === selectedDegree;
      return matchesSearch && matchesFaculty && matchesDegree;
    });
  }, [searchTerm, selectedFaculty, selectedDegree]);

  const handleSelectProgram = (program: ProgramUKT) => {
    retroAudio.playSelect();
    setSelectedProgramId(program.programId);
    // Update URL query string without reloading page
    const url = new URL(window.location.href);
    url.searchParams.set('prodi', program.programId);
    router.replace(url.pathname + url.search, { scroll: false });
  };

  const minAmount = selectedProgramUKT.groups[0]?.formatted ?? 'Rp500.000';
  const maxAmount =
    selectedProgramUKT.groups[selectedProgramUKT.groups.length - 1]?.formatted ??
    '-';

  return (
    <div className="space-y-6 text-white">
      {/* 1. Header / Intro Card */}
      {!embedded && (
        <div className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#2A160E] border-2 border-[#F59E0B] flex items-center justify-center text-[#FDE68A] shadow-[2px_2px_0_0_#000] shrink-0">
                <Banknote className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-pixel text-sm sm:text-base text-[#FDE68A]">
                    {ukt.title}
                  </h1>
                  <StatusBadge status={ukt.status} />
                </div>
                <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                  Struktur tarif Uang Kuliah Tunggal (UKT) per semester resmi berdasarkan SK Rektor UNDIP TA {selectedProgramUKT.academicYear}.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Interactive Program UKT Inspector Card */}
      <div className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-4 sm:p-6 space-y-6 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
        <div>
          <h2 className="font-pixel text-xs sm:text-sm text-[#FDE68A] flex items-center gap-2">
            <span>Pilih Program Studi untuk Cek Tarif UKT</span>
          </h2>
          <p className="text-xs text-amber-100/70 mt-1">
            Cari program studi atau pilih dari daftar untuk melihat besaran Golongan 1 s.d. {selectedProgramUKT.groups.length}.
          </p>
        </div>

        {/* Selected Program Spotlight */}
        <div className="bg-[#140B07] border-2 border-[#F59E0B]/80 rounded-xl p-4 sm:p-5 space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#78350F]/70">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-pixel text-xs sm:text-base text-[#FDE68A]">
                  {selectedProgramUKT.programName}
                </span>
                <span className="font-mono text-xs bg-[#24130C] text-amber-300 px-2 py-0.5 rounded border border-[#78350F]">
                  {selectedProgramUKT.degreeLevel}
                </span>
              </div>
              <p className="text-xs text-amber-200/80 mt-0.5">
                {facultyMap.get(selectedProgramUKT.facultyId) || selectedProgramUKT.facultyId}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#24130C] px-3.5 py-2 rounded-xl border border-[#78350F] max-w-full">
              <span className="text-[11px] text-amber-200/70 font-mono">Rentang Nominal:</span>
              <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400">
                {minAmount} s.d. {maxAmount}
              </span>
            </div>
          </div>

          {/* UKT Groups Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {selectedProgramUKT.groups.map((g) => (
              <div
                key={g.group}
                className="bg-[#1F120B] border border-[#78350F]/80 hover:border-amber-500/60 transition-colors rounded-xl p-3 text-center space-y-1 shadow-inner"
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">
                    Golongan {g.group}
                  </span>
                </div>
                <span className="font-mono text-xs sm:text-sm font-bold text-emerald-400 block">
                  {g.formatted}
                </span>
                <span className="text-[9px] text-amber-200/50 block font-mono">/ semester</span>
              </div>
            ))}
          </div>

          {/* Citation & Evidence info */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-amber-200/70 border-t border-[#78350F]/50">
            <span className="italic">
              Bukti Resmi: {selectedProgramUKT.evidence} (SK Penetapan UKT Mahasiswa Baru)
            </span>
            <span className="text-emerald-400 font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Status: Terverifikasi Dokumen Resmi</span>
            </span>
          </div>
        </div>

        {/* 3. Filter & Full Programs Table/Cards */}
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-amber-300/60" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama program studi..."
                aria-label="Cari program studi"
                className="w-full pl-9 pr-3 py-2 bg-[#140B07] border border-[#78350F] rounded-xl text-xs text-amber-100 placeholder-amber-400/40 focus:outline-hidden focus:border-[#F59E0B] min-h-[44px]"
              />
            </div>

            {/* Filter by Faculty & Degree */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
              <div className="relative min-w-0">
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  aria-label="Filter berdasarkan Fakultas"
                  className="w-full max-w-full bg-[#140B07] border border-[#78350F] text-amber-100 text-xs rounded-xl px-2.5 py-2 min-h-[44px] cursor-pointer truncate"
                >
                  <option value="all">Semua Fakultas</option>
                  {faculties.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.shortName} — {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative min-w-0">
                <select
                  value={selectedDegree}
                  onChange={(e) => setSelectedDegree(e.target.value as 'all' | 'S1' | 'D4')}
                  aria-label="Filter Jenjang Pendidikan"
                  className="w-full max-w-full bg-[#140B07] border border-[#78350F] text-amber-100 text-xs rounded-xl px-2.5 py-2 min-h-[44px] cursor-pointer truncate"
                >
                  <option value="all">Semua Jenjang</option>
                  <option value="S1">Sarjana (S1)</option>
                  <option value="D4">Vokasi (D4)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Select Program Cards */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-200/70">
              <span>Menampilkan {filteredPrograms.length} dari {programUKTList.length} program studi:</span>
              <span className="text-[10px] font-mono">Klik untuk melihat rincian golongan</span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1.5 p-1 border border-[#78350F]/60 rounded-xl bg-[#140B07] divide-y divide-[#78350F]/30">
              {filteredPrograms.map((p) => {
                const isSelected = p.programId === selectedProgramUKT.programId;
                const pMax = p.groups[p.groups.length - 1]?.formatted ?? '-';
                return (
                  <button
                    key={p.programId}
                    onClick={() => handleSelectProgram(p)}
                    className={`w-full text-left p-2.5 sm:p-3 rounded-lg flex items-center justify-between gap-3 transition-colors cursor-pointer min-h-[44px] ${
                      isSelected
                        ? 'bg-[#9A3412] text-[#FDE68A] border border-[#FDE68A]'
                        : 'hover:bg-[#24130C] text-stone-200'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-pixel text-[10px] sm:text-xs truncate">
                          {p.programName}
                        </span>
                        <span className="font-mono text-[9px] bg-[#140B07] text-amber-300 px-1.5 py-0.2 rounded border border-[#78350F]/70">
                          {p.degreeLevel}
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-200/60 block truncate">
                        {facultyMap.get(p.facultyId) || p.facultyId}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-bold text-emerald-400 block">
                        Rp500rb s.d. {pMax}
                      </span>
                      <span className="text-[9px] text-amber-200/50 block font-mono">
                        {p.groups.length} Golongan
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 4. Ketentuan IPI & Subsidi Note */}
        <div className="bg-[#2A160E] border border-amber-600/60 rounded-xl p-4 text-xs text-amber-200/90 space-y-2.5">
          <div className="flex items-center gap-2 font-bold text-[#FDE68A]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Ketentuan Iuran Pengembangan Institusi (IPI)</span>
          </div>
          <p className="text-xs text-amber-100/80 leading-relaxed">
            {ukt.ipiNote}
          </p>
          <div className="pt-2 border-t border-[#78350F]/60 flex items-center justify-between flex-wrap gap-2">
            <span className="text-[11px] text-amber-200/80">
              Rincian 4 sub-jalur UM, biaya registrasi & opsi pembebasan IPI:
            </span>
            <Link
              href="/langkah-selanjutnya/jadwal-seleksi#jalur-um"
              onClick={() => retroAudio.playSelect()}
              className="inline-flex items-center gap-1.5 text-[#FDE68A] hover:text-[#F59E0B] font-mono text-xs font-bold underline underline-offset-4 transition-colors"
            >
              <span>Jalur UM & IPI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 5. Struktur 8 Golongan Umum */}
        <div className="space-y-3 pt-2">
          <h2 className="font-pixel text-[11px] sm:text-xs text-[#F59E0B] uppercase tracking-wider pb-1 border-b border-[#78350F]/60">
            Penjelasan Skema Golongan UKT UNDIP
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ukt.groups.map((g) => (
              <div
                key={g.group}
                className="bg-[#140B07] border border-[#78350F] rounded-xl p-3 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-pixel text-[10px] text-[#FDE68A] font-bold">
                    {g.label}
                  </span>
                  <span className="font-mono text-[11px] text-emerald-300 font-bold bg-[#24130C] px-2 py-0.5 rounded border border-[#78350F]/60">
                    {g.nominalRange}
                  </span>
                </div>
                <p className="text-[11px] text-amber-100/70 leading-relaxed">
                  {g.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Footer Citation & Link */}
        <div className="pt-3 border-t border-[#78350F]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[10px] text-amber-300/80 italic flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Terverifikasi per {ukt.retrievedAt} ({ukt.evidence})</span>
          </span>
          <a
            href={ukt.officialDecisionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-stone-950 bg-[#F59E0B] hover:bg-[#FBBF24] px-3.5 py-2 rounded-xl text-xs transition-colors shadow-[2px_2px_0_0_#000] min-h-[44px]"
          >
            <span>Tabel Tarif Resmi PMB UNDIP</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
