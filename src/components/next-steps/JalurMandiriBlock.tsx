'use client';

import React from 'react';
import { nextStepsData } from '@/data/nextSteps';
import { StatusBadge } from './StatusBadge';
import { Info, HelpCircle, ExternalLink, ShieldCheck } from 'lucide-react';

export function JalurMandiriBlock() {
  const { jalurMandiri } = nextStepsData;

  return (
    <section
      id="jalur-um"
      className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-4 sm:p-6 space-y-5 shadow-[0_4px_16px_rgba(0,0,0,0.4)] text-white scroll-mt-24"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#78350F]/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#2A160E] border border-[#F59E0B] flex items-center justify-center text-[#FDE68A] shadow-[2px_2px_0_0_#000] shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-pixel text-xs sm:text-sm text-[#FDE68A]">
                {jalurMandiri.title}
              </h2>
              <StatusBadge status={jalurMandiri.status} />
            </div>
            <p className="text-[11px] text-amber-200/80 mt-0.5">
              Skema pendaftaran, pilihan jenjang, biaya pendaftaran, dan ketentuan IPI.
            </p>
          </div>
        </div>

        <span className="font-mono text-[10px] text-amber-300 bg-[#140B07] px-2.5 py-1 rounded border border-[#78350F] self-start sm:self-auto font-bold">
          Tahun Acuan {jalurMandiri.academicYearRef}
        </span>
      </div>

      {/* Desktop Table Layout (>= 640px) */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-[#78350F]/60 bg-[#140B07]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#24130C] border-b border-[#78350F]/60 text-[#FDE68A] font-pixel text-[10px]">
              <th className="py-3 px-4 font-bold">Jalur Seleksi</th>
              <th className="py-3 px-4 font-bold">Pilihan Jenjang</th>
              <th className="py-3 px-4 font-bold">Biaya Pendaftaran</th>
              <th className="py-3 px-4 font-bold">Ketentuan IPI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#78350F]/40 font-sans">
            {jalurMandiri.subPathways.map((item) => {
              const isFreeIpi = item.ipiStatus.toLowerCase().includes('tidak');
              return (
                <tr key={item.id} className="hover:bg-[#1F120B]/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-amber-100 font-pixel text-[11px]">
                    {item.name}
                  </td>
                  <td className="py-3 px-4 text-amber-200/90 font-mono text-[11px]">
                    {item.selectionChoice}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-emerald-300 bg-[#1F120B] px-2 py-0.5 rounded border border-[#78350F]/60">
                      {item.registrationFee}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${
                        isFreeIpi
                          ? 'text-emerald-300 bg-emerald-950/40 border-emerald-700/60'
                          : 'text-amber-300 bg-amber-950/40 border-amber-700/60'
                      }`}
                    >
                      {item.ipiStatus}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout (< 640px) */}
      <div className="sm:hidden space-y-3">
        {jalurMandiri.subPathways.map((item) => {
          const isFreeIpi = item.ipiStatus.toLowerCase().includes('tidak');
          return (
            <div
              key={item.id}
              className="bg-[#140B07] border border-[#78350F] rounded-xl p-3.5 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2 border-b border-[#78350F]/40 pb-2">
                <span className="font-pixel text-[11px] text-[#FDE68A] font-bold">
                  {item.name}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    isFreeIpi
                      ? 'text-emerald-300 bg-emerald-950/40 border-emerald-700/60'
                      : 'text-amber-300 bg-amber-950/40 border-amber-700/60'
                  }`}
                >
                  {item.ipiStatus}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-amber-300/70 block uppercase font-mono">Pilihan:</span>
                  <span className="text-amber-100 font-semibold">{item.selectionChoice}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-400/80 block uppercase font-mono">Biaya Daftar:</span>
                  <span className="text-emerald-300 font-bold font-mono">{item.registrationFee}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Note under the table */}
      <div className="bg-[#2A160E] border border-amber-600/60 rounded-xl p-3.5 sm:p-4 space-y-2">
        <div className="flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs text-amber-100/90 leading-relaxed font-sans">
            <p>
              {jalurMandiri.noteUnderTable}
            </p>
            <p className="text-[11px] text-amber-300/80 font-mono italic">
              {jalurMandiri.referenceYearNote}
            </p>
          </div>
        </div>
      </div>

      {/* Evidence and Source note */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-2.5 text-[10px] font-mono text-amber-200/60 border-t border-[#78350F]/50">
        <span className="flex items-center gap-1.5 italic">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{jalurMandiri.evidence}</span>
        </span>
        <a
          href={jalurMandiri.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[#FDE68A] hover:text-[#F59E0B] underline underline-offset-2 min-h-[32px]"
        >
          <span>Portal PMB UNDIP</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </section>
  );
}
