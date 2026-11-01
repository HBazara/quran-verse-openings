// Core reader (Phase 3): loads the data and fonts, shows one page or a two-page spread, and turns
// pages with Next and Previous. Settings, keyboard, swipe and the full URL state come in Phase 4,
// the language picker in Phase 5.
//
// Supported in the address for now: #page=1..604, n=1..5 or all (opening words per verse; "all"
// shows every word, for the overlay check), view=single|spread, lang=en|ar.

import { applyStrings, formatNumber, loadStrings, t } from './i18n.js';
import { loadFrameFonts, loadPageFont } from './fonts.js';
import { BISMILLAH_GLYPH, PAGE, fontPagesFor, renderPage } from './render.js';

const LAST_PAGE = 604;
const NARROW = 900; // below this window width, one page is the default view
const GAP = 16; // space between the two pages of a spread, in screen pixels

const book = document.getElementById('book');
const status = document.getElementById('status');
const indicator = document.getElementById('indicator');
const nextBtn = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const viewBtns = {
  single: document.getElementById('view-single'),
  spread: document.getElementById('view-spread'),
};
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const state = { quran: null, page: 1, view: 'single', words: 2, markers: true, shown: [] };

function readHash() {
  const h = new URLSearchParams(location.hash.slice(1));
  const page = Number.parseInt(h.get('page'), 10);
  if (page >= 1 && page <= LAST_PAGE) state.page = page;
  const n = h.get('n');
  if (n === 'all') state.words = Infinity;
  else if (/^[1-5]$/.test(n || '')) state.words = Number(n);
  const view = h.get('view');
  if (view === 'single' || view === 'spread') state.view = view;
  else state.view = window.innerWidth < NARROW ? 'single' : 'spread';
  return h.get('lang') === 'ar' ? 'ar' : 'en';
}

function writeHash() {
  const h = new URLSearchParams(location.hash.slice(1));
  h.set('page', String(state.page));
  h.set('view', state.view);
  history.replaceState(null, '', `#${h.toString()}`);
}

// The pages on screen. A spread follows a real mushaf: odd page on the right, even page on the left.
function pagesFor(page, view) {
  if (view === 'single') return [page];
  const right = page % 2 === 1 ? page : page - 1;
  return right + 1 <= LAST_PAGE ? [right, right + 1] : [right];
}

// Scale the fixed-size pages as one unit so they fit the space (no reflow, no horizontal scroll).
function fit() {
  const count = state.shown.length || 1;
  const cs = getComputedStyle(book);
  const w = book.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const h = book.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const scale = Math.min((w - GAP * (count - 1)) / (PAGE.width * count), h / PAGE.height);
  book.style.setProperty('--scale', String(Math.max(0.1, scale)));
}

let ticket = 0;
async function show(direction = 0) {
  const mine = ++ticket;
  const nums = pagesFor(state.page, state.view);
  await Promise.all(nums.flatMap(fontPagesFor).map(loadPageFont));
  if (mine !== ticket) return; // a newer page turn started meanwhile
  const spread = document.createElement('div');
  spread.className = 'spread';
  for (const n of nums) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    const label = t('page.label', { n: formatNumber(n) });
    slot.append(renderPage(state.quran, n, { words: state.words, markers: state.markers, label }));
    spread.append(slot);
  }
  state.shown = nums;
  fit();
  book.replaceChildren(spread);
  if (direction && !reduceMotion.matches) {
    // An Arabic book turns from right to left: the next page comes in from the left.
    const from = direction > 0 ? '-48px' : '48px';
    spread.animate(
      [
        { transform: `translateX(${from})`, opacity: 0 },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 220, easing: 'ease-out' },
    );
  }
  indicator.textContent =
    nums.length === 2
      ? t('page.range', { a: formatNumber(nums[0]), b: formatNumber(nums[1]) })
      : t('page.label', { n: formatNumber(nums[0]) });
  prevBtn.disabled = nums[0] <= 1;
  nextBtn.disabled = nums[nums.length - 1] >= LAST_PAGE;
  for (const [view, btn] of Object.entries(viewBtns))
    btn.setAttribute('aria-pressed', String(state.view === view));
  writeHash();
  // Fetch the neighbouring pages' fonts in the background, so the next turn is instant.
  const around = [nums[0] - 2, nums[0] - 1, nums[nums.length - 1] + 1, nums[nums.length - 1] + 2];
  around.filter((p) => p >= 1 && p <= LAST_PAGE).forEach((p) => loadPageFont(p).catch(() => {}));
}

function turn(dir) {
  const step = state.view === 'spread' ? 2 : 1;
  const base = pagesFor(state.page, state.view)[0];
  const target = base + dir * step;
  if (target < 1 || target > LAST_PAGE) return;
  state.page = target;
  show(dir);
}

function setView(view) {
  if (state.view === view) return;
  state.view = view;
  show(0);
}

async function start() {
  const lang = readHash();
  await loadStrings(lang);
  applyStrings();
  status.textContent = t('status.loading');
  try {
    const res = await fetch('data/quran.json');
    if (!res.ok) throw new Error(`data/quran.json: HTTP ${res.status}`);
    state.quran = await res.json();
    // The Bismillah's text for screen readers: verse 1:1 without its marker, taken from the data.
    state.quran.bismillahText = state.quran.pages[0].lines
      .flatMap((l) => l.words || [])
      .filter((w) => w[3] === '1:1' && w[5] === 0)
      .map((w) => w[2])
      .join(' ');
    await loadFrameFonts(state.quran.surahs[0].banner, BISMILLAH_GLYPH);
    await show(0);
    status.textContent = '';
  } catch (err) {
    status.textContent = t('status.error');
    throw err;
  }
  nextBtn.addEventListener('click', () => turn(1));
  prevBtn.addEventListener('click', () => turn(-1));
  viewBtns.single.addEventListener('click', () => setView('single'));
  viewBtns.spread.addEventListener('click', () => setView('spread'));
  // Re-fit whenever the space for the book changes (window size, the status line appearing or going).
  new ResizeObserver(() => fit()).observe(book);
  window.addEventListener('hashchange', () => {
    readHash();
    show(0);
  });
}

start();
