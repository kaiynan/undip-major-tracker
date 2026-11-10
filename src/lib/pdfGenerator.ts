/**
 * Client-Side PDF Report Generator — Round 11 Redesign
 *
 * Visual Style: 16-bit retro pixel aesthetic on clean, light cream background (#FFFDF7 / #FBF6EA).
 * Strict adherence to Prompt K specifications:
 * - Page 1: Universitas Diponegoro & SERADIP header, UNLOCK THE UNSEEN title, metadata strip,
 *           STAGE CLEAR Ribbon with dominant interest title (interestTitle.ts),
 *           Top 3 Podium Cards with distinct reasons (matchReasons.ts), Top 3 comparison & score gap,
 *           Clickable Langkah Selanjutnya strip (UKT, Beasiswa, Jadwal).
 * - Page 2+: Full 65-program ranking (strictly 0 PSDKU), alternating retro cream rows, repeatable headers.
 * - Faculty Ranking: 12 faculties with aggregate scores and tier badges.
 * - Last Page: Dedicated SERADIP contact card with Kak Dian (+62 877-4109-7976), Kak Cindy (+62 822-1064-4934),
 *              Instagram (@sedulurdiponegoro), active clickable link annotations, and offline QR code.
 * - Cleanliness: Remove "5. Disclaimer" heading and "Algoritma: HMIM v1.0" jargon.
 *                1-line footer disclaimer on each page.
 *                Filename: hasil-unlock-<yyyy-mm-dd>.pdf.
 */

import { APP_NAME, APP_NAME_SHORT, EVENT_NAME, TAGLINE, SITE_URL, SHORT_URL } from '@/config/brand';
import { ProgramScore, FacultyScore, StudyProgram, Faculty, DimensionScore, isPsdku } from '@/data/types';
import { getTopProgramExplanation, getTopThreeComparison } from '@/lib/matchReasons';
import { getInterestTitle } from '@/lib/interestTitle';
import { CONTACTS, INSTAGRAM, waLink } from '@/config/contact';
import QRCode from 'qrcode';

export interface PdfExportData {
  nickname?: string;
  programScores: ProgramScore[];
  facultyScores: FacultyScore[];
  programs: StudyProgram[];
  faculties: Faculty[];
  dimensionScores?: DimensionScore | null;
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
 * Formats score value with Indonesian decimal comma (e.g. 89,4%).
 */
function formatScoreComma(val: number): string {
  return `${val.toFixed(1).replace('.', ',')}%`;
}

/**
 * Generates the full multi-page PDF document and returns as Blob.
 */
export async function generateResultsPdf(data: PdfExportData): Promise<Blob> {
  // Lazy-load jsPDF and jspdf-autotable dynamically
  const { jsPDF } = await import('jspdf');
  const autoTableModule = await import('jspdf-autotable');
  const autoTable = (autoTableModule.default || autoTableModule) as typeof import('jspdf-autotable').default;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2;
  const todayStr = getPdfDateString();
  const cleanNickname = data.nickname?.trim() ? data.nickname.trim().slice(0, 20) : null;

  // Background color constant: Cream / Ivory (#FFFDF7)
  const bgR = 255;
  const bgG = 253;
  const bgB = 247;

  const drawPageBg = () => {
    doc.setFillColor(bgR, bgG, bgB);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
  };

  // Draw Page 1 Background
  drawPageBg();

  // Build lookups
  const programMap = new Map<string, StudyProgram>();
  data.programs.forEach((p) => programMap.set(p.id, p));

  const facultyMap = new Map<string, Faculty>();
  data.faculties.forEach((f) => facultyMap.set(f.id, f));

  // Filter out PSDKU from ranked programs (strictly 0 PSDKU)
  const rankedPrograms = (data.programScores || []).filter((ps) => {
    const prog = programMap.get(ps.programId);
    return !isPsdku(prog);
  });

  // Fallback safe dimension scores
  const safeDimScores: DimensionScore = data.dimensionScores || {
    riasec: [1, 1, 1, 1, 1, 1],
    domain: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    learning: [1, 1, 1, 1, 1, 1, 1, 1],
    curriculum: [1, 1, 1, 1, 1, 1, 1, 1],
  };

  // ---------------------------------------------------------------------------
  // 1. PAGE 1: TITLE & HEADER BLOCK
  // ---------------------------------------------------------------------------
  // Top decorative band
  doc.setFillColor(36, 19, 12); // #24130C
  doc.rect(0, 0, pageWidth, 11, 'F');
  doc.setFillColor(245, 158, 11); // #F59E0B
  doc.rect(0, 11, pageWidth, 1.2, 'F');

  // Top event title
  doc.setTextColor(253, 230, 138); // #FDE68A
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text(EVENT_NAME, pageWidth / 2, 7.5, { align: 'center' });

  let cursorY = 20;

  // University Subtitle
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(120, 53, 15); // Amber-900
  doc.text(`UNIVERSITAS DIPONEGORO • ${EVENT_NAME}`, marginX, cursorY);
  cursorY += 6;

  // Main App Title: UNLOCK THE UNSEEN
  doc.setTextColor(28, 25, 23); // #1C1917
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(APP_NAME.toUpperCase(), marginX, cursorY);
  cursorY += 5.5;

  // Tagline
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9); // Amber-700
  doc.text(`“${TAGLINE}”`, marginX, cursorY);
  cursorY += 5;

  // Metadata strip (Clean, 0 Jargon, 0 "Algoritma: HMIM v1.0")
  doc.setFillColor(245, 235, 225); // #F5EBE1
  doc.setDrawColor(212, 191, 166); // #D4BFA6
  doc.roundedRect(marginX, cursorY, contentWidth, 8, 1, 1, 'FD');

  doc.setFontSize(7.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(68, 64, 60); // Stone-700
  const metaLeft = cleanNickname
    ? `Nama Peserta: ${cleanNickname}   |   Tanggal: ${todayStr}`
    : `Eksplorasi Minat Mandiri   |   Tanggal: ${todayStr}`;
  doc.text(metaLeft, marginX + 3.5, cursorY + 5.2);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 113, 108);
  const metaRight = `ID Dokumen: UTU-${todayStr.replace(/-/g, '')}`;
  doc.text(metaRight, pageWidth - marginX - 3.5, cursorY + 5.2, { align: 'right' });

  cursorY += 12;

  // ---------------------------------------------------------------------------
  // 2. STAGE CLEAR RIBBON & PROFIL MINAT
  // ---------------------------------------------------------------------------
  // STAGE CLEAR Ribbon
  doc.setFillColor(245, 158, 11); // #F59E0B
  doc.rect(marginX, cursorY, contentWidth, 6.5, 'F');
  doc.setDrawColor(120, 53, 15);
  doc.setLineWidth(0.3);
  doc.rect(marginX, cursorY, contentWidth, 6.5, 'S');

  doc.setTextColor(28, 25, 23);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Profil Minat: STAGE CLEAR — PROFIL POTENSI & MINAT TERBUKA', pageWidth / 2, cursorY + 4.5, { align: 'center' });

  cursorY += 6.5;

  // Determine dominant interest title
  const interestInfo = getInterestTitle(data.userSummary?.topRiasec);

  const riasecCode =
    data.userSummary?.topRiasec && data.userSummary.topRiasec.length > 0
      ? data.userSummary.topRiasec.map((r) => r.code).join(' / ')
      : 'R / I / A';

  const riasecLabel =
    data.userSummary?.topRiasec && data.userSummary.topRiasec.length > 0
      ? data.userSummary.topRiasec.map((r) => r.label).join(', ')
      : 'Minat Terunggul';

  const domainLabel = data.userSummary?.topDomain?.label || 'Sains & Teknologi Terapan';
  const learningLabel = data.userSummary?.topLearning?.label || 'Praktik & Eksperimen Langsung';

  // Profil Minat Box
  const profileBoxH = 24;
  doc.setFillColor(254, 252, 232); // #FEFCE8
  doc.setDrawColor(245, 158, 11);
  doc.rect(marginX, cursorY, contentWidth, profileBoxH, 'FD');

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(120, 53, 15);
  doc.text(interestInfo.title, marginX + 3.5, cursorY + 5.5);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(180, 83, 9);
  doc.text(`(${interestInfo.subtitle})`, marginX + 4 + doc.getTextWidth(interestInfo.title) + 2, cursorY + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(68, 64, 60);
  const narrativeLines = doc.splitTextToSize(interestInfo.narrative, contentWidth - 7);
  doc.text(narrativeLines, marginX + 3.5, cursorY + 10);

  // Bottom info within box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(120, 53, 15);
  doc.text(`Tipe Minat: ${riasecCode}`, marginX + 3.5, cursorY + 19);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(87, 83, 78);
  doc.text(`(${riasecLabel})   |   Disiplin Utama: ${domainLabel}   |   Gaya Belajar: ${learningLabel}`, marginX + 3.5 + doc.getTextWidth(`Tipe Minat: ${riasecCode} `), cursorY + 19);

  cursorY += profileBoxH + 4;

  // ---------------------------------------------------------------------------
  // 3. TOP 3 PODIUM CARDS (DISTINCT EXPLANATIONS & SCORE COMMA)
  // ---------------------------------------------------------------------------
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(28, 25, 23);
  doc.text('1. Top 3 Rekomendasi Program Studi Terbaik (Podium)', marginX, cursorY);
  cursorY += 4;

  const top3 = rankedPrograms.slice(0, 3);
  const facultyLookup: Record<string, string> = {};
  data.faculties.forEach((f) => {
    facultyLookup[f.id] = f.name;
  });
  const top3Comparison = getTopThreeComparison(safeDimScores, top3, data.programs, facultyLookup);

  const podiumStyles = [
    {
      label: 'JUARA 1 (EMAS)',
      badgeBg: [217, 119, 6], // #D97706
      badgeText: [255, 255, 255],
      cardBg: [255, 251, 235], // #FFFBEB
      cardBorder: [245, 158, 11], // #F59E0B
      titleColor: [120, 53, 15],
    },
    {
      label: 'JUARA 2 (PERAK)',
      badgeBg: [71, 85, 105], // #475569
      badgeText: [255, 255, 255],
      cardBg: [248, 250, 252], // #F8FAFC
      cardBorder: [148, 163, 184], // #94A3B8
      titleColor: [30, 41, 59],
    },
    {
      label: 'JUARA 3 (PERUNGGU)',
      badgeBg: [180, 83, 9], // #B45309
      badgeText: [255, 255, 255],
      cardBg: [255, 247, 237], // #FFF7ED
      cardBorder: [234, 88, 12], // #EA580C
      titleColor: [124, 45, 18],
    },
  ];

  top3.forEach((ps, idx) => {
    const prog = programMap.get(ps.programId);
    const fac = prog ? facultyMap.get(prog.facultyId) : null;
    const facName = fac?.name || prog?.facultyId || 'Universitas Diponegoro';
    const style = podiumStyles[idx] || podiumStyles[2];

    const explanation = prog
      ? getTopProgramExplanation(safeDimScores, prog, ps.totalScore, ps.tier, idx + 1, facName)
      : null;

    const cardH = 18.5;
    doc.setFillColor(style.cardBg[0], style.cardBg[1], style.cardBg[2]);
    doc.setDrawColor(style.cardBorder[0], style.cardBorder[1], style.cardBorder[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(marginX, cursorY, contentWidth, cardH, 1, 1, 'FD');

    // Podium badge on left
    const badgeW = 28;
    const badgeH = 4.8;
    doc.setFillColor(style.badgeBg[0], style.badgeBg[1], style.badgeBg[2]);
    doc.roundedRect(marginX + 2.5, cursorY + 2.2, badgeW, badgeH, 0.8, 0.8, 'F');
    doc.setTextColor(style.badgeText[0], style.badgeText[1], style.badgeText[2]);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text(style.label, marginX + 2.5 + badgeW / 2, cursorY + 5.5, { align: 'center' });

    // Program Name & Degree
    const progTitle = `${prog?.degreeLevel || 'S1'} ${prog?.name || ps.programId}`;
    doc.setTextColor(style.titleColor[0], style.titleColor[1], style.titleColor[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(progTitle, marginX + 33, cursorY + 5.8);

    // Score & Tier on Right
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(style.titleColor[0], style.titleColor[1], style.titleColor[2]);
    const scoreText = `${formatScoreComma(ps.totalScore)} • Tier ${ps.tier}`;
    doc.text(scoreText, pageWidth - marginX - 3.5, cursorY + 5.8, { align: 'right' });

    // Faculty Name
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(facName, marginX + 33, cursorY + 9.5);

    // Distinct Primary Reason
    const reasonText = explanation?.primaryReason || 'Kesesuaian profil minat akademik secara menyeluruh.';
    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(120, 53, 15);
    doc.text('Alasan Keselarasan:', marginX + 3.5, cursorY + 14.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const reasonSplit = doc.splitTextToSize(reasonText, contentWidth - 34);
    doc.text(reasonSplit[0] || reasonText, marginX + 30, cursorY + 14.5);

    cursorY += cardH + 2.2;
  });

  cursorY += 1;

  // ---------------------------------------------------------------------------
  // 4. TOP 3 COMPARISON & SCORE GAP CONTEXT
  // ---------------------------------------------------------------------------
  const gapBoxH = 14;
  doc.setFillColor(245, 243, 255); // #F5F3FF (Light lavender)
  doc.setDrawColor(192, 132, 252); // #C084FC
  doc.roundedRect(marginX, cursorY, contentWidth, gapBoxH, 1, 1, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(107, 33, 168); // Purple-800
  doc.text('Perbandingan Dinamika Top 3 & Selisih Skor:', marginX + 3.5, cursorY + 4.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(68, 64, 60);
  const gapLine1 = `Selisih Skor: Juara 1 ke Juara 2 (+${top3Comparison.gap1_2.toFixed(1).replace('.', ',')}%)   |   Juara 2 ke Juara 3 (+${top3Comparison.gap2_3.toFixed(1).replace('.', ',')}%)`;
  doc.text(gapLine1, marginX + 3.5, cursorY + 8);

  const gapSummaryLines = doc.splitTextToSize(top3Comparison.comparisonSummary, contentWidth - 7);
  doc.text(gapSummaryLines[0] || top3Comparison.comparisonSummary, marginX + 3.5, cursorY + 11.5);

  cursorY += gapBoxH + 4;

  // ---------------------------------------------------------------------------
  // 5. CLICKABLE "LANGKAH SELANJUTNYA" STRIP
  // ---------------------------------------------------------------------------
  const nextStripH = 12.5;
  const nextStepsUrl = `${SITE_URL}/langkah-selanjutnya`;
  doc.setFillColor(254, 243, 199); // #FEF3C7
  doc.setDrawColor(245, 158, 11); // #F59E0B
  doc.roundedRect(marginX, cursorY, contentWidth, nextStripH, 1, 1, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(120, 53, 15);
  doc.text('Langkah Selanjutnya: Informasi UKT, Beasiswa & Kalender Seleksi Masuk UNDIP', marginX + 3.5, cursorY + 4.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(68, 64, 60);
  doc.text(`Pelajari tarif UKT Gol. 1–8, beasiswa KIP-K & mitra, serta timeline resmi PMB UNDIP TA 2026/2027 di:`, marginX + 3.5, cursorY + 9);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235); // Blue-600
  const urlDisplay = `${SHORT_URL}/langkah-selanjutnya`;
  doc.text(urlDisplay, marginX + 3.5 + doc.getTextWidth('Pelajari tarif UKT Gol. 1–8, beasiswa KIP-K & mitra, serta timeline resmi PMB UNDIP TA 2026/2027 di: '), cursorY + 9);

  // Clickable link annotation for next steps
  doc.link(marginX, cursorY, contentWidth, nextStripH, { url: nextStepsUrl });

  // ---------------------------------------------------------------------------
  // 6. PAGE 2+: FULL 65-PROGRAM RANKING TABLE (0 PSDKU)
  // ---------------------------------------------------------------------------
  doc.addPage();
  drawPageBg();

  cursorY = 16;
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(28, 25, 23);
  doc.text(`2. Peringkat Program Studi (65 Jurusan Kampus Semarang)`, marginX, cursorY);
  cursorY += 4;

  const prodiTableBody = rankedPrograms.map((ps, idx) => {
    const prog = programMap.get(ps.programId);
    const fac = prog ? facultyMap.get(prog.facultyId) : null;
    return [
      String(idx + 1),
      prog?.name || ps.programId,
      prog?.degreeLevel || 'S1',
      fac?.name || prog?.facultyId || '-',
      formatScoreComma(ps.totalScore),
      `Tier ${ps.tier}`,
    ];
  });

  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX, top: 18, bottom: 16 },
    head: [['No', 'Program Studi', 'Jenjang', 'Fakultas / Sekolah', 'Skor', 'Tier']],
    body: prodiTableBody,
    theme: 'grid',
    showHead: 'everyPage',
    willDrawPage: () => {
      drawPageBg();
    },
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 1.6,
      textColor: [28, 25, 23],
      lineColor: [226, 217, 204], // Warm subtle grid lines
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [36, 19, 12], // #24130C
      textColor: [253, 230, 138], // #FDE68A
      fontSize: 8,
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
      fillColor: [245, 235, 225], // Soft cream zebra
    },
  });

  // ---------------------------------------------------------------------------
  // 7. FACULTY RANKINGS TABLE (12 FAKULTAS)
  // ---------------------------------------------------------------------------
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : cursorY + 10;

  if (currentY > pageHeight - 65) {
    doc.addPage();
    drawPageBg();
    currentY = 16;
  }

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(28, 25, 23);
  doc.text('3. Peringkat Fakultas & Sekolah Vokasi (12 Fakultas - Skor Rata-Rata Top 3 Jurusan)', marginX, currentY);
  currentY += 4;

  const facTableBody = (data.facultyScores || []).map((fs, idx) => {
    const fac = facultyMap.get(fs.facultyId);
    return [
      String(idx + 1),
      fac?.name || fs.facultyId,
      fac?.shortName || '-',
      formatScoreComma(fs.aggregateScore),
      `Tier ${fs.tier}`,
    ];
  });

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginX, right: marginX, top: 18, bottom: 16 },
    head: [['No', 'Fakultas / Sekolah', 'Kode', 'Skor Agregat', 'Tier']],
    body: facTableBody,
    theme: 'grid',
    showHead: 'everyPage',
    willDrawPage: () => {
      drawPageBg();
    },
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 1.6,
      textColor: [28, 25, 23],
      lineColor: [226, 217, 204],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [120, 53, 15], // Amber-900
      textColor: [253, 230, 138],
      fontSize: 8,
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
      fillColor: [245, 235, 225],
    },
  });

  // ---------------------------------------------------------------------------
  // 8. DEDICATED SERADIP CONTACT CARD ON FINAL PAGE (CLICKABLE ANNOTATIONS + OFFLINE QR)
  // ---------------------------------------------------------------------------
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let contactY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : currentY + 10;

  if (contactY > pageHeight - 65) {
    doc.addPage();
    drawPageBg();
    contactY = 16;
  }

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(28, 25, 23);
  doc.text('4. Ngobrol Bareng Mahasiswa Aktif UNDIP (Tim SERADIP)', marginX, contactY);
  contactY += 4;

  const contactCardH = 42;
  doc.setFillColor(240, 253, 244); // #F0FDF4 (Light emerald)
  doc.setDrawColor(16, 185, 129); // #10B981
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, contactY, contentWidth, contactCardH, 1.5, 1.5, 'FD');

  // Subtitle
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 95, 70); // Emerald-800
  doc.text('Punya pertanyaan seputar perkuliahan, tips seleksi, atau kehidupan di kampus UNDIP?', marginX + 3.5, contactY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(4, 120, 87);
  doc.text('Kakak-kakak tim SERADIP (Sedulur Serang Diponegoro) siap menemani dan berdiskusi gratis:', marginX + 3.5, contactY + 9);

  // Contact buttons / links
  const waDian = waLink('dian', 'Halo Kak Dian SERADIP, saya ingin konsultasi hasil tes minat UNDIP.');
  const waCindy = waLink('cindy', 'Halo Kak Cindy SERADIP, saya ingin konsultasi hasil tes minat UNDIP.');
  const igUrl = `https://instagram.com/${INSTAGRAM.handle.replace('@', '')}`;

  const dianContact = CONTACTS.find((c) => c.id === 'dian');
  const cindyContact = CONTACTS.find((c) => c.id === 'cindy');

  // Button 1: Kak Dian
  const btn1X = marginX + 3.5;
  const btn1Y = contactY + 13;
  const btn1W = 86;
  const btn1H = 7.5;
  doc.setFillColor(37, 211, 102); // WhatsApp green
  doc.roundedRect(btn1X, btn1Y, btn1W, btn1H, 1, 1, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'bold');
  const dianLabel = `💬 WhatsApp Kak Dian (${dianContact?.display || '+62 877-4109-7976'})`;
  doc.text(dianLabel, btn1X + btn1W / 2, btn1Y + 5, { align: 'center' });
  doc.link(btn1X, btn1Y, btn1W, btn1H, { url: waDian });

  // Button 2: Kak Cindy
  const btn2X = marginX + 3.5;
  const btn2Y = contactY + 22.5;
  const btn2W = 86;
  const btn2H = 7.5;
  doc.setFillColor(37, 211, 102);
  doc.roundedRect(btn2X, btn2Y, btn2W, btn2H, 1, 1, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'bold');
  const cindyLabel = `💬 WhatsApp Kak Cindy (${cindyContact?.display || '+62 822-1064-4934'})`;
  doc.text(cindyLabel, btn2X + btn2W / 2, btn2Y + 5, { align: 'center' });
  doc.link(btn2X, btn2Y, btn2W, btn2H, { url: waCindy });

  // Button 3: Instagram
  const igBtnX = marginX + 3.5;
  const igBtnY = contactY + 32;
  const igBtnW = 86;
  const igBtnH = 7.5;
  doc.setFillColor(225, 48, 108); // Instagram pink
  doc.roundedRect(igBtnX, igBtnY, igBtnW, igBtnH, 1, 1, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'bold');
  const igLabel = `📸 Instagram: ${INSTAGRAM.handle}`;
  doc.text(igLabel, igBtnX + igBtnW / 2, igBtnY + 5, { align: 'center' });
  doc.link(igBtnX, igBtnY, igBtnW, igBtnH, { url: igUrl });

  // Right Side: Offline Local QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(SITE_URL, {
      margin: 1,
      errorCorrectionLevel: 'M',
      width: 256,
    });
    const qrSize = 25;
    const qrX = pageWidth - marginX - qrSize - 12;
    const qrY = contactY + 12;

    doc.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    doc.link(qrX, qrY, qrSize, qrSize, { url: SITE_URL });

    doc.setFontSize(6.2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 95, 70);
    doc.text('Pindai untuk membuka:', qrX + qrSize / 2, qrY + qrSize + 3, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(4, 120, 87);
    doc.text(APP_NAME, qrX + qrSize / 2, qrY + qrSize + 5.5, { align: 'center' });
  } catch (err) {
    console.error('Failed to generate offline QR for PDF:', err);
  }

  // ---------------------------------------------------------------------------
  // 9. RUNNING HEADERS & 1-LINE FOOTER DISCLAIMER ON EVERY PAGE
  // ---------------------------------------------------------------------------
  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Running Header (only on page >= 2 since page 1 has hero banner)
    if (i > 1) {
      doc.setFillColor(36, 19, 12);
      doc.rect(0, 0, pageWidth, 7.5, 'F');
      doc.setTextColor(253, 230, 138);
      doc.setFontSize(6.8);
      doc.setFont('helvetica', 'bold');
      doc.text(`${APP_NAME} — ${EVENT_NAME}`, marginX, 5.2);
      doc.text(todayStr, pageWidth - marginX, 5.2, { align: 'right' });
    }

    // Running 1-Line Footer on EVERY page (No "5. Disclaimer" heading)
    doc.setDrawColor(212, 191, 166);
    doc.setLineWidth(0.2);
    doc.line(marginX, pageHeight - 8, pageWidth - marginX, pageHeight - 8);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(120, 113, 108);

    const footerDisclaimer = `Hasil eksplorasi minat akademik — bukan tes psikologi resmi. Dicetak otomatis via ${SHORT_URL}.`;
    doc.text(footerDisclaimer, marginX, pageHeight - 4.2);

    const pageNumText = `Halaman ${i} dari ${totalPages}`;
    doc.text(pageNumText, pageWidth - marginX, pageHeight - 4.2, { align: 'right' });
  }

  // Return generated PDF as Blob
  return doc.output('blob');
}

/**
 * Initiates download of the generated PDF Blob or Web Share fallback.
 */
export async function downloadOrSharePdf(
  blob: Blob,
  fileName: string = `hasil-${APP_NAME_SHORT.toLowerCase().replace(/\s+/g, '-')}-${getPdfDateString()}.pdf`
): Promise<'downloaded'> {
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
