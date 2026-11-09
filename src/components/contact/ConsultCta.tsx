'use client';

import React from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { isContactReady, buildWaLink, CONTACT_CONFIG } from '@/config/contact';

export interface ConsultCtaProps {
  variant?: 'card' | 'inline' | 'link';
  topProgramNames?: string[];
  className?: string;
  buttonText?: string;
}

/**
 * Komponen resmi tautan konsultasi WhatsApp SERADIP (Sedulur Serang Diponegoro).
 *
 * Aturan Utama:
 * 1. Jika isContactReady() bernilai false (nomor belum dikonfigurasi),
 *    komponen merender null (degradasi anggun, tidak ada kotak kosong / tombol mati).
 * 2. Tautan dibuat melalui buildWaLink() dan membuka WhatsApp web/app.
 * 3. Pesan tidak dikirim otomatis; pengguna dapat membaca dan mengedit pesan sebelum menekan tombol Kirim di WhatsApp.
 * 4. Bila terdapat hasil peringkat teratas, nama 3 prodi teratas disertakan dalam teks pembuka.
 */
export function ConsultCta({
  variant = 'card',
  topProgramNames = [],
  className = '',
  buttonText,
}: ConsultCtaProps) {
  if (!isContactReady()) {
    return null;
  }

  // Build pre-filled message
  let message = CONTACT_CONFIG.defaultMessagePrefix;
  if (topProgramNames.length > 0) {
    const listStr = topProgramNames.slice(0, 3).map((name, idx) => `\n${idx + 1}. ${name}`).join('');
    message += `\n${listStr}\n\nMohon masukan dan arahan dari Kakak SERADIP. Terima kasih!`;
  } else {
    message += ' Mohon info dan bimbingannya Kak. Terima kasih!';
  }

  const waUrl = buildWaLink(message);

  if (variant === 'link') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Konsultasi WhatsApp SERADIP"
        data-testid="consult-cta-link"
        className={`inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white transition-colors min-h-[44px] ${className}`}
      >
        <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>{buttonText || 'Konsultasi SERADIP via WhatsApp'}</span>
        <ExternalLink className="w-3 h-3 text-amber-400/80" />
      </a>
    );
  }

  if (variant === 'inline') {
    return (
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Konsultasi Pendampingan SERADIP"
        data-testid="consult-cta-inline"
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300 hover:text-emerald-100 bg-[#190E08] hover:bg-[#341A10] border-2 border-emerald-700/70 hover:border-emerald-500 transition-all shadow-[2px_2px_0_0_#000] cursor-pointer min-h-[44px] ${className}`}
      >
        <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{buttonText || 'Konsultasi dengan SERADIP'}</span>
        <ExternalLink className="w-3 h-3 opacity-70" />
      </a>
    );
  }

  // Variant 'card'
  return (
    <div
      data-testid="consult-cta-card"
      className={`bg-[#24130C] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 border-emerald-700/80 shadow-[0_4px_24px_rgba(0,0,0,0.5)] text-slate-100 space-y-3 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
          <MessageCircle className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="space-y-1">
          <h3 className="font-pixel text-sm sm:text-base font-black text-[#FFFBEB]">
            Konsultasi Pendampingan {CONTACT_CONFIG.name}
          </h3>
          <p className="text-xs text-amber-100/90 leading-relaxed font-sans">
            Masih bingung menentukan pilihan jurusan atau ingin berdiskusi dengan mahasiswa aktif UNDIP asal Serang? Tim SERADIP siap berbagi pengalaman dan menjawab pertanyaanmu.
          </p>
        </div>
      </div>

      <div className="pt-1 flex flex-wrap items-center gap-3">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hubungi Mahasiswa UNDIP (SERADIP) via WhatsApp"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-black px-4 sm:px-5 py-2.5 rounded-xl border-2 border-emerald-400 transition-all shadow-[2px_2px_0_0_#000] min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4 text-stone-950" />
          <span>{buttonText || 'Hubungi Kakak SERADIP via WhatsApp'}</span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-950" />
        </a>
        <span className="text-[11px] text-amber-200/60 font-sans">
          Pesan dapat dibaca & diedit terlebih dahulu sebelum dikirim.
        </span>
      </div>
    </div>
  );
}
