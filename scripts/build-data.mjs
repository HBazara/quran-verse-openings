#!/usr/bin/env node
// Build data/quran.json from the verified sources (PROJECT.md Rule 1).
//
// Usage: node scripts/build-data.mjs [--qul <folder>] [--tanzil <folder>]
//   --qul     folder with the 3 QUL databases (default tmp/downloads/qul/x, searched one level deep)
//   --tanzil  folder with the Tanzil files (default data/sources, then tmp/downloads/tanzil)
//
// Every source is checked against data/sources/SHA256SUMS first. Word text comes verbatim from
// QUL 312 (Unicode), word drawing from QUL 61 (V2 glyph codes), lines from QUL layout 10.
// The output has no timestamps, so the same sources always give the same bytes.

import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ROOT,
  cp,
  QUL,
  TANZIL,
  BANNER,
  BANNER_FONT_DIR,
  checkSums,
  findFile,
  findQul,
  findTanzil,
  readBannerMap,
  readQul,
  readTanzilMeta,
  sha256,
  DEFAULT_QUL_DIR,
} from './lib/sources.mjs';
import { SURAH_NAMES_EN } from './lib/surah-names.mjs';

const OUT = join(ROOT, 'data', 'quran.json');
const OUT_SUM = join(ROOT, 'data', 'quran.json.sha256');
const ARABIC_DIGITS = Array.from({ length: 10 }, (_, i) => cp(0x0660 + i)).join('');
const arabicNumber = (n) => [...String(n)].map((d) => ARABIC_DIGITS[Number(d)]).join('');

function arg(name) {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : null;
}
function fail(msg) {
  console.error(`build-data: ${msg}`);
  process.exit(1);
}

const qulPaths = findQul(arg('--qul') || DEFAULT_QUL_DIR);
if (!qulPaths)
  fail(`QUL databases not found (${Object.values(QUL).join(', ')}). Use --qul <folder>.`);
const tz = findTanzil(arg('--tanzil') ? [arg('--tanzil')] : undefined);
if (!tz)
  fail(`Tanzil files not found (${Object.values(TANZIL).join(', ')}). Use --tanzil <folder>.`);
// Surah banner (QUL 458): the font is committed in assets/fonts/surah-header/, its ligature map stays
// local next to the QUL databases; build-data copies each surah's banner character into quran.json.
const bannerMapPath = findFile(arg('--qul') || DEFAULT_QUL_DIR, BANNER.ligatures);
const bannerFontPath = findFile(BANNER_FONT_DIR, BANNER.font);
if (!bannerMapPath)
  fail(`${BANNER.ligatures} (surah banner map, QUL 458) not found. Use --qul <folder>.`);
if (!bannerFontPath) fail(`${BANNER.font} not found in assets/fonts/surah-header/`);
const sumProblems = checkSums([
  ...Object.values(qulPaths),
  tz.text,
  tz.meta,
  bannerMapPath,
  bannerFontPath,
]);
if (sumProblems.length) fail(`source check failed:\n  ${sumProblems.join('\n  ')}`);

const q = await readQul(qulPaths);
const meta = readTanzilMeta(tz.meta);
const bannerChars = readBannerMap(bannerMapPath);

// The glyph table (QUL 61) and the text table (QUL 312) must describe the same words.
if (q.glyphs.length !== q.text.length) fail('glyph and text tables have different lengths');
const words = new Map();
q.text.forEach((t, i) => {
  const g = q.glyphs[i];
  if (
    t.id !== i + 1 ||
    g.id !== t.id ||
    g.loc !== t.loc ||
    g.surah !== t.surah ||
    g.ayah !== t.ayah ||
    g.pos !== t.pos
  )
    fail(`glyph and text tables disagree at word ${i + 1}`);
  if (t.loc !== `${t.surah}:${t.ayah}:${t.pos}`) fail(`bad location ${t.loc}`);
  words.set(t.id, {
    id: t.id,
    verse: `${t.surah}:${t.ayah}`,
    pos: t.pos,
    glyph: g.text,
    text: t.text,
    end: false,
  });
});
// The last word of each verse is the verse-end marker and must equal the verse number.
const lastOfVerse = new Map();
for (const w of words.values()) lastOfVerse.set(w.verse, w);
for (const [verse, w] of lastOfVerse) {
  if (w.text !== arabicNumber(Number(verse.split(':')[1])))
    fail(`verse ${verse}: last word is not its verse number`);
  w.end = true;
}

// Pages and lines.
const pages = [];
const where = new Map(); // word id -> [page, line]
for (const l of q.lines) {
  if (!pages[l.page - 1]) pages[l.page - 1] = { page: l.page, lines: [] };
  const line = {
    type: { ayah: 'ayah', surah_name: 'surah', basmallah: 'basmala' }[l.type],
    centered: l.centered,
  };
  if (!line.type) fail(`page ${l.page} line ${l.line}: unknown line type ${l.type}`);
  if (line.type === 'surah') line.surah = l.surah;
  if (line.type === 'ayah') {
    line.words = [];
    for (let id = l.first; id <= l.last; id++) {
      const w = words.get(id);
      if (!w) fail(`page ${l.page} line ${l.line}: no word ${id}`);
      line.words.push([w.id, w.glyph, w.text, w.verse, w.pos, w.end ? 1 : 0]);
      where.set(id, [l.page, pages[l.page - 1].lines.length + 1]);
    }
  }
  pages[l.page - 1].lines.push(line);
}

// Surahs, juz, hizb and hizb quarters. Pages and lines always come from the V2 layout (never from
// Tanzil's own page list, which follows an older print). Quarter starts come from the print itself:
// the verses whose first word carries the hizb sign (in QUL 312 and in the V2 glyphs), plus the
// quarters that begin a surah (no sign there, the banner marks it). Tanzil metadata (CC BY 3.0) is
// only a cross-check, with one reviewed difference: the print puts the sign at 15:49, Tanzil lists 15:50.
const HIZB_SIGN = cp(0x06de);
const REVIEWED_QUARTER_DIFFS = { print: ['15:49'], tanzil: ['15:50'] };
const firstWordOf = new Map();
for (const w of words.values()) if (w.pos === 1) firstWordOf.set(w.verse, w.id);
const locate = (verse) => {
  const id = firstWordOf.get(verse);
  if (!id) fail(`verse ${verse} not found`);
  return where.get(id);
};
const headerPage = new Map();
pages.forEach((p) => p.lines.forEach((l) => l.type === 'surah' && headerPage.set(l.surah, p.page)));
if (meta.surahs.length !== 114) fail('Tanzil metadata does not list 114 surahs');
if (SURAH_NAMES_EN.length !== 114) fail('scripts/lib/surah-names.mjs does not list 114 names');
const surahs = meta.surahs.map((s, i) => {
  const [page, line] = locate(`${i + 1}:1`);
  return {
    surah: i + 1,
    name: s.name,
    transliteration: SURAH_NAMES_EN[i], // English spelling for the interface (Quran.com style)
    verses: s.verses,
    page,
    line,
    headerPage: headerPage.get(i + 1),
    banner: bannerChars[i],
  };
});
const starts = (keys, field) =>
  keys.map((verse, i) => {
    const [page, line] = locate(verse);
    return { [field]: i + 1, verse, page, line };
  });
const signVerses = [...firstWordOf]
  .filter(([, id]) => words.get(id).text.includes(HIZB_SIGN))
  .map(([verse]) => verse);
for (const w of words.values())
  if (w.text.includes(HIZB_SIGN) && w.pos !== 1) fail(`hizb sign inside verse ${w.verse}`);
const quarterVerses = [
  ...new Set([...signVerses, ...meta.quarters.filter((v) => v.endsWith(':1'))]),
].sort((a, b) => firstWordOf.get(a) - firstWordOf.get(b));
if (quarterVerses.length !== 240) fail(`${quarterVerses.length} quarter starts, expected 240`);
const onlyPrint = quarterVerses.filter((v) => !meta.quarters.includes(v));
const onlyTanzil = meta.quarters.filter((v) => !quarterVerses.includes(v));
if (
  onlyPrint.join() !== REVIEWED_QUARTER_DIFFS.print.join() ||
  onlyTanzil.join() !== REVIEWED_QUARTER_DIFFS.tanzil.join()
)
  fail(`quarter starts differ from Tanzil beyond the reviewed case: ${onlyPrint} / ${onlyTanzil}`);
const juzVerses = quarterVerses.filter((_, i) => i % 8 === 0);
if (juzVerses.join() !== meta.juz.join()) fail('juz starts are not every 8th quarter');
const quarters = starts(quarterVerses, 'quarter');
const data = {
  format: 1,
  edition: 'KFGQPC Madinah mushaf, Hafs from Asim, 1421H print, 604 pages, 15 lines',
  layout: q.info.map((r) => r.name).join(', '),
  sources: [...Object.entries(qulPaths), ['tanzilText', tz.text], ['tanzilMeta', tz.meta]].map(
    ([role, p]) => ({
      role,
      file: p.split(/[\\/]/).pop(),
      sha256: sha256(p),
    }),
  ),
  wordFields: ['id', 'glyph', 'text', 'verse', 'position', 'end'],
  counts: {
    pages: pages.length,
    lines: q.lines.length,
    surahs: surahs.length,
    verses: lastOfVerse.size,
    words: words.size,
  },
  surahs,
  juz: starts(juzVerses, 'juz'),
  hizb: quarters
    .filter((_, i) => i % 4 === 0)
    .map((x, i) => ({ hizb: i + 1, verse: x.verse, page: x.page, line: x.line })),
  quarters,
  pages,
};

const json = JSON.stringify(data);
writeFileSync(OUT, json, 'utf8');
const hash = createHash('sha256').update(json, 'utf8').digest('hex');
writeFileSync(OUT_SUM, `${hash}  quran.json\n`, 'utf8');
console.log(
  `build-data: wrote data/quran.json (${(Buffer.byteLength(json) / 1e6).toFixed(2)} MB): ` +
    `${data.counts.pages} pages, ${data.counts.lines} lines, ${data.counts.surahs} surahs, ` +
    `${data.counts.verses} verses, ${data.counts.words} words`,
);
