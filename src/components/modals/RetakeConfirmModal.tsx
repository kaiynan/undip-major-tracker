'use client';

import React from 'react';
import { RotateCcw, X, AlertTriangle } from 'lucide-react';

interface RetakeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * 16-Bit Pixel-Art Themed Questionnaire Retake Confirmation Dialog.
 * Conforms strictly to Section 5 of the revision prompt:
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
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overscroll-contain animate-in fade-in duration-150"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="relative w-full max-w-md bg-[#24130C] rounded-3xl border-2 border-[#78350F] p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.85)] text-white">
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
            className="p-1 rounded-lg text-amber-200/70 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer"
            title="Batal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Icon Graphic */}
        <div className="w-14 h-14 rounded-2xl bg-amber-950/80 border-2 border-amber-600/70 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <RotateCcw className="w-7 h-7" />
        </div>

        {/* Mandatory Title & Description */}
        <h3 className="text-lg sm:text-xl font-black text-[#FFFBEB] text-center font-pixel">
          Ulangi Kuisioner?
        </h3>

        <p className="text-xs sm:text-sm text-amber-100/90 text-center mt-3 leading-relaxed px-2">
          Apakah kamu ingin mengulang 36 pertanyaan? Hasil rekomendasi sebelumnya akan digantikan setelah kamu menyelesaikan kuisioner kembali.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6 pt-2">
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-[#190E08] hover:bg-[#341A10] border-2 border-[#78350F] text-amber-200 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
          >
            Kembali
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-rose-700 hover:bg-rose-600 text-white font-extrabold text-xs sm:text-sm border-2 border-rose-500 transition-all cursor-pointer shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ya, Ulangi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
