'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { APP_NAME, EVENT_NAME, TAGLINE, THEME } from '@/config/brand';

export function Footer() {
  const pathname = usePathname();

  // Hide footer on full-screen interactive routes like /results
  if (pathname === '/results') {
    return null;
  }
  return (
    <footer className="bg-[#050A16] text-slate-300 text-sm mt-auto border-t-4 border-[#1E3A8A] pixelated select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#102A56] border-2 border-[#FCD34D] flex items-center justify-center text-[#FCD34D] shadow-[2px_2px_0_0_#000]">
                <span className="font-pixel text-xs">U</span>
              </div>
              <div>
                <span className="font-pixel text-xs sm:text-sm text-white tracking-wide block">
                  {APP_NAME}
                </span>
                <span className="font-mono text-xs text-amber-200/80 block">
                  {TAGLINE}
                </span>
                <span className="font-pixel text-[9px] text-[#FCD34D] mt-1 block">
                  {EVENT_NAME}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg font-normal">
              Platform eksplorasi minat dan rekomendasi program studi Universitas Diponegoro berbasis
              arsitektur <strong>Hybrid Multi-Dimensional Interest Matching (HMIM)</strong>. Dirancang khusus
              untuk membantu calon mahasiswa menemukan jurusan impian secara obyektif dan komprehensif.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-pixel text-[10px] text-[#FCD34D] uppercase tracking-wider mb-3">
              Navigasi Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>
                <Link href="/#beranda" className="hover:text-white transition-colors">
                  ▶ Gedung Rektorat (Beranda)
                </Link>
              </li>
              <li>
                <Link href="/#patung-kuda" className="hover:text-white transition-colors">
                  ▶ Patung Kuda (Press To Play)
                </Link>
              </li>
              <li>
                <Link href="/#cara-kerja" className="hover:text-white transition-colors">
                  ▶ Alur 4 Quest Cara Kerja
                </Link>
              </li>
              <li>
                <Link href="/questionnaire" className="hover:text-white transition-colors">
                  ▶ Kuisioner Minat (36 Soal)
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-white transition-colors">
                  ▶ Peringkat 65 Program Studi
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  ▶ Transparansi Rumus HMIM
                </Link>
              </li>
            </ul>
          </div>

          {/* Official UNDIP Portals */}
          <div>
            <h4 className="font-pixel text-[10px] text-[#FCD34D] uppercase tracking-wider mb-3">
              Portal Resmi UNDIP
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-mono">
              <li>
                <a
                  href="https://undip.ac.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Website Utama UNDIP</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://pmb.undip.ac.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>PMB Universitas Diponegoro</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://bak.undip.ac.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>Biro Administrasi Akademik</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <span className="text-[11px] text-slate-500">
                  Mencakup 11 Fakultas & 1 Sekolah Vokasi
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Official Disclaimer Box with Retro Pixel Frame */}
        <div className="bg-[#0A1428] border-2 border-[#F59E0B] p-5 shadow-[3px_3px_0_0_#78350F] mb-8">
          <h5 className="font-pixel text-[10px] text-[#FCD34D] uppercase tracking-wider mb-2 flex items-center gap-2">
            <span>DISCLAIMER RESMI PLATFORM</span>
          </h5>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            &ldquo;{APP_NAME} merupakan platform eksplorasi minat yang membantu calon mahasiswa mengenali program studi Universitas Diponegoro yang memiliki kesesuaian dengan preferensi dan ketertarikan mereka. Hasil rekomendasi <strong>bukan merupakan tes psikologi profesional</strong>, <strong>tidak mengukur kecerdasan atau kemampuan akademik</strong>, <strong>tidak memprediksi peluang diterima di UNDIP</strong>, dan <strong>tidak menjamin keberhasilan akademik maupun karier</strong>. Gunakan hasil ini sebagai referensi awal untuk mengenal program studi dan melakukan eksplorasi lebih lanjut.&rdquo;
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t-2 border-[#1E293B] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 font-mono">
          <p>{`© ${new Date().getFullYear()} ${APP_NAME}. ${EVENT_NAME}.`}</p>
          <div className="flex items-center gap-4">
            <span className="text-[#F59E0B]">Tema: {THEME}</span>
            <span>•</span>
            <span>HMIM Engine v1.0</span>
            <span>•</span>
            <span>Universitas Diponegoro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
