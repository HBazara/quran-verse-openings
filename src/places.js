// Where a page sits in the mushaf: the surah and the juz at the top of the page, and the pages of
// each juz (for the memorization grid). The first banner or verse line of a page decides.

const topAyahLine = (quran, page) =>
  quran.pages[page - 1].lines.findIndex((l) => l.type === 'ayah') + 1;

export function surahAt(quran, page) {
  for (const line of quran.pages[page - 1].lines) {
    if (line.type === 'surah') return line.surah;
    if (line.type === 'ayah') return Number(line.words[0][3].split(':')[0]);
  }
  return 1;
}

export function juzAt(quran, page) {
  const top = topAyahLine(quran, page);
  let juz = 1;
  for (const j of quran.juz) if (j.page < page || (j.page === page && j.line <= top)) juz = j.juz;
  return juz;
}

// Verse keys in reading order (no surah has 1,000 verses).
const order = (key) => {
  const [surah, verse] = key.split(':').map(Number);
  return surah * 1000 + verse;
};
const surahOf = (key) => Number(key.split(':')[0]);
const beginsSurah = (w) => w[4] === 1 && w[3].endsWith(':1'); // the first word of verse 1

// The heading the print puts above the frame (pages 3 to 604): the juz on the right, the surah
// names on the left. Read from the print on every page where a surah or a juz changes:
// - the juz that fills most of the page; each line counts for the verse it carries, a banner or
//   Bismillah line for the surah it opens (page 121 still shows juz 6, page 502 already juz 26);
// - the surah with more than half of the page's verse lines (page 385 keeps An-Naml, 7 lines to
//   6); when no surah has that, every surah that begins on the page (pages 596 to 604);
// - a surah that this leaves out on every page is named on the page where it begins (Al-A'la on
//   page 591, Al-Layl on page 595), so every surah is named somewhere.
function buildHeadings(quran) {
  const starts = quran.juz.map((j) => order(j.verse));
  const juzOf = (key) => {
    const n = order(key);
    let i = starts.length - 1;
    while (i > 0 && starts[i] > n) i--;
    return i + 1;
  };
  const table = quran.pages.map(({ lines }) => {
    const owners = [];
    let opened = null; // the surah of the last banner on this page
    lines.forEach((l, i) => {
      if (l.type === 'ayah') owners.push(surahOf(l.words[0][3]));
      else if (l.type === 'surah') owners.push((opened = l.surah));
      else
        owners.push(
          opened ?? surahOf(lines.slice(i + 1).find((x) => x.type === 'ayah').words[0][3]),
        );
    });

    const share = new Map();
    const add = (map, key, part) => map.set(key, (map.get(key) || 0) + part);
    lines.forEach((l, i) => {
      if (l.type !== 'ayah') return add(share, juzOf(`${owners[i]}:1`), 1);
      const first = juzOf(l.words[0][3]);
      if (first === juzOf(l.words[l.words.length - 1][3])) return add(share, first, 1);
      for (const w of l.words) add(share, juzOf(w[3]), 1 / l.words.length); // a juz starts mid-line
    });
    const juz = [...share].sort((a, b) => b[1] - a[1] || a[0] - b[0])[0][0];

    const verseLines = new Map();
    lines.forEach((l, i) => l.type === 'ayah' && add(verseLines, owners[i], 1));
    const total = lines.filter((l) => l.type === 'ayah').length;
    const main = [...verseLines].find(([, n]) => n * 2 > total);
    const begin = lines.flatMap((l) =>
      l.type === 'ayah' ? l.words.filter(beginsSurah).map((w) => surahOf(w[3])) : [],
    );
    const surahs = main ? [main[0]] : begin.length ? begin : [owners[0]];
    return { juz, surahs, begin };
  });
  const named = new Set(table.flatMap((h) => h.surahs));
  return table.map(({ juz, surahs, begin }) => ({
    juz,
    surahs: [...new Set([...surahs, ...begin.filter((s) => !named.has(s))])].sort((a, b) => a - b),
  }));
}

export function pageHeading(quran, page) {
  quran.headings ??= buildHeadings(quran);
  return quran.headings[page - 1];
}

// pages[juz - 1] = the pages whose top belongs to that juz
export function juzPages(quran) {
  const rows = quran.juz.map(() => []);
  for (let p = 1; p <= quran.pages.length; p++) rows[juzAt(quran, p) - 1].push(p);
  return rows;
}
