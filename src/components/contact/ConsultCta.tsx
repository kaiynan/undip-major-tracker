'use client';

import React from 'react';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { isContactReady, waLink, INSTAGRAM, CONTACT_CONFIG } from '@/config/contact';

export interface ConsultCtaProps {
  variant?: 'card' | 'inline' | 'link';
  topProgramNames?: string[];
  className?: string;
  buttonText?: string;
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

/**
 * Komponen resmi tautan konsultasi WhatsApp & Instagram SERADIP (Sedulur Serang Diponegoro).
 *
 * Aturan Utama:
 * 1. Jika isContactReady() bernilai false (nomor belum dikonfigurasi),
 *    komponen merender null (degradasi anggun, tidak ada kotak kosong / tombol mati).
 * 2. Menyediakan 2 kontak WhatsApp (Kak Dian & Kak Cindy) serta akun Instagram resmi @sedulurdiponegoro.
 * 3. Tautan membuka WhatsApp web/app dan profil Instagram.
 * 4. Pesan WhatsApp tidak dikirim otomatis; pengguna dapat membaca dan mengedit pesan sebelum menekan tombol Kirim.
 * 5. Setiap target interaktif memiliki ukuran minimal 44x44 px dengan target="_blank" dan rel="noopener noreferrer".
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

  // Build pre-filled message with top 3 programs if available
  let message = CONTACT_CONFIG.defaultMessagePrefix;
  if (topProgramNames.length > 0) {
    const listStr = topProgramNames.slice(0, 3).map((name, idx) => `\n${idx + 1}. ${name}`).join('');
    message += `\n${listStr}\n\nMohon masukan dan arahan dari Kakak SERADIP. Terima kasih!`;
  } else {
    message += ' Mohon info dan bimbingannya Kak. Terima kasih!';
  }

  const waDian = waLink('dian', message);
  const waCindy = waLink('cindy', message);
  const igUrl = INSTAGRAM.url;

  if (variant === 'link') {
    return (
      <div
        data-testid="consult-cta-link"
        className={`flex flex-wrap items-center gap-2 sm:gap-3 text-xs ${className}`}
      >
        <a
          href={waDian}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Konsultasi WhatsApp Kak Dian SERADIP"
          className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-200 transition-colors min-h-[44px] px-1"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Chat Kak Dian</span>
          <ExternalLink className="w-3 h-3 text-amber-400/80" />
        </a>
        <span className="text-stone-600 select-none">•</span>
        <a
          href={waCindy}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Konsultasi WhatsApp Kak Cindy SERADIP"
          className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-200 transition-colors min-h-[44px] px-1"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Chat Kak Cindy</span>
          <ExternalLink className="w-3 h-3 text-amber-400/80" />
        </a>
        <span className="text-stone-600 select-none">•</span>
        <a
          href={igUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram @sedulurdiponegoro"
          className="inline-flex items-center gap-1.5 text-pink-400 hover:text-pink-300 transition-colors min-h-[44px] px-1"
        >
          <InstagramIcon className="w-3.5 h-3.5 text-pink-400 shrink-0" />
          <span>{INSTAGRAM.handle}</span>
          <ExternalLink className="w-3 h-3 text-amber-400/80" />
        </a>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div
        data-testid="consult-cta-inline"
        className={`flex flex-wrap items-center gap-2.5 ${className}`}
      >
        <a
          href={waDian}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Kak Dian via WhatsApp"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300 hover:text-emerald-100 bg-[#190E08] hover:bg-[#341A10] border-2 border-emerald-700/70 hover:border-emerald-500 transition-all shadow-[2px_2px_0_0_#000] cursor-pointer min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Chat Kak Dian</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
        <a
          href={waCindy}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat Kak Cindy via WhatsApp"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300 hover:text-emerald-100 bg-[#190E08] hover:bg-[#341A10] border-2 border-emerald-700/70 hover:border-emerald-500 transition-all shadow-[2px_2px_0_0_#000] cursor-pointer min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Chat Kak Cindy</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
        <a
          href={igUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram SERADIP @sedulurdiponegoro"
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-300 hover:text-white bg-[#190E08] hover:bg-[#341A10] border border-amber-700/50 hover:border-amber-500 transition-all min-h-[44px]"
        >
          <InstagramIcon className="w-3.5 h-3.5 text-pink-400 shrink-0" />
          <span>{INSTAGRAM.handle}</span>
          <ExternalLink className="w-3 h-3 opacity-70" />
        </a>
      </div>
    );
  }

  // Variant 'card'
  return (
    <div
      data-testid="consult-cta-card"
      className={`bg-[#24130C] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 border-emerald-700/80 shadow-[0_4px_24px_rgba(0,0,0,0.5)] text-slate-100 space-y-4 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
          <MessageCircle className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="space-y-1">
          <h3 className="font-pixel text-sm sm:text-base font-black text-[#FFFBEB]">
            {buttonText || `Konsultasi Pendampingan ${CONTACT_CONFIG.name}`}
          </h3>
          <p className="text-xs text-amber-100/90 leading-relaxed font-sans">
            Masih bingung menentukan pilihan jurusan atau ingin berdiskusi dengan mahasiswa aktif UNDIP asal Serang? Tim SERADIP siap berbagi pengalaman dan menjawab pertanyaanmu.
          </p>
        </div>
      </div>

      <div className="pt-1 flex flex-wrap items-center gap-3">
        <a
          href={waDian}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hubungi Kak Dian via WhatsApp"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-black px-4 sm:px-5 py-2.5 rounded-xl border-2 border-emerald-400 transition-all shadow-[2px_2px_0_0_#000] min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4 text-stone-950" />
          <span>Chat Kak Dian</span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-950" />
        </a>

        <a
          href={waCindy}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hubungi Kak Cindy via WhatsApp"
          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-stone-950 text-xs font-black px-4 sm:px-5 py-2.5 rounded-xl border-2 border-emerald-400 transition-all shadow-[2px_2px_0_0_#000] min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4 text-stone-950" />
          <span>Chat Kak Cindy</span>
          <ExternalLink className="w-3.5 h-3.5 text-stone-950" />
        </a>

        <a
          href={igUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Kunjungi Instagram @sedulurdiponegoro"
          className="inline-flex items-center gap-2 bg-[#1A0E08] hover:bg-[#341A10] text-amber-200 hover:text-white text-xs font-bold px-4 py-2.5 rounded-xl border-2 border-amber-600/70 hover:border-amber-400 transition-all shadow-[2px_2px_0_0_#000] min-h-[44px]"
        >
          <InstagramIcon className="w-4 h-4 text-pink-400 shrink-0" />
          <span>{INSTAGRAM.handle}</span>
          <ExternalLink className="w-3 h-3 text-amber-400/80" />
        </a>
      </div>

      <p className="text-[11px] text-amber-200/60 font-sans">
        Pesan dapat dibaca &amp; diedit terlebih dahulu sebelum dikirim melalui WhatsApp.
      </p>
    </div>
  );
}
