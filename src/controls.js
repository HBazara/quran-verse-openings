// The Go to panel (page number, surah, juz) and the Settings panel (opening words per verse,
// verse-end markers, peek, test mode, zoom, theme). Option texts come from the strings files and the
// data, and fillTexts() can be run again when the interface language changes.

import { formatNumber, formatPercent, t, toWesternDigits } from './i18n.js';
import { juzAt, surahAt } from './places.js';
import { findSurahs } from './search.js';

const $ = (id) => document.getElementById(id);

function choice(name, value) {
  const label = document.createElement('label');
  label.className = 'choice';
  const input = document.createElement('input');
  input.type = 'radio';
  input.name = name;
  input.value = String(value);
  label.append(input, document.createElement('span'));
  return label;
}

// app: { lastPage, zooms, goTo(page), setWords(n), setMarkers(on), setPeek(on), setTest(on),
// setZoom(z), setTheme(name), closePanels() }
export function setupControls(quran, app) {
  const pageForm = $('page-form');
  const pageInput = $('page-input');
  const pageError = $('page-error');
  const surahSelect = $('surah-select');
  const juzSelect = $('juz-select');
  const words = $('words-choices');
  const markers = $('markers-toggle');
  const peek = $('peek-toggle');
  const marginToggle = $('margin-toggle');
  const test = $('test-toggle');
  const zoom = $('zoom-select');
  const themes = $('theme-choices');
  const search = $('surah-search');
  const searchStatus = $('search-status');
  const results = $('search-results');
  const surahText = (s) =>
    t('surah.option', { n: formatNumber(s.surah), latin: s.transliteration, arabic: s.name });

  // Surah search: results as you type (at most 20 shown); Enter opens the first one.
  function drawResults() {
    const query = search.value;
    const found = findSurahs(quran.surahs, query);
    results.replaceChildren(
      ...found.slice(0, 20).map((s) => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'result';
        b.dataset.surah = String(s.surah);
        b.textContent = surahText(s);
        li.append(b);
        return li;
      }),
    );
    searchStatus.textContent = !query.trim()
      ? ''
      : found.length
        ? t('search.count', { n: formatNumber(found.length) })
        : t('search.none');
  }
  search.addEventListener('input', drawResults);
  search.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    results.querySelector('button')?.click();
  });
  results.addEventListener('click', (e) => {
    const b = e.target instanceof Element ? e.target.closest('button[data-surah]') : null;
    if (!b) return;
    surahSelect.value = b.dataset.surah;
    app.goTo(quran.surahs[Number(b.dataset.surah) - 1].page);
  });

  for (const s of quran.surahs) surahSelect.append(new Option('', String(s.surah)));
  for (const j of quran.juz) juzSelect.append(new Option('', String(j.juz)));
  for (const z of app.zooms) zoom.append(new Option('', String(z)));
  for (let n = 1; n <= 5; n++) words.append(choice('words', n));

  function fillTexts() {
    quran.surahs.forEach((s, i) => {
      surahSelect.options[i].text = surahText(s);
    });
    drawResults();
    quran.juz.forEach((j, i) => {
      juzSelect.options[i].text = t('juz.option', { n: formatNumber(j.juz) });
    });
    app.zooms.forEach((z, i) => {
      zoom.options[i].text = formatPercent(z / 100);
    });
    words.querySelectorAll('span').forEach((span, i) => {
      span.textContent = formatNumber(i + 1);
    });
  }

  function setError(on) {
    pageInput.setAttribute('aria-invalid', String(on));
    pageError.textContent = on
      ? t('page.error', { min: formatNumber(1), max: formatNumber(app.lastPage) })
      : '';
  }

  // The page number may be typed with Western (45) or Arabic-Indic (٤٥) digits.
  pageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const typed = toWesternDigits(pageInput.value).trim();
    const page = /^\d{1,4}$/.test(typed) ? Number(typed) : NaN;
    if (page >= 1 && page <= app.lastPage) {
      setError(false);
      app.goTo(page);
      app.closePanels();
    } else setError(true);
  });
  pageInput.addEventListener('input', () => setError(false));
  surahSelect.addEventListener('change', () => app.goTo(quran.surahs[surahSelect.value - 1].page));
  juzSelect.addEventListener('change', () => app.goTo(quran.juz[juzSelect.value - 1].page));
  words.addEventListener('change', (e) => app.setWords(Number(e.target.value)));
  markers.addEventListener('change', () => app.setMarkers(markers.checked));
  peek.addEventListener('change', () => app.setPeek(peek.checked));
  marginToggle.addEventListener('change', () => app.setMargin(marginToggle.checked));
  test.addEventListener('change', () => app.setTest(test.checked));
  zoom.addEventListener('change', () => app.setZoom(Number(zoom.value)));
  themes.addEventListener('change', (e) => app.setTheme(e.target.value));

  // view: { page, pages (on screen), words, markers, peek, test, zoom, theme }
  function sync(view) {
    if (document.activeElement !== pageInput) {
      pageInput.value = formatNumber(view.page);
      setError(false);
    }
    // A surah chosen from the list stays chosen while its first page is on screen (several surahs
    // can start on one page, as on page 604); otherwise the list shows the surah at the top.
    const chosen = quran.surahs[Number(surahSelect.value) - 1];
    if (!chosen || !view.pages.includes(chosen.page))
      surahSelect.value = String(surahAt(quran, view.pages[0]));
    juzSelect.value = String(juzAt(quran, view.pages[0]));
    for (const r of words.querySelectorAll('input')) r.checked = Number(r.value) === view.words;
    markers.checked = view.markers;
    peek.checked = view.peek;
    marginToggle.checked = view.margin;
    test.checked = view.test;
    zoom.value = String(view.zoom);
    for (const r of themes.querySelectorAll('input')) r.checked = r.value === view.theme;
  }

  return { fillTexts, sync };
}
