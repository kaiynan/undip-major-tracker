'use client';

import React, { useState } from 'react';
import { nextStepsData } from '@/data/nextSteps';
import {
  Banknote,
  GraduationCap,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Sparkles,
} from 'lucide-react';
import { retroAudio } from '@/lib/retroAudio';

export function NextStepsContent() {
  const [openSection, setOpenSection] = useState<'ukt' | 'kipk' | 'calendar' | 'all'>('all');

  const toggleSection = (section: 'ukt' | 'kipk' | 'calendar') => {
    retroAudio.playBlip(600);
    setOpenSection((prev) => (prev === section ? 'all' : section));
  };

  const { ukt, kipk, calendar, disclaimerFooter } = nextStepsData;

  return (
    <div className="space-y-6 text-white animate-in fade-in duration-200">
      {/* Intro Header Card */}
      <div className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-4 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#2A160E] border-2 border-[#F59E0B] flex items-center justify-center text-[#FDE68A] shadow-[2px_2px_0_0_#000] shrink-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="font-pixel text-sm sm:text-base text-[#FDE68A]">
              Panduan Langkah Selanjutnya
            </h2>
            <p className="text-xs text-amber-100/80 mt-1 leading-relaxed">
              Persiapkan langkahmu menuju Universitas Diponegoro: pahami skema biaya kuliah UKT, beasiswa KIP-Kuliah, serta linimasa seleksi masuk.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: UKT (Uang Kuliah Tunggal) */}
      <section className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
        <button
          onClick={() => toggleSection('ukt')}
          aria-expanded={openSection === 'ukt' || openSection === 'all'}
          className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-[#24130C] hover:bg-[#2D180F] transition-colors cursor-pointer border-b border-[#78350F]/70 min-h-[56px]"
        >
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-xl bg-[#140B07] border border-[#78350F] flex items-center justify-center text-[#F59E0B] shrink-0">
              <Banknote className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-pixel text-xs sm:text-sm text-[#FDE68A] truncate">
                  {ukt.title}
                </h3>
                <span className="font-mono text-[10px] text-emerald-300 font-bold bg-[#140B07] px-2 py-0.5 rounded border border-emerald-900/60 shrink-0">
                  Resmi
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70 truncate hidden sm:block mt-0.5">
                8 Golongan UKT & Kebijakan Bebas Uang Pangkal
              </p>
            </div>
          </div>

          <div className="text-amber-400 shrink-0">
            {openSection === 'ukt' || openSection === 'all' ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </div>
        </button>

        {(openSection === 'ukt' || openSection === 'all') && (
          <div className="p-4 sm:p-6 space-y-4">
            <p className="text-xs text-amber-100/90 leading-relaxed">
              {ukt.summary}
            </p>

            {/* IPI Note Box */}
            <div className="bg-[#2A160E] border border-amber-600/60 rounded-xl p-3.5 text-xs text-amber-200/90 space-y-1">
              <div className="flex items-center gap-2 font-bold text-[#FDE68A]">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bebas Uang Pangkal (IPI) di SNBP & SNBT</span>
              </div>
              <p className="text-[11px] text-amber-100/80 leading-relaxed">
                {ukt.ipiNote}
              </p>
            </div>

            {/* 8 UKT Groups Grid */}
            <div className="space-y-2">
              <h4 className="font-pixel text-[10px] sm:text-xs text-amber-300 uppercase tracking-wide">
                Struktur 8 Golongan UKT UNDIP:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ukt.groups.map((g) => (
                  <div
                    key={g.group}
                    className="bg-[#140B07] border border-[#78350F] rounded-xl p-3 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-[10px] text-[#FDE68A] font-bold">
                        {g.label}
                      </span>
                      <span className="font-mono text-xs text-emerald-300 font-bold bg-[#24130C] px-2 py-0.5 rounded border border-[#78350F]/60">
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

            {/* Verification Note & Citation */}
            <div className="pt-3 border-t border-[#78350F]/60 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[10px] text-amber-300/80 italic flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                {ukt.verificationNote}
              </span>
              <a
                href={ukt.officialDecisionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 underline text-xs min-h-[44px] py-2 cursor-pointer"
              >
                <span>Lihat Tabel Tarif Resmi di PMB UNDIP</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2: KIP-Kuliah */}
      <section className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
        <button
          onClick={() => toggleSection('kipk')}
          aria-expanded={openSection === 'kipk' || openSection === 'all'}
          className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-[#24130C] hover:bg-[#2D180F] transition-colors cursor-pointer border-b border-[#78350F]/70 min-h-[56px]"
        >
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-xl bg-[#140B07] border border-[#78350F] flex items-center justify-center text-[#F59E0B] shrink-0">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-pixel text-xs sm:text-sm text-[#FDE68A] truncate">
                  {kipk.title}
                </h3>
                <span className="font-mono text-[10px] text-blue-300 font-bold bg-[#140B07] px-2 py-0.5 rounded border border-blue-900/60 shrink-0">
                  Beasiswa 100%
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70 truncate hidden sm:block mt-0.5">
                Syarat Kelayakan, Manfaat Biaya Hidup, & Alur Pendaftaran
              </p>
            </div>
          </div>

          <div className="text-amber-400 shrink-0">
            {openSection === 'kipk' || openSection === 'all' ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </div>
        </button>

        {(openSection === 'kipk' || openSection === 'all') && (
          <div className="p-4 sm:p-6 space-y-5">
            <p className="text-xs text-amber-100/90 leading-relaxed">
              {kipk.summary}
            </p>

            {/* Benefits */}
            <div className="space-y-2">
              <h4 className="font-pixel text-[10px] sm:text-xs text-amber-300 uppercase tracking-wide">
                Manfaat Beasiswa KIP-Kuliah:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {kipk.benefits.map((b, i) => (
                  <div
                    key={i}
                    className="bg-[#140B07] border border-[#78350F] rounded-xl p-3.5 space-y-1"
                  >
                    <div className="flex items-center gap-2 text-[#FDE68A] font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{b.title}</span>
                    </div>
                    <p className="text-[11px] text-amber-100/70 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Criteria */}
            <div className="space-y-2">
              <h4 className="font-pixel text-[10px] sm:text-xs text-amber-300 uppercase tracking-wide">
                Kriteria Syarat Penerima:
              </h4>
              <div className="space-y-2">
                {kipk.criteria.map((c, i) => (
                  <div
                    key={i}
                    className="bg-[#140B07] border border-[#78350F]/70 rounded-xl p-3 text-xs space-y-1.5"
                  >
                    <span className="font-bold text-[#FDE68A] block">
                      {i + 1}. {c.category}
                    </span>
                    <ul className="space-y-1 text-amber-100/80 pl-2">
                      {c.details.map((d, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-amber-400 shrink-0">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Steps */}
            <div className="space-y-2">
              <h4 className="font-pixel text-[10px] sm:text-xs text-amber-300 uppercase tracking-wide">
                Alur Pendaftaran KIP-Kuliah:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {kipk.registrationSteps.map((s) => (
                  <div
                    key={s.step}
                    className="bg-[#24130C] border border-[#78350F] rounded-xl p-3 flex items-start gap-3"
                  >
                    <span className="w-6 h-6 rounded-md bg-[#F59E0B] text-stone-950 font-pixel text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {s.step}
                    </span>
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-[#FFFBEB] text-xs">{s.title}</h5>
                      <p className="text-[11px] text-amber-100/80 leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Official Portal Button */}
            <div className="pt-3 border-t border-[#78350F]/60 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[10px] text-amber-200/60 font-mono">
                Sumber Resmi: Kemendikbudristek RI (Terverifikasi per {kipk.retrievedAt})
              </span>
              <a
                href={kipk.portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-[2px_2px_0_0_#000] min-h-[44px] cursor-pointer"
              >
                <span>Buka Portal Resmi KIP-Kuliah</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 3: Selection Calendar */}
      <section className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
        <button
          onClick={() => toggleSection('calendar')}
          aria-expanded={openSection === 'calendar' || openSection === 'all'}
          className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-[#24130C] hover:bg-[#2D180F] transition-colors cursor-pointer border-b border-[#78350F]/70 min-h-[56px]"
        >
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-xl bg-[#140B07] border border-[#78350F] flex items-center justify-center text-[#F59E0B] shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-pixel text-xs sm:text-sm text-[#FDE68A] truncate">
                  {calendar.title}
                </h3>
                <span className="font-mono text-[10px] text-amber-300 font-bold bg-[#140B07] px-2 py-0.5 rounded border border-[#78350F] shrink-0">
                  SNBP • SNBT • UM
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70 truncate hidden sm:block mt-0.5">
                Estimasi Linimasa dan Pola Seleksi Masuk UNDIP
              </p>
            </div>
          </div>

          <div className="text-amber-400 shrink-0">
            {openSection === 'calendar' || openSection === 'all' ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </div>
        </button>

        {(openSection === 'calendar' || openSection === 'all') && (
          <div className="p-4 sm:p-6 space-y-5">
            {/* 2027 Disclaimer Note */}
            <div className="bg-[#2A160E] border border-amber-600/70 rounded-xl p-3.5 text-xs text-amber-200/90 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-[11px] sm:text-xs leading-relaxed font-medium">
                {calendar.disclaimer2027}
              </p>
            </div>

            {/* 3 Selection Pathways */}
            <div className="space-y-4">
              {calendar.pathways.map((pathway) => (
                <div
                  key={pathway.pathwayId}
                  className="bg-[#140B07] border border-[#78350F] rounded-xl p-4 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#78350F]/50">
                    <div className="flex items-center gap-2">
                      <span className="font-pixel text-xs text-[#FDE68A] font-bold">
                        {pathway.shortName}
                      </span>
                      <span className="text-xs text-stone-300">
                        — {pathway.pathwayName}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-amber-300 bg-[#24130C] px-2.5 py-0.5 rounded border border-[#78350F]/60 font-bold">
                      {pathway.quotaShare}
                    </span>
                  </div>

                  <p className="text-[11px] text-amber-100/80 leading-relaxed">
                    {pathway.description}
                  </p>

                  {/* Timeline Table */}
                  <div className="space-y-1.5 pt-1">
                    <h5 className="font-mono text-[10px] text-amber-300/80 uppercase tracking-wider font-bold">
                      Linimasa Pelaksanaan (Estimasi):
                    </h5>
                    <div className="divide-y divide-[#78350F]/40 border border-[#78350F]/50 rounded-lg overflow-hidden bg-[#1F120B]">
                      {pathway.timeline.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 text-xs gap-3"
                        >
                          <span className="text-amber-100/90 text-[11px]">
                            {item.stage}
                          </span>
                          <span className="font-mono text-[11px] text-[#FDE68A] font-bold shrink-0 flex items-center gap-1 bg-[#140B07] px-2 py-0.5 rounded border border-[#78350F]/50">
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

            {/* Official Portals Footer Links */}
            <div className="pt-3 border-t border-[#78350F]/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <a
                href="https://snpmb.bppp.kemdikbud.go.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 underline min-h-[44px] py-2 cursor-pointer"
              >
                <span>Portal Resmi SNPMB BPPP</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://pmb.undip.ac.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-amber-400 hover:text-amber-300 underline min-h-[44px] py-2 cursor-pointer"
              >
                <span>Portal Resmi PMB UNDIP</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Mandatory Disclaimer Footer */}
      <footer className="bg-[#140B07] border-2 border-[#78350F]/80 rounded-2xl p-4 text-center">
        <p className="text-xs text-amber-200/80 font-mono leading-relaxed max-w-2xl mx-auto">
          ⚠️ {disclaimerFooter}
        </p>
      </footer>
    </div>
  );
}
