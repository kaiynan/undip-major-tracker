'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { questions } from '@/data/questions';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { QuestionCard } from '@/components/questionnaire/QuestionCard';
import { QuestionOverviewModal } from '@/components/questionnaire/QuestionOverviewModal';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { retroAudio } from '@/lib/retroAudio';
import { PixelHorseProgressBar } from '@/components/pixel/PixelHorseProgressBar';
import { PixelCalculationTransition } from '@/components/pixel/PixelCalculationTransition';
import { PixelQuestionnaireBackground } from '@/components/pixel/PixelQuestionnaireRunner';
import { RetakeConfirmModal } from '@/components/modals/RetakeConfirmModal';
import { IncompleteQuestionnaireModal } from '@/components/modals/IncompleteQuestionnaireModal';
import {
  ChevronLeft,
  ChevronRight,
  Grid,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Keyboard,
} from 'lucide-react';

const DIMENSION_CONFIG = {
  riasec: {
    name: 'Dimensi A: RIASEC (Minat Umum)',
    weight: '20%',
    range: 'Soal 01–08',
    description: 'Mengukur kecenderungan aktivitas nyata, riset logis, ekspresi seni, sosial, kepemimpinan, dan keteraturan kerja.',
  },
  domain: {
    name: 'Dimensi B: Domain-Specific Interest',
    weight: '35%',
    range: 'Soal 09–20',
    description: 'Mengidentifikasi ketertarikan mendalam pada 12 rumpun bidang keilmuan spesifik di lingkungan UNDIP.',
  },
  learning: {
    name: 'Dimensi C: Learning & Activity Preference',
    weight: '20%',
    range: 'Soal 21–28',
    description: 'Mengukur kecocokan gaya belajar: laboratorium, analisis data, studi lapangan, kolaborasi tim, atau pemecahan masalah praktis.',
  },
  curriculum: {
    name: 'Dimensi D: Curriculum & Competency',
    weight: '25%',
    range: 'Soal 29–36',
    description: 'Mencocokkan ketertarikan dengan kurikulum autentik, keahlian utama, dan profil lulusan program studi UNDIP.',
  },
};

export default function QuestionnairePage() {
  const router = useRouter();
  const {
    answers,
    setAnswer,
    resetAnswers,
    answeredCount,
    totalQuestions,
    isComplete,
    hydrated,
  } = useQuestionnaire();

  // Lazy initialize currentIndex to the first unanswered question from storage if resuming
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const saved = localStorage.getItem('undip_major_matcher_answers');
      if (saved) {
        const parsed = JSON.parse(saved);
        const count = Object.keys(parsed).length;
        if (count > 0 && count < questions.length) {
          const firstUnanswered = questions.findIndex((q) => parsed[q.id] === undefined);
          if (firstUnanswered !== -1) {
            return firstUnanswered;
          }
        }
      }
    } catch {
      // Safe fallback
    }
    return 0;
  });

  const [isOverviewOpen, setIsOverviewOpen] = useState(false);
  const [showIncompleteAlert, setShowIncompleteAlert] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isGallopingAway, setIsGallopingAway] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  // Auto-advance transition lock & timeout refs (Requirements 12 & 13)
  const isAdvancingRef = useRef(false);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const answersRef = useRef(answers);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Jump to first unanswered question ONLY after localStorage is hydrated (Requirement 11)
  const hasResumedRef = useRef(false);
  useEffect(() => {
    if (!hydrated || hasResumedRef.current) return;
    hasResumedRef.current = true;

    const firstUnansweredIndex = questions.findIndex((q) => answers[q.id] === undefined);
    if (firstUnansweredIndex !== -1 && answeredCount > 0 && answeredCount < totalQuestions) {
      const frameId = requestAnimationFrame(() => {
        setCurrentIndex(firstUnansweredIndex);
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, [hydrated, answers, answeredCount, totalQuestions]);

  // Clean up any pending transition timeouts on unmount or question change
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = null;
      }
      isAdvancingRef.current = false;
    };
  }, [currentIndex]);

  const currentQuestion = questions[currentIndex];
  const dimensionInfo = DIMENSION_CONFIG[currentQuestion.dimension];

  // Trigger brief forward movement animation for the horse indicator
  const triggerAdvancing = useCallback(() => {
    setIsAdvancing(true);
    setTimeout(() => {
      setIsAdvancing(false);
    }, 450);
  }, []);

  const handleSelectAnswer = useCallback((value: number) => {
    // Guard: ignore rapid repeated taps while transition/advancing is in progress (Requirement 12)
    if (isAdvancingRef.current || isGallopingAway || isCalculating) return;

    retroAudio.playSelect();
    setAnswer(currentQuestion.id, value);
    setShowIncompleteAlert(false);

    // Compute completion from latest fresh state ref (Requirement 13)
    const currentAnswers = answersRef.current;
    const wasAlreadyComplete = Object.keys(currentAnswers).length >= totalQuestions;
    const nextAnswers = { ...currentAnswers, [currentQuestion.id]: value };
    const willBeComplete = Object.keys(nextAnswers).length >= totalQuestions;

    // If user is editing answers after already completing 36/36, do NOT auto-submit or gallop!
    if (wasAlreadyComplete) {
      return;
    }

    // First-time completion of all 36 questions
    if (willBeComplete) {
      isAdvancingRef.current = true;
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);

      transitionTimeoutRef.current = setTimeout(() => {
        setIsGallopingAway(true);
        try {
          retroAudio.playLevelUp();
        } catch {
          // best-effort audio
        }

        transitionTimeoutRef.current = setTimeout(() => {
          setIsCalculating(true);
        }, 1100);
      }, 400);
    } else if (currentIndex < totalQuestions - 1) {
      // Auto advance to next question smoothly with forward gallop transition
      isAdvancingRef.current = true;
      triggerAdvancing();

      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
        isAdvancingRef.current = false;
      }, 220);
    }
  }, [currentQuestion.id, currentIndex, totalQuestions, setAnswer, triggerAdvancing, isGallopingAway, isCalculating]);

  const handlePrev = useCallback(() => {
    if (isAdvancingRef.current || isGallopingAway || isCalculating) return;
    if (currentIndex > 0) {
      // Do NOT trigger forward running animation on backwards navigation
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, isGallopingAway, isCalculating]);

  const handleNext = useCallback(() => {
    if (isAdvancingRef.current || isGallopingAway || isCalculating) return;
    if (currentIndex < totalQuestions - 1) {
      isAdvancingRef.current = true;
      triggerAdvancing();
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1));
        isAdvancingRef.current = false;
      }, 150);
    }
  }, [currentIndex, totalQuestions, triggerAdvancing, isGallopingAway, isCalculating]);

  const handleSubmit = useCallback(() => {
    if (isGallopingAway || isCalculating) return;

    if (!isComplete) {
      setShowIncompleteAlert(true);
      const firstUnansweredIndex = questions.findIndex((q) => answers[q.id] === undefined);
      if (firstUnansweredIndex !== -1) {
        setCurrentIndex(firstUnansweredIndex);
      }
      return;
    }

    // Trigger Stage 1 & 2: Horse Gallops Away to the Right
    setIsGallopingAway(true);
    try {
      retroAudio.playLevelUp();
    } catch {
      // best-effort
    }

    // Trigger Stage 3: Calculation transition overlay
    setTimeout(() => {
      setIsCalculating(true);
    }, 1100);
  }, [isComplete, answers, isGallopingAway, isCalculating]);

  // Keyboard navigation support on desktop (1-5, Left, Right)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOverviewOpen || showResetModal || isGallopingAway || isCalculating) return;
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) return;

      if (e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        handleSelectAnswer(parseInt(e.key, 10));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Enter' && isComplete) {
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOverviewOpen, showResetModal, handleSelectAnswer, handlePrev, handleNext, handleSubmit, isComplete, isGallopingAway, isCalculating]);

  const unansweredQuestions = questions.filter((q) => answers[q.id] === undefined);

  return (
    <div className="relative min-h-screen pb-24 pt-4 sm:pt-6 text-slate-100 bg-[#140B07] border-t-2 border-[#78350F] overflow-x-hidden">
      {/* Continuous Side-Scrolling Golden-Hour Parallax Background */}
      <PixelQuestionnaireBackground isAdvancing={isAdvancing} />

      <div className="relative z-10 max-w-4xl mx-auto px-3 sm:px-6">
        {/* Top Header Card */}
        <div className="bg-[#24130C] rounded-2xl sm:rounded-3xl p-4 sm:p-7 border-2 border-[#78350F] shadow-[0_4px_20px_rgba(0,0,0,0.5)] mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] sm:text-xs font-bold text-[#FDE68A] bg-[#78350F] border border-[#F59E0B] px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full uppercase tracking-wider">
                  Kuisioner Minat 36 Pertanyaan
                </span>
              </div>
              <h1 className="text-lg sm:text-2xl font-black text-[#FFFBEB] mt-1.5 sm:mt-2">
                Kenali Karakteristik & Minat Studimu
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsOverviewOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#FDE68A] bg-[#190E08] hover:bg-[#341A10] border border-[#78350F] rounded-xl transition-all cursor-pointer min-h-[44px]"
                title="Buka peta semua soal (Overview)"
                aria-label={`Buka Peta Soal Overview (${answeredCount}/${totalQuestions} Terisi)`}
              >
                <Grid className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span className="hidden xs:inline">Peta Soal</span>
                <span className="xs:hidden">Overview</span>
                <span>({answeredCount}/{totalQuestions})</span>
              </button>
              <button
                onClick={() => setShowResetModal(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-950/80 bg-rose-950/40 border border-rose-800/60 rounded-xl transition-all cursor-pointer min-h-[44px]"
                title="Reset semua jawaban"
                aria-label="Reset semua jawaban kuisioner"
              >
                <RotateCcw className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="text-xs">Reset</span>
              </button>
            </div>
          </div>

          {/* Dimension Selector Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#78350F]/60 text-xs">
            <button
              onClick={() => setCurrentIndex(0)}
              aria-label="Pindah ke Dimensi 1: RIASEC (Soal 01-08)"
              className={`p-3 rounded-xl text-left transition-all cursor-pointer border min-h-[44px] ${
                currentQuestion.dimension === 'riasec'
                  ? 'bg-[#78350F] border-[#F59E0B] text-[#FFFBEB] font-bold shadow-xs'
                  : 'bg-[#190E08]/80 hover:bg-[#2A150D] text-amber-200/90 border-[#78350F]/50 font-medium'
              }`}
            >
              <div className="font-bold truncate text-xs text-[#FFFBEB]">1. RIASEC</div>
              <div className="text-xs text-amber-200/80 mt-0.5">Soal 01–08 • 20%</div>
            </button>
            <button
              onClick={() => setCurrentIndex(8)}
              aria-label="Pindah ke Dimensi 2: Bidang Ilmu (Soal 09-20)"
              className={`p-3 rounded-xl text-left transition-all cursor-pointer border min-h-[44px] ${
                currentQuestion.dimension === 'domain'
                  ? 'bg-[#78350F] border-[#F59E0B] text-[#FFFBEB] font-bold shadow-xs'
                  : 'bg-[#190E08]/80 hover:bg-[#2A150D] text-amber-200/90 border-[#78350F]/50 font-medium'
              }`}
            >
              <div className="font-bold truncate text-xs text-[#FFFBEB]">2. Bidang Ilmu</div>
              <div className="text-xs text-amber-200/80 mt-0.5">Soal 09–20 • 35%</div>
            </button>
            <button
              onClick={() => setCurrentIndex(20)}
              aria-label="Pindah ke Dimensi 3: Gaya Belajar (Soal 21-28)"
              className={`p-3 rounded-xl text-left transition-all cursor-pointer border min-h-[44px] ${
                currentQuestion.dimension === 'learning'
                  ? 'bg-[#78350F] border-[#F59E0B] text-[#FFFBEB] font-bold shadow-xs'
                  : 'bg-[#190E08]/80 hover:bg-[#2A150D] text-amber-200/90 border-[#78350F]/50 font-medium'
              }`}
            >
              <div className="font-bold truncate text-xs text-[#FFFBEB]">3. Gaya Belajar</div>
              <div className="text-xs text-amber-200/80 mt-0.5">Soal 21–28 • 20%</div>
            </button>
            <button
              onClick={() => setCurrentIndex(28)}
              aria-label="Pindah ke Dimensi 4: Kurikulum (Soal 29-36)"
              className={`p-3 rounded-xl text-left transition-all cursor-pointer border min-h-[44px] ${
                currentQuestion.dimension === 'curriculum'
                  ? 'bg-[#78350F] border-[#F59E0B] text-[#FFFBEB] font-bold shadow-xs'
                  : 'bg-[#190E08]/80 hover:bg-[#2A150D] text-amber-200/90 border-[#78350F]/50 font-medium'
              }`}
            >
              <div className="font-bold truncate text-xs text-[#FFFBEB]">4. Kurikulum</div>
              <div className="text-xs text-amber-200/80 mt-0.5">Soal 29–36 • 25%</div>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* NEW REQUIREMENT 1: HORSE STATUE ANIMATED PROGRESS BAR           */}
        {/* ============================================================== */}
        <PixelHorseProgressBar
          answeredCount={answeredCount}
          totalQuestions={totalQuestions}
          isAdvancing={isAdvancing}
          isGallopingAway={isGallopingAway}
        />

        {/* Dimension Description Notice */}
        <div className="mb-4 bg-[#24130C] rounded-2xl border border-[#78350F] px-4 py-3 text-xs text-amber-100/90 flex items-start gap-2.5 shadow-2xs">
          <HelpCircle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong className="text-[#FDE68A] font-bold">{dimensionInfo.name} ({dimensionInfo.range}):</strong>{' '}
            {dimensionInfo.description}
          </span>
        </div>

        {/* Incomplete Submission Alert */}
        {showIncompleteAlert && (
          <div className="mb-6 p-4 bg-[#381111] border-2 border-rose-500 rounded-2xl text-rose-100 text-sm flex items-start gap-3 shadow-md">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-rose-200">
                Masih Ada {unansweredQuestions.length} Pertanyaan yang Belum Terjawab!
              </h4>
              <p className="text-xs text-rose-200/80 mt-0.5 leading-relaxed">
                Algoritma HMIM membutuhkan seluruh 36 pertanyaan dijawab agar hasil pencocokan minat
                dan peringkat program studi akurat. Kamu diarahkan langsung ke pertanyaan pertama yang
                belum terisi.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {unansweredQuestions.slice(0, 10).map((uq) => (
                  <button
                    key={uq.id}
                    onClick={() => {
                      const idx = questions.findIndex((q) => q.id === uq.id);
                      if (idx !== -1) setCurrentIndex(idx);
                    }}
                    className="px-2.5 py-1 bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-600 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Nomor {String(uq.id).padStart(2, '0')}
                  </button>
                ))}
                {unansweredQuestions.length > 10 && (
                  <span className="text-xs text-rose-300 font-medium self-center">
                    +{unansweredQuestions.length - 10} lainnya
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Stationary High-Contrast Question Card */}
        <div key={currentQuestion.id} className="transition-opacity duration-200">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={totalQuestions}
            currentValue={answers[currentQuestion.id]}
            onSelect={handleSelectAnswer}
            dimensionName={dimensionInfo.name}
            dimensionWeight={dimensionInfo.weight}
          />
        </div>

        {/* Navigation Controls Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0 || isGallopingAway}
              aria-label="Kembali ke pertanyaan sebelumnya"
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border-2 transition-all cursor-pointer min-h-[44px] ${
                currentIndex === 0 || isGallopingAway
                  ? 'border-[#3D1F13] text-stone-600 bg-[#1F100A] cursor-not-allowed'
                  : 'border-[#78350F] text-[#FDE68A] bg-[#24130C] hover:bg-[#341A10] hover:border-[#F59E0B] shadow-xs'
              }`}
            >
              <ChevronLeft className="w-4 h-4 text-[#F59E0B]" />
              <span>Sebelumnya</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === totalQuestions - 1 || isGallopingAway}
              aria-label="Lanjut ke pertanyaan selanjutnya"
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold border-2 transition-all cursor-pointer min-h-[44px] ${
                currentIndex === totalQuestions - 1 || isGallopingAway
                  ? 'border-[#3D1F13] text-stone-600 bg-[#1F100A] cursor-not-allowed'
                  : 'border-[#78350F] text-[#FDE68A] bg-[#24130C] hover:bg-[#341A10] hover:border-[#F59E0B] shadow-xs'
              }`}
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4 text-[#F59E0B]" />
            </button>
          </div>

          <div className="w-full sm:w-auto">
            {isComplete ? (
              <button
                onClick={handleSubmit}
                disabled={isGallopingAway}
                aria-label="Lihat hasil rekomendasi program studi (seluruh 36 pertanyaan telah terisi)"
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#059669] hover:bg-[#047857] text-white font-extrabold px-7 py-3.5 rounded-2xl shadow-md hover:shadow-lg border-2 border-[#6EE7B7] transition-all text-sm cursor-pointer disabled:opacity-75 min-h-[44px]"
              >
                <CheckCircle2 className="w-4 h-4 text-[#6EE7B7]" />
                <span>Lihat Hasil Rekomendasi (36/36 Terisi)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                aria-label={`Hitung rekomendasi program studi (${answeredCount} dari ${totalQuestions} pertanyaan terisi)`}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#9A3412] hover:bg-[#C2410C] text-white font-bold px-7 py-3.5 rounded-2xl shadow-xs border-2 border-[#F59E0B] transition-all text-sm cursor-pointer min-h-[44px]"
              >
                <span>Hitung Rekomendasi</span>
                <span className="text-xs bg-black/25 px-2.5 py-0.5 rounded-full font-bold text-[#FDE68A]">
                  {answeredCount}/{totalQuestions}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Keyboard Hints Bar on Desktop */}
        <div className="hidden sm:flex items-center justify-center gap-4 mt-6 text-xs text-amber-200/60">
          <span className="inline-flex items-center gap-1 text-amber-300">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Pintasan Keyboard:</span>
          </span>
          <span><kbd className="px-1.5 py-0.5 bg-[#190E08] border border-[#78350F] rounded font-mono text-[10px] text-[#FDE68A]">1</kbd>–<kbd className="px-1.5 py-0.5 bg-[#190E08] border border-[#78350F] rounded font-mono text-[10px] text-[#FDE68A]">5</kbd> untuk memilih</span>
          <span><kbd className="px-1.5 py-0.5 bg-[#190E08] border border-[#78350F] rounded font-mono text-[10px] text-[#FDE68A]">←</kbd> / <kbd className="px-1.5 py-0.5 bg-[#190E08] border border-[#78350F] rounded font-mono text-[10px] text-[#FDE68A]">→</kbd> navigasi soal</span>
          <span><kbd className="px-1.5 py-0.5 bg-[#190E08] border border-[#78350F] rounded font-mono text-[10px] text-[#FDE68A]">Enter</kbd> hitung hasil</span>
        </div>

        {/* Disclaimer Banner */}
        <div className="mt-8">
          <DisclaimerBanner compact />
        </div>
      </div>

      {/* Question Overview Modal */}
      <QuestionOverviewModal
        isOpen={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        questions={questions}
        answers={answers}
        currentQuestionId={currentQuestion.id}
        onSelectQuestion={(id) => {
          const idx = questions.findIndex((q) => q.id === id);
          if (idx !== -1) setCurrentIndex(idx);
        }}
      />

      {/* Reset Confirmation Modal */}
      <RetakeConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={() => {
          resetAnswers();
          setCurrentIndex(0);
          setShowResetModal(false);
        }}
      />

      {/* Incomplete Questionnaire Alert Modal */}
      <IncompleteQuestionnaireModal
        isOpen={showIncompleteAlert}
        onClose={() => setShowIncompleteAlert(false)}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
      />

      {/* Stage 3 Calculation Transition Screen */}
      {isCalculating && (
        <PixelCalculationTransition
          onComplete={() => {
            router.push('/results');
          }}
        />
      )}
    </div>
  );
}
