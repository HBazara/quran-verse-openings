# The reader

How the site draws a mushaf page, and how the reader moves around it. Built by BUILDER: the page drawing in phase 3, navigation and settings in phase 4, the two interface languages in phase 5, the memorization tools in phase 7, and the extras (margin markers, surah search, printing, offline app) in phase 8.

## Files

| File                                    | What it does                                                                                                                                                                                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.html`                            | The page: the language screen, the top bar (Next, page indicator, Previous, view buttons, Go to, Settings, language switch), the Go to and Settings panels, status line, the book area and the test bar. No interface text in the HTML.                 |
| `src/app.js`                            | Loads the strings, `data/quran.json` and the fonts. Holds the state (page, view, words, markers, zoom, theme). Turns pages, switches views, reads and writes the address, saves settings, and scales the pages to fit.                                  |
| `src/render.js`                         | Draws one page from `data/quran.json`. Gives each word its verse key (`data-verse`, used by peek and test mode, not by the layout). Holds the page geometry, and `fontPagesFor`, which says which page fonts a page needs (page 2 also needs page 1's). |
| `src/fonts.js`                          | Loads the QCF2 page font for each page when it is needed, and waits for the banner and Bismillah fonts.                                                                                                                                                 |
| `src/i18n.js`                           | Loads `src/i18n/en.json` or `src/i18n/ar.json`, fills every element marked `data-i18n` or `data-i18n-label`, formats numbers and percentages, and turns Arabic-Indic and Persian digits into Western ones.                                              |
| `src/i18n/en.json`, `src/i18n/ar.json`  | All interface text. 109 keys, the same in both files.                                                                                                                                                                                                   |
| `src/controls.js`                       | The contents of the Go to panel (page box, surah list, juz list) and the Settings panel (words, markers, peek, test mode, zoom, theme).                                                                                                                 |
| `src/panels.js`                         | Opens and closes the two panels: one at a time; Escape or a click outside closes; Escape puts focus back on the button.                                                                                                                                 |
| `src/input.js`                          | Keyboard arrows and swipe.                                                                                                                                                                                                                              |
| `src/storage.js`                        | The only file that uses `localStorage`. Every read and write is in try/catch.                                                                                                                                                                           |
| `src/language.js`                       | The language screen: shows it, highlights and focuses one choice, makes the reader behind it inert, and returns the choice.                                                                                                                             |
| `src/places.js`                         | The surah and the juz at the top of a page, the pages of each juz (for the memorization grid), and the page heading (`pageHeading`, the print's rule). Used by `controls.js`, `progress.js` and `render.js`.                                            |
| `src/peek.js`                           | Peek: a tap on a verse shows its hidden words for 4 seconds.                                                                                                                                                                                            |
| `src/test-mode.js`                      | Test mode: hides the openings on screen and shows them one at a time.                                                                                                                                                                                   |
| `src/progress.js`                       | The memorization tracker and bookmarks in the Go to panel, and the bookmark ribbon on the page.                                                                                                                                                         |
| `src/search.js`                         | Surah search: compares names in a forgiving form (see Go to).                                                                                                                                                                                           |
| `src/print.js`                          | Print a booklet: draws a range of pages on A5 sheets and opens the browser's print dialog.                                                                                                                                                              |
| `src/offline.js`                        | Registers the service worker and runs the Offline use part of Settings.                                                                                                                                                                                 |
| `sw.js`                                 | The service worker (in the project root): saves the app and the page fonts for offline use.                                                                                                                                                             |
| `manifest.webmanifest`, `assets/icons/` | The installable app: its names (from the strings, checked by `validate`) and three icons (an open book, no text).                                                                                                                                       |
| `src/styles.css`                        | Layout, the banner and Bismillah `@font-face` rules, hiding words, the margin medallions, and the print layout.                                                                                                                                         |

There is no build step for local use. For the live site, `scripts/build-site.mjs` copies the site files and writes two version stamps into `sw.js` (see Offline app). All paths are relative, because GitHub Pages will serve the site under `/quran-verse-openings/`.

## How a page is drawn

1. Every line of the page comes from `data/quran.json`, in order. Lines never wrap: each line is placed on its own at a fixed position.
2. Verse lines (`ayah`): every word is drawn with its V2 glyph code in that page's QCF2 font. Words are spread across the line (justified) or centered, as the layout says. The quarter sign ۞ is the first glyph of its word in the V2 data, but the print sets it apart with a full word space, so the reader draws it as its own piece in the line. It is always on the first word of a verse, so it shows whenever the openings show. The text data is unchanged.
3. Words after the first N of each verse get `visibility: hidden` (class `off`). They keep their space, so the visible words stay exactly where the print has them. Changing N only changes which words are hidden. N is 2 by default and can be 1 to 5 in Settings.
4. Verse-end markers are shown by default. The reader can hide them in Settings.
5. Surah banner lines are drawn with one glyph of the surah banner font (`surahs[].banner`, QUL 458), 481 print pixels wide like the print.
6. Bismillah lines on pages 3 to 604 are drawn with one glyph of the Bismillah font: U+FC21 in `QCF2BSML`, about 273 print pixels wide. Page 2's Bismillah is drawn with page 1's QCF2 glyphs for verse 1:1 (without its verse-end marker), taken from the data, because the print repeats that same calligraphy. So page 2 also loads page 1's font (`fontPagesFor` in `src/render.js`, used by `src/app.js`).
7. The page number is drawn at the bottom in Arabic-Indic digits. On pages 3 to 604, the page heading is drawn above the frame, as in the print (see Page heading).
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
- **Find a surah:** a search box ("Name or number") with results as you type, at most 20 shown, and a count ("Surahs found: 3"). Exact names come first, then names that start with the query, then the rest, each in surah order. Enter opens the first result, and a result also selects that surah in the list below. English names forgive case, the article (al, an, ash and so on), apostrophes, hyphens, double letters, e or i, o or u, and a final h: "baqara", "yaseen" and "ali imran" all work. Arabic names forgive vowel marks, tatweel, and the spelling of alef, taa marbuta, alef maqsura and hamza seats; "سورة" in front is ignored. A number, in Western or Arabic-Indic digits, finds that surah. "Aal Imran" is a known extra spelling of surah 3, so "aal imran", "aal-e-imran" and "aali imran" work too (fix for P8-01). It is the only extra spelling: the article is dropped before double letters are collapsed, and changing that order would make "An-Nasr" match "Al-Asr".
- **Surah:** a list of the 114 surahs, shown as "18. Al-Kahf الكهف" in English and "١٨. الكهف" in Arabic. Picking one goes to the page where its verse 1 starts. For the 18 surahs whose banner is on the last line of the page before (see `headerPage` in `docs/DATA-FORMAT.md`), that is the page after the banner. This follows the print's own surah index (D50). The list keeps the surah you picked while its first page is on screen (for example An-Nas, which starts on page 604 with other surahs); otherwise it shows the surah at the top of the page.
- **Juz:** a list "Juz 1" to "Juz 30". Picking one goes to the juz's first page.
- Both lists show the surah and juz at the top of the page on screen.
- Below the lists come the memorization tracker and the bookmarks (see Memorization tools).

## Interface languages

The interface is in English or Arabic. The Quran pages are always Arabic and never change.

**Language screen.** Every time the site opens, a screen asks for the language before the mushaf shows. It has the title and a prompt in both languages, and two buttons, "English" and "العربية", each written in its own language. One button is highlighted and focused, so one tap or Enter continues:

1. the language in the address (`lang`), if there is one;
2. otherwise the last choice (saved as `qvo.lang`);
3. otherwise the browser's language (an Arabic browser gets Arabic, any other gets English).

While the screen is open, the reader behind it is inert, and the arrow keys and swipes do nothing (D51).

**Header switch.** A button after Settings shows the other language's name ("العربية" in the English interface, "English" in the Arabic one). It changes the language at once, without reloading. The pages on screen are drawn again only to change their labels; no word moves.

**Arabic interface.** The whole page is right to left (`dir="rtl"` on `html`), and the header order is mirrored, but Next and Previous keep their book order: Next is still on the left (D52). The panels open on the left. All labels are Arabic. Numbers use Arabic-Indic digits in the page counter, the page box, the error message, the surah and juz lists, the zoom list and the words choices. The page box still accepts Western, Arabic-Indic and Persian digits. Surahs are listed as "٢. البقرة".

**English interface.** Left to right. Surahs are listed as "2. Al-Baqarah البقرة".

## Settings

The Settings button (sliders icon) opens a small panel:

| Setting                 | Values                                                                                                                              | Default                                                       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| Opening words per verse | 1 to 5                                                                                                                              | 2                                                             |
| Peek                    | on or off (see Memorization tools)                                                                                                  | off                                                           |
| Test mode               | on or off (see Memorization tools). Not saved: it is an activity, not a preference, so it is off every time the site opens.         | off                                                           |
| Show verse-end markers  | on or off                                                                                                                           | on                                                            |
| Zoom                    | 100, 125, 150, 175 or 200% of the size that fits the screen. The page grows as one unit and the book area scrolls; nothing reflows. | 100%                                                          |
| Theme                   | light, dark or sepia                                                                                                                | follows the device (light or dark) until the reader picks one |

The Settings panel also has **Offline use** and **Print a booklet** (see Extras).

Only one panel is open at a time. Escape or a click outside closes it, and Escape puts focus back on its button.

## Themes and screen sizes (phase 6)

- **Banner colors:** the surah banner font has its own color palettes. The light theme uses palette 0, the dark theme palette 1 (dark teal band, black panel, white name), and the sepia theme palette 2 (cream, white panel, deep red name).
- **Phones:** below 640 px wide, the One page and Two pages buttons show icons only; their names stay for screen readers. The top bar takes 2 rows on phones (320 to 414 px) and 1 row from about 1000 px.
- **Interface text:** the font list is system-ui, Segoe UI, Noto Sans, Noto Sans Arabic, Tahoma. Arabic interface text is 17 px with a line height of 1.6. This is only the interface; the Quran pages use their own fonts.

## Memorization tools (phase 7)

All four tools only change which words are visible. Hidden words always keep their space, so no word on the page moves.

**Peek.** Off by default (Hassan's choice, D58); the reader switches it on in Settings. With peek on, a tap (or click) on a verse's opening, or on the blank stretch of a line where its hidden words are, shows all the hidden words of that verse in place. On a blank stretch, the verse of the hidden word nearest the tap along the line is picked. The words show in their own color (`--peek`, set for each theme), for 4 seconds. A second tap on the same verse hides them at once. With the keyboard, the **P** key (the same key on an Arabic keyboard, ح) peeks the next verse on screen that has hidden words, in reading order, one at a time: each press hides the one before, and after the last verse it starts again at the first. P does nothing while typing in a field, in test mode, or while the language screen is open. If verse-end markers are off, that verse's marker shows too. Peek does nothing while test mode is on. Turning a page, switching peek off, or switching test mode on hides any verse peek is showing at once (fix for P8-04).

**Test mode.** Switched on in Settings. It hides every opening on the pages on screen, and a bar appears under the pages:

- **Show next opening** (or a tap anywhere on the pages) shows the next opening in reading order, the right page first in a spread.
- A counter, for example "2 of 13" ("٢ من ١٣" in Arabic), counts the openings shown out of the openings on screen.
- **Show all**, **Hide all**, and **End test** (switches test mode off).

The test starts again, with all openings hidden, only when the pages on screen change: a page turn, a jump, or switching between one page and two pages. Drawing the same pages again keeps the progress: a language change, the words setting or the markers setting. After a words change, the openings already shown show their new number of words. Verse-end markers follow their own setting. Because the bar takes room, the pages are drawn a little smaller while test mode is on; inside the page no word moves.

**Memorization tracker.** In the Go to panel:

- **Pages on screen:** each page on screen has three buttons: **Bookmark**, **Memorized** and **Needs review**. Memorized and Needs review exclude each other; pressing the active one again clears it. A bookmark is separate from the marks, so a page can be both bookmarked and memorized.
- **Memorization:** a summary ("Memorized pages: 1. Needs review: 1.") and a grid of all 604 pages, one row per juz, with the juz number at the start of the row. A page belongs to the juz at its top (the same rule as the juz list). A memorized page is a filled green square, a page that needs review an amber ring, and the pages on screen are outlined. A tap on a square opens that page.
- The grid is for mouse and touch only: its squares are not in the tab order and are hidden from screen readers, because the page box above does the same job from the keyboard. A click or tap on a square opens the page without moving the keyboard focus into the grid.

**Bookmarks.** A page is bookmarked with the Bookmark button under Pages on screen. The **Bookmarks** list in the Go to panel shows each one as "Page 50, Ali 'Imran" ("صفحة ٥٠، آل عمران" in Arabic), using the surah at the top of the page, in page order. A tap opens the page, and the X button next to it removes the bookmark. A bookmarked page shows a small ribbon at the page's top-right corner, outside the frame, so it never covers the page heading or a word.

## Keyboard and touch

- Left arrow: next page. Right arrow: previous page. Not while typing in the page box or using a list.
- P: peek the next verse (see Memorization tools). Not while typing in a field, in test mode, or while the language screen is open.
- On a touch screen: swipe right for the next page, swipe left for the previous page. Not while a zoomed page can be moved sideways.

## Extras (phase 8)

**Juz, hizb and quarter markers.** A setting, "Show juz, hizb and quarter markers in the margin", on by default. When it is on, each page gets a 64 px outer margin: on the right of odd pages and on the left of even pages, like a book. So the pages are drawn a little smaller; inside the page no word moves. A medallion sits in that margin at the line where the juz, hizb or quarter starts, taken from the data's `juz`, `hizb` and `quarters` lists:

- a quarter: an arched tablet, "ربع الحزب N", "نصف الحزب N" or "ثلاثة أرباع الحزب N";
- a hizb start: an oval, "الحزب N";
- a juz start: an oval, "الجزء N" and "الحزب N".

The medallion text is always Arabic with Arabic-Indic digits, like the print. Screen readers hear a sentence in the interface language, for example "Quarter of hizb 1." or "Juz 2 begins (hizb 3)." Pages 1 and 2 have no medallion, as in the print.

**Print a booklet.** In Settings: "From page" and "To page" (the pages on screen are filled in), up to 40 pages at a time (two juz), in either digit system. A wrong range shows "Choose pages from 1 to 604, up to 40 at a time, the first not after the last." Each mushaf page goes on its own A5 sheet, with a 14 mm margin on the binding side: an Arabic book is bound on the right, so odd pages bind on their left edge and even pages on their right edge. The pages are drawn fresh with the current opening words, verse-end markers and margin markers, with the text, page numbers and medallions in black on white whatever the theme; the surah banners keep their normal colors (never the dark palette), and the frame stays green. Test mode and peek are not printed. The page is scaled with CSS `zoom`, not `transform`, so the browser does not shrink the printout.

**Offline app.** The site can be installed as an app (`manifest.webmanifest`, three icons) and works without internet after the first visit. The service worker `sw.js`:

- saves the app when it installs: the page, the code, the strings, `data/quran.json`, the banner and Bismillah fonts and the icons, about 5 MB;
- saves each page's font the first time that page is shown;
- takes app files from the network first; the saved copy is used only when offline;
- downloads every file with `cache: "no-cache"`: app files, the app files saved when a new version installs, and page fonts saved on first view. The browser asks the server whether the file changed and gets a short "not changed" answer when it did not. GitHub Pages lets browsers keep their own copy for 10 minutes (`Cache-Control: max-age=600`), so without this a deploy could show up to 10 minutes late and an old file could be saved for offline use. Now a deploy shows at the next load, and the saved copy is always the current file (fix for P8-03);
- keeps the saved page fonts across deploys, in their own cache named after a hash of `data/sources/qcf2.sha256`, and replaces them only when the fonts change;
- deletes old app caches when a new version installs.

`scripts/build-site.mjs` stamps `sw.js` with a hash of the app files (`VERSION`) and a hash of `data/sources/qcf2.sha256` (`FONTS_VERSION`). In Settings, **Offline use** shows "Pages available offline: N of 604." and a button "Download all pages (about 95 MB)", which saves all 604 page fonts with progress. A page that is not saved, opened offline, shows "This page is not saved for offline use yet. Connect to the internet, or download all pages in Settings." and the page on screen stays. Offline needs https or localhost (GitHub Pages is https); without it, the Offline use section is hidden and the reader works online as before.

## Page heading (after phase 8)

Hassan asked for the surah name and the current juz at the top of each page. Pages 3 to 604 have the print's heading above the frame: the juz on the right, in words ("الجزء الثاني"), and the surah name or names on the left ("سورة البقرة"; on page 604 three names). Pages 1 and 2 have none, as in the print. The heading is always Arabic, like the print and the margin medallions, because it is part of the printed page. It uses the same system font as the medallions. It is 16 px, like the print, when the page is drawn near full size (computers). When the page is drawn small, it grows so it stays about 11 screen pixels: 11 px on 390 and 360 px phones, and 9.7 px on 320 px phones, where 21 px is the most that fits above the frame. It always ends 4 px above the frame and grows upward, so nothing on the page moves. Printed booklets keep 16 px (D77). Screen readers hear it in the interface language before the verses, for example "Surah Al-Baqarah" and "Juz 2". It is printed in booklets too.

The rule, read by BUILDER from the PDF on all 85 pages where a surah or a juz changes, and checked on every page (`pageHeading` in `src/places.js`). The simple rule "the juz and surah at the top of the page" differs from the print on 38 pages (D74):

1. The juz is the one that fills most of the page. Page 121 still shows juz 6 although juz 7 starts on line 9; page 502 already shows juz 26.
2. The surah is the one with more than half of the page's verse lines. Page 385 keeps An-Naml, 7 lines to 6. When no surah has that, the heading names every surah that begins on the page (pages 596 to 604).
3. A surah the first two steps leave out on every page is named on the page where its first verse is (the banner of some surahs sits at the bottom of the page before): Al-A'la on page 591, Al-Layl on page 595. So every surah from 2 to 114 is named on at least one page (Al-Fatiha is only on page 1, which has no heading).

The surah names come from `data/quran.json` (Tanzil metadata, checked by `validate`). Four of them differ from the print by a hamza: ابراهيم (print إبراهيم), الانسان (print الإنسان), الإنفطار (print الانفطار) and الإنشقاق (print الانشقاق). Hassan decided to keep the data's spelling (P9-01, D76), so the names match the Tanzil list everywhere on the site, with no exception to the rule against hand-editing Arabic text.

## What the browser remembers

Saved in `localStorage` under `qvo.settings` and `qvo.lastPage`: opening words, verse-end markers, margin markers, peek, zoom, theme, the view the reader picked with the view buttons, and the last page. The memorization marks are saved under `qvo.marks` (page number to `memorized` or `review`) and the bookmarks under `qvo.bookmarks` (a list of page numbers). Test mode is not saved. Opening the site with no page in the address goes to the last page. If storage is blocked, the reader works the same and just forgets (D47).

## The address

| Setting | Values                                                            | Behavior                                                                       |
| ------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `page`  | 1 to 604                                                          | Always kept up to date.                                                        |
| `view`  | `single` or `spread`                                              | Always kept up to date.                                                        |
| `n`     | 1 to 5, or `all` (shows every word; used for AUD's overlay check) | Applies to that visit only. Removed when the reader changes the words setting. |
| `lang`  | `en` or `ar`                                                      | Always kept up to date. Editing it changes the interface language at once.     |

Jumps from the Go to panel add a browser history entry, so Back returns to where you were. Page turns do not (D48).

## Checked against the print

First check, by BUILDER before the audit, on 7 pages (90 lines): word positions a median of 0 px from the print left to right (85 of 90 within 3 px), 0 to 1 px up and down. Openings did not move between `n=all` and `n=2` in 16 of 16 cases. No console errors.

After AUD's phase 3 findings, BUILDER re-measured the grid, the line width, the banners and the Bismillah lines, and separated the quarter sign (only `src/render.js` changed). On AUD's own 25 pages:

- 274 of 360 lines within 3 px of the print in both directions (205 before), and 355 within 5 px.
- The opening words moved 0 px in 108 of 108 cases between all words shown and openings only.

AUD's re-check on the same 25 pages: 97% of verse lines within 3 px, 100% within 5 px, at most 5 px. The pass rule is a median of 1 px and at least 95% of verse lines within 5 px (D41).

Pages 1 and 2, after AUD asked for a check of the round-frame pages: all 14 lines within 1.3 px of the print (baseline and both ends), surah names within 3 px, and the opening words moved 0 px in 132 of 132 cases.

## Known limits

- The print's own line spacing is uneven on some pages (up to 14 px on page 187). The reader uses one measured grid for all pages.
- Some whole pages of the print sit 4 to 5 px higher or lower than others, from the print and the scan. The reader uses one layout for all pages, which meets the pass rule (D41).
- The inner shape of the Bismillah from `QCF2BSML` differs from the print. Hassan kept this font (D44); the shape is carried to phase 6 (P3-03, D43).
- The surah banner ornament differs from the print. To be polished in phase 6 (AUD finding P3-04).
- The round frame of pages 1 and 2 and the printed frame ornaments are not drawn. The reader draws a simple double border instead.
- Four surah names (in the page heading and wherever the Arabic surah name shows) are spelled differently from the print, because the names come from Tanzil's metadata: surah 14 (data ابراهيم, print إبراهيم), 76 (data الانسان, print الإنسان), 82 (data الإنفطار, print الانفطار) and 84 (data الإنشقاق, print الانشقاق), on about 12 pages. Hassan kept the data's spelling (P9-01, D76).
- The margin medallions are simplified shapes; their labels, side and line match the print (checked by AUD on pages 5, 22, 140 and 264).
- With the margin markers on, the page is 64 px wider, so the Quran text on a phone is about 17 px instead of about 19 px Hassan kept the markers on by default on phones too (P8-02, D67); readers can switch them off for bigger text.
