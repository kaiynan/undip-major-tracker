'use client';

import React from 'react';
import { Compass, FileText, Sparkles, GraduationCap } from 'lucide-react';
import { APP_NAME } from '@/config/brand';

const STEPS = [
  {
    step: '01',
    label: 'LANGKAH 01',
    title: 'Kenali Minatmu',
    Icon: Compass,
    description:
      'Pahami dorongan alamiah dirimu: eksplorasi apakah kamu lebih tertarik pada praktik alat, investigasi analitis, ekspresi sosial, atau kepemimpinan bisnis.',
  },
  {
    step: '02',
    label: 'LANGKAH 02',
    title: 'Jawab 36 Pertanyaan',
    Icon: FileText,
    description:
      'Tanggapi 36 butir refleksi terstruktur dengan skala 1–5 (Sangat Tidak Tertarik hingga Sangat Tertarik). Waktu pengerjaan santai sekitar 5–8 menit.',
  },
  {
    step: '03',
    label: 'LANGKAH 03',
    title: 'Temukan Rekomendasi',
    Icon: Sparkles,
    description:
      'Mesin analitik HMIM memproses profilmu secara komprehensif dan menghasilkan pengelompokan Tier kecocokan (Tier S, A, B, C, D) yang transparan dan obyektif.',
  },
  {
    step: '04',
    label: 'LANGKAH 04',
    title: 'Eksplorasi Program Studi',
    Icon: GraduationCap,
    description:
      'Pelajari profil kurikulum autentik, capaian pembelajaran (CPL), prospek karier, serta daya tampung resmi penerimaan mahasiswa baru (SNBP, SNBT, Mandiri) di 65 program studi di peringkat dan 5 program PSDKU.',
  },
];

export function PixelCaraKerjaScene() {
  return (
    <section
      id="cara-kerja"
      className="relative w-full bg-[#1A0E08] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#78350F] scroll-mt-16"
      aria-label="Scene Cara Kerja"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section: Clean, Professional, No Badges */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="font-pixel text-lg sm:text-2xl text-white tracking-wide">
            Bagaimana {APP_NAME} Bekerja?
          </h2>

          <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed font-normal">
            Empat langkah terstruktur untuk membantumu menemukan program studi yang paling selaras dengan potensi dan impianmu di Universitas Diponegoro.
          </p>
        </div>

        {/* Structured 4-Step Symmetrical Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((item) => {
            const StepIcon = item.Icon;
            return (
              <div
                key={item.step}
                className="bg-[#24130C] border-2 border-[#78350F] p-5 shadow-[3px_3px_0_0_#0F0804] pixelated flex flex-col justify-between h-full min-h-[220px]"
              >
                <div>
                  {/* Step Header Marker & Professional Minimal Icon */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#78350F]/60">
                    <span className="font-pixel text-[9px] text-[#FDE68A] bg-[#9A3412] px-2 py-0.5 border border-[#F59E0B]">
                      {item.label}
                    </span>
                    <div className="w-7 h-7 bg-[#1A0E08] border border-[#78350F] flex items-center justify-center text-[#FDE68A]">
                      <StepIcon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-pixel text-xs sm:text-sm text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-amber-100/75 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>

                {/* Step Metadata Footer */}
                <div className="mt-5 pt-3 border-t border-[#78350F]/40 flex items-center justify-end text-[10px] font-mono text-amber-200/80">
                  <span className="text-[#FDE68A] font-bold">{item.step}/04</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
