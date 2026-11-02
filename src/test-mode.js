// Test mode: every opening on the pages on screen is hidden, and the reader shows them one at a
// time, in reading order (the right page first), to check their recitation. Verse-end markers
// follow their own setting. Like peek, this only changes visibility, so nothing moves.

import { formatNumber, t } from './i18n.js';

const $ = (id) => document.getElementById(id);

// onEnd(): the reader pressed "End test" in the test bar.
export function setupTestMode(book, onEnd) {
  const bar = $('test-bar');
  const count = $('test-count');
  const nextBtn = $('test-next');
  let active = false;
  let order = []; // verse keys with an opening on screen, in reading order
  let shown = new Set();
  let pagesKey = '';

  const openings = () => [...book.querySelectorAll('.w[data-verse]:not(.off):not(.end)')];

  function refreshText() {
    count.textContent = t('test.count', {
      a: formatNumber(shown.size),
      b: formatNumber(order.length),
    });
    nextBtn.disabled = shown.size >= order.length;
  }

  // After every drawing of the pages: hide the openings again. Openings already shown stay shown
  // when the same pages are drawn again (for example after a language change).
  function apply(pages) {
    const key = pages.join();
    if (key !== pagesKey) {
      shown = new Set();
      pagesKey = key;
    }
    if (!active) return;
    const spans = openings();
    order = [...new Set(spans.map((s) => s.dataset.verse))];
    for (const s of spans) s.classList.toggle('veil', !shown.has(s.dataset.verse));
    refreshText();
  }

  function next() {
    const verse = order.find((v) => !shown.has(v));
    if (!verse) return;
    shown.add(verse);
    for (const s of book.querySelectorAll(`.w.veil[data-verse="${verse}"]`))
      s.classList.remove('veil');
    refreshText();
  }

  function showAll() {
    for (const v of order) shown.add(v);
    for (const s of book.querySelectorAll('.w.veil')) s.classList.remove('veil');
    refreshText();
  }

  function hideAll() {
    shown = new Set();
    for (const s of openings()) s.classList.add('veil');
    refreshText();
  }

  function setActive(on, pages) {
    active = on;
    bar.hidden = !on;
    shown = new Set();
    pagesKey = pages.join();
    if (on) apply(pages);
    else for (const s of book.querySelectorAll('.w.veil')) s.classList.remove('veil');
  }

  nextBtn.addEventListener('click', next);
  $('test-all').addEventListener('click', showAll);
  $('test-hide').addEventListener('click', hideAll);
  $('test-end').addEventListener('click', () => onEnd());
  // A tap anywhere on the pages shows the next opening.
  book.addEventListener('click', () => {
    if (active) next();
  });

  return { apply, setActive, refreshText, isActive: () => active };
}
