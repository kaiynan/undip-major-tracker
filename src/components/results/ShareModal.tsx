'use client';

import React, { useState, useRef } from 'react';
import { ProgramScore, FacultyScore } from '@/data/types';
import { StudyProgram } from '@/data/types';
import { faculties } from '@/data/faculties';
import { X, Copy, Check, Share2, MessageCircle, AlertCircle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  programScores: ProgramScore[];
  facultyScores: FacultyScore[];
  programs: StudyProgram[];
  userSummary: {
    topRiasec: { code: string; label: string; score: number }[];
    topDomain: { code: string; label: string; score: number };
    topLearning: { code: string; label: string; score: number };
  } | null;
}

export function ShareModal({
  isOpen,
  onClose,
  programScores,
  facultyScores,
  programs,
  userSummary,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Safely extract up to 3 programs without producing 'Tier undefined'
  const topPrograms = (programScores || []).slice(0, 3).map((score) => {
    const prog = programs.find((p) => p.id === score.programId);
    return {
      name: prog?.name || score.programId,
      score: score.totalScore ?? 0,
      tier: score.tier || 'D',
    };
  });

  const topFaculty = facultyScores && facultyScores.length > 0 ? facultyScores[0] : null;
  const facultyData = topFaculty ? faculties.find((f) => f.id === topFaculty.facultyId) : null;

  const programListText =
    topPrograms.length > 0
      ? topPrograms
          .map((p, idx) => `${idx + 1}. ${p.name} (Tier ${p.tier} — ${p.score}%)`)
          .join('\n')
      : '- Belum ada data program studi -';

  const facultyText = topFaculty
    ? `${facultyData?.name || topFaculty.facultyId} (Tier ${topFaculty.tier || 'D'} — ${topFaculty.aggregateScore ?? 0}%)`
    : '- Belum ada data fakultas -';

  const summaryText = `Hasil Rekomendasi UNDIP Major Matcher
Roadshow Sedulur Serang Diponegoro 2027

Top Program Studi Paling Cocok:
${programListText}

Fakultas Paling Sesuai:
${facultyText}

Tipe Minat: ${userSummary?.topRiasec && userSummary.topRiasec.length > 0 ? userSummary.topRiasec.map((r) => r.code).join('/') : '-'}
Bidang Utama: ${userSummary?.topDomain?.label || '-'}
Gaya Belajar: ${userSummary?.topLearning?.label || '-'}

Temukan jurusan masa depanmu di Universitas Diponegoro melalui UNDIP Major Matcher!`;

  const handleCopy = async () => {
    setCopyError(false);
    let succeeded = false;

    // 1. Try modern navigator.clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(summaryText);
        succeeded = true;
      } catch {
        succeeded = false;
      }
    }

    // 2. Fallback to execCommand('copy') via textarea
    if (!succeeded && textAreaRef.current) {
      try {
        textAreaRef.current.select();
        textAreaRef.current.setSelectionRange(0, 99999);
        succeeded = document.execCommand('copy');
      } catch {
        succeeded = false;
      }
    }

    if (succeeded) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      // 3. Highlight text and warn user to copy manually
      if (textAreaRef.current) {
        textAreaRef.current.select();
      }
      setCopyError(true);
      setTimeout(() => setCopyError(false), 4000);
    }
  };

  const shareViaWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="share-modal-title"
      maxWidth="max-w-md"
      className="p-6 sm:p-7"
    >
      <div className="flex items-center justify-between pb-3 border-b border-[#78350F]/70">
        <div className="flex items-center gap-2.5 text-[#FFFBEB] font-pixel text-xs sm:text-sm">
          <Share2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span id="share-modal-title">Bagikan Hasil Rekomendasi</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-amber-200/70 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer"
          title="Tutup"
          aria-label="Tutup dialog bagikan hasil"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-amber-100/90 my-3 leading-relaxed">
        Salin ringkasan hasil eksplorasi minatmu untuk berdiskusi bersama orang tua, guru BK,
        atau sahabatmu:
      </p>

      {/* Text preview / selectable fallback */}
      <div className="relative">
        <textarea
          ref={textAreaRef}
          readOnly
          value={summaryText}
          aria-label="Ringkasan teks hasil rekomendasi"
          className="w-full bg-[#190E08] p-3 sm:p-4 rounded-2xl border-2 border-[#78350F] font-mono text-[11px] sm:text-xs text-amber-100/90 leading-relaxed resize-none h-48 focus:outline-hidden focus:border-amber-400 shadow-inner select-all"
        />
      </div>

      {copyError && (
        <div className="mt-2.5 p-2 rounded-xl bg-rose-950/80 border border-rose-500/80 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>Gagal menyalin otomatis. Teks telah dipilih, silakan tekan Ctrl+C / Salin.</span>
        </div>
      )}

      {/* Share buttons */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={handleCopy}
          aria-label="Salin teks ringkasan ke papan klip"
          className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold border-2 transition-all cursor-pointer min-h-[44px] ${
            copied
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-[#190E08] hover:bg-[#341A10] border-[#78350F] text-amber-200 hover:text-white'
          }`}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
        </button>

        <button
          onClick={shareViaWhatsApp}
          aria-label="Bagikan hasil melalui WhatsApp"
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba5a] text-stone-950 font-black border-2 border-emerald-400 shadow-[2px_2px_0_0_#000] transition-colors cursor-pointer min-h-[44px]"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Kirim WhatsApp</span>
        </button>
      </div>
    </Modal>
  );
}
