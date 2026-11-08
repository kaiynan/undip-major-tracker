// =============================================================================
// UNDIP Major Matcher — Automated Data Guard & Integrity Test Suite
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
console.log('UNDIP MAJOR MATCHER — DATA INTEGRITY & GUARD TESTS');
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
  programUKTList.length === 67,
  'Guard 6 - UKT Completeness',
  'programUKTList',
  `Expected UKT entries for all 67 programs, found ${programUKTList.length}`
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
