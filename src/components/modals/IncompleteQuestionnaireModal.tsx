'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, Eye, X, Sparkles, MapPin } from 'lucide-react';

interface IncompleteQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  answeredCount: number;
  totalQuestions: number;
  onLoadSampleProfile?: (category: 'engineering' | 'medical' | 'business' | 'humanities') => void;
}

/**
 * 16-Bit Pixel-Art Pop-Up Before Questionnaire Completion.
 * Conforms strictly to Section 1 of the revision prompt:
 * - Uses identical visual identity, typography, golden-hour palette, and 16-bit borders as the questionnaire.
 * - Title: "Petualanganmu Belum Selesai!"
 * - Description adapts depending on whether respondent has started or has 0 answers.
 * - Primary Button: "Mulai Kuisioner" or "Lanjutkan Kuisioner (X/36 Soal)".
 * - Secondary Button: "Jelajahi Peta Dahulu (Tutup Panel)" to explore the full-screen campus map.
 * - Instant profile simulation triggers.
 * - Zero fabricated scores or ranking cards.
 */
export function IncompleteQuestionnaireModal({
  isOpen,
  onClose,
  answeredCount,
  totalQuestions,
  onLoadSampleProfile,
}: IncompleteQuestionnaireModalProps) {
  if (!isOpen) return null;

  const hasStarted = answeredCount > 0;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overscroll-contain animate-in fade-in duration-200"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="relative w-full max-w-lg bg-[#24130C] rounded-3xl border-2 border-[#78350F] p-6 sm:p-8 shadow-[0_12px_45px_rgba(0,0,0,0.9)] text-white text-center">
        {/* Close Button to Explore Map */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-amber-200/70 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer"
          title="Tutup untuk menjelajahi peta kampus"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Pixel Badge */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="font-pixel text-[8px] sm:text-[9px] bg-[#78350F] text-[#FDE68A] px-3 py-1 rounded-full border border-[#F59E0B] shadow-[2px_2px_0_0_#000]">
            STAGE 0: EKSPLORASI BELUM LENGKAP
          </span>
        </div>

        {/* 16-Bit Graphic Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-[#190E08] border-2 border-[#F59E0B] text-[#FDE68A] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
          <Compass className="w-8 h-8 text-[#F59E0B] animate-pulse" />
        </div>

        {/* Mandatory Title */}
        <h2 className="text-xl sm:text-2xl font-black text-[#FFFBEB] font-pixel tracking-wide">
          Petualanganmu Belum Selesai!
        </h2>

        {/* Adaptive Concise Indonesian Description */}
        <p className="text-xs sm:text-sm text-amber-100/90 mt-3 leading-relaxed px-2">
          {hasStarted
            ? `Kamu baru menyelesaikan ${answeredCount} dari ${totalQuestions} pertanyaan. Selesaikan seluruh pertanyaan untuk membuka hasil rekomendasi program studi dan fakultas/sekolah UNDIP yang sesuai dengan minatmu.`
            : `Selesaikan ${totalQuestions} pertanyaan untuk membuka hasil rekomendasi program studi dan fakultas/sekolah UNDIP yang sesuai dengan minatmu.`}
        </p>

        {/* Progress Pill if partially answered */}
        {hasStarted && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#190E08] border border-[#78350F] text-xs font-mono text-[#FDE68A]">
            <span>Progres Tersimpan:</span>
            <span className="font-bold text-amber-400">{answeredCount}/{totalQuestions} Soal ({Math.round((answeredCount / totalQuestions) * 100)}%)</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {/* Primary Action Button */}
          <Link
            href="/questionnaire"
            className="w-full flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-amber-400 text-stone-950 font-black py-3.5 px-6 rounded-2xl border-2 border-[#B45309] shadow-[0_4px_16px_rgba(245,158,11,0.4)] transition-all text-xs sm:text-sm cursor-pointer"
          >
            <span>{hasStarted ? `Lanjutkan Kuisioner (${answeredCount}/${totalQuestions})` : 'Mulai Kuisioner (36 Soal)'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Secondary Action: Explore Full-Screen Campus Map */}
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-[#190E08] hover:bg-[#341A10] text-amber-200 font-bold py-2.5 px-4 rounded-xl border border-[#78350F] transition-all text-xs cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#F59E0B]" />
            <span>Jelajahi Peta Dahulu (Tutup Panel)</span>
          </button>

          {/* Instant Sample Profile Simulators */}
          {onLoadSampleProfile && (
            <div className="pt-4 border-t border-[#78350F]/70">
              <span className="text-[11px] font-bold text-amber-200/70 uppercase tracking-wider block mb-2.5">
                Atau Coba Simulasi Instan Profil Minat:
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => onLoadSampleProfile('engineering')}
                  className="px-3 py-1.5 text-xs font-bold bg-[#190E08] text-blue-300 rounded-xl border border-blue-500/50 hover:bg-blue-950/60 transition-colors cursor-pointer"
                >
                  Teknik
                </button>
                <button
                  onClick={() => onLoadSampleProfile('medical')}
                  className="px-3 py-1.5 text-xs font-bold bg-[#190E08] text-emerald-300 rounded-xl border border-emerald-500/50 hover:bg-emerald-950/60 transition-colors cursor-pointer"
                >
                  Kedokteran
                </button>
                <button
                  onClick={() => onLoadSampleProfile('business')}
                  className="px-3 py-1.5 text-xs font-bold bg-[#190E08] text-amber-300 rounded-xl border border-amber-500/50 hover:bg-amber-950/60 transition-colors cursor-pointer"
                >
                  Bisnis
                </button>
                <button
                  onClick={() => onLoadSampleProfile('humanities')}
                  className="px-3 py-1.5 text-xs font-bold bg-[#190E08] text-purple-300 rounded-xl border border-purple-500/50 hover:bg-purple-950/60 transition-colors cursor-pointer"
                >
                  Humaniora
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
