import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { studyPrograms, getProgramById } from '@/data/programs';
import { ProgramDetailContent } from '@/components/program/ProgramDetailContent';
import { APP_NAME, SITE_URL } from '@/config/brand';

export function generateStaticParams() {
  return studyPrograms.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const program = getProgramById(id);
  if (!program) {
    return { title: `Program Studi Tidak Ditemukan — ${APP_NAME}` };
  }
  const title = `${program.name} (${program.degreeLevel}) UNDIP — ${APP_NAME}`;
  const description = `${program.name} (${program.degreeLevel}) Universitas Diponegoro. Informasi daya tampung, UKT resmi, akreditasi, kurikulum, dan prospek karier.`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/program/${id}`,
      siteName: APP_NAME,
      locale: 'id_ID',
      type: 'website',
      images: [
        {
          url: '/og/og-program-studi.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og/og-program-studi.png'],
    },
  };
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
