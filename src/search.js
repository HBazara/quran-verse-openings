// Surah search by English or Arabic name, or by number. Names are compared in a forgiving form:
// English ignores case, the article, apostrophes, hyphens and double letters ("baqara" finds
// "Al-Baqarah"); Arabic ignores vowel marks, tatweel and the spelling of alef, taa marbuta and alef
// maqsura (a name typed with haa instead of taa marbuta still matches). Arabic letters are built from code points.

import { toWesternDigits } from './i18n.js';

const cp = (...c) => String.fromCodePoint(...c);
const range = (a, b) => `${cp(a)}-${cp(b)}`;
const MARKS = new RegExp(
  `[${range(0x64b, 0x65f)}${cp(0x670)}${range(0x6d6, 0x6ed)}${cp(0x640)}]`,
  'gu',
);
const ALEF = new RegExp(`[${cp(0x622, 0x623, 0x625, 0x671)}]`, 'gu');
const SAME = [
  [cp(0x629), cp(0x647)], // taa marbuta -> haa
  [cp(0x649), cp(0x64a)], // alef maqsura -> yaa
  [cp(0x624), cp(0x648)], // waw with hamza -> waw
  [cp(0x626), cp(0x64a)], // yaa with hamza -> yaa
];
const ARABIC_LETTER = new RegExp(`[${range(0x621, 0x64a)}${cp(0x671)}]`, 'u');
const SURAH_WORD = cp(0x633, 0x648, 0x631, 0x647); // the word "surah", after normalising

function arabicKey(text) {
  let s = text.replace(MARKS, '').replace(ALEF, cp(0x627));
  for (const [from, to] of SAME) s = s.split(from).join(to);
  s = s.replace(/\s+/gu, '');
  return s.startsWith(SURAH_WORD) ? s.slice(SURAH_WORD.length) : s;
}

function latinKey(text) {
  return text
    .toLowerCase()
    .replace(/^surah?\s+/, '')
    .replace(/[^a-z]/g, '')
    .replace(/^(adh|ash|al|an|ar|as|at|ad|az)(?=[a-z]{3})/, '')
    .replace(/e/g, 'i')
    .replace(/o/g, 'u')
    .replace(/(.)\1+/g, '$1')
    .replace(/h$/, '');
}

// Surahs matching the query, best first: the number or the exact name, then names that start
// with it, then the rest.
export function findSurahs(surahs, query) {
  const q = query.trim();
  if (!q) return [];
  const digits = toWesternDigits(q);
  if (/^\d{1,3}$/.test(digits)) {
    const s = surahs[Number(digits) - 1];
    return s ? [s] : [];
  }
  const arabic = ARABIC_LETTER.test(q);
  const key = arabic ? arabicKey(q) : latinKey(q);
  if (!key) return [];
  const scored = [];
  for (const s of surahs) {
    const name = arabic ? arabicKey(s.name) : latinKey(s.transliteration);
    const at = name.indexOf(key);
    if (at >= 0) scored.push([name === key ? 0 : at === 0 ? 1 : 2, s.surah, s]);
  }
  return scored.sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((x) => x[2]);
}
