// Shared helpers for scripts/build-data.mjs and scripts/validate.mjs.
// Finds and checks the source files, reads the QUL databases and the Tanzil text,
// and holds the documented rules for comparing the two texts.
// No Arabic text is typed here: every character is written as a \u escape.

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Characters are written as code points (never typed), so the rules stay readable and reviewable.
export const cp = (...codes) => String.fromCodePoint(...codes);

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
export const SOURCES_DIR = join(ROOT, 'data', 'sources');
export const SUMS_FILE = join(SOURCES_DIR, 'SHA256SUMS');

// Source files, by name. QUL files are never committed (PROJECT.md Rule 1 item 7).
export const QUL = {
  layout: 'qpc-v2-15-lines.db', // QUL mushaf-layout 10, KFGQPC V2 layout (1421H print)
  glyphs: 'qpc-v2.db', // QUL quran-script 61, QPC V2 glyph codes, word by word
  text: 'qpc-hafs-word-by-word.db', // QUL quran-script 312, KFGQPC Hafs Unicode text, word by word
};
export const TANZIL = {
  text: 'quran-uthmani.txt', // Tanzil Uthmani 1.1 (CC BY 3.0, verbatim)
  meta: 'quran-data.js', // Tanzil metadata 1.0 (CC BY 3.0, verbatim)
};
export const DEFAULT_QUL_DIR = join(ROOT, 'tmp', 'downloads', 'qul', 'x');
export const DEFAULT_TANZIL_DIRS = [SOURCES_DIR, join(ROOT, 'tmp', 'downloads', 'tanzil')];

export function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex');
}

// Read SHA256SUMS ("<hash>  <name>" per line) into a Map name -> hash.
export function readSums() {
  const sums = new Map();
  if (!existsSync(SUMS_FILE)) return sums;
  for (const line of readFileSync(SUMS_FILE, 'utf8').split('\n')) {
    const m = line.match(/^([0-9a-f]{64}) [ *](.+)$/);
    if (m) sums.set(m[2].trim(), m[1]);
  }
  return sums;
}

// Find a file by name in a folder or in its direct subfolders. Returns null if not found.
export function findFile(dir, name) {
  if (!dir || !existsSync(dir)) return null;
  const direct = join(dir, name);
  if (existsSync(direct)) return direct;
  for (const sub of readdirSync(dir)) {
    const p = join(dir, sub, name);
    if (statSync(join(dir, sub)).isDirectory() && existsSync(p)) return p;
  }
  return null;
}

export function findTanzil(dirs = DEFAULT_TANZIL_DIRS) {
  for (const d of dirs) {
    const text = findFile(d, TANZIL.text);
    const meta = findFile(d, TANZIL.meta);
    if (text && meta) return { text, meta };
  }
  return null;
}

export function findQul(dir = DEFAULT_QUL_DIR) {
  const out = {};
  for (const [k, name] of Object.entries(QUL)) {
    out[k] = findFile(dir, name);
    if (!out[k]) return null;
  }
  return out;
}

// Check files against SHA256SUMS. Returns a list of problems (empty when all match).
export function checkSums(paths) {
  const sums = readSums();
  const problems = [];
  for (const path of paths) {
    const name = path.split(/[\\/]/).pop();
    const want = sums.get(name);
    if (!want) problems.push(`${name}: not listed in data/sources/SHA256SUMS`);
    else if (sha256(path) !== want)
      problems.push(`${name}: SHA-256 does not match data/sources/SHA256SUMS`);
  }
  return problems;
}

// node:sqlite prints an ExperimentalWarning in some Node versions; keep the output clean.
async function sqlite() {
  const emit = process.emitWarning;
  process.emitWarning = (w, ...rest) =>
    String(w).includes('SQLite') ? undefined : emit.call(process, w, ...rest);
  const mod = await import('node:sqlite');
  process.emitWarning = emit;
  return mod;
}

// Read the three QUL databases.
export async function readQul(paths) {
  const { DatabaseSync } = await sqlite();
  const open = (p) => new DatabaseSync(p, { readOnly: true });
  const layout = open(paths.layout);
  const lines = layout
    .prepare(
      'select page_number, line_number, line_type, is_centered, first_word_id, last_word_id, surah_number from pages order by page_number, line_number',
    )
    .all()
    .map((r) => ({
      page: Number(r.page_number),
      line: Number(r.line_number),
      type: r.line_type,
      centered: Number(r.is_centered) === 1,
      first: r.first_word_id === '' || r.first_word_id == null ? null : Number(r.first_word_id),
      last: r.last_word_id === '' || r.last_word_id == null ? null : Number(r.last_word_id),
      surah: r.surah_number === '' || r.surah_number == null ? null : Number(r.surah_number),
    }));
  const info = layout.prepare('select * from info').all();
  layout.close();
  const words = (p) => {
    const db = open(p);
    const rows = db
      .prepare('select id, location, surah, ayah, word, text from words order by id')
      .all();
    db.close();
    return rows.map((r) => ({
      id: Number(r.id),
      loc: r.location,
      surah: Number(r.surah),
      ayah: Number(r.ayah),
      pos: Number(r.word),
      text: r.text,
    }));
  };
  return { lines, info, glyphs: words(paths.glyphs), text: words(paths.text) };
}

// ---------- Tanzil ----------

const SHADDA = cp(0x0651);
const hasLetter = (tok) => /\p{L}/u.test(tok);

// Tanzil verses -> words, with the PROJECT.md splitting rules:
// pause marks join the previous word, the Bismillah is removed from verse 1 (except
// surahs 1 and 9), and a leading sign with no letters (the hizb sign) joins the next word.
export function readTanzilWords(path) {
  const verses = new Map();
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (!line || line.startsWith('#')) continue;
    const [s, a, ...rest] = line.replace(/\r$/, '').split('|');
    verses.set(`${Number(s)}:${Number(a)}`, rest.join('|'));
  }
  const bism = verses.get('1:1').split(' ');
  const noShadda = (w) => w.replaceAll(SHADDA, '');
  const out = new Map();
  for (const [key, text] of verses) {
    let toks = text.split(' ');
    const [s, a] = key.split(':').map(Number);
    if (a === 1 && s !== 1 && s !== 9) {
      const head = toks.slice(0, 4).map(noShadda).join(' ');
      if (head !== bism.map(noShadda).join(' '))
        throw new Error(`Tanzil ${key}: expected the Bismillah prefix`);
      toks = toks.slice(4);
    }
    const words = [];
    let lead = '';
    for (const t of toks) {
      if (!hasLetter(t)) {
        if (words.length) words[words.length - 1] += ' ' + t;
        else lead += t + ' ';
      } else {
        words.push(lead + t);
        lead = '';
      }
    }
    out.set(key, words);
  }
  return out;
}

// Tanzil metadata: Arabic surah names, juz and hizb-quarter starts (verse keys).
export function readTanzilMeta(path) {
  const js = readFileSync(path, 'utf8');
  const block = (name) => {
    const start = js.indexOf(`QuranData.${name} = [`);
    if (start < 0) throw new Error(`Tanzil metadata: ${name} not found`);
    return js.slice(start, js.indexOf('];', start));
  };
  const pairs = (name) =>
    [...block(name).matchAll(/\[(\d+),\s*(\d+)\]/g)].map((m) => `${m[1]}:${m[2]}`);
  const names = [...block('Sura').matchAll(/\[(\d+),\s*(\d+),\s*(\d+),\s*(\d+),\s*'([^']+)'/g)].map(
    (m) => ({
      verses: Number(m[2]),
      name: m[5],
    }),
  );
  return {
    surahs: names,
    juz: pairs('Juz').slice(0, 30),
    quarters: pairs('HizbQaurter').slice(0, 240),
  };
}

// ---------- Comparing QUL 312 with Tanzil ----------
// Documented conventions: the same text written with different code points.
// The full review, with the print checks, is in docs/TEXT-CROSSCHECK.md.

const PAUSE = new RegExp(`[${cp(0x06d6)}-${cp(0x06db)}]`, 'gu'); // pause (waqf) signs U+06D6..U+06DB
const SIGNS = new RegExp(`[${cp(0x06de)}${cp(0x06e9)}]`, 'gu'); // hizb sign U+06DE and sajda sign U+06E9
const SPELLING = [
  [cp(0x0640, 0x0654, 0x064e, 0x0627), cp(0x0623, 0x0653)], // Tanzil: tatweel hamza fatha alef = QPC: alef-hamza madda
  [cp(0x064a, 0x0655), cp(0x0626)], // QPC: yeh + hamza below = Tanzil: yeh with hamza
];
const QPC_MARKS = [
  [cp(0x0652), cp(0xe000)], // QPC 'sukun' code is the round zero (silent letter); placeholder, see below
  [cp(0x06e1), cp(0x0652)], // QPC small high dotless head of khah = sukun
  [cp(0x0657), cp(0x064b)], // staggered fathatan
  [cp(0x065e), cp(0x064c)], // staggered dammatan
  [cp(0x0656), cp(0x064d)], // staggered kasratan
  [cp(0xe000), cp(0x06df)], // round zero = Tanzil small high rounded zero
];
const DOTLESS_YEH = [cp(0x0649), cp(0x064a)]; // final dotless yeh: Tanzil alef maksura, QPC yeh

function spell(w) {
  let x = w.replaceAll(' ', '');
  for (const [a, b] of SPELLING) x = x.replaceAll(a, b);
  return x;
}
const letters = (w) =>
  [...spell(w).replace(SIGNS, '')]
    .filter((c) => /\p{Lo}/u.test(c))
    .join('')
    .replaceAll(DOTLESS_YEH[0], DOTLESS_YEH[1]);
const pauses = (w) => (spell(w).match(PAUSE) || []).join('');
const signs = (w) => (spell(w).match(SIGNS) || []).join('');
function marks(w, side) {
  let x = spell(w).replace(PAUSE, '').replace(SIGNS, '');
  if (side === 'qpc') for (const [a, b] of QPC_MARKS) x = x.replaceAll(a, b);
  return x.replaceAll(DOTLESS_YEH[0], DOTLESS_YEH[1]);
}

// qpcVerses: Map "s:a" -> [word texts without the verse number]. tanzil: from readTanzilWords.
// Returns { verses: [keys with a different word count], words: { letters, pause, signs, marks } }.
export function compareWithTanzil(qpcVerses, tanzil) {
  const res = { verses: [], words: { letters: [], pause: [], signs: [], marks: [] } };
  for (const [key, qw] of qpcVerses) {
    const tw = tanzil.get(key);
    if (!tw) throw new Error(`Tanzil has no verse ${key}`);
    if (qw.length !== tw.length) {
      res.verses.push(key);
      continue;
    }
    qw.forEach((q, i) => {
      const t = tw[i];
      const loc = `${key}:${i + 1}`;
      if (letters(q) !== letters(t)) res.words.letters.push(loc);
      if (pauses(q) !== pauses(t)) res.words.pause.push(loc);
      if (signs(q) !== signs(t)) res.words.signs.push(loc);
      if (marks(q, 'qpc') !== marks(t, 'tanzil')) res.words.marks.push(loc);
    });
  }
  if (tanzil.size !== qpcVerses.size)
    throw new Error('Tanzil and QUL have a different number of verses');
  return res;
}
