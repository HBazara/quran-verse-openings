// Memorization tracker and bookmarks, in the Go to panel. Each page can be marked "memorized" or
// "needs review", and bookmarked. The panel shows the pages on screen with their marks, the list of
// bookmarks, and a grid of all 604 pages (one row per juz) that opens a page with one tap. Saved in
// the browser; a bookmarked page gets a small ribbon in its top margin (outside the text block).

import { formatNumber, language, t } from './i18n.js';
import { load, save } from './storage.js';
import { juzPages, surahAt } from './places.js';

const $ = (id) => document.getElementById(id);
const STATES = ['memorized', 'review'];
const svg = (paths) =>
  `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths}</svg>`;
const REMOVE_ICON = svg(
  '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
);

// app: { lastPage, goTo(page) }
export function setupProgress(quran, app) {
  const okPage = (p) => Number.isInteger(p) && p >= 1 && p <= app.lastPage;
  const rawMarks = load('marks', {});
  const marks = new Map(
    Object.entries(rawMarks && typeof rawMarks === 'object' ? rawMarks : {})
      .map(([p, s]) => [Number(p), s])
      .filter(([p, s]) => okPage(p) && STATES.includes(s)),
  );
  const rawBookmarks = load('bookmarks', []);
  const bookmarks = new Set((Array.isArray(rawBookmarks) ? rawBookmarks : []).filter(okPage));
  const saveMarks = () => save('marks', Object.fromEntries(marks));
  const saveBookmarks = () =>
    save(
      'bookmarks',
      [...bookmarks].sort((a, b) => a - b),
    );
  let onScreen = [];

  const marksList = $('marks-list');
  const bookmarksList = $('bookmarks-list');
  const summary = $('progress-summary');
  const grid = $('progress-grid');

  // The grid is built once; its cells are not in the tab order (the page box does the same job).
  const cells = new Map();
  juzPages(quran).forEach((pages, i) => {
    const row = document.createElement('div');
    row.className = 'juz-row';
    const num = document.createElement('span');
    num.className = 'juz-num';
    num.dataset.juz = String(i + 1);
    const box = document.createElement('div');
    box.className = 'cells';
    for (const p of pages) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cell';
      cell.tabIndex = -1;
      cell.dataset.page = String(p);
      cells.set(p, cell);
      box.append(cell);
    }
    row.append(num, box);
    grid.append(row);
  });

  const surahName = (p) => {
    const s = quran.surahs[surahAt(quran, p) - 1];
    return language() === 'ar' ? s.name : s.transliteration;
  };

  function drawMarks() {
    marksList.replaceChildren(
      ...onScreen.map((p) => {
        const row = document.createElement('div');
        row.className = 'mark-row';
        row.setAttribute('role', 'group');
        row.setAttribute('aria-label', t('page.label', { n: formatNumber(p) }));
        const name = document.createElement('span');
        name.className = 'mark-page';
        name.textContent = t('page.label', { n: formatNumber(p) });
        const buttons = document.createElement('div');
        buttons.className = 'mark-buttons';
        for (const kind of ['bookmark', ...STATES]) {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'toggle';
          b.dataset.kind = kind;
          b.dataset.page = String(p);
          b.textContent = t(`marks.${kind}`);
          const on = kind === 'bookmark' ? bookmarks.has(p) : marks.get(p) === kind;
          b.setAttribute('aria-pressed', String(on));
          buttons.append(b);
        }
        row.append(name, buttons);
        return row;
      }),
    );
  }

  function drawBookmarks() {
    if (!bookmarks.size) {
      const p = document.createElement('p');
      p.className = 'muted';
      p.textContent = t('bookmarks.empty');
      bookmarksList.replaceChildren(p);
      return;
    }
    const ul = document.createElement('ul');
    ul.className = 'bookmarks';
    for (const p of [...bookmarks].sort((a, b) => a - b)) {
      const li = document.createElement('li');
      const open = document.createElement('button');
      open.type = 'button';
      open.className = 'open';
      open.dataset.page = String(p);
      open.textContent = t('bookmarks.item', {
        page: t('page.label', { n: formatNumber(p) }),
        surah: surahName(p),
      });
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove';
      remove.dataset.page = String(p);
      remove.setAttribute('aria-label', t('bookmarks.remove', { n: formatNumber(p) }));
      remove.title = t('bookmarks.remove', { n: formatNumber(p) });
      remove.innerHTML = REMOVE_ICON;
      li.append(open, remove);
      ul.append(li);
    }
    bookmarksList.replaceChildren(ul);
  }

  function drawGrid() {
    let memorized = 0;
    let review = 0;
    for (const [p, cell] of cells) {
      const state = marks.get(p) || '';
      if (state === 'memorized') memorized++;
      if (state === 'review') review++;
      cell.className = `cell${state ? ` ${state}` : ''}${onScreen.includes(p) ? ' here' : ''}`;
      const label = t('page.label', { n: formatNumber(p) });
      cell.title = state ? `${label}: ${t(`marks.${state}`)}` : label;
      cell.setAttribute('aria-label', cell.title);
    }
    summary.textContent = t('progress.summary', {
      m: formatNumber(memorized),
      r: formatNumber(review),
    });
    for (const num of grid.querySelectorAll('.juz-num')) {
      num.textContent = formatNumber(Number(num.dataset.juz));
      num.title = t('juz.option', { n: formatNumber(Number(num.dataset.juz)) });
    }
  }

  // The small ribbon on bookmarked pages (in the page's top margin).
  function drawRibbons() {
    for (const page of document.querySelectorAll('#book article.page')) {
      const on = bookmarks.has(Number(page.dataset.page));
      const ribbon = page.querySelector('.ribbon');
      if (on && !ribbon) {
        const r = document.createElement('div');
        r.className = 'ribbon';
        r.setAttribute('aria-hidden', 'true');
        (page.querySelector('.sheet') || page).append(r);
      } else if (!on && ribbon) ribbon.remove();
    }
  }

  function drawAll() {
    drawMarks();
    drawBookmarks();
    drawGrid();
    drawRibbons();
  }

  marksList.addEventListener('click', (e) => {
    const b = e.target instanceof Element ? e.target.closest('button.toggle') : null;
    if (!b) return;
    const p = Number(b.dataset.page);
    if (b.dataset.kind === 'bookmark') {
      if (bookmarks.has(p)) bookmarks.delete(p);
      else bookmarks.add(p);
      saveBookmarks();
    } else {
      if (marks.get(p) === b.dataset.kind) marks.delete(p);
      else marks.set(p, b.dataset.kind);
      saveMarks();
    }
    drawAll();
    marksList.querySelector(`button[data-kind="${b.dataset.kind}"][data-page="${p}"]`)?.focus();
  });
  bookmarksList.addEventListener('click', (e) => {
    const b = e.target instanceof Element ? e.target.closest('button[data-page]') : null;
    if (!b) return;
    const p = Number(b.dataset.page);
    if (b.classList.contains('remove')) {
      bookmarks.delete(p);
      saveBookmarks();
      drawAll();
      (bookmarksList.querySelector('button') || $('page-input')).focus();
    } else app.goTo(p);
  });
  grid.addEventListener('click', (e) => {
    const cell = e.target instanceof Element ? e.target.closest('.cell') : null;
    if (cell) app.goTo(Number(cell.dataset.page));
  });
  // The grid is hidden from screen readers (a picture of progress), so a click or tap must not move
  // the focus into it; the click above still opens the page.
  grid.addEventListener('mousedown', (e) => {
    if (e.target instanceof Element && e.target.closest('.cell')) e.preventDefault();
  });

  return {
    // after every drawing of the pages
    update(pages) {
      onScreen = pages;
      drawAll();
    },
    // after a language change
    fillTexts: drawAll,
  };
}
