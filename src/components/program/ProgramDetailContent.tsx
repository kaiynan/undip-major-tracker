'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { studyPrograms, getProgramById } from '@/data/programs';
import { faculties } from '@/data/faculties';
import { isPsdku } from '@/data/types';
import { getQuotaByProgramId } from '@/data/quotas';
import { getUKTByProgramId } from '@/data/ukt';
import { getProgramDetailById } from '@/data/programDetails';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { TierBadge } from '@/components/ui/TierBadge';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { ComparePickerModal } from '@/components/program/ComparePickerModal';
import { ProgramRichDetails } from '@/components/program/ProgramRichDetails';
import {
  ArrowLeft,
  ExternalLink,
  Sparkles,
  Layers,
  Building2,
  Check,
  Scale,
  Compass,
  Users,
  MapPin,
  Info,
  ArrowRight,
  Banknote,
} from 'lucide-react';

interface ProgramDetailContentProps {
  programId: string;
}

export function ProgramDetailContent({ programId }: ProgramDetailContentProps) {
  const router = useRouter();
  const {
    getScoreForProgram,
    comparisonIds,
    toggleComparison,
  } = useQuestionnaire();

  const program = getProgramById(programId);
  const faculty = faculties.find((f) => f.id === program?.facultyId);
  const quota = getQuotaByProgramId(programId);
  const programUkt = getUKTByProgramId(programId);
  const detail = getProgramDetailById(programId);
  const score = getScoreForProgram(programId);
  const isComparing = comparisonIds.includes(programId);

  const [isPickerOpen, setIsPickerOpen] = React.useState(false);

  // Other programs in the same faculty
  const relatedPrograms = React.useMemo(() => {
    if (!program) return [];
    return studyPrograms
      .filter((p) => p.facultyId === program.facultyId && p.id !== program.id)
      .slice(0, 4);
  }, [program]);

  if (!program) {
    return (
      <div className="relative min-h-[75vh] flex items-center justify-center px-4 bg-[#140B07] text-slate-100">
        <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#2A111E]/40 via-[#1A0E08] to-[#140B07]" />
        <div className="max-w-md w-full bg-[#24130C] rounded-2xl sm:rounded-3xl p-8 sm:p-10 border-2 border-[#78350F] text-center shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          <div className="w-16 h-16 rounded-2xl bg-[#190E08] border-2 border-[#78350F] flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#FFFBEB] font-pixel">Program Studi Tidak Ditemukan</h2>
          <p className="text-xs text-amber-200/80 mt-2 mb-6 leading-relaxed">
            Program studi dengan ID &ldquo;{programId}&rdquo; tidak terdaftar dalam database kami.
          </p>
          <Link
            href="/results"
            className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-amber-400 text-stone-950 text-xs font-black px-5 py-3 rounded-xl border-2 border-amber-600 transition-all shadow-[2px_2px_0_0_#000]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Hasil Rekomendasi</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-24 pt-6 text-slate-100 bg-[#140B07] border-t-2 border-[#78350F] overflow-x-hidden">
      {/* Calm, Static Golden-Hour Atmosphere (Synchronized with Questionnaire) */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#2A111E]/40 via-[#1A0E08] to-[#140B07]" />

      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 space-y-4 sm:space-y-6">
        {/* Navigation Breadcrumb & Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
          <button
            onClick={() => router.back()}
            aria-label="Kembali ke Daftar Rekomendasi"
            className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-amber-200/90 hover:text-white bg-[#190E08] hover:bg-[#341A10] border-2 border-[#78350F] px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-[2px_2px_0_0_#000] cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span>Kembali ke Daftar Rekomendasi</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <FavoriteButton programId={program.id} programName={program.name} showText />

            <button
              onClick={() => setIsPickerOpen(true)}
              aria-label={`Bandingkan ${program.name} dengan program studi lain`}
              className="text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-bold flex items-center gap-1.5 sm:gap-2 border-2 bg-[#190E08] text-[#FDE68A] border-[#78350F] hover:bg-[#341A10] hover:border-[#F59E0B] transition-all cursor-pointer shadow-[2px_2px_0_0_#000] min-h-[44px]"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Bandingkan dengan...</span>
            </button>

            <button
              onClick={() => toggleComparison(program.id)}
              aria-label={isComparing ? `Hapus ${program.name} dari komparasi` : `Tambah ${program.name} ke komparasi prodi`}
              className={`text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-black flex items-center gap-1.5 sm:gap-2 border-2 transition-all cursor-pointer shadow-[2px_2px_0_0_#000] min-h-[44px] ${
                isComparing
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500 hover:bg-emerald-900'
                  : 'bg-[#190E08] text-amber-200/90 border-[#78350F] hover:bg-[#341A10] hover:text-white'
              }`}
            >
              {isComparing ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Scale className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isComparing ? 'Dalam Komparasi' : 'Bandingkan'}</span>
            </button>
          </div>
        </div>

        {/* Header Hero Card: Program Identity */}
        <div className="bg-[#24130C] rounded-2xl sm:rounded-3xl p-4 sm:p-8 md:p-10 border-2 border-[#78350F] shadow-[0_4px_24px_rgba(0,0,0,0.5)] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 sm:gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-3">
                <span className="text-[11px] sm:text-xs font-bold text-[#FDE68A] bg-[#78350F] border border-[#F59E0B] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg uppercase tracking-wider">
                  Jenjang {program.degreeLevel}
                </span>
                <span className="text-[11px] sm:text-xs text-amber-200 font-bold bg-[#190E08] border border-[#78350F] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg">
                  {faculty?.name} ({faculty?.shortName})
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-300 bg-[#190E08] border border-[#78350F] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{program.campusLocation || 'Semarang (Tembalang)'}</span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-medium text-amber-200/70 bg-[#190E08] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-[#78350F]">
                  TA {program.academicYear}
                </span>
              </div>

              <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-[#FFFBEB] font-pixel tracking-wide leading-snug break-words">
                {program.name}
              </h1>

              <p className="text-xs sm:text-sm text-amber-100/90 mt-3 sm:mt-4 leading-relaxed">
                {program.description}
              </p>

              {/* Official Website link */}
              <div className="mt-5 sm:mt-6 flex items-center gap-3">
                <a
                  href={program.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-black text-stone-950 bg-[#F59E0B] hover:bg-amber-400 border-2 border-amber-600 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-[2px_2px_0_0_#000]"
                >
                  <span>Kunjungi Website Resmi Program Studi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Match Score Display Card or PSDKU Note */}
            {isPsdku(program) ? (
              <div className="bg-[#190E08] p-4 sm:p-5 rounded-2xl border-2 border-amber-600/70 text-center shrink-0 w-full sm:w-auto lg:w-56 text-xs text-amber-200/90 flex flex-col items-center justify-center shadow-inner space-y-1.5">
                <MapPin className="w-6 h-6 text-[#F59E0B]" />
                <span className="font-bold text-[#FDE68A] font-pixel text-[11px]">Kampus PSDKU</span>
                <span className="text-[11px] text-amber-200/80 font-mono leading-tight">
                  Program PSDKU tidak ikut dalam peringkat kecocokan
                </span>
              </div>
            ) : score ? (
              <div className="bg-[#190E08] p-4 sm:p-6 rounded-2xl border-2 border-[#78350F] text-center shrink-0 w-full sm:w-auto lg:w-48 shadow-inner flex sm:flex-col items-center justify-between sm:justify-center gap-3">
                <div className="text-left sm:text-center">
                  <div className="text-[10px] uppercase tracking-wider font-bold text-amber-300/80">
                    Kecocokan Minat
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-amber-400 mt-0.5 sm:mt-1 font-pixel">
                    {score.totalScore}%
                  </div>
                </div>
                <div className="sm:mt-3 flex flex-col items-center justify-center">
                  <TierBadge tier={score.tier} size="md" showHelpText={score.tier === 'D'} />
                </div>
              </div>
            ) : (
              <div className="bg-[#190E08] p-4 sm:p-5 rounded-2xl border-2 border-[#78350F] text-center shrink-0 w-full sm:w-auto lg:w-48 text-xs text-amber-200/80 flex flex-col items-center justify-center shadow-inner">
                <Compass className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 mb-1.5 sm:mb-2" />
                <span className="font-bold text-[#FFFBEB]">Belum Ada Skor</span>
                <span className="text-[11px] text-amber-200/60 mt-1">Isi kuisioner untuk melihat kecocokan minatmu.</span>
                <Link
                  href="/questionnaire"
                  className="mt-3 text-[11px] font-black text-stone-950 bg-[#F59E0B] hover:bg-amber-400 px-3.5 py-1.5 rounded-xl transition-all shadow-[2px_2px_0_0_#000]"
                >
                  Mulai Tes
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* PSDKU Specific Information Notice */}
        {isPsdku(program) && (
          <div className="bg-[#24130C] rounded-2xl p-4 sm:p-5 border-2 border-amber-600/70 text-white flex items-start gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h2 className="font-pixel text-xs text-[#FDE68A]">
                Program PSDKU tidak ikut dalam peringkat kecocokan
              </h2>
              <p className="text-amber-100/90 leading-relaxed font-sans">
                Program studi ini diselenggarakan di Kampus PSDKU UNDIP ({program.campusLocation || 'Luar Semarang'}). Program PSDKU tidak ikut dalam peringkat kecocokan, namun data daya tampung dan biaya kuliah UKT tetap resmi dan terverifikasi.
              </p>
            </div>
          </div>
        )}

        {/* Personalized "Why This Program Matches You" Section (HMIM Recommendation) */}
        {score && (
          <div className="bg-[#24130C] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-2 border-[#78350F] shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-4 sm:space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-2.5 bg-[#78350F] border border-[#F59E0B] rounded-xl text-[#FDE68A]">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-base sm:text-xl font-black text-[#FFFBEB] font-pixel">
                  Mengapa Program Studi Ini Cocok Untukmu?
                </h2>
                <p className="text-[11px] sm:text-xs text-amber-200/70 mt-0.5">
                  Analisis keselarasan profil minat dari 36 butir instrumen evaluasi HMIM
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed bg-[#190E08] p-3.5 sm:p-5 rounded-2xl border border-[#78350F]">
              {score.explanation}
            </p>

            {/* 4 Dimension Score Breakdown Progress Bars */}
            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#FDE68A] mb-3 sm:mb-4">
                Rincian Skor Keselarasan 4 Dimensi Minat:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Dimension 1: RIASEC */}
                <div className="bg-[#190E08] p-3.5 sm:p-4 rounded-2xl border border-[#78350F]">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#FFFBEB]">1. Minat Umum (RIASEC)</span>
                    <span className="text-amber-400 font-mono">{score.dimensionScores.riasec}%</span>
                  </div>
                  <div className="w-full bg-[#140B07] rounded-full h-2.5 border border-[#78350F]/70 p-0.5 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-500 shadow-xs"
                      style={{ width: `${score.dimensionScores.riasec}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-amber-200/70 mt-1.5 block">
                    Bobot perhitungan: 20%
                  </span>
                </div>

                {/* Dimension 2: Domain-Specific */}
                <div className="bg-[#190E08] p-3.5 sm:p-4 rounded-2xl border border-[#78350F]">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#FFFBEB]">2. Bidang Ilmu Spesifik</span>
                    <span className="text-emerald-400 font-mono">{score.dimensionScores.domain}%</span>
                  </div>
                  <div className="w-full bg-[#140B07] rounded-full h-2.5 border border-[#78350F]/70 p-0.5 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500 shadow-xs"
                      style={{ width: `${score.dimensionScores.domain}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-emerald-300/80 mt-1.5 block font-bold">
                    Bobot perhitungan: 35% (Paling Berpengaruh)
                  </span>
                </div>

                {/* Dimension 3: Learning Preference */}
                <div className="bg-[#190E08] p-3.5 sm:p-4 rounded-2xl border border-[#78350F]">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#FFFBEB]">3. Preferensi Gaya Belajar</span>
                    <span className="text-sky-400 font-mono">{score.dimensionScores.learning}%</span>
                  </div>
                  <div className="w-full bg-[#140B07] rounded-full h-2.5 border border-[#78350F]/70 p-0.5 overflow-hidden">
                    <div
                      className="bg-sky-400 h-full rounded-full transition-all duration-500 shadow-xs"
                      style={{ width: `${score.dimensionScores.learning}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-amber-200/70 mt-1.5 block">
                    Bobot perhitungan: 20%
                  </span>
                </div>

                {/* Dimension 4: Curriculum & Competency */}
                <div className="bg-[#190E08] p-3.5 sm:p-4 rounded-2xl border border-[#78350F]">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#FFFBEB]">4. Kurikulum & Karakteristik Prodi</span>
                    <span className="text-purple-400 font-mono">{score.dimensionScores.curriculum}%</span>
                  </div>
                  <div className="w-full bg-[#140B07] rounded-full h-2.5 border border-[#78350F]/70 p-0.5 overflow-hidden">
                    <div
                      className="bg-purple-400 h-full rounded-full transition-all duration-500 shadow-xs"
                      style={{ width: `${score.dimensionScores.curriculum}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-amber-200/70 mt-1.5 block">
                    Bobot perhitungan: 25%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Official Admission Quotas & Capacity (Daya Tampung) */}
        <div className="bg-[#24130C] rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-2 border-[#78350F] shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#78350F]/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#78350F] text-[#FDE68A] border border-[#F59E0B] flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h2 className="text-base sm:text-lg font-black text-[#FFFBEB] font-pixel">
                    Daya Tampung & Kuota Penerimaan
                  </h2>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#FDE68A] bg-[#190E08] border border-[#78350F] px-2 sm:px-2.5 py-0.5 rounded-full">
                    Kuota TA {quota?.academicYear || program.academicYear} — dapat berubah
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-amber-200/80 mt-0.5">
                  Distribusi kuota kursi resmi penerimaan mahasiswa baru per jalur seleksi di Universitas Diponegoro.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs font-semibold text-amber-200 bg-[#190E08] px-3 py-1.5 rounded-xl border border-[#78350F]">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Kuota TA {quota?.academicYear || program.academicYear} — dapat berubah{quota?.lastVerified ? ` (data per ${quota.lastVerified})` : ''}</span>
            </div>
          </div>

          {/* Quota Breakdown Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Kapasitas */}
            <div className="bg-[#78350F] text-white p-4 sm:p-5 rounded-2xl border border-[#F59E0B] shadow-inner">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-amber-200 block">
                Total Daya Tampung
              </span>
              <div className="text-2xl sm:text-3xl font-black mt-1 font-pixel text-[#FFFBEB]">
                {quota?.totalCapacity !== null && quota?.totalCapacity !== undefined
                  ? `${quota.totalCapacity} Kursi`
                  : 'Data belum tersedia'}
              </div>
              <span className="text-[10px] text-amber-200/90 mt-1 block">
                Semua Jalur Penerimaan
              </span>
            </div>

            {/* SNBP */}
            <div className="bg-[#190E08] p-4 sm:p-5 rounded-2xl border-2 border-[#78350F]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-amber-200/80">
                  Jalur SNBP
                </span>
                <span className="text-[10px] font-bold text-blue-300 bg-blue-950/80 border border-blue-700/60 px-1.5 py-0.5 rounded">
                  Min. 20%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 font-pixel">
                {quota?.snbpQuota !== null && quota?.snbpQuota !== undefined
                  ? `${quota.snbpQuota} Kursi`
                  : 'Belum tersedia'}
              </div>
              <span className="text-[10px] text-amber-200/70 mt-1 block">
                {quota?.snbpQuota && quota?.totalCapacity
                  ? `${Math.round((quota.snbpQuota / quota.totalCapacity) * 100)}% kapasitas`
                  : 'Seleksi Nasional Prestasi'}
              </span>
            </div>

            {/* SNBT */}
            <div className="bg-[#190E08] p-4 sm:p-5 rounded-2xl border-2 border-[#78350F]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-amber-200/80">
                  Jalur SNBT
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-1.5 py-0.5 rounded">
                  Min. 30%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 font-pixel">
                {quota?.snbtQuota !== null && quota?.snbtQuota !== undefined
                  ? `${quota.snbtQuota} Kursi`
                  : 'Belum tersedia'}
              </div>
              <span className="text-[10px] text-amber-200/70 mt-1 block">
                {quota?.snbtQuota && quota?.totalCapacity
                  ? `${Math.round((quota.snbtQuota / quota.totalCapacity) * 100)}% kapasitas`
                  : 'Ujian Tulis Berbasis Komputer'}
              </span>
            </div>

            {/* Seleksi Mandiri */}
            <div className="bg-[#190E08] p-4 sm:p-5 rounded-2xl border-2 border-[#78350F]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-amber-200/80">
                  Seleksi Mandiri
                </span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 border border-amber-700/60 px-1.5 py-0.5 rounded">
                  Maks. 50%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 font-pixel">
                {quota?.mandiriQuota !== null && quota?.mandiriQuota !== undefined
                  ? `${quota.mandiriQuota} Kursi`
                  : 'Belum tersedia'}
              </div>
              <span className="text-[10px] text-amber-200/70 mt-1 block">
                {quota?.mandiriQuota && quota?.totalCapacity
                  ? `${Math.round((quota.mandiriQuota / quota.totalCapacity) * 100)}% kapasitas`
                  : 'Ujian Mandiri UNDIP'}
              </span>
            </div>
          </div>

          {/* Visual Percentage Proportional Bar */}
          {quota?.totalCapacity && quota.snbpQuota && quota.snbtQuota && quota.mandiriQuota && (
            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs font-bold text-amber-200">
                <span>Distribusi Proporsi Kursi per Jalur</span>
                <span className="text-[11px] text-amber-300/80 font-normal">Total: {quota.totalCapacity} Kursi</span>
              </div>
              <div className="h-3.5 w-full bg-[#140B07] rounded-full overflow-hidden flex border-2 border-[#78350F]">
                <div
                  style={{ width: `${(quota.snbpQuota / quota.totalCapacity) * 100}%` }}
                  className="bg-blue-500 transition-all"
                  title={`SNBP: ${quota.snbpQuota} Kursi`}
                />
                <div
                  style={{ width: `${(quota.snbtQuota / quota.totalCapacity) * 100}%` }}
                  className="bg-emerald-500 transition-all"
                  title={`SNBT: ${quota.snbtQuota} Kursi`}
                />
                <div
                  style={{ width: `${(quota.mandiriQuota / quota.totalCapacity) * 100}%` }}
                  className="bg-amber-500 transition-all"
                  title={`Mandiri: ${quota.mandiriQuota} Kursi`}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-amber-200/80 pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>SNBP ({Math.round((quota.snbpQuota / quota.totalCapacity) * 100)}%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>SNBT ({Math.round((quota.snbtQuota / quota.totalCapacity) * 100)}%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Seleksi Mandiri ({Math.round((quota.mandiriQuota / quota.totalCapacity) * 100)}%)</span>
                </span>
              </div>
            </div>
          )}

          {/* Source Citation & Data Integrity Note */}
          <div className="bg-[#190E08] rounded-2xl p-4 sm:p-5 border border-[#78350F] space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#FDE68A]">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Sumber Data Resmi & Integritas Rekomendasi</span>
            </div>
            <p className="text-amber-100/90 leading-relaxed">
              Data kuota penerimaan merujuk pada ketetapan resmi <strong>{quota?.sourceName || 'Portal SNPMB BPPP & PMB UNDIP'}</strong>{' '}
              untuk Tahun Akademik {quota?.academicYear || '2024/2025'} (Data per {quota?.lastVerified || '2025-01-15'}).
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#78350F]/60">
              <span className="text-[11px] text-amber-200/60 italic">
                *Informasi daya tampung disajikan sebagai referensi eksplorasi dan <strong>tidak mempengaruhi skor kecocokan minat HMIM</strong>.
              </span>
              {quota?.sourceUrl && (
                <a
                  href={quota.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 underline text-[11px]"
                >
                  <span>Buka Sumber Rujukan ({quota.sourceId === 'snpmb-2024' ? 'SNPMB BPPP' : 'PMB UNDIP'})</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Next Steps CTA Link (UKT, KIP-Kuliah, Kalender Seleksi) */}
          <div className="bg-[#190E08] border-2 border-[#F59E0B] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3.5 shadow-[2px_2px_0_0_#000]">
            <div className="space-y-0.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 text-[#FDE68A] font-pixel text-xs sm:text-sm">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Langkah Selanjutnya: Biaya, Beasiswa & Jadwal</span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-100/80 leading-relaxed max-w-xl">
                Pelajari struktur Golongan UKT, program beasiswa KIP-Kuliah, dan kalender seleksi masuk UNDIP (SNBP, SNBT, UM).
              </p>
            </div>
            <Link
              href="/langkah-selanjutnya"
              className="inline-flex items-center gap-1.5 bg-[#F59E0B] hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs font-pixel transition-all shadow-[2px_2px_0_0_#000] shrink-0 min-h-[44px] cursor-pointer"
            >
              <span>Buka Langkah Selanjutnya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Official Program UKT */}
        {programUkt && (
          <div className="bg-[#24130C] rounded-2xl sm:rounded-3xl p-4 sm:p-8 border-2 border-[#78350F] shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#78350F]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#78350F] text-[#FDE68A] border border-[#F59E0B] flex items-center justify-center shrink-0">
                  <Banknote className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <h2 className="text-base sm:text-lg font-black text-[#FFFBEB] font-pixel">
                      Tarif Uang Kuliah Tunggal (UKT)
                    </h2>
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-300 bg-[#140B07] border border-emerald-900/60 px-2 py-0.5 rounded">
                      Resmi
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-amber-200/80 mt-0.5">
                    Tarif resmi per semester untuk {program.name} ({program.degreeLevel}) TA {programUkt.academicYear}.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-300/80 italic">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Terverifikasi per {programUkt.retrievedAt}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {programUkt.groups.map((g) => (
                  <div
                    key={g.group}
                    className="bg-[#190E08] border border-[#78350F] rounded-xl p-3 space-y-1"
                  >
                    <div className="text-[10px] text-amber-300 uppercase tracking-wider font-bold">
                      Golongan {g.group}
                    </div>
                    <div className="font-mono text-xs sm:text-sm font-bold text-emerald-400">
                      {g.formatted}
                    </div>
                    <div className="text-[10px] text-amber-100/60">
                      per semester
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-amber-200/70 pt-2 border-t border-[#78350F]/50 flex flex-wrap items-center justify-between gap-3">
                <span className="italic">
                  Bukti: {programUkt.evidence}
                </span>
                <Link
                  href={`/langkah-selanjutnya/biaya-ukt?prodi=${program.id}`}
                  className="inline-flex items-center gap-1.5 bg-[#190E08] hover:bg-[#2A160E] border border-[#78350F] text-[#FDE68A] hover:text-white px-3 py-2 rounded-xl text-xs font-pixel transition-colors min-h-[44px]"
                >
                  <span>Buka di Halaman Biaya UKT</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Detail Kurikulum, Akreditasi, dan Prospek Karier Terverifikasi */}
        <ProgramRichDetails program={program} detail={detail} />

        {/* Related Programs in the Same Faculty */}
        {relatedPrograms.length > 0 && (
          <div className="bg-[#24130C] rounded-2xl sm:rounded-3xl p-4 sm:p-7 border-2 border-[#78350F] shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#78350F]/60">
              <div className="flex items-center gap-2 text-[#FFFBEB] font-pixel text-sm">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>Program Studi Lain di {faculty?.shortName}</span>
              </div>
              <span className="text-xs text-amber-300 font-mono">Alternatif Pilihan</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedPrograms.map((rel) => {
                const relScore = getScoreForProgram(rel.id);
                const relQuota = getQuotaByProgramId(rel.id);
                return (
                  <Link
                    key={rel.id}
                    href={`/program/${rel.id}`}
                    className="p-3.5 sm:p-4 rounded-2xl bg-[#190E08] border-2 border-[#78350F] hover:border-[#F59E0B] transition-all flex items-center justify-between gap-3 group shadow-md"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-[10px] font-bold text-amber-300 bg-[#24130C] border border-[#78350F] px-1.5 py-0.5 rounded">
                          {rel.degreeLevel}
                        </span>
                        {relScore && <TierBadge tier={relScore.tier} size="sm" />}
                      </div>
                      <div className="font-bold text-sm text-[#FFFBEB] group-hover:text-[#FDE68A] transition-colors line-clamp-1">
                        {rel.name}
                      </div>
                      <div className="text-[11px] text-amber-200/70 mt-0.5">
                        Kapasitas: {relQuota?.totalCapacity ? `${relQuota.totalCapacity} Kursi` : 'Belum rilis'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {relScore && (
                        <span className="text-sm font-black text-amber-400 font-pixel">
                          {relScore.totalScore}%
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-amber-300 group-hover:text-amber-100 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Faculty Summary Card */}
        {faculty && (
          <div className="bg-[#24130C] rounded-2xl sm:rounded-3xl p-4 sm:p-7 border-2 border-[#78350F] shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-[#190E08] text-amber-400 border border-[#78350F] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">
                  Fakultas / Sekolah Induk
                </span>
                <h4 className="font-black text-[#FFFBEB] text-base font-pixel">{faculty.name}</h4>
                <p className="text-xs text-amber-100/80 mt-0.5 line-clamp-1">{faculty.description}</p>
              </div>
            </div>

            <a
              href={faculty.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-200 hover:text-white bg-[#190E08] hover:bg-[#341A10] px-4 py-2.5 rounded-xl transition-all shrink-0 self-start sm:self-auto border-2 border-[#78350F] shadow-[2px_2px_0_0_#000]"
            >
              <span>Website Fakultas</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Mandatory Official Disclaimer */}
        <DisclaimerBanner />

        {/* Compare Picker Modal */}
        <ComparePickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          currentProgram={program}
        />
      </div>
    </div>
  );
}
