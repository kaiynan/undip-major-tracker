import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UNDIP Major Matcher — Rekomendasi Program Studi',
    short_name: 'UNDIP Matcher',
    description:
      'Platform rekomendasi program studi Universitas Diponegoro (UNDIP) berbasis Hybrid Multi-Dimensional Interest Matching (HMIM).',
    start_url: '/',
    display: 'standalone',
    background_color: '#190E08',
    theme_color: '#190E08',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['education', 'productivity'],
    lang: 'id',
  };
}
