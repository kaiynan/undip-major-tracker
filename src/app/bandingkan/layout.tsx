import type { Metadata } from 'next';
import { APP_NAME, SITE_URL } from '@/config/brand';

export const metadata: Metadata = {
  title: `Bandingkan Program Studi — ${APP_NAME}`,
  description:
    'Bandingkan program studi pilihanmu di Universitas Diponegoro berdampingan: fakultas, jenjang, kuota SNBP/SNBT/Mandiri, UKT resmi, kurikulum khas, dan prospek karier.',
  openGraph: {
    title: `Bandingkan Program Studi — ${APP_NAME}`,
    description:
      'Bandingkan program studi pilihanmu di Universitas Diponegoro berdampingan: fakultas, jenjang, kuota SNBP/SNBT/Mandiri, UKT resmi, kurikulum khas, dan prospek karier.',
    url: `${SITE_URL}/bandingkan`,
    siteName: APP_NAME,
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og/og-bandingkan.png',
        width: 1200,
        height: 630,
        alt: `Bandingkan Program Studi — ${APP_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Bandingkan Program Studi — ${APP_NAME}`,
    description:
      'Bandingkan program studi pilihanmu di Universitas Diponegoro: kuota masuk, UKT resmi, kurikulum, dan prospek karier.',
    images: ['/og/og-bandingkan.png'],
  },
};

export default function BandingkanLayout({ children }: { children: React.ReactNode }) {
  return children;
}
