'use client';

import React from 'react';
import { ProgramScore, FacultyScore, StudyProgram } from '@/data/types';
import { ShareableResultCardModal } from './ShareableResultCardModal';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  programScores: ProgramScore[];
  facultyScores?: FacultyScore[];
  programs: StudyProgram[];
  userSummary: {
    topRiasec: { code: string; label: string; score: number }[];
    topDomain: { code: string; label: string; score: number };
    topLearning: { code: string; label: string; score: number };
  } | null;
}

/**
 * ShareModal renders the full Shareable Result Card modal (Story & Square 1080px Canvas 2D)
 * with Web Share API and PNG download fallbacks, plus clipboard & WhatsApp sharing.
 */
export function ShareModal({
  isOpen,
  onClose,
  programScores,
  facultyScores,
  programs,
  userSummary,
}: ShareModalProps) {
  return (
    <ShareableResultCardModal
      isOpen={isOpen}
      onClose={onClose}
      programScores={programScores}
      facultyScores={facultyScores}
      programs={programs}
      userSummary={userSummary}
    />
  );
}
