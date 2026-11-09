'use client';

import React, { useState, useEffect } from 'react';
import { StudyProgram, isPsdku } from '@/data/types';
import { ProgramDetail } from '@/data/programDetails';
import { SeradipContactButton } from '@/components/ui/SeradipContactButton';
import {
  BookOpen,
  Award,
  Briefcase,
  GraduationCap,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface ProgramRichDetailsProps {
  program: StudyProgram;
  detail?: ProgramDetail;
}

function getHostName(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

interface CollapsibleCardProps {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  sourceUrl?: string;
  retrievedAt?: string;
  status?: 'official' | 'pending';
  children: React.ReactNode;
}

function CollapsibleDetailSection({
  title,
  icon,
  defaultOpen = true,
  sourceUrl,
  retrievedAt,
  status = 'official',
  children,
}: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-[#24130C] rounded-2xl sm:rounded-3xl border-2 border-[#78350F] shadow-[0_4px_24px_rgba(0,0,0,0.5)] overflow-hidden transition-all">
      {/* Section Header Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="w-full p-4 sm:p-6 flex items-center justify-between gap-3 text-left bg-[#24130C] hover:bg-[#2A160E] transition-colors cursor-pointer min-h-[44px]"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 bg-[#78350F] text-amber-300 rounded-xl border border-[#F59E0B]/70 shrink-0">
            {icon}
          </div>
          <h3 className="font-pixel text-sm sm:text-base text-[#FFFBEB] tracking-wide">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-amber-300 shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-wider hidden sm:inline">
            {isOpen ? 'Tutup' : 'Buka'}
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-4 sm:p-6 pt-0 border-t border-[#78350F]/60 space-y-4">
          <div className="pt-4">{children}</div>

          {/* Sourced Attribution Line */}
          {sourceUrl && (
            <div className="pt-3 border-t border-[#78350F]/40 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-amber-300/80">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-amber-400 shrink-0" />
                <span>
                  Sumber:{' '}
                  <a
                    href={sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline text-amber-200 hover:text-white"
                  >
                    {getHostName(sourceUrl)}
                  </a>
                  {retrievedAt ? `, diakses ${retrievedAt}` : ''}
                </span>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold border ${
                  status === 'official'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                    : 'bg-amber-950/80 text-amber-300 border-amber-700'
                }`}
              >
                {status === 'official' ? 'Resmi' : 'Perlu Verifikasi'}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ProgramRichDetails({ program, detail }: ProgramRichDetailsProps) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  const hasAnyVerifiedField = Boolean(
    detail &&
      (detail.ringkasan ||
        detail.akreditasi ||
        detail.mataKuliahKhas ||
        detail.kompetensiUtama ||
        detail.prospekKarier ||
        detail.lamanResmi)
  );

  const consultationMessage = `Halo Kak SERADIP, saya tertarik dengan program studi ${program.name} (${program.degreeLevel}) UNDIP. Boleh minta informasi dan pengalaman mengenai jurusan ini?`;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* PSDKU Information Banner */}
      {isPsdku(program) && (
        <div className="bg-[#24130C] rounded-2xl p-4 sm:p-5 border-2 border-amber-600/70 text-white flex items-start gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-pixel text-xs text-[#FDE68A]">
              Program PSDKU di Luar Kampus Utama Tembalang
            </h4>
            <p className="text-amber-100/90 leading-relaxed font-sans">
              Program studi ini berlokasi di {program.campusLocation || 'Kampus PSDKU Luar Semarang'}. Kurikulum, ijazah, dan standar akademik berada langsung di bawah naungan Universitas Diponegoro.
            </p>
          </div>
        </div>
      )}

      {/* If no verified rich details are present, show friendly fallback */}
      {!hasAnyVerifiedField ? (
        <div className="bg-[#24130C] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-[#78350F] text-center shadow-[0_4px_24px_rgba(0,0,0,0.5)] space-y-3">
          <BookOpen className="w-10 h-10 text-amber-400/60 mx-auto" />
          <h3 className="font-pixel text-sm sm:text-base text-[#FFFBEB]">
            Detail Kurikulum Sedang Dihimpun
          </h3>
          <p className="text-xs sm:text-sm text-amber-200/80 max-w-lg mx-auto leading-relaxed">
            Informasi detail belum tersedia — silakan kunjungi laman resmi fakultas atau departemen untuk rincian kurikulum dan prospek kerja terbaru.
          </p>
          {program.websiteUrl && (
            <div className="pt-2">
              <a
                href={program.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-stone-950 font-pixel text-[9px] sm:text-[10px] font-bold border-2 border-amber-600 transition-all shadow-[2px_2px_0_0_#000] min-h-[44px]"
              >
                <span>Kunjungi Laman Resmi Prodi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* SECTION 1: RINGKASAN PROGRAM STUDI */}
          {detail?.ringkasan && (
            <CollapsibleDetailSection
              title="Ringkasan Program Studi"
              icon={<GraduationCap className="w-5 h-5" />}
              defaultOpen={isDesktop}
              sourceUrl={detail.ringkasan.sourceUrl}
              retrievedAt={detail.ringkasan.retrievedAt}
              status={detail.ringkasan.status}
            >
              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-sans">
                {detail.ringkasan.value}
              </p>
            </CollapsibleDetailSection>
          )}

          {/* SECTION 2: AKREDITASI RESMI */}
          {detail?.akreditasi && (
            <CollapsibleDetailSection
              title="Akreditasi Resmi"
              icon={<Award className="w-5 h-5" />}
              defaultOpen={isDesktop}
              sourceUrl={detail.akreditasi.sourceUrl}
              retrievedAt={detail.akreditasi.retrievedAt}
              status={detail.akreditasi.status}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#190E08] p-4 rounded-2xl border border-[#78350F]">
                <div>
                  <div className="text-[10px] font-mono text-amber-300/80 uppercase">Peringkat Akreditasi</div>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-pixel mt-0.5">
                    {detail.akreditasi.value.peringkat}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-[10px] font-mono text-amber-300/80 uppercase">Lembaga Akreditasi</div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {detail.akreditasi.value.lembaga}
                  </div>
                  {detail.akreditasi.value.tahun && (
                    <div className="text-[10px] font-mono text-amber-200/70">
                      Tahun Keputusan: {detail.akreditasi.value.tahun}
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleDetailSection>
          )}

          {/* SECTION 3: MATA KULIAH KHAS */}
          {detail?.mataKuliahKhas && (
            <CollapsibleDetailSection
              title="Mata Kuliah Khas & Fokus Keilmuan"
              icon={<BookOpen className="w-5 h-5" />}
              defaultOpen={isDesktop}
              sourceUrl={detail.mataKuliahKhas.sourceUrl}
              retrievedAt={detail.mataKuliahKhas.retrievedAt}
              status={detail.mataKuliahKhas.status}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {detail.mataKuliahKhas.value.map((mk, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#190E08] rounded-xl border border-[#78350F]/70 text-xs sm:text-sm text-amber-100/90 flex items-center gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                    <span>{mk}</span>
                  </div>
                ))}
              </div>
            </CollapsibleDetailSection>
          )}

          {/* SECTION 4: KOMPETENSI UTAMA */}
          {detail?.kompetensiUtama && (
            <CollapsibleDetailSection
              title="Kompetensi Utama Lulusan"
              icon={<CheckCircle2 className="w-5 h-5" />}
              defaultOpen={isDesktop}
              sourceUrl={detail.kompetensiUtama.sourceUrl}
              retrievedAt={detail.kompetensiUtama.retrievedAt}
              status={detail.kompetensiUtama.status}
            >
              <div className="space-y-2.5">
                {detail.kompetensiUtama.value.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#190E08] rounded-xl border border-[#78350F]/70 text-xs sm:text-sm text-amber-100 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </CollapsibleDetailSection>
          )}

          {/* SECTION 5: PROSPEK KARIER */}
          {detail?.prospekKarier && (
            <CollapsibleDetailSection
              title="Prospek Karier & Peran Profesional"
              icon={<Briefcase className="w-5 h-5" />}
              defaultOpen={isDesktop}
              sourceUrl={detail.prospekKarier.sourceUrl}
              retrievedAt={detail.prospekKarier.retrievedAt}
              status={detail.prospekKarier.status}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {detail.prospekKarier.value.map((role, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-[#190E08] rounded-xl border border-[#78350F]/70 text-xs sm:text-sm text-amber-100/90 flex items-center gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>{role}</span>
                  </div>
                ))}
              </div>
            </CollapsibleDetailSection>
          )}

          {/* SECTION 6: LAMAN RESMI */}
          {detail?.lamanResmi && (
            <div className="bg-[#24130C] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 border-[#78350F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-white">Laman Resmi Program Studi</div>
                  <div className="text-[11px] text-amber-200/70 font-mono truncate max-w-sm sm:max-w-md">
                    {detail.lamanResmi.value}
                  </div>
                </div>
              </div>

              <a
                href={detail.lamanResmi.value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-amber-400 text-stone-950 font-pixel text-[9px] sm:text-[10px] font-bold border-2 border-amber-600 transition-all shrink-0 self-start sm:self-auto min-h-[44px]"
              >
                <span>Buka Laman Resmi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </>
      )}

      {/* SERADIP Consultation Placement (Section 5B) */}
      <div className="pt-2 flex justify-center sm:justify-start">
        <SeradipContactButton
          message={consultationMessage}
          label={`Konsultasi Mengenai ${program.name} dengan SERADIP`}
        />
      </div>
    </div>
  );
}
