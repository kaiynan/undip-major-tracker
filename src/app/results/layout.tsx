import type { Metadata } from 'next';
import { APP_NAME, TAGLINE, SITE_URL } from '@/config/brand';

export const metadata: Metadata = {
  title: `Hasil Rekomendasi Jurusan — ${APP_NAME}`,
  description:
    `Lihat hasil rekomendasi program studi Universitas Diponegoro berdasarkan minatmu dengan metode HMIM. ${TAGLINE}.`,
  openGraph: {
    title: `Hasil Rekomendasi Jurusan — ${APP_NAME}`,
    description: `Lihat hasil rekomendasi program studi Universitas Diponegoro berdasarkan minatmu dengan metode HMIM.`,
    url: `${SITE_URL}/results`,
    siteName: APP_NAME,
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og/og-results.png',
        width: 1200,
        height: 630,
        alt: `Hasil Rekomendasi Jurusan — ${APP_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Hasil Rekomendasi Jurusan — ${APP_NAME}`,
    description: `Lihat hasil rekomendasi program studi Universitas Diponegoro berdasarkan minatmu dengan metode HMIM.`,
    images: ['/og/og-results.png'],
  },
};

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
