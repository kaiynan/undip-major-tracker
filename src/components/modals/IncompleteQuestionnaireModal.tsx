'use client';

import React from 'react';
import Link from 'next/link';
import { Compass, ArrowRight, Eye, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface IncompleteQuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  answeredCount: number;
  totalQuestions: number;
}

/**
 * 16-Bit Pixel-Art Pop-Up Before Questionnaire Completion.
 * Conforms strictly to accessible Modal standard (Group D) and Section 1:
 * - Uses shared Modal component with ARIA, focus trap, and Escape key handling.
 * - Uses identical visual identity, typography, golden-hour palette, and 16-bit borders as the questionnaire.
 * - Title: "Petualanganmu Belum Selesai!"
 * - Description adapts depending on whether respondent has started or has 0 answers.
 * - Primary Button: "Mulai Kuisioner" or "Lanjutkan Kuisioner (X/36 Soal)".
 * - Secondary Button: "Jelajahi Peta Dahulu (Tutup Panel)" to explore the full-screen campus map.
 * - Zero fabricated scores or ranking cards.
 */
export function IncompleteQuestionnaireModal({
  isOpen,
  onClose,
  answeredCount,
  totalQuestions,
}: IncompleteQuestionnaireModalProps) {
  const hasStarted = answeredCount > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="incomplete-modal-title"
      maxWidth="max-w-lg"
      className="p-6 sm:p-8 text-center"
    >
      {/* Close Button to Explore Map */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-xl text-amber-200/70 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
        title="Tutup untuk menjelajahi peta kampus"
        aria-label="Tutup untuk menjelajahi peta kampus"
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
      <h2
        id="incomplete-modal-title"
        className="text-xl sm:text-2xl font-black text-[#FFFBEB] font-pixel tracking-wide"
      >
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
          className="w-full flex items-center justify-center gap-2 bg-[#F59E0B] hover:bg-amber-400 text-stone-950 font-black py-3.5 px-6 rounded-2xl border-2 border-[#B45309] shadow-[0_4px_16px_rgba(245,158,11,0.4)] transition-all text-xs sm:text-sm cursor-pointer min-h-[44px]"
        >
          <span>{hasStarted ? `Lanjutkan Kuisioner (${answeredCount}/${totalQuestions})` : 'Mulai Kuisioner (36 Soal)'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Secondary Action: Explore Full-Screen Campus Map */}
        <button
          onClick={onClose}
          aria-label="Jelajahi peta kampus dahulu (tutup panel modal)"
          className="w-full flex items-center justify-center gap-2 bg-[#190E08] hover:bg-[#341A10] text-amber-200 font-bold py-2.5 px-4 rounded-xl border border-[#78350F] transition-all text-xs cursor-pointer min-h-[44px]"
        >
          <Eye className="w-4 h-4 text-[#F59E0B]" />
          <span>Jelajahi Peta Dahulu (Tutup Panel)</span>
        </button>
      </div>
    </Modal>
  );
}
