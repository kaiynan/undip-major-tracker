// =============================================================================
// UNDIP Major Matcher — Data Fakultas / Sekolah
// =============================================================================
// Data semua fakultas dan sekolah di Universitas Diponegoro.
// Status: provisional — belum diverifikasi dari sumber resmi.
// =============================================================================

import { Faculty } from './types';

export const faculties: Faculty[] = [
  {
    id: 'ft',
    name: 'Fakultas Teknik',
    shortName: 'FT',
    description:
      'Fakultas Teknik UNDIP menyelenggarakan pendidikan di bidang rekayasa dan teknologi, menghasilkan lulusan yang mampu merancang, membangun, dan mengelola sistem teknik modern untuk kemajuan bangsa.',
    websiteUrl: 'https://ft.undip.ac.id',
  },
  {
    id: 'fsm',
    name: 'Fakultas Sains dan Matematika',
    shortName: 'FSM',
    description:
      'Fakultas Sains dan Matematika UNDIP (dahulu FMIPA) menyelenggarakan pendidikan dan penelitian di bidang ilmu dasar, matematika, dan informatika untuk menghasilkan lulusan yang kompeten dalam sains dan teknologi.',
    websiteUrl: 'https://fsm.undip.ac.id',
  },
  {
    id: 'fk',
    name: 'Fakultas Kedokteran',
    shortName: 'FK',
    description:
      'Fakultas Kedokteran UNDIP menyelenggarakan pendidikan di bidang kedokteran, keperawatan, gizi, farmasi, dan kedokteran gigi untuk menghasilkan tenaga kesehatan profesional yang unggul.',
    websiteUrl: 'https://fk.undip.ac.id',
  },
  {
    id: 'feb',
    name: 'Fakultas Ekonomika dan Bisnis',
    shortName: 'FEB',
    description:
      'Fakultas Ekonomika dan Bisnis UNDIP menyelenggarakan pendidikan di bidang ekonomi, manajemen, dan akuntansi untuk menghasilkan lulusan yang memiliki kompetensi di bidang bisnis dan ekonomi.',
    websiteUrl: 'https://feb.undip.ac.id',
  },
  {
    id: 'fh',
    name: 'Fakultas Hukum',
    shortName: 'FH',
    description:
      'Fakultas Hukum UNDIP menyelenggarakan pendidikan hukum untuk menghasilkan lulusan yang menguasai ilmu hukum dan mampu menerapkannya dalam kehidupan bermasyarakat, berbangsa, dan bernegara.',
    websiteUrl: 'https://fh.undip.ac.id',
  },
  {
    id: 'fisip',
    name: 'Fakultas Ilmu Sosial dan Ilmu Politik',
    shortName: 'FISIP',
    description:
      'FISIP UNDIP menyelenggarakan pendidikan di bidang ilmu sosial dan politik, menghasilkan lulusan yang mampu menganalisis dan menyelesaikan permasalahan sosial-politik secara profesional.',
    websiteUrl: 'https://fisip.undip.ac.id',
  },
  {
    id: 'fib',
    name: 'Fakultas Ilmu Budaya',
    shortName: 'FIB',
    description:
      'Fakultas Ilmu Budaya UNDIP menyelenggarakan pendidikan di bidang sastra, sejarah, perpustakaan, antropologi, dan kebudayaan untuk melestarikan dan mengembangkan ilmu humaniora.',
    websiteUrl: 'https://fib.undip.ac.id',
  },
  {
    id: 'fkm',
    name: 'Fakultas Kesehatan Masyarakat',
    shortName: 'FKM',
    description:
      'Fakultas Kesehatan Masyarakat UNDIP menyelenggarakan pendidikan di bidang kesehatan masyarakat dan keselamatan kerja untuk menghasilkan lulusan yang mampu meningkatkan derajat kesehatan masyarakat.',
    websiteUrl: 'https://fkm.undip.ac.id',
  },
  {
    id: 'fpik',
    name: 'Fakultas Perikanan dan Ilmu Kelautan',
    shortName: 'FPIK',
    description:
      'FPIK UNDIP menyelenggarakan pendidikan di bidang perikanan dan kelautan untuk menghasilkan lulusan yang mampu mengelola dan memanfaatkan sumber daya perairan dan kelautan secara berkelanjutan.',
    websiteUrl: 'https://fpik.undip.ac.id',
  },
  {
    id: 'fpp',
    name: 'Fakultas Peternakan dan Pertanian',
    shortName: 'FPP',
    description:
      'Fakultas Peternakan dan Pertanian UNDIP menyelenggarakan pendidikan di bidang peternakan, teknologi pangan, dan pertanian untuk menghasilkan lulusan yang mampu meningkatkan ketahanan pangan nasional.',
    websiteUrl: 'https://fpp.undip.ac.id',
  },
  {
    id: 'fpsi',
    name: 'Fakultas Psikologi',
    shortName: 'FPsi',
    description:
      'Fakultas Psikologi UNDIP menyelenggarakan pendidikan psikologi untuk menghasilkan lulusan yang memahami perilaku manusia dan mampu menerapkan ilmu psikologi dalam berbagai bidang kehidupan.',
    websiteUrl: 'https://psikologi.undip.ac.id',
  },
  {
    id: 'sv',
    name: 'Sekolah Vokasi',
    shortName: 'SV',
    description:
      'Sekolah Vokasi UNDIP menyelenggarakan pendidikan vokasi (diploma/sarjana terapan) yang berorientasi pada penguasaan keahlian terapan dan keterampilan profesional siap kerja.',
    websiteUrl: 'https://sv.undip.ac.id',
  },
];
