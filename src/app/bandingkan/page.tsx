'use client';

import React, { Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { studyPrograms, getProgramById } from '@/data/programs';
import { faculties } from '@/data/faculties';
import { getQuotaByProgramId } from '@/data/quotas';
import { getUKTByProgramId } from '@/data/ukt';
import { getProgramDetailById } from '@/data/programDetails';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { isPsdku } from '@/data/types';
import { TierBadge } from '@/components/ui/TierBadge';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { SeradipContactButton } from '@/components/ui/SeradipContactButton';
import { APP_NAME } from '@/config/brand';
import {
  Scale,
  Copy,
  Share2,
  Printer,
  Check,
  Building2,
  MapPin,
  Banknote,
  Users,
  Compass,
  Award,
  BookOpen,
  Briefcase,
} from 'lucide-react';
import { retroAudio } from '@/lib/retroAudio';

function BandingkanContent() {
  const searchParams = useSearchParams();
  const rawIds = searchParams.get('ids') || '';
  const { getScoreForProgram } = useQuestionnaire();
  const [copied, setCopied] = useState(false);

  // Parse and validate IDs
  const { validPrograms, invalidIds } = useMemo(() => {
    const split = rawIds
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    const uniqueIds = Array.from(new Set(split)).slice(0, 3);
    const valid: (typeof studyPrograms)[0][] = [];
    const invalid: string[] = [];

    for (const id of uniqueIds) {
      const prog = getProgramById(id);
      if (prog) {
        valid.push(prog);
      } else {
        invalid.push(id);
      }
    }

    return { validPrograms: valid, invalidIds: invalid };
  }, [rawIds]);

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      retroAudio.playBlip(880);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    const names = validPrograms.map((p) => p.name).join(' vs ');
    const shareData = {
      title: `Komparasi: ${names} — ${APP_NAME}`,
      text: `Bandingkan daya tampung, UKT, dan profil prodi UNDIP (${names}) di ${APP_NAME}.`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        retroAudio.playSelect();
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  // Pre-generate consultation message for SERADIP
  const consultationMessage = useMemo(() => {
    const names = validPrograms.map((p) => p.name).join(' dan ');
    return `Halo Kak SERADIP, saya sedang membandingkan pilihan program studi di UNDIP: ${names}. Boleh minta saran dan pertimbangan kakak?`;
  }, [validPrograms]);

  // If less than 2 valid programs are present
  if (validPrograms.length < 2) {
    return (
      <div className="relative min-h-[75vh] flex items-center justify-center px-4 bg-[#140B07] text-slate-100">
        <div className="max-w-md w-full bg-[#24130C] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-[#78350F] text-center shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#190E08] border-2 border-[#78350F] flex items-center justify-center mx-auto text-amber-400">
            <Scale className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-base sm:text-lg font-black text-[#FFFBEB] font-pixel">
              Pilih Minimal 2 Program Studi
            </h1>
            <p className="text-xs text-amber-200/80 leading-relaxed">
              Halaman perbandingan membutuhkan 2 hingga 3 program studi untuk dibandingkan berdampingan.
              {invalidIds.length > 0 && (
                <span className="block mt-1 text-rose-300 font-mono text-[11px]">
                  ID tidak valid: {invalidIds.join(', ')}
                </span>
              )}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              href="/favorit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-amber-400 text-stone-950 text-xs font-black px-4 py-2.5 rounded-xl border-2 border-amber-600 transition-all shadow-[2px_2px_0_0_#000] min-h-[44px]"
            >
              <span>Bandingkan dari Favorit</span>
            </Link>
            <Link
              href="/program-studi"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#190E08] hover:bg-[#341A10] text-[#FDE68A] text-xs font-bold px-4 py-2.5 rounded-xl border border-[#78350F] transition-all min-h-[44px]"
            >
              <span>Direktori Program Studi</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Pre-calculate data rows for the 2 or 3 programs
  const comparedData = validPrograms.map((prog) => {
    const fac = faculties.find((f) => f.id === prog.facultyId);
    const quota = getQuotaByProgramId(prog.id);
    const ukt = getUKTByProgramId(prog.id);
    const score = getScoreForProgram(prog.id);
    const detail = getProgramDetailById(prog.id);
    const isPsdkuFlag = isPsdku(prog);

    return {
      program: prog,
      faculty: fac,
      quota,
      ukt,
      score,
      detail,
      isPsdku: isPsdkuFlag,
      lowestUkt: ukt?.groups[0]?.formatted || '—',
      highestUkt: ukt?.groups[ukt.groups.length - 1]?.formatted || '—',
    };
  });

  return (
    <div className="relative min-h-screen pb-24 pt-6 text-slate-100 bg-[#140B07] border-t-2 border-[#78350F]">
      {/* Calm Golden-Hour Atmospheric Gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#2A111E]/40 via-[#1A0E08] to-[#140B07] print:hidden" />

      <style jsx global>{`
        @media print {
          header, footer, nav, .no-print, [data-testid="navbar-brand-text"] {
            display: none !important;
          }
          body, html {
            background: white !important;
            color: black !important;
            font-size: 11pt !important;
          }
          .print-clean {
            border: 1px solid #ccc !important;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
          }
          .print-clean * {
            color: black !important;
            text-shadow: none !important;
          }
        }
      `}</style>

      <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 space-y-6">
        {/* Navigation Breadcrumb & Share Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-200/80">
            <Link href="/" className="hover:text-amber-100 transition-colors">
              BERANDA
            </Link>
            <span>/</span>
            <Link href="/favorit" className="hover:text-amber-100 transition-colors">
              FAVORITKU
            </Link>
            <span>/</span>
            <span className="text-[#FDE68A] font-bold">BANDINGKAN</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#190E08] hover:bg-[#341A10] text-amber-200 hover:text-white border border-[#78350F] text-xs font-bold transition-all min-h-[44px] cursor-pointer"
              aria-label="Salin tautan komparasi ke papan klip"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copied ? 'Tautan Disalin!' : 'Salin Tautan'}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#190E08] hover:bg-[#341A10] text-amber-200 hover:text-white border border-[#78350F] text-xs font-bold transition-all min-h-[44px] cursor-pointer"
              aria-label="Bagikan komparasi program studi"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Bagikan</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#24130C] hover:bg-[#341A10] text-[#FDE68A] border border-[#78350F] text-xs font-bold transition-all min-h-[44px] cursor-pointer"
              aria-label="Cetak atau simpan halaman komparasi sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>Cetak / PDF</span>
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-[#24130C] border-2 border-[#78350F] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.5)] print-clean">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-amber-500/20 text-[#FDE68A] rounded-2xl border border-[#78350F] shrink-0 no-print">
              <Scale className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="font-pixel text-lg sm:text-2xl text-[#FFFBEB] tracking-wide">
                Komparasi Program Studi ({validPrograms.length} Prodi)
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/80 mt-1">
                Perbandingan objektif kuota penerimaan, biaya kuliah UKT resmi, dan kurikulum secara berdampingan.
              </p>
            </div>
          </div>
        </div>

        {/* COMPARISON TABLE CONTAINER */}
        {/* On mobile: horizontal scroll isolated inside wrapper, sticky metric column */}
        <div className="w-full max-w-full overflow-hidden bg-[#190E08] border-2 border-[#78350F] rounded-2xl sm:rounded-3xl shadow-lg print-clean">
          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse text-left min-w-[620px] sm:min-w-[720px]">
              {/* Table Header: Program Cards */}
              <thead>
                <tr className="border-b-2 border-[#78350F] bg-[#24130C]">
                  <th className="p-4 sm:p-5 w-44 sm:w-56 text-xs font-pixel text-[#F59E0B] uppercase tracking-wider sticky left-0 bg-[#24130C] z-10 border-r border-[#78350F]">
                    Kriteria Evaluasi
                  </th>
                  {comparedData.map(({ program, faculty }) => (
                    <th
                      key={program.id}
                      className="p-4 sm:p-5 align-top border-r last:border-r-0 border-[#78350F]"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <span className="font-pixel text-[8px] bg-blue-950 text-sky-300 border border-sky-600 px-2 py-0.5 rounded font-bold">
                            {program.degreeLevel}
                          </span>
                          <div className="no-print">
                            <FavoriteButton programId={program.id} programName={program.name} />
                          </div>
                        </div>

                        <h2 className="font-bold text-sm sm:text-base text-[#FFFBEB] leading-snug">
                          <Link
                            href={`/program/${program.id}`}
                            className="hover:text-amber-300 transition-colors"
                          >
                            {program.name}
                          </Link>
                        </h2>

                        <div className="text-[11px] font-mono text-amber-200/80">
                          {faculty?.name}
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#78350F]/70 text-xs sm:text-sm">
                {/* ROW 1: FAKULTAS & DEPARTEMEN */}
                <tr>
                  <td className="p-4 font-bold text-amber-200/90 sticky left-0 bg-[#190E08] z-10 border-r border-[#78350F] flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Fakultas</span>
                  </td>
                  {comparedData.map(({ program, faculty }) => (
                    <td key={program.id} className="p-4 border-r last:border-r-0 border-[#78350F]">
                      <div className="font-semibold text-white">{faculty?.name}</div>
                      {program.department && (
                        <div className="text-xs text-amber-200/70 mt-0.5 font-mono">
                          Departemen: {program.department}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* ROW 2: JENJANG & KAMPUS */}
                <tr>
                  <td className="p-4 font-bold text-amber-200/90 sticky left-0 bg-[#190E08] z-10 border-r border-[#78350F] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Lokasi Kampus</span>
                  </td>
                  {comparedData.map(({ program, isPsdku }) => (
                    <td key={program.id} className="p-4 border-r last:border-r-0 border-[#78350F]">
                      <div className="font-semibold text-white">
                        {program.campusLocation || 'Semarang (Tembalang)'}
                      </div>
                      <div className="mt-1">
                        {isPsdku ? (
                          <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600">
                            PSDKU Di Luar Semarang
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-sky-300 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-700">
                            Kampus Utama Tembalang
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* ROW 3: BIAYA KULIAH UKT (Golongan 1 & Tertinggi) */}
                <tr>
                  <td className="p-4 font-bold text-amber-200/90 sticky left-0 bg-[#190E08] z-10 border-r border-[#78350F] flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Biaya Kuliah (UKT)</span>
                  </td>
                  {comparedData.map(({ program, lowestUkt, highestUkt }) => (
                    <td key={program.id} className="p-4 border-r last:border-r-0 border-[#78350F]">
                      <div className="space-y-1">
                        <div className="text-xs">
                          <span className="text-amber-200/70">Golongan 1: </span>
                          <strong className="text-emerald-400 font-mono">{lowestUkt}</strong>
                        </div>
                        <div className="text-xs">
                          <span className="text-amber-200/70">Golongan Tertinggi: </span>
                          <strong className="text-amber-300 font-mono">{highestUkt}</strong>
                        </div>
                        <div className="text-[10px] font-mono text-amber-300/60 pt-0.5">
                          SK Rektor UNDIP TA 2026/2027
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* ROW 4: TOTAL DAYA TAMPUNG */}
                <tr>
                  <td className="p-4 font-bold text-amber-200/90 sticky left-0 bg-[#190E08] z-10 border-r border-[#78350F] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Total Daya Tampung</span>
                  </td>
                  {comparedData.map(({ program, quota }) => (
                    <td key={program.id} className="p-4 border-r last:border-r-0 border-[#78350F]">
                      <div className="font-mono text-base font-black text-[#FDE68A]">
                        {quota ? `${quota.totalCapacity} Kursi` : 'Data Belum Tersedia'}
                      </div>
                      <div className="text-[10px] text-amber-200/70 font-mono mt-0.5">
                        Kuota Resmi TA {quota?.academicYear || '2026/2027'}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* ROW 5: RINCIAN DAYA TAMPUNG PER JALUR */}
                <tr>
                  <td className="p-4 font-bold text-amber-200/90 sticky left-0 bg-[#190E08] z-10 border-r border-[#78350F]">
                    <span>Alokasi Per Jalur</span>
                  </td>
                  {comparedData.map(({ program, quota }) => (
                    <td key={program.id} className="p-4 border-r last:border-r-0 border-[#78350F]">
                      {quota ? (
                        <div className="space-y-1 text-xs font-mono">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-amber-200/80">SNBP:</span>
                            <span className="font-bold text-amber-300">{quota.snbpQuota} kursi</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-amber-200/80">SNBT:</span>
                            <span className="font-bold text-amber-300">{quota.snbtQuota} kursi</span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-amber-200/80">Mandiri:</span>
                            <span className="font-bold text-amber-300">{quota.mandiriQuota} kursi</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-amber-200/50 text-xs">—</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* ROW 6: SKOR KECOCOKAN HMIM & TIER */}
                <tr>
                  <td className="p-4 font-bold text-amber-200/90 sticky left-0 bg-[#190E08] z-10 border-r border-[#78350F] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Skor Tes Keselarasan</span>
                  </td>
                  {comparedData.map(({ program, score }) => (
                    <td key={program.id} className="p-4 border-r last:border-r-0 border-[#78350F]">
                      {score ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-black text-amber-400 font-mono">
                              {score.totalScore}%
                            </span>
                            <TierBadge tier={score.tier} size="sm" />
                          </div>
                          <div className="text-[11px] text-amber-200/80 font-mono">
                            Kecocokan Profil Minat
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-xs text-amber-200/70">Belum ada hasil tes</div>
                          <Link
                            href="/questionnaire"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-200 underline"
                          >
                            <span>Ikuti Tes Sekarang</span>
                          </Link>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* ROW 7: AKREDITASI (When present in Section 3) */}
                <tr>
                  <td className="p-4 font-bold text-amber-200/90 sticky left-0 bg-[#190E08] z-10 border-r border-[#78350F] flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Akreditasi</span>
                  </td>
                  {comparedData.map(({ program, detail }) => (
                    <td key={program.id} className="p-4 border-r last:border-r-0 border-[#78350F]">
                      {detail?.akreditasi ? (
                        <div className="space-y-0.5">
                          <div className="font-bold text-emerald-400 font-mono">
                            {detail.akreditasi.value.peringkat}
                          </div>
                          <div className="text-[11px] text-amber-200/70 font-mono">
                            {detail.akreditasi.value.lembaga} {detail.akreditasi.value.tahun ? `(${detail.akreditasi.value.tahun})` : ''}
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-amber-200/60">
                          Lihat laman resmi fakultas
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* ROW 8: MATA KULIAH KHAS (When present in Section 3) */}
                <tr>
                  <td className="p-4 font-bold text-amber-200/90 sticky left-0 bg-[#190E08] z-10 border-r border-[#78350F] flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Mata Kuliah Khas</span>
                  </td>
                  {comparedData.map(({ program, detail }) => (
                    <td key={program.id} className="p-4 border-r last:border-r-0 border-[#78350F]">
                      {detail?.mataKuliahKhas ? (
                        <ul className="list-disc list-inside text-xs space-y-1 text-amber-100/90">
                          {detail.mataKuliahKhas.value.slice(0, 4).map((mk, i) => (
                            <li key={i} className="line-clamp-1">{mk}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-xs text-amber-200/60">
                          Informasi kurikulum pada laman prodi
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* ROW 9: PROSPEK KARIER (When present in Section 3) */}
                <tr>
                  <td className="p-4 font-bold text-amber-200/90 sticky left-0 bg-[#190E08] z-10 border-r border-[#78350F] flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Prospek Karier</span>
                  </td>
                  {comparedData.map(({ program, detail }) => (
                    <td key={program.id} className="p-4 border-r last:border-r-0 border-[#78350F]">
                      {detail?.prospekKarier ? (
                        <ul className="list-disc list-inside text-xs space-y-1 text-amber-100/90">
                          {detail.prospekKarier.value.slice(0, 4).map((pk, i) => (
                            <li key={i} className="line-clamp-1">{pk}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-xs text-amber-200/60">
                          Umum sesuai bidang keilmuan
                        </div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* ROW 10: AKSI DETAIL */}
                <tr className="no-print">
                  <td className="p-4 font-bold text-amber-200/90 sticky left-0 bg-[#190E08] z-10 border-r border-[#78350F]">
                    <span>Aksi Lanjutan</span>
                  </td>
                  {comparedData.map(({ program }) => (
                    <td key={program.id} className="p-4 border-r last:border-r-0 border-[#78350F]">
                      <Link
                        href={`/program/${program.id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-stone-950 font-pixel text-[9px] font-bold border border-amber-600 transition-all shadow-[2px_2px_0_0_#000] min-h-[44px]"
                      >
                        <span>Lihat Detail Lengkap</span>
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Placement: SERADIP Consultation */}
        <div className="pt-6 border-t border-[#78350F]/70 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
          <div className="text-xs text-amber-200/70 text-center sm:text-left">
            Bingung menentukan pilihan di antara program studi di atas?
          </div>
          <SeradipContactButton
            message={consultationMessage}
            label="Konsultasi Perbandingan dengan SERADIP"
          />
        </div>
      </div>
    </div>
  );
}

export default function BandingkanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#140B07] text-amber-200 font-pixel text-xs">
          Memuat perbandingan program studi...
        </div>
      }
    >
      <BandingkanContent />
    </Suspense>
  );
}
