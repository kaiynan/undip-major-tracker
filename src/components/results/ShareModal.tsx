'use client';

import React, { useState } from 'react';
import { ProgramScore, FacultyScore } from '@/data/types';
import { StudyProgram } from '@/data/types';
import { faculties } from '@/data/faculties';
import { X, Copy, Check, Share2, MessageCircle, Sparkles } from 'lucide-react';

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

  if (!isOpen) return null;

  const top3Programs = programScores.slice(0, 3).map((score) => {
    const prog = programs.find((p) => p.id === score.programId);
    return { name: prog?.name || score.programId, score: score.totalScore, tier: score.tier };
  });

  const topFaculty = facultyScores[0];
  const facultyData = faculties.find((f) => f.id === topFaculty?.facultyId);

  const summaryText = `Hasil Rekomendasi UNDIP Major Matcher

Top 3 Program Studi Paling Cocok:
1. ${top3Programs[0]?.name || '-'} (Tier ${top3Programs[0]?.tier} — ${top3Programs[0]?.score}%)
2. ${top3Programs[1]?.name || '-'} (Tier ${top3Programs[1]?.tier} — ${top3Programs[1]?.score}%)
3. ${top3Programs[2]?.name || '-'} (Tier ${top3Programs[2]?.tier} — ${top3Programs[2]?.score}%)

Fakultas Paling Sesuai:
${facultyData?.name || '-'} (Tier ${topFaculty?.tier} — ${topFaculty?.aggregateScore}%)

Tipe Minat: ${userSummary?.topRiasec.map((r) => r.code).join('/') || '-'}
Bidang Utama: ${userSummary?.topDomain.label || '-'}
Gaya Belajar: ${userSummary?.topLearning.label || '-'}

Temukan jurusan masa depanmu di Universitas Diponegoro melalui UNDIP Major Matcher!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const shareViaWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs overscroll-contain animate-in fade-in duration-150"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div className="bg-[#24130C] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.85)] border-2 border-[#78350F] text-white">
        <div className="flex items-center justify-between pb-3 border-b border-[#78350F]/70">
          <div className="flex items-center gap-2.5 text-[#FFFBEB] font-pixel text-sm">
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Bagikan Hasil Rekomendasi</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200/70 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-amber-100/90 my-3 leading-relaxed">
          Salin ringkasan hasil eksplorasi minatmu untuk berdiskusi bersama orang tua, guru BK,
          atau sahabatmu:
        </p>

        {/* Text preview */}
        <div className="bg-[#190E08] p-4 rounded-2xl border-2 border-[#78350F] font-mono text-[11px] text-amber-100/90 leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto shadow-inner">
          {summaryText}
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3 mt-5">
          <button
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold border-2 transition-all cursor-pointer ${
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
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba5a] text-stone-950 font-black border-2 border-emerald-400 shadow-[2px_2px_0_0_#000] transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
