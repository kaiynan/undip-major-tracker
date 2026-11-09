// =============================================================================
// undip-major-matcher — Database Detail Program Studi Resmi & Terverifikasi
// =============================================================================
// Aturan bukti: Setiap field group wajib memiliki sourceUrl, retrievedAt, status.
// Tidak ada klaim promosi, estimasi gaji, atau serapan kerja fiktif.
// =============================================================================

export interface DetailFieldGroup<T> {
  value: T;
  sourceUrl: string;
  retrievedAt: string;
  status: 'official' | 'pending';
  evidence?: string;
}

export interface ProgramDetail {
  programId: string;
  ringkasan?: DetailFieldGroup<string>;
  mataKuliahKhas?: DetailFieldGroup<string[]>;
  kompetensiUtama?: DetailFieldGroup<string[]>;
  prospekKarier?: DetailFieldGroup<string[]>;
  akreditasi?: DetailFieldGroup<{
    peringkat: string;
    lembaga: string;
    tahun?: number;
  }>;
  lamanResmi?: DetailFieldGroup<string>;
}

export const programDetailsRecord: Record<string, ProgramDetail> = {};

export function getProgramDetailById(programId: string): ProgramDetail | undefined {
  return programDetailsRecord[programId];
}
