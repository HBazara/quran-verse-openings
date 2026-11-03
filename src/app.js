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
import { BISMILLAH_GLYPH, MARGIN, PAGE, fontPagesFor, renderPage } from './render.js';
import { load, save } from './storage.js';
import { setupPanels } from './panels.js';
import { setupKeys, setupSwipe } from './input.js';
import { setupControls } from './controls.js';
import { askLanguage, languageScreenOpen } from './language.js';
import { hidePeeks, resetPeek, setupPeek } from './peek.js';
import { setupTestMode } from './test-mode.js';
import { setupProgress } from './progress.js';
import { setupPrint } from './print.js';
import { setupOffline } from './offline.js';

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

// Saved settings. view, theme and margin stay null until the reader picks one; until then the
// screen width (view, margin) and the device (theme) decide.
function readSaved() {
  const raw = load('settings', {});
  const s = raw && typeof raw === 'object' ? raw : {};
  // Settings saved before version 2 stored the old margin default (on) for everyone, so there only
  // a stored "off" is a choice.
  const margin =
    s.v === 2
      ? typeof s.margin === 'boolean'
        ? s.margin
        : null
      : s.margin === false
        ? false
        : null;
  return {
    v: 2,
    words: Number.isInteger(s.words) && s.words >= 1 && s.words <= 5 ? s.words : 2,
    markers: typeof s.markers === 'boolean' ? s.markers : true,
    peek: typeof s.peek === 'boolean' ? s.peek : false, // off until the reader turns it on (Hassan)
    margin, // juz, hizb and quarter markers in the margin
    zoom: ZOOMS.includes(s.zoom) ? s.zoom : 100,
    theme: THEMES.includes(s.theme) ? s.theme : null,
    view: VIEWS.includes(s.view) ? s.view : null,
  };
}
const saved = readSaved();
// Phones start without the margin markers so the page fills the screen (Hassan); larger screens
// start with them. The short side decides, so turning the phone does not change it.
const phone = Math.min(window.screen.width, window.screen.height) <= 640;
const margin = () => saved.margin ?? !phone;
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
let test = null; // test mode (not saved: it is an activity, not a preference)
let progress = null; // memorization tracker and bookmarks
let printer = null; // print a booklet
let offline = null; // offline use (service worker)

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
  // The screen never scrolls, so a panel (below the header) must end on the screen and scroll inside.
  const below = window.innerHeight - document.querySelector('.top').getBoundingClientRect().bottom;
  document.documentElement.style.setProperty(
    '--panel-max',
    `${Math.max(160, Math.floor(below - 12))}px`,
  );
  const count = state.shown.length || 1;
  const cs = getComputedStyle(book);
  const w = book.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const h = book.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const pageWidth = PAGE.width + (margin() ? MARGIN : 0);
  book.style.setProperty('--page-w', `${pageWidth}px`);
  const whole = Math.min((w - GAP * (count - 1)) / (pageWidth * count), h / PAGE.height);
  book.style.setProperty('--scale', String(Math.max(0.1, whole) * (saved.zoom / 100)));
  book.classList.toggle('zoomed', saved.zoom > 100);
}

function syncControls() {
  controls?.sync({
    page: state.page,
    pages: state.shown.length ? state.shown : [state.page],
    words: state.words,
    markers: saved.markers,
    peek: saved.peek,
    margin: margin(),
    test: test?.isActive() || false,
    zoom: saved.zoom,
    theme: theme(),
  });
}

let ticket = 0;
async function show(direction = 0, push = false) {
  const mine = ++ticket;
  const nums = pagesFor(state.page, state.view);
  try {
    await Promise.all(nums.flatMap(fontPagesFor).map(loadPageFont));
  } catch {
    // Offline, and this page's font is not saved yet: say so and keep the pages on screen.
    if (mine === ticket) setStatus('status.offlinePage');
    return;
  }
  if (mine !== ticket) return; // a newer page turn started meanwhile
  if (status.dataset.key === 'status.offlinePage') setStatus(null);
  const spread = document.createElement('div');
  spread.className = 'spread';
  for (const n of nums) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    const label = t('page.label', { n: formatNumber(n) });
    const opts = { words: state.words, markers: saved.markers, margin: margin(), label };
    slot.append(renderPage(state.quran, n, opts));
    spread.append(slot);
  }
  const newPages = nums.join() !== state.shown.join();
  state.shown = nums;
  fit();
  book.replaceChildren(spread);
  resetPeek();
  test?.apply(nums);
  progress?.update(nums);
  printer?.sync(nums);
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

function setMargin(on) {
  saved.margin = on;
  store();
  show(0);
}

function setPeek(on) {
  saved.peek = on;
  store();
  if (!on) hidePeeks(book);
}

function setTest(on) {
  if (on) hidePeeks(book);
  test.setActive(on, state.shown);
  syncControls();
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
  offline?.fillTexts();
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
  offline = setupOffline();
  $('settings-toggle').addEventListener('click', () => offline.refresh());
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
      setMargin,
      setPeek,
      setTest,
      setZoom,
      setTheme,
      closePanels: () => panels.close(true),
    });
    controls.fillTexts();
    test = setupTestMode(book, () => setTest(false));
    progress = setupProgress(state.quran, { lastPage: LAST_PAGE, goTo });
    printer = setupPrint(state.quran, {
      lastPage: LAST_PAGE,
      opts: () => ({ words: state.words, markers: saved.markers, margin: margin() }),
    });
    setupPeek(book, () => saved.peek && !test.isActive() && !languageScreenOpen());
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
