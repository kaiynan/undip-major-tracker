import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'UNDIP Major Matcher — Rekomendasi Program Studi',
    short_name: 'UNDIP Matcher',
    description:
      'Platform rekomendasi program studi Universitas Diponegoro (UNDIP) berbasis Hybrid Multi-Dimensional Interest Matching (HMIM).',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#002060',
    orientation: 'portrait-primary',
    icons: [
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
    ],
    categories: ['education', 'productivity'],
    lang: 'id',
  };
}
