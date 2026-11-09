'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { faculties } from '@/data/faculties';
import { studyPrograms } from '@/data/programs';
import { isPsdku } from '@/data/types';
import { campusFacultyLocations } from '@/data/campusLocations';
import { useQuestionnaire } from '@/contexts/QuestionnaireContext';
import { FavoriteButton } from '@/components/ui/FavoriteButton';
import { TierBadge } from '@/components/ui/TierBadge';
import {
  X,
  MapPin,
  Scale,
  ExternalLink,
  Check,
} from 'lucide-react';

export interface FacultyMapTourSheetProps {
  facultyId: string | null;
  onClose: () => void;
  onFocusFaculty?: (facultyId: string) => void;
  isFocusedOnMap?: boolean;
}

export function FacultyMapTourSheet({
  facultyId,
  onClose,
  onFocusFaculty,
  isFocusedOnMap = false,
}: FacultyMapTourSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const {
    getScoreForProgram,
    comparisonIds,
    toggleComparison,
  } = useQuestionnaire();

  const faculty = faculties.find((f) => f.id === facultyId);
  const location = campusFacultyLocations.find((l) => l.id === facultyId);

  // All non-PSDKU programs belonging to this faculty (Tembalang campus)
  const facultyPrograms = React.useMemo(() => {
    if (!facultyId) return [];
    return studyPrograms.filter(
      (p) => p.facultyId === facultyId && !isPsdku(p)
    );
  }, [facultyId]);

  // Focus trap & Escape key listener
  useEffect(() => {
    if (!facultyId) return;

    // Focus close button initially
    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Trap Tab within panelRef
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [facultyId, onClose]);

  if (!facultyId || !faculty) {
    return null;
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="faculty-tour-title"
      data-testid="faculty-map-tour-panel"
      className="fixed md:absolute bottom-0 md:bottom-4 left-0 md:left-auto md:right-4 w-full md:w-[420px] max-h-[60vh] md:max-h-[calc(100%-7rem)] md:top-24 z-40 bg-[#1E110A]/95 backdrop-blur-md border-t-2 md:border-2 border-[#F59E0B] md:rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden text-slate-100 transition-all duration-200"
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Mobile Drag Indicator Bar */}
      <div className="md:hidden flex justify-center pt-2 pb-1 bg-[#190E08]/80">
        <div className="w-12 h-1.5 rounded-full bg-amber-600/60" />
      </div>

      {/* Header Bar */}
      <div className="p-3.5 sm:p-4 bg-[#24130C] border-b border-[#78350F] flex items-start justify-between gap-3 shrink-0">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-pixel text-[8.5px] bg-[#78350F] text-[#FDE68A] px-2 py-0.5 rounded border border-[#F59E0B]">
              {location?.zone || 'Kampus Tembalang'}
            </span>
            <span className="text-[11px] font-mono text-amber-200/80">
              {facultyPrograms.length} Program Studi
            </span>
          </div>
          <h2
            id="faculty-tour-title"
            className="text-base sm:text-lg font-black text-[#FFFBEB] font-pixel leading-tight truncate"
          >
            {faculty.name}
          </h2>
          {location?.landmarkName && (
            <p className="text-xs text-amber-200/80 truncate">
              {location.landmarkName}
            </p>
          )}
        </div>

        <button
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Tutup panel tur kampus"
          data-testid="btn-close-tour-panel"
          className="p-2 rounded-xl bg-[#190E08] hover:bg-[#341A10] text-amber-200 hover:text-white border border-[#78350F] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
        >
          <X className="w-5 h-5 text-amber-300" />
        </button>
      </div>

      {/* Action Bar (Center on Map & Architecture Details) */}
      <div className="px-3.5 sm:px-4 py-2 bg-[#190E08] border-b border-[#78350F]/70 flex items-center justify-between gap-2 shrink-0 text-xs">
        <button
          onClick={() => onFocusFaculty?.(faculty.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer min-h-[44px] ${
            isFocusedOnMap
              ? 'bg-[#F59E0B] text-stone-950 font-black shadow-xs'
              : 'bg-[#24130C] text-[#FDE68A] hover:bg-[#341A10] border border-[#78350F]'
          }`}
          aria-label={`Fokuskan kamera peta ke ${faculty.shortName}`}
        >
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>{isFocusedOnMap ? 'Kamera Terfokus' : 'Fokus di Peta'}</span>
        </button>

        {faculty.websiteUrl && (
          <a
            href={faculty.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Kunjungi situs resmi ${faculty.shortName}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-white transition-colors min-h-[44px]"
          >
            <span>Situs Resmi</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      {/* Architecture Characteristic Callout */}
      {location?.architecturalStyle && (
        <div className="px-3.5 sm:px-4 py-2 bg-[#190E08]/60 border-b border-[#78350F]/40 text-[11px] text-amber-200/80 leading-relaxed shrink-0 hidden sm:block">
          <strong className="text-amber-300">Ciri Khas Bangunan:</strong>{' '}
          {location.architecturalStyle.facadeDescription}
        </div>
      )}

      {/* Scrollable Programs List */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-2.5 scrollbar-thin scrollbar-thumb-[#78350F] scrollbar-track-[#190E08]">
        {facultyPrograms.length === 0 ? (
          <div className="text-center py-6 text-amber-200/70 text-xs">
            Tidak ada program studi kampus utama yang terdaftar untuk unit ini.
          </div>
        ) : (
          facultyPrograms.map((program) => {
            const score = getScoreForProgram(program.id);
            const isComparing = comparisonIds.includes(program.id);

            return (
              <div
                key={program.id}
                data-testid={`faculty-program-card-${program.id}`}
                className="bg-[#24130C] rounded-xl p-3 border border-[#78350F]/80 hover:border-amber-500/70 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-mono font-bold text-amber-300 bg-[#190E08] px-1.5 py-0.5 rounded border border-[#78350F]/60">
                        {program.degreeLevel}
                      </span>
                      {score && (
                        <TierBadge tier={score.tier} size="sm" />
                      )}
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-[#FFFBEB] leading-snug line-clamp-2">
                      {program.name}
                    </h3>
                  </div>

                  {/* Score when result exists */}
                  {score && (
                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase font-mono text-amber-200/70 block">
                        Kecocokan
                      </span>
                      <span className="text-sm sm:text-base font-black text-amber-400 font-pixel">
                        {score.totalScore}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons Row */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-[#78350F]/50">
                  <div className="flex items-center gap-1.5">
                    <FavoriteButton
                      programId={program.id}
                      programName={program.name}
                    />

                    <button
                      onClick={() => toggleComparison(program.id)}
                      aria-pressed={isComparing}
                      aria-label={
                        isComparing
                          ? `Hapus ${program.name} dari perbandingan`
                          : `Tambahkan ${program.name} ke perbandingan`
                      }
                      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer min-h-[44px] ${
                        isComparing
                          ? 'bg-[#F59E0B] text-stone-950 border-amber-600 font-black'
                          : 'bg-[#190E08] text-amber-200 hover:text-white border-[#78350F] hover:bg-[#341A10]'
                      }`}
                    >
                      {isComparing ? (
                        <>
                          <Check className="w-3 h-3 text-stone-950" />
                          <span>Dibandingkan</span>
                        </>
                      ) : (
                        <>
                          <Scale className="w-3 h-3 text-amber-400" />
                          <span>Bandingkan</span>
                        </>
                      )}
                    </button>
                  </div>

                  <Link
                    href={`/program/${program.id}`}
                    aria-label={`Lihat detail program studi ${program.name}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F59E0B] hover:bg-amber-400 text-stone-950 rounded-lg text-xs font-black transition-colors shadow-[1px_1px_0_0_#000] cursor-pointer min-h-[44px]"
                  >
                    <span>Detail</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
