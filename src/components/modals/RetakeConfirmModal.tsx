'use client';

import React from 'react';
import { RotateCcw, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface RetakeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * 16-Bit Pixel-Art Themed Questionnaire Retake Confirmation Dialog.
 * Conforms strictly to accessible Modal standard (Group D) and Section 5:
 * - Uses shared Modal component with ARIA, focus trap, and Escape key handling.
 * - Title: "Ulangi Kuisioner?"
 * - Description: "Apakah kamu ingin mengulang 36 pertanyaan? Hasil rekomendasi sebelumnya akan digantikan setelah kamu menyelesaikan kuisioner kembali."
 * - Buttons: "Kembali" and "Ya, Ulangi"
 * - Consistent 16-bit pixel-art styling and golden-hour atmosphere.
 */
export function RetakeConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: RetakeConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="retake-modal-title"
      maxWidth="max-w-md"
      className="p-6 sm:p-7"
    >
      {/* Retro Header Accent */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#78350F]/70">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[8px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded border border-amber-600 font-bold">
            KONFIRMASI
          </span>
          <span className="text-[11px] font-mono text-amber-200/80">
            RESET KUISIONER
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-amber-200/70 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Batal"
          aria-label="Tutup dialog konfirmasi ulangi kuisioner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Warning Icon Graphic */}
      <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border-2 border-amber-600/70 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
        <RotateCcw className="w-7 h-7" />
      </div>

      {/* Mandatory Title & Description */}
      <h3
        id="retake-modal-title"
        className="text-lg sm:text-xl font-black text-[#FFFBEB] text-center font-pixel"
      >
        Ulangi Kuisioner?
      </h3>

      <p className="text-xs sm:text-sm text-amber-100/90 text-center mt-3 leading-relaxed px-2">
        Apakah kamu ingin mengulang 36 pertanyaan? Hasil rekomendasi sebelumnya akan digantikan setelah kamu menyelesaikan kuisioner kembali.
      </p>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-6 pt-2">
        <button
          onClick={onClose}
          aria-label="Batal mengulang kuisioner"
          className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-[#190E08] hover:bg-[#341A10] border-2 border-[#78350F] text-amber-200 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs min-h-[44px]"
        >
          Kembali
        </button>
        <button
          onClick={onConfirm}
          aria-label="Konfirmasi ya ulangi kuisioner dari awal"
          className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white font-extrabold text-xs sm:text-sm border-2 border-rose-500 transition-all cursor-pointer shadow-md min-h-[44px]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Ya, Ulangi</span>
        </button>
      </div>
    </Modal>
  );
}
