// Renders one mushaf page from data/quran.json exactly as the layout says (PROJECT.md feature 1).
// Every line and every word is laid out; words that are not openings get visibility: hidden, so they
// keep their space and the visible words stay where the print has them. Lines never wrap: each line
// is placed on its own, and its words are spread (justified) or centred as the layout says.

import { pageFontFamily } from './fonts.js';

// Geometry in print pixels: the 1421H print scanned at 750 px page width. The page scales as one unit.
export const PAGE = { width: 561, height: 900 };
const BLOCK = { x: 30, y: 40, width: 501, height: 799 }; // the inside of the printed frame
// The print's 15 lines are not spread evenly over the block: measured on 32 pages (423 text
// lines), line i (0 to 14) starts at GRID.top + i * GRID.pitch.
const GRID = { top: 5.94, pitch: 52.653 };
// Justified lines: first measured on 520 lines of the print (469 px of ink, 16 px margins), then
// fitted by the overlay check on 442 justified lines of 32 pages (the print's words sit about
// 2.8 px wider apart). V2 glyph size 30 px.
const LINE = { left: 15.6, width: 471.8, fontSize: 30 };
const BANNER_EM = 3.302; // every banner glyph is 3.302 em wide
// Banner and Bismillah positions, measured on the print (112 banners, 111 Bismillah lines on every
// page with them). Printed banners are 481 px wide (the glyph's ink is a little narrower than its
// box). dy moves the line down from the grid; the print shifts both types when they are the first
// or the last line of the page.
const BANNER = { width: 486, fontSize: 486 / BANNER_EM, dx: 1, dy: 3.5, dyFirst: 4, dyLast: -2.5 };
// Printed Bismillah is about 273 px wide (glyph 5.076 em).
const BISMILLAH = { fontSize: 54.8, dx: 0, dy: 1, dyFirst: -6 };
const LAST_LINE = 14;
function dyAt(kind, i) {
  if (i === 0) return kind.dyFirst;
  return i === LAST_LINE && kind.dyLast !== undefined ? kind.dyLast : kind.dy;
}
export const BISMILLAH_GLYPH = String.fromCodePoint(0xfc21); // QCF2BSML: the whole Bismillah
// The quarter sign (U+06DE). In the V2 glyph data it is the first glyph of its word, but the print
// sets it apart with a full word space, so it gets its own place in the line.
const HIZB_SIGN = String.fromCodePoint(0x06de);
// Pages 1 and 2: a banner and 7 lines inside the round frame, in a larger script (measured on the
// print). The print fits each line to the circle, so each line is spread between its printed left
// and right ink ends (block px).
const OPENING_PAGES = {
  fontSize: 26.6,
  lineHeight: 44,
  lineTops: [252.6, 295.6, 337.6, 380.6, 423.6, 466.6, 509.6],
  ends: {
    1: [
      [161.5, 343.5],
      [127.5, 374.5],
      [93.5, 405.5],
      [91.5, 410.5],
      [99.5, 402.5],
      [132.5, 368.5],
      [179.5, 322.5],
    ],
    2: [
      [177, 335],
      [125, 373],
      [94, 407],
      [89, 412],
      [94, 405],
      [132, 370],
      [179, 323],
    ],
  },
  bannerTop: 127,
  bannerWidth: 440,
};
const arabicDigits = new Intl.NumberFormat('ar-EG', { useGrouping: false });

// The page fonts a page needs: its own, and for page 2 also page 1's (see the Bismillah below).
export function fontPagesFor(number) {
  return number === 2 ? [1, 2] : [number];
}

function openingBox(row, number, k) {
  const [left, right] = OPENING_PAGES.ends[number][k];
  row.classList.add('fit');
  const { lineTops, lineHeight, fontSize } = OPENING_PAGES;
  box(row, lineTops[k], left - 0.5, right - left + 1, lineHeight, fontSize);
}

function box(row, top, left, width, height, fontSize) {
  Object.assign(row.style, {
    top: `${top}px`,
    left: `${left}px`,
    width: `${width}px`,
    height: `${height}px`,
    lineHeight: `${height}px`,
    fontSize: `${fontSize}px`,
  });
}

// opts: { words: opening words per verse (Infinity shows every word), markers: show verse-end
// markers, label: the page's accessible name }
export function renderPage(quran, number, opts) {
  const page = quran.pages[number - 1];
  const el = document.createElement('article');
  el.className = 'page';
  el.dir = 'rtl';
  el.lang = 'ar';
  el.dataset.page = String(number);
  el.setAttribute('aria-label', opts.label);

  const frame = document.createElement('div');
  frame.className = 'frame';
  const block = document.createElement('div');
  block.className = 'block';
  block.setAttribute('aria-hidden', 'true'); // glyph codes; screen readers get the text below
  block.style.fontFamily = `'${pageFontFamily(number)}'`;
  const spoken = document.createElement('div');
  spoken.className = 'sr-only';
  el.append(frame, block, spoken);

  const opening = number <= 2;
  let k = 0; // position among the non-banner lines of pages 1 and 2
  page.lines.forEach((line, i) => {
    const row = document.createElement('div');
    row.className = `line ${line.type}${line.centered ? ' centered' : ''}`;
    const top = GRID.top + i * GRID.pitch;
    let text = '';
    if (line.type === 'surah') {
      row.textContent = quran.surahs[line.surah - 1].banner;
      if (opening) {
        const size = OPENING_PAGES.bannerWidth / BANNER_EM;
        const left = (BLOCK.width - OPENING_PAGES.bannerWidth) / 2;
        box(row, OPENING_PAGES.bannerTop, left, OPENING_PAGES.bannerWidth, size * 0.41, size);
      } else {
        const left = (BLOCK.width - BANNER.width) / 2 + BANNER.dx;
        box(row, top + dyAt(BANNER, i), left, BANNER.width, GRID.pitch, BANNER.fontSize);
      }
      text = quran.surahs[line.surah - 1].name;
    } else if (line.type === 'basmala') {
      if (opening) {
        // Page 2: the print repeats the Bismillah of page 1 (verse 1:1, without its marker) in the
        // same script, so it is drawn with page 1's glyphs for those words, taken from the data.
        row.style.fontFamily = `'${pageFontFamily(1)}'`;
        for (const w of quran.pages[0].lines.flatMap((l) => l.words || [])) {
          if (w[3] !== '1:1' || w[5] === 1) continue;
          const span = document.createElement('span');
          span.className = 'w';
          span.textContent = w[1];
          row.append(span);
        }
        openingBox(row, number, k++);
      } else {
        row.textContent = BISMILLAH_GLYPH;
        const t = top + dyAt(BISMILLAH, i);
        box(row, t, BISMILLAH.dx, BLOCK.width, GRID.pitch, BISMILLAH.fontSize);
      }
      text = quran.bismillahText;
    } else {
      for (const w of line.words) {
        const end = w[5] === 1;
        const visible = end ? opts.markers : w[4] <= opts.words;
        const glyphs = [...w[1]];
        const parts =
          w[2].startsWith(HIZB_SIGN) && glyphs.length > 1
            ? [glyphs[0], glyphs.slice(1).join('')]
            : [w[1]];
        for (const part of parts) {
          const span = document.createElement('span');
          span.textContent = part;
          span.className = `w${end ? ' end' : ''}${visible ? '' : ' off'}`;
          span.dataset.verse = w[3]; // for peek and test mode; layout does not use it
          row.append(span);
        }
        if (visible && !end) text += (text ? ' ' : '') + w[2];
      }
      if (opening) openingBox(row, number, k++);
      else box(row, top, LINE.left, LINE.width, GRID.pitch, LINE.fontSize);
    }
    block.append(row);
    if (text) {
      const p = document.createElement('p');
      p.textContent = text;
      spoken.append(p);
    }
  });

  const num = document.createElement('div');
  num.className = 'page-number';
  num.setAttribute('aria-hidden', 'true');
  num.textContent = arabicDigits.format(number);
  el.append(num);
  return el;
}
