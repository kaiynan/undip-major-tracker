import type { Metadata } from 'next';
import { KIPKSection } from '@/components/next-steps/KIPKSection';
import { ScholarshipCatalogue } from '@/components/next-steps/ScholarshipCatalogue';
import { APP_NAME } from '@/config/brand';

export const metadata: Metadata = {
  title: `Informasi Beasiswa Lengkap & KIP-Kuliah — ${APP_NAME} 2027`,
  description:
    'Panduan resmi beasiswa KIP-Kuliah dan katalog beasiswa pemerintah, yayasan, dan korporasi untuk mahasiswa Universitas Diponegoro TA 2026/2027.',
};

export default function BeasiswaPage() {
  return (
    <div className="space-y-8">
      {/* Existing KIP-Kuliah Content */}
      <KIPKSection />

      {/* Catalogue Beasiswa Lainnya */}
      <ScholarshipCatalogue />
    </div>
  );
}
