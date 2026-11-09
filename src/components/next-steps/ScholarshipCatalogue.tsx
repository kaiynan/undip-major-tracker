'use client';

import React, { useState, useMemo } from 'react';
import { scholarshipsData, Scholarship } from '@/data/scholarships';
import {
  ExternalLink,
  Search,
  Filter,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Calendar,
  Building,
  Sparkles,
  Info,
} from 'lucide-react';

function getHostName(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function ScholarshipCatalogue() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrganizer, setSelectedOrganizer] = useState<string>('Semua');
  const [selectedCoverage, setSelectedCoverage] = useState<string>('Semua');
  const [selectedDegree, setSelectedDegree] = useState<string>('Semua');

  const organizers: Array<{ label: string; value: string }> = [
    { label: 'Semua Penyelenggara', value: 'Semua' },
    { label: 'Pemerintah', value: 'Pemerintah' },
    { label: 'Yayasan', value: 'Yayasan' },
    { label: 'Perusahaan', value: 'Perusahaan' },
    { label: 'Kampus UNDIP', value: 'Kampus' },
  ];

  const coverageTypes: Array<{ label: string; value: string }> = [
    { label: 'Semua Bantuan', value: 'Semua' },
    { label: 'Biaya Kuliah (UKT)', value: 'biaya_kuliah' },
    { label: 'Uang Saku & Pelatihan', value: 'uang_saku' },
  ];

  const degreeTypes: Array<{ label: string; value: string }> = [
    { label: 'Semua Jenjang', value: 'Semua' },
    { label: 'Jenjang S1', value: 'S1' },
    { label: 'Jenjang D4', value: 'D4' },
  ];

  const filteredScholarships = useMemo(() => {
    return scholarshipsData.filter((s: Scholarship) => {
      // Name & organizer search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.nama.toLowerCase().includes(q);
        const matchesOrg = s.penyelenggara.toLowerCase().includes(q);
        const matchesBenefit = s.jenisBantuan.toLowerCase().includes(q);
        if (!matchesName && !matchesOrg && !matchesBenefit) return false;
      }

      // Organizer filter
      if (selectedOrganizer !== 'Semua' && s.kategoriPenyelenggara !== selectedOrganizer) {
        return false;
      }

      // Coverage filter
      if (selectedCoverage !== 'Semua') {
        if (selectedCoverage === 'biaya_kuliah' && s.coverageType !== 'biaya_kuliah' && s.coverageType !== 'penuh') {
          return false;
        }
        if (selectedCoverage === 'uang_saku' && s.coverageType !== 'uang_saku' && s.coverageType !== 'penuh') {
          return false;
        }
      }

      // Degree filter
      if (selectedDegree !== 'Semua') {
        if (!s.jenjang.includes(selectedDegree as 'S1' | 'D4')) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedOrganizer, selectedCoverage, selectedDegree]);

  return (
    <div className="space-y-6 text-white pt-4">
      {/* 1. Header & Title Section */}
      <div className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-4 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#2A160E] border-2 border-[#F59E0B] flex items-center justify-center text-[#FDE68A] shadow-[2px_2px_0_0_#000] shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-pixel text-xs xs:text-sm sm:text-base text-[#FDE68A]">
                  Katalog Beasiswa Lainnya
                </h2>
                <span className="text-[10px] font-mono font-bold bg-[#140B07] text-amber-300 border border-[#78350F] px-2 py-0.5 rounded-full">
                  {scholarshipsData.length} Program Terverifikasi
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-200/80 mt-1 leading-relaxed">
                Pilihan beasiswa pemerintah, yayasan filantropi, korporasi, dan internal Universitas Diponegoro untuk mahasiswa jenjang S1 & D4.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Honest Mandatory Disclaimer */}
      <div className="bg-[#24130C] border-2 border-amber-600/70 rounded-2xl p-4 sm:p-5 flex items-start gap-3 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-pixel text-[11px] sm:text-xs text-[#FDE68A]">
            Ketentuan & Jadwal Seleksi
          </h4>
          <p className="text-amber-100/90 leading-relaxed font-sans">
            Syarat dan jadwal pendaftaran dapat berubah setiap tahun. Selalu verifikasi langsung ke situs resmi penyelenggara. Data di bawah ini dihimpun dari portal resmi masing-masing mitra dan institusi terkait.
          </p>
        </div>
      </div>

      {/* 3. Search and Filter Chips Bar */}
      <div className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-4 sm:p-6 space-y-4 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari beasiswa berdasarkan nama, penyelenggara, atau manfaat..."
            aria-label="Cari beasiswa"
            className="w-full bg-[#140B07] border-2 border-[#78350F] focus:border-[#F59E0B] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-amber-200/40 focus:outline-none transition-colors min-h-[44px]"
          />
        </div>

        {/* Filter Groups */}
        <div className="space-y-3 pt-1">
          {/* Penyelenggara Filter Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono text-amber-300/80 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3 h-3 text-amber-400" />
              <span>Kategori Penyelenggara</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {organizers.map((org) => {
                const isActive = selectedOrganizer === org.value;
                return (
                  <button
                    key={org.value}
                    type="button"
                    onClick={() => setSelectedOrganizer(org.value)}
                    aria-pressed={isActive}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
                      isActive
                        ? 'bg-[#F59E0B] text-stone-950 border-2 border-amber-600 shadow-[2px_2px_0_0_#000]'
                        : 'bg-[#140B07] text-amber-200/90 border border-[#78350F] hover:bg-[#2A160E] hover:text-white'
                    }`}
                  >
                    {org.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Jenis Bantuan & Jenjang Chips Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* Jenis Bantuan */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-amber-300/80 uppercase tracking-wider">
                Cakupan Bantuan
              </span>
              <div className="flex flex-wrap gap-2">
                {coverageTypes.map((cov) => {
                  const isActive = selectedCoverage === cov.value;
                  return (
                    <button
                      key={cov.value}
                      type="button"
                      onClick={() => setSelectedCoverage(cov.value)}
                      aria-pressed={isActive}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
                        isActive
                          ? 'bg-emerald-600 text-stone-950 border-2 border-emerald-400 shadow-[2px_2px_0_0_#000]'
                          : 'bg-[#140B07] text-amber-200/90 border border-[#78350F] hover:bg-[#2A160E] hover:text-white'
                      }`}
                    >
                      {cov.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Jenjang */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono text-amber-300/80 uppercase tracking-wider">
                Jenjang Kuliah
              </span>
              <div className="flex flex-wrap gap-2">
                {degreeTypes.map((deg) => {
                  const isActive = selectedDegree === deg.value;
                  return (
                    <button
                      key={deg.value}
                      type="button"
                      onClick={() => setSelectedDegree(deg.value)}
                      aria-pressed={isActive}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
                        isActive
                          ? 'bg-sky-600 text-stone-950 border-2 border-sky-400 shadow-[2px_2px_0_0_#000]'
                          : 'bg-[#140B07] text-amber-200/90 border border-[#78350F] hover:bg-[#2A160E] hover:text-white'
                      }`}
                    >
                      {deg.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Scholarships Cards List */}
      <div className="space-y-4">
        {filteredScholarships.length === 0 ? (
          <div className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-8 text-center text-amber-200/80 space-y-2">
            <Info className="w-8 h-8 text-amber-400/60 mx-auto" />
            <h3 className="font-pixel text-sm text-[#FFFBEB]">
              Tidak Ada Beasiswa yang Cocok
            </h3>
            <p className="text-xs">
              Coba sesuaikan kata kunci pencarian atau ubah pilihan filter di atas.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            {filteredScholarships.map((s) => (
              <div
                key={s.id}
                className="bg-[#1F120B] border-2 border-[#78350F] rounded-2xl p-4 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.4)] space-y-4 hover:border-amber-600/80 transition-all"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-[#78350F]/60">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                      <span className="text-[10px] font-mono font-bold bg-[#78350F] text-[#FDE68A] px-2.5 py-0.5 rounded-lg uppercase tracking-wider border border-[#F59E0B]/60">
                        {s.kategoriPenyelenggara}
                      </span>
                      {s.jenjang.map((j) => (
                        <span
                          key={j}
                          className="text-[10px] font-mono font-bold bg-[#140B07] text-sky-300 border border-sky-800/60 px-2 py-0.5 rounded-lg"
                        >
                          Jenjang {j}
                        </span>
                      ))}
                      <span className="text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-lg">
                        Resmi
                      </span>
                    </div>

                    <h3 className="font-pixel text-xs sm:text-sm text-[#FFFBEB] break-words">
                      {s.nama}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-amber-200/80 mt-1">
                      <Building className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{s.penyelenggara}</span>
                    </div>
                  </div>

                  <a
                    href={s.linkResmi}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 bg-[#F59E0B] hover:bg-amber-400 text-stone-950 font-pixel text-[10px] sm:text-[11px] font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-[2px_2px_0_0_#000] shrink-0 self-start sm:self-auto min-h-[44px] cursor-pointer"
                  >
                    <span>Kunjungi Situs Resmi</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Manfaat & Cakupan Bantuan */}
                <div className="bg-[#140B07] border border-[#78350F]/70 rounded-xl p-3.5 sm:p-4 space-y-1">
                  <span className="text-[10px] font-mono text-amber-300 uppercase tracking-wider font-bold block">
                    Bentuk Bantuan & Manfaat
                  </span>
                  <p className="text-xs text-amber-100/90 leading-relaxed">
                    {s.jenisBantuan}
                  </p>
                </div>

                {/* Syarat Umum */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-amber-300/80 uppercase tracking-wider font-bold block">
                    Kriteria & Persyaratan Umum
                  </span>
                  <ul className="space-y-1.5 text-xs text-amber-100/85">
                    {s.syaratUmum.map((syarat, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{syarat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Periode Buka & Attribution Line */}
                <div className="pt-3 border-t border-[#78350F]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[10px] sm:text-[11px] text-amber-200/70 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Periode Buka: {s.periodeBuka}</span>
                  </div>

                  <div className="flex items-center gap-1 text-[9.5px] sm:text-[10px]">
                    <span>Sumber: {getHostName(s.sourceUrl)}, diakses {s.retrievedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. Actionable Tips Block: "Tips Persiapan Beasiswa" */}
      <div className="bg-[#24130C] border-2 border-[#78350F] rounded-2xl sm:rounded-3xl p-5 sm:p-7 space-y-4 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3 pb-3 border-b border-[#78350F]/60">
          <div className="p-2 sm:p-2.5 bg-[#78350F] text-[#FDE68A] rounded-xl border border-[#F59E0B] shrink-0">
            <Lightbulb className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-pixel text-xs sm:text-sm text-[#FFFBEB]">
              Tips Sukses Persiapan Beasiswa Kuliah
            </h3>
            <p className="text-[11px] sm:text-xs text-amber-200/80 mt-0.5">
              Langkah strategis dari persyaratan resmi untuk meningkatkan peluang lolos seleksi beasiswa
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-[#190E08] p-3.5 sm:p-4 rounded-xl border border-[#78350F] space-y-1.5">
            <div className="font-bold text-xs text-[#FDE68A] flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#78350F] text-amber-300 font-pixel text-[10px] flex items-center justify-center shrink-0">1</span>
              <span>Siapkan Dokumen Sosial & Ekonomi Lebih Awal</span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-100/80 leading-relaxed pl-7">
              Surat Keterangan Tidak Mampu (SKTM) dari kelurahan, bukti DTKS/KKS, rekening listrik, dan slip gaji orang tua sering kali memakan waktu pengurusan. Siapkan jauh sebelum tanggal batas akhir pendaftaran.
            </p>
          </div>

          <div className="bg-[#190E08] p-3.5 sm:p-4 rounded-xl border border-[#78350F] space-y-1.5">
            <div className="font-bold text-xs text-[#FDE68A] flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#78350F] text-amber-300 font-pixel text-[10px] flex items-center justify-center shrink-0">2</span>
              <span>Pertahankan IPK Stabil di Atas 3.00</span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-100/80 leading-relaxed pl-7">
              Untuk beasiswa on-going (semester 2–5), indeks prestasi kumulatif merupakan syarat administratif pertama. Nilai IPK konsisten ≥ 3.00 (bahkan 3.25 untuk beasiswa prestasi) memberikan keunggulan kompetitif.
            </p>
          </div>

          <div className="bg-[#190E08] p-3.5 sm:p-4 rounded-xl border border-[#78350F] space-y-1.5">
            <div className="font-bold text-xs text-[#FDE68A] flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#78350F] text-amber-300 font-pixel text-[10px] flex items-center justify-center shrink-0">3</span>
              <span>Bangun Portofolio Organisasi & Prestasi</span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-100/80 leading-relaxed pl-7">
              Program kepemimpinan seperti Tanoto TELADAN, Djarum, dan Paragon menilai keaktifan organisasi, kepedulian sosial, dan inisiatif kepemimpinan di samping nilai akademik.
            </p>
          </div>

          <div className="bg-[#190E08] p-3.5 sm:p-4 rounded-xl border border-[#78350F] space-y-1.5">
            <div className="font-bold text-xs text-[#FDE68A] flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-[#78350F] text-amber-300 font-pixel text-[10px] flex items-center justify-center shrink-0">4</span>
              <span>Hindari Pendaftaran Beasiswa Ganda</span>
            </div>
            <p className="text-[11px] sm:text-xs text-amber-100/80 leading-relaxed pl-7">
              Peraturan kementerian dan institusi donor melarang penerimaan beasiswa ganda dari sumber APBN/APBD atau sesama korporasi. Pastikan fokus pada beasiswa yang paling selaras dengan profilmu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
