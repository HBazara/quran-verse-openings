// Print a booklet: a range of pages, one mushaf page per A5 sheet, drawn exactly as on screen (the
// current opening words, verse-end markers and margin markers). Each sheet leaves a wider margin
// on the binding side: an Arabic book is bound on the right, so odd pages (right-hand pages) bind
// on their left edge and even pages on their right edge.

import { formatNumber, t, toWesternDigits } from './i18n.js';
import { loadPageFont } from './fonts.js';
import { MARGIN, PAGE, fontPagesFor, renderPage } from './render.js';

const $ = (id) => document.getElementById(id);
// Pages at a time (two juz); each page loads its own font. The hint text (print.hint in the strings
// files) quotes the same number.
const PRINT_LIMIT = 40;
const MM = 96 / 25.4; // CSS pixels per millimetre
const SHEET = { width: 148 * MM, height: 210 * MM }; // A5 portrait (see @page in styles.css)
const ROOM = { binding: 14 * MM, outer: 8 * MM, top: 10 * MM, bottom: 10 * MM };

// app: { lastPage, pages (on screen), opts() (the current drawing settings) }
export function setupPrint(quran, app) {
  const form = $('print-form');
  const from = $('print-from');
  const to = $('print-to');
  const error = $('print-error');
  const area = $('print-area');

  function setError(on) {
    for (const input of [from, to]) input.setAttribute('aria-invalid', String(on));
    error.textContent = on
      ? t('print.error', {
          min: formatNumber(1),
          max: formatNumber(app.lastPage),
          limit: formatNumber(PRINT_LIMIT),
        })
      : '';
  }

  async function print(first, last) {
    error.textContent = t('print.preparing');
    const pages = [];
    for (let p = first; p <= last; p++) pages.push(p);
    await Promise.all(pages.flatMap(fontPagesFor).map(loadPageFont));
    const opts = app.opts();
    const pageWidth = PAGE.width + (opts.margin ? MARGIN : 0);
    area.style.setProperty('--page-w', `${pageWidth}px`);
    area.replaceChildren(
      ...pages.map((p) => {
        const sheet = document.createElement('div');
        sheet.className = 'print-sheet';
        const page = renderPage(quran, p, {
          ...opts,
          label: t('page.label', { n: formatNumber(p) }),
        });
        const boxWidth = SHEET.width - ROOM.binding - ROOM.outer;
        const boxHeight = SHEET.height - ROOM.top - ROOM.bottom;
        const scale = Math.min(boxWidth / pageWidth, boxHeight / PAGE.height);
        const left = (p % 2 === 1 ? ROOM.binding : ROOM.outer) + (boxWidth - pageWidth * scale) / 2;
        const top = ROOM.top + (boxHeight - PAGE.height * scale) / 2;
        // zoom (not transform) shrinks the page's own box, so nothing sticks out of the sheet and
        // the browser does not shrink the whole printout to make room.
        const place = document.createElement('div');
        place.className = 'print-place';
        Object.assign(place.style, {
          left: `${left}px`,
          top: `${top}px`,
          width: `${pageWidth * scale}px`,
          height: `${PAGE.height * scale}px`,
        });
        page.style.zoom = String(scale);
        place.append(page);
        sheet.append(place);
        return sheet;
      }),
    );
    await document.fonts.ready;
    error.textContent = '';
    window.print();
  }

  // The page numbers may be typed with Western or Arabic-Indic digits.
  const read = (input) => {
    const typed = toWesternDigits(input.value).trim();
    return /^\d{1,4}$/.test(typed) ? Number(typed) : NaN;
  };
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const first = read(from);
    const last = read(to);
    const ok =
      first >= 1 && last <= app.lastPage && first <= last && last - first + 1 <= PRINT_LIMIT;
    setError(!ok);
    if (ok) print(first, last);
  });
  for (const input of [from, to]) input.addEventListener('input', () => setError(false));
  window.addEventListener('afterprint', () => area.replaceChildren());

  return {
    // the pages on screen are the suggested range
    sync(pages) {
      if (![from, to].includes(document.activeElement)) {
        from.value = formatNumber(pages[0]);
        to.value = formatNumber(pages[pages.length - 1]);
      }
    },
  };
}
