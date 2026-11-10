/**
 * Deterministic Interest Title Generator
 * Maps user's top two dominant RIASEC traits into a natural, encouraging Indonesian title and brief profile narrative.
 *
 * Rules:
 * - 100% deterministic (same RIASEC pair -> same title).
 * - No personality diagnosis, psychiatric labeling, or clinical claims.
 * - Non-judgmental and encouraging language.
 */

export interface InterestTitleResult {
  title: string;
  codePair: string;
  subtitle: string;
  narrative: string;
}

const RIASEC_NAMES: Record<string, string> = {
  R: 'Realistis (Pembuat / Praktikal)',
  I: 'Investigatif (Penyelidik / Analitis)',
  A: 'Artistik (Kreatif / Ekspresif)',
  S: 'Sosial (Pemberdaya / Edukatif)',
  E: 'Enterprising (Pemimpin / Penggerak)',
  C: 'Konvensional (Teliti / Terstruktur)',
};

const PAIR_MAP: Record<string, { title: string; subtitle: string; narrative: string }> = {
  // Investigative leading
  IR: {
    title: 'Penyelidik Praktis',
    subtitle: 'Investigatif & Realistis',
    narrative: 'Kamu menikmati pemecahan masalah dengan mendalami logika teoretis sekaligus menguji penerapannya secara nyata di lapangan atau laboratorium.',
  },
  IA: {
    title: 'Inovator Kreatif',
    subtitle: 'Investigatif & Artistik',
    narrative: 'Kamu menggabungkan ketajaman berpikir analitis dengan imajinasi orisinal untuk merumuskan gagasan baru yang bermakna.',
  },
  IS: {
    title: 'Pendidik Peneliti',
    subtitle: 'Investigatif & Sosial',
    narrative: 'Kamu senang mendalami ilmu pengetahuan dan tergerak membagikan pemahaman tersebut untuk membimbing serta memberdayakan sesama.',
  },
  IE: {
    title: 'Intelektual Strategis',
    subtitle: 'Investigatif & Enterprising',
    narrative: 'Kamu memadukan penalaran berbasis data dengan orientasi pencapaian, cocok untuk mengevaluasi opsi dan merumuskan arah kebijakan.',
  },
  IC: {
    title: 'Analis Sistematis',
    subtitle: 'Investigatif & Konvensional',
    narrative: 'Kamu memiliki ketelitian tinggi dalam membedah informasi, menyusun fakta, dan memastikan kesimpulan berdiri di atas struktur yang kokoh.',
  },

  // Realistic leading
  RI: {
    title: 'Perekayasa Analitis',
    subtitle: 'Realistis & Investigatif',
    narrative: 'Kamu menyukai tantangan teknis yang membutuhkan penalaran ilmiah mendalam untuk menghasilkan solusi sistem atau rancang bangun yang efektif.',
  },
  RA: {
    title: 'Kreator Terapan',
    subtitle: 'Realistis & Artistik',
    narrative: 'Kamu senang menggabungkan ketrampilan karya fungsional dengan kepekaan desain dan ekspresi visual yang nyata.',
  },
  RS: {
    title: 'Pendamping Lapangan',
    subtitle: 'Realistis & Sosial',
    narrative: 'Kamu tergerak untuk memberikan bantuan konkret bagi masyarakat melalui aksi nyata dan pendampingan di lingkungan kerja.',
  },
  RE: {
    title: 'Manajer Proyek Lapangan',
    subtitle: 'Realistis & Enterprising',
    narrative: 'Kamu mampu mengarahkan operasional kerja dan eksekusi teknis dengan ketegasan serta kejelasan target sasaran.',
  },
  RC: {
    title: 'Spesialis Presisi',
    subtitle: 'Realistis & Konvensional',
    narrative: 'Kamu sangat menghargai keakuratan proses kerja teknis, kepatuhan pada standar keselamatan, dan mutu hasil kerja.',
  },

  // Artistic leading
  AI: {
    title: 'Peneliti Konseptual',
    subtitle: 'Artistik & Investigatif',
    narrative: 'Kamu mengeksplorasi wawasan konseptual dengan rasa ingin tahu tinggi dan keberanian melihat sesuatu dari sudut pandang yang tak biasa.',
  },
  AR: {
    title: 'Perancang Fungsional',
    subtitle: 'Artistik & Realistis',
    narrative: 'Kamu gemar mewujudkan ide estetika ke dalam bentuk fisik, media terapan, atau arsitektur yang dapat dirasakan manfaatnya.',
  },
  AS: {
    title: 'Komunikator Inspiratif',
    subtitle: 'Artistik & Sosial',
    narrative: 'Kamu terampil menggunakan medium bahasa, cerita, dan visual kreatif untuk membangun empati dan menyentuh pemikiran orang lain.',
  },
  AE: {
    title: 'Kreator Pelopor',
    subtitle: 'Artistik & Enterprising',
    narrative: 'Kamu bersemangat memimpin inisiatif baru dan mempromosikan gagasan kreatif agar memiliki dampak luas di industri kreatif atau masyarakat.',
  },
  AC: {
    title: 'Desainer Terstruktur',
    subtitle: 'Artistik & Konvensional',
    narrative: 'Kamu menciptakan karya kreatif yang tidak hanya indah secara visual namun juga rapi dalam dokumentasi, tata letak, dan detail teknis.',
  },

  // Social leading
  SI: {
    title: 'Pemerhati Humaniora',
    subtitle: 'Sosial & Investigatif',
    narrative: 'Kamu tertarik menelaah dinamika perilaku manusia dan fenomena kemasyarakatan melalui pendekatan ilmiah yang penuh empati.',
  },
  SA: {
    title: 'Penggerak Edukasi Kreatif',
    subtitle: 'Sosial & Artistik',
    narrative: 'Kamu senang berinteraksi dengan komunitas menggunakan pendekatan komunikasi yang hangat, interaktif, dan penuh kreativitas.',
  },
  SR: {
    title: 'Relawan Berdaya',
    subtitle: 'Sosial & Realistis',
    narrative: 'Kamu senang membantu sesama secara langsung lewat tindakan praktis, gotong royong, dan kehadiran nyata di tengah masyarakat.',
  },
  SE: {
    title: 'Pemimpin Kolaboratif',
    subtitle: 'Sosial & Enterprising',
    narrative: 'Kamu mampu menyatukan berbagai pihak untuk bekerja sama mencapai tujuan positif melalui dialog yang terbuka dan suportif.',
  },
  SC: {
    title: 'Fasilitator Tertib',
    subtitle: 'Sosial & Konvensional',
    narrative: 'Kamu andal dalam mendampingi orang lain sekaligus menjaga agar administrasi, alur layanan, dan tata tertib berjalan lancar.',
  },

  // Enterprising leading
  EI: {
    title: 'Visioner Berbasis Data',
    subtitle: 'Enterprising & Investigatif',
    narrative: 'Kamu cakap dalam memimpin dan menyusun strategi yang selalu diperkuat oleh data, fakta, serta kalkulasi rasional.',
  },
  ER: {
    title: 'Eksekutor Tangguh',
    subtitle: 'Enterprising & Realistis',
    narrative: 'Kamu berorientasi pada pencapaian hasil nyata, sigap mengatasi kendala di lapangan, dan tegas dalam membagi peran kerja tim.',
  },
  EA: {
    title: 'Penggerak Inovasi',
    subtitle: 'Enterprising & Artistik',
    narrative: 'Kamu memiliki energi tinggi untuk menginspirasi orang lain, memasarkan ide kreatif, dan menciptakan terobosan dalam kegiatan proyek.',
  },
  ES: {
    title: 'Diplomat Pengayom',
    subtitle: 'Enterprising & Sosial',
    narrative: 'Kamu memiliki bakat kepemimpinan yang merangkul, piawai bernegosiasi, dan senantiasa menaruh perhatian pada kepentingan anggota.',
  },
  EC: {
    title: 'Administrator Strategis',
    subtitle: 'Enterprising & Konvensional',
    narrative: 'Kamu mengarahkan organisasi menuju efisiensi tinggi melalui perencanaan target yang matang, disiplin anggaran, dan tata kelola tertib.',
  },

  // Conventional leading
  CI: {
    title: 'Spesialis Tata Kelola Data',
    subtitle: 'Konvensional & Investigatif',
    narrative: 'Kamu sangat teliti dalam mengorganisir data, menjaga integritas arsip, dan memastikan sistem informasi berjalan sesuai aturan ketat.',
  },
  CR: {
    title: 'Teknisi Prosedural',
    subtitle: 'Konvensional & Realistis',
    narrative: 'Kamu cermat dalam mengoperasikan peralatan dan mematuhi standar prosedur kerja agar hasil selalu konsisten dan bebas kesalahan.',
  },
  CA: {
    title: 'Kurator Terorganisir',
    subtitle: 'Konvensional & Artistik',
    narrative: 'Kamu telaten menyusun dokumentasi karya, katalogisasi, serta memastikan presentasi konten tersaji secara rapi dan estetis.',
  },
  CS: {
    title: 'Koordinator Pelayanan',
    subtitle: 'Konvensional & Sosial',
    narrative: 'Kamu senang melayani kebutuhan orang banyak dengan ramah sembari memastikan tata tertib dan administrasi tetap tertata sempurna.',
  },
  CE: {
    title: 'Pengawas Efisiensi',
    subtitle: 'Konvensional & Enterprising',
    narrative: 'Kamu teliti dalam menjaga kelancaran alur kerja organisasi dan memastikan sumber daya digunakan secara optimal dan bertanggung jawab.',
  },
};

/**
 * Derives a deterministic interest title and description from dominant RIASEC traits.
 */
export function getInterestTitle(
  topRiasec?: { code: string; label: string }[] | null
): InterestTitleResult {
  if (!topRiasec || topRiasec.length === 0) {
    return {
      title: 'Eksplorator Minat',
      codePair: 'MULTI',
      subtitle: 'Multidimensi Adaptif',
      narrative: 'Kamu memiliki minat yang tersebar secara fleksibel di berbagai bidang ilmu dan aktivitas akademik.',
    };
  }

  const first = (topRiasec[0]?.code || '').toUpperCase();
  const second = (topRiasec[1]?.code || first).toUpperCase();
  const pairKey = `${first}${second}`;

  if (PAIR_MAP[pairKey]) {
    return {
      ...PAIR_MAP[pairKey],
      codePair: pairKey,
    };
  }

  // Fallback for single dominant trait or same code twice
  const firstName = RIASEC_NAMES[first] || first;
  return {
    title: `Spesialis ${first}`,
    codePair: first,
    subtitle: firstName,
    narrative: `Kamu memiliki fokus minat yang kuat pada karakter ${firstName}, yang menjadi fondasi utama dalam preferensi belajarmu.`,
  };
}

/**
 * Returns all pair mappings for documentation and audit purposes.
 */
export function getAllInterestTitlePairs(): Record<string, { title: string; subtitle: string; narrative: string }> {
  return PAIR_MAP;
}
