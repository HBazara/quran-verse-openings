# The reader

How the site draws a mushaf page, and how the reader moves around it. The page drawing was built in phase 3, navigation and settings in phase 4, both by BUILDER. The language picker comes in phase 5.

## Files

| File                                   | What it does                                                                                                                                                                                                           |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`                           | The page: top bar (Next, page indicator, Previous, view buttons, Go to, Settings), the Go to and Settings panels, status line, and the book area. No interface text in the HTML.                                       |
| `src/app.js`                           | Loads the strings, `data/quran.json` and the fonts. Holds the state (page, view, words, markers, zoom, theme). Turns pages, switches views, reads and writes the address, saves settings, and scales the pages to fit. |
| `src/render.js`                        | Draws one page from `data/quran.json`. Holds the page geometry, and `fontPagesFor`, which says which page fonts a page needs (page 2 also needs page 1's).                                                             |
| `src/fonts.js`                         | Loads the QCF2 page font for each page when it is needed, and waits for the banner and Bismillah fonts.                                                                                                                |
| `src/i18n.js`                          | Loads `src/i18n/en.json` or `src/i18n/ar.json`, fills every element marked `data-i18n` or `data-i18n-label`, formats numbers and percentages, and turns Arabic-Indic and Persian digits into Western ones.             |
| `src/i18n/en.json`, `src/i18n/ar.json` | All interface text. 26 keys, the same in both files.                                                                                                                                                                   |
| `src/controls.js`                      | The contents of the Go to panel (page box, surah list, juz list) and the Settings panel (words, markers, zoom, theme).                                                                                                 |
| `src/panels.js`                        | Opens and closes the two panels: one at a time; Escape or a click outside closes; Escape puts focus back on the button.                                                                                                |
| `src/input.js`                         | Keyboard arrows and swipe.                                                                                                                                                                                             |
| `src/storage.js`                       | The only file that uses `localStorage`. Every read and write is in try/catch.                                                                                                                                          |
| `src/styles.css`                       | Layout, the banner and Bismillah `@font-face` rules, and hiding words.                                                                                                                                                 |

There is no build step. All paths are relative, because GitHub Pages will serve the site under `/quran-verse-openings/`.

## How a page is drawn

1. Every line of the page comes from `data/quran.json`, in order. Lines never wrap: each line is placed on its own at a fixed position.
2. Verse lines (`ayah`): every word is drawn with its V2 glyph code in that page's QCF2 font. Words are spread across the line (justified) or centered, as the layout says. The quarter sign ۞ is the first glyph of its word in the V2 data, but the print sets it apart with a full word space, so the reader draws it as its own piece in the line. It is always on the first word of a verse, so it shows whenever the openings show. The text data is unchanged.
3. Words after the first N of each verse get `visibility: hidden` (class `off`). They keep their space, so the visible words stay exactly where the print has them. Changing N only changes which words are hidden. N is 2 by default and can be 1 to 5 in Settings.
4. Verse-end markers are shown by default. The reader can hide them in Settings.
5. Surah banner lines are drawn with one glyph of the surah banner font (`surahs[].banner`, QUL 458), 481 print pixels wide like the print.
6. Bismillah lines on pages 3 to 604 are drawn with one glyph of the Bismillah font: U+FC21 in `QCF2BSML`, about 273 print pixels wide. Page 2's Bismillah is drawn with page 1's QCF2 glyphs for verse 1:1 (without its verse-end marker), taken from the data, because the print repeats that same calligraphy. So page 2 also loads page 1's font (`fontPagesFor` in `src/render.js`, used by `src/app.js`).
7. The page number is drawn at the bottom in Arabic-Indic digits.
8. There is no fallback font for Quran text. Each page waits for its own font (`font-display: block`).

The page is `dir="rtl"` and `lang="ar"`. The drawn glyphs are hidden from screen readers, because they are glyph codes. Instead, each page has hidden text for screen readers: the visible opening words (Unicode text from QUL 312), the surah names, and the Bismillah (the text of verse 1:1).

## Geometry

Measured on the print, in print pixels (the scan is 750 px wide):

| Part                                  | Size and position                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page                                  | 561 x 900                                                                                                                                                                                                                                                                                                                                             |
| Text block (inside the printed frame) | 501 x 799, at 30, 40                                                                                                                                                                                                                                                                                                                                  |
| Lines                                 | 15, on a grid measured on the print (32 pages, 423 lines): line i (0 to 14) starts 5.94 + i x 52.653 px from the top of the block. The lines are not evenly spread over the block.                                                                                                                                                                    |
| Justified verse lines                 | 471.8 wide, starting 15.6 from the block edge, V2 glyphs at 30 px. First measured on 520 lines, then fitted on 442 lines of 32 pages.                                                                                                                                                                                                                 |
| Surah banner                          | 481 wide on the print (the glyph box is 486, because the ink is a little narrower than the box). Measured on 112 banners: 4 px below the grid on the first line, 2.5 px above it on the last line, 3.5 px below it elsewhere.                                                                                                                         |
| Bismillah                             | About 273 wide. Measured on 111 Bismillah lines: 6 px above the grid on the first line, 1 px below it elsewhere.                                                                                                                                                                                                                                      |
| Pages 1 and 2                         | Their own measured layout inside the round frame: a banner 440 wide, then 7 lines with the script at 26.6 px. Line tops 252.6, 295.6, 337.6, 380.6, 423.6, 466.6, 509.6. Each line is spread between the left and right ink ends measured on the print, because the print fits each line to the round frame (`OPENING_PAGES.ends`, 7 pairs per page). |

The whole page is scaled as one unit to fit the window, so it never reflows and there is no horizontal scroll.

## Views and page turns

- **One page** or **two pages** (a spread). A spread follows a real mushaf: the odd page on the right, the even page on the left.
- If the address does not say which view, the reader shows a spread on windows 900 px wide or more, and one page on narrower windows. The reader can switch with the view buttons.
- **Next** is on the left and **Previous** on the right, as in an Arabic book. In a spread they move two pages at a time.
- A page turn slides the new page in over 220 ms, from the left for Next. It is skipped when the system asks for reduced motion (`prefers-reduced-motion`).
- The fonts of the nearby pages are loaded in the background, so the next turn is quick.

## Go to

The Go to button (list icon) opens a small panel:

- **Page number:** accepts Western (45), Arabic-Indic (٤٥) and Persian (۴۵) digits. It must be 1 to 604. Anything else shows "Enter a page number from 1 to 604." and nothing moves.
- **Surah:** a list of the 114 surahs, shown as "18. Al-Kahf الكهف" in English and "١٨. الكهف" in Arabic. Picking one goes to the page where its verse 1 starts. For the 18 surahs whose banner is on the last line of the page before (see `headerPage` in `docs/DATA-FORMAT.md`), that is the page after the banner. Whether to open the banner's page instead is still open (AUD finding P4-01).
- **Juz:** a list "Juz 1" to "Juz 30". Picking one goes to the juz's first page.
- Both lists show the surah and juz at the top of the page on screen.

## Settings

The Settings button (sliders icon) opens a small panel:

| Setting                 | Values                                                                                                                              | Default                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Opening words per verse | 1 to 5                                                                                                                              | 2                                                             |
| Show verse-end markers  | on or off                                                                                                                           | on                                                            |
| Zoom                    | 100, 125, 150, 175 or 200% of the size that fits the screen. The page grows as one unit and the book area scrolls; nothing reflows. | 100%                                                          |
| Theme                   | light, dark or sepia                                                                                                                | follows the device (light or dark) until the reader picks one |

Only one panel is open at a time. Escape or a click outside closes it, and Escape puts focus back on its button.

## Keyboard and touch

- Left arrow: next page. Right arrow: previous page. Not while typing in the page box or using a list.
- On a touch screen: swipe right for the next page, swipe left for the previous page. Not while a zoomed page can be moved sideways.

## What the browser remembers

Saved in `localStorage` under `qvo.settings` and `qvo.lastPage`: opening words, verse-end markers, zoom, theme, the view the reader picked with the view buttons, and the last page. Opening the site with no page in the address goes to the last page. If storage is blocked, the reader works the same and just forgets (D47).

## The address

| Setting | Values                                                            | Behavior                                                                       |
| ------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `page`  | 1 to 604                                                          | Always kept up to date.                                                        |
| `view`  | `single` or `spread`                                              | Always kept up to date.                                                        |
| `n`     | 1 to 5, or `all` (shows every word; used for AUD's overlay check) | Applies to that visit only. Removed when the reader changes the words setting. |
| `lang`  | `en` or `ar`                                                      | Interface language, read when the page loads.                                  |

Jumps from the Go to panel add a browser history entry, so Back returns to where you were. Page turns do not (D48).

## Checked against the print

First check, by BUILDER before the audit, on 7 pages (90 lines): word positions a median of 0 px from the print left to right (85 of 90 within 3 px), 0 to 1 px up and down. Openings did not move between `n=all` and `n=2` in 16 of 16 cases. No console errors.

After AUD's phase 3 findings, BUILDER re-measured the grid, the line width, the banners and the Bismillah lines, and separated the quarter sign (only `src/render.js` changed). On AUD's own 25 pages:

- 274 of 360 lines within 3 px of the print in both directions (205 before), and 355 within 5 px.
- The opening words moved 0 px in 108 of 108 cases between all words shown and openings only.

AUD's re-check on the same 25 pages: 97% of verse lines within 3 px, 100% within 5 px, at most 5 px. The pass rule is a median of 1 px and at least 95% of verse lines within 5 px (D41).

Pages 1 and 2, after AUD asked for a check of the round-frame pages: all 14 lines within 1.3 px of the print (baseline and both ends), surah names within 3 px, and the opening words moved 0 px in 132 of 132 cases.

## Known limits

- On 320 px wide phones the top bar takes three rows (phase 6).
- The surah banner color font stays bright in the dark theme (phase 6).
- The print's own line spacing is uneven on some pages (up to 14 px on page 187). The reader uses one measured grid for all pages.
- Some whole pages of the print sit 4 to 5 px higher or lower than others, from the print and the scan. The reader uses one layout for all pages, which meets the pass rule (D41).
- The inner shape of the Bismillah from `QCF2BSML` differs from the print. Hassan kept this font (D44); the shape is carried to phase 6 (P3-03, D43).
- The surah banner ornament differs from the print. To be polished in phase 6 (AUD finding P3-04).
- The round frame of pages 1 and 2 and the printed frame ornaments are not drawn. The reader draws a simple double border instead.
