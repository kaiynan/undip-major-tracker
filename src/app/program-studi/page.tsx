import React from 'react';
import type { Metadata } from 'next';
import { faculties } from '@/data/faculties';
import { studyPrograms } from '@/data/programs';
import { ProgramDirectoryClient } from '@/components/program/ProgramDirectoryClient';
import { APP_NAME, SITE_URL } from '@/config/brand';

export const metadata: Metadata = {
  title: `Daftar 70 Program Studi S1 & D4 — ${APP_NAME}`,
  description:
    'Eksplorasi lengkap 70 program studi Sarjana (S1) dan Sarjana Terapan (D4) di 12 Fakultas dan Sekolah Universitas Diponegoro (UNDIP) dengan daya tampung resmi, UKT, dan prospek karier.',
  openGraph: {
    title: `Daftar 70 Program Studi S1 & D4 — ${APP_NAME}`,
    description:
      'Eksplorasi lengkap 70 program studi Sarjana (S1) dan Sarjana Terapan (D4) di 12 Fakultas dan Sekolah Universitas Diponegoro (UNDIP) dengan daya tampung resmi, UKT, dan prospek karier.',
    url: `${SITE_URL}/program-studi`,
    siteName: APP_NAME,
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og/og-program-studi.png',
        width: 1200,
        height: 630,
        alt: `Daftar 70 Program Studi S1 & D4 — ${APP_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Daftar 70 Program Studi S1 & D4 — ${APP_NAME}`,
    description:
      'Eksplorasi lengkap 70 program studi Sarjana (S1) dan Sarjana Terapan (D4) di 12 Fakultas dan Sekolah Universitas Diponegoro (UNDIP).',
    images: ['/og/og-program-studi.png'],
  },
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
