import React from 'react';
import type { Metadata } from 'next';
import { faculties } from '@/data/faculties';
import { studyPrograms } from '@/data/programs';
import { ProgramDirectoryClient } from '@/components/program/ProgramDirectoryClient';

export const metadata: Metadata = {
  title: 'Daftar Program Studi S1 & D4 Universitas Diponegoro | UNDIP Major Matcher',
  description:
    'Eksplorasi lengkap 70 program studi (65 program studi di peringkat dan 5 program PSDKU di daftar) Sarjana (S1) dan Sarjana Terapan (D4) di 12 Fakultas dan Sekolah Universitas Diponegoro (UNDIP) dengan daya tampung resmi, CPL, dan prospek karir.',
  keywords: [
    'Daftar Program Studi UNDIP',
    'Jurusan UNDIP',
    'S1 UNDIP',
    'D4 UNDIP',
    'Fakultas Teknik UNDIP',
    'Fakultas Kedokteran UNDIP',
    'Sekolah Vokasi UNDIP',
    'SNBP UNDIP',
    'SNBT UNDIP',
  ],
};

export default function ProgramStudiPage() {
  return (
    <ProgramDirectoryClient
      faculties={faculties}
      programs={studyPrograms}
    />
  );
}
