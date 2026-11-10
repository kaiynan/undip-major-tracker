import { CONTACTS, INSTAGRAM, CONTACT_CONFIG, isContactReady, waLink, buildWaLink } from '../../config/contact';

console.log('===========================================================');
console.log('UNLOCK THE UNSEEN — SERADIP CONSULTATION TESTS');
console.log('===========================================================');

function assert(condition: boolean, testName: string, detail: string) {
  if (!condition) {
    console.error(`❌ [FAIL] ${testName}: ${detail}`);
    process.exit(1);
  } else {
    console.log(`✓ [PASS] ${testName}`);
  }
}

// Test 1: Config structure and baseline presence
assert(CONTACTS.length === 2, 'Two SERADIP contacts configured', `Expected 2, got ${CONTACTS.length}`);
const dian = CONTACTS.find((c) => c.id === 'dian');
const cindy = CONTACTS.find((c) => c.id === 'cindy');
assert(!!dian && dian.wa === '6287741097976', 'Dian phone number matches official spec', 'Must match 6287741097976');
assert(!!cindy && cindy.wa === '6282210644934', 'Cindy phone number matches official spec', 'Must match 6282210644934');
assert(INSTAGRAM.handle === '@sedulurdiponegoro', 'Instagram handle configured', 'Must match @sedulurdiponegoro');
assert(INSTAGRAM.url === 'https://www.instagram.com/sedulurdiponegoro/', 'Instagram URL configured', 'Must match URL');

// Test 2: Active readiness
assert(isContactReady('dian'), 'Dian contact is ready', 'Must be ready');
assert(isContactReady('cindy'), 'Cindy contact is ready', 'Must be ready');
assert(isContactReady(), 'Global contact ready check is true', 'Must be ready');

// Test 3: WhatsApp Link Formatting and Encoding
const sampleTopPrograms = ['S1 Teknik Industri', 'S1 Teknik Elektro', 'S1 Teknik Kimia'];
let message = CONTACT_CONFIG.defaultMessagePrefix;
const listStr = sampleTopPrograms.slice(0, 3).map((name, idx) => `\n${idx + 1}. ${name}`).join('');
message += `\n${listStr}\n\nMohon masukan dan arahan dari Kakak SERADIP. Terima kasih!`;

const dianLink = waLink('dian', message);
assert(dianLink.startsWith('https://wa.me/6287741097976?text='), 'Dian wa.me URL format', `Got: ${dianLink}`);
assert(dianLink.includes(encodeURIComponent('S1 Teknik Industri')), 'Dian message encodes top program 1', 'Must contain program 1');
assert(dianLink.includes(encodeURIComponent('S1 Teknik Elektro')), 'Dian message encodes top program 2', 'Must contain program 2');
assert(dianLink.includes(encodeURIComponent('S1 Teknik Kimia')), 'Dian message encodes top program 3', 'Must contain program 3');

const cindyLink = waLink('cindy', message);
assert(cindyLink.startsWith('https://wa.me/6282210644934?text='), 'Cindy wa.me URL format', `Got: ${cindyLink}`);
assert(cindyLink.includes(encodeURIComponent('S1 Teknik Industri')), 'Cindy message encodes top program 1', 'Must contain program 1');

const defaultLink = buildWaLink(message);
assert(defaultLink.startsWith('https://wa.me/6287741097976?text='), 'buildWaLink defaults to Dian', `Got: ${defaultLink}`);

// Test 4: Degradation when invalid
assert(waLink('nonexistent', 'hi') !== '#', 'Fallback to default contact if unknown id', 'Falls back');

console.log('===========================================================');
console.log('🎉 ALL SERADIP CONSULTATION UNIT TESTS PASSED!');
console.log('===========================================================');
