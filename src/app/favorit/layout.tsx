import type { Metadata } from 'next';
import { APP_NAME, SITE_URL } from '@/config/brand';

export const metadata: Metadata = {
  title: `Program Studi Favoritku — ${APP_NAME}`,
  description:
    'Daftar program studi pilihan favoritmu di Universitas Diponegoro. Simpan, pantau, dan bandingkan pilihan jurusan impianmu.',
  openGraph: {
    title: `Program Studi Favoritku — ${APP_NAME}`,
    description:
      'Daftar program studi pilihan favoritmu di Universitas Diponegoro. Simpan, pantau, dan bandingkan pilihan jurusan impianmu.',
    url: `${SITE_URL}/favorit`,
    siteName: APP_NAME,
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og/og-favorit.png',
        width: 1200,
        height: 630,
        alt: `Program Studi Favoritku — ${APP_NAME}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Program Studi Favoritku — ${APP_NAME}`,
    description:
      'Daftar program studi pilihan favoritmu di Universitas Diponegoro. Simpan, pantau, dan bandingkan pilihan jurusan impianmu.',
    images: ['/og/og-favorit.png'],
  },
};

export default function FavoritLayout({ children }: { children: React.ReactNode }) {
  return children;
}
