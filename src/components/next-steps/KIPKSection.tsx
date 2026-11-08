'use client';

import React from 'react';
import { nextStepsData } from '@/data/nextSteps';
import { StatusBadge } from './StatusBadge';
import {
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface KIPKSectionProps {
  embedded?: boolean;
}

export function KIPKSection({ embedded = false }: KIPKSectionProps) {
  const { kipk } = nextStepsData;

  return (
    <div className="space-y-6 text-white">
      {/* Header / Intro Card */}
      {!embedded && (
        <div className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#2A160E] border-2 border-[#F59E0B] flex items-center justify-center text-[#FDE68A] shadow-[2px_2px_0_0_#000] shrink-0">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-pixel text-sm sm:text-base text-[#FDE68A]">
                    {kipk.title}
                  </h1>
                  <StatusBadge status={kipk.status} />
                </div>
                <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                  Program bantuan biaya pendidikan dan biaya hidup bagi mahasiswa berprestasi dengan keterbatasan ekonomi.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Box */}
      <div className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-4 sm:p-6 space-y-6 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
        {/* Ringkasan */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#FDE68A] font-pixel text-xs">
            <Sparkles className="w-4 h-4 text-[#F59E0B]" />
            <span>Tentang Beasiswa KIP-Kuliah</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            {kipk.summary}
          </p>
        </div>

        {/* Manfaat Bantuan */}
        <div className="space-y-3">
          <h2 className="font-pixel text-[11px] sm:text-xs text-[#F59E0B] uppercase tracking-wider pb-1 border-b border-[#78350F]/60">
            Manfaat Beasiswa KIP-Kuliah
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {kipk.benefits.map((b, i) => (
              <div
                key={i}
                className="bg-[#140B07] border border-[#78350F] rounded-xl p-4 space-y-1.5"
              >
                <div className="flex items-center gap-2 text-[#FDE68A] font-bold text-xs sm:text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{b.title}</span>
                </div>
                <p className="text-xs text-amber-100/80 leading-relaxed">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Kriteria & Syarat Penerima */}
        <div className="space-y-3">
          <h2 className="font-pixel text-[11px] sm:text-xs text-[#F59E0B] uppercase tracking-wider pb-1 border-b border-[#78350F]/60">
            Kriteria & Persyaratan Umum
          </h2>
          <div className="space-y-3">
            {kipk.criteria.map((c, i) => (
              <div
                key={i}
                className="bg-[#140B07] border border-[#78350F]/80 rounded-xl p-4 space-y-2"
              >
                <span className="font-bold text-[#FDE68A] text-xs sm:text-sm block">
                  {c.category}
                </span>
                <ul className="space-y-1.5 text-amber-100/85 pl-1">
                  {c.details.map((d, dIdx) => (
                    <li key={dIdx} className="flex items-start gap-2 text-xs leading-relaxed">
                      <span className="text-[#F59E0B] font-bold shrink-0">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Alur Pendaftaran */}
        <div className="space-y-3">
          <h2 className="font-pixel text-[11px] sm:text-xs text-[#F59E0B] uppercase tracking-wider pb-1 border-b border-[#78350F]/60">
            Alur Pendaftaran KIP-Kuliah
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {kipk.registrationSteps.map((s) => (
              <div
                key={s.step}
                className="bg-[#24130C] border border-[#78350F] rounded-xl p-3.5 flex items-start gap-3"
              >
                <span className="w-7 h-7 rounded-lg bg-[#F59E0B] text-stone-950 font-pixel text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-[1px_1px_0_0_#000]">
                  {s.step}
                </span>
                <div className="space-y-1">
                  <h3 className="font-bold text-[#FFFBEB] text-xs sm:text-sm">{s.title}</h3>
                  <p className="text-[11px] sm:text-xs text-amber-100/80 leading-relaxed">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Catatan Verifikasi & Portal Resmi */}
        <div className="bg-[#2A160E] border border-amber-600/70 rounded-xl p-4 space-y-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-100 leading-relaxed font-mono">
              Persyaratan detail, dokumen pengusulan ekonomi, serta jadwal pembukaan pendaftaran akun KIP-Kuliah ditentukan secara berkala oleh Kemendikbudristek/Kemendiktisaintek.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#78350F]/50">
            <span className="text-[10px] text-amber-300/80 font-mono">
              {kipk.status === 'official' && kipk.evidence
                ? `Terverifikasi (${kipk.evidence})`
                : 'Menunggu rilis panduan teknis resmi tahun berjalan'}
            </span>
            <div className="flex flex-wrap gap-2">
              <a
                href={kipk.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#F59E0B] hover:bg-[#FBBF24] text-stone-950 font-bold px-3 py-2 rounded-lg text-xs transition-colors shadow-[2px_2px_0_0_#000] min-h-[44px]"
              >
                <span>Portal Resmi KIP-Kuliah</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://pmb.undip.ac.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#2A160E] hover:bg-[#3D1F13] text-[#FDE68A] border border-[#78350F] px-3 py-2 rounded-lg text-xs transition-colors min-h-[44px]"
              >
                <span>PMB UNDIP</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
