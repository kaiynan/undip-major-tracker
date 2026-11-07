'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useSyncExternalStore, ReactNode } from 'react';
import { UserAnswers, ProgramScore, FacultyScore, DimensionScore } from '@/data/types';
import { questions } from '@/data/questions';
import { studyPrograms } from '@/data/programs';
import { faculties } from '@/data/faculties';
import {
  calculateAllScores,
  calculateFacultyScores,
  calculateDimensionScores,
  DEFAULT_CONFIG,
} from '@/lib/engine';

interface UserSummary {
  topRiasec: { code: string; label: string; score: number }[];
  topDomain: { code: string; label: string; score: number };
  topLearning: { code: string; label: string; score: number };
}

interface QuestionnaireContextType {
  answers: UserAnswers;
  setAnswer: (questionId: number, value: number) => void;
  resetAnswers: () => void;
  answeredCount: number;
  totalQuestions: number;
  progressPercentage: number;
  isComplete: boolean;
  hydrated: boolean;
  programScores: ProgramScore[];
  facultyScores: FacultyScore[];
  dimensionScores: DimensionScore | null;
  userSummary: UserSummary | null;
  // Program comparison
  comparisonIds: string[];
  toggleComparison: (programId: string) => void;
  clearComparison: () => void;
  // Helper
  getScoreForProgram: (programId: string) => ProgramScore | undefined;
}

const STORAGE_KEY = 'undip_major_matcher_answers';
const COMPARISON_KEY = 'undip_major_matcher_comparison';

const subscribeNoop = () => () => {};

const QuestionnaireContext = createContext<QuestionnaireContextType | undefined>(undefined);

const DOMAIN_LABELS: Record<string, string> = {
  D1: 'Teknik & Rekayasa',
  D2: 'Sains Alam & Eksakta',
  D3: 'Medis & Ilmu Kesehatan',
  D4: 'Matematika & Sains Data',
  D5: 'Komputer & Teknologi Digital',
  D6: 'Ekonomi, Manajemen & Bisnis',
  D7: 'Hukum & Tata Regulasi',
  D8: 'Sosial & Ilmu Politik',
  D9: 'Psikologi & Perilaku Manusia',
  D10: 'Pertanian, Peternakan & Pangan',
  D11: 'Kelautan, Perikanan & Oseanografi',
  D12: 'Humaniora, Sastra & Komunikasi',
};

const RIASEC_LABELS: Record<string, string> = {
  R: 'Realistic (Praktik & Alat/Mesin)',
  I: 'Investigative (Riset & Analisis)',
  A: 'Artistic (Kreativitas & Desain)',
  S: 'Social (Interaksi & Pelayanan)',
  E: 'Enterprising (Bisnis & Kepemimpinan)',
  C: 'Conventional (Keteraturan & Prosedur)',
};

const LEARNING_LABELS: Record<string, string> = {
  experimental: 'Eksperimental & Praktikum Lab',
  analytical: 'Analitis & Pemecahan Masalah Logika',
  design: 'Perancangan & Pemodelan Desain',
  field: 'Kegiatan Lapangan & Eksplorasi Alam',
  human: 'Interaksi & Pendampingan Manusia',
  business: 'Strategi & Pengelolaan Bisnis',
  research: 'Penelitian Ilmiah & Studi Literatur',
  communication: 'Komunikasi, Presentasi & Publikasi',
};

export function QuestionnaireProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<UserAnswers>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const savedAnswers = localStorage.getItem(STORAGE_KEY);
      return savedAnswers ? JSON.parse(savedAnswers) : {};
    } catch {
      return {};
    }
  });

  const [comparisonIds, setComparisonIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedComparison = localStorage.getItem(COMPARISON_KEY);
      return savedComparison ? JSON.parse(savedComparison) : [];
    } catch {
      return [];
    }
  });

  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);

  // Save to localStorage whenever answers change after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // Ignore storage errors
    }
  }, [answers, hydrated]);

  // Save comparison IDs after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(COMPARISON_KEY, JSON.stringify(comparisonIds));
    } catch {
      // Ignore storage errors
    }
  }, [comparisonIds, hydrated]);

  const setAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const resetAnswers = () => {
    setAnswers({});
    setComparisonIds([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(COMPARISON_KEY);
    } catch {
      // Ignore
    }
  };

  const toggleComparison = (programId: string) => {
    setComparisonIds((prev) => {
      if (prev.includes(programId)) {
        return prev.filter((id) => id !== programId);
      }
      if (prev.length >= 3) {
        // Max 3 programs to compare
        return [...prev.slice(1), programId];
      }
      return [...prev, programId];
    });
  };

  const clearComparison = () => {
    setComparisonIds([]);
  };

  const answeredCount = useMemo(() => {
    return Object.keys(answers).length;
  }, [answers]);

  const totalQuestions = questions.length;
  const isComplete = answeredCount === totalQuestions;
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100);

  // Calculate scores
  const { programScores, facultyScores, dimensionScores, userSummary } = useMemo(() => {
    if (answeredCount === 0) {
      return {
        programScores: [],
        facultyScores: [],
        dimensionScores: null,
        userSummary: null,
      };
    }

    const dims = calculateDimensionScores(answers, questions);
    const pScores = calculateAllScores(answers, studyPrograms, questions, DEFAULT_CONFIG);
    const fScores = calculateFacultyScores(pScores, studyPrograms, faculties, DEFAULT_CONFIG);

    // Compute user summary
    const riasecKeys = ['R', 'I', 'A', 'S', 'E', 'C'];
    const rankedRiasec = riasecKeys
      .map((code, idx) => ({
        code,
        label: RIASEC_LABELS[code] || code,
        score: Math.round(dims.riasec[idx] || 0),
      }))
      .sort((a, b) => b.score - a.score);

    const domainKeys = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11', 'D12'];
    const rankedDomain = domainKeys
      .map((code, idx) => ({
        code,
        label: DOMAIN_LABELS[code] || code,
        score: Math.round(dims.domain[idx] || 0),
      }))
      .sort((a, b) => b.score - a.score);

    const learningKeys = [
      'experimental',
      'analytical',
      'design',
      'field',
      'human',
      'business',
      'research',
      'communication',
    ];
    const rankedLearning = learningKeys
      .map((code, idx) => ({
        code,
        label: LEARNING_LABELS[code] || code,
        score: Math.round(dims.learning[idx] || 0),
      }))
      .sort((a, b) => b.score - a.score);

    const summary: UserSummary = {
      topRiasec: rankedRiasec.slice(0, 3),
      topDomain: rankedDomain[0] || { code: 'D1', label: 'Teknik', score: 0 },
      topLearning: rankedLearning[0] || { code: 'analytical', label: 'Analitis', score: 0 },
    };

    return {
      programScores: pScores,
      facultyScores: fScores,
      dimensionScores: dims,
      userSummary: summary,
    };
  }, [answers, answeredCount]);

  const getScoreForProgram = (programId: string): ProgramScore | undefined => {
    return programScores.find((p) => p.programId === programId);
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        answers,
        setAnswer,
        resetAnswers,
        answeredCount,
        totalQuestions,
        progressPercentage,
        isComplete,
        hydrated,
        programScores,
        facultyScores,
        dimensionScores,
        userSummary,
        comparisonIds,
        toggleComparison,
        clearComparison,
        getScoreForProgram,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const context = useContext(QuestionnaireContext);
  if (!context) {
    throw new Error('useQuestionnaire must be used within a QuestionnaireProvider');
  }
  return context;
}
