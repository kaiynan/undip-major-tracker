'use client';

import React from 'react';
import { Question, UserAnswers } from '@/data/types';
import { X, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

interface QuestionOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  answers: UserAnswers;
  currentQuestionId: number;
  onSelectQuestion: (questionId: number) => void;
}

export function QuestionOverviewModal({
  isOpen,
  onClose,
  questions,
  answers,
  currentQuestionId,
  onSelectQuestion,
}: QuestionOverviewModalProps) {
  // Group by dimension
  const dimensionGroups = [
    {
      name: 'Dimensi A: RIASEC (Minat Umum)',
      dimension: 'riasec',
      weight: '20%',
      items: questions.filter((q) => q.dimension === 'riasec'),
    },
    {
      name: 'Dimensi B: Domain-Specific (Bidang Keilmuan)',
      dimension: 'domain',
      weight: '35%',
      items: questions.filter((q) => q.dimension === 'domain'),
    },
    {
      name: 'Dimensi C: Learning Preference (Gaya Belajar)',
      dimension: 'learning',
      weight: '20%',
      items: questions.filter((q) => q.dimension === 'learning'),
    },
    {
      name: 'Dimensi D: Curriculum & Competency (Karakteristik Prodi)',
      dimension: 'curriculum',
      weight: '25%',
      items: questions.filter((q) => q.dimension === 'curriculum'),
    },
  ];

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="overview-modal-title"
      maxWidth="max-w-2xl"
      className="max-h-[85vh] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#78350F]/70 flex items-center justify-between bg-[#190E08]">
        <div>
          <h3 id="overview-modal-title" className="font-extrabold text-[#FFFBEB] text-base">
            Peta 36 Pertanyaan Kuisioner
          </h3>
          <p className="text-xs text-amber-200/80 mt-0.5">
            {answeredCount} dari {totalCount} pertanyaan telah dijawab ({Math.round((answeredCount / totalCount) * 100)}%)
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-amber-200/70 hover:text-white hover:bg-[#341A10] transition-colors cursor-pointer"
          aria-label="Tutup ikhtisar pertanyaan"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 overflow-y-auto space-y-6">
        {dimensionGroups.map((group) => (
          <div key={group.dimension} className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-[#FDE68A] pb-1.5 border-b border-[#78350F]/60">
              <span>{group.name}</span>
              <span className="text-[11px] text-amber-200/70 font-medium">Bobot {group.weight}</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {group.items.map((q) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = q.id === currentQuestionId;
                const value = answers[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      onSelectQuestion(q.id);
                      onClose();
                    }}
                    aria-label={`Pertanyaan #${q.id}${isAnswered ? `, telah dijawab: ${value}` : ', belum dijawab'}`}
                    className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-[#F59E0B] bg-[#78350F] text-[#FFFBEB] border border-[#F59E0B]'
                        : isAnswered
                        ? 'bg-[#190E08] hover:bg-[#341A10] text-[#FDE68A] border border-[#78350F]'
                        : 'bg-[#1F100A] border border-dashed border-[#78350F]/60 text-stone-500 hover:border-[#F59E0B]/60'
                    }`}
                  >
                    <span>#{String(q.id).padStart(2, '0')}</span>
                    {isAnswered && (
                      <span className="text-[10px] text-[#F59E0B] font-extrabold flex items-center gap-0.5 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        <span>{value}</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#78350F]/70 bg-[#190E08] flex items-center justify-between text-xs text-amber-200/70">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            <span>Terjawab</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-dashed border-[#78350F]" />
            <span>Belum Terjawab</span>
          </span>
        </div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-[#78350F] hover:bg-[#92400E] border border-[#F59E0B] text-[#FFFBEB] rounded-xl font-bold text-xs transition-colors cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </Modal>
  );
}
