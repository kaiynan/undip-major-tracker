'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { studyPrograms } from '@/data/programs';
import { faculties } from '@/data/faculties';
import { useFavorites } from '@/contexts/FavoritesContext';
import { StudyProgram } from '@/data/types';
import {
  Scale,
  Search,
  X,
  Heart,
  ArrowRight,
} from 'lucide-react';
import { retroAudio } from '@/lib/retroAudio';

interface ComparePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProgram: StudyProgram;
}

export function ComparePickerModal({
  isOpen,
  onClose,
  currentProgram,
}: ComparePickerModalProps) {
  const router = useRouter();
  const { favorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');

  // Favorite programs excluding current
  const favoritePrograms = useMemo(() => {
    return favorites
      .filter((id) => id !== currentProgram.id)
      .map((id) => studyPrograms.find((p) => p.id === id))
      .filter(Boolean) as StudyProgram[];
  }, [favorites, currentProgram.id]);

  // All other programs filtered by search
  const filteredPrograms = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return studyPrograms.filter((p) => {
      if (p.id === currentProgram.id) return false;
      if (!q) return true;
      const fac = faculties.find((f) => f.id === p.facultyId);
      return (
        p.name.toLowerCase().includes(q) ||
        p.degreeLevel.toLowerCase().includes(q) ||
        fac?.name.toLowerCase().includes(q) ||
        fac?.shortName.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, currentProgram.id]);

  const handleSelectProgram = (targetId: string) => {
    retroAudio.playSelect();
    onClose();
    router.push(`/bandingkan?ids=${currentProgram.id},${targetId}`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      titleId="compare-picker-title"
      maxWidth="max-w-2xl"
      className="max-h-[85vh] flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-5 py-4 border-b-2 border-[#78350F] flex items-center justify-between bg-[#190E08]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 text-[#FDE68A] rounded-xl border border-[#78350F]">
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 id="compare-picker-title" className="font-pixel text-sm sm:text-base text-[#FFFBEB]">
              Bandingkan {currentProgram.name}
            </h3>
            <p className="text-[11px] text-amber-200/80">
              Pilih program studi mitra untuk dibandingkan berdampingan
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-amber-200/70 hover:text-white hover:bg-[#78350F] transition-colors cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Tutup pemilih prodi bandingkan"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4 bg-[#140B07] border-b border-[#78350F]/70">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/70" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama prodi, jenjang, atau fakultas..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#1F100A] border-2 border-[#78350F] rounded-xl text-xs text-white placeholder-amber-200/50 focus:outline-hidden focus:border-[#F59E0B] transition-colors"
          />
        </div>
      </div>

      {/* Body List */}
      <div className="p-4 overflow-y-auto space-y-4 max-h-[55vh]">
        {/* Favorited Section (if present and no search) */}
        {!searchQuery && favoritePrograms.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-pixel text-rose-400">
              <Heart className="w-3.5 h-3.5 fill-rose-400" />
              <span>Dari Favorit Anda</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {favoritePrograms.map((prog) => {
                const fac = faculties.find((f) => f.id === prog.facultyId);
                return (
                  <button
                    key={prog.id}
                    onClick={() => handleSelectProgram(prog.id)}
                    className="w-full text-left p-3 rounded-xl border border-rose-800/60 bg-rose-950/20 hover:bg-rose-900/40 hover:border-rose-500 transition-all flex items-center justify-between gap-3 cursor-pointer min-h-[44px]"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-pixel text-[7.5px] px-1.5 py-0.5 rounded bg-blue-950 text-sky-300 border border-sky-700">
                          {prog.degreeLevel}
                        </span>
                        <span className="text-[10px] text-amber-200/80 font-mono">
                          {fac?.shortName}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-white leading-snug">
                        {prog.name}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-rose-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* All Programs Section */}
        <div className="space-y-2">
          <div className="text-[11px] font-pixel text-[#F59E0B]">
            <span>{searchQuery ? 'Hasil Pencarian' : 'Semua Program Studi UNDIP'}</span>
          </div>

          {filteredPrograms.length === 0 ? (
            <div className="text-center py-6 text-xs text-amber-200/60">
              Tidak ada program studi yang cocok dengan pencarian Anda.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {filteredPrograms.slice(0, 30).map((prog) => {
                const fac = faculties.find((f) => f.id === prog.facultyId);
                return (
                  <button
                    key={prog.id}
                    onClick={() => handleSelectProgram(prog.id)}
                    className="w-full text-left p-3 rounded-xl border border-[#78350F] bg-[#190E08] hover:bg-[#2A160E] hover:border-[#F59E0B] transition-all flex items-center justify-between gap-3 cursor-pointer min-h-[44px]"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-pixel text-[7.5px] px-1.5 py-0.5 rounded bg-blue-950 text-sky-300 border border-sky-700">
                          {prog.degreeLevel}
                        </span>
                        <span className="text-[10px] text-amber-200/80 font-mono">
                          {fac?.shortName}
                        </span>
                        {prog.campusLocation && prog.campusLocation.includes('PSDKU') && (
                          <span className="text-[9px] font-mono text-amber-300 bg-amber-950 px-1 rounded border border-amber-700">
                            PSDKU
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-xs text-white leading-snug">
                        {prog.name}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
