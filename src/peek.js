// Peek: tap a verse to see all of its words, in place, for a few seconds. A tap on a word, or on
// the blank stretch of a line where hidden words are, picks the verse at that place. With the
// keyboard, P shows the next verse on screen (reading order). The hidden words only become visible
// (they always keep their space), so nothing on the page moves. A second tap hides them at once.

const SHOW_MS = 4000;
const OWN_KEYS = 'input, select, textarea, [contenteditable]';
const timers = new Map(); // verse key -> timer
let lastByKey = null; // the verse the P key showed last

function hide(book, verse) {
  clearTimeout(timers.get(verse));
  timers.delete(verse);
  for (const s of book.querySelectorAll(`.w.peek[data-verse="${verse}"]`))
    s.classList.remove('peek');
}

function show(book, verse) {
  const hidden = book.querySelectorAll(`.w.off[data-verse="${verse}"]`);
  if (!hidden.length) return;
  for (const s of hidden) s.classList.add('peek');
  timers.set(
    verse,
    setTimeout(() => hide(book, verse), SHOW_MS),
  );
}

// The verse at a tap: the tapped word, or on a blank stretch of a line the word whose place (kept
// even while hidden) is nearest along the line.
function verseAt(book, e) {
  if (!(e.target instanceof Element)) return null;
  const word = e.target.closest('.w[data-verse]');
  if (word && book.contains(word)) return word.dataset.verse;
  const line = e.target.closest('.line');
  if (!line || !book.contains(line)) return null;
  let best = null;
  let distance = Infinity;
  for (const w of line.querySelectorAll('.w[data-verse]')) {
    const r = w.getBoundingClientRect();
    const d = Math.max(r.left - e.clientX, e.clientX - r.right, 0);
    if (d < distance) {
      distance = d;
      best = w;
    }
  }
  return best ? best.dataset.verse : null;
}

// The next verse on screen with hidden words, in reading order (the right page first).
function peekNext(book) {
  const verses = [
    ...new Set([...book.querySelectorAll('.w.off[data-verse]')].map((s) => s.dataset.verse)),
  ];
  if (!verses.length) return;
  const next = verses[(verses.indexOf(lastByKey) + 1) % verses.length];
  for (const v of [...timers.keys()]) hide(book, v);
  lastByKey = next;
  show(book, next);
}

// enabled(): peek is switched on, test mode is off and nothing covers the reader.
export function setupPeek(book, enabled) {
  book.addEventListener('click', (e) => {
    if (!enabled()) return;
    const verse = verseAt(book, e);
    if (!verse) return;
    if (timers.has(verse)) hide(book, verse);
    else show(book, verse);
  });
  document.addEventListener('keydown', (e) => {
    if (e.code !== 'KeyP' || e.altKey || e.ctrlKey || e.metaKey || !enabled()) return;
    if (e.target instanceof Element && e.target.closest(OWN_KEYS)) return;
    e.preventDefault();
    peekNext(book);
  });
}

// Hide every verse shown by peek now (peek switched off, or test mode switched on).
export function hidePeeks(book) {
  for (const verse of [...timers.keys()]) hide(book, verse);
}

// The pages were drawn again: the old words are gone, so their timers are dropped.
export function resetPeek() {
  for (const timer of timers.values()) clearTimeout(timer);
  timers.clear();
  lastByKey = null;
}
