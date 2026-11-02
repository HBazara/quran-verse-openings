// The Go to panel (page number, surah, juz) and the Settings panel (opening words per verse,
// verse-end markers, zoom, theme). Option texts come from the strings files and the data, and
// fillTexts() can be run again when the interface language changes.

import { formatNumber, formatPercent, t, toWesternDigits } from './i18n.js';

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

// app: { lastPage, zooms, goTo(page), setWords(n), setMarkers(on), setZoom(z), setTheme(name),
// closePanels() }
export function setupControls(quran, app) {
  const pageForm = $('page-form');
  const pageInput = $('page-input');
  const pageError = $('page-error');
  const surahSelect = $('surah-select');
  const juzSelect = $('juz-select');
  const words = $('words-choices');
  const markers = $('markers-toggle');
  const zoom = $('zoom-select');
  const themes = $('theme-choices');

  for (const s of quran.surahs) surahSelect.append(new Option('', String(s.surah)));
  for (const j of quran.juz) juzSelect.append(new Option('', String(j.juz)));
  for (const z of app.zooms) zoom.append(new Option('', String(z)));
  for (let n = 1; n <= 5; n++) words.append(choice('words', n));

  function fillTexts() {
    quran.surahs.forEach((s, i) => {
      surahSelect.options[i].text = t('surah.option', {
        n: formatNumber(s.surah),
        latin: s.transliteration,
        arabic: s.name,
      });
    });
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
  zoom.addEventListener('change', () => app.setZoom(Number(zoom.value)));
  themes.addEventListener('change', (e) => app.setTheme(e.target.value));

  // The surah and juz at the top of a page: the first banner or verse line decides.
  function surahAt(page) {
    for (const line of quran.pages[page - 1].lines) {
      if (line.type === 'surah') return line.surah;
      if (line.type === 'ayah') return Number(line.words[0][3].split(':')[0]);
    }
    return 1;
  }
  function juzAt(page) {
    const lines = quran.pages[page - 1].lines;
    const top = lines.findIndex((l) => l.type === 'ayah') + 1;
    let juz = 1;
    for (const j of quran.juz) if (j.page < page || (j.page === page && j.line <= top)) juz = j.juz;
    return juz;
  }

  // view: { page, pages (on screen), words, markers, zoom, theme }
  function sync(view) {
    if (document.activeElement !== pageInput) {
      pageInput.value = formatNumber(view.page);
      setError(false);
    }
    // A surah chosen from the list stays chosen while its first page is on screen (several surahs
    // can start on one page, as on page 604); otherwise the list shows the surah at the top.
    const chosen = quran.surahs[Number(surahSelect.value) - 1];
    if (!chosen || !view.pages.includes(chosen.page))
      surahSelect.value = String(surahAt(view.pages[0]));
    juzSelect.value = String(juzAt(view.pages[0]));
    for (const r of words.querySelectorAll('input')) r.checked = Number(r.value) === view.words;
    markers.checked = view.markers;
    zoom.value = String(view.zoom);
    for (const r of themes.querySelectorAll('input')) r.checked = r.value === view.theme;
  }

  return { fillTexts, sync };
}
