// =============================================================================
// undip-major-matcher — Database Detail Program Studi Resmi & Terverifikasi
// =============================================================================
// Aturan bukti: Setiap field group wajib memiliki sourceUrl, retrievedAt, status.
// Tidak ada klaim promosi fiktif, angka gaji, atau persentase serapan kerja.
// =============================================================================

import { ftProgramDetails } from './program-details/ft';
import { fsmProgramDetails } from './program-details/fsm';
import { fkProgramDetails } from './program-details/fk';
import { febProgramDetails } from './program-details/feb';
import { fhProgramDetails } from './program-details/fh';
import { fisipProgramDetails } from './program-details/fisip';
import { fibProgramDetails } from './program-details/fib';
import { fkmProgramDetails } from './program-details/fkm';
import { fpikProgramDetails } from './program-details/fpik';
import { fppProgramDetails } from './program-details/fpp';
import { fpsiProgramDetails } from './program-details/fpsi';
import { svProgramDetails } from './program-details/sv';

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

export const programDetailsRecord: Record<string, ProgramDetail> = {
  ...ftProgramDetails,
  ...fsmProgramDetails,
  ...fkProgramDetails,
  ...febProgramDetails,
  ...fhProgramDetails,
  ...fisipProgramDetails,
  ...fibProgramDetails,
  ...fkmProgramDetails,
  ...fpikProgramDetails,
  ...fppProgramDetails,
  ...fpsiProgramDetails,
  ...svProgramDetails,
};

export function getProgramDetailById(programId: string): ProgramDetail | undefined {
  return programDetailsRecord[programId];
}

export function getAllProgramDetails(): ProgramDetail[] {
  return Object.values(programDetailsRecord);
}
