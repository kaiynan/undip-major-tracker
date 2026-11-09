'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { studyPrograms } from '@/data/programs';
import { faculties } from '@/data/faculties';
import { AllMajorTierList } from '@/components/results/AllMajorTierList';
import { FacultyTierList } from '@/components/results/FacultyTierList';
import { ProgramComparisonModal } from '@/components/results/ProgramComparisonModal';
import { ShareModal } from '@/components/results/ShareModal';
import { PdfExportButton } from '@/components/results/PdfExportButton';
import { IncompleteQuestionnaireModal } from '@/components/modals/IncompleteQuestionnaireModal';
import { RetakeConfirmModal } from '@/components/modals/RetakeConfirmModal';
import { DisclaimerBanner } from '@/components/ui/DisclaimerBanner';
import { SeradipContactButton } from '@/components/ui/SeradipContactButton';
import { APP_NAME } from '@/config/brand';
import { TierBadge } from '@/components/ui/TierBadge';
import { ScoreBar } from '@/components/ui/ScoreBar';
import { FullScreenCampusMap } from '@/components/pixel/FullScreenCampusMap';
import { retroAudio } from '@/lib/retroAudio';
import { detectInterestSpread } from '@/lib/interestSpread';
import { InterestSpreadBanner } from '@/components/results/InterestSpreadBanner';
import {
  Trophy,
  RotateCcw,
  Share2,
  AlertCircle,
  Building2,
  GraduationCap,
  ArrowRight,
  BarChart3,
  MapPin,
  Maximize2,
  Minimize2,
  Layers,
  ChevronRight,
  Volume2,
  VolumeX,
  Sparkles,
  Scale,
} from 'lucide-react';

type SheetPosition = 'collapsed' | 'half' | 'expanded';

export default function ResultsPage() {
  const router = useRouter();
  const {
    programScores,
    facultyScores,
    dimensionScores,
    userSummary,
    answeredCount,
    totalQuestions,
    isComplete,
    resetAnswers,
    comparisonIds,
    toggleComparison,
    clearComparison,
    getScoreForProgram,
  } = useQuestionnaire();

  // Floating panel visibility toggle ("Peta Penuh" mode)
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Active view tab: Output 1 (all majors) vs Output 2 (faculties)
  const [activeTab, setActiveTab] = useState<'all-majors' | 'faculties'>('all-majors');

  // Selected faculty for camera centering and cross-filtering between Map and Tier Lists
  const [selectedFacultyId, setSelectedFacultyId] = useState<string | null>(null);

  // Detect spread interests when top scores are closely grouped (Prompt G Round 9)
  const interestSpread = React.useMemo(() => {
    return detectInterestSpread(programScores);
  }, [programScores]);

  const top3ProgramNames = React.useMemo(() => {
    return (programScores || []).slice(0, 3).map((ps) => {
      const prog = studyPrograms.find((p) => p.id === ps.programId);
      return prog?.name || ps.programId;
    });
  }, [programScores]);

  // Client-side redirect for legacy ?tab=next-steps and #langkah-selanjutnya
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('tab') === 'next-steps' || window.location.hash === '#langkah-selanjutnya') {
        router.replace('/langkah-selanjutnya');
      }
    }
  }, [router]);

  React.useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#langkah-selanjutnya') {
        router.replace('/langkah-selanjutnya');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [router]);

  // Bottom Sheet 3-position snap state: 'collapsed' | 'half' | 'expanded'
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>('half');
  const [isDraggingSheet, setIsDraggingSheet] = useState(false);
  const dragStartYRef = useRef(0);
  const dragStartPosRef = useRef<SheetPosition>('half');

  // Initial state modal (when answeredCount === 0 or incomplete; bypassed if viewing next-steps guide)
  const [isIncompleteModalOpen, setIsIncompleteModalOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('tab') === 'next-steps' || window.location.hash === '#langkah-selanjutnya') {
        return false;
      }
    }
    return true;
  });

  // Retake confirmation modal state
  const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);

  // Modals state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [showDimensionChart, setShowDimensionChart] = useState(false);

  // Retro sound toggle state
  const [isMuted, setIsMuted] = useState(() => (typeof window !== 'undefined' ? retroAudio.isMuted() : false));

  const handleToggleSound = () => {
    const nextMuted = retroAudio.toggleMute();
    setIsMuted(nextMuted);
    if (!nextMuted) {
      retroAudio.playBlip(600);
    }
  };

  // Drag handle pointer event handlers for 3-position snapping
  const handleSheetPointerDown = (e: React.PointerEvent) => {
    setIsDraggingSheet(true);
    dragStartYRef.current = e.clientY;
    dragStartPosRef.current = sheetPosition;
    try {
      (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
    } catch {}
  };

  const handleSheetPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingSheet) return;
    setIsDraggingSheet(false);
    try {
      (e.target as HTMLElement)?.releasePointerCapture?.(e.pointerId);
    } catch {}

    const deltaY = e.clientY - dragStartYRef.current;
    const threshold = 35; // px

    if (deltaY < -threshold) {
      // Dragged UP
      if (dragStartPosRef.current === 'collapsed') {
        setSheetPosition('half');
      } else if (dragStartPosRef.current === 'half') {
        setSheetPosition('expanded');
      }
    } else if (deltaY > threshold) {
      // Dragged DOWN
      if (dragStartPosRef.current === 'expanded') {
        setSheetPosition('half');
      } else if (dragStartPosRef.current === 'half') {
        setSheetPosition('collapsed');
      }
    } else {
      // Tap toggle: cycle collapsed -> half -> expanded -> half
      setSheetPosition((prev) => {
        if (prev === 'collapsed') return 'half';
        if (prev === 'half') return 'expanded';
        return 'half';
      });
    }
  };

  // Selected faculty object
  const selectedFacultyObj = useMemo(() => {
    if (!selectedFacultyId) return null;
    return faculties.find((f) => f.id === selectedFacultyId) || null;
  }, [selectedFacultyId]);

  // Top matches
  const topProgram = programScores[0];
  const topProgramData = topProgram ? studyPrograms.find((p) => p.id === topProgram.programId) : null;
  const topFaculty = facultyScores[0];
  const topFacultyData = topFaculty ? faculties.find((f) => f.id === topFaculty?.facultyId) : null;

  // Generate personalized narrative synthesis
  const generateNarrative = () => {
    if (!userSummary) return '';
    const riasecTraits = userSummary.topRiasec.map((r) => r.label).join(' dan ');
    const domainName = userSummary.topDomain.label;
    const learningStyle = userSummary.topLearning.label;

    return `Kamu memiliki dorongan rasa ingin tahu yang dominan pada rumpun ${domainName}, didukung oleh kecenderungan karakter kerja berorientasi ${riasecTraits}. Dalam proses studi, kamu akan berkembang maksimal melalui lingkungan belajar yang menekankan ${learningStyle.toLowerCase()}.`;
  };

  // Retake handler with clean answer reset
  const handleConfirmRetake = () => {
    resetAnswers();
    setIsRetakeModalOpen(false);
    router.push('/questionnaire');
  };

  // =========================================================================
  // INITIAL STATE: When user has not completed questionnaire (answeredCount === 0)
  // Display the Full-Screen Campus Map immediately with the Redesigned Incomplete Pop-Up
  // (Bypassed if user is viewing Langkah Selanjutnya tab)
  // =========================================================================
  if (answeredCount === 0 || programScores.length === 0) {
    return (
      <div className="relative w-full max-w-full h-screen overflow-hidden bg-slate-900 select-none">
        {/* Full-Screen Interactive Campus Map as the Living Environment */}
        <FullScreenCampusMap
          facultyScores={[]}
          selectedFacultyId={selectedFacultyId}
          onSelectFaculty={setSelectedFacultyId}
          className="fixed inset-0 z-0"
        />

        {/* SECTION 1: Redesigned Pop-Up Before Questionnaire Completion */}
        <IncompleteQuestionnaireModal
          isOpen={isIncompleteModalOpen}
          onClose={() => setIsIncompleteModalOpen(false)}
          answeredCount={answeredCount}
          totalQuestions={totalQuestions}
        />

        {/* Minimized floating pill when pop-up is dismissed to explore map */}
        {!isIncompleteModalOpen && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 bg-[#24130C]/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#78350F] animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2">
              <span className="font-pixel text-[8px] sm:text-[9px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded font-bold">
                STAGE 0
              </span>
              <span className="text-xs font-bold text-amber-100 hidden sm:inline">
                Petualanganmu Belum Selesai!
              </span>
            </div>
            <button
              onClick={() => setIsIncompleteModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#F59E0B] hover:bg-amber-400 text-stone-950 font-black text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs border border-amber-600 min-h-[38px]"
              aria-label="Buka Panduan Minat"
            >
              <span>Buka Panduan Minat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // RESULTS STATE: Full-screen interactive map with floating foreground panels & modals
  // =========================================================================
  return (
    <div className="relative w-full max-w-full h-screen overflow-hidden bg-slate-900 select-none">
      {/* 1. Full-Screen Interactive UNDIP Campus Map as 100% Viewport Background */}
      <FullScreenCampusMap
        facultyScores={facultyScores}
        selectedFacultyId={selectedFacultyId}
        onSelectFaculty={(facId) => {
          setSelectedFacultyId(facId);
        }}
        isPanelOpen={isPanelOpen}
        onToggleForeground={() => setIsPanelOpen(!isPanelOpen)}
        className="fixed inset-0 z-0"
      />

      {/* 2. Top Floating Navigation & Action Bar (Clean Single Header on /results) */}
      <header
        className="fixed left-2 right-2 sm:left-4 sm:right-4 z-30 flex items-center justify-between gap-1.5 sm:gap-2.5 bg-[#24130C]/95 backdrop-blur-md text-white px-2.5 py-2 sm:px-5 sm:py-3 rounded-2xl border-2 border-[#78350F] shadow-xl max-w-[calc(100vw-16px)] sm:max-w-none"
        style={{ top: 'calc(var(--navbar-h, 56px) + 8px)' }}
      >
        {/* Left: Brand Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-2 font-pixel text-xs text-[#FDE68A] hover:text-amber-300 transition-colors min-h-[44px]"
            aria-label="Kembali ke Beranda"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping motion-reduce:animate-none shrink-0" />
            <span className="hidden xs:inline">UNDIP MAP</span>
            <span className="xs:hidden">MAP</span>
          </Link>

          {/* Quick status summary badge */}
          {topProgramData && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#190E08] border border-[#78350F] text-xs font-bold text-amber-200 min-h-[44px]">
              <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-amber-300 font-normal">Top Match:</span>
              <span className="text-white truncate max-w-[180px]">{topProgramData.name}</span>
            </div>
          )}
        </div>

        {/* Center: Output 1 vs Output 2 vs Next Steps Tabs */}
        <div className="flex items-center bg-[#190E08] p-0.5 sm:p-1 rounded-xl border border-[#78350F] shrink-0">
          <button
            onClick={() => {
              setActiveTab('all-majors');
              if (!isPanelOpen) setIsPanelOpen(true);
            }}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-black transition-all cursor-pointer min-h-[44px] min-w-[40px] sm:min-w-0 ${
              activeTab === 'all-majors'
                ? 'bg-[#F59E0B] text-stone-950 shadow-xs'
                : 'text-amber-200/90 hover:text-white'
            }`}
            title="Output 1: 65 Program Studi di Peringkat"
            aria-label="Lihat Output 1: 65 Program Studi di Peringkat"
          >
            <GraduationCap className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">65 Jurusan</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('faculties');
              if (!isPanelOpen) setIsPanelOpen(true);
            }}
            className={`flex items-center justify-center gap-1 sm:gap-1.5 p-2 sm:px-3 sm:py-2 rounded-lg text-xs font-black transition-all cursor-pointer min-h-[44px] min-w-[40px] sm:min-w-0 ${
              activeTab === 'faculties'
                ? 'bg-[#F59E0B] text-stone-950 shadow-xs'
                : 'text-amber-200/90 hover:text-white'
            }`}
            title="Output 2: 12 Fakultas"
            aria-label="Lihat Output 2: 12 Fakultas"
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">12 Fakultas</span>
          </button>
        </div>

        {/* Right: Sound, Toggle Panel ("Peta Penuh"), Share, and Retake */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Audio Toggle (desktop/tablet only; on phone global Navbar directly above has SFX toggle) */}
          <button
            onClick={handleToggleSound}
            className="hidden sm:flex p-2 sm:p-2.5 rounded-xl bg-[#190E08] hover:bg-[#341A10] text-[#FDE68A] border border-[#78350F] transition-colors cursor-pointer min-h-[44px] min-w-[44px] items-center justify-center"
            title={isMuted ? 'Aktifkan Suara Retro' : 'Bisukan Suara'}
            aria-label={isMuted ? 'Aktifkan Suara Retro' : 'Bisukan Suara Retro'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Toggle Panel Button ("Peta Penuh" / "Buka Panel") */}
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[44px] ${
              isPanelOpen
                ? 'bg-amber-500 text-stone-950 hover:bg-amber-400 shadow-xs'
                : 'bg-[#78350F] text-[#FDE68A] hover:bg-[#8D3F12] border border-[#F59E0B]'
            }`}
            title={isPanelOpen ? 'Sembunyikan panel untuk melihat peta penuh' : 'Buka panel hasil rekomendasi'}
            aria-label={isPanelOpen ? 'Sembunyikan panel hasil (tampilkan Peta Penuh)' : 'Buka panel hasil rekomendasi prodi'}
          >
            {isPanelOpen ? (
              <>
                <Maximize2 className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Peta Penuh</span>
              </>
            ) : (
              <>
                <Layers className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Buka Panel</span>
              </>
            )}
          </button>

          {/* Share Button */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#190E08] hover:bg-[#341A10] text-amber-200 hover:text-white border border-[#78350F] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center gap-1.5"
            title="Bagikan Hasil"
            aria-label="Bagikan Hasil Rekomendasi"
            data-testid="btn-bagikan-hasil"
          >
            <Share2 className="w-4 h-4 text-[#F59E0B]" />
            <span className="hidden sm:inline text-xs font-bold font-pixel">Bagikan</span>
          </button>

          {/* PDF Export Button (Compact Header) */}
          <PdfExportButton
            programScores={programScores}
            facultyScores={facultyScores}
            programs={studyPrograms}
            dimensionScores={dimensionScores}
            userSummary={userSummary}
            variant="compact"
          />

          {/* Retake Questionnaire Button */}
          <button
            onClick={() => setIsRetakeModalOpen(true)}
            className="p-2 sm:p-2.5 rounded-xl bg-[#190E08] hover:bg-[#341A10] text-rose-300 hover:text-rose-200 border border-rose-900/60 transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
            title="Ulangi Kuisioner (Reset & Isi Ulang)"
            aria-label="Ulangi Kuisioner (Reset & Isi Ulang)"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
          </button>
        </div>
      </header>

      {/* 3. Floating Foreground Results Panel (Interactive Bottom Sheet on Mobile with 3 Positions) */}
      {isPanelOpen && (
        <aside
          className={`fixed bottom-0 left-0 right-0 sm:max-h-none sm:top-20 sm:right-4 sm:bottom-4 sm:left-auto sm:w-[580px] lg:w-[660px] xl:w-[720px] z-20 bg-[#24130C]/98 backdrop-blur-md rounded-t-3xl sm:rounded-3xl border-t-2 sm:border-2 border-[#78350F] shadow-[0_16px_50px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-white duration-300 ease-in-out pb-[max(0.75rem,env(safe-area-inset-bottom))] ${
            sheetPosition === 'collapsed'
              ? 'h-36 max-h-36 sm:h-auto'
              : sheetPosition === 'expanded'
              ? 'h-[90vh] max-h-[90vh] landscape:h-[85vh] sm:h-auto'
              : 'h-[56vh] max-h-[56vh] landscape:h-[80vh] sm:h-auto'
          }`}
          onWheel={(e) => e.stopPropagation()}
        >
          {/* Mobile Drag Indicator Handle (3-Position Snapping: Collapsed / Half / Expanded) */}
          <div
            className="flex sm:hidden flex-col items-center justify-center pt-2.5 pb-2 bg-[#190E08]/95 shrink-0 cursor-grab active:cursor-grabbing touch-none select-none border-b border-[#78350F]/40 min-h-[44px]"
            onPointerDown={handleSheetPointerDown}
            onPointerUp={handleSheetPointerUp}
            onPointerCancel={handleSheetPointerUp}
            role="button"
            tabIndex={0}
            aria-label={`Ubah ukuran panel bawah (Posisi saat ini: ${sheetPosition})`}
            title="Tarik ke atas/bawah untuk mengubah posisi panel"
          >
            <div className="w-12 h-1.5 rounded-full bg-[#78350F] hover:bg-[#F59E0B] transition-colors" />
            <div className="flex items-center gap-1 text-xs font-mono text-amber-200/90 mt-1 uppercase tracking-wider">
              {sheetPosition === 'collapsed' && (
                <>
                  <span>▲ Geser ke Atas</span>
                  <span className="text-amber-400 font-bold">(Ringkasan)</span>
                </>
              )}
              {sheetPosition === 'half' && (
                <>
                  <span>▲▼ Geser Panel</span>
                  <span className="text-amber-400 font-bold">(Sedang)</span>
                </>
              )}
              {sheetPosition === 'expanded' && (
                <>
                  <span>▼ Geser ke Bawah</span>
                  <span className="text-amber-400 font-bold">(Penuh)</span>
                </>
              )}
            </div>
          </div>

          {/* Panel Header */}
          <div className="px-4 py-3 sm:p-5 border-b-2 border-[#78350F] flex flex-col gap-2.5 sm:gap-3 bg-[#190E08]/95 shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-[#78350F] text-[#FDE68A] border border-[#F59E0B] flex items-center justify-center shrink-0">
                  {activeTab === 'all-majors' ? (
                    <GraduationCap className="w-4 h-4" />
                  ) : (
                    <Building2 className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-extrabold text-[#FFFBEB] truncate font-pixel">
                    Panel Rekomendasi HMIM
                  </h2>
                  <p className="text-xs text-amber-200/90 truncate">
                    {selectedFacultyObj
                      ? `Kamera Terfokus: ${selectedFacultyObj.name} (${selectedFacultyObj.shortName})`
                      : 'Kamera dan filter tersinkronisasi interaktif dengan peta'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {selectedFacultyId && (
                  <button
                    onClick={() => setSelectedFacultyId(null)}
                    aria-label="Reset filter fokus kamera peta"
                    className="text-xs font-bold px-3 py-1.5 bg-[#24130C] hover:bg-[#341A10] text-[#FDE68A] border border-[#78350F] rounded-lg transition-colors cursor-pointer min-h-[44px] flex items-center"
                  >
                    Reset Filter
                  </button>
                )}
                <button
                  onClick={() => setIsPanelOpen(false)}
                  className="p-2 rounded-xl text-amber-200/90 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Tutup panel (Lihat Peta Penuh)"
                  aria-label="Tutup panel hasil rekomendasi"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Share / Export Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShareOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-[#2A160E] hover:bg-[#3D1F13] text-[#FDE68A] hover:text-white border-2 border-[#F59E0B] rounded-xl text-xs font-bold font-pixel shadow-[2px_2px_0_0_#000] transition-colors cursor-pointer min-h-[44px]"
                data-testid="btn-bagikan-hasil-panel"
                aria-label="Bagikan Hasil Rekomendasi"
              >
                <Share2 className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Bagikan Hasil</span>
              </button>

              <PdfExportButton
                programScores={programScores}
                facultyScores={facultyScores}
                programs={studyPrograms}
                dimensionScores={dimensionScores}
                userSummary={userSummary}
                className="flex-1"
              />
            </div>

            {/* In-Panel Output Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1.5 bg-[#140B07] p-1.5 rounded-xl border border-[#78350F]">
              <button
                onClick={() => setActiveTab('all-majors')}
                className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1.5 sm:px-2 rounded-lg text-xs font-black transition-all cursor-pointer min-h-[44px] ${
                  activeTab === 'all-majors'
                    ? 'bg-[#F59E0B] text-stone-950 shadow-xs'
                    : 'text-amber-200/90 hover:text-white hover:bg-[#2A150D]'
                }`}
                aria-label="Tampilkan Output 1: 65 Jurusan di Peringkat"
              >
                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">65 Jurusan</span>
                <span className="sm:hidden text-[10px]">65 Prodi</span>
              </button>
              <button
                onClick={() => setActiveTab('faculties')}
                className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-1.5 sm:px-2 rounded-lg text-xs font-black transition-all cursor-pointer min-h-[44px] ${
                  activeTab === 'faculties'
                    ? 'bg-[#F59E0B] text-stone-950 shadow-xs'
                    : 'text-amber-200/90 hover:text-white hover:bg-[#2A150D]'
                }`}
                aria-label="Tampilkan Output 2: 12 Fakultas"
              >
                <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="hidden sm:inline">12 Fakultas</span>
                <span className="sm:hidden text-[10px]">12 Fak</span>
              </button>
            </div>
          </div>

          {/* Panel Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 scrollbar-thin scrollbar-thumb-[#78350F] scrollbar-track-[#190E08]">
            {/* Banner Link to Langkah Selanjutnya */}
            <Link
              href="/langkah-selanjutnya"
              onClick={() => retroAudio.playSelect()}
              className="bg-[#1F120B] hover:bg-[#2A160E] border-2 border-[#F59E0B]/80 rounded-xl p-3 flex items-center justify-between gap-3 text-amber-100 transition-colors shadow-xs group min-h-[44px]"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-[#24130C] border border-[#F59E0B] flex items-center justify-center text-[#FDE68A] shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-pixel text-[8.5px] sm:text-[9.5px] text-[#FDE68A] block truncate group-hover:text-amber-200">
                    Langkah Selanjutnya: Biaya, Beasiswa & Jadwal
                  </span>
                  <span className="text-[10px] text-amber-200/70 block truncate">
                    Cek Biaya Kuliah (UKT), Beasiswa KIP-Kuliah & Kalender Seleksi
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[#F59E0B] font-pixel text-[8px] sm:text-[9px] shrink-0">
                <span className="hidden sm:inline">BUKA</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
            {/* Incomplete warning banner if partially answered */}
            {!isComplete && (
              <div className="bg-[#190E08] border border-amber-600/70 rounded-2xl p-3.5 text-amber-200 text-xs flex items-start justify-between gap-3 shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold text-amber-100">Hasil Sementara ({answeredCount}/{totalQuestions} Soal Terisi)</strong>
                    <p className="text-xs text-amber-200/90 mt-0.5">
                      Lengkapi seluruh 36 pertanyaan untuk akurasi rekomendasi prodi yang paling optimal.
                    </p>
                  </div>
                </div>
                <Link
                  href="/questionnaire"
                  aria-label="Lanjutkan kuisioner minat"
                  className="px-3.5 py-2 bg-[#F59E0B] hover:bg-amber-400 text-stone-950 rounded-lg font-bold text-xs shrink-0 text-center transition-colors min-h-[44px] flex items-center justify-center"
                >
                  Lanjut
                </Link>
              </div>
            )}

            {/* Personalized Academic Interest Summary Card */}
            <div className="bg-[#190E08] text-white rounded-2xl p-5 sm:p-6 border-2 border-[#78350F] shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-[#78350F]/70">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-pixel text-[8px] bg-emerald-600 text-stone-950 px-2 py-0.5 rounded font-bold border border-emerald-400">
                      STAGE CLEAR
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      Laporan Eksplorasi Minat HMIM
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#FFFBEB]">
                    {topProgramData?.name}
                  </h3>
                  <p className="text-xs text-amber-200/90">
                    Jenjang {topProgramData?.degreeLevel} • {topFacultyData?.shortName} • Kecocokan {topProgram?.totalScore}%
                  </p>
                </div>

                <TierBadge tier={topProgram?.tier || 'A'} size="md" />
              </div>

              {/* Personalized Narrative Synthesis */}
              <p className="text-xs sm:text-sm text-amber-100/95 mt-3 leading-relaxed">
                {generateNarrative()}
              </p>

              {/* Toggle Dimension Scores Overview */}
              <div className="mt-4 pt-3 border-t border-[#78350F]/70 flex items-center justify-between">
                <button
                  onClick={() => setShowDimensionChart(!showDimensionChart)}
                  aria-label={showDimensionChart ? 'Sembunyikan rincian 4 dimensi' : 'Lihat rincian 4 dimensi HMIM'}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-[#FDE68A] transition-colors cursor-pointer min-h-[44px]"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>{showDimensionChart ? 'Sembunyikan 4 Dimensi' : 'Lihat Rincian 4 Dimensi HMIM'}</span>
                </button>
                <span className="text-xs font-mono text-amber-200/80">
                  S = 0.20R + 0.35D + 0.20L + 0.25C
                </span>
              </div>

              {/* Dimension Breakdown Accordion */}
              {showDimensionChart && dimensionScores && (
                <div className="mt-3 p-4 rounded-xl bg-[#140B07] border border-[#78350F]/70 grid grid-cols-2 gap-3 text-xs animate-in fade-in duration-150">
                  <ScoreBar
                    label="1. RIASEC"
                    score={Math.round(dimensionScores.riasec.reduce((a, b) => a + b, 0) / (dimensionScores.riasec.length || 1))}
                    subLabel="20%"
                    color="bg-amber-400"
                    isDark
                  />
                  <ScoreBar
                    label="2. Bidang Ilmu"
                    score={Math.round(dimensionScores.domain.reduce((a, b) => a + b, 0) / (dimensionScores.domain.length || 1))}
                    subLabel="35%"
                    color="bg-emerald-400"
                    isDark
                  />
                  <ScoreBar
                    label="3. Gaya Belajar"
                    score={Math.round(dimensionScores.learning.reduce((a, b) => a + b, 0) / (dimensionScores.learning.length || 1))}
                    subLabel="20%"
                    color="bg-sky-400"
                    isDark
                  />
                  <ScoreBar
                    label="4. Kurikulum"
                    score={Math.round(dimensionScores.curriculum.reduce((a, b) => a + b, 0) / (dimensionScores.curriculum.length || 1))}
                    subLabel="25%"
                    color="bg-amber-500"
                    isDark
                  />
                </div>
              )}
            </div>

            {/* Selected Faculty Notification Filter Pill */}
            {selectedFacultyObj && (
              <div className="bg-[#190E08] border border-[#F59E0B] rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs text-amber-100">
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0" />
                  <span className="truncate">
                    Fokus Peta Aktif: <strong className="text-[#FDE68A]">{selectedFacultyObj.name}</strong> ({selectedFacultyObj.shortName})
                  </span>
                </div>
                <button
                  onClick={() => setSelectedFacultyId(null)}
                  aria-label="Tampilkan semua fakultas dan reset fokus peta"
                  className="font-bold text-amber-400 hover:text-amber-200 underline shrink-0 cursor-pointer text-xs min-h-[44px] flex items-center"
                >
                  Tampilkan Semua
                </button>
              </div>
            )}

            {/* Interest Spread Advisory Banner (Prompt G Round 9) */}
            {interestSpread.isSpread && (
              <InterestSpreadBanner
                gap1_5={interestSpread.gap1_5}
                topProgramNames={top3ProgramNames}
              />
            )}

            {/* Content Tab 1: Output 1 (All Major Tier List) */}
            {activeTab === 'all-majors' && (
              <AllMajorTierList
                programScores={programScores}
                programs={studyPrograms}
                comparisonIds={comparisonIds}
                onToggleComparison={toggleComparison}
                selectedFaculty={selectedFacultyId}
                onSelectFaculty={setSelectedFacultyId}
              />
            )}

            {/* Content Tab 2: Output 2 (Faculty Tier List) */}
            {activeTab === 'faculties' && (
              <FacultyTierList
                facultyScores={facultyScores}
                programs={studyPrograms}
                selectedFacultyId={selectedFacultyId}
                onSelectFaculty={setSelectedFacultyId}
              />
            )}


            {/* Retake Questionnaire Action Button Inside Recommendation Panel */}
            <div className="pt-2">
              <button
                onClick={() => setIsRetakeModalOpen(true)}
                className="w-full p-3.5 rounded-2xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/60 text-rose-300 transition-colors flex items-center justify-center gap-2 font-bold text-xs cursor-pointer shadow-xs min-h-[44px]"
                title="Ulangi 36 pertanyaan kuisioner minat"
                aria-label="Ulangi kuisioner minat (reset dan isi ulang)"
              >
                <RotateCcw className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Ulangi Kuisioner (Reset & Isi Ulang)</span>
              </button>
            </div>

            {/* Dashboard Architecture Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <Link
                href="/admin"
                className="p-4 rounded-2xl bg-[#190E08] border border-[#78350F] hover:border-[#F59E0B] transition-all flex items-center justify-between gap-3 group min-h-[44px]"
              >
                <div>
                  <div className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
                    Arsitektur
                  </div>
                  <div className="text-xs font-extrabold text-[#FFFBEB] group-hover:text-[#FDE68A] transition-colors">
                    Algoritma HMIM
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-300 group-hover:text-amber-100 transition-colors" />
              </Link>

              <button
                onClick={() => {
                  try {
                    sessionStorage.removeItem('undip_intro_seen');
                  } catch {}
                  router.push('/');
                }}
                className="p-4 rounded-2xl bg-[#190E08] border border-[#78350F] hover:border-amber-400 transition-all flex items-center justify-between gap-3 group text-left cursor-pointer min-h-[44px]"
              >
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Petualangan Visual
                  </div>
                  <div className="text-xs font-extrabold text-[#FFFBEB] group-hover:text-amber-200 transition-colors">
                    Restart Intro Gerbang
                  </div>
                </div>
                <RotateCcw className="w-4 h-4 text-amber-300 group-hover:text-amber-100 transition-colors" />
              </button>
            </div>

            {/* SERADIP WhatsApp Consultation Button (Section 5B) */}
            <div className="flex justify-center pt-1 pb-1">
              <SeradipContactButton
                message={
                  programScores.length >= 3
                    ? `Halo Kak SERADIP, saya baru saja menyelesaikan tes minat di ${APP_NAME}. Top 3 prodi rekomendasi saya adalah:\n1. ${studyPrograms.find((p) => p.id === programScores[0]?.programId)?.name || ''}\n2. ${studyPrograms.find((p) => p.id === programScores[1]?.programId)?.name || ''}\n3. ${studyPrograms.find((p) => p.id === programScores[2]?.programId)?.name || ''}\nBoleh minta bimbingan dan konsultasi lebih lanjut?`
                    : `Halo Kak SERADIP, saya ingin konsultasi mengenai pilihan jurusan kuliah di Universitas Diponegoro.`
                }
                label="Tanya Kakak SERADIP tentang Hasilmu"
              />
            </div>

            {/* Disclaimer */}
            <DisclaimerBanner />
          </div>
        </aside>
      )}

      {/* 4. Minimized Result Trigger Floating Pill (when isPanelOpen === false, stacked cleanly above bottom chip bar) */}
      {!isPanelOpen && (
        <div className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-20 sm:w-auto z-30 flex justify-center sm:block animate-in fade-in slide-in-from-bottom-4">
          <button
            onClick={() => setIsPanelOpen(true)}
            className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-3 bg-[#24130C]/95 backdrop-blur-md hover:bg-[#341A10] text-white px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl shadow-2xl border-2 border-[#F59E0B] transition-all cursor-pointer group min-h-[44px]"
            aria-label={`Buka Panel Rekomendasi (${programScores.length} Prodi)`}
          >
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-mono text-amber-300 font-bold uppercase tracking-wider truncate">
                HASIL REKOMENDASI TERSEDIA
              </div>
              <div className="text-xs font-black text-white group-hover:text-amber-200 transition-colors truncate">
                Buka Panel Rekomendasi ({programScores.length} Prodi)
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </div>
      )}

      {/* 5. Floating Comparison Bar (Requirement 7: Appears when >= 2 programs are pinned) */}
      {comparisonIds.length >= 2 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 sm:gap-3 bg-[#24130C]/95 backdrop-blur-md text-white px-3.5 py-2.5 sm:px-5 sm:py-3 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.85)] border-2 border-[#F59E0B] animate-in fade-in slide-in-from-bottom-4 max-w-[calc(100vw-24px)]">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div className="text-left min-w-0 pr-1">
            <div className="text-xs font-mono text-amber-300 font-bold uppercase tracking-wider truncate">
              KOMPARASI PRODI
            </div>
            <div className="text-xs font-black text-white truncate">
              {comparisonIds.length} Prodi Dipilih
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsComparisonOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 bg-[#F59E0B] hover:bg-amber-400 text-stone-950 font-black text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all cursor-pointer shadow-xs border border-amber-600 min-h-[44px]"
              aria-label={`Buka komparasi ${comparisonIds.length} program studi`}
            >
              <span>Lihat Perbandingan ({comparisonIds.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={clearComparison}
              className="p-2 sm:p-2.5 rounded-xl bg-[#190E08] hover:bg-[#341A10] text-amber-300/90 hover:text-white border border-[#78350F] transition-colors cursor-pointer text-xs font-bold min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Bersihkan pembanding"
              aria-label="Bersihkan pilihan komparasi prodi"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* SECTION 6: Retake Questionnaire Confirmation Modal */}
      <RetakeConfirmModal
        isOpen={isRetakeModalOpen}
        onClose={() => setIsRetakeModalOpen(false)}
        onConfirm={handleConfirmRetake}
      />

      {/* Program Comparison Modal */}
      <ProgramComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        programIds={comparisonIds}
        programs={studyPrograms}
        getScoreForProgram={getScoreForProgram}
        onRemoveProgram={toggleComparison}
      />

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        programScores={programScores}
        facultyScores={facultyScores}
        programs={studyPrograms}
        userSummary={userSummary}
      />
    </div>
  );
}
