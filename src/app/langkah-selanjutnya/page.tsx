'use client';

import React from 'react';
import Link from 'next/link';
import { retroAudio } from '@/lib/retroAudio';
import {
  Banknote,
  GraduationCap,
  Calendar,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';

export default function LangkahSelanjutnyaHubPage() {
  const cards = [
    {
      id: 'biaya-ukt',
      title: 'Biaya Kuliah (UKT)',
      subtitle: 'Golongan 1–8 Sarjana & Golongan 1–7 Vokasi',
      blurb:
        'Golongan 1–8 untuk Sarjana, Golongan 1–7 untuk Vokasi; transparan berdasarkan SK Rektor. Dilengkapi fitur pencarian tarif resmi per program studi.',
      href: '/langkah-selanjutnya/biaya-ukt',
      icon: Banknote,
      ctaLabel: 'Lihat Tarif UKT',
      badge: 'SK REKTOR RESMI',
    },
    {
      id: 'beasiswa',
      title: 'Beasiswa KIP-Kuliah',
      subtitle: 'Bantuan Biaya Pendidikan & Biaya Hidup',
      blurb:
        'Bebas biaya UKT & bantuan biaya hidup bagi mahasiswa pemegang KIP-Kuliah / KIP / PIP / PKH. Pahami kriteria kelayakan dan alur pengajuan resmi.',
      href: '/langkah-selanjutnya/beasiswa',
      icon: GraduationCap,
      ctaLabel: 'Panduan Beasiswa',
      badge: 'BANTUAN KULIAH',
    },
    {
      id: 'jadwal-seleksi',
      title: 'Jadwal Seleksi Masuk',
      subtitle: 'Linimasa SNBP, SNBT & Ujian Mandiri',
      blurb:
        'Alur seleksi SNBP, SNBT, dan Ujian Mandiri 2026/2027 beserta alokasi kuota daya tampung resmi Universitas Diponegoro.',
      href: '/langkah-selanjutnya/jadwal-seleksi',
      icon: Calendar,
      ctaLabel: 'Cek Kalender Seleksi',
      badge: 'TA 2026/2027',
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Hero Banner */}
      <section className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.6)] text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-[#2A160E] text-[#FDE68A] px-3.5 py-1.5 rounded-full border border-[#F59E0B]/70 font-pixel text-[9px] shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>ROADSHOW SEDULUR SERANG DIPONEGORO 2027</span>
        </div>

        <h1 className="font-pixel text-base sm:text-2xl text-[#FDE68A] tracking-wide max-w-2xl mx-auto leading-relaxed">
          Langkah Selanjutnya Masuk Universitas Diponegoro
        </h1>

        <p className="text-xs sm:text-sm text-amber-100/90 max-w-2xl mx-auto leading-relaxed font-sans">
          Informasi resmi biaya kuliah, beasiswa KIP-Kuliah, dan kalender seleksi 2026/2027 yang dirancang khusus untuk memandu calon mahasiswa baru.
        </p>

        <div className="pt-2 flex items-center justify-center gap-2 text-emerald-400 font-mono text-[11px]">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Transparan, akurat, dan diverifikasi langsung dari dokumen resmi</span>
        </div>
      </section>

      {/* 2. Three Prominent Next-Steps Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-5 sm:p-6 flex flex-col justify-between hover:border-[#F59E0B] transition-all hover:-translate-y-1 shadow-[0_4px_16px_rgba(0,0,0,0.4)] group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="w-12 h-12 rounded-xl bg-[#2A160E] border-2 border-[#F59E0B] flex items-center justify-center text-[#FDE68A] shadow-[2px_2px_0_0_#000] group-hover:bg-[#3D1F13] transition-colors shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-pixel text-[8px] bg-[#140B07] text-[#FDE68A] px-2 py-0.5 rounded border border-[#78350F]">
                    {c.badge}
                  </span>
                </div>

                <div>
                  <h2 className="font-pixel text-sm sm:text-base text-[#FDE68A] group-hover:text-amber-200 transition-colors">
                    {c.title}
                  </h2>
                  <p className="font-mono text-[10px] text-amber-300/80 mt-0.5">
                    {c.subtitle}
                  </p>
                </div>

                <p className="text-xs text-amber-100/80 leading-relaxed font-sans">
                  {c.blurb}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href={c.href}
                  onClick={() => retroAudio.playSelect()}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-[#FBBF24] text-stone-950 font-bold px-4 py-2.5 rounded-xl border-2 border-[#78350F] font-pixel text-[9px] shadow-[2px_2px_0_0_#000] transition-transform active:translate-x-0.5 active:translate-y-0.5 min-h-[44px]"
                >
                  <span>{c.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Quick Link Back to Questionnaire */}
      <section className="bg-[#140B07] border-2 border-[#78350F] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-[#24130C] border border-[#78350F] flex items-center justify-center text-[#F59E0B] shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-pixel text-xs sm:text-sm text-[#FDE68A]">
              Belum Tahu Mau Pilih Jurusan Apa?
            </h3>
            <p className="text-xs text-amber-200/80 mt-0.5">
              Cari tahu program studi yang paling cocok dengan kepribadian dan minatmu melalui Tes Minat HMIM.
            </p>
          </div>
        </div>

        <Link
          href="/questionnaire"
          onClick={() => retroAudio.playSelect()}
          className="inline-flex items-center gap-2 bg-[#2A160E] hover:bg-[#3D1F13] text-[#FDE68A] hover:text-white px-5 py-2.5 rounded-xl border border-[#F59E0B] font-pixel text-[9px] shadow-[2px_2px_0_0_#000] shrink-0 min-h-[44px] transition-colors"
        >
          <span>IKUTI TES MINAT</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </Link>
      </section>
    </div>
  );
}
