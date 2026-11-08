'use client';

import React, { useState } from 'react';
import { FileDown, Sparkles, Check, AlertCircle } from 'lucide-react';
import { generateResultsPdf, downloadOrSharePdf, getPdfDateString } from '@/lib/pdfGenerator';
import { ProgramScore, FacultyScore, StudyProgram } from '@/data/types';
import { faculties } from '@/data/faculties';
import { retroAudio } from '@/lib/retroAudio';
import { APP_NAME_SHORT } from '@/config/brand';

interface PdfExportButtonProps {
  programScores: ProgramScore[];
  facultyScores: FacultyScore[];
  programs: StudyProgram[];
  userSummary: {
    topRiasec: { code: string; label: string; score: number }[];
    topDomain: { code: string; label: string; score: number };
    topLearning: { code: string; label: string; score: number };
  } | null;
  nickname?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'compact';
  onSuccess?: () => void;
}

export function PdfExportButton({
  programScores,
  facultyScores,
  programs,
  userSummary,
  nickname,
  className = '',
  variant = 'primary',
  onSuccess,
}: PdfExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const showToast = (msg: string, error = false) => {
    setToastMessage(msg);
    setIsError(error);
    setTimeout(() => {
      setToastMessage(null);
      setIsError(false);
    }, 3500);
  };

  const handleExportPdf = async () => {
    if (isGenerating) return;
    retroAudio.playSelect();
    setIsGenerating(true);

    const startTime = Date.now();

    try {
      // Generate multi-page PDF on device
      const blob = await generateResultsPdf({
        nickname,
        programScores,
        facultyScores,
        programs,
        faculties,
        userSummary,
      });

      const fileName = `hasil-${APP_NAME_SHORT.toLowerCase().replace(/\s+/g, '-')}-${getPdfDateString()}.pdf`;
      const result = await downloadOrSharePdf(blob, fileName);

      const elapsed = Date.now() - startTime;
      if (result === 'downloaded' || result === 'shared') {
        showToast(`PDF berhasil dibuat (${(elapsed / 1000).toFixed(1)}s) & tersimpan`);
        onSuccess?.();
      }
    } catch (err) {
      console.error('PDF export failed:', err);
      showToast('Gagal membuat dokumen PDF. Silakan coba lagi.', true);
    } finally {
      setIsGenerating(false);
    }
  };

  // Styling variants
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all cursor-pointer min-h-[44px] touch-manipulation select-none';

  let variantClasses = '';
  if (variant === 'primary') {
    variantClasses =
      'bg-[#190E08] hover:bg-[#2A160E] text-[#FDE68A] hover:text-white border-2 border-[#F59E0B] shadow-[2px_2px_0_0_#000] px-3.5 py-2 text-xs font-pixel';
  } else if (variant === 'secondary') {
    variantClasses =
      'bg-[#24130C] hover:bg-[#341A10] text-amber-200 hover:text-white border border-[#78350F] px-3 py-2 text-xs';
  } else if (variant === 'compact') {
    variantClasses =
      'p-2 bg-[#190E08] hover:bg-[#2A160E] text-[#FDE68A] hover:text-white border border-[#78350F] min-w-[44px]';
  }

  return (
    <>
      <button
        type="button"
        onClick={handleExportPdf}
        disabled={isGenerating}
        className={`${baseClasses} ${variantClasses} ${className} ${
          isGenerating ? 'opacity-70 cursor-wait' : ''
        }`}
        data-testid="btn-unduh-pdf-hasil"
        title="Unduh Laporan Lengkap PDF Hasil Rekomendasi"
        aria-label="Unduh PDF Hasil Rekomendasi"
      >
        {isGenerating ? (
          <>
            <Sparkles className="w-4 h-4 text-[#F59E0B] animate-spin shrink-0" />
            <span className="truncate">Menyusun PDF...</span>
          </>
        ) : (
          <>
            <FileDown className="w-4 h-4 text-[#F59E0B] shrink-0" />
            <span className={variant === 'compact' ? 'hidden sm:inline font-pixel text-xs' : ''}>
              Unduh PDF Hasil
            </span>
          </>
        )}
      </button>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl border-2 font-mono text-xs shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 ${
            isError
              ? 'bg-rose-950 border-rose-500 text-rose-200'
              : 'bg-[#1A0E08] border-[#F59E0B] text-[#FDE68A]'
          }`}
        >
          {isError ? (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
