'use client';

import React, { useMemo } from 'react';
import { nextStepsData } from '@/data/nextSteps';
import { admissionQuotas } from '@/data/quotas';
import { StatusBadge } from './StatusBadge';
import {
  Calendar,
  Clock,
  AlertTriangle,
  ExternalLink,
  PieChart,
} from 'lucide-react';

interface CalendarSectionProps {
  embedded?: boolean;
}

export function CalendarSection({ embedded = false }: CalendarSectionProps) {
  const { calendar } = nextStepsData;

  // Dynamically compute real quota statistics from quotas.ts (SK Rektor 41/2026)
  const quotaStats = useMemo(() => {
    const totalSnbp = admissionQuotas.reduce((acc, q) => acc + (q.snbpQuota || 0), 0);
    const totalSnbt = admissionQuotas.reduce((acc, q) => acc + (q.snbtQuota || 0), 0);
    const totalMandiri = admissionQuotas.reduce((acc, q) => acc + (q.mandiriQuota || 0), 0);
    const grandTotal = admissionQuotas.reduce((acc, q) => acc + (q.totalCapacity || 0), 0);

    return {
      totalSnbp,
      totalSnbt,
      totalMandiri,
      grandTotal,
      snbpPct: ((totalSnbp / grandTotal) * 100).toFixed(1),
      snbtPct: ((totalSnbt / grandTotal) * 100).toFixed(1),
      mandiriPct: ((totalMandiri / grandTotal) * 100).toFixed(1),
    };
  }, []);

  const getDynamicQuotaShare = (pathwayId: 'snbp' | 'snbt' | 'um') => {
    if (pathwayId === 'snbp') {
      return `${quotaStats.snbpPct}% (${quotaStats.totalSnbp.toLocaleString('id-ID')} kursi)`;
    }
    if (pathwayId === 'snbt') {
      return `${quotaStats.snbtPct}% (${quotaStats.totalSnbt.toLocaleString('id-ID')} kursi)`;
    }
    return `${quotaStats.mandiriPct}% (${quotaStats.totalMandiri.toLocaleString('id-ID')} kursi)`;
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header / Intro Card */}
      {!embedded && (
        <div className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#2A160E] border-2 border-[#F59E0B] flex items-center justify-center text-[#FDE68A] shadow-[2px_2px_0_0_#000] shrink-0">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-pixel text-sm sm:text-base text-[#FDE68A]">
                    {calendar.title}
                  </h1>
                  <StatusBadge status={calendar.status} />
                </div>
                <p className="text-xs text-amber-200/80 mt-1 leading-relaxed">
                  Alur seleksi masuk jalur SNBP, SNBT, dan Ujian Mandiri UNDIP Tahun Akademik 2026/2027.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Box */}
      <div className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-4 sm:p-6 space-y-6 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
        {/* Quota Summary Bar from SK Rektor 41/2026 */}
        <div className="bg-[#140B07] border border-[#78350F] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-[#78350F]/50">
            <div className="flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#F59E0B]" />
              <span className="font-pixel text-xs text-[#FDE68A]">
                Distribusi Kuota Seleksi 2026/2027
              </span>
            </div>
            <span className="font-mono text-[10px] text-amber-300">
              Total Daya Tampung: {quotaStats.grandTotal.toLocaleString('id-ID')} Mahasiswa
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <div className="bg-[#1F120B] p-2.5 rounded-lg border border-[#78350F]/50 flex items-center justify-between">
              <div>
                <span className="font-pixel text-[10px] text-[#FDE68A] block">SNBP (Prestasi)</span>
                <span className="text-[10px] text-amber-200/70">{quotaStats.totalSnbp.toLocaleString('id-ID')} kursi</span>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-400 bg-[#140B07] px-2 py-1 rounded border border-[#78350F]/60">
                {quotaStats.snbpPct}%
              </span>
            </div>

            <div className="bg-[#1F120B] p-2.5 rounded-lg border border-[#78350F]/50 flex items-center justify-between">
              <div>
                <span className="font-pixel text-[10px] text-[#FDE68A] block">SNBT (UTBK Tes)</span>
                <span className="text-[10px] text-amber-200/70">{quotaStats.totalSnbt.toLocaleString('id-ID')} kursi</span>
              </div>
              <span className="font-mono text-xs font-bold text-sky-400 bg-[#140B07] px-2 py-1 rounded border border-[#78350F]/60">
                {quotaStats.snbtPct}%
              </span>
            </div>

            <div className="bg-[#1F120B] p-2.5 rounded-lg border border-[#78350F]/50 flex items-center justify-between">
              <div>
                <span className="font-pixel text-[10px] text-[#FDE68A] block">Ujian Mandiri (UM)</span>
                <span className="text-[10px] text-amber-200/70">{quotaStats.totalMandiri.toLocaleString('id-ID')} kursi</span>
              </div>
              <span className="font-mono text-xs font-bold text-amber-400 bg-[#140B07] px-2 py-1 rounded border border-[#78350F]/60">
                {quotaStats.mandiriPct}%
              </span>
            </div>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="bg-[#2A160E] border border-amber-600/70 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-100/90 leading-relaxed font-mono">
            {calendar.disclaimer2027}
          </p>
        </div>

        {/* 3 Selection Pathways Timeline */}
        <div className="space-y-4">
          {calendar.pathways.map((pathway) => (
            <div
              key={pathway.pathwayId}
              className="bg-[#140B07] border border-[#78350F] rounded-xl p-4 sm:p-5 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#78350F]/50">
                <div className="flex items-center gap-2">
                  <span className="font-pixel text-xs sm:text-sm text-[#FDE68A] font-bold">
                    {pathway.shortName}
                  </span>
                  <span className="text-xs text-stone-300">
                    — {pathway.pathwayName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-amber-300 bg-[#24130C] px-2.5 py-1 rounded border border-[#78350F]/60 font-bold">
                    Alokasi: {getDynamicQuotaShare(pathway.pathwayId)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-amber-100/80 leading-relaxed">
                {pathway.description}
              </p>

              {/* Timeline Stages List */}
              <div className="space-y-1.5 pt-1">
                <h2 className="font-mono text-[10px] text-amber-300/80 uppercase tracking-wider font-bold">
                  Linimasa Pelaksanaan (Tahapan Resmi):
                </h2>
                <div className="divide-y divide-[#78350F]/40 border border-[#78350F]/50 rounded-lg overflow-hidden bg-[#1F120B]">
                  {pathway.timeline.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 sm:p-3 text-xs gap-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-5 h-5 rounded bg-[#2A160E] text-amber-300 font-pixel text-[9px] flex items-center justify-center shrink-0 border border-[#78350F]/60">
                          {idx + 1}
                        </span>
                        <span className="text-amber-100/90 text-xs truncate">
                          {item.stage}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] sm:text-[11px] text-[#FDE68A] font-bold shrink-0 flex items-center gap-1.5 bg-[#140B07] px-2.5 py-1 rounded border border-[#78350F]/50">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {item.estimatedPeriod}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Verification & Official External Links */}
        <div className="pt-3 border-t border-[#78350F]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-[10px] text-amber-200/60 font-mono">
            {calendar.status === 'official' && calendar.evidence
              ? `Terverifikasi (${calendar.evidence})`
              : 'Menunggu rilis resmi dari SNPMB Kemdikbud & PMB UNDIP'}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="https://snpmb.bppp.kemdikbud.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-stone-950 bg-[#F59E0B] hover:bg-[#FBBF24] px-3 py-2 rounded-lg text-xs min-h-[44px] transition-colors shadow-[2px_2px_0_0_#000]"
            >
              <span>Portal Resmi SNPMB</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://pmb.undip.ac.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-[#FDE68A] bg-[#2A160E] hover:bg-[#3D1F13] border border-[#78350F] px-3 py-2 rounded-lg text-xs min-h-[44px] transition-colors"
            >
              <span>Portal PMB UNDIP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
