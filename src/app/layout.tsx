import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { QuestionnaireProvider } from '@/contexts/QuestionnaireContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { MobileBottomNav } from '@/components/ui/MobileBottomNav';
import { PwaRegistrar } from '@/components/ui/PwaRegistrar';
import { Suspense } from 'react';
import { APP_NAME, APP_NAME_SHORT, TAGLINE, EVENT_NAME, SITE_URL } from '@/config/brand';

const geistSans = localFont({
  src: '../../public/fonts/geist-sans.woff2',
  variable: '--font-geist-sans',
  display: 'swap',
});

const geistMono = localFont({
  src: '../../public/fonts/geist-mono.woff2',
  variable: '--font-geist-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#002060',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${APP_NAME} — ${TAGLINE}`,
  description:
    `Platform rekomendasi program studi Universitas Diponegoro (UNDIP) berbasis Hybrid Multi-Dimensional Interest Matching (HMIM) untuk siswa SMA/SMK/MA. ${EVENT_NAME}.`,
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_NAME_SHORT,
  },
  openGraph: {
    title: `${APP_NAME} — ${TAGLINE}`,
    description: `Temukan jurusan impian di Universitas Diponegoro melalui ${APP_NAME}. ${TAGLINE}.`,
    url: SITE_URL,
    siteName: APP_NAME,
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/og/og-default.png',
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — ${TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} — ${TAGLINE}`,
    description: `Temukan jurusan impian di Universitas Diponegoro melalui ${APP_NAME}. ${TAGLINE}.`,
    images: ['/og/og-default.png'],
  },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon-192.png',
  },
  keywords: [
    'UNDIP',
    'Universitas Diponegoro',
    'Jurusan UNDIP',
    'Define Your Next Move',
    'Next Move',
    'Rekomendasi Kuliah',
    'Tes Minat Jurusan',
    'SNBP',
    'SNBT',
    'SMK',
    'SMA',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        <PwaRegistrar />
        <QuestionnaireProvider>
          <FavoritesProvider>
            <Suspense fallback={<header className="h-16 bg-white border-b border-slate-200" />}>
              <Navbar />
            </Suspense>
            <main className="flex-1 pb-20 md:pb-0">
              <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center p-8 text-slate-400">Memuat...</div>}>
                {children}
              </Suspense>
            </main>
            <Suspense fallback={null}>
              <Footer />
            </Suspense>
            <Suspense fallback={null}>
              <MobileBottomNav />
            </Suspense>
          </FavoritesProvider>
        </QuestionnaireProvider>
      </body>
    </html>
  );
}
