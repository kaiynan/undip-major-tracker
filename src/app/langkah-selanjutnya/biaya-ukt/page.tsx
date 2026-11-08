import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { UKTSection } from '@/components/next-steps/UKTSection';

export const metadata: Metadata = {
  title: 'Biaya Kuliah (UKT) — UNDIP Major Matcher 2027',
  description:
    'Rincian besaran Uang Kuliah Tunggal (UKT) resmi Golongan 1 s.d. 8 per program studi Universitas Diponegoro TA 2026/2027.',
};

export default function BiayaUKTPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-8 text-center text-amber-200 font-pixel text-xs">
          Memuat data tarif UKT...
        </div>
      }
    >
      <UKTSection />
    </Suspense>
  );
}
