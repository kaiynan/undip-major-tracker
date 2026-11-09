'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { studyPrograms } from '@/data/programs';
import { faculties } from '@/data/faculties';
import { getQuotaByProgramId } from '@/data/quotas';
import { isPsdku } from '@/data/types';
import { TierBadge } from '@/components/ui/TierBadge';
import { ConsultCta } from '@/components/contact/ConsultCta';
import {
  Heart,
  Scale,
  Trash2,
  ArrowRight,
  Compass,
  MapPin,
  Users,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import { retroAudio } from '@/lib/retroAudio';

export default function FavoritPage() {
  const router = useRouter();
  const {
    favorites,
    favoritesCount,
    removeFavorite,
    clearFavorites,
    isStorageBlocked,
    maxCap,
  } = useFavorites();

  const { getScoreForProgram, isComplete } = useQuestionnaire();

  // Selected for comparison (2 to 3 program IDs)
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  // Map favorite IDs to actual StudyProgram objects
  const favoritePrograms = useMemo(() => {
    return favorites
      .map((id) => studyPrograms.find((p) => p.id === id))
      .filter(Boolean) as (typeof studyPrograms)[0][];
  }, [favorites]);

  const toggleSelectForCompare = (programId: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(programId)) {
        retroAudio.playBlip(440);
        return prev.filter((id) => id !== programId);
      }
      if (prev.length >= 3) {
        alert('Anda dapat membandingkan maksimal 3 program studi sekaligus.');
        return prev;
      }
      retroAudio.playBlip(720);
      return [...prev, programId];
    });
  };

  const handleGoToCompare = () => {
    if (selectedForCompare.length < 2) return;
    retroAudio.playSelect();
    router.push(`/bandingkan?ids=${selectedForCompare.join(',')}`);
  };

  return (
    <div className="relative min-h-screen pb-24 pt-6 text-slate-100 bg-[#140B07] border-t-2 border-[#78350F]">
      {/* Calm Golden-Hour Atmospheric Gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#2A111E]/40 via-[#1A0E08] to-[#140B07]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Breadcrumb / Top Info */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-200/80">
            <Link href="/" className="hover:text-amber-100 transition-colors">
              BERANDA
            </Link>
            <span>/</span>
            <span className="text-[#FDE68A] font-bold">FAVORITKU</span>
          </div>

          {isComplete && (
            <Link
              href="/results"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-100 transition-colors min-h-[44px]"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Lihat Hasil Rekomendasi Tes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Storage Blocked Warning */}
        {isStorageBlocked && (
          <div className="bg-amber-950/80 border-2 border-amber-600/80 rounded-2xl p-4 flex items-start gap-3 text-amber-200 text-xs shadow-md">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-amber-100">Penyimpanan Browser Dinonaktifkan (Private Mode)</p>
              <p className="text-amber-200/80">
                Daftar favorit Anda tersimpan sementara dalam memori sesi ini dan akan hilang saat peramban ditutup.
              </p>
            </div>
          </div>
        )}

        {/* Page Header */}
        <div className="bg-[#24130C] border-2 border-[#78350F] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-950/80 border-2 border-rose-500/80 flex items-center justify-center text-rose-400 shadow-[2px_2px_0_0_#000] shrink-0">
                <Heart className="w-6 h-6 fill-rose-400 text-rose-400" />
              </div>
              <div>
                <h1 className="font-pixel text-lg sm:text-2xl text-[#FFFBEB] tracking-wide">
                  Program Studi Favoritku
                </h1>
                <p className="text-xs sm:text-sm text-amber-200/80 mt-1">
                  Koleksi prodi impian Anda ({favoritesCount}/{maxCap}). Pilih 2 hingga 3 prodi untuk dibandingkan berdampingan.
                </p>
              </div>
            </div>

            {favoritePrograms.length > 0 && (
              <div className="flex items-center gap-2.5 self-start md:self-center">
                <button
                  onClick={clearFavorites}
                  className="px-3.5 py-2.5 rounded-xl border border-rose-800/80 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-pixel text-[8.5px] transition-all min-h-[44px] cursor-pointer flex items-center gap-1.5"
                  aria-label="Kosongkan seluruh daftar favorit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan</span>
                </button>

                <button
                  onClick={handleGoToCompare}
                  disabled={selectedForCompare.length < 2 || selectedForCompare.length > 3}
                  className={`px-4 py-2.5 rounded-xl border-2 font-pixel text-[9px] sm:text-[10px] transition-all min-h-[44px] flex items-center gap-2 cursor-pointer shadow-[2px_2px_0_0_#000] ${
                    selectedForCompare.length >= 2 && selectedForCompare.length <= 3
                      ? 'bg-[#F59E0B] hover:bg-amber-400 text-stone-950 border-amber-600 font-black'
                      : 'bg-[#190E08] text-amber-200/40 border-[#78350F]/50 cursor-not-allowed opacity-60'
                  }`}
                  aria-label={`Bandingkan ${selectedForCompare.length} program studi terpilih`}
                >
                  <Scale className="w-4 h-4" />
                  <span>Bandingkan ({selectedForCompare.length})</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {favoritePrograms.length === 0 ? (
          <div className="bg-[#190E08] border-2 border-[#78350F] rounded-2xl sm:rounded-3xl p-8 sm:p-12 text-center shadow-lg space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-[#24130C] border-2 border-[#78350F] flex items-center justify-center mx-auto text-amber-400/60 shadow-[2px_2px_0_0_#000]">
              <Heart className="w-8 h-8 text-amber-400/50" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h2 className="font-pixel text-base sm:text-lg text-[#FFFBEB]">
                Belum Ada Program Studi Favorit
              </h2>
              <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">
                Tandai program studi favorit Anda dengan menekan ikon hati pada kartu hasil rekomendasi, direktori program studi, atau halaman detail prodi.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/program-studi"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-stone-950 font-pixel text-[9px] sm:text-[10px] font-bold border-2 border-amber-600 transition-all shadow-[2px_2px_0_0_#000] min-h-[44px]"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Jelajahi Program Studi</span>
              </Link>
              <Link
                href="/questionnaire"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#24130C] hover:bg-[#341A10] text-[#FDE68A] font-pixel text-[9px] sm:text-[10px] font-bold border-2 border-[#78350F] transition-all min-h-[44px]"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Mulai Tes Minat</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Favorites List */
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs text-amber-200/80 font-mono px-1">
              <span>Pilih 2–3 prodi untuk komparasi</span>
              <span>{selectedForCompare.length}/3 dipilih</span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {favoritePrograms.map((prog) => {
                const fac = faculties.find((f) => f.id === prog.facultyId);
                const quota = getQuotaByProgramId(prog.id);
                const score = getScoreForProgram(prog.id);
                const isSelected = selectedForCompare.includes(prog.id);
                const psdkuFlag = isPsdku(prog);

                return (
                  <article
                    key={prog.id}
                    className={`bg-[#190E08] rounded-2xl border-2 transition-all p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-[#F59E0B] ring-2 ring-amber-400/40 bg-[#22130B]'
                        : 'border-[#78350F] hover:border-[#F59E0B]/70'
                    }`}
                  >
                    {/* Left: Selection Checkbox + Program Info */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() => toggleSelectForCompare(prog.id)}
                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 mt-1 transition-all cursor-pointer min-h-[44px] min-w-[44px] ${
                          isSelected
                            ? 'bg-[#F59E0B] border-amber-600 text-stone-950 font-bold'
                            : 'bg-[#24130C] border-[#78350F] text-transparent hover:border-amber-400'
                        }`}
                        aria-pressed={isSelected}
                        aria-label={`Pilih ${prog.name} untuk komparasi`}
                        title={isSelected ? 'Batalkan pilihan komparasi' : 'Pilih untuk komparasi'}
                      >
                        <Scale className={`w-4 h-4 ${isSelected ? 'text-stone-950' : 'text-amber-200/40'}`} />
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="font-pixel text-[8px] bg-blue-950 text-sky-300 border border-sky-600 px-2 py-0.5 rounded font-bold">
                            {prog.degreeLevel}
                          </span>
                          <span className="text-[10px] font-mono text-amber-200/80 bg-[#2A160E] px-2 py-0.5 rounded border border-[#78350F]/60">
                            {fac?.shortName || prog.facultyId.toUpperCase()}
                          </span>
                          {psdkuFlag && (
                            <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 text-amber-400" />
                              <span>{prog.campusLocation || 'PSDKU'}</span>
                            </span>
                          )}
                          {score && <TierBadge tier={score.tier} size="sm" />}
                        </div>

                        <h2 className="font-bold text-[#FFFBEB] text-base leading-snug">
                          <Link
                            href={`/program/${prog.id}`}
                            className="hover:text-amber-300 transition-colors"
                          >
                            {prog.name}
                          </Link>
                        </h2>

                        <p className="text-xs text-amber-100/80 mt-1 line-clamp-2 leading-relaxed">
                          {prog.description}
                        </p>

                        {/* Quota Highlights */}
                        {quota && (
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-mono text-amber-200/80">
                            <span className="text-[#FDE68A] font-bold flex items-center gap-1">
                              <Users className="w-3 h-3 text-amber-400" />
                              Total Kuota: {quota.totalCapacity}
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

                    {/* Right: Score (if available) & Action Buttons */}
                    <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#78350F]/60 shrink-0">
                      {score ? (
                        <div className="text-right">
                          <div className="text-[10px] font-mono text-amber-200/80 uppercase">Kecocokan</div>
                          <div className="text-lg font-black text-amber-400 font-mono">{score.totalScore}%</div>
                        </div>
                      ) : (
                        <div className="text-right text-[10px] font-mono text-amber-300/60 hidden sm:block">
                          Belum ada skor tes
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/program/${prog.id}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#78350F] hover:bg-[#8D3F12] text-[#FFFBEB] border border-[#F59E0B] font-bold text-xs rounded-xl transition-colors shadow-xs min-h-[44px]"
                          aria-label={`Lihat detail lengkap ${prog.name}`}
                        >
                          <span>Detail</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => removeFavorite(prog.id)}
                          className="p-2.5 rounded-xl border border-rose-800/80 bg-[#24130C] text-rose-400 hover:text-white hover:bg-rose-900/80 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                          aria-label={`Hapus ${prog.name} dari favorit`}
                          title="Hapus dari favorit"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Bottom Section: SERADIP Consultation Placement (Prompt G Round 9 Section 4) */}
            <div className="pt-6 border-t border-[#78350F]/70 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-amber-200/70 text-center sm:text-left">
                Butuh pertimbangan lebih lanjut mengenai pilihan jurusan Anda?
              </div>
              <ConsultCta
                variant="inline"
                topProgramNames={favoritePrograms.map((p) => p.name)}
                buttonText="Konsultasi Pilihan Favorit dengan SERADIP"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
