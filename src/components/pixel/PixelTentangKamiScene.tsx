'use client';

import React from 'react';
import {
  Brain,
  Compass,
  Microscope,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { APP_NAME, EVENT_NAME, TAGLINE } from '@/config/brand';

const DIMENSIONS = [
  {
    dim: '01',
    weight: '20%',
    title: 'Minat RIASEC',
    Icon: Compass,
    description:
      'Tipologi John Holland untuk memetakan kepribadian karir dasar (Realistic, Investigative, Artistic, Social, Enterprising, Conventional).',
  },
  {
    dim: '02',
    weight: '35% (Inti)',
    title: 'Bidang Ilmu Spesifik',
    Icon: Microscope,
    description:
      'Ketertarikan langsung pada 12 disiplin keilmuan riil di lingkungan UNDIP (Rekayasa, Medis, Komputer, Bisnis, Hukum, Kelautan).',
  },
  {
    dim: '03',
    weight: '20%',
    title: 'Gaya Belajar',
    Icon: Brain,
    description:
      'Preferensi belajar mahasiswa: apakah menyukai eksperimen laboratorium, analisa data angka, studi lapangan, atau advokasi publik.',
  },
  {
    dim: '04',
    weight: '25%',
    title: 'Kurikulum Riil',
    Icon: BookOpen,
    description:
      'Pencocokan mata kuliah spesifik dan capaian pembelajaran (CPL) dari program studi resmi di Universitas Diponegoro.',
  },
];

export function PixelTentangKamiScene() {
  return (
    <section
      id="tentang-kami"
      className="relative w-full bg-[#1A0E08] text-slate-100 py-16 px-4 sm:px-6 lg:px-8 border-b-4 border-[#78350F] scroll-mt-16"
      aria-label="Scene Tentang Kami"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Section Heading: Clean, Minimal & Consistent */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#2A160E] border border-[#F59E0B] px-3.5 py-1.5 shadow-[2px_2px_0_0_#000]">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="font-pixel text-[9px] sm:text-[10px] text-[#FDE68A] uppercase tracking-wider">
              {EVENT_NAME}
            </span>
          </div>

          <h2 className="font-pixel text-lg sm:text-2xl text-white tracking-wide">
            Tentang {APP_NAME}
          </h2>

          <p className="font-mono text-xs text-[#F59E0B] italic">
            &ldquo;{TAGLINE}&rdquo;
          </p>

          <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed font-normal">
            Platform eksplorasi akademik yang dikembangkan untuk menjembatani rasa ingin tahu calon mahasiswa baru dengan karakteristik 65 program studi di peringkat dan 5 program PSDKU Universitas Diponegoro secara terstruktur, adil, dan obyektif.
          </p>
        </div>

        {/* 4 Matching Dimensions Cards (Cohesive Layout Matching Cara Kerja) */}
        <div className="bg-[#24130C] border-2 border-[#78350F] p-6 sm:p-8 pixelated shadow-[3px_3px_0_0_#0F0804]">
          <div className="max-w-3xl mb-8">
            <span className="font-pixel text-[10px] text-[#F59E0B] uppercase block mb-1">
              ARSITEKTUR FORMULA HMIM
            </span>
            <h3 className="font-pixel text-sm sm:text-lg text-white">
              Mengapa Menggunakan 4 Dimensi Minat?
            </h3>
            <p className="text-xs text-amber-100/75 mt-2 leading-relaxed">
              Memilih jurusan bukan sekadar menebak nama umum. Algoritma Hybrid Multi-Dimensional Interest Matching menggabungkan empat pilar bobot terukur:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DIMENSIONS.map((item) => {
              const DimIcon = item.Icon;
              return (
                <div
                  key={item.dim}
                  className="bg-[#1A0E08] border border-[#78350F] p-5 flex flex-col justify-between h-full min-h-[190px]"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#78350F]/50">
                      <div className="w-7 h-7 bg-[#24130C] border border-[#78350F] flex items-center justify-center text-[#FDE68A]">
                        <DimIcon className="w-4 h-4" />
                      </div>
                      <span className="font-pixel text-[9px] bg-[#9A3412] text-[#FDE68A] px-2 py-0.5 border border-[#F59E0B]">
                        {item.weight}
                      </span>
                    </div>

                    <h4 className="font-pixel text-xs text-white mb-2">{item.title}</h4>
                    <p className="text-xs text-amber-100/75 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
