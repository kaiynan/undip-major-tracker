import { ProgramDetail } from '../programDetails';

const RETRIEVED_AT = '2026-01-14';

export const fpsiProgramDetails: Record<string, ProgramDetail> = {
  'fpsi-psikologi': {
    programId: 'fpsi-psikologi',
    ringkasan: {
      value: 'Psikologi FPsi UNDIP mempelajari perilaku, kognisi, dan dinamika emosi manusia di berbagai ranah: psikologi klinis, psikologi industri dan organisasi (PIO), psikologi pendidikan, perkembangan anak, dan psikologi sosial masyarakat.',
      sourceUrl: 'https://psikologi.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Konstruksi & Administrasi Alat Ukur Psikologi (Psikometri)',
        'Teknik Wawancara & Observasi Psikologis',
        'Psikologi Industri & Organisasi (PIO)',
        'Psikologi Klinis Dasar & Kesehatan Mental',
        'Psikologi Perkembangan Anak & Remaja',
        'Metodologi Penelitian Eksperimen Psikologi',
      ],
      sourceUrl: 'https://psikologi.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu menyusun dan mengadministrasikan instrumen asesmen psikologis dasar non-klinis',
        'Mampu melakukan observasi dan wawancara perilaku terstruktur untuk rekrutmen dan konseling dasar',
        'Mampu merancang program pelatihan pengembangan diri dan intervensi psikososial komunitas',
        'Menjunjung tinggi Kode Etik Psikologi Indonesia (HIMPSI)',
      ],
      sourceUrl: 'https://psikologi.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Human Resource / Talent Acquisition Specialist',
        'Asisten Psikolog & Asesor Rekrutmen Karyawan',
        'Konselor Akademik & Bimbingan Konseling Sekolah',
        'Spesialis Pelatihan & Pengembangan Organisasi (L&D)',
        'Psikolog Klinis / Industri (setelah menempuh Magister Psikologi Profesi)',
      ],
      sourceUrl: 'https://psikologi.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'BAN-PT',
        tahun: 2022,
      },
      sourceUrl: 'https://psikologi.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://psikologi.undip.ac.id',
      sourceUrl: 'https://psikologi.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
};
