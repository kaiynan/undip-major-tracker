import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { QuestionnaireProvider } from '@/contexts/QuestionnaireContext';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { MobileBottomNav } from '@/components/ui/MobileBottomNav';
import { PwaRegistrar } from '@/components/ui/PwaRegistrar';
import { Suspense } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#002060',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'UNDIP Major Matcher — Find Your Future at UNDIP',
  description:
    'Platform rekomendasi program studi Universitas Diponegoro (UNDIP) berbasis Hybrid Multi-Dimensional Interest Matching (HMIM) untuk siswa SMA/SMK/MA.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'UNDIP Matcher',
  },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon-192.png',
  },
  keywords: [
    'UNDIP',
    'Universitas Diponegoro',
    'Jurusan UNDIP',
    'Major Matcher',
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
          <Suspense fallback={<header className="h-16 bg-white border-b border-slate-200" />}>
            <Navbar />
          </Suspense>
          <main className="flex-1 pb-20 md:pb-0">
            <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center p-8 text-slate-400">Memuat...</div>}>
              {children}
            </Suspense>
          </main>
          <Footer />
          <Suspense fallback={null}>
            <MobileBottomNav />
          </Suspense>
        </QuestionnaireProvider>
      </body>
    </html>
  );
}
