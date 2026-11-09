'use client';

import React from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoritesContext';

interface FavoriteButtonProps {
  programId: string;
  programName?: string;
  showText?: boolean;
  className?: string;
}

export function FavoriteButton({
  programId,
  programName,
  showText = false,
  className = '',
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, favoritesCount, maxCap } = useFavorites();
  const isFav = isFavorite(programId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const success = toggleFavorite(programId);
    if (!success && !isFav && favoritesCount >= maxCap) {
      alert(`Batas maksimal ${maxCap} program studi favorit telah tercapai. Hapus beberapa prodi dari daftar favorit untuk menambah baru.`);
    }
  };

  const actionText = isFav ? 'Hapus dari Favorit' : 'Simpan ke Favorit';
  const accessibleLabel = programName ? `${actionText} (${programName})` : actionText;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isFav}
      aria-label={accessibleLabel}
      title={accessibleLabel}
      className={`min-h-[44px] min-w-[44px] p-2.5 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
        isFav
          ? 'bg-rose-950/80 text-rose-300 border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)] hover:bg-rose-900/90 hover:text-white'
          : 'bg-[#24130C] text-amber-200/80 border-[#78350F] hover:bg-[#341A10] hover:text-amber-100 hover:border-[#F59E0B]/70'
      } ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-transform ${
          isFav ? 'fill-rose-400 text-rose-400 scale-110' : 'text-amber-200/70'
        }`}
      />
      {showText && (
        <span className="font-pixel text-[8.5px] uppercase tracking-wide">
          {isFav ? 'Favorit' : 'Simpan'}
        </span>
      )}
    </button>
  );
}
