'use client';

import React, { Suspense } from 'react';
import { UKTSection } from '@/components/next-steps/UKTSection';

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
