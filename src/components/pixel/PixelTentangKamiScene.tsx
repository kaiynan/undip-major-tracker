'use client';

import React from 'react';
import Link from 'next/link';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import {
  ShieldCheck,
  Brain,
  Users,
  ArrowRight,
  Compass,
  Microscope,
  BookOpen,
  Sparkles,
} from 'lucide-react';

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
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Heading: Clean, Minimal & Consistent */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="font-pixel text-lg sm:text-2xl text-white tracking-wide">
            Tentang UNDIP Major Matcher
          </h2>

          <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed font-normal">
            Platform eksplorasi akademik yang dikembangkan untuk menjembatani rasa ingin tahu calon mahasiswa baru dengan karakteristik 67 program studi Universitas Diponegoro secara terstruktur, adil, dan obyektif.
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

          <div className="mt-6 pt-4 border-t border-[#78350F]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200/80">
            <span>
              Contoh Nyata: Membedakan secara akurat antara peminat <strong>Teknik Kimia</strong> (proses industri) vs <strong>Kimia Murni</strong> (riset laboratorium).
            </span>
            <Link
              href="/admin"
              className="font-pixel text-[10px] text-[#FDE68A] hover:underline inline-flex items-center gap-1.5 shrink-0"
            >
              <span>DETAIL RUMUS HMIM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 3 Pillars of Transparency & Trust (Uniform Symmetrical Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#24130C] border-2 border-[#78350F] p-5 pixelated space-y-2.5 shadow-[3px_3px_0_0_#0F0804]">
            <div className="flex items-center gap-2 font-pixel text-xs text-[#FDE68A]">
              <ShieldCheck className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>Transparansi & Akurasi</span>
            </div>
            <p className="text-xs text-amber-100/75 leading-relaxed font-normal">
              Seluruh data 67 program studi dan daya tampung bersumber langsung dari penetapan resmi PMB UNDIP dan Portal Nasional SNPMB BPPP Kemdikbudristek RI.
            </p>
          </div>

          <div className="bg-[#24130C] border-2 border-[#78350F] p-5 pixelated space-y-2.5 shadow-[3px_3px_0_0_#0F0804]">
            <div className="flex items-center gap-2 font-pixel text-xs text-[#FDE68A]">
              <Brain className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>Instrumen Eksplorasi</span>
            </div>
            <p className="text-xs text-amber-100/75 leading-relaxed font-normal">
              Platform ini berfungsi sebagai alat eksplorasi minat akademik mandiri untuk calon mahasiswa baru, bukan penentu kelulusan seleksi atau diagnosis psikologis klinis.
            </p>
          </div>

          <div className="bg-[#24130C] border-2 border-[#78350F] p-5 pixelated space-y-2.5 shadow-[3px_3px_0_0_#0F0804]">
            <div className="flex items-center gap-2 font-pixel text-xs text-[#FDE68A]">
              <Users className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>Privasi Siswa 100%</span>
            </div>
            <p className="text-xs text-amber-100/75 leading-relaxed font-normal">
              Seluruh jawaban kuisioner diproses dan tersimpan secara lokal di browser perangkatmu. Tidak ada data pribadi atau identitas yang dikumpulkan ke server eksternal.
            </p>
          </div>
        </div>

        {/* Official Mandatory Disclaimer */}
        <div className="pt-2">
          <DisclaimerBanner />
        </div>
      </div>
    </section>
  );
}
