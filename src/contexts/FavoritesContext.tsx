'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useSyncExternalStore,
  ReactNode,
} from 'react';
import { studyPrograms } from '@/data/programs';
import { retroAudio } from '@/lib/retroAudio';

interface FavoritesContextType {
  favorites: string[];
  favoritesCount: number;
  isFavorite: (programId: string) => boolean;
  toggleFavorite: (programId: string) => boolean;
  addFavorite: (programId: string) => boolean;
  removeFavorite: (programId: string) => void;
  clearFavorites: () => void;
  isStorageBlocked: boolean;
  maxCap: number;
}

const STORAGE_KEY = 'undip_matcher_favorites_v1';
const MAX_CAP = 12;

const subscribeNoop = () => () => {};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

function isValidProgramId(id: string): boolean {
  return studyPrograms.some((p) => p.id === id);
}

function sanitizeFavorites(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const validIds: string[] = [];
  for (const item of raw) {
    if (typeof item === 'string' && isValidProgramId(item) && !validIds.includes(item)) {
      validIds.push(item);
      if (validIds.length >= MAX_CAP) break;
    }
  }
  return validIds;
}

function loadInitialState(): { items: string[]; blocked: boolean } {
  if (typeof window === 'undefined') return { items: [], blocked: false };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { items: sanitizeFavorites(JSON.parse(stored)), blocked: false };
    }
    return { items: [], blocked: false };
  } catch {
    return { items: [], blocked: true };
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(() => loadInitialState().items);
  const [isStorageBlocked, setIsStorageBlocked] = useState<boolean>(() => loadInitialState().blocked);
  const isHydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const saveToStorage = useCallback((items: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      setIsStorageBlocked(true);
    }
  }, []);

  const isFavorite = useCallback(
    (programId: string) => favorites.includes(programId),
    [favorites]
  );

  const addFavorite = useCallback(
    (programId: string): boolean => {
      if (!isValidProgramId(programId)) return false;
      if (favorites.includes(programId)) return true;
      if (favorites.length >= MAX_CAP) {
        return false;
      }
      const updated = [...favorites, programId];
      setFavorites(updated);
      saveToStorage(updated);
      retroAudio.playBlip(880);
      return true;
    },
    [favorites, saveToStorage]
  );

  const removeFavorite = useCallback(
    (programId: string) => {
      const updated = favorites.filter((id) => id !== programId);
      setFavorites(updated);
      saveToStorage(updated);
      retroAudio.playBlip(440);
    },
    [favorites, saveToStorage]
  );

  const toggleFavorite = useCallback(
    (programId: string): boolean => {
      if (favorites.includes(programId)) {
        removeFavorite(programId);
        return false;
      } else {
        return addFavorite(programId);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      setIsStorageBlocked(true);
    }
  }, []);

  const value: FavoritesContextType = {
    favorites: isHydrated ? favorites : [],
    favoritesCount: isHydrated ? favorites.length : 0,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    isStorageBlocked,
    maxCap: MAX_CAP,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
