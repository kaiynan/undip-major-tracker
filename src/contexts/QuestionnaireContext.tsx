'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
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
  loadSampleProfile: (type: 'engineering' | 'medical' | 'business' | 'humanities' | 'marine') => void;
  answeredCount: number;
  totalQuestions: number;
  progressPercentage: number;
  isComplete: boolean;
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
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem(STORAGE_KEY);
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
      const savedComparison = localStorage.getItem(COMPARISON_KEY);
      if (savedComparison) {
        setComparisonIds(JSON.parse(savedComparison));
      }
    } catch {
      // Ignore parse errors
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever answers change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // Ignore storage errors
    }
  }, [answers, isHydrated]);

  // Save comparison IDs
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(COMPARISON_KEY, JSON.stringify(comparisonIds));
    } catch {
      // Ignore storage errors
    }
  }, [comparisonIds, isHydrated]);

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

  const loadSampleProfile = (type: 'engineering' | 'medical' | 'business' | 'humanities' | 'marine') => {
    const sample: UserAnswers = {};

    questions.forEach((q) => {
      let score = 3; // neutral default
      if (type === 'engineering') {
        if (q.subdimension === 'R' || q.subdimension === 'I') score = 5;
        else if (q.subdimension === 'D1' || q.subdimension === 'D5') score = 5;
        else if (q.subdimension === 'D4') score = 4;
        else if (q.subdimension === 'analytical' || q.subdimension === 'experimental' || q.subdimension === 'design') score = 5;
        else if (q.subdimension === 'lab_engineering' || q.subdimension === 'computation') score = 5;
        else score = 2;
      } else if (type === 'medical') {
        if (q.subdimension === 'I' || q.subdimension === 'S') score = 5;
        else if (q.subdimension === 'D3') score = 5;
        else if (q.subdimension === 'D2') score = 4;
        else if (q.subdimension === 'human' || q.subdimension === 'experimental' || q.subdimension === 'research') score = 5;
        else if (q.subdimension === 'health_clinical') score = 5;
        else score = 2;
      } else if (type === 'business') {
        if (q.subdimension === 'E' || q.subdimension === 'C') score = 5;
        else if (q.subdimension === 'D6') score = 5;
        else if (q.subdimension === 'D4') score = 4;
        else if (q.subdimension === 'business' || q.subdimension === 'communication') score = 5;
        else if (q.subdimension === 'business_finance') score = 5;
        else score = 2;
      } else if (type === 'humanities') {
        if (q.subdimension === 'A' || q.subdimension === 'S') score = 5;
        else if (q.subdimension === 'D12' || q.subdimension === 'D8') score = 5;
        else if (q.subdimension === 'communication' || q.subdimension === 'human' || q.subdimension === 'research') score = 5;
        else if (q.subdimension === 'creative_cultural' || q.subdimension === 'social_research') score = 5;
        else score = 2;
      } else if (type === 'marine') {
        if (q.subdimension === 'R' || q.subdimension === 'I') score = 5;
        else if (q.subdimension === 'D11' || q.subdimension === 'D2') score = 5;
        else if (q.subdimension === 'field' || q.subdimension === 'experimental') score = 5;
        else if (q.subdimension === 'env_marine') score = 5;
        else score = 2;
      }
      sample[q.id] = score;
    });

    setAnswers(sample);
  };

  return (
    <QuestionnaireContext.Provider
      value={{
        answers,
        setAnswer,
        resetAnswers,
        loadSampleProfile,
        answeredCount,
        totalQuestions,
        progressPercentage,
        isComplete,
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
