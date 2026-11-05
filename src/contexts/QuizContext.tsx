'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { UserAnswers, ProgramScore, FacultyScore, DimensionScore } from '@/data/types';

interface QuizState {
  answers: UserAnswers;
  currentQuestion: number;
  isCompleted: boolean;
  programScores: ProgramScore[];
  facultyScores: FacultyScore[];
  dimensionScores: DimensionScore | null;
}

interface QuizContextValue extends QuizState {
  setAnswer: (questionId: number, value: number) => void;
  setCurrentQuestion: (q: number) => void;
  setCompleted: (completed: boolean) => void;
  setProgramScores: (scores: ProgramScore[]) => void;
  setFacultyScores: (scores: FacultyScore[]) => void;
  setDimensionScores: (scores: DimensionScore) => void;
  resetQuiz: () => void;
  getProgress: () => number;
  totalQuestions: number;
}

const initialState: QuizState = {
  answers: {},
  currentQuestion: 0,
  isCompleted: false,
  programScores: [],
  facultyScores: [],
  dimensionScores: null,
};

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export function QuizProvider({ children, totalQuestions = 36 }: { children: React.ReactNode; totalQuestions?: number }) {
  const [state, setState] = useState<QuizState>(initialState);

  const setAnswer = useCallback((questionId: number, value: number) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value },
    }));
  }, []);

  const setCurrentQuestion = useCallback((q: number) => {
    setState(prev => ({ ...prev, currentQuestion: q }));
  }, []);

  const setCompleted = useCallback((completed: boolean) => {
    setState(prev => ({ ...prev, isCompleted: completed }));
  }, []);

  const setProgramScores = useCallback((scores: ProgramScore[]) => {
    setState(prev => ({ ...prev, programScores: scores }));
  }, []);

  const setFacultyScores = useCallback((scores: FacultyScore[]) => {
    setState(prev => ({ ...prev, facultyScores: scores }));
  }, []);

  const setDimensionScores = useCallback((scores: DimensionScore) => {
    setState(prev => ({ ...prev, dimensionScores: scores }));
  }, []);

  const resetQuiz = useCallback(() => {
    setState(initialState);
  }, []);

  const getProgress = useCallback(() => {
    const answered = Object.keys(state.answers).length;
    return Math.round((answered / totalQuestions) * 100);
  }, [state.answers, totalQuestions]);

  const value = useMemo(
    () => ({
      ...state,
      setAnswer,
      setCurrentQuestion,
      setCompleted,
      setProgramScores,
      setFacultyScores,
      setDimensionScores,
      resetQuiz,
      getProgress,
      totalQuestions,
    }),
    [state, setAnswer, setCurrentQuestion, setCompleted, setProgramScores, setFacultyScores, setDimensionScores, resetQuiz, getProgress, totalQuestions]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz(): QuizContextValue {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
