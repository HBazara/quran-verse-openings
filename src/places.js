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

// pages[juz - 1] = the pages whose top belongs to that juz
export function juzPages(quran) {
  const rows = quran.juz.map(() => []);
  for (let p = 1; p <= quran.pages.length; p++) rows[juzAt(quran, p) - 1].push(p);
  return rows;
}
