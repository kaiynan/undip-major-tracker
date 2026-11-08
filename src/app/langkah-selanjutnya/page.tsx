import type { Metadata } from 'next';
import { LangkahSelanjutnyaHub } from '@/components/next-steps/LangkahSelanjutnyaHub';

export const metadata: Metadata = {
  title: 'Langkah Selanjutnya — UNDIP Major Matcher 2027',
  description:
    'Pusat informasi resmi biaya kuliah UKT, beasiswa KIP-Kuliah, dan kalender seleksi masuk Universitas Diponegoro 2026/2027.',
};

export default function LangkahSelanjutnyaPage() {
  return <LangkahSelanjutnyaHub />;
}
