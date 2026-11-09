import { ProgramScore } from '@/data/types';

/**
 * Ambang batas empiris untuk mendeteksi profil minat tersebar (spread interest).
 *
 * Berdasarkan simulasi 2.500 profil acak dan 300 profil konsisten dengan mesin HMIM:
 * Nilai ini merupakan persentil ke-25 (P25) selisih skor prodi peringkat #1 dan #5
 * pada kelompok responden terfokus/konsisten (Delta_1-5 = 4.40%).
 *
 * Bila selisih skor prodi #1 dan prodi #5 <= 4.40%, nilai antar-prodi teratas
 * dianggap terlalu berdekatan, sehingga banner afirmatif ditampilkan untuk
 * merekomendasikan fitur Bandingkan dan konsultasi SERADIP.
 *
 * Dokumentasi metodologi & simulasi lengkap: docs/spread-threshold.md
 */
export const INTEREST_SPREAD_THRESHOLD = 4.4;

export interface InterestSpreadResult {
  isSpread: boolean;
  gap1_5: number;
  threshold: number;
}

/**
 * Mendeteksi apakah profil minat pengguna terdistribusi secara rapat antar beberapa prodi teratas.
 *
 * Aturan:
 * - Mengambil prodi peringkat #1 dan prodi peringkat #5 dari daftar prodi yang sudah terurut (ranked).
 * - Menghitung selisih: gap = score#1 - score#5.
 * - Jika gap <= INTEREST_SPREAD_THRESHOLD (4.40%), maka isSpread = true.
 * - Bila prodi yang tersedia < 5 tetapi >= 2, membandingkan peringkat pertama dan terakhir dengan ambang 2.0%.
 * - Tidak pernah mengubah formula skor maupun urutan peringkat program studi.
 */
export function detectInterestSpread(
  rankedScores: ProgramScore[] | null | undefined
): InterestSpreadResult {
  if (!rankedScores || rankedScores.length < 2) {
    return { isSpread: false, gap1_5: 0, threshold: INTEREST_SPREAD_THRESHOLD };
  }

  // Jika terdapat minimal 5 prodi terperingkat
  if (rankedScores.length >= 5) {
    const score1 = rankedScores[0].totalScore;
    const score5 = rankedScores[4].totalScore;
    const gap1_5 = Number((score1 - score5).toFixed(2));
    const isSpread = gap1_5 <= INTEREST_SPREAD_THRESHOLD;

    return {
      isSpread,
      gap1_5,
      threshold: INTEREST_SPREAD_THRESHOLD,
    };
  }

  // Kasus fallback bila prodi < 5 (misal setelah filter ketat)
  const scoreFirst = rankedScores[0].totalScore;
  const scoreLast = rankedScores[rankedScores.length - 1].totalScore;
  const fallbackGap = Number((scoreFirst - scoreLast).toFixed(2));
  const isSpread = fallbackGap <= 2.0;

  return {
    isSpread,
    gap1_5: fallbackGap,
    threshold: 2.0,
  };
}
