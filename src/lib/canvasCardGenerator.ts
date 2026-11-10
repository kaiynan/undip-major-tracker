/**
 * Canvas 2D Shareable Result Card Generator
 * Supports:
 * - Story format: 1080 x 1920 (9:16)
 * - Square format: 1080 x 1080 (1:1)
 * Golden-hour retro pixel identity, offline-ready, device-only generation.
 */

import { APP_NAME, APP_NAME_SHORT, TAGLINE, EVENT_NAME, SHORT_URL } from '@/config/brand';

export type CardFormat = 'story' | 'square';

export interface CardProgramItem {
  rank: number;
  name: string;
  facultyName: string;
  degreeLevel: string;
  score: number;
  tier: string;
}

export interface CardData {
  nickname?: string;
  topPrograms: CardProgramItem[];
  riasecCode?: string;
  topDomainLabel?: string;
  topLearningLabel?: string;
}

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

  // Fallback: at minimum font size, truncate second line if exceeds maxLines
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
 * Draws the retro pixel dither horizon in sunset golden-hour colors.
 */
function drawDitherHorizon(ctx: CanvasRenderingContext2D, y: number, width: number) {
  const step = 8;
  const colors = ['#5C2323', '#78350F', '#9A3412', '#B45309', '#D97706'];
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
 * Draws stars in the twilight sky.
 */
function drawStars(ctx: CanvasRenderingContext2D, width: number, height: number, count: number) {
  ctx.fillStyle = '#FDE68A';
  // Deterministic star placement
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
function drawPixelFrame(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Outer frame
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 14;
  ctx.strokeRect(7, 7, width - 14, height - 14);

  // Inner frame
  ctx.strokeStyle = '#F59E0B';
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, width - 36, height - 36);

  // Corner decorative pixel squares
  ctx.fillStyle = '#FDE68A';
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
 * Renders the result card onto an HTML Canvas 2D context.
 */
export async function renderResultCard(
  canvas: HTMLCanvasElement,
  data: CardData,
  format: CardFormat
): Promise<void> {
  await ensureFontsLoaded();

  const width = 1080;
  const height = format === 'story' ? 1920 : 1080;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get Canvas 2D context');

  // Disable font smoothing for sharp pixelated style where appropriate
  ctx.imageSmoothingEnabled = true;

  // 1. BACKGROUND GRADIENT (Sunset Golden Hour)
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
  if (format === 'story') {
    bgGradient.addColorStop(0, '#100704');
    bgGradient.addColorStop(0.25, '#241007');
    bgGradient.addColorStop(0.5, '#451A08');
    bgGradient.addColorStop(0.72, '#7C2D12');
    bgGradient.addColorStop(0.85, '#9A3412');
    bgGradient.addColorStop(1, '#1A0E08');
  } else {
    bgGradient.addColorStop(0, '#140804');
    bgGradient.addColorStop(0.35, '#351408');
    bgGradient.addColorStop(0.65, '#6B260C');
    bgGradient.addColorStop(0.88, '#8C3210');
    bgGradient.addColorStop(1, '#180B06');
  }
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // 2. STARS & HORIZON
  drawStars(ctx, width, height, format === 'story' ? 45 : 28);
  drawDitherHorizon(ctx, format === 'story' ? height * 0.76 : height * 0.72, width);

  // 3. PIXEL FRAME
  drawPixelFrame(ctx, width, height);

  // Layout parameters
  const padX = 72;
  const contentWidth = width - padX * 2;
  let cursorY = format === 'story' ? 85 : 55;

  // 4. HEADER: EVENT LINE
  ctx.fillStyle = '#FDE68A';
  ctx.font = '16px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(EVENT_NAME.toUpperCase(), width / 2, cursorY);
  cursorY += format === 'story' ? 55 : 38;

  // APP TITLE
  ctx.font = format === 'story' ? '36px "Press Start 2P", monospace' : '30px "Press Start 2P", monospace';
  // Shadow
  ctx.fillStyle = '#451A03';
  ctx.fillText(APP_NAME.toUpperCase(), width / 2 + 4, cursorY + 4);
  // Main
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(APP_NAME.toUpperCase(), width / 2, cursorY);
  cursorY += format === 'story' ? 42 : 32;

  // TAGLINE
  ctx.font = format === 'story' ? '22px "Geist Sans", sans-serif' : '18px "Geist Sans", sans-serif';
  ctx.fillStyle = '#FCD34D';
  ctx.fillText(`“${TAGLINE}”`, width / 2, cursorY);
  cursorY += format === 'story' ? 45 : 30;

  // OPTIONAL NICKNAME BADGE
  if (data.nickname && data.nickname.trim().length > 0) {
    const cleanNick = data.nickname.trim().slice(0, 20);
    const nickText = `HASIL EKSPLORASI: ${cleanNick.toUpperCase()}`;
    ctx.font = '16px "Press Start 2P", monospace';
    const nickMetrics = ctx.measureText(nickText);
    const boxW = Math.min(contentWidth, nickMetrics.width + 48);
    const boxH = 38;
    const boxX = (width - boxW) / 2;

    ctx.fillStyle = '#2A160E';
    ctx.fillRect(boxX, cursorY - 24, boxW, boxH);
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 3;
    ctx.strokeRect(boxX, cursorY - 24, boxW, boxH);

    ctx.fillStyle = '#FDE68A';
    ctx.fillText(nickText, width / 2, cursorY + 2);
    cursorY += format === 'story' ? 48 : 34;
  }

  // 5. PROFILE SUMMARY STRIP
  const riasec = data.riasecCode || 'R/I/A';
  const domain = data.topDomainLabel || 'Bidang Akademik Terunggul';
  const profileBoxH = format === 'story' ? 70 : 54;
  ctx.fillStyle = '#1A0E08';
  ctx.fillRect(padX, cursorY, contentWidth, profileBoxH);
  ctx.strokeStyle = '#78350F';
  ctx.lineWidth = 3;
  ctx.strokeRect(padX, cursorY, contentWidth, profileBoxH);

  ctx.textAlign = 'left';
  ctx.font = format === 'story' ? '14px "Press Start 2P", monospace' : '12px "Press Start 2P", monospace';
  ctx.fillStyle = '#F59E0B';
  ctx.fillText('PROFIL:', padX + 24, cursorY + (format === 'story' ? 28 : 22));

  ctx.fillStyle = '#FFFBEB';
  ctx.font = format === 'story' ? '14px "Press Start 2P", monospace' : '11px "Press Start 2P", monospace';
  ctx.fillText(`RIASEC: ${riasec}`, padX + 130, cursorY + (format === 'story' ? 28 : 22));

  ctx.fillStyle = '#FDE68A';
  ctx.font = format === 'story' ? '18px "Geist Sans", sans-serif' : '15px "Geist Sans", sans-serif';
  const truncatedDomain = domain.length > 45 ? `${domain.slice(0, 42)}...` : domain;
  ctx.fillText(`Disiplin: ${truncatedDomain}`, padX + 24, cursorY + (format === 'story' ? 54 : 42));

  cursorY += profileBoxH + (format === 'story' ? 36 : 22);

  // SECTION HEADER: 3 REKOMENDASI TERATAS
  ctx.textAlign = 'left';
  ctx.font = format === 'story' ? '16px "Press Start 2P", monospace' : '13px "Press Start 2P", monospace';
  ctx.fillStyle = '#FDE68A';
  ctx.fillText('▶ 3 PROGRAM STUDI PALING COCOK', padX, cursorY);
  cursorY += format === 'story' ? 28 : 18;

  // 6. TOP 3 PROGRAM STUDI CARDS
  const cardH = format === 'story' ? 240 : 158;
  const cardGap = format === 'story' ? 26 : 14;
  const programsToDisplay = (data.topPrograms || []).slice(0, 3);

  for (let idx = 0; idx < programsToDisplay.length; idx++) {
    const prog = programsToDisplay[idx];
    const cardY = cursorY + idx * (cardH + cardGap);

    // Card background
    ctx.fillStyle = idx === 0 ? '#26130B' : '#1D0D07';
    ctx.fillRect(padX, cardY, contentWidth, cardH);
    ctx.strokeStyle = idx === 0 ? '#F59E0B' : '#78350F';
    ctx.lineWidth = idx === 0 ? 4 : 2;
    ctx.strokeRect(padX, cardY, contentWidth, cardH);

    // Rank Badge (Left)
    const badgeW = format === 'story' ? 68 : 54;
    const badgeH = format === 'story' ? 68 : 54;
    const badgeX = padX + 20;
    const badgeY = cardY + 20;

    const rankColors = ['#F59E0B', '#D97706', '#9A3412'];
    ctx.fillStyle = rankColors[idx] || '#78350F';
    ctx.fillRect(badgeX, badgeY, badgeW, badgeH);
    ctx.strokeStyle = '#FDE68A';
    ctx.lineWidth = 2;
    ctx.strokeRect(badgeX, badgeY, badgeW, badgeH);

    ctx.fillStyle = idx === 0 ? '#000000' : '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = format === 'story' ? '28px "Press Start 2P", monospace' : '22px "Press Start 2P", monospace';
    ctx.fillText(`#${prog.rank}`, badgeX + badgeW / 2, badgeY + (format === 'story' ? 46 : 38));

    // Program Details (Right of Badge)
    const textStartX = badgeX + badgeW + 24;
    const maxProgTextW = contentWidth - (badgeW + 48) - 160; // Room for score on right

    // Program Name with auto-shrink & 2-line wrap
    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    const startSize = format === 'story' ? 28 : 20;
    const minSize = format === 'story' ? 20 : 15;
    const { lines: progLines, fontSize } = fitText(
      ctx,
      prog.name,
      maxProgTextW,
      2,
      startSize,
      minSize,
      '"Geist Sans", sans-serif',
      'bold'
    );

    const lineH = fontSize * 1.22;
    let nameY = cardY + (format === 'story' ? 36 : 26);
    progLines.forEach((line) => {
      ctx.font = `bold ${fontSize}px "Geist Sans", sans-serif`;
      ctx.fillText(line, textStartX, nameY);
      nameY += lineH;
    });

    // Faculty & Degree Level
    ctx.fillStyle = '#FDE68A';
    ctx.font = format === 'story' ? '18px "Geist Sans", sans-serif' : '13px "Geist Sans", sans-serif';
    const facY = nameY + (format === 'story' ? 8 : 4);
    ctx.fillText(`${prog.facultyName} • ${prog.degreeLevel}`, textStartX, facY);

    // Score & Tier Display (Right Side)
    const scoreRightX = padX + contentWidth - 24;
    ctx.textAlign = 'right';

    // Tier Badge
    const tier = prog.tier || 'A';
    const tierText = `TIER ${tier}`;
    ctx.font = format === 'story' ? '14px "Press Start 2P", monospace' : '11px "Press Start 2P", monospace';
    ctx.fillStyle = tier === 'S' ? '#10B981' : tier === 'A' ? '#F59E0B' : '#93C5FD';
    ctx.fillText(tierText, scoreRightX, cardY + (format === 'story' ? 42 : 30));

    // Match Score
    const scoreVal = typeof prog.score === 'number' ? prog.score.toFixed(1) : '0.0';
    ctx.font = format === 'story' ? '28px "Press Start 2P", monospace' : '20px "Press Start 2P", monospace';
    ctx.fillStyle = '#FDE68A';
    ctx.fillText(`${scoreVal}%`, scoreRightX, cardY + (format === 'story' ? 82 : 62));

    ctx.font = format === 'story' ? '13px "Geist Sans", sans-serif' : '10px "Geist Sans", sans-serif';
    ctx.fillStyle = '#D1D5DB';
    ctx.fillText('Tingkat Keselarasan', scoreRightX, cardY + (format === 'story' ? 106 : 80));

    // Pixel Score Bar at Bottom of Card
    const barX = textStartX;
    const barY = cardY + cardH - (format === 'story' ? 32 : 22);
    const barW = contentWidth - (badgeW + 48) - 10;
    const barH = format === 'story' ? 12 : 8;

    ctx.fillStyle = '#140804';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = '#78350F';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);

    const fillRatio = Math.max(0, Math.min(1, (prog.score || 0) / 100));
    const fillW = Math.max(4, Math.floor(barW * fillRatio));
    const barGrad = ctx.createLinearGradient(barX, 0, barX + fillW, 0);
    barGrad.addColorStop(0, '#D97706');
    barGrad.addColorStop(1, '#F59E0B');
    ctx.fillStyle = barGrad;
    ctx.fillRect(barX + 1, barY + 1, fillW - 2, barH - 2);
  }

  // 7. FOOTER: DISCLAIMER & SITE URL
  const footerY = height - (format === 'story' ? 95 : 55);
  ctx.textAlign = 'center';

  // Disclaimer line
  ctx.fillStyle = '#FEF08A';
  ctx.font = format === 'story' ? '15px "Geist Sans", sans-serif' : '12px "Geist Sans", sans-serif';
  ctx.fillText('⚠ Hasil eksplorasi minat, bukan tes psikologi', width / 2, footerY);

  // App short url & branding
  ctx.fillStyle = '#D97706';
  ctx.font = format === 'story' ? '13px "Press Start 2P", monospace' : '10px "Press Start 2P", monospace';
  ctx.fillText(`${SHORT_URL} • HMIM Engine v1.0`, width / 2, footerY + (format === 'story' ? 32 : 22));
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
 * Returns true if shared or downloaded, false if cancelled by user.
 */
export async function shareOrDownloadCard(
  blob: Blob,
  fileName: string = `hasil-rekomendasi-${APP_NAME_SHORT.toLowerCase().replace(/\s+/g, '-')}.png`,
  title: string = `${APP_NAME} - Rekomendasi Program Studi`
): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const file = new File([blob], fileName, { type: 'image/png' });

  // 1. Check Web Share API with file support
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
        return 'cancelled'; // Silent cancellation
      }
      // If share throws other error, proceed to fallback download
    }
  }

  // 2. Fallback: Trigger browser download
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
