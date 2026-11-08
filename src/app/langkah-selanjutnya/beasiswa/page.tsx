import type { Metadata } from 'next';
import { KIPKSection } from '@/components/next-steps/KIPKSection';
import { APP_NAME } from '@/config/brand';

export const metadata: Metadata = {
  title: `Beasiswa KIP-Kuliah — ${APP_NAME} 2027`,
  description:
    'Informasi dan panduan resmi beasiswa KIP-Kuliah untuk calon mahasiswa baru Universitas Diponegoro 2026/2027.',
};

export default function BeasiswaPage() {
  return <KIPKSection />;
}
