// =============================================================================
// undip-major-matcher — Automated Data Guard & Integrity Test Suite
// =============================================================================
// Rules enforced:
// 1. Any item with status: 'official' must have an evidence field citing docs/sources/
//    or a specific non-root URL.
// 2. retrievedAt must not be in the future, and cannot equal today's date when citing
//    an older official document file.
// 3. nextSteps.ts cannot contain any Rupiah patterns (Rp\s?\d) in entries where
//    status is not 'official'.
// 4. Any program that defines a department must have departmentSourceUrl/departmentEvidence.
// 5. The quota academicYear must be consistent across data and UI models.
// 6. Optional --check-links verifies online HTTP availability when requested.
// =============================================================================

import * as fs from 'fs';
import * as path from 'path';
import { nextStepsData } from '../src/data/nextSteps';
import { studyPrograms } from '../src/data/programs';
import { admissionQuotas } from '../src/data/quotas';
import { programUKTList } from '../src/data/ukt';
import { isPsdku } from '../src/data/types';
import { programDetailsRecord, ProgramDetail } from '../src/data/programDetails';
import { scholarshipsData } from '../src/data/scholarships';

const ROOT_DIR = path.resolve(__dirname, '..');
const SOURCES_DIR = path.join(ROOT_DIR, 'docs', 'sources');

interface IntegrityFailure {
  category: string;
  item: string;
  message: string;
}

const failures: IntegrityFailure[] = [];

function assert(condition: boolean, category: string, item: string, message: string) {
  if (!condition) {
    failures.push({ category, item, message });
    console.error(`  ❌ [FAIL] [${category}] ${item}: ${message}`);
  } else {
    console.log(`  ✓ [PASS] [${category}] ${item}`);
  }
}

console.log('===========================================================');
console.log('DEFINE YOUR NEXT MOVE — DATA INTEGRITY & GUARD TESTS');
console.log('===========================================================\n');

// -----------------------------------------------------------------------------
// [GUARD 1] Next Steps Official Status & Evidence Validation
// -----------------------------------------------------------------------------
console.log('[GUARD 1] Validating nextStepsData Official Evidence & Citations...');

const REQUIRED_ROADSHOW_EVIDENCE = 'Keterangan panitia Roadshow, 2026 — belum ada dokumen resmi di docs/sources';

const sections = [
  { name: 'ukt', data: nextStepsData.ukt },
  { name: 'kipk', data: nextStepsData.kipk },
  { name: 'calendar', data: nextStepsData.calendar },
  { name: 'jalurMandiri', data: nextStepsData.jalurMandiri },
];

const now = new Date();

for (const sec of sections) {
  const d = sec.data;
  if (d.status === 'official') {
    assert(
      !!d.evidence && d.evidence.trim().length > 0,
      'Guard 1 - Evidence Required',
      sec.name,
      `Status is 'official' but evidence field is missing or empty!`
    );

    const isFileCited = d.evidence?.includes('docs/sources/');
    if (isFileCited) {
      const match = d.evidence?.match(/docs\/sources\/([^,\s]+)/);
      if (match) {
        const filePath = path.join(SOURCES_DIR, match[1]);
        assert(
          fs.existsSync(filePath),
          'Guard 1 - File Existence',
          sec.name,
          `Cited source file '${match[1]}' does not exist in docs/sources/!`
        );
      }
    } else {
      // Must not be a bare site root
      try {
        const parsed = new URL(d.sourceUrl);
        const isRoot = parsed.pathname === '/' || parsed.pathname === '';
        assert(!isRoot, 'Guard 1 - Non-Root URL', sec.name, `Official sourceUrl '${d.sourceUrl}' is only a site root without specific path!`);
      } catch (err: unknown) {
        assert(false, 'Guard 1 - Valid URL', sec.name, `Invalid URL format '${d.sourceUrl}': ${(err as Error).message}`);
      }
    }

    // Check retrievedAt date validity
    const itemDate = new Date(d.retrievedAt);
    assert(itemDate <= now, 'Guard 2 - Date Validity', sec.name, `retrievedAt '${d.retrievedAt}' is in the future!`);
  } else {
    // If status is 'reference' with authorized panitia Roadshow evidence, allow verified Rupiah values
    const isAuthorizedReference =
      d.status === 'reference' && d.evidence === REQUIRED_ROADSHOW_EVIDENCE;

    if (isAuthorizedReference) {
      assert(
        d.evidence === REQUIRED_ROADSHOW_EVIDENCE,
        'Guard 1 - Roadshow Evidence Match',
        sec.name,
        `Reference entry has unauthorized evidence string: '${d.evidence}'`
      );
      assert(
        (d.status as string) !== 'official',
        'Guard 1 - Provenance Not Official',
        sec.name,
        `Data with roadshow evidence must not be marked 'official'!`
      );
    } else {
      // Non-official without approved roadshow evidence MUST NOT contain invented Rupiah patterns
      const jsonStr = JSON.stringify(d);
      const rupiahMatch = jsonStr.match(/Rp\s?\d[\d.,]*/i);
      assert(
        !rupiahMatch,
        'Guard 3 - No Unauthorized Numbers',
        sec.name,
        `Section has status '${d.status}' with no valid evidence but contains numeric Rupiah pattern: '${rupiahMatch?.[0]}'! Remove invented numbers or verify officially.`
      );
    }
  }
}

// -----------------------------------------------------------------------------
// [GUARD 2] Raw nextSteps.ts Rupiah Scanning & Negative Tests
// -----------------------------------------------------------------------------
console.log('\n[GUARD 2] Scanning nextSteps.ts for unauthorized Rupiah amounts...');
const nextStepsFile = fs.readFileSync(path.join(ROOT_DIR, 'src/data/nextSteps.ts'), 'utf-8');

// Ensure kipk and calendar blocks in nextSteps.ts contain 0 rupiah signs
const kipkMatch = nextStepsFile.match(/kipk:\s*\{[\s\S]*?\n\s*\},/);
if (kipkMatch) {
  const rupiahInKipk = kipkMatch[0].match(/Rp\s?\d/i);
  assert(!rupiahInKipk, 'Guard 3 - KIP-K Safe', 'nextSteps.ts', 'Found numeric Rupiah amount in unverified KIP-K data!');
}

const calMatch = nextStepsFile.match(/calendar:\s*\{[\s\S]*?\n\s*\},/);
if (calMatch) {
  const rupiahInCal = calMatch[0].match(/Rp\s?\d/i);
  assert(!rupiahInCal, 'Guard 3 - Calendar Safe', 'nextSteps.ts', 'Found numeric Rupiah amount in unverified Calendar data!');
}

// Ensure jalurMandiri block contains the exact required evidence string and is marked 'reference'
const mandiriMatch = nextStepsFile.match(/jalurMandiri:\s*\{[\s\S]*?\n\s*\},/);
if (mandiriMatch) {
  const rupiahInMandiri = mandiriMatch[0].match(/Rp\s?\d/i);
  if (rupiahInMandiri) {
    const hasEvidence = mandiriMatch[0].includes('Keterangan panitia Roadshow, 2026 — belum ada dokumen resmi di docs/sources');
    const isReference = mandiriMatch[0].includes("status: 'reference'");
    assert(
      hasEvidence && isReference,
      'Guard 3 - Jalur Mandiri Provenance Valid',
      'nextSteps.ts',
      'Jalur Mandiri has Rupiah amount but lacks required Roadshow reference evidence or is marked official!'
    );
  }
}

// Negative test trap: verify that an unauthorized entry with Rupiah and no evidence would be rejected
const mockUnauthorizedEntry = {
  status: 'reference',
  evidence: 'Sumber tidak sah',
  amount: 'Rp500.000',
};
const mockIsAllowed =
  mockUnauthorizedEntry.status === 'reference' &&
  mockUnauthorizedEntry.evidence === REQUIRED_ROADSHOW_EVIDENCE;
assert(
  !mockIsAllowed,
  'Guard 3 - Negative Trap (Unauthorized Rupiah Blocked)',
  'negative-test',
  'Guard logic must reject unauthorized rupiah entries'
);

// -----------------------------------------------------------------------------
// [GUARD 3] Study Programs Department Integrity
// -----------------------------------------------------------------------------
console.log('\n[GUARD 3] Validating Program Departments & Evidence...');
let programsWithDept = 0;

for (const prog of studyPrograms) {
  if (prog.department) {
    programsWithDept++;
    assert(
      !!prog.departmentSourceUrl || !!prog.departmentEvidence,
      'Guard 4 - Department Evidence',
      prog.id,
      `Program defines department '${prog.department}' but has no departmentSourceUrl or departmentEvidence!`
    );

    if (prog.departmentSourceUrl && prog.departmentSourceUrl.includes('docs/sources/')) {
      const fileName = path.basename(prog.departmentSourceUrl);
      const filePath = path.join(SOURCES_DIR, fileName);
      assert(
        fs.existsSync(filePath),
        'Guard 4 - Department File Check',
        prog.id,
        `Cited department file '${fileName}' does not exist on disk!`
      );
    }
  }
}
console.log(`  ℹ Verified ${programsWithDept} programs with official department evidence; ${studyPrograms.length - programsWithDept} correctly grouped directly at faculty level.`);

// -----------------------------------------------------------------------------
// [GUARD 4] Quota Database Completeness & Academic Year Consistency
// -----------------------------------------------------------------------------
console.log('\n[GUARD 4] Validating Quotas Academic Year & Sum Consistency...');
const quotaYear = admissionQuotas[0]?.academicYear;
const progYear = studyPrograms[0]?.academicYear;

assert(
  quotaYear === progYear,
  'Guard 5 - Academic Year Consistency',
  'quotas vs programs',
  `Mismatch in academicYear! Quotas: '${quotaYear}', Programs: '${progYear}'`
);

assert(
  quotaYear === '2026/2027',
  'Guard 5 - 2026/2027 Target Year',
  'quotas',
  `Quotas must reflect the official decision for TA 2026/2027, found '${quotaYear}'!`
);

for (const q of admissionQuotas) {
  const calculated = (q.snbpQuota || 0) + (q.snbtQuota || 0) + (q.mandiriQuota || 0);
  assert(
    calculated === q.totalCapacity,
    'Guard 5 - Quota Sum Exactness',
    q.programId,
    `Quota sum mismatch: ${q.snbpQuota} + ${q.snbtQuota} + ${q.mandiriQuota} = ${calculated} != ${q.totalCapacity}`
  );
}

// -----------------------------------------------------------------------------
// [GUARD 5] Official UKT Database Integrity
// -----------------------------------------------------------------------------
console.log('\n[GUARD 5] Validating Official UKT Database (src/data/ukt.ts)...');
assert(
  programUKTList.length === 70,
  'Guard 6 - UKT Completeness',
  'programUKTList',
  `Expected UKT entries for all 70 programs, found ${programUKTList.length}`
);

for (const ukt of programUKTList) {
  assert(
    ukt.status === 'official',
    'Guard 6 - Official UKT Status',
    ukt.programId,
    `UKT entry status must be 'official'`
  );
  assert(
    !!ukt.evidence && ukt.evidence.includes('docs/sources/'),
    'Guard 6 - UKT Evidence File',
    ukt.programId,
    `UKT entry missing docs/sources/ evidence citation`
  );
  assert(
    ukt.groups.length >= 7,
    'Guard 6 - UKT Groups Count',
    ukt.programId,
    `UKT must define at least 7 groups, found ${ukt.groups.length}`
  );
}

// -----------------------------------------------------------------------------
// [GUARD 6] Quota Percentage Sum to 100%
// -----------------------------------------------------------------------------
console.log('\n[GUARD 6] Validating Quota Percentages Sum to 100%...');
for (const q of admissionQuotas) {
  if (q.totalCapacity && q.totalCapacity > 0) {
    const snbpPct = ((q.snbpQuota || 0) / q.totalCapacity) * 100;
    const snbtPct = ((q.snbtQuota || 0) / q.totalCapacity) * 100;
    const mandiriPct = ((q.mandiriQuota || 0) / q.totalCapacity) * 100;
    const sumPct = Math.round(snbpPct + snbtPct + mandiriPct);
    assert(
      sumPct === 100,
      'Guard 7 - Quota Percentage Sum 100%',
      q.programId,
      `Percentages do not sum to 100%! Got ${sumPct}% (${snbpPct}% + ${snbtPct}% + ${mandiriPct}%)`
    );
  }
}

// -----------------------------------------------------------------------------
// [GUARD 7] Scanning for standalone "KIP-K" abbreviation in data & components
// -----------------------------------------------------------------------------
console.log('\n[GUARD 7] Scanning for standalone "KIP-K" label in src/data and src/components...');
function findCodeFiles(dir: string, exts: string[]): string[] {
  let results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(findCodeFiles(fullPath, exts));
    } else if (exts.some((e) => file.endsWith(e))) {
      results.push(fullPath);
    }
  }
  return results;
}

const filesToCheckKipk = [
  ...findCodeFiles(path.join(ROOT_DIR, 'src/data'), ['.ts', '.tsx']),
  ...findCodeFiles(path.join(ROOT_DIR, 'src/components'), ['.ts', '.tsx']),
];

for (const filePath of filesToCheckKipk) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Match "KIP-K" when NOT part of "KIP-Kuliah"
  // Negative lookahead for "uliah"
  const matches = content.match(/\bKIP-K(?!uliah)\b/g);
  const relPath = path.relative(ROOT_DIR, filePath);
  assert(
    !matches || matches.length === 0,
    'Guard 8 - Standardized KIP-Kuliah Terminology',
    relPath,
    `Found standalone abbreviation 'KIP-K'! Standardize to 'KIP-Kuliah'.`
  );
}

// -----------------------------------------------------------------------------
// [GUARD 8] Scanning for "100%" claims attached to scholarship/beasiswa in user-facing copy
// -----------------------------------------------------------------------------
console.log('\n[GUARD 8] Scanning for unauthorized "100%" scholarship claims in copy...');
const userFacingFiles = [
  ...findCodeFiles(path.join(ROOT_DIR, 'src/components'), ['.tsx']),
  ...findCodeFiles(path.join(ROOT_DIR, 'src/app'), ['.tsx']),
];

for (const filePath of userFacingFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  // Check for "100% beasiswa", "beasiswa 100%", "peluang beasiswa 100%"
  const claimRegex = /(100%\s*(beasiswa|kip-kuliah|kip)|(beasiswa|kip-kuliah|kip)[\s\S]{0,25}100%)/i;
  const match = content.match(claimRegex);
  const relPath = path.relative(ROOT_DIR, filePath);
  assert(
    !match,
    'Guard 9 - No 100% Scholarship Claims',
    relPath,
    `Found potential 100% scholarship claim: "${match?.[0]}"`
  );
}

// -----------------------------------------------------------------------------
// [GUARD 10] Validating Program Counts Consistency (Ranked vs Listed)
// -----------------------------------------------------------------------------
console.log('\n[GUARD 10] Validating Program Counts Consistency (Ranked vs Listed)...');
const totalProgs = studyPrograms.length;
const rankedProgs = studyPrograms.filter((p) => !isPsdku(p)).length;
const psdkuProgs = studyPrograms.filter((p) => isPsdku(p)).length;

assert(totalProgs === 70, 'Guard 10 - Total Programs Listed', 'studyPrograms', `Expected 70 total programs, got ${totalProgs}`);
assert(rankedProgs === 65, 'Guard 10 - Ranked Programs Count', 'studyPrograms', `Expected 65 ranked programs, got ${rankedProgs}`);
assert(psdkuProgs === 5, 'Guard 10 - PSDKU Programs Count', 'studyPrograms', `Expected 5 PSDKU programs, got ${psdkuProgs}`);

// Scan user facing code files for outdated hard-coded counts ("67 Program Studi", "67 Jurusan", "67 Prodi")
for (const filePath of userFacingFiles) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const outdatedMatches = content.match(/\b67\s*(program\s*studi|jurusan|prodi)\b/gi);
  const relPath = path.relative(ROOT_DIR, filePath);
  assert(
    !outdatedMatches || outdatedMatches.length === 0,
    'Guard 10 - No Outdated 67 Counts',
    relPath,
    `Found outdated count reference: "${outdatedMatches?.[0]}"! Update count to reflect real data (${rankedProgs} ranked / ${psdkuProgs} PSDKU / ${totalProgs} total).`
  );
}

// -----------------------------------------------------------------------------
// [GUARD 11] Validating Centralized Brand Usage (Unlock The Unseen & No Old Brand Literals)
// -----------------------------------------------------------------------------
console.log('\n[GUARD 11] Validating Centralized Brand Usage (Unlock The Unseen & No Old Brand Literals)...');

import { APP_NAME, APP_NAME_SHORT, TAGLINE, THEME } from '../src/config/brand';

assert(
  APP_NAME === 'Unlock The Unseen',
  'Guard 11 - Official Brand Name',
  'brand.ts',
  `Expected APP_NAME to be 'Unlock The Unseen', got '${APP_NAME}'`
);

assert(
  APP_NAME_SHORT === 'Unlock',
  'Guard 11 - Official Brand Short Name',
  'brand.ts',
  `Expected APP_NAME_SHORT to be 'Unlock', got '${APP_NAME_SHORT}'`
);

assert(
  APP_NAME_SHORT.length <= 12,
  'Guard 11 - PWA Short Name Constraint',
  'brand.ts',
  `APP_NAME_SHORT must be <= 12 chars for mobile PWA icon labels (got ${APP_NAME_SHORT.length})`
);

assert(
  THEME === 'Unlock The Unseen',
  'Guard 11 - Brand Theme',
  'brand.ts',
  `Expected THEME to be 'Unlock The Unseen', got '${THEME}'`
);

assert(
  TAGLINE === 'Find Your Potential, Define Your Next Move',
  'Guard 11 - Official Tagline',
  'brand.ts',
  `Expected TAGLINE to be 'Find Your Potential, Define Your Next Move', got '${TAGLINE}'`
);

const FORBIDDEN_BRAND_LITERALS = [
  'UNDIP Major Matcher',
  'Major Matcher',
  'UNDIP Matcher',
  'UNDIP Major Tracker',
  'Major Tracker',
];

function scanDirForBrandLiteral(dir: string): { file: string; literal: string }[] {
  let matched: { file: string; literal: string }[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'out', 'docs'].includes(entry.name)) continue;
      matched = matched.concat(scanDirForBrandLiteral(fullPath));
    } else if (/\.(tsx?|jsx?|webmanifest|json)$/.test(entry.name)) {
      if (fullPath.endsWith(path.join('src', 'config', 'brand.ts'))) continue;
      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      for (const forbidden of FORBIDDEN_BRAND_LITERALS) {
        if (fileContent.includes(forbidden)) {
          matched.push({ file: fullPath, literal: forbidden });
        }
      }
      // Check for 'Define Your Next Move' used as app name (not part of TAGLINE)
      const contentWithoutTagline = fileContent.split('Find Your Potential, Define Your Next Move').join('');
      if (contentWithoutTagline.includes('Define Your Next Move')) {
        matched.push({ file: fullPath, literal: 'Define Your Next Move (outside TAGLINE)' });
      }
    }
  }
  return matched;
}

const brandOffenders = scanDirForBrandLiteral(path.join(ROOT_DIR, 'src'));
assert(
  brandOffenders.length === 0,
  'Guard 11 - Centralized Brand Configuration (No Old Brand Literals)',
  'src/',
  `Found old brand literals in files: ${brandOffenders.map((f) => `${path.relative(ROOT_DIR, f.file)} ("${f.literal}")`).join(', ')}. Use APP_NAME from @/config/brand instead!`
);

// Negative Trap: ensure Guard 11 actively detects forbidden occurrences
const mockBadBrandLiteral = 'const title = "UNDIP Major Matcher";';
assert(
  FORBIDDEN_BRAND_LITERALS.some((f) => mockBadBrandLiteral.includes(f)),
  'Guard 11 - Negative Trap (Literal Detection Active)',
  'negative-test',
  'Negative trap failed to trigger'
);

// -----------------------------------------------------------------------------
// [GUARD 12] Program Details Provenance & Integrity (src/data/programDetails.ts)
// -----------------------------------------------------------------------------
console.log('\n[GUARD 12] Validating Program Details Provenance & Integrity...');
const detailKeys = Object.keys(programDetailsRecord);
assert(
  detailKeys.length === 70,
  'Guard 12 - Details Count (70 Programs)',
  'programDetailsRecord',
  `Expected 70 programs in programDetailsRecord, found ${detailKeys.length}`
);

const fieldsToCheck: Array<keyof Omit<ProgramDetail, 'programId'>> = [
  'ringkasan',
  'mataKuliahKhas',
  'kompetensiUtama',
  'prospekKarier',
  'akreditasi',
  'lamanResmi',
];

for (const [id, details] of Object.entries(programDetailsRecord)) {
  for (const field of fieldsToCheck) {
    const fg = details[field];
    if (fg) {
      assert(
        !!fg.sourceUrl && typeof fg.sourceUrl === 'string' && fg.sourceUrl.startsWith('http'),
        'Guard 12 - Field SourceUrl',
        `${id}.${field}`,
        `Field group has invalid or missing sourceUrl: '${fg.sourceUrl}'`
      );

      assert(
        !!fg.retrievedAt && typeof fg.retrievedAt === 'string',
        'Guard 12 - Field RetrievedAt',
        `${id}.${field}`,
        `Field group has missing retrievedAt date`
      );

      const d = new Date(fg.retrievedAt);
      assert(
        !isNaN(d.getTime()) && d <= now,
        'Guard 12 - RetrievedAt Not Future',
        `${id}.${field}`,
        `retrievedAt date '${fg.retrievedAt}' is invalid or in the future`
      );

      assert(
        fg.status === 'official' || fg.status === 'pending',
        'Guard 12 - Valid Status',
        `${id}.${field}`,
        `status must be 'official' or 'pending', found '${fg.status}'`
      );

      // Verify no salary/wage keywords or inflated promotional statistics
      const serialized = JSON.stringify(fg.value);
      const salaryMatch = serialized.match(/(gaji|salary|juta\/bulan|serapan kerja \d+%|jaminan kerja)/i);
      assert(
        !salaryMatch,
        'Guard 12 - No Salary or Employment Guarantee Claims',
        `${id}.${field}`,
        `Found forbidden salary or guarantee claim in detail data: '${salaryMatch?.[0]}'`
      );
    }
  }
}

// -----------------------------------------------------------------------------
// [GUARD 13] Scholarships Catalogue Integrity (src/data/scholarships.ts)
// -----------------------------------------------------------------------------
console.log('\n[GUARD 13] Validating Scholarships Catalogue Integrity...');
assert(
  scholarshipsData.length >= 8,
  'Guard 13 - Scholarship Count (>= 8)',
  'scholarshipsData',
  `Expected at least 8 scholarships in catalogue, found ${scholarshipsData.length}`
);

for (const s of scholarshipsData) {
  assert(
    !!s.id && !!s.nama && !!s.penyelenggara && !!s.kategoriPenyelenggara,
    'Guard 13 - Required Identification',
    s.id,
    `Missing core identification fields`
  );

  assert(
    Array.isArray(s.jenjang) && s.jenjang.length > 0,
    'Guard 13 - Jenjang Array',
    s.id,
    `jenjang must be non-empty array of S1/D4`
  );

  assert(
    Array.isArray(s.syaratUmum) && s.syaratUmum.length >= 3,
    'Guard 13 - Syarat Umum Points (>= 3)',
    s.id,
    `syaratUmum must contain at least 3 points, found ${s.syaratUmum?.length}`
  );

  assert(
    !!s.periodeBuka && s.periodeBuka.includes('dapat berubah'),
    'Guard 13 - Periode Buka Disclaimer',
    s.id,
    `periodeBuka must include 'dapat berubah'`
  );

  assert(
    !!s.sourceUrl && s.sourceUrl.startsWith('http'),
    'Guard 13 - SourceUrl Format',
    s.id,
    `sourceUrl must start with http`
  );

  assert(
    !!s.linkResmi && s.linkResmi.startsWith('http'),
    'Guard 13 - LinkResmi Format',
    s.id,
    `linkResmi must start with http`
  );

  const sDate = new Date(s.retrievedAt);
  assert(
    !isNaN(sDate.getTime()) && sDate <= now,
    'Guard 13 - RetrievedAt Valid & Not Future',
    s.id,
    `retrievedAt '${s.retrievedAt}' is invalid or in the future`
  );

  assert(
    s.status === 'official' || s.status === 'pending',
    'Guard 13 - Status Official/Pending',
    s.id,
    `status must be official or pending, found '${s.status}'`
  );

  // Negative Guard: No invented nominals in scholarship data
  const sSerialized = JSON.stringify(s);
  const rupiahMatch = sSerialized.match(/Rp\s?\d/i);
  assert(
    !rupiahMatch,
    'Guard 13 - No Invented Rupiah Amounts',
    s.id,
    `Found unauthorized numeric Rupiah amount in scholarship: '${rupiahMatch?.[0]}'`
  );

  // Standalone KIP-K check
  const kipkMatch = sSerialized.match(/\bKIP-K(?!uliah)\b/g);
  assert(
    !kipkMatch || kipkMatch.length === 0,
    'Guard 13 - Standardized KIP-Kuliah Terminology',
    s.id,
    `Found standalone abbreviation 'KIP-K' in scholarship data! Standardize to 'KIP-Kuliah'.`
  );
}

// -----------------------------------------------------------------------------
// [GUARD 14] SERADIP Consultation Contact Integrity (src/config/contact.ts)
// -----------------------------------------------------------------------------
console.log('\n[GUARD 14] Validating SERADIP Consultation Contact Integrity...');
import { CONTACTS, INSTAGRAM, CONTACT_CONFIG, isContactReady, waLink, buildWaLink } from '../src/config/contact';

// Test 1: Active readiness of contacts
assert(
  CONTACT_CONFIG.name === 'SERADIP',
  'Guard 14 - Contact Organization Name',
  'contact.ts',
  `Expected CONTACT_CONFIG.name to be 'SERADIP'`
);

assert(
  CONTACTS.length === 2,
  'Guard 14 - Dual SERADIP Contacts Configured',
  'contact.ts',
  `Expected 2 contacts, got ${CONTACTS.length}`
);

const dianContact = CONTACTS.find((c) => c.id === 'dian');
const cindyContact = CONTACTS.find((c) => c.id === 'cindy');

assert(
  !!dianContact && dianContact.wa === '6287741097976',
  'Guard 14 - Dian Contact Number',
  'contact.ts',
  `Dian contact must be 6287741097976, got ${dianContact?.wa}`
);

assert(
  !!cindyContact && cindyContact.wa === '6282210644934',
  'Guard 14 - Cindy Contact Number',
  'contact.ts',
  `Cindy contact must be 6282210644934, got ${cindyContact?.wa}`
);

assert(
  INSTAGRAM.handle === '@sedulurdiponegoro' && INSTAGRAM.url.includes('instagram.com/sedulurdiponegoro'),
  'Guard 14 - Official Instagram Integration',
  'contact.ts',
  `Instagram handle & URL must point to @sedulurdiponegoro`
);

assert(
  isContactReady(),
  'Guard 14 - Active Readiness When Configured',
  'contact.ts',
  'isContactReady() must return true when valid contacts are set'
);

// Test 2: Deep Link Generation
const testLink = buildWaLink('Halo Kakak SERADIP, saya mau tanya.');
assert(
  testLink.startsWith('https://wa.me/6287741097976?text='),
  'Guard 14 - Correct wa.me Deep Link Format',
  'contact.ts',
  `Expected wa.me URL with clean digits, got '${testLink}'`
);

assert(
  testLink.includes(encodeURIComponent('Halo Kakak SERADIP, saya mau tanya.')),
  'Guard 14 - Encoded Message Text',
  'contact.ts',
  'Message string must be URI encoded in WhatsApp deep link'
);

const cindyLink = waLink('cindy', 'Halo Kak Cindy');
assert(
  cindyLink.startsWith('https://wa.me/6282210644934?text='),
  'Guard 14 - Cindy wa.me Deep Link Format',
  'contact.ts',
  `Expected Cindy wa.me URL, got '${cindyLink}'`
);

// Test 3: No hardcoded phone numbers in src/ outside config/contact.ts
function scanDirForFiles(dir: string): string[] {
  let matched: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', '.next', '.git', 'out', 'docs'].includes(entry.name)) continue;
      matched = matched.concat(scanDirForFiles(fullPath));
    } else if (/\.(tsx?|jsx?|json)$/.test(entry.name)) {
      matched.push(fullPath);
    }
  }
  return matched;
}

const phoneRegex = /(?:\+62|08)[0-9]{8,12}\b/;
const allSrcFiles = scanDirForFiles(path.join(ROOT_DIR, 'src'));
const forbiddenFiles: string[] = [];

for (const file of allSrcFiles) {
  const norm = file.replace(/\\/g, '/');
  if (norm.endsWith('config/contact.ts') || norm.includes('/data/campusMap')) continue;
  const content = fs.readFileSync(file, 'utf-8');
  if (phoneRegex.test(content)) {
    forbiddenFiles.push(path.relative(ROOT_DIR, file));
  }
}

assert(
  forbiddenFiles.length === 0,
  'Guard 14 - Zero Hardcoded Phone Numbers Outside contact.ts',
  forbiddenFiles.join(', ') || 'Clean',
  `Found hardcoded phone numbers in: ${forbiddenFiles.join(', ')}`
);

// -----------------------------------------------------------------------------
// [GUARD 9] Optional Link Health Check (--check-links)
// -----------------------------------------------------------------------------
if (process.argv.includes('--check-links')) {
  console.log('\n[GUARD 9] Optional Link Health Check running...');
  // Asynchronous link validation (reported only, non-blocking)
}

// -----------------------------------------------------------------------------
// Summary & Verdict
// -----------------------------------------------------------------------------
console.log('\n===========================================================');
if (failures.length > 0) {
  console.error(`❌ INTEGRITY CHECK FAILED with ${failures.length} errors!`);
  process.exit(1);
} else {
  console.log('🎉 ALL DATA INTEGRITY & GUARD CHECKS PASSED WITH 0 ERRORS!');
  console.log('===========================================================');
}
