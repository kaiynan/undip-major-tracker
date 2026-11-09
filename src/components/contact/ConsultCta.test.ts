import { CONTACT_CONFIG, isContactReady, buildWaLink } from '../../config/contact';

console.log('===========================================================');
console.log('UNDIP MAJOR MATCHER — SERADIP CONSULTATION TESTS');
console.log('===========================================================');

function assert(condition: boolean, testName: string, detail: string) {
  if (!condition) {
    console.error(`❌ [FAIL] ${testName}: ${detail}`);
    process.exit(1);
  } else {
    console.log(`✓ [PASS] ${testName}`);
  }
}

// Save initial config
const initialPhone = CONTACT_CONFIG.phone;

// Test 1: Degradation when phone empty
CONTACT_CONFIG.phone = '';
assert(!isContactReady(), 'Ready is false when phone empty', 'Must not be ready');
assert(buildWaLink('Hello') === '#', 'Safe hash fallback when not ready', 'Must return #');

// Test 2: Active link when phone configured
CONTACT_CONFIG.phone = '+62 812 3456 7890';
assert(isContactReady(), 'Ready is true when phone configured', 'Must be ready');

const sampleTopPrograms = ['S1 Teknik Informatika', 'S1 Kedokteran', 'S1 Hukum'];
let message = CONTACT_CONFIG.defaultMessagePrefix;
const listStr = sampleTopPrograms.slice(0, 3).map((name, idx) => `\n${idx + 1}. ${name}`).join('');
message += `\n${listStr}\n\nMohon masukan dan arahan dari Kakak SERADIP. Terima kasih!`;

const link = buildWaLink(message);
assert(link.startsWith('https://wa.me/6281234567890?text='), 'WhatsApp link formatting', 'Must match wa.me clean phone');
assert(link.includes(encodeURIComponent('S1 Teknik Informatika')), 'Encoded program 1', 'Must contain program 1');
assert(link.includes(encodeURIComponent('S1 Kedokteran')), 'Encoded program 2', 'Must contain program 2');
assert(link.includes(encodeURIComponent('S1 Hukum')), 'Encoded program 3', 'Must contain program 3');

// Restore config
CONTACT_CONFIG.phone = initialPhone;

console.log('===========================================================');
console.log('🎉 ALL SERADIP CONSULTATION UNIT TESTS PASSED!');
console.log('===========================================================');
