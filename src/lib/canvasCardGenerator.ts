/**
 * Canvas 2D Shareable Result Card Generator — Round 11 Redesign
 *
 * Concept: GAME STAGE CLEAR — UNLOCK YOUR POTENTIAL
 * Retro 16-bit victory screen identity, offline-ready, 100% on-device generation.
 *
 * Supported Formats:
 * - Story: 1080 x 1920 (9:16)
 * - Square: 1080 x 1080 (1:1)
 * - Landscape: 1920 x 1080 (16:9)
 *
 * Supported Themes:
 * - Golden Hour (Default): Warm amber, sunset orange, deep brown
 * - Malam: Midnight navy, deep indigo, cyan/sky stars
 * - Fajar: Dawn hues, rose magenta, dawn gold
 */

import { APP_NAME, APP_NAME_SHORT, TAGLINE, EVENT_NAME, SITE_URL, SHORT_URL } from '@/config/brand';
import { INSTAGRAM } from '@/config/contact';
import { getInterestTitle } from '@/lib/interestTitle';
import QRCode from 'qrcode';

export type CardFormat = 'story' | 'square' | 'landscape';
export type CardTheme = 'golden-hour' | 'malam' | 'fajar';

export interface CardProgramItem {
  rank: number;
  name: string;
  facultyName: string;
  degreeLevel: string;
  score: number;
  tier: string;
  primaryReason?: string;
}

export interface CardData {
  nickname?: string;
  topPrograms: CardProgramItem[];
  riasecCode?: string;
  topDomainLabel?: string;
  topLearningLabel?: string;
  topRiasec?: { code: string; label: string; score: number }[];
}

export interface ThemePalette {
  id: CardTheme;
  name: string;
  bgStops: [number, string][];
  outerBorder: string;
  innerBorder: string;
  cornerSquare: string;
  horizonColors: string[];
  ribbonBg: string;
  ribbonBorder: string;
  ribbonText: string;
  cardBg1: string;
  cardBg2: string;
  cardBorder1: string;
  cardBorder2: string;
  goldMedal: string;
  silverMedal: string;
  bronzeMedal: string;
  accentText: string;
  starColor: string;
}

export const THEMES: Record<CardTheme, ThemePalette> = {
  'golden-hour': {
    id: 'golden-hour',
    name: 'Golden Hour (Bawaan)',
    bgStops: [
      [0, '#100704'],
      [0.22, '#241007'],
      [0.48, '#451A08'],
      [0.72, '#7C2D12'],
      [0.86, '#9A3412'],
      [1, '#1A0E08'],
    ],
    outerBorder: '#78350F',
    innerBorder: '#F59E0B',
    cornerSquare: '#FDE68A',
    horizonColors: ['#5C2323', '#78350F', '#9A3412', '#B45309', '#D97706'],
    ribbonBg: '#F59E0B',
    ribbonBorder: '#FDE68A',
    ribbonText: '#1A0E08',
    cardBg1: '#26130B',
    cardBg2: '#1D0D07',
    cardBorder1: '#F59E0B',
    cardBorder2: '#78350F',
    goldMedal: '#F59E0B',
    silverMedal: '#CBD5E1',
    bronzeMedal: '#B45309',
    accentText: '#FDE68A',
    starColor: '#FDE68A',
  },
  malam: {
    id: 'malam',
    name: 'Malam (Midnight)',
    bgStops: [
      [0, '#020617'],
      [0.25, '#0B132B'],
      [0.5, '#1C2541'],
      [0.75, '#1E3A8A'],
      [0.9, '#1E293B'],
      [1, '#050B18'],
    ],
    outerBorder: '#1E3A8A',
    innerBorder: '#38BDF8',
    cornerSquare: '#BAE6FD',
    horizonColors: ['#0C1938', '#1E3A8A', '#2563EB', '#38BDF8', '#7DD3FC'],
    ribbonBg: '#0284C7',
    ribbonBorder: '#38BDF8',
    ribbonText: '#020617',
    cardBg1: '#0F172A',
    cardBg2: '#0B1329',
    cardBorder1: '#38BDF8',
    cardBorder2: '#1E3A8A',
    goldMedal: '#F59E0B',
    silverMedal: '#93C5FD',
    bronzeMedal: '#64748B',
    accentText: '#7DD3FC',
    starColor: '#BAE6FD',
  },
  fajar: {
    id: 'fajar',
    name: 'Fajar (Dawn Aura)',
    bgStops: [
      [0, '#1A0C1E'],
      [0.25, '#2E1038'],
      [0.5, '#4A154B'],
      [0.72, '#7C2D55'],
      [0.88, '#B45309'],
      [1, '#190E08'],
    ],
    outerBorder: '#831843',
    innerBorder: '#F472B6',
    cornerSquare: '#FCE7F3',
    horizonColors: ['#4A154B', '#701A75', '#9D174D', '#C026D3', '#F472B6'],
    ribbonBg: '#DB2777',
    ribbonBorder: '#F472B6',
    ribbonText: '#1A0C1E',
    cardBg1: '#28102A',
    cardBg2: '#1E0A20',
    cardBorder1: '#F472B6',
    cardBorder2: '#831843',
    goldMedal: '#F59E0B',
    silverMedal: '#F472B6',
    bronzeMedal: '#EA580C',
    accentText: '#FCE7F3',
    starColor: '#FDE68A',
  },
};

/**
 * Ensures pixel and sans fonts are fully loaded before Canvas 2D drawing.
 */
export async function ensureFontsLoaded(): Promise<void> {
  if (typeof document === 'undefined') return;
  try {
    await document.fonts.ready;
    await Promise.allSettled([
      document.fonts.load('16px "Press Start 2P"'),
      document.fonts.load('24px "Press Start 2P"'),
      document.fonts.load('32px "Press Start 2P"'),
      document.fonts.load('16px "Silkscreen"'),
      document.fonts.load('24px "Silkscreen"'),
      document.fonts.load('bold 24px "Geist Sans"'),
      document.fonts.load('20px "Geist Sans"'),
    ]);
  } catch (err) {
    console.warn('Font loading check encountered an issue, proceeding with system fallbacks:', err);
  }
}

/**
 * Wraps text into lines that do not exceed maxWidth.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Fits text within maxWidth and maxLines by reducing font size if necessary.
 */
function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
  startFontSize: number,
  minFontSize: number,
  fontFamily: string,
  fontWeight: string = 'bold'
): { lines: string[]; fontSize: number } {
  let fontSize = startFontSize;

  while (fontSize >= minFontSize) {
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    const wrapped = wrapText(ctx, text, maxWidth);
    if (wrapped.length <= maxLines) {
      return { lines: wrapped, fontSize };
    }
    fontSize -= 2;
  }

  // Fallback: at minimum font size, truncate last line with ellipsis
  ctx.font = `${fontWeight} ${minFontSize}px ${fontFamily}`;
  const lines = wrapText(ctx, text, maxWidth);
  if (lines.length > maxLines) {
    const keep = lines.slice(0, maxLines);
    let last = keep[maxLines - 1];
    while (ctx.measureText(`${last}...`).width > maxWidth && last.length > 0) {
      last = last.slice(0, -1);
    }
    keep[maxLines - 1] = `${last}...`;
    return { lines: keep, fontSize: minFontSize };
  }
  return { lines, fontSize: minFontSize };
}

/**
 * Draws the retro pixel dither horizon.
 */
function drawDitherHorizon(ctx: CanvasRenderingContext2D, y: number, width: number, colors: string[]) {
  const step = 8;
  for (let row = 0; row < 6; row++) {
    const color = colors[row % colors.length];
    ctx.fillStyle = color;
    for (let x = 0; x < width; x += step * 2) {
      const offsetX = (row % 2) * step;
      ctx.fillRect(x + offsetX, y + row * step, step, step);
    }
  }
}

/**
 * Draws deterministic stars in the sky.
 */
function drawStars(ctx: CanvasRenderingContext2D, width: number, height: number, count: number, starColor: string) {
  ctx.fillStyle = starColor;
  let seed = 42;
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < count; i++) {
    const x = pseudoRandom() * width;
    const y = pseudoRandom() * (height * 0.45);
    const size = pseudoRandom() > 0.7 ? 6 : 4;
    ctx.globalAlpha = 0.4 + pseudoRandom() * 0.6;
    ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
  }
  ctx.globalAlpha = 1.0;
}

/**
 * Draws double pixel border around the canvas.
 */
function drawPixelFrame(ctx: CanvasRenderingContext2D, width: number, height: number, theme: ThemePalette) {
  // Outer frame
  ctx.strokeStyle = theme.outerBorder;
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, width - 14, height - 14);

  // Inner frame
  ctx.strokeStyle = theme.innerBorder;
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, width - 36, height - 36);

  // Corner decorative pixel squares
  ctx.fillStyle = theme.cornerSquare;
  const corners = [
    [10, 10],
    [width - 26, 10],
    [10, height - 26],
    [width - 26, height - 26],
  ];
  corners.forEach(([x, y]) => {
    ctx.fillRect(x, y, 16, 16);
  });
}

/**
 * Draws an offline, zero-network QR code onto the canvas.
 */
function drawQrCode(
  ctx: CanvasRenderingContext2D,
  url: string,
  x: number,
  y: number,
  size: number,
  fgColor: string = '#000000',
  bgColor: string = '#FFFFFF'
) {
  try {
    const qr = QRCode.create(url, { errorCorrectionLevel: 'M' });
    const modCount = qr.modules.size;
    const cellSize = Math.floor(size / modCount);
    const actualSize = cellSize * modCount;
    const startX = x + Math.floor((size - actualSize) / 2);
    const startY = y + Math.floor((size - actualSize) / 2);

    // Padding background
    ctx.fillStyle = bgColor;
    ctx.fillRect(startX - 6, startY - 6, actualSize + 12, actualSize + 12);

    // QR modules
    ctx.fillStyle = fgColor;
    for (let r = 0; r < modCount; r++) {
      for (let c = 0; c < modCount; c++) {
        if (qr.modules.get(r, c)) {
          ctx.fillRect(startX + c * cellSize, startY + r * cellSize, cellSize, cellSize);
        }
      }
    }
  } catch (err) {
    console.warn('QR code generation failed, drawing placeholder:', err);
    ctx.fillStyle = bgColor;
    ctx.fillRect(x, y, size, size);
    ctx.fillStyle = fgColor;
    ctx.font = '10px monospace';
    ctx.fillText('QR CODE', x + 10, y + size / 2);
  }
}

/**
 * Format score with decimal comma (Indonesian standard: 89,4%)
 */
function formatScoreIndonesian(score: number): string {
  return `${score.toFixed(1).replace('.', ',')}%`;
}

/**
 * Renders the result card onto an HTML Canvas 2D context.
 */
export async function renderResultCard(
  canvas: HTMLCanvasElement,
  data: CardData,
  format: CardFormat = 'story',
  themeId: CardTheme = 'golden-hour'
): Promise<void> {
  await ensureFontsLoaded();

  const theme = THEMES[themeId] || THEMES['golden-hour'];

  // Dimension mapping
  let width = 1080;
  let height = 1920;
  if (format === 'square') {
    width = 1080;
    height = 1080;
  } else if (format === 'landscape') {
    width = 1920;
    height = 1080;
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get Canvas 2D context');

  ctx.imageSmoothingEnabled = true;

  // 1. BACKGROUND GRADIENT
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  for (const [stop, color] of theme.bgStops) {
    bgGradient.addColorStop(stop, color);
  }
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // 2. STARS & DITHER HORIZON
  const starCount = format === 'landscape' ? 65 : format === 'story' ? 50 : 30;
  drawStars(ctx, width, height, starCount, theme.starColor);
  const horizonY = format === 'story' ? height * 0.78 : height * 0.74;
  drawDitherHorizon(ctx, horizonY, width, theme.horizonColors);

  // 3. PIXEL FRAME
  drawPixelFrame(ctx, width, height, theme);

  // Derive interest title from RIASEC traits
  const interestTitle = getInterestTitle(data.topRiasec);
  const headline = data.nickname && data.nickname.trim().length > 0
    ? `Hasil eksplorasi ${data.nickname.trim()}`
    : 'Hasil eksplorasimu!';

  const programs = (data.topPrograms || []).slice(0, 3);
  const padX = format === 'landscape' ? 64 : 64;

  // =========================================================================
  // FORMAT A: STORY (1080 x 1920)
  // =========================================================================
  if (format === 'story') {
    let cursorY = 90;

    // Header strip
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.accentText;
    ctx.font = '15px "Press Start 2P", monospace';
    ctx.fillText('UNIVERSITAS DIPONEGORO', width / 2, cursorY);
    cursorY += 32;

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '13px "Press Start 2P", monospace';
    ctx.fillText(EVENT_NAME.toUpperCase(), width / 2, cursorY);
    cursorY += 50;

    // STAGE CLEAR Ribbon
    const ribbonW = 560;
    const ribbonH = 46;
    const ribbonX = (width - ribbonW) / 2;
    ctx.fillStyle = theme.ribbonBg;
    ctx.fillRect(ribbonX, cursorY - 32, ribbonW, ribbonH);
    ctx.strokeStyle = theme.ribbonBorder;
    ctx.lineWidth = 3;
    ctx.strokeRect(ribbonX, cursorY - 32, ribbonW, ribbonH);

    ctx.fillStyle = theme.ribbonText;
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillText('★ STAGE CLEAR ★', width / 2, cursorY - 3);
    cursorY += 46;

    // App Name Large
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '34px "Press Start 2P", monospace';
    ctx.fillText(APP_NAME.toUpperCase(), width / 2, cursorY);
    cursorY += 40;

    // Tagline
    ctx.font = '22px "Geist Sans", sans-serif';
    ctx.fillStyle = theme.accentText;
    ctx.fillText(`“${TAGLINE}”`, width / 2, cursorY);
    cursorY += 48;

    // Personal Headline & Interest Title Card
    const titleBoxH = 120;
    const contentW = width - padX * 2;
    ctx.fillStyle = theme.cardBg1;
    ctx.fillRect(padX, cursorY, contentW, titleBoxH);
    ctx.strokeStyle = theme.cardBorder2;
    ctx.lineWidth = 3;
    ctx.strokeRect(padX, cursorY, contentW, titleBoxH);

    ctx.textAlign = 'left';
    ctx.fillStyle = theme.accentText;
    ctx.font = '15px "Press Start 2P", monospace';
    ctx.fillText(headline.toUpperCase(), padX + 24, cursorY + 36);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px "Geist Sans", sans-serif';
    ctx.fillText(`Julukan Minat: ${interestTitle.title} (${interestTitle.subtitle})`, padX + 24, cursorY + 76);

    // Interest Chips inside Title Box
    const chipText = `Minat: ${data.riasecCode || 'R/I/A'} • ${data.topDomainLabel || 'Bidang Terunggul'}`;
    ctx.fillStyle = theme.accentText;
    ctx.font = '16px "Geist Sans", sans-serif';
    ctx.fillText(chipText, padX + 24, cursorY + 104);

    cursorY += titleBoxH + 40;

    // SECTION HEADER: 3 PROGRAM STUDI PALING SELARAS
    ctx.textAlign = 'left';
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.fillStyle = theme.accentText;
    ctx.fillText('▶ 3 PROGRAM STUDI PALING SELARAS', padX, cursorY);
    cursorY += 32;

    // PODIUM CARDS: Rank #1 (Largest), Rank #2, Rank #3
    const cardHeights = [280, 220, 220];

    for (let i = 0; i < programs.length; i++) {
      const prog = programs[i];
      const cardH = cardHeights[i] || 220;
      const isFirst = i === 0;

      ctx.fillStyle = isFirst ? theme.cardBg1 : theme.cardBg2;
      ctx.fillRect(padX, cursorY, contentW, cardH);
      ctx.strokeStyle = isFirst ? theme.cardBorder1 : theme.cardBorder2;
      ctx.lineWidth = isFirst ? 4 : 2;
      ctx.strokeRect(padX, cursorY, contentW, cardH);

      // Medal / Rank Box
      const medalW = isFirst ? 80 : 66;
      const medalH = isFirst ? 80 : 66;
      const medalX = padX + 24;
      const medalY = cursorY + 24;

      const medalColor = i === 0 ? theme.goldMedal : i === 1 ? theme.silverMedal : theme.bronzeMedal;
      ctx.fillStyle = medalColor;
      ctx.fillRect(medalX, medalY, medalW, medalH);
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.strokeRect(medalX, medalY, medalW, medalH);

      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.font = isFirst ? '32px "Press Start 2P", monospace' : '24px "Press Start 2P", monospace';
      ctx.fillText(`#${prog.rank}`, medalX + medalW / 2, medalY + (isFirst ? 54 : 44));

      // Program text area
      const textX = medalX + medalW + 28;
      const maxTextW = contentW - medalW - 220;

      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFFFFF';

      const { lines: progLines, fontSize } = fitText(
        ctx,
        prog.name,
        maxTextW,
        2,
        isFirst ? 30 : 24,
        20,
        '"Geist Sans", sans-serif',
        'bold'
      );

      let lineY = cursorY + (isFirst ? 42 : 36);
      progLines.forEach((l) => {
        ctx.font = `bold ${fontSize}px "Geist Sans", sans-serif`;
        ctx.fillText(l, textX, lineY);
        lineY += fontSize * 1.25;
      });

      ctx.fillStyle = theme.accentText;
      ctx.font = '18px "Geist Sans", sans-serif';
      ctx.fillText(`${prog.facultyName} • Jenjang ${prog.degreeLevel}`, textX, lineY + 6);

      // Score on Right
      const rightX = padX + contentW - 24;
      ctx.textAlign = 'right';

      ctx.fillStyle = prog.tier === 'S' ? '#10B981' : prog.tier === 'A' ? '#F59E0B' : '#93C5FD';
      ctx.font = '15px "Press Start 2P", monospace';
      ctx.fillText(`TIER ${prog.tier}`, rightX, cursorY + 44);

      ctx.fillStyle = theme.accentText;
      ctx.font = '32px "Press Start 2P", monospace';
      ctx.fillText(formatScoreIndonesian(prog.score), rightX, cursorY + 90);

      // Primary reason for #1
      if (isFirst && prog.primaryReason) {
        ctx.textAlign = 'left';
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '15px "Geist Sans", sans-serif';
        const reasonLines = wrapText(ctx, `Alasan: ${prog.primaryReason}`, contentW - 48);
        let rY = cursorY + 180;
        reasonLines.slice(0, 2).forEach((rl) => {
          ctx.fillText(rl, padX + 24, rY);
          rY += 22;
        });
      }

      // Score bar
      const barX = textX;
      const barY = cursorY + cardH - 28;
      const barW = contentW - medalW - 70;
      const barH = 12;

      ctx.fillStyle = '#0F0704';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.strokeStyle = theme.cardBorder2;
      ctx.lineWidth = 1;
      ctx.strokeRect(barX, barY, barW, barH);

      const fillRatio = Math.max(0, Math.min(1, prog.score / 100));
      const fillW = Math.max(4, Math.floor(barW * fillRatio));
      ctx.fillStyle = medalColor;
      ctx.fillRect(barX + 1, barY + 1, fillW - 2, barH - 2);

      cursorY += cardH + 22;
    }

    // FOOTER (With QR & Instagram, NO PHONE NUMBERS)
    cursorY = height - 210;
    const qrSize = 130;
    const qrX = padX + 16;
    drawQrCode(ctx, SITE_URL, qrX, cursorY, qrSize, '#000000', '#FFFFFF');

    const infoX = qrX + qrSize + 28;
    ctx.textAlign = 'left';

    ctx.fillStyle = theme.accentText;
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillText('COBAIN JUGA! SCAN QR', infoX, cursorY + 28);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '18px "Geist Sans", sans-serif';
    ctx.fillText(`Kunjungi: ${SHORT_URL}`, infoX, cursorY + 60);

    ctx.fillStyle = '#F472B6';
    ctx.font = '18px "Geist Sans", sans-serif';
    ctx.fillText(`Instagram: ${INSTAGRAM.handle}`, infoX, cursorY + 92);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '15px "Geist Sans", sans-serif';
    ctx.fillText(TAGLINE, infoX, cursorY + 120);

    // Disclaimer line
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FEF08A';
    ctx.font = '15px "Geist Sans", sans-serif';
    ctx.fillText('⚠ Hasil eksplorasi minat — bukan tes psikologi.', width / 2, height - 36);
  }

  // =========================================================================
  // FORMAT B: SQUARE (1080 x 1080)
  // =========================================================================
  else if (format === 'square') {
    let cursorY = 55;

    ctx.textAlign = 'center';
    ctx.fillStyle = theme.accentText;
    ctx.font = '13px "Press Start 2P", monospace';
    ctx.fillText(`UNIVERSITAS DIPONEGORO • ${EVENT_NAME.toUpperCase()}`, width / 2, cursorY);
    cursorY += 34;

    // App Name Large
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '28px "Press Start 2P", monospace';
    ctx.fillText(APP_NAME.toUpperCase(), width / 2, cursorY);
    cursorY += 28;

    // Tagline & Stage clear
    ctx.font = '16px "Geist Sans", sans-serif';
    ctx.fillStyle = theme.accentText;
    ctx.fillText(`“${TAGLINE}” • ★ STAGE CLEAR ★`, width / 2, cursorY);
    cursorY += 34;

    // Headline & Interest Title Strip
    const contentW = width - padX * 2;
    ctx.fillStyle = theme.cardBg1;
    ctx.fillRect(padX, cursorY, contentW, 64);
    ctx.strokeStyle = theme.cardBorder2;
    ctx.lineWidth = 2;
    ctx.strokeRect(padX, cursorY, contentW, 64);

    ctx.textAlign = 'left';
    ctx.fillStyle = theme.accentText;
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText(headline.toUpperCase(), padX + 16, cursorY + 26);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px "Geist Sans", sans-serif';
    ctx.fillText(`Julukan: ${interestTitle.title} (${interestTitle.subtitle}) • ${data.riasecCode || 'RIASEC'}`, padX + 16, cursorY + 50);

    cursorY += 80;

    // 3 Cards stacked compactly
    const cardH = 155;
    const cardGap = 14;

    for (let i = 0; i < programs.length; i++) {
      const prog = programs[i];
      const cardY = cursorY + i * (cardH + cardGap);
      const isFirst = i === 0;

      ctx.fillStyle = isFirst ? theme.cardBg1 : theme.cardBg2;
      ctx.fillRect(padX, cardY, contentW, cardH);
      ctx.strokeStyle = isFirst ? theme.cardBorder1 : theme.cardBorder2;
      ctx.lineWidth = isFirst ? 3 : 2;
      ctx.strokeRect(padX, cardY, contentW, cardH);

      const medalW = 54;
      const medalH = 54;
      const medalX = padX + 16;
      const medalY = cardY + 16;
      const medalColor = i === 0 ? theme.goldMedal : i === 1 ? theme.silverMedal : theme.bronzeMedal;

      ctx.fillStyle = medalColor;
      ctx.fillRect(medalX, medalY, medalW, medalH);
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.font = '22px "Press Start 2P", monospace';
      ctx.fillText(`#${prog.rank}`, medalX + medalW / 2, medalY + 38);

      const textX = medalX + medalW + 20;
      const maxTextW = contentW - medalW - 190;

      ctx.textAlign = 'left';
      ctx.fillStyle = '#FFFFFF';
      const { lines: progLines, fontSize } = fitText(
        ctx,
        prog.name,
        maxTextW,
        2,
        20,
        15,
        '"Geist Sans", sans-serif',
        'bold'
      );

      let lineY = cardY + 28;
      progLines.forEach((l) => {
        ctx.font = `bold ${fontSize}px "Geist Sans", sans-serif`;
        ctx.fillText(l, textX, lineY);
        lineY += fontSize * 1.25;
      });

      ctx.fillStyle = theme.accentText;
      ctx.font = '14px "Geist Sans", sans-serif';
      ctx.fillText(`${prog.facultyName} • Jenjang ${prog.degreeLevel}`, textX, lineY + 4);

      // Score on right
      const rightX = padX + contentW - 16;
      ctx.textAlign = 'right';

      ctx.fillStyle = prog.tier === 'S' ? '#10B981' : prog.tier === 'A' ? '#F59E0B' : '#93C5FD';
      ctx.font = '12px "Press Start 2P", monospace';
      ctx.fillText(`TIER ${prog.tier}`, rightX, cardY + 30);

      ctx.fillStyle = theme.accentText;
      ctx.font = '24px "Press Start 2P", monospace';
      ctx.fillText(formatScoreIndonesian(prog.score), rightX, cardY + 68);

      // Score bar
      const barX = textX;
      const barY = cardY + cardH - 18;
      const barW = contentW - medalW - 48;
      const barH = 8;
      ctx.fillStyle = '#0F0704';
      ctx.fillRect(barX, barY, barW, barH);
      const fillRatio = Math.max(0, Math.min(1, prog.score / 100));
      const fillW = Math.max(4, Math.floor(barW * fillRatio));
      ctx.fillStyle = medalColor;
      ctx.fillRect(barX + 1, barY + 1, fillW - 2, barH - 2);
    }

    // Square Footer
    cursorY = height - 120;
    const qrSize = 90;
    const qrX = padX + 8;
    drawQrCode(ctx, SITE_URL, qrX, cursorY, qrSize, '#000000', '#FFFFFF');

    const infoX = qrX + qrSize + 20;
    ctx.textAlign = 'left';
    ctx.fillStyle = theme.accentText;
    ctx.font = '11px "Press Start 2P", monospace';
    ctx.fillText('COBAIN JUGA! SCAN QR', infoX, cursorY + 22);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '14px "Geist Sans", sans-serif';
    ctx.fillText(`Kunjungi: ${SHORT_URL}`, infoX, cursorY + 46);

    ctx.fillStyle = '#F472B6';
    ctx.font = '14px "Geist Sans", sans-serif';
    ctx.fillText(`Instagram: ${INSTAGRAM.handle}`, infoX, cursorY + 70);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#FEF08A';
    ctx.font = '12px "Geist Sans", sans-serif';
    ctx.fillText('⚠ Hasil eksplorasi minat — bukan tes psikologi.', width / 2, height - 18);
  }

  // =========================================================================
  // FORMAT C: LANDSCAPE (1920 x 1080)
  // =========================================================================
  else if (format === 'landscape') {
    // Left column: Branding & Profile (x: 64 to 760)
    let leftY = 80;

    ctx.textAlign = 'left';
    ctx.fillStyle = theme.accentText;
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillText('UNIVERSITAS DIPONEGORO', padX, leftY);
    leftY += 28;

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '12px "Press Start 2P", monospace';
    ctx.fillText(EVENT_NAME.toUpperCase(), padX, leftY);
    leftY += 45;

    // STAGE CLEAR Ribbon
    ctx.fillStyle = theme.ribbonBg;
    ctx.fillRect(padX, leftY - 26, 420, 38);
    ctx.strokeStyle = theme.ribbonBorder;
    ctx.lineWidth = 2;
    ctx.strokeRect(padX, leftY - 26, 420, 38);
    ctx.fillStyle = theme.ribbonText;
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillText('★ STAGE CLEAR ★', padX + 24, leftY - 2);
    leftY += 50;

    // App Name Large
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '36px "Press Start 2P", monospace';
    ctx.fillText(APP_NAME.toUpperCase(), padX, leftY);
    leftY += 36;

    // Tagline
    ctx.font = '22px "Geist Sans", sans-serif';
    ctx.fillStyle = theme.accentText;
    ctx.fillText(`“${TAGLINE}”`, padX, leftY);
    leftY += 50;

    // Personal headline & Interest title
    ctx.fillStyle = theme.cardBg1;
    ctx.fillRect(padX, leftY, 680, 160);
    ctx.strokeStyle = theme.cardBorder2;
    ctx.lineWidth = 2;
    ctx.strokeRect(padX, leftY, 680, 160);

    ctx.fillStyle = theme.accentText;
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillText(headline.toUpperCase(), padX + 24, leftY + 36);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px "Geist Sans", sans-serif';
    ctx.fillText(`Julukan: ${interestTitle.title} (${interestTitle.subtitle})`, padX + 24, leftY + 74);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '16px "Geist Sans", sans-serif';
    const lines = wrapText(ctx, interestTitle.narrative, 630);
    let nY = leftY + 108;
    lines.slice(0, 2).forEach((l) => {
      ctx.fillText(l, padX + 24, nY);
      nY += 22;
    });

    leftY += 200;

    // Left Footer: QR & Instagram
    const qrSize = 130;
    drawQrCode(ctx, SITE_URL, padX, leftY, qrSize, '#000000', '#FFFFFF');

    const qrTextX = padX + qrSize + 24;
    ctx.fillStyle = theme.accentText;
    ctx.font = '13px "Press Start 2P", monospace';
    ctx.fillText('COBAIN JUGA! SCAN QR', qrTextX, leftY + 28);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '18px "Geist Sans", sans-serif';
    ctx.fillText(`Kunjungi: ${SHORT_URL}`, qrTextX, leftY + 62);

    ctx.fillStyle = '#F472B6';
    ctx.font = '18px "Geist Sans", sans-serif';
    ctx.fillText(`Instagram: ${INSTAGRAM.handle}`, qrTextX, leftY + 94);

    ctx.fillStyle = '#FEF08A';
    ctx.font = '14px "Geist Sans", sans-serif';
    ctx.fillText('⚠ Hasil eksplorasi minat — bukan tes psikologi.', padX, height - 36);

    // Right Column: 3 Podium Pillars side by side (#2, #1, #3)
    const rightStartX = 800;
    const rightTotalW = width - rightStartX - padX;
    const colW = Math.floor((rightTotalW - 32) / 3);

    // Order: [Rank #2, Rank #1, Rank #3]
    const podiumOrder = [
      { item: programs[1], medal: theme.silverMedal, label: '#2', heightBonus: 40, colIdx: 0 },
      { item: programs[0], medal: theme.goldMedal, label: '#1', heightBonus: 100, colIdx: 1 },
      { item: programs[2], medal: theme.bronzeMedal, label: '#3', heightBonus: 0, colIdx: 2 },
    ];

    const podiumBaseY = height - 120;

    for (const p of podiumOrder) {
      if (!p.item) continue;
      const colX = rightStartX + p.colIdx * (colW + 16);
      const pillarH = 340 + p.heightBonus;
      const pillarY = podiumBaseY - pillarH;
      const isTopOne = p.item.rank === 1;

      // Card Body
      ctx.fillStyle = isTopOne ? theme.cardBg1 : theme.cardBg2;
      ctx.fillRect(colX, pillarY, colW, pillarH);
      ctx.strokeStyle = isTopOne ? theme.cardBorder1 : theme.cardBorder2;
      ctx.lineWidth = isTopOne ? 4 : 2;
      ctx.strokeRect(colX, pillarY, colW, pillarH);

      // Medal header on pillar
      const medalH = 50;
      ctx.fillStyle = p.medal;
      ctx.fillRect(colX, pillarY, colW, medalH);
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.font = '22px "Press Start 2P", monospace';
      ctx.fillText(p.label, colX + colW / 2, pillarY + 35);

      // Tier & Score
      ctx.fillStyle = p.item.tier === 'S' ? '#10B981' : p.item.tier === 'A' ? '#F59E0B' : '#93C5FD';
      ctx.font = '14px "Press Start 2P", monospace';
      ctx.fillText(`TIER ${p.item.tier}`, colX + colW / 2, pillarY + 85);

      ctx.fillStyle = theme.accentText;
      ctx.font = '30px "Press Start 2P", monospace';
      ctx.fillText(formatScoreIndonesian(p.item.score), colX + colW / 2, pillarY + 130);

      // Program Name (auto-fit)
      ctx.fillStyle = '#FFFFFF';
      const { lines: progLines, fontSize } = fitText(
        ctx,
        p.item.name,
        colW - 32,
        3,
        22,
        16,
        '"Geist Sans", sans-serif',
        'bold'
      );

      let textY = pillarY + 175;
      progLines.forEach((l) => {
        ctx.font = `bold ${fontSize}px "Geist Sans", sans-serif`;
        ctx.fillText(l, colX + colW / 2, textY);
        textY += fontSize * 1.25;
      });

      // Faculty
      ctx.fillStyle = theme.accentText;
      ctx.font = '16px "Geist Sans", sans-serif';
      ctx.fillText(`${p.item.facultyName}`, colX + colW / 2, textY + 10);
      ctx.fillStyle = '#CBD5E1';
      ctx.font = '14px "Geist Sans", sans-serif';
      ctx.fillText(`Jenjang ${p.item.degreeLevel}`, colX + colW / 2, textY + 34);

      // Pedestal bottom block
      ctx.fillStyle = '#0F0704';
      ctx.fillRect(colX, podiumBaseY, colW, 40);
      ctx.strokeStyle = theme.cardBorder2;
      ctx.lineWidth = 2;
      ctx.strokeRect(colX, podiumBaseY, colW, 40);
      ctx.fillStyle = p.medal;
      ctx.font = '16px "Press Start 2P", monospace';
      ctx.fillText(`PODIUM ${p.label}`, colX + colW / 2, podiumBaseY + 26);
    }
  }
}

/**
 * Converts canvas to PNG Blob.
 */
export function getCanvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Canvas toBlob returned null'));
      }
    }, 'image/png');
  });
}

/**
 * Triggers native Web Share API with File, or falls back to PNG download.
 */
export async function shareOrDownloadCard(
  blob: Blob,
  fileName: string = `hasil-rekomendasi-${APP_NAME_SHORT.toLowerCase().replace(/\s+/g, '-')}.png`,
  title: string = `${APP_NAME} - Rekomendasi Program Studi`
): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([blob], fileName, { type: 'image/png' });

  if (
    typeof navigator !== 'undefined' &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({
        files: [file],
        title,
        text: `${title} — ${TAGLINE}. Cek di ${SHORT_URL}`,
      });
      return 'shared';
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return 'cancelled';
      }
    }
  }

  downloadBlob(blob, fileName);
  return 'downloaded';
}

/**
 * Direct file download trigger via anchor tag.
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 300);
}
