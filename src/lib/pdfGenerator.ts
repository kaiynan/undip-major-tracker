/**
 * Client-Side PDF Report Generator
 * Lazy-loaded via dynamic import() so initial bundle size impact is 0 KB.
 * Strictly adheres to Round 7 Prompt D specifications:
 * - A4 Portrait, multi-page with running header & footer (Page X of Y)
 * - Ranked Study Programs table (excluding PSDKU, repeating headers on each page)
 * - Faculty rankings table
 * - Interest Profile, Next Steps, and Official Disclaimers
 */

import { APP_NAME, EVENT_NAME, TAGLINE, SITE_URL, SHORT_URL } from '@/config/brand';
import { ProgramScore, FacultyScore, StudyProgram, Faculty } from '@/data/types';
import { isPsdku } from '@/data/types';

export interface PdfExportData {
  nickname?: string;
  programScores: ProgramScore[];
  facultyScores: FacultyScore[];
  programs: StudyProgram[];
  faculties: Faculty[];
  userSummary: {
    topRiasec: { code: string; label: string; score: number }[];
    topDomain: { code: string; label: string; score: number };
    topLearning: { code: string; label: string; score: number };
  } | null;
}

/**
 * Formats current date as YYYY-MM-DD.
 */
export function getPdfDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generates the full multi-page PDF document and returns as Blob.
 */
export async function generateResultsPdf(data: PdfExportData): Promise<Blob> {
  // Lazy-load jsPDF and jspdf-autotable dynamically
  const { jsPDF } = await import('jspdf');
  const autoTableModule = await import('jspdf-autotable');
  // Handle both default export and namespace export
  const autoTable = (autoTableModule.default || autoTableModule) as typeof import('jspdf-autotable').default;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  let cursorY = 22;

  const todayStr = getPdfDateString();
  const cleanNickname = data.nickname?.trim() ? data.nickname.trim().slice(0, 20) : null;

  // Build lookups
  const programMap = new Map<string, StudyProgram>();
  data.programs.forEach((p) => programMap.set(p.id, p));

  const facultyMap = new Map<string, Faculty>();
  data.faculties.forEach((f) => facultyMap.set(f.id, f));

  // Filter out PSDKU from ranked programs (exactly matches UI logic)
  const rankedPrograms = (data.programScores || []).filter((ps) => {
    const prog = programMap.get(ps.programId);
    return !isPsdku(prog);
  });

  // ---------------------------------------------------------------------------
  // 1. TITLE & HEADER BLOCK
  // ---------------------------------------------------------------------------
  // Decorative header band
  doc.setFillColor(36, 19, 12); // #24130C
  doc.rect(0, 0, pageWidth, 12, 'F');
  doc.setFillColor(245, 158, 11); // #F59E0B
  doc.rect(0, 12, pageWidth, 1.2, 'F');

  // Top event title in header band
  doc.setTextColor(253, 230, 138); // #FDE68A
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(EVENT_NAME.toUpperCase(), pageWidth / 2, 8, { align: 'center' });

  // Main Report Title
  cursorY = 22;
  doc.setTextColor(30, 41, 59); // Slate-800
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`LAPORAN HASIL REKOMENDASI JURUSAN`, marginX, cursorY);
  cursorY += 6;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9); // Amber-700
  doc.text(APP_NAME, marginX, cursorY);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`— “${TAGLINE}”`, marginX + doc.getTextWidth(APP_NAME) + 3, cursorY);
  cursorY += 6;

  // Metadata strip (Date, Nickname, Algorithm)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginX, cursorY, pageWidth - marginX * 2, 10, 1.5, 1.5, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);

  const metaTextLeft = cleanNickname
    ? `Nama Peserta: ${cleanNickname}   |   Tanggal: ${todayStr}`
    : `Tanggal Eksplorasi: ${todayStr}`;
  doc.text(metaTextLeft, marginX + 4, cursorY + 6.5);

  const metaTextRight = 'Algoritma: HMIM v1.0 (4 Dimensi)';
  doc.text(metaTextRight, pageWidth - marginX - 4, cursorY + 6.5, { align: 'right' });

  cursorY += 15;

  // ---------------------------------------------------------------------------
  // 2. PROFIL MINAT (RIASEC & DOMAIN SPECIFIC)
  // ---------------------------------------------------------------------------
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. Profil Minat & Preferensi Akademik', marginX, cursorY);
  cursorY += 5;

  const riasecCode =
    data.userSummary?.topRiasec && data.userSummary.topRiasec.length > 0
      ? data.userSummary.topRiasec.map((r) => r.code).join(' / ')
      : 'R / I / A';

  const riasecLabel =
    data.userSummary?.topRiasec && data.userSummary.topRiasec.length > 0
      ? data.userSummary.topRiasec.map((r) => r.label).join(', ')
      : 'Kombinasi Minat Karir Terunggul';

  const domainLabel = data.userSummary?.topDomain?.label || 'Bidang Keilmuan Terunggul';
  const learningLabel = data.userSummary?.topLearning?.label || 'Preferensi Aktivitas Belajar';

  // Box Profil Minat
  doc.setFillColor(254, 252, 232); // Light amber
  doc.setDrawColor(245, 158, 11);
  doc.rect(marginX, cursorY, pageWidth - marginX * 2, 20, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(120, 53, 15);
  doc.setFont('helvetica', 'bold');
  doc.text(`Tipe Minat RIASEC: ${riasecCode}`, marginX + 4, cursorY + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`(${riasecLabel}) — Merefleksikan kecenderungan karakteristik peran dan lingkungan kerja.`, marginX + 4, cursorY + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(120, 53, 15);
  doc.text(`Disiplin Ilmu Utama: ${domainLabel}`, marginX + 4, cursorY + 14.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(`Gaya Belajar Paling Sesuai: ${learningLabel}`, marginX + 90, cursorY + 14.5);

  cursorY += 26;

  // ---------------------------------------------------------------------------
  // 3. PERINGKAT PROGRAM STUDI (FULL TABLE, EXCLUDING PSDKU)
  // ---------------------------------------------------------------------------
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`2. Peringkat Program Studi (${rankedPrograms.length} Jurusan Kampus Semarang)`, marginX, cursorY);
  cursorY += 3;

  const prodiTableBody = rankedPrograms.map((ps, idx) => {
    const prog = programMap.get(ps.programId);
    const fac = prog ? facultyMap.get(prog.facultyId) : null;
    return [
      String(idx + 1),
      prog?.name || ps.programId,
      prog?.degreeLevel || 'S1',
      fac?.name || prog?.facultyId || '-',
      `${ps.totalScore.toFixed(1)}%`,
      `Tier ${ps.tier}`,
    ];
  });

  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX, top: 18, bottom: 16 },
    head: [['No', 'Program Studi', 'Jenjang', 'Fakultas / Sekolah', 'Skor', 'Tier']],
    body: prodiTableBody,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 1.8,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [36, 19, 12], // #24130C
      textColor: [253, 230, 138], // #FDE68A
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 70 },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 50 },
      4: { cellWidth: 18, halign: 'right', fontStyle: 'bold' },
      5: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // ---------------------------------------------------------------------------
  // 4. PERINGKAT FAKULTAS (12 FAKULTAS)
  // ---------------------------------------------------------------------------
  // Add a new section after the study programs table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : cursorY + 10;

  // If near bottom of page (< 60mm), add new page for neatness
  if (currentY > pageHeight - 65) {
    doc.addPage();
    currentY = 22;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. Peringkat Fakultas & Sekolah Vokasi (Skor Rata-rata 3 Jurusan Teratas)', marginX, currentY);
  currentY += 3;

  const facTableBody = (data.facultyScores || []).map((fs, idx) => {
    const fac = facultyMap.get(fs.facultyId);
    return [
      String(idx + 1),
      fac?.name || fs.facultyId,
      fac?.shortName || '-',
      `${fs.aggregateScore.toFixed(1)}%`,
      `Tier ${fs.tier}`,
    ];
  });

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX, top: 18, bottom: 16 },
    head: [['No', 'Fakultas / Sekolah', 'Kode', 'Skor Agregat', 'Tier']],
    body: facTableBody,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 1.8,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [120, 53, 15], // Amber-900
      textColor: [253, 230, 138],
      fontSize: 8.5,
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 95 },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 26, halign: 'right', fontStyle: 'bold' },
      4: { cellWidth: 26, halign: 'center', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // ---------------------------------------------------------------------------
  // 5. LANGKAH SELANJUTNYA & 6. DISCLAIMER RESMI
  // ---------------------------------------------------------------------------
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let notesY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : currentY + 10;

  if (notesY > pageHeight - 55) {
    doc.addPage();
    notesY = 22;
  }

  // Section 4: Langkah Selanjutnya Box
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('4. Panduan Langkah Selanjutnya', marginX, notesY);
  notesY += 4;

  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(marginX, notesY, pageWidth - marginX * 2, 18, 1, 1, 'FD');

  doc.setFontSize(7.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const nextStepsNotice =
    `Informasi resmi mengenai tarif Uang Kuliah Tunggal (UKT Golongan 1 s.d. 8), beasiswa KIP-Kuliah, serta kalender dan alur seleksi masuk (SNBP, SNBT, dan Ujian Mandiri) TA 2026/2027 dapat diakses langsung pada menu Langkah Selanjutnya di aplikasi: ${SITE_URL}/langkah-selanjutnya`;
  const splitNext = doc.splitTextToSize(nextStepsNotice, pageWidth - marginX * 2 - 8);
  doc.text(splitNext, marginX + 4, notesY + 5);

  notesY += 23;

  // Section 5: Disclaimer Box
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('5. Disclaimer & Batasan Rekomendasi', marginX, notesY);
  notesY += 4;

  doc.setFillColor(255, 247, 237); // Warm orange tint
  doc.setDrawColor(251, 146, 60);
  doc.roundedRect(marginX, notesY, pageWidth - marginX * 2, 22, 1, 1, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(124, 45, 18);
  const disclaimerNotice =
    `Hasil rekomendasi ini merupakan instrumen eksplorasi minat akademik berbasis Hybrid Multi-Dimensional Interest Matching (HMIM), bukan merupakan tes psikologi profesional. Hasil ini tidak mengukur kecerdasan intelektual, tidak memprediksi peluang lolos seleksi PTN, dan tidak menjamin keberhasilan studi maupun karier. Seluruh data daya tampung dan UKT mengacu pada keputusan resmi Universitas Diponegoro TA 2026/2027 dan dapat diperbarui sewaktu-waktu oleh panitia PMB UNDIP.`;
  const splitDisc = doc.splitTextToSize(disclaimerNotice, pageWidth - marginX * 2 - 8);
  doc.text(splitDisc, marginX + 4, notesY + 5);

  // ---------------------------------------------------------------------------
  // RUNNING HEADER & FOOTER ON EVERY PAGE (Page X of Y)
  // ---------------------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Running Header (only on page >= 2 since page 1 has hero banner)
    if (i > 1) {
      doc.setFillColor(36, 19, 12);
      doc.rect(0, 0, pageWidth, 8, 'F');
      doc.setTextColor(253, 230, 138);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(`${APP_NAME} — ${EVENT_NAME}`, marginX, 5.5);
      doc.text(todayStr, pageWidth - marginX, 5.5, { align: 'right' });
    }

    // Running Footer (on ALL pages)
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, pageHeight - 9, pageWidth - marginX, pageHeight - 9);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);

    const footerLeft = `Dicetak otomatis melalui ${SHORT_URL} • Tanpa data yang tersimpan di server (100% on-device).`;
    doc.text(footerLeft, marginX, pageHeight - 5);

    const footerRight = `Halaman ${i} dari ${totalPages}`;
    doc.text(footerRight, pageWidth - marginX, pageHeight - 5, { align: 'right' });
  }

  // Return generated PDF as Blob
  return doc.output('blob');
}

/**
 * Initiates download of the generated PDF Blob or Web Share fallback.
 */
export async function downloadOrSharePdf(
  blob: Blob,
  fileName: string = `hasil-rekomendasi-undip-${getPdfDateString()}.pdf`
): Promise<'downloaded'> {
  // Direct client-side browser file download trigger via anchor element
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 400);

  return 'downloaded';
}
