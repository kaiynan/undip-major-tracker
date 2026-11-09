import { faculties } from '../src/data/faculties';
import { studyPrograms } from '../src/data/programs';
import { programDetailsRecord, ProgramDetail } from '../src/data/programDetails';
import { scholarshipsData } from '../src/data/scholarships';

console.log('=== DATA COVERAGE TABLE ===');
console.log('| Fakultas / Sekolah | Singkatan | Jumlah Prodi | Ringkasan | MK Khas | Kompetensi | Karier | Akreditasi | Laman Resmi |');
console.log('| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |');

type FieldKey = keyof Omit<ProgramDetail, 'programId'>;

for (const f of faculties) {
  const progs = studyPrograms.filter((p) => p.facultyId === f.id);
  const total = progs.length;
  const countField = (field: FieldKey) => progs.filter((p) => !!programDetailsRecord[p.id]?.[field]).length;
  console.log(
    `| ${f.name} | ${f.shortName} | ${total} | ${countField('ringkasan')}/${total} | ${countField('mataKuliahKhas')}/${total} | ${countField('kompetensiUtama')}/${total} | ${countField('prospekKarier')}/${total} | ${countField('akreditasi')}/${total} | ${countField('lamanResmi')}/${total} |`
  );
}

console.log('\n=== SCHOLARSHIPS TABLE ===');
console.log('| Nama Beasiswa | Penyelenggara | Kategori | Jenjang | Cakupan Bantuan | Host Sumber Rujukan |');
console.log('| :--- | :--- | :---: | :---: | :--- | :--- |');

for (const s of scholarshipsData) {
  const host = new URL(s.sourceUrl).hostname.replace(/^www\./, '');
  console.log(
    `| ${s.nama} | ${s.penyelenggara} | ${s.kategoriPenyelenggara} | ${s.jenjang.join(', ')} | ${s.coverageType === 'penuh' ? 'UKT Penuh & Biaya Hidup' : s.coverageType === 'biaya_kuliah' ? 'Bantuan UKT' : 'Uang Saku & Pelatihan'} | [${host}](${s.sourceUrl}) |`
  );
}
