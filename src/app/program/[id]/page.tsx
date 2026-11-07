import React, { Suspense } from 'react';
import { studyPrograms } from '@/data/programs';
import { ProgramDetailContent } from '@/components/program/ProgramDetailContent';

export function generateStaticParams() {
  return studyPrograms.map((p) => ({
    id: p.id,
  }));
}

async function ProgramContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProgramDetailContent programId={id} />;
}

export default function ProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#140B07]" />}>
      <ProgramContent params={params} />
    </Suspense>
  );
}
