import fs from 'fs';
import path from 'path';
import { calculateAllScores } from '../src/lib/engine';
import { studyPrograms } from '../src/data/programs';
import { questions } from '../src/data/questions';
import { UserAnswers, isPsdku } from '../src/data/types';

// Deterministic Pseudo-Random Number Generator
let seed = 123456789;
function pseudoRandom() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

function randomInt(min: number, max: number) {
  return Math.floor(pseudoRandom() * (max - min + 1)) + min;
}

interface GapRecord {
  gap1_5: number;
  gap1_10: number;
}

function calculatePercentile(sortedArr: number[], p: number): number {
  if (sortedArr.length === 0) return 0;
  const index = (p / 100) * (sortedArr.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sortedArr[lower] * (1 - weight) + sortedArr[upper] * weight;
}

function getStats(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / sorted.length;
  return {
    count: sorted.length,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean: Number(mean.toFixed(2)),
    p10: Number(calculatePercentile(sorted, 10).toFixed(2)),
    p25: Number(calculatePercentile(sorted, 25).toFixed(2)),
    p50: Number(calculatePercentile(sorted, 50).toFixed(2)),
    p75: Number(calculatePercentile(sorted, 75).toFixed(2)),
    p90: Number(calculatePercentile(sorted, 90).toFixed(2)),
  };
}

console.log('Starting HMIM Interest Spread Simulation...');
console.log(`Available Study Programs: ${studyPrograms.length}`);
console.log(`Available Questions: ${questions.length}`);

// -----------------------------------------------------------------------------
// 1. Simulate 2,500 Random Answer Sets
// -----------------------------------------------------------------------------
const RANDOM_COUNT = 2500;
const randomGaps: GapRecord[] = [];

for (let i = 0; i < RANDOM_COUNT; i++) {
  const answers: UserAnswers = {};
  for (const q of questions) {
    answers[q.id] = randomInt(1, 5);
  }

  const allScores = calculateAllScores(answers, studyPrograms, questions);
  const ranked = allScores.filter((s) => {
    const prog = studyPrograms.find((p) => p.id === s.programId);
    return !isPsdku(prog);
  });

  const gap1_5 = ranked[0].totalScore - ranked[4].totalScore;
  const gap1_10 = ranked[0].totalScore - ranked[9].totalScore;
  randomGaps.push({ gap1_5, gap1_10 });
}

// -----------------------------------------------------------------------------
// 2. Simulate 300 Focused/Consistent Answer Sets
// -----------------------------------------------------------------------------
// Consistent respondent clusters: Engineering, Health, Computing, Social, Business, Law, Science, Agro-Maritime
const clusters = [
  { name: 'Teknik', domain: 'D1', riasec: 'R', curriculum: 'lab_engineering', learning: 'design' },
  { name: 'Sains', domain: 'D2', riasec: 'I', curriculum: 'lab_engineering', learning: 'experimental' },
  { name: 'Kesehatan', domain: 'D3', riasec: 'I', curriculum: 'health_clinical', learning: 'experimental' },
  { name: 'Komputer', domain: 'D5', riasec: 'I', curriculum: 'computation', learning: 'analytical' },
  { name: 'Bisnis', domain: 'D6', riasec: 'E', curriculum: 'business_finance', learning: 'business' },
  { name: 'Hukum', domain: 'D7', riasec: 'E', curriculum: 'legal_policy', learning: 'communication' },
  { name: 'Sosial', domain: 'D8', riasec: 'S', curriculum: 'social_research', learning: 'human' },
  { name: 'Psikologi', domain: 'D9', riasec: 'S', curriculum: 'social_research', learning: 'human' },
  { name: 'Agro', domain: 'D10', riasec: 'R', curriculum: 'env_marine', learning: 'field' },
  { name: 'Kelautan', domain: 'D11', riasec: 'R', curriculum: 'env_marine', learning: 'field' },
  { name: 'Humaniora', domain: 'D12', riasec: 'A', curriculum: 'creative_cultural', learning: 'communication' },
];

const CONSISTENT_COUNT = 300;
const consistentGaps: GapRecord[] = [];

for (let i = 0; i < CONSISTENT_COUNT; i++) {
  const cluster = clusters[i % clusters.length];
  const answers: UserAnswers = {};

  for (const q of questions) {
    const isTargetDomain = q.subdimension === cluster.domain;
    const isTargetRiasec = q.subdimension === cluster.riasec;
    const isTargetCurr = q.subdimension === cluster.curriculum;
    const isTargetLearning = q.subdimension === cluster.learning;

    if (isTargetDomain || isTargetRiasec || isTargetCurr || isTargetLearning) {
      // Strongly interested in target cluster with slight variance (4-5)
      answers[q.id] = pseudoRandom() > 0.3 ? 5 : 4;
    } else {
      // Low or neutral in unrelated domains (1-2, occasionally 3)
      const roll = pseudoRandom();
      answers[q.id] = roll < 0.6 ? 1 : roll < 0.9 ? 2 : 3;
    }
  }

  const allScores = calculateAllScores(answers, studyPrograms, questions);
  const ranked = allScores.filter((s) => {
    const prog = studyPrograms.find((p) => p.id === s.programId);
    return !isPsdku(prog);
  });

  const gap1_5 = ranked[0].totalScore - ranked[4].totalScore;
  const gap1_10 = ranked[0].totalScore - ranked[9].totalScore;
  consistentGaps.push({ gap1_5, gap1_10 });
}

// -----------------------------------------------------------------------------
// 3. Compute Statistical Summaries
// -----------------------------------------------------------------------------
const randomGap1_5Stats = getStats(randomGaps.map((g) => g.gap1_5));
const randomGap1_10Stats = getStats(randomGaps.map((g) => g.gap1_10));

const consistentGap1_5Stats = getStats(consistentGaps.map((g) => g.gap1_5));
const consistentGap1_10Stats = getStats(consistentGaps.map((g) => g.gap1_10));

console.log('\n--- Random Answer Sets (N=2,500) ---');
console.log('Gap #1 - #5:', randomGap1_5Stats);
console.log('Gap #1 - #10:', randomGap1_10Stats);

console.log('\n--- Consistent/Focused Answer Sets (N=300) ---');
console.log('Gap #1 - #5:', consistentGap1_5Stats);
console.log('Gap #1 - #10:', consistentGap1_10Stats);

// Documented Threshold Selection:
// In consistent respondent sets, P25 of (score#1 - score#5) represents the boundary below which
// the top 5 scores are unusually bunched together even for someone with focused interests.
// Furthermore, if gap1_5 < 3.50% (or gap1_10 < 6.00%), top majors differ by mere fractions of a percent.
const selectedThreshold = Number(consistentGap1_5Stats.p25.toFixed(2));
console.log(`\nSelected Documented Threshold for (score#1 - score#5): <= ${selectedThreshold}%`);

// -----------------------------------------------------------------------------
// 4. Generate docs/spread-threshold.md
// -----------------------------------------------------------------------------
const markdownContent = `# Analisis Empiris Ambang Batas Minat Tersebar (Spread Threshold)

Dokumen ini memuat dasar metodologis, simulasi empiris, dan penentuan ambang batas (*spread threshold*) untuk fitur peringatan **"Minat Tersebar"** pada mesin rekomendasi **HMIM (Hybrid Multi-Dimensional Interest Matching)** UNDIP.

---

## 1. Latar Belakang & Masalah

Pada kuesioner penjurusan perguruan tinggi, terdapat dua tipe profil responden yang umum:
1. **Profil Terfokus (*peaked interest*)**: Pengguna memiliki preferensi yang jelas pada rumpun ilmu tertentu (misal: murni menyukai informatika & matematika, atau murni menyukai kedokteran & biologi). Peringkat 1 dengan peringkat berikutnya memiliki selisih skor (*gap*) yang tegas.
2. **Profil Tersebar (*spread / diffuse interest*)**: Pengguna menyukai hampir semua hal secara merata, atau menjawab dengan nilai seragam. Akibatnya, skor prodi peringkat 1 s.d. peringkat 5 hingga peringkat 10 memiliki selisih yang sangat tipis (misal hanya terpaut 1-3%).

Menyajikan peringkat 1 sebagai pilihan mutlak ketika selisihnya dengan peringkat 5 sangat kecil dapat menyesatkan siswa. Oleh karena itu, sistem memberikan **peringatan afirmatif yang netral dan membantu**:
> *"Minatmu cukup tersebar, jadi beberapa prodi di peringkat atas nilainya berdekatan. Coba simpan ke Favorit dan bandingkan beberapa prodi, atau konsultasi dengan SERADIP."*

Peringatan ini **sama sekali tidak mengubah formula atau urutan peringkat**, melainkan memberikan panduan kontekstual agar siswa membandingkan program studi terkait secara berdampingan.

---

## 2. Metodologi Simulasi

Simulasi dijalankan menggunakan mesin resmi \`calculateAllScores\` terhadap seluruh 36 pertanyaan kuesioner dan 65 program studi kampus Semarang (program PSDKU dikecualikan dari pemeringkatan).

Dua kelompok data disimulasikan:
1. **Kelompok Acak (*Random Answer Sets*, $N = 2.500$)**:
   - Jawaban tiap butir kuesioner dibangkitkan dari distribusi seragam Likert $1-5$.
   - Merepresentasikan spektrum pengguna tanpa kecenderungan arah minat tertentu.
2. **Kelompok Terfokus/Konsisten (*Consistent Focused Answer Sets*, $N = 300$)**:
   - Disimulasikan melintasi 11 kluster disiplin ilmu (Teknik, Sains, Kesehatan, Komputer, Bisnis, Hukum, Sosial, Psikologi, Agro, Kelautan, Humaniora).
   - Pertanyaan yang sesuai dengan rumpun kluster dijawab dengan antusiasme tinggi (skor 4-5), sedangkan rumpun lain dijawab rendah/netral (skor 1-2).

Untuk setiap responden, dihitung:
- $\\Delta_{1-5} = \\text{Score}_{\\#1} - \\text{Score}_{\\#5}$
- $\\Delta_{1-10} = \\text{Score}_{\\#1} - \\text{Score}_{\\#10}$

---

## 3. Hasil Distribusi Statistik

### Tabel Distribusi Selisih Skor (Persentil)

| Kelompok Responden | Ukuran Sampel ($N$) | Metrik | Min | P10 | P25 | Median (P50) | P75 | P90 | Max | Mean |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Random (Acak)** | 2.500 | $\\Delta_{1-5}$ | ${randomGap1_5Stats.min}% | ${randomGap1_5Stats.p10}% | ${randomGap1_5Stats.p25}% | ${randomGap1_5Stats.p50}% | ${randomGap1_5Stats.p75}% | ${randomGap1_5Stats.p90}% | ${randomGap1_5Stats.max}% | ${randomGap1_5Stats.mean}% |
| **Random (Acak)** | 2.500 | $\\Delta_{1-10}$ | ${randomGap1_10Stats.min}% | ${randomGap1_10Stats.p10}% | ${randomGap1_10Stats.p25}% | ${randomGap1_10Stats.p50}% | ${randomGap1_10Stats.p75}% | ${randomGap1_10Stats.p90}% | ${randomGap1_10Stats.max}% | ${randomGap1_10Stats.mean}% |
| **Konsisten (Terfokus)** | 300 | $\\Delta_{1-5}$ | ${consistentGap1_5Stats.min}% | ${consistentGap1_5Stats.p10}% | **${consistentGap1_5Stats.p25}%** | ${consistentGap1_5Stats.p50}% | ${consistentGap1_5Stats.p75}% | ${consistentGap1_5Stats.p90}% | ${consistentGap1_5Stats.max}% | ${consistentGap1_5Stats.mean}% |
| **Konsisten (Terfokus)** | 300 | $\\Delta_{1-10}$ | ${consistentGap1_10Stats.min}% | ${consistentGap1_10Stats.p10}% | ${consistentGap1_10Stats.p25}% | ${consistentGap1_10Stats.p50}% | ${consistentGap1_10Stats.p75}% | ${consistentGap1_10Stats.p90}% | ${consistentGap1_10Stats.max}% | ${consistentGap1_10Stats.mean}% |

---

## 4. Penentuan Ambang Batas (\`INTEREST_SPREAD_THRESHOLD\`)

Berdasarkan data empiris di atas:
- Pada kelompok responden konsisten/terfokus, persentil ke-25 ($P_{25}$) untuk selisih peringkat 1 terhadap peringkat 5 adalah **${selectedThreshold}%**.
- Ini berarti bahwa $75\\%$ responden dengan minat terfokus memiliki selisih $\\Delta_{1-5} > ${selectedThreshold}\\%$.
- Sebaliknya, responden yang memiliki $\\Delta_{1-5} \\le ${selectedThreshold}\\%$ menunjukkan pola keselarasan yang sangat rapat antar beberapa prodi teratas (kurang dari ${selectedThreshold}\\%$ poin perbedaan antara pilihan nomor 1 dan nomor 5).

### Definisi Aturan Deteksi:
Peringatan minat tersebar diaktifkan bila:
$$\\text{Score}_{\\#1} - \\text{Score}_{\\#5} \\le ${selectedThreshold}\\%$$

Atau bila jumlah program studi yang dihitung $< 5$, bila selisih peringkat pertama dan peringkat terakhir yang tersedia $\\le 2.0\\%$.

Konstanta ini diekspos secara publik pada \`src/lib/interestSpread.ts\`:
\`\`\`ts
export const INTEREST_SPREAD_THRESHOLD = ${selectedThreshold}; // Dokumen analisis: docs/spread-threshold.md
\`\`\`

---

## 5. Ringkasan Kesimpulan
1. **Nilai Ambang Batas Terpilih**: **${selectedThreshold}%** untuk selisih skor prodi peringkat #1 dan #5.
2. **Sifat Fitur**: Informatif & edukatif. Peringkat rekomendasi tidak diubah, namun pengguna difasilitasi dengan tombol pintas ke fitur Bandingkan dan konsultasi pendampingan SERADIP.
3. **Audit Transparansi**: Ambang batas ini ditampilkan secara terbuka pada halaman Administrasi Algoritma (\`/admin\`).
`;

const docPath = path.join(__dirname, '../docs/spread-threshold.md');
fs.writeFileSync(docPath, markdownContent, 'utf-8');
console.log(`Successfully generated documentation: ${docPath}`);
