// The reader: asks for the interface language, loads the data and fonts, shows one page or a
// two-page spread, and handles page turns, jumps, the address, settings, the keyboard and swipes.
//
// Address: #page=1..604, view=single|spread and lang=en|ar always follow the reader, so links and
// reloads keep the place. When present, n=1..5 or all sets the opening words for this visit only
// ("all" shows every word, for the overlay check).

import {
  LANGUAGES,
  applyStrings,
  formatNumber,
  language,
  loadAllStrings,
  setLanguage,
  t,
  tIn,
} from './i18n.js';
import { loadFrameFonts, loadPageFont } from './fonts.js';
import { BISMILLAH_GLYPH, PAGE, fontPagesFor, renderPage } from './render.js';
import { load, save } from './storage.js';
import { setupPanels } from './panels.js';
import { setupKeys, setupSwipe } from './input.js';
import { setupControls } from './controls.js';
import { askLanguage, languageScreenOpen } from './language.js';

const LAST_PAGE = 604;
const NARROW = 900; // below this window width, one page is the default view
const GAP = 16; // space between the two pages of a spread, in screen pixels
const ZOOMS = [100, 125, 150, 175, 200]; // per cent of the size that fits the screen
const THEMES = ['light', 'dark', 'sepia'];
const VIEWS = ['single', 'spread'];

const $ = (id) => document.getElementById(id);
const book = $('book');
const status = $('status');
const indicator = $('indicator');
const nextBtn = $('next');
const prevBtn = $('prev');
const langSwitch = $('lang-switch');
const viewBtns = { single: $('view-single'), spread: $('view-spread') };
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const darkDevice = window.matchMedia('(prefers-color-scheme: dark)');

// Saved settings. view and theme stay null until the reader picks one; until then the screen
// width (view) and the device (theme) decide.
function readSaved() {
  const raw = load('settings', {});
  const s = raw && typeof raw === 'object' ? raw : {};
  return {
    words: Number.isInteger(s.words) && s.words >= 1 && s.words <= 5 ? s.words : 2,
    markers: typeof s.markers === 'boolean' ? s.markers : true,
    zoom: ZOOMS.includes(s.zoom) ? s.zoom : 100,
    theme: THEMES.includes(s.theme) ? s.theme : null,
    view: VIEWS.includes(s.view) ? s.view : null,
  };
}
const saved = readSaved();
const store = () => save('settings', saved);
const last = load('lastPage', 1);

const state = {
  quran: null,
  page: Number.isInteger(last) && last >= 1 && last <= LAST_PAGE ? last : 1,
  view: 'single',
  words: saved.words,
  wordsFromAddress: false, // n= in the address wins over the saved setting, for this visit only
  shown: [],
};
let controls = null;
let panels = null;

const theme = () => saved.theme || (darkDevice.matches ? 'dark' : 'light');
function applyTheme() {
  document.documentElement.dataset.theme = theme();
}

// The status line keeps its string key, so it can change language too.
function setStatus(key) {
  status.dataset.key = key || '';
  status.textContent = key ? t(key) : '';
}

// Returns the language named in the address, if any.
function readHash() {
  const h = new URLSearchParams(location.hash.slice(1));
  const page = Number.parseInt(h.get('page'), 10);
  if (page >= 1 && page <= LAST_PAGE) state.page = page;
  const n = h.get('n') || '';
  state.wordsFromAddress = n === 'all' || /^[1-5]$/.test(n);
  if (state.wordsFromAddress) state.words = n === 'all' ? Infinity : Number(n);
  else state.words = saved.words;
  const view = h.get('view');
  if (VIEWS.includes(view)) state.view = view;
  else state.view = saved.view || (window.innerWidth < NARROW ? 'single' : 'spread');
  const lang = h.get('lang');
  return LANGUAGES.includes(lang) ? lang : null;
}

// A jump (page number, surah, juz) gets its own history entry, so Back returns to the page before.
// Page turns and setting changes only replace the address.
function writeHash(push) {
  const h = new URLSearchParams(location.hash.slice(1));
  h.set('page', String(state.page));
  h.set('view', state.view);
  h.set('lang', language());
  if (!state.wordsFromAddress) h.delete('n');
  const hash = `#${h.toString()}`;
  if (hash === location.hash) return;
  if (push) history.pushState(null, '', hash);
  else history.replaceState(null, '', hash);
}

// The pages on screen. A spread follows a real mushaf: odd page on the right, even page on the left.
function pagesFor(page, view) {
  if (view === 'single') return [page];
  const right = page % 2 === 1 ? page : page - 1;
  return right + 1 <= LAST_PAGE ? [right, right + 1] : [right];
}

// Scale the fixed-size pages as one unit to fit the space (never reflowed), times the zoom. Above
// 100% the book scrolls instead of the page changing shape.
function fit() {
  const count = state.shown.length || 1;
  const cs = getComputedStyle(book);
  const w = book.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const h = book.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const whole = Math.min((w - GAP * (count - 1)) / (PAGE.width * count), h / PAGE.height);
  book.style.setProperty('--scale', String(Math.max(0.1, whole) * (saved.zoom / 100)));
  book.classList.toggle('zoomed', saved.zoom > 100);
}

function syncControls() {
  controls?.sync({
    page: state.page,
    pages: state.shown.length ? state.shown : [state.page],
    words: state.words,
    markers: saved.markers,
    zoom: saved.zoom,
    theme: theme(),
  });
}

let ticket = 0;
async function show(direction = 0, push = false) {
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
    slot.append(renderPage(state.quran, n, { words: state.words, markers: saved.markers, label }));
    spread.append(slot);
  }
  const newPages = nums.join() !== state.shown.join();
  state.shown = nums;
  fit();
  book.replaceChildren(spread);
  if (newPages) {
    // A new page starts at its top right, where the text starts (also when zoomed in).
    book.scrollTop = 0;
    book.scrollLeft = book.scrollWidth;
  }
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
  writeHash(push);
  save('lastPage', state.page);
  syncControls();
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

function goTo(page) {
  if (!(page >= 1 && page <= LAST_PAGE)) return;
  state.page = page;
  show(0, true);
}

function setView(view) {
  saved.view = view;
  store();
  if (state.view === view) return;
  state.view = view;
  show(0);
}

function setWords(n) {
  saved.words = n;
  store();
  state.words = n;
  state.wordsFromAddress = false;
  show(0);
}

function setMarkers(on) {
  saved.markers = on;
  store();
  show(0);
}

function setZoom(zoom) {
  saved.zoom = zoom;
  store();
  fit();
}

function setTheme(name) {
  saved.theme = name;
  store();
  applyTheme();
}

// Change the interface language in place, without reloading. The Quran pages do not change; they
// are drawn again only for their labels (page names for screen readers) and the page counter.
function switchLanguage(code) {
  setLanguage(code);
  applyStrings();
  const other = code === 'ar' ? 'en' : 'ar';
  langSwitch.textContent = tIn(other, 'lang.name');
  langSwitch.lang = other;
  langSwitch.dir = other === 'ar' ? 'rtl' : 'ltr';
  langSwitch.title = t('lang.switch');
  // The page counter sits in the left-to-right arrow group, but reads in the interface direction.
  indicator.dir = code === 'ar' ? 'rtl' : 'ltr';
  if (status.dataset.key) setStatus(status.dataset.key);
  controls?.fillTexts();
  if (state.quran && state.shown.length) show(0);
}

// Back, Forward or an edited address.
function onAddress() {
  const before = [state.page, state.view, state.words].join();
  const lang = readHash();
  if (lang && lang !== language()) {
    save('lang', lang);
    switchLanguage(lang);
  } else if ([state.page, state.view, state.words].join() !== before) show(0);
}

async function start() {
  applyTheme();
  darkDevice.addEventListener('change', () => {
    if (saved.theme) return;
    applyTheme();
    syncControls();
  });
  const fromAddress = readHash();
  await loadAllStrings();
  // The language screen highlights the address's language, else the last one used, else the
  // browser's. The reader is prepared behind it in that language.
  const lastLang = load('lang', null);
  const highlight =
    fromAddress ||
    (LANGUAGES.includes(lastLang) && lastLang) ||
    (navigator.language?.toLowerCase().startsWith('ar') ? 'ar' : 'en');
  switchLanguage(highlight);
  askLanguage(highlight).then((code) => {
    save('lang', code);
    if (code !== language()) switchLanguage(code);
    else writeHash(false);
  });
  setStatus('status.loading');
  panels = setupPanels([
    { button: $('goto-toggle'), panel: $('goto-panel') },
    { button: $('settings-toggle'), panel: $('settings-panel') },
  ]);
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
    controls = setupControls(state.quran, {
      lastPage: LAST_PAGE,
      zooms: ZOOMS,
      goTo,
      setWords,
      setMarkers,
      setZoom,
      setTheme,
      closePanels: () => panels.close(true),
    });
    controls.fillTexts();
    await loadFrameFonts(state.quran.surahs[0].banner, BISMILLAH_GLYPH);
    await show(0);
    setStatus(null);
  } catch (err) {
    setStatus('status.error');
    throw err;
  }
  nextBtn.addEventListener('click', () => turn(1));
  prevBtn.addEventListener('click', () => turn(-1));
  viewBtns.single.addEventListener('click', () => setView('single'));
  viewBtns.spread.addEventListener('click', () => setView('spread'));
  langSwitch.addEventListener('click', () => {
    const next = language() === 'ar' ? 'en' : 'ar';
    save('lang', next);
    switchLanguage(next);
  });
  // Arrow keys do not turn pages while the language screen is open.
  setupKeys(turn, () => !languageScreenOpen());
  // No swipe page turns while a zoomed page can be moved sideways.
  setupSwipe(book, turn, () => book.scrollWidth <= book.clientWidth + 1);
  // Re-fit whenever the space for the book changes (window size, the status line appearing or going).
  new ResizeObserver(() => fit()).observe(book);
  window.addEventListener('hashchange', onAddress);
  window.addEventListener('popstate', onAddress);
}

start();
