#!/usr/bin/env node
// Check data/quran.json (PROJECT.md Rule 1 and AUD's text integrity and layout checks).
//
// Usage:
//   node scripts/validate.mjs            all checks that need only committed files (runs in CI)
//   node scripts/validate.mjs --full     also compare every line and word with the QUL databases
//                                        (local only; databases in tmp/downloads/qul/x or --qul <folder>)
//   node scripts/validate.mjs --write-tanzil-differences
//                                        write data/tanzil-differences.json from the current data
//                                        (only after a reviewed source change; see docs/TEXT-CROSSCHECK.md)
//   node scripts/validate.mjs --write-font-sums
//                                        write data/sources/qcf2.sha256 from the 604 page fonts
//                                        (only after a reviewed font change)
//
// Every check prints PASS, FAIL or SKIP (with the reason). Exit code 1 if any check fails.

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ROOT,
  cp,
  BANNER,
  BANNER_FONT_DIR,
  BISMILLAH,
  BISMILLAH_FONT_DIR,
  checkSums,
  compareWithTanzil,
  findFile,
  findQul,
  findTanzil,
  readBannerMap,
  readQul,
  readTanzilMeta,
  readTanzilWords,
  sha256,
  DEFAULT_QUL_DIR,
} from './lib/sources.mjs';
import { SURAH_NAMES_EN } from './lib/surah-names.mjs';
import { readCmap } from './lib/fontcheck.mjs';

const DATA = join(ROOT, 'data', 'quran.json');
const DATA_SUM = join(ROOT, 'data', 'quran.json.sha256');
const DIFFS = join(ROOT, 'data', 'tanzil-differences.json');
const FULL = process.argv.includes('--full');
const WRITE_DIFFS = process.argv.includes('--write-tanzil-differences');
const WRITE_FONT_SUMS = process.argv.includes('--write-font-sums');
const PAGE_FONTS = join(ROOT, 'assets', 'fonts', 'qcf2');
const FONT_SUMS = join(ROOT, 'data', 'sources', 'qcf2.sha256'); // "hash  pN.woff2", sha256sum format
if (WRITE_FONT_SUMS) {
  const lines = [];
  for (let p = 1; p <= 604; p++)
    lines.push(`${sha256(join(PAGE_FONTS, `p${p}.woff2`))}  p${p}.woff2`);
  writeFileSync(FONT_SUMS, `${lines.join('\n')}\n`);
  console.log(`wrote ${FONT_SUMS} (604 page fonts)`);
}
const qulArg = process.argv.includes('--qul')
  ? process.argv[process.argv.indexOf('--qul') + 1]
  : null;

const results = [];
function report(status, name, detail) {
  results.push(status);
  console.log(`${status.padEnd(4)}  ${name}${detail ? `: ${detail}` : ''}`);
}
// Run one check: fn returns a detail string on success, or throws / returns {fail} with problems.
function check(name, fn) {
  try {
    const problems = [];
    const detail = fn(problems);
    if (problems.length)
      report('FAIL', name, `${problems.length} problem(s): ${problems.slice(0, 5).join('; ')}`);
    else report('PASS', name, detail);
  } catch (e) {
    report('FAIL', name, e.message);
  }
}

// ---------- load ----------
if (!existsSync(DATA)) {
  console.log('FAIL  data/quran.json is missing. Run: node scripts/build-data.mjs');
  process.exit(1);
}
const raw = readFileSync(DATA, 'utf8');
const d = JSON.parse(raw);
const ARABIC_DIGITS = Array.from({ length: 10 }, (_, i) => cp(0x0660 + i)).join('');
const arabicNumber = (n) => [...String(n)].map((c) => ARABIC_DIGITS[Number(c)]).join('');

// Reading order: every word with its page and line.
const all = [];
for (const p of d.pages || [])
  p.lines.forEach((l, i) => {
    if (l.type === 'ayah')
      for (const w of l.words)
        all.push({
          id: w[0],
          glyph: w[1],
          text: w[2],
          verse: w[3],
          pos: w[4],
          end: w[5] === 1,
          page: p.page,
          line: i + 1,
        });
  });
const verses = new Map(); // "s:a" -> words in reading order
for (const w of all) {
  if (!verses.has(w.verse)) verses.set(w.verse, []);
  verses.get(w.verse).push(w);
}

// ---------- 1. file integrity ----------
check('quran.json matches quran.json.sha256 (not edited by hand)', (P) => {
  if (!existsSync(DATA_SUM)) P.push('data/quran.json.sha256 is missing');
  else {
    const want = readFileSync(DATA_SUM, 'utf8').split(/\s+/)[0];
    const got = createHash('sha256').update(raw, 'utf8').digest('hex');
    if (want !== got) P.push('hash differs: rebuild with node scripts/build-data.mjs');
  }
  return 'hash matches';
});

// ---------- 2. pages and lines ----------
check('pages 1 to 604, each with its printed number of lines', (P) => {
  if (d.pages.length !== 604) P.push(`${d.pages.length} pages`);
  d.pages.forEach((p, i) => {
    if (p.page !== i + 1) P.push(`page ${i + 1} is numbered ${p.page}`);
    const want = p.page <= 2 ? 8 : 15;
    if (p.lines.length !== want)
      P.push(`page ${p.page} has ${p.lines.length} lines, expected ${want}`);
    p.lines.forEach((l, j) => {
      if (!['ayah', 'surah', 'basmala'].includes(l.type))
        P.push(`page ${p.page} line ${j + 1}: type ${l.type}`);
      if (typeof l.centered !== 'boolean')
        P.push(`page ${p.page} line ${j + 1}: centered is not true/false`);
      if (l.type === 'ayah' && !(Array.isArray(l.words) && l.words.length))
        P.push(`page ${p.page} line ${j + 1}: no words`);
    });
  });
  return `604 pages, ${d.pages.reduce((n, p) => n + p.lines.length, 0)} lines (8 on pages 1 and 2, 15 on the others)`;
});

check('surah banners and Bismillah lines', (P) => {
  const flat = d.pages.flatMap((p) => p.lines.map((l, i) => ({ ...l, page: p.page, line: i + 1 })));
  const banners = flat.filter((l) => l.type === 'surah');
  const nums = banners.map((l) => l.surah);
  if (nums.join(',') !== Array.from({ length: 114 }, (_, i) => i + 1).join(','))
    P.push('banners are not exactly surahs 1 to 114 in order');
  flat.forEach((l, i) => {
    if (l.type === 'basmala' && !l.centered) P.push(`Bismillah not centred on page ${l.page}`);
    if (l.type !== 'surah') return;
    if (!l.centered) P.push(`banner of surah ${l.surah} not centred`);
    let j = i + 1;
    if (l.surah !== 1 && l.surah !== 9) {
      if (flat[j]?.type !== 'basmala')
        P.push(`surah ${l.surah}: no Bismillah line after the banner`);
      j++;
    } else if (flat[j]?.type === 'basmala') P.push(`surah ${l.surah}: unexpected Bismillah line`);
    const first = flat[j]?.words?.[0];
    if (!first || first[3] !== `${l.surah}:1` || first[4] !== 1)
      P.push(`surah ${l.surah} does not start right after its banner`);
  });
  const basmala = flat.filter((l) => l.type === 'basmala').length;
  if (basmala !== 112) P.push(`${basmala} Bismillah lines, expected 112`);
  return '114 banners in order, 112 Bismillah lines (none for Al-Fatiha and At-Tawbah), each surah starts right after';
});

// ---------- 3. words ----------
check('every word id appears exactly once, in order, with no gaps', (P) => {
  all.forEach((w, i) => {
    if (w.id !== i + 1 && P.length < 20)
      P.push(`word ${i + 1} has id ${w.id} (page ${w.page} line ${w.line})`);
  });
  if (all.length !== d.counts.words) P.push(`${all.length} words, counts say ${d.counts.words}`);
  return `${all.length} words, ids 1 to ${all.length}`;
});

check('word fields and characters (no Latin, nothing empty, only Arabic)', (P) => {
  const TEXT_OK = new RegExp(
    `^[${cp(0x0600)}-${cp(0x06ff)}]+( [${cp(0x0600)}-${cp(0x06ff)}]+)*$`,
    'u',
  ); // Arabic block, single inner spaces only
  const GLYPH_OK = new RegExp(`^[${cp(0xfb50)}-${cp(0xfdff)}]+$`, 'u'); // V2 glyph codes
  for (const w of all) {
    if (typeof w.text !== 'string' || !TEXT_OK.test(w.text))
      P.push(`${w.verse}:${w.pos} text has a character outside Arabic`);
    if (/[A-Za-z0-9]/.test(w.text)) P.push(`${w.verse}:${w.pos} text has Latin letters or digits`);
    if (typeof w.glyph !== 'string' || !GLYPH_OK.test(w.glyph))
      P.push(`${w.verse}:${w.pos} glyph code out of range`);
    if (!/^\d+:\d+$/.test(w.verse) || !Number.isInteger(w.pos) || w.pos < 1)
      P.push(`word ${w.id}: bad verse key or position`);
  }
  return 'all texts are Arabic (U+0600 to U+06FF, single inner spaces only), all glyph codes in U+FB50 to U+FDFF';
});

// ---------- 4. verses ----------
check('114 surahs and 6,236 verses, each once and in order', (P) => {
  const keys = [...verses.keys()];
  if (keys.length !== 6236) P.push(`${keys.length} verses`);
  let prev = [0, 0];
  for (const k of keys) {
    const [s, a] = k.split(':').map(Number);
    if (!((s === prev[0] && a === prev[1] + 1) || (s === prev[0] + 1 && a === 1)))
      P.push(`verse ${k} comes after ${prev.join(':')}`);
    prev = [s, a];
  }
  // a verse must not reappear later (its words must be contiguous in reading order)
  let last = null;
  const seen = new Set();
  for (const w of all) {
    if (w.verse !== last) {
      if (seen.has(w.verse)) P.push(`verse ${w.verse} appears in two places`);
      seen.add(w.verse);
      last = w.verse;
    }
  }
  const surahs = new Set(keys.map((k) => k.split(':')[0]));
  if (surahs.size !== 114) P.push(`${surahs.size} surahs`);
  d.surahs.forEach((s) => {
    const n = keys.filter((k) => k.startsWith(`${s.surah}:`)).length;
    if (n !== s.verses) P.push(`surah ${s.surah}: ${n} verses, metadata says ${s.verses}`);
  });
  return '114 surahs, 6,236 verses, verse counts match the surah list';
});

check('word positions and verse-end markers', (P) => {
  for (const [k, ws] of verses) {
    ws.forEach((w, i) => {
      if (w.pos !== i + 1) P.push(`${k}: word ${i + 1} has position ${w.pos}`);
    });
    const ends = ws.filter((w) => w.end);
    if (ends.length !== 1 || !ws[ws.length - 1].end)
      P.push(`${k}: the verse-end marker is not the last word`);
    else if (ws[ws.length - 1].text !== arabicNumber(Number(k.split(':')[1])))
      P.push(`${k}: marker is not the verse number`);
  }
  return 'positions run 1, 2, 3 ... in every verse; each verse ends with one marker showing its number';
});

check('openings for N = 1 to 5 equal the first N words of each verse', (P) => {
  let shown = 0;
  for (let n = 1; n <= 5; n++) {
    for (const [k, ws] of verses) {
      const words = ws.filter((w) => !w.end); // the source verse's word tokens, in order
      // the stored opening: the words the renderer shows, i.e. position <= N, in reading order
      const opening = ws.filter((w) => !w.end && w.pos <= n);
      const expected = words.slice(0, Math.min(n, words.length));
      if (opening.length !== expected.length || opening.some((w, i) => w !== expected[i]))
        P.push(`${k}: opening for N=${n} differs`);
      if (words.length < n && opening.length !== words.length)
        P.push(`${k}: short verse not shown whole for N=${n}`);
      if (opening.some((w) => !w.text.trim())) P.push(`${k}: empty word in the opening`);
      shown += opening.length;
    }
  }
  return `checked 5 x 6,236 openings (${shown} words in total)`;
});

check('no Bismillah inside verse 1 (except Al-Fatiha)', (P) => {
  const noShadda = (t) => t.replaceAll(cp(0x0651), '');
  const bism = verses
    .get('1:1')
    .filter((w) => !w.end)
    .map((w) => noShadda(w.text))
    .join(' ');
  if (verses.get('1:1').filter((w) => !w.end).length !== 4)
    P.push('1:1 is not the 4-word Bismillah');
  for (let s = 2; s <= 114; s++) {
    const head = verses
      .get(`${s}:1`)
      .filter((w) => !w.end)
      .slice(0, 4)
      .map((w) => noShadda(w.text))
      .join(' ');
    if (head === bism) P.push(`${s}:1 starts with the Bismillah`);
    if (noShadda(verses.get(`${s}:1`)[0].text) === noShadda(verses.get('1:1')[0].text))
      P.push(`${s}:1 starts with the Bismillah's first word`);
  }
  return 'verse 1 of surahs 2 to 114 does not contain the Bismillah';
});

// ---------- 5. start pages ----------
check('surah, juz, hizb and quarter start pages point at the right words', (P) => {
  const at = new Map();
  for (const w of all) if (w.pos === 1) at.set(w.verse, [w.page, w.line]);
  const headerPage = new Map();
  d.pages.forEach((p) =>
    p.lines.forEach((l) => l.type === 'surah' && headerPage.set(l.surah, p.page)),
  );
  const same = (x, label) => {
    const loc = at.get(x.verse || `${x.surah}:1`);
    if (!loc || loc[0] !== x.page || loc[1] !== x.line)
      P.push(`${label}: page/line do not match the data`);
  };
  d.surahs.forEach((s) => {
    same(s, `surah ${s.surah}`);
    if (headerPage.get(s.surah) !== s.headerPage) P.push(`surah ${s.surah}: banner page`);
  });
  const ordered = (list, n, label) => {
    if (list.length !== n) P.push(`${list.length} ${label} entries, expected ${n}`);
    list.forEach((x, i) => {
      same(x, `${label} ${i + 1}`);
      if (
        i &&
        !(x.page > list[i - 1].page || (x.page === list[i - 1].page && x.line > list[i - 1].line))
      )
        P.push(`${label} ${i + 1} out of order`);
    });
  };
  ordered(d.juz, 30, 'juz');
  ordered(d.hizb, 60, 'hizb');
  ordered(d.quarters, 240, 'quarter');
  d.hizb.forEach((h, i) => {
    if (h.verse !== d.quarters[i * 4].verse) P.push(`hizb ${i + 1} is not quarter ${i * 4 + 1}`);
  });
  if (d.juz[0].page !== 1) P.push('juz 1 does not start on page 1');
  return '114 surahs, 30 juz, 60 hizb, 240 quarters, in order, each at its verse';
});

check('quarter starts follow the hizb signs of the print', (P) => {
  const HIZB_SIGN = cp(0x06de);
  const starts = new Set(d.quarters.map((x) => x.verse));
  for (const w of all) {
    if (!w.text.includes(HIZB_SIGN)) continue;
    if (w.pos !== 1) P.push(`${w.verse}:${w.pos}: hizb sign not on the first word`);
    else if (!starts.has(w.verse)) P.push(`${w.verse}: hizb sign but no quarter starts here`);
  }
  for (const v of starts) {
    const first = verses.get(v)[0];
    if (!first.text.includes(HIZB_SIGN) && !v.endsWith(':1'))
      P.push(`${v}: quarter start without the hizb sign`);
  }
  d.juz.forEach((j, i) => {
    if (j.verse !== d.quarters[i * 8].verse) P.push(`juz ${i + 1} is not quarter ${i * 8 + 1}`);
  });
  return 'every hizb sign starts a quarter; every quarter starts with the sign or a new surah; juz and hizb are every 8th and 4th quarter';
});

// ---------- 5b. fonts and surah banners ----------
check('committed banner and Bismillah fonts match data/sources/SHA256SUMS', (P) => {
  const banner = findFile(BANNER_FONT_DIR, BANNER.font);
  const bism = findFile(BISMILLAH_FONT_DIR, BISMILLAH.font);
  if (!banner) P.push(`assets/fonts/surah-header/${BANNER.font} is missing`);
  if (!bism) P.push(`assets/fonts/bismillah/${BISMILLAH.font} is missing`);
  if (banner && bism) P.push(...checkSums([banner, bism]));
  return 'both match';
});

check('every glyph the site draws exists in its font (nothing shows as a box)', (P) => {
  let glyphs = 0;
  d.pages.forEach((page, i) => {
    const font = join(ROOT, 'assets', 'fonts', 'qcf2', `p${i + 1}.woff2`);
    if (!existsSync(font)) return P.push(`assets/fonts/qcf2/p${i + 1}.woff2 is missing`);
    const has = readCmap(font);
    for (const line of page.lines)
      for (const w of line.words || [])
        for (const ch of w[1]) {
          glyphs++;
          if (!has.has(ch.codePointAt(0)))
            P.push(
              `page ${i + 1}, word ${w[0]}: U+${ch.codePointAt(0).toString(16)} not in its font`,
            );
        }
  });
  const banner = findFile(BANNER_FONT_DIR, BANNER.font);
  const bism = findFile(BISMILLAH_FONT_DIR, BISMILLAH.font);
  if (banner) {
    const has = readCmap(banner);
    for (const s of d.surahs)
      if (!has.has(s.banner.codePointAt(0))) P.push(`surah ${s.surah}: banner not in its font`);
  }
  if (bism && !readCmap(bism).has(BISMILLAH.glyph))
    P.push('the Bismillah glyph is not in its font');
  return `${glyphs} word glyphs in 604 page fonts, 114 banners and the Bismillah`;
});

check('the 604 page fonts match data/sources/qcf2.sha256 (none changed or replaced)', (P) => {
  if (!existsSync(FONT_SUMS)) throw new Error('data/sources/qcf2.sha256 is missing');
  const listed = readFileSync(FONT_SUMS, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => l.split(/\s+/));
  if (listed.length !== 604) P.push(`${listed.length} fonts listed, expected 604`);
  for (const [hash, name] of listed) {
    const path = join(PAGE_FONTS, name);
    if (!existsSync(path)) P.push(`${name} is missing`);
    else if (sha256(path) !== hash) P.push(`${name}: SHA-256 differs`);
  }
  const extra = readdirSync(PAGE_FONTS).filter((f) => !listed.some(([, name]) => name === f));
  if (extra.length) P.push(`not listed: ${extra.join(', ')}`);
  return '604 of 604 match';
});

check('every surah has its own banner character', (P) => {
  const GLYPH_RANGE = new RegExp(`^[${cp(0xfb50)}-${cp(0xfdff)}]$`, 'u');
  const seen = new Set();
  d.surahs.forEach((s) => {
    if (typeof s.banner !== 'string' || !GLYPH_RANGE.test(s.banner))
      P.push(`surah ${s.surah}: banner is not one character in U+FB50 to U+FDFF`);
    else if (seen.has(s.banner)) P.push(`surah ${s.surah}: banner character used twice`);
    seen.add(s.banner);
  });
  return '114 different banner characters';
});

check('every surah has an Arabic name and an English name, all different', (P) => {
  const ARABIC_NAME = new RegExp(`^[${cp(0x0621)}-${cp(0x064a)}${cp(0x0671)} ]+$`, 'u');
  d.surahs.forEach((s, i) => {
    if (typeof s.name !== 'string' || !ARABIC_NAME.test(s.name))
      P.push(`surah ${s.surah}: Arabic name missing or has other characters`);
    if (typeof s.transliteration !== 'string' || !/^[A-Za-z' -]+$/.test(s.transliteration))
      P.push(`surah ${s.surah}: English name missing or has other characters`);
    else if (s.transliteration !== SURAH_NAMES_EN[i])
      P.push(`surah ${s.surah}: English name differs from scripts/lib/surah-names.mjs`);
  });
  for (const key of ['name', 'transliteration']) {
    const seen = new Set(d.surahs.map((s) => s[key]));
    if (seen.size !== d.surahs.length) P.push(`${key}: some surahs share the same name`);
  }
  return '114 Arabic names and 114 English names, none empty, none repeated';
});

// ---------- 6. Tanzil cross-check ----------
const tz = findTanzil();
if (!tz)
  report(
    'SKIP',
    'Tanzil cross-check',
    'Tanzil files not found in data/sources or tmp/downloads/tanzil',
  );
else {
  const qpc = new Map(
    [...verses].map(([k, ws]) => [k, ws.filter((w) => !w.end).map((w) => w.text)]),
  );
  let res;
  check('Tanzil files match data/sources/SHA256SUMS', (P) => {
    P.push(...checkSums([tz.text, tz.meta]));
    return 'both files match';
  });
  check('surah names agree with the Tanzil metadata (Arabic equal, English in place)', (P) => {
    const meta = readTanzilMeta(tz.meta).surahs;
    // The English names are our own spelling. Each one must be closer to Tanzil's spelling of its own
    // surah than to Tanzil's spelling of any other surah, so a name in the wrong place is caught.
    const norm = (s) =>
      s
        .toLowerCase()
        .replace(/^a[a-z]{0,2}-/, '')
        .replace(/[^a-z]/g, '')
        .replace(/e/g, 'i')
        .replace(/o/g, 'u')
        .replace(/(.)\1+/g, '$1')
        .replace(/h$/, '');
    const agree = (a, b) => {
      const t = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
      for (let i = 1; i <= a.length; i++)
        for (let j = 1; j <= b.length; j++)
          t[i][j] =
            a[i - 1] === b[j - 1] ? t[i - 1][j - 1] + 1 : Math.max(t[i - 1][j], t[i][j - 1]);
      return (2 * t[a.length][b.length]) / (a.length + b.length || 1);
    };
    const theirs = meta.map((m) => norm(m.transliteration || ''));
    d.surahs.forEach((s, i) => {
      if (s.name !== meta[i]?.name) P.push(`surah ${s.surah}: Arabic name differs`);
      const ours = norm(s.transliteration);
      const own = agree(ours, theirs[i]);
      const other = theirs.findIndex((m, j) => j !== i && agree(ours, m) >= own);
      if (other >= 0)
        P.push(`surah ${s.surah}: "${s.transliteration}" is as close to surah ${other + 1}`);
    });
    return '114 Arabic names equal; each English name is closest to its own surah';
  });
  check('Tanzil cross-check: compare every verse', () => {
    res = compareWithTanzil(qpc, readTanzilWords(tz.text));
    const w = res.words;
    return `${res.verses.length} verse(s) split differently, words differing in letters ${w.letters.length}, pause signs ${w.pause.length}, hizb/sajda signs ${w.signs.length}, other marks ${w.marks.length}`;
  });
  if (res && WRITE_DIFFS) {
    writeFileSync(
      DIFFS,
      JSON.stringify(
        {
          note: 'Reviewed differences between QUL 312 (KFGQPC Hafs) and Tanzil Uthmani 1.1, after the documented conventions in scripts/lib/sources.mjs. Review and print checks: docs/TEXT-CROSSCHECK.md. Locations are surah:verse(:word); no text is stored here.',
          verses: res.verses,
          words: res.words,
        },
        null,
        1,
      ),
      'utf8',
    );
    report('PASS', 'wrote data/tanzil-differences.json', 'review it before committing');
  } else if (res) {
    check(
      'Tanzil differences are exactly the reviewed list (data/tanzil-differences.json)',
      (P) => {
        if (!existsSync(DIFFS)) {
          P.push('data/tanzil-differences.json is missing');
          return '';
        }
        const want = JSON.parse(readFileSync(DIFFS, 'utf8'));
        const cmp = (label, a, b) => {
          const extra = a.filter((x) => !b.includes(x));
          const gone = b.filter((x) => !a.includes(x));
          if (extra.length) P.push(`new ${label} difference(s): ${extra.slice(0, 5).join(', ')}`);
          if (gone.length)
            P.push(`${label} difference(s) no longer present: ${gone.slice(0, 5).join(', ')}`);
        };
        cmp('verse', res.verses, want.verses);
        for (const k of Object.keys(res.words)) cmp(k, res.words[k], want.words[k] || []);
        return 'no unreviewed differences';
      },
    );
  }
}

// ---------- 7. QUL databases (local, --full) ----------
const qulPaths = findQul(qulArg || DEFAULT_QUL_DIR);
if (!FULL)
  report(
    'SKIP',
    'line-by-line and word-by-word check against the QUL databases',
    'run locally with --full',
  );
else if (!qulPaths)
  report(
    'FAIL',
    'QUL databases',
    'not found; put them in tmp/downloads/qul/x or use --qul <folder>',
  );
else {
  check('QUL databases match data/sources/SHA256SUMS', (P) => {
    P.push(...checkSums(Object.values(qulPaths)));
    return 'all 3 match';
  });
  const bannerMap = findFile(qulArg || DEFAULT_QUL_DIR, BANNER.ligatures);
  check('surah banner characters match the QUL banner map (ligatures.json)', (P) => {
    if (!bannerMap) {
      P.push(`${BANNER.ligatures} not found next to the QUL databases`);
      return '';
    }
    P.push(...checkSums([bannerMap]));
    const want = readBannerMap(bannerMap);
    d.surahs.forEach((s, i) => {
      if (s.banner !== want[i]) P.push(`surah ${s.surah}`);
    });
    return 'checksum and all 114 characters match';
  });
  const q = await readQul(qulPaths);
  check('every line matches the QUL layout (type, centring, surah, first and last word)', (P) => {
    const flat = d.pages.flatMap((p) =>
      p.lines.map((l, i) => ({ ...l, page: p.page, line: i + 1 })),
    );
    if (flat.length !== q.lines.length) P.push(`${flat.length} lines, QUL has ${q.lines.length}`);
    q.lines.forEach((ql, i) => {
      const l = flat[i];
      const type = { ayah: 'ayah', surah_name: 'surah', basmallah: 'basmala' }[ql.type];
      if (
        !l ||
        l.page !== ql.page ||
        l.line !== ql.line ||
        l.type !== type ||
        l.centered !== ql.centered
      )
        P.push(`page ${ql.page} line ${ql.line}`);
      else if (type === 'surah' && l.surah !== ql.surah)
        P.push(`page ${ql.page} line ${ql.line}: surah`);
      else if (
        type === 'ayah' &&
        (l.words[0][0] !== ql.first || l.words[l.words.length - 1][0] !== ql.last)
      )
        P.push(`page ${ql.page} line ${ql.line}: words ${ql.first} to ${ql.last}`);
    });
    return `${q.lines.length} lines identical`;
  });
  check('every word matches QUL 312 (text) and QUL 61 (glyph codes)', (P) => {
    if (all.length !== q.text.length) P.push(`${all.length} words, QUL has ${q.text.length}`);
    all.forEach((w, i) => {
      const t = q.text[i];
      const g = q.glyphs[i];
      if (
        !t ||
        !g ||
        w.id !== t.id ||
        w.verse !== `${t.surah}:${t.ayah}` ||
        w.pos !== t.pos ||
        w.text !== t.text ||
        w.glyph !== g.text
      )
        if (P.length < 20) P.push(`word ${i + 1} (${t ? t.loc : '?'})`);
    });
    return `${all.length} words identical in text, glyph codes, verse and position`;
  });
}

const failed = results.filter((r) => r === 'FAIL').length;
const skipped = results.filter((r) => r === 'SKIP').length;
console.log(
  failed
    ? `\nvalidate: ${failed} check(s) FAILED`
    : `\nvalidate: all ${results.length - skipped} checks passed${skipped ? `, ${skipped} skipped (see above)` : ''}`,
);
process.exit(failed ? 1 : 0);
