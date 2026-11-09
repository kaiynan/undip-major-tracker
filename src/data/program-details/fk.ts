import { ProgramDetail } from '../programDetails';

const RETRIEVED_AT = '2026-01-14';

export const fkProgramDetails: Record<string, ProgramDetail> = {
  'fk-kedokteran': {
    programId: 'fk-kedokteran',
    ringkasan: {
      value: 'Pendidikan Kedokteran FK UNDIP menerapkan kurikulum berbasis kompetensi dengan metode Problem-Based Learning (PBL) dan Skills Lab berstandar internasional. Pembelajaran klinis terintegrasi langsung dengan RSND dan RSUP Dr. Kariadi Semarang.',
      sourceUrl: 'https://kedokteran.fk.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Blok Biomedik & Humaniora Kedokteran',
        'Blok Sistem Kardiovaskular & Respirasi',
        'Blok Sistem Saraf & Muskuloskeletal',
        'Blok Kegawatdaruratan Medik & Trauma',
        'Keterampilan Klinis (Objective Structured Clinical Examination/OSCE)',
        'Kedokteran Komunitas & Pesisir',
      ],
      sourceUrl: 'https://kedokteran.fk.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu melakukan anamnesis, pemeriksaan fisik menyeluruh, dan menentukan diagnosis klinis kerja',
        'Mampu melakukan tatalaksana kegawatdaruratan medis dasar sesuai Standar Kompetensi Dokter Indonesia (SKDI)',
        'Terampil melakukan prosedur klinis dasar (resusitasi, venosentris, penjahitan luka)',
        'Mampu menjalin komunikasi dokter-pasien yang berempati dan menjunjung tinggi etika kedokteran',
      ],
      sourceUrl: 'https://kedokteran.fk.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Dokter Umum (setelah menempuh Program Profesi Dokter & UKMPPD)',
        'Dokter Spesialis / Konsultan Klinis',
        'Peneliti Medis & Dosen Akademik',
        'Manajer Pelayanan Kesehatan Rumah Sakit / Klinik',
      ],
      sourceUrl: 'https://kedokteran.fk.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'LAM-PTKes',
        tahun: 2022,
      },
      sourceUrl: 'https://kedokteran.fk.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://kedokteran.fk.undip.ac.id',
      sourceUrl: 'https://kedokteran.fk.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fk-keperawatan': {
    programId: 'fk-keperawatan',
    ringkasan: {
      value: 'Keperawatan FK UNDIP mencetak sarjana keperawatan yang kompeten dalam asuhan keperawatan holistik, keperawatan kritis, gawat darurat, jiwa, dan komunitas. Program didukung laboratorium simulasi mini hospital modern dan praktik klinik terpadu.',
      sourceUrl: 'https://keperawatan.fk.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Keperawatan Medikal Bedah Terpadu',
        'Keperawatan Gawat Darurat & Kritis (ICU)',
        'Keperawatan Maternitas & Anak',
        'Keperawatan Jiwa & Psikososial',
        'Keperawatan Komunitas & Gerontik',
        'Manajemen & Kepemimpinan Keperawatan',
      ],
      sourceUrl: 'https://keperawatan.fk.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu menyusun rencana asuhan keperawatan berbasis evidensi (Evidence-Based Nursing)',
        'Terampil melakukan tindakan keperawatan invasif dan non-invasif secara aman',
        'Mampu memimpin manajemen ruang rawat inap dan triage kegawatdaruratan',
      ],
      sourceUrl: 'https://keperawatan.fk.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Perawat Profesional / Ners (setelah Profesi Ners)',
        'Clinical Nurse Specialist di Rumah Sakit Internasional',
        'Perawat Gawat Darurat & Intensive Care',
        'Edukator & Konsultan Keperawatan Komunitas',
      ],
      sourceUrl: 'https://keperawatan.fk.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'LAM-PTKes',
        tahun: 2023,
      },
      sourceUrl: 'https://keperawatan.fk.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://keperawatan.fk.undip.ac.id',
      sourceUrl: 'https://keperawatan.fk.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fk-gizi': {
    programId: 'fk-gizi',
    ringkasan: {
      value: 'Ilmu Gizi FK UNDIP adalah pelopor pendidikan gizi terkemuka di Indonesia. Program ini mempelajari gizi klinik, gizi masyarakat, manajemen penyelenggaraan makanan rumah sakit, dan metabolisme zat gizi makro-mikro.',
      sourceUrl: 'https://gizi.fk.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Gizi Klinik & Dietetika Penyakit Kritis',
        'Penilaian Status Gizi (PSG) Lanjut',
        'Manajemen Penyelenggaraan Makanan Massal',
        'Gizi Masyarakat & Intervensi Stunting',
        'Biokimia Nutrisi & Metabolisme Intermediat',
        'Konseling & Edukasi Perubahan Perilaku Gizi',
      ],
      sourceUrl: 'https://gizi.fk.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu menyusun Nutrition Care Process (NCP) untuk pasien penyakit degeneratif dan infeksi',
        'Mampu merancang menu diet terapeutik bergizi seimbang dengan kalkulasi kalori presisi',
        'Mampu memimpin program surveilans gizi masyarakat untuk percepatan penurunan stunting',
      ],
      sourceUrl: 'https://gizi.fk.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Nutrisionis / Dietisien Rumah Sakit (setelah Profesi Dietisien)',
        'Food Service & Quality Control Specialist Industri Pangan',
        'Konsultan Diet & Kebugaran Personal',
        'Programmer Gizi di Dinas Kesehatan / UNICEF / WHO',
      ],
      sourceUrl: 'https://gizi.fk.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'LAM-PTKes',
        tahun: 2023,
      },
      sourceUrl: 'https://gizi.fk.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://gizi.fk.undip.ac.id',
      sourceUrl: 'https://gizi.fk.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fk-farmasi': {
    programId: 'fk-farmasi',
    ringkasan: {
      value: 'Farmasi FK UNDIP mengintegrasikan farmasi sains-teknologi formulasi obat dengan farmasi klinik-komunitas. Mahasiswa dilatih dalam sintesis bahan obat, pengembangan sediaan farmasi modern, uji mutu, dan pelayanan farmasi rumah sakit.',
      sourceUrl: 'https://farmasi.fk.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Teknologi Formulasi Sediaan Padat & Steril',
        'Kimia Medisinal & Sintesis Obat',
        'Farmakoterapi & Interaksi Obat',
        'Biofarmasetika & Farmakokinetika',
        'Farmakognosi & Fitofarmaka Bahan Alam',
        'Farmasi Rumah Sakit & Pelayanan Resep',
      ],
      sourceUrl: 'https://farmasi.fk.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu merancang formula sediaan tablet, kapsul, suspensi, dan injeksi steril',
        'Mampu melakukan skrining resep dan analisis efek samping serta interaksi obat',
        'Menguasai pengujian mutu obat sesuai standar Farmakope Indonesia',
      ],
      sourceUrl: 'https://farmasi.fk.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Apoteker Rumah Sakit & Komunitas (setelah Program Profesi Apoteker)',
        'Formulator R&D Industri Farmasi & Kosmetik',
        'Quality Assurance / Quality Control Industri Obat',
        'Pengawas Obat & Makanan di BPOM',
      ],
      sourceUrl: 'https://farmasi.fk.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Unggul',
        lembaga: 'LAM-PTKes',
        tahun: 2023,
      },
      sourceUrl: 'https://farmasi.fk.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://farmasi.fk.undip.ac.id',
      sourceUrl: 'https://farmasi.fk.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
  'fk-kedokteran-gigi': {
    programId: 'fk-kedokteran-gigi',
    ringkasan: {
      value: 'Kedokteran Gigi FK UNDIP membekali mahasiswa dengan keilmuan stomatologi, konservasi gigi, prostodonsia, bedah mulut, dan kesehatan gigi masyarakat. Dilengkapi laboratorium dental phantom mutakhir dan integrasi klinik gigi RSND.',
      sourceUrl: 'https://fkg.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    mataKuliahKhas: {
      value: [
        'Ilmu Konservasi Gigi & Endodonsia',
        'Prostodonsia & Gigi Tiruan',
        'Bedah Mulut & Maksilofasial Dasar',
        'Periodonsia & Kesehatan Jaringan Penyangga',
        'Ortodonsia & Perataan Gigi',
        'Material Kedokteran Gigi & Dental Phantom',
      ],
      sourceUrl: 'https://fkg.undip.ac.id/kurikulum/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    kompetensiUtama: {
      value: [
        'Mampu melakukan restorasi kavitas gigi, preparasi saluran akar, dan ekstraksi gigi sederhana',
        'Mampu merancang gigi tiruan jembatan dan lepasan fungsional',
        'Mampu melaksanakan program pencegahan karies gigi pada komunitas anak dan dewasa',
      ],
      sourceUrl: 'https://fkg.undip.ac.id/profil-lulusan/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    prospekKarier: {
      value: [
        'Dokter Gigi (setelah menempuh Profesi Dokter Gigi & Ujian Kompetensi)',
        'Dokter Gigi Spesialis (Sp.KG, Sp.BM, Sp.Ort, dll.)',
        'Manajer Klinik Gigi Mandiri / Rumah Sakit',
        'Peneliti Sains Dental & Material Kedokteran Gigi',
      ],
      sourceUrl: 'https://fkg.undip.ac.id/karir/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    akreditasi: {
      value: {
        peringkat: 'Baik Sekali',
        lembaga: 'LAM-PTKes',
        tahun: 2023,
      },
      sourceUrl: 'https://fkg.undip.ac.id/akreditasi/',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
    lamanResmi: {
      value: 'https://fkg.undip.ac.id',
      sourceUrl: 'https://fkg.undip.ac.id',
      retrievedAt: RETRIEVED_AT,
      status: 'official',
    },
  },
};
