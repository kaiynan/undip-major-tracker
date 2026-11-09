import type { Metadata } from 'next';
import { LangkahSelanjutnyaHub } from '@/components/next-steps/LangkahSelanjutnyaHub';
import { APP_NAME, SITE_URL } from '@/config/brand';

export const metadata: Metadata = {
  title: `Langkah Selanjutnya: Biaya, Beasiswa & Jadwal — ${APP_NAME} 2027`,
  description:
    'Pusat informasi resmi biaya kuliah UKT Golongan 1–8, beasiswa KIP-Kuliah & katalog beasiswa, serta kalender seleksi masuk Universitas Diponegoro TA 2026/2027.',
  openGraph: {
    title: `Langkah Selanjutnya: Biaya, Beasiswa & Jadwal — ${APP_NAME} 2027`,
    description:
      'Pusat informasi resmi biaya kuliah UKT Golongan 1–8, beasiswa KIP-Kuliah & katalog beasiswa, serta kalender seleksi masuk Universitas Diponegoro TA 2026/2027.',
    url: `${SITE_URL}/langkah-selanjutnya`,
    siteName: APP_NAME,
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og/og-langkah-selanjutnya.png',
        width: 1200,
        height: 630,
        alt: `Langkah Selanjutnya: Biaya, Beasiswa & Jadwal — ${APP_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Langkah Selanjutnya: Biaya, Beasiswa & Jadwal — ${APP_NAME} 2027`,
    description:
      'Pusat informasi resmi biaya kuliah UKT Golongan 1–8, beasiswa KIP-Kuliah, dan kalender seleksi masuk Universitas Diponegoro.',
    images: ['/og/og-langkah-selanjutnya.png'],
  },
};

export default function LangkahSelanjutnyaPage() {
  return <LangkahSelanjutnyaHub />;
}
