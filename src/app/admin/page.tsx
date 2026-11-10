'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { faculties } from '@/data/faculties';
import { studyPrograms } from '@/data/programs';
import { questions } from '@/data/questions';
import { algorithmConfig } from '@/data/config';
import { StudyProgram } from '@/data/types';
import { TierBadge } from '@/components/ui/TierBadge';
import { INTEREST_SPREAD_THRESHOLD } from '@/lib/interestSpread';
import { APP_NAME_SHORT } from '@/config/brand';
import {
  HelpCircle,
  Search,
  ExternalLink,
  Code,
  Layers,
  Sliders,
  AlertTriangle,
  Building2,
  GraduationCap,
  Download,
  Lock,
  LogOut,
  KeyRound,
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        return sessionStorage.getItem('admin_authenticated') === 'true';
      } catch {
        return false;
      }
    }
    return false;
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);

  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'faculties' | 'questions' | 'weights'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState<StudyProgram | null>(null);

  // Filter programs
  const filteredPrograms = useMemo(() => {
    return studyPrograms.filter((p) => {
      const matchSearch =
        searchTerm === '' ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.curriculumKeywords.some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchFaculty = selectedFaculty === 'all' || p.facultyId === selectedFaculty;

      return matchSearch && matchFaculty;
    });
  }, [searchTerm, selectedFaculty]);

  const handleExportJSON = () => {
    const data = {
      version: algorithmConfig.version,
      exportedAt: new Date().toISOString(),
      faculties,
      studyPrograms,
      questions,
      algorithmConfig,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${APP_NAME_SHORT.toLowerCase().replace(/\s+/g, '-')}-db-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctKey = process.env.NEXT_PUBLIC_ADMIN_PASSKEY || 'undip2027';
    if (passkeyInput.trim() === correctKey) {
      try {
        sessionStorage.setItem('admin_authenticated', 'true');
      } catch {
        // ignore
      }
      setIsAuthenticated(true);
      setPasskeyError(false);
    } else {
      setPasskeyError(true);
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('admin_authenticated');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setPasskeyInput('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#190E08] flex items-center justify-center p-4 border-t-2 border-[#78350F]">
        <div className="w-full max-w-md bg-[#24130C] border-2 border-[#78350F] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.6)] text-center space-y-6">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-[#78350F]/40 border-2 border-[#F59E0B] flex items-center justify-center text-[#FDE68A]">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#FDE68A] bg-[#78350F] border border-[#F59E0B] px-3 py-1 rounded-full uppercase tracking-wider">
              Akses Terbatas
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#FFFBEB] mt-3">
              Admin & Data Registry
            </h1>
            <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed">
              Masukkan kunci akses administrator untuk mengelola konfigurasi HMIM dan basis data prodi.
            </p>
          </div>

          {/* Note: this gate is client-side only (the key ships in the JS bundle) and is not security. */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => {
                  setPasskeyInput(e.target.value);
                  if (passkeyError) setPasskeyError(false);
                }}
                placeholder="Kunci Akses Admin"
                aria-label="Kunci Akses Admin"
                className={`w-full bg-[#190E08] border ${
                  passkeyError ? 'border-red-500 ring-1 ring-red-500' : 'border-[#78350F]'
                } text-slate-100 placeholder:text-amber-200/40 text-xs sm:text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#F59E0B] focus:ring-1 focus:ring-[#F59E0B]`}
                autoFocus
              />
            </div>

            {passkeyError && (
              <p className="text-xs text-red-400 flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Kunci akses tidak sesuai. Silakan coba lagi.</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-[0_4px_12px_rgba(245,158,11,0.3)] min-h-[44px] cursor-pointer"
            >
              Buka Akses Admin
            </button>
          </form>

          <div className="pt-2 border-t border-[#78350F]/60">
            <Link
              href="/"
              className="inline-flex items-center justify-center text-xs font-semibold text-amber-300 hover:text-amber-200 transition-colors py-2"
            >
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#190E08] pb-24 pt-6 text-slate-100 border-t-2 border-[#78350F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Admin Header */}
        <div className="bg-[#24130C] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-[#78350F] shadow-[0_4px_24px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#FDE68A] bg-[#78350F] border border-[#F59E0B] px-3 py-1 rounded-full uppercase tracking-wider">
                Admin & Data Registry
              </span>
              <span className="text-xs text-amber-200/80 font-semibold">
                HMIM Engine {algorithmConfig.version}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FFFBEB] mt-2">
              Manajemen Algoritma & Basis Data UNDIP
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-xl leading-relaxed">
              Panel transparansi arsitektur rekomendasi, bobot scoring 4 dimensi, ambang batas tier,
              serta inventarisasi {studyPrograms.length} program studi dan {faculties.length} fakultas/sekolah.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportJSON}
              aria-label="Ekspor Database JSON"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#190E08] hover:bg-[#341A10] text-[#FDE68A] rounded-xl text-xs font-bold transition-colors cursor-pointer border border-[#78350F] min-h-[44px]"
            >
              <Download className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Ekspor Database (JSON)</span>
            </button>
            <button
              onClick={handleLogout}
              aria-label="Kunci Akses Admin"
              className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-[#190E08] hover:bg-red-950/60 text-amber-200/90 hover:text-red-300 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-[#78350F] min-h-[44px]"
              title="Kunci Akses Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[#78350F]/70 pb-3">
          {[
            { id: 'overview', label: 'Ringkasan Sistem & Formula', icon: Sliders },
            { id: 'programs', label: `Database Prodi (${studyPrograms.length})`, icon: GraduationCap },
            { id: 'faculties', label: `Fakultas (${faculties.length})`, icon: Building2 },
            { id: 'questions', label: `Pertanyaan (${questions.length})`, icon: HelpCircle },
            { id: 'weights', label: 'Bobot & Tier Matrix', icon: Code },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'bg-[#78350F] text-[#FFFBEB] border-2 border-[#F59E0B] shadow-xs'
                    : 'bg-[#24130C] text-amber-200/80 hover:bg-[#341A10] border-2 border-[#78350F]'
                }`}
              >
                <Icon className="w-4 h-4 text-[#F59E0B]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#24130C] p-5 rounded-2xl border-2 border-[#78350F] shadow-xs h-full min-h-[130px] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-200/70 uppercase tracking-wider block">
                    Total Program Studi
                  </span>
                  <div className="text-3xl font-black text-[#FDE68A] mt-1">
                    {studyPrograms.length}
                  </div>
                </div>
                <span className="text-xs text-amber-200/70 mt-2 block pt-2 border-t border-[#78350F]/60">
                  54 Sarjana (S1) + 9 Vokasi (D4)
                </span>
              </div>

              <div className="bg-[#24130C] p-5 rounded-2xl border-2 border-[#78350F] shadow-xs h-full min-h-[130px] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-200/70 uppercase tracking-wider block">
                    Fakultas & Sekolah
                  </span>
                  <div className="text-3xl font-black text-amber-400 mt-1">
                    {faculties.length}
                  </div>
                </div>
                <span className="text-xs text-amber-200/70 mt-2 block pt-2 border-t border-[#78350F]/60">
                  11 Fakultas + 1 Sekolah Vokasi
                </span>
              </div>

              <div className="bg-[#24130C] p-5 rounded-2xl border-2 border-[#78350F] shadow-xs h-full min-h-[130px] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-200/70 uppercase tracking-wider block">
                    Jumlah Pertanyaan
                  </span>
                  <div className="text-3xl font-black text-emerald-400 mt-1">
                    {questions.length}
                  </div>
                </div>
                <span className="text-xs text-amber-200/70 mt-2 block pt-2 border-t border-[#78350F]/60">
                  4 Dimensi Interaktif Likert 1–5
                </span>
              </div>

              <div className="bg-[#24130C] p-5 rounded-2xl border-2 border-[#78350F] shadow-xs h-full min-h-[130px] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-200/70 uppercase tracking-wider block">
                    Formula Rekomendasi
                  </span>
                  <div className="text-xl font-black text-amber-400 mt-2">
                    Cosine Similarity
                  </div>
                </div>
                <span className="text-[11px] text-amber-200/70 mt-2 block pt-2 border-t border-[#78350F]/60">
                  Hierarchical Matching (HMIM)
                </span>
              </div>
            </div>

            {/* Symmetrical Grid of 4 Dimensions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-[#FFFBEB] text-base flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#F59E0B]" />
                  <span>Struktur 4 Dimensi Algoritma HMIM (Hierarchical Matching)</span>
                </h3>
                <span className="text-xs font-mono text-amber-200/70">Total Bobot: 100%</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Dimension A */}
                <div className="bg-[#24130C] p-5 rounded-2xl border-2 border-[#78350F] shadow-xs flex flex-col justify-between h-full min-h-[190px]">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-[#FDE68A] bg-[#78350F] px-2.5 py-0.5 rounded-md border border-[#F59E0B]">
                        DIMENSI A
                      </span>
                      <span className="font-mono font-black text-amber-400 text-sm">20% (0.20)</span>
                    </div>
                    <h4 className="font-bold text-[#FFFBEB] text-sm mt-1">RIASEC (Minat Umum)</h4>
                    <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed">
                      Mengukur kecenderungan Realistic, Investigative, Artistic, Social, Enterprising, dan Conventional.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#78350F]/60 text-[11px] text-amber-200/60 font-mono">
                    Soal 01–08 • 8 Pertanyaan
                  </div>
                </div>

                {/* Dimension B */}
                <div className="bg-[#24130C] p-5 rounded-2xl border-2 border-[#F59E0B] shadow-xs flex flex-col justify-between h-full min-h-[190px] relative">
                  <div className="absolute -top-2.5 right-3 bg-[#F59E0B] text-[#190E08] text-[9px] font-black uppercase px-2 py-0.5 rounded font-mono">
                    BOBOT TERTINGGI
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-[#FDE68A] bg-[#78350F] px-2.5 py-0.5 rounded-md border border-[#F59E0B]">
                        DIMENSI B
                      </span>
                      <span className="font-mono font-black text-amber-400 text-sm">35% (0.35)</span>
                    </div>
                    <h4 className="font-bold text-[#FFFBEB] text-sm mt-1">Domain-Specific Interest</h4>
                    <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed">
                      Mengidentifikasi ketertarikan mendalam pada 12 rumpun bidang keilmuan spesifik di UNDIP.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#78350F]/60 text-[11px] text-amber-200/60 font-mono">
                    Soal 09–20 • 12 Pertanyaan
                  </div>
                </div>

                {/* Dimension C */}
                <div className="bg-[#24130C] p-5 rounded-2xl border-2 border-[#78350F] shadow-xs flex flex-col justify-between h-full min-h-[190px]">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-[#FDE68A] bg-[#78350F] px-2.5 py-0.5 rounded-md border border-[#F59E0B]">
                        DIMENSI C
                      </span>
                      <span className="font-mono font-black text-amber-400 text-sm">20% (0.20)</span>
                    </div>
                    <h4 className="font-bold text-[#FFFBEB] text-sm mt-1">Learning Preference</h4>
                    <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed">
                      Mencocokkan gaya belajar: praktikum laboratorium, analisis data, studi lapangan, atau kolaborasi tim.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#78350F]/60 text-[11px] text-amber-200/60 font-mono">
                    Soal 21–28 • 8 Pertanyaan
                  </div>
                </div>

                {/* Dimension D */}
                <div className="bg-[#24130C] p-5 rounded-2xl border-2 border-[#78350F] shadow-xs flex flex-col justify-between h-full min-h-[190px]">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-[#FDE68A] bg-[#78350F] px-2.5 py-0.5 rounded-md border border-[#F59E0B]">
                        DIMENSI D
                      </span>
                      <span className="font-mono font-black text-amber-400 text-sm">25% (0.25)</span>
                    </div>
                    <h4 className="font-bold text-[#FFFBEB] text-sm mt-1">Curriculum & Competency</h4>
                    <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed">
                      Mencocokkan minat dengan mata kuliah spesifik, profil lulusan, dan capaian pembelajaran prodi.
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-[#78350F]/60 text-[11px] text-amber-200/60 font-mono">
                    Soal 29–36 • 8 Pertanyaan
                  </div>
                </div>
              </div>
            </div>

            {/* Formula Card */}
            <div className="bg-[#24130C] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-[#78350F] shadow-xs space-y-4">
              <h3 className="font-extrabold text-[#FFFBEB] text-base flex items-center gap-2">
                <Code className="w-5 h-5 text-[#F59E0B]" />
                <span>Formula Rekomendasi HMIM (Mathematical Formulation)</span>
              </h3>
              <div className="p-5 bg-[#190E08] text-[#FDE68A] rounded-2xl font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto border border-[#78350F]/80 space-y-3">
                <div className="text-amber-100 font-bold text-sm sm:text-base border-b border-[#78350F]/60 pb-2">
                  S_prodi = (0.20 × R) + (0.35 × D) + (0.20 × L) + (0.25 × C)
                </div>
                <div className="text-amber-200/80 text-xs leading-relaxed">
                  Dimana R, D, L, C adalah nilai kemiripan kosinus (cosine similarity) antara vektor jawaban pengguna dan vektor profil program studi yang dinormalisasi pada skala 0–100%.
                </div>
                <div className="text-amber-100 font-bold text-sm sm:text-base border-b border-[#78350F]/60 pt-2 pb-2">
                  Score_F = (S1 + S2 + S3) / n
                </div>
                <div className="text-amber-200/80 text-xs leading-relaxed">
                  Skor fakultas dihitung secara hierarkis dari rata-rata maksimal 3 program studi dengan skor kecocokan tertinggi di fakultas tersebut.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Programs Database Explorer */}
        {activeTab === 'programs' && (
          <div className="space-y-4">
            <div className="bg-[#24130C] rounded-2xl p-4 border-2 border-[#78350F] shadow-xs flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-amber-200/60 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari prodi, kurikulum, atau kompetensi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#190E08] border border-[#78350F] rounded-xl text-[#FFFBEB] placeholder:text-stone-500 focus:outline-hidden focus:border-[#F59E0B]"
                />
              </div>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 text-xs sm:text-sm bg-[#190E08] border border-[#78350F] rounded-xl text-[#FFFBEB] focus:outline-hidden focus:border-[#F59E0B] cursor-pointer"
              >
                <option value="all">Semua Fakultas ({faculties.length})</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-[#24130C] rounded-2xl border-2 border-[#78350F] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#190E08] border-b border-[#78350F] text-[#FDE68A] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">ID Prodi</th>
                      <th className="px-4 py-3">Nama Program Studi</th>
                      <th className="px-4 py-3">Fakultas</th>
                      <th className="px-4 py-3">Jenjang</th>
                      <th className="px-4 py-3">Tahun Akademik</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#78350F]/40">
                    {filteredPrograms.map((p) => {
                      const fac = faculties.find((f) => f.id === p.facultyId);
                      return (
                        <tr key={p.id} className="hover:bg-[#341A10]/60 transition-colors">
                          <td className="px-4 py-3 font-mono font-semibold text-amber-200/80">
                            {p.id}
                          </td>
                          <td className="px-4 py-3 font-bold text-[#FFFBEB]">
                            {p.name}
                          </td>
                          <td className="px-4 py-3 text-amber-200/80">
                            {fac?.name} ({fac?.shortName})
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded font-bold bg-[#78350F] text-[#FDE68A] border border-[#F59E0B]/60">
                              {p.degreeLevel}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-amber-200/80 text-[11px]">
                            TA {p.academicYear}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => setSelectedProgram(p)}
                              className="text-[#F59E0B] hover:text-[#FDE68A] font-bold hover:underline cursor-pointer"
                            >
                              Lihat Vektor
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Faculties */}
        {activeTab === 'faculties' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {faculties.map((f) => {
              const count = studyPrograms.filter((p) => p.facultyId === f.id).length;
              return (
                <div
                  key={f.id}
                  className="bg-[#24130C] p-5 rounded-2xl border-2 border-[#78350F] shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FDE68A] bg-[#78350F] px-2 py-0.5 rounded border border-[#F59E0B]/60">
                      ID: {f.id}
                    </span>
                    <span className="text-xs font-semibold text-amber-200/60">
                      {count} Program Studi
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#FFFBEB] text-base">{f.name}</h3>
                    <p className="text-xs text-amber-200/70 mt-1 line-clamp-2">{f.description}</p>
                  </div>
                  <a
                    href={f.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#F59E0B] hover:text-[#FDE68A] hover:underline font-semibold"
                  >
                    <span>Website: {f.websiteUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 4: Questions */}
        {activeTab === 'questions' && (
          <div className="bg-[#24130C] rounded-2xl border-2 border-[#78350F] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#190E08] border-b border-[#78350F] text-[#FDE68A] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Dimensi</th>
                    <th className="px-4 py-3">Subdimensi</th>
                    <th className="px-4 py-3">Teks Pertanyaan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#78350F]/40">
                  {questions.map((q) => (
                    <tr key={q.id} className="hover:bg-[#341A10]/60">
                      <td className="px-4 py-3 font-bold text-amber-200/80">#{q.id}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-[#190E08] text-[#FDE68A] border border-[#78350F]">
                          {q.dimension}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold text-[#F59E0B]">
                        {q.subdimension}
                      </td>
                      <td className="px-4 py-3 text-amber-100 font-medium">{q.text}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Weights & Thresholds */}
        {activeTab === 'weights' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Weights */}
            <div className="bg-[#24130C] p-6 rounded-2xl border-2 border-[#78350F] shadow-xs space-y-4">
              <h3 className="font-bold text-[#FFFBEB] text-base">Konfigurasi Bobot Dimensi</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-[#190E08] rounded-xl border border-[#78350F]">
                  <div>
                    <span className="font-bold text-xs text-[#FFFBEB] block">1. RIASEC (Minat Umum)</span>
                    <span className="text-[11px] text-amber-200/60">8 Pertanyaan (R, I, A, S, E, C)</span>
                  </div>
                  <span className="font-mono font-bold text-[#FDE68A] text-sm">20% (0.20)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#78350F]/60 rounded-xl border border-[#F59E0B]">
                  <div>
                    <span className="font-bold text-xs text-[#FFFBEB] block">2. Domain-Specific (Bidang Ilmu)</span>
                    <span className="text-[11px] text-[#FDE68A]">12 Pertanyaan (D1 - D12)</span>
                  </div>
                  <span className="font-mono font-black text-[#FDE68A] text-sm">35% (0.35)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#190E08] rounded-xl border border-[#78350F]">
                  <div>
                    <span className="font-bold text-xs text-[#FFFBEB] block">3. Learning Preference (Gaya Belajar)</span>
                    <span className="text-[11px] text-amber-200/60">8 Pertanyaan</span>
                  </div>
                  <span className="font-mono font-bold text-[#FDE68A] text-sm">20% (0.20)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#190E08] rounded-xl border border-[#78350F]">
                  <div>
                    <span className="font-bold text-xs text-[#FFFBEB] block">4. Curriculum & Competency</span>
                    <span className="text-[11px] text-amber-200/60">8 Pertanyaan</span>
                  </div>
                  <span className="font-mono font-bold text-[#FDE68A] text-sm">25% (0.25)</span>
                </div>
              </div>
            </div>

            {/* Thresholds */}
            <div className="bg-[#24130C] p-6 rounded-2xl border-2 border-[#78350F] shadow-xs space-y-4">
              <h3 className="font-bold text-[#FFFBEB] text-base">Ambang Batas Tier (0–100)</h3>
              <div className="space-y-2.5">
                {algorithmConfig.tierThresholds.map((t) => (
                  <div key={t.tier} className="p-3 rounded-xl border border-[#78350F] bg-[#190E08] space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TierBadge tier={t.tier} size="sm" />
                        <span className="text-xs font-medium text-amber-200/80">{t.label}</span>
                      </div>
                      <span className="font-mono font-bold text-[#FDE68A] text-xs">
                        {t.min} – {t.max}%
                      </span>
                    </div>
                    {t.tier === 'D' && (
                      <p className="text-[10px] text-amber-300/80 italic pl-1">
                        Bukan berarti tidak bisa — jelajahi alasan dan pilihan lainnya.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Interest Spread Threshold (Prompt G Round 9) */}
            <div className="bg-[#24130C] p-6 rounded-2xl border-2 border-[#78350F] shadow-xs space-y-3 md:col-span-2">
              <h3 className="font-bold text-[#FFFBEB] text-base">Ambang Batas Minat Tersebar (Spread Threshold)</h3>
              <div className="p-3.5 rounded-xl border border-amber-600/70 bg-[#190E08] text-xs text-amber-100/90 leading-relaxed space-y-1.5">
                <p>
                  Ambang batas deteksi minat tersebar ditetapkan sebesar <strong className="text-amber-300 font-mono">{INTEREST_SPREAD_THRESHOLD}%</strong> (selisih skor peringkat #1 dan #5), dihitung dari persentil ke-25 responden terfokus berdasarkan simulasi empiris di <code className="text-amber-300 font-mono">docs/spread-threshold.md</code>.
                </p>
                <p className="text-amber-200/70 text-[11px]">
                  Jika selisih skor prodi #1 dan #5 &le; {INTEREST_SPREAD_THRESHOLD}%, sistem menampilkan banner panduan untuk membandingkan prodi dan berkonsultasi, tanpa mengubah peringkat rekomendasi.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Vector Inspector Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#24130C] rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-[#78350F] space-y-4 text-white">
            <div className="flex items-center justify-between pb-2 border-b border-[#78350F]/70">
              <h3 className="font-bold text-[#FFFBEB] text-base">{selectedProgram.name}</h3>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-xs text-amber-200/70 hover:text-white font-bold cursor-pointer"
              >
                Tutup
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold text-[#FDE68A] block mb-1">Vektor RIASEC [R, I, A, S, E, C]:</span>
                <code className="bg-[#190E08] border border-[#78350F] p-2 rounded block font-mono text-[#FDE68A]">
                  {JSON.stringify(selectedProgram.riasecProfile)}
                </code>
              </div>
              <div>
                <span className="font-bold text-[#FDE68A] block mb-1">Vektor Domain [D1 - D12]:</span>
                <code className="bg-[#190E08] border border-[#78350F] p-2 rounded block font-mono text-amber-300">
                  {JSON.stringify(selectedProgram.domainProfile)}
                </code>
              </div>
              <div>
                <span className="font-bold text-[#FDE68A] block mb-1">Vektor Learning [8 dimensi]:</span>
                <code className="bg-[#190E08] border border-[#78350F] p-2 rounded block font-mono text-emerald-300">
                  {JSON.stringify(selectedProgram.learningProfile)}
                </code>
              </div>
              <div>
                <span className="font-bold text-[#FDE68A] block mb-1">Vektor Curriculum [8 dimensi]:</span>
                <code className="bg-[#190E08] border border-[#78350F] p-2 rounded block font-mono text-amber-200">
                  {JSON.stringify(selectedProgram.curriculumProfile)}
                </code>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
