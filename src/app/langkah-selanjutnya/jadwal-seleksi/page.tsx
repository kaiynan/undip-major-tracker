import type { Metadata } from 'next';
import { CalendarSection } from '@/components/next-steps/CalendarSection';

export const metadata: Metadata = {
  title: 'Jadwal Seleksi Masuk — UNDIP Major Matcher 2027',
  description:
    'Alur dan kalender seleksi masuk SNBP, SNBT, dan Ujian Mandiri Universitas Diponegoro TA 2026/2027 beserta alokasi daya tampung resmi.',
};

export default function JadwalSeleksiPage() {
  return <CalendarSection />;
}
