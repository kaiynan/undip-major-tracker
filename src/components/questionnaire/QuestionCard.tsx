'use client';

import React from 'react';
import { Question } from '@/data/types';
import { Check, Sparkles } from 'lucide-react';
import { retroAudio } from '@/lib/retroAudio';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  currentValue?: number; // 1-5
  onSelect: (value: number) => void;
  dimensionName: string;
  dimensionWeight: string;
}

const DIMENSION_MICROCOPY: Record<string, string> = {
  riasec: 'Mengenali apa yang secara alami memicu rasa ingin tahu dan energi kreatifmu.',
  domain: 'Menelusuri rumpun keilmuan dan topik spesifik yang paling menarik perhatianmu.',
  learning: 'Menemukan metode belajar dan cara kerja yang paling nyaman untuk potensimu.',
  curriculum: 'Membayangkan materi kuliah dan kompetensi masa depan yang ingin kamu kuasai.',
};

const LIKERT_OPTIONS = [
  {
    value: 1,
    label: 'Sangat Tidak Tertarik',
    desc: 'Sangat tidak sesuai dengan minat dan karakter saya',
    shortcut: '1',
  },
  {
    value: 2,
    label: 'Tidak Tertarik',
    desc: 'Tidak menarik perhatian atau rasa penasaran saya',
    shortcut: '2',
  },
  {
    value: 3,
    label: 'Netral',
    desc: 'Biasa saja, seimbang, atau belum dapat menentukan',
    shortcut: '3',
  },
  {
    value: 4,
    label: 'Tertarik',
    desc: 'Menyenangkan dan ingin saya pelajari lebih lanjut',
    shortcut: '4',
  },
  {
    value: 5,
    label: 'Sangat Tertarik',
    desc: 'Sangat menarik dan sesuai dengan passion saya',
    shortcut: '5',
  },
];

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  currentValue,
  onSelect,
  dimensionName,
  dimensionWeight,
}: QuestionCardProps) {
  const microcopy = DIMENSION_MICROCOPY[question.dimension] || 'Jawab sesuai kecenderungan alami dirimu tanpa rasa tertekan.';

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(10);
      } catch {}
    }
  };

  return (
    <div className="bg-[#24130C] rounded-2xl sm:rounded-3xl border-2 border-[#78350F] shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-4 sm:p-8 md:p-10 transition-all">
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 sm:pb-5 border-b border-[#78350F]/60">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FDE68A] bg-[#78350F] border border-[#F59E0B] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg">
            {dimensionName}
          </span>
          <span className="text-[11px] sm:text-xs font-semibold text-amber-200/80 bg-[#190E08] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-[#78350F]/60">
            Bobot {dimensionWeight}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-amber-200/90">
          <span className="bg-[#190E08] border border-[#78350F]/60 px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-mono">
            Pertanyaan {String(questionNumber).padStart(2, '0')}/{String(totalQuestions).padStart(2, '0')}
          </span>
          {currentValue !== undefined && (
            <span className="inline-flex items-center gap-1 text-emerald-300 font-bold bg-emerald-950/80 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-emerald-600/70 text-[11px] sm:text-xs">
              <Check className="w-3 sm:w-3.5 h-3 sm:h-3.5 stroke-[3]" />
              <span>Terpilih</span>
            </span>
          )}
        </div>
      </div>

      {/* Encouraging Editorial Microcopy */}
      <div className="pt-3 sm:pt-4 pb-2 flex items-center gap-2 text-[11px] sm:text-xs font-medium text-amber-200/80">
        <Sparkles className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
        <span>{microcopy}</span>
      </div>

      {/* Question Headline */}
      <h2 className="text-base sm:text-2xl md:text-3xl font-extrabold text-[#FFFBEB] leading-snug tracking-tight mt-2 mb-4 sm:mb-8">
        {question.text}
      </h2>

      {/* 1-5 Likert Options — Equal Visual Importance Across All Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-amber-200/70 mb-1">
          <span>Tingkat ketertarikan (Skala 1–5):</span>
          <span className="hidden sm:inline text-[11px] text-amber-200/60 font-normal">
            Gunakan tombol <kbd className="px-1.5 py-0.5 bg-[#190E08] border border-[#78350F] rounded text-[#FDE68A] font-mono text-[10px]">1</kbd>–<kbd className="px-1.5 py-0.5 bg-[#190E08] border border-[#78350F] rounded text-[#FDE68A] font-mono text-[10px]">5</kbd> di keyboard
          </span>
          <span className="sm:hidden text-[10px] text-amber-300/80 font-mono flex items-center gap-1">
            <span>Ketuk Skala</span>
            <span className="bg-[#190E08] border border-[#78350F] px-1.5 py-0.2 rounded text-[#FDE68A]">1–5</span>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
          {LIKERT_OPTIONS.map((opt) => {
            const isSelected = currentValue === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  triggerHaptic();
                  retroAudio.playSelect();
                  onSelect(opt.value);
                }}
                onMouseEnter={() => retroAudio.playBlip(500)}
                onTouchStart={() => triggerHaptic()}
                aria-label={`Pilih skala ${opt.value}: ${opt.label} — ${opt.desc}`}
                className={`w-full flex items-center justify-between p-3 sm:p-4.5 rounded-2xl border-2 text-left transition-all duration-150 cursor-pointer group min-h-[52px] sm:min-h-[60px] ${
                  isSelected
                    ? 'border-[#F59E0B] bg-[#78350F] text-white shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-2 ring-[#F59E0B]/30'
                    : 'border-[#78350F]/60 bg-[#1F100A] text-amber-100/90 hover:border-[#F59E0B] hover:bg-[#2C160E]'
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                  {/* Number Circle Badge — Identical styling for all options */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#F59E0B] text-[#190E08] font-black ring-2 ring-[#FDE68A]'
                        : 'bg-[#190E08] text-amber-300 border border-[#78350F] group-hover:bg-[#28140B]'
                    }`}
                  >
                    {opt.value}
                  </div>

                  <div className="flex-1 min-w-0 pr-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs sm:text-base font-bold truncate sm:whitespace-normal ${isSelected ? 'text-[#FFFBEB]' : 'text-amber-100'}`}>
                        {opt.label}
                      </span>
                    </div>
                    {/* Description is now cleanly displayed on HP as well as desktop (Requirement 14) */}
                    <p className={`text-xs mt-0.5 block leading-tight ${isSelected ? 'text-amber-100' : 'text-amber-200/90'}`}>
                      {opt.desc}
                    </p>
                  </div>
                </div>

                {/* Right Indicator: Shortcut + Checkmark Circle */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-2 sm:ml-3">
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${isSelected ? 'bg-[#190E08]/60 text-[#FDE68A] border border-[#F59E0B]/50' : 'bg-[#190E08] text-amber-200/80 border border-[#78350F]/40'}`}>
                    <span className="sm:hidden">#{opt.value}</span>
                    <span className="hidden sm:inline">[{opt.shortcut}]</span>
                  </span>

                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all shrink-0 ${
                      isSelected
                        ? 'bg-[#F59E0B] text-[#190E08] shadow-xs'
                        : 'border-2 border-[#78350F] group-hover:border-[#F59E0B]/60'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
