'use client';

import React from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw, Home, Trophy } from 'lucide-react';

export default function OfflinePage() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/90 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60">
          <WifiOff className="w-8 h-8" />
        </div>

        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Koneksi Internet Terputus
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
          Kamu sedang berada dalam mode offline. Jangan khawatir, progres jawaban kuisioner dan riwayat hasilmu yang tersimpan di perangkat tetap aman.
        </p>

        <div className="mt-6 space-y-2.5">
          <button
            onClick={handleReload}
            className="w-full flex items-center justify-center gap-2 bg-[#002060] hover:bg-[#001744] text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Coba Muat Ulang Halaman</span>
          </button>

          <Link
            href="/results"
            className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-[#002060] py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all"
          >
            <Trophy className="w-4 h-4" />
            <span>Buka Hasil Tersimpan</span>
          </Link>

          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
          Aplikasi ini mendukung Progressive Web App (PWA) untuk akses cepat dan hemat kuota.
        </div>
      </div>
    </div>
  );
}
