# Project: Quran Verse Openings (memorization mushaf)

## What we are building

A static website, published on GitHub Pages, that shows the Quran page by page like a printed mushaf, but each verse shows **only its opening words** (رؤوس الآيات), not the full verse. The purpose is memorization review: the reader sees the start of each verse and recites the rest from memory.

**The opening words must sit in the exact same position they have on the printed page:** same page, same line, same spot along the line. The rest of the verse is empty space, so the page keeps the shape the reader memorized. This is the core requirement of the whole project.

The project folder contains a PDF copy of the Quran: `standard1-quran.pdf`. It is the reference for which mushaf edition and page layout we follow.

## Decisions (confirmed by Hassan)

- Edition and page layout: match the PDF. Confirmed in phase 1: the King Fahd Complex (KFGQPC) Madinah mushaf, Hafs, 1421H print, 604 pages, 15 lines (mushaf page = PDF page minus 3).
- Opening words per verse: default 2, adjustable by the reader from 1 to 5.
- Layout: every page has the same lines as the print (15 lines on the Madani mushaf, 8 lines inside the round frame on pages 1 and 2), with the same line breaks, centered lines and surah header lines.
- Verses that cross a page break: the opening shows where it starts in the print. The continuation on the next page stays blank.
- Verses shorter than the chosen word count: show the whole verse.
- Verse-end markers ﴿١٢﴾: shown by default in their printed spot, so the reader can see where each verse ends. The reader can hide them.
- Interface language: **English and Arabic**, the reader picks (see feature 11). Only the interface changes language. The Quran pages are always Arabic.
- Repo name: `quran-verse-openings`.
- Stack: plain HTML, CSS and vanilla JavaScript (ES modules). No framework, no backend, no runtime API calls. The site must work offline once loaded.

## Rule 1: the Quran text must be exact

This is Quran text. There is zero tolerance for errors in any letter, diacritic or verse number.

1. **Do not extract the Arabic text from the PDF** as the source of truth. Arabic PDFs often have broken glyph encoding, reversed character order and missing diacritics. Use a verified source that has **word-level line layout**, because we need every word's page and line:
   - Preferred: QUL, the Quranic Universal Library (qul.tarteel.ai). Download matching pieces: the mushaf layout database for our edition (each page's lines, line type, centered or justified, first and last word id), the word-by-word script that layout uses, the font that layout was built for, and a word-by-word Unicode text for the same words. Confirmed in phase 1 and picked by Hassan: the KFGQPC V2 layout, 1421H print (QUL mushaf-layout 10, 604 pages, 15 lines), drawn with the QPC V2 page fonts (QCF2, QUL font 249) and the V2 glyph script (QUL quran-script 61). The Unicode text is the KFGQPC Hafs script, word by word (QUL quran-script 312). The `qpc-hafs` font was not picked, because it moves words inside the line. Read QUL's terms and credit them.
   - Alternative: the Quran Foundation API, whose words come with `page_number` and `line_number`. It needs an API key, so stop and ask Hassan before using it.
   - Cross-check: compare the full text of every verse against Tanzil's Uthmani Hafs text (tanzil.net) and report any difference.
   - Before building the renderer, check whether an existing open-source library already renders Madani pages with selected words hidden in place, and report its license to Hassan.
2. **Use the PDF only to confirm the edition and layout.** Count its pages and render sample pages to images. Spot-check at least 25 pages spread across the book, including page 1, page 2, the last page, and pages where a surah starts in the middle of the page. For each sample page, check the number of lines and that the first and last word of every line match the print.
3. If the PDF's edition does not match the data source's page map (for example IndoPak or Warsh), **stop and report to Hassan** before building anything else.
4. Opening words are produced by code, by splitting the verified text on word boundaries. Never retype or hand-edit Arabic text. The V2 glyph script only says how to draw each word (glyph codes for the page font). The verified text for opening words, word splitting and all text checks is the Unicode text (QUL 312), matched to the glyph words by verse and word position.
5. Word splitting rules (applied to the Unicode text):
   - Keep all diacritics and Uthmani symbols attached to their word.
   - Pause marks (waqf signs) are not words. If a source token is only annotation marks, attach it to the previous word.
   - Disjointed letters (for example الٓمٓ) count as one word.
   - The Bismillah is not part of verse 1 for any surah except Al-Fatiha. If the source prefixes it to verse 1, strip it before taking opening words, and render it as its own line under the surah header instead. At-Tawbah has no Bismillah.
6. Do **not** commit the PDF to the repo. Add it to `.gitignore`. Hassan will decide later whether it can be published.
7. Do **not** commit the raw QUL databases (layout and word scripts) to the repo. Only the data generated from them (`data/quran.json`) and the fonts the site needs are committed. Credit QUL in `README.md`.

## Features: version 1

1. **Mushaf pages in the printed layout.** How to render a page:
   - Lay out the **whole page** from the layout data: every line, every word, in the matching font, centered or justified exactly as the layout says.
   - Then make every word that is not an opening word invisible with `visibility: hidden` (not `display: none`), so it still takes up its space and every visible word stays in its printed position.
   - Opening words = the first N words of each verse (N from settings). Changing N only changes which words are visible. The layout never reflows.
   - Verse-end markers stay visible unless the reader hides them.
   - Page number at the bottom.
   - Never rebuild lines by wrapping text in the browser. Lines come only from the layout data.
2. **Surah headers.** A decorated banner with the surah name on the header line where the layout puts it, plus the Bismillah line (except At-Tawbah). Both are always visible.
3. **View toggle: one page or two-page spread.**
   - Spread follows a real mushaf: odd page on the right, even page on the left (page 1 right, page 2 left).
   - "Next" moves toward the left, because Arabic books read right to left.
   - Page turns use a short slide animation. Respect `prefers-reduced-motion`.
   - On narrow screens default to one page, but let the reader switch.
4. **Jump to page.** A page number input with validation (1 to last page).
5. **Jump to surah and juz.** Two dropdowns that go to the page where each one starts.
6. **Navigation.** Prev and next buttons, keyboard arrows (left arrow = next page), swipe on touch screens.
7. **Shareable URLs.** The current page lives in the URL (for example `#page=45`), so refresh and links keep the place.
8. **Settings, saved in the browser.** Words per verse (1 to 5), zoom (scales the whole page evenly, never reflows it), theme (light, dark, sepia), show or hide verse-end markers. Remember the last page opened. Wrap every `localStorage` read and write in try/catch and work fine without it.
9. **Arabic typography.** `dir="rtl"` and `lang="ar"` on Quran content. Use **the exact font the layout data was built for** and self-host it. A different font changes word widths and breaks the positions. No fallback font for Quran text. Check that every symbol renders and nothing shows as a box.
10. **Works on phone and desktop.** The page keeps its printed proportions and scales down as one unit to fit the screen. No horizontal scrolling at phone width.
11. **English and Arabic interface.**
   - Every time the reader opens the site, a simple screen asks them to choose English or Arabic before the mushaf shows. Show the two options as "English" and "العربية", each in its own language. Highlight the language they picked last time so one tap continues.
   - A language switch is also in the header, so they can change it any time without reloading.
   - Arabic interface: the whole layout flips to right to left (`dir="rtl"` on the page), Arabic labels, Arabic-Indic numerals for page numbers and inputs. English interface: left to right, English labels, surah names shown as "Al-Baqarah البقرة".
   - All interface text lives in one strings file per language (`src/i18n/en.json`, `src/i18n/ar.json`) with the same keys. No hard-coded interface text in HTML or JS.
   - The jump to page input accepts both Western (45) and Arabic-Indic (٤٥) digits.

## Features: version 2 (all approved by Hassan, build after version 1 passes)

- Peek mode: tap a verse to reveal its hidden words in place for a few seconds, for self-checking.
- Test mode: hide everything on the page and reveal openings one at a time.
- Memorization tracker: mark pages as memorized or needs review, shown as a colored grid on the jump screen.
- Bookmarks.
- Juz, hizb and quarter markers in the page margin.
- Print-ready booklet: print stylesheet that lays out pages for printing and binding.
- Installable offline app (PWA).
- Search by surah name in English or Arabic.

Every version 2 feature must work in both interface languages, in both view modes, and must never move the opening words from their printed positions.

## Project structure

```
/
├─ index.html
├─ src/            app code (js, css)
├─ assets/fonts/   self-hosted fonts
├─ data/           generated quran.json (committed)
├─ scripts/        build-data and validate scripts
├─ docs/           all documentation, including HANDOFF.md
├─ AGENTS.md       the four roles below, so every agent and new chat follows them
├─ README.md
└─ .github/workflows/deploy.yml
```

## The team: four agents

There are four roles, each run as its own Claude Code session that messages the others directly (see "How agents keep each other updated"). Each role stays in its own lane.

### BUILDER: builds the product
- Owns `src/`, `scripts/`, `data/`, `index.html` and the deploy workflow.
- Writes `scripts/build-data` to turn the verified sources into `data/quran.json`: for every page, its lines in order (line type, centered or justified, surah number for header lines), and for every word its text, verse key, position in the verse and whether it is a verse-end marker. Plus surah, juz and hizb start pages.
- Writes `scripts/validate` (see the audit checks below) and makes it run in GitHub Actions before every deploy. A failed check blocks the deploy.
- Builds features in the phase order below. Does not write docs or reorganize files beyond what the feature needs.

### DOCU: documents the whole process
- Owns `README.md` and `docs/`. Does not change code.
- `README.md`: what the site is, how to run it locally, how to deploy, credits for the text source and font.
- `docs/DEVLOG.md`: a dated log of every step, which agent did it, and why.
- `docs/DECISIONS.md`: every decision, the options considered, what was picked and why.
- `docs/DATA-SOURCES.md`: exact source, version or download date, license, and a checksum of the source files.
- `docs/USER-GUIDE.md`: a short plain-language guide to using the site, in English and Arabic.
- Updates the docs at the end of every phase so they match the code exactly.

### ORG: organizes the code and files
- Owns the folder layout, file naming, `AGENTS.md`, `.gitignore`, `.editorconfig` and formatter config (Prettier).
- Creates `AGENTS.md` first, containing the four role sections from this prompt.
- After each phase: moves misplaced files, removes dead code, temp files and unused assets, keeps names consistent, and keeps `docs/STRUCTURE.md` (the file tree with one line per folder) current.
- Never changes behavior. Re-runs `scripts/validate` and checks the site still loads after any move or rename.

### AUD: audits everyone else's work
- Read-only on code and docs. Writes only `docs/AUDIT.md`: a table of findings with severity (blocker, major, minor), file, issue, owner role, and status.
- Must sign off each phase with "PASS" before the next phase starts. Any blocker goes back to its owner, then AUD re-checks.
- Checks every phase:
  - **Text integrity (automated, in `scripts/validate`):** 114 surahs, 6,236 verses, every page from 1 to the last page present, every verse appears exactly once and in order, every stored opening is exactly equal to the first N word tokens of the source verse for N = 1 to 5, no Bismillah counted inside verse 1 (except Al-Fatiha), no stray Latin characters or empty openings.
  - **Layout data (automated):** every page has the expected number of lines, every word id from first to last appears on exactly one line, no gaps or overlaps between lines.
  - **Positions match the print:** on 25 pages chosen independently from BUILDER's sample, screenshot the site with all words visible and overlay it on the PDF page image. Then hide the non-opening words and confirm the openings did not move by a single pixel. Check at both phone and desktop width, and in both view modes.
  - **Consistency:** docs match the code, `AGENTS.md` matches this prompt, `docs/STRUCTURE.md` matches the real tree, ORG's changes broke nothing.
  - **Features:** each feature meets its description above on desktop and phone width, in both view modes, in light and dark theme, and in both interface languages.
  - **Translations:** `en.json` and `ar.json` have exactly the same keys, no empty values, and no interface text outside them.
  - **Quality:** no console errors, keyboard navigation works, buttons have labels, readable contrast.
  - **Writing rule:** no em dashes anywhere in docs, UI text or comments.

## How agents keep each other updated

The four agents run as separate Claude Code sessions named exactly `BUILDER`, `ORG`, `DOCU` and `AUD`, and they **message each other directly by name** with SendMessage (Claude Code cross-session messaging). Use ListAgents to find the others. Hassan coordinates the team.

### Who messages whom

1. **BUILDER finishes a phase** and messages `ORG` and `DOCU`: which phase, what was built, which files changed, anything they should watch for. ORG starts right away. DOCU can start reading.
2. **ORG finishes tidying** and messages `DOCU` and `AUD`: what it moved, renamed or removed, and that `scripts/validate` still passes.
3. **DOCU finishes the docs** and messages `AUD`: which docs changed, and that the phase is ready to audit.
4. **AUD finds a problem** and messages the owner directly, one message per owner: what is wrong, the file, the severity, and what "fixed" looks like. For example: "BUILDER: page 50 line 7 is centered but the print is justified. File src/render.js. Blocker. Fix it and message me back."
5. **The owner fixes it** and messages `AUD` back: what changed and where. If the fix changes files or behavior, the owner also messages `ORG` and `DOCU` so they can update their parts. AUD re-checks.
6. **AUD gives PASS** and messages the other three agents: "Phase X PASS, BUILDER start Phase Y." AUD then gives Hassan the phase summary in its own chat.

### Rules for messages

- **Stay in your lane.** If you find a problem in someone else's files, never fix it yourself. Message the owner.
- **Anyone can message anyone** to ask a question, flag a risk, or warn that something they are about to change affects another role. For example, BUILDER warns DOCU before renaming a setting, or DOCU asks BUILDER how a feature should be described.
- **Keep messages short and specific:** phase, file, what happened, what you need.
- **Questions for Hassan:** ask him in your own chat, then message his answer to every agent it affects.
- **Reply when you get a message that needs action.** If you disagree with an AUD finding, message AUD with the reason. Do not ignore it.
- **Never wait silently.** If you are blocked, message whoever is blocking you and tell Hassan.

### The written log

Messages disappear when the session ends, so every teammate also keeps a short written record in **`docs/HANDOFF.md`**:

- After each turn, add an entry at the top: date and time, role, phase, what you did, files changed, messages you sent and to whom, open items.
- Read it before starting work, especially after the session was restarted. It is how a new team picks up where the old one stopped.
- ORG creates the file in Phase 1. When a phase gets PASS, ORG moves its entries to `docs/handoff-archive/phase-X.md`.
- Every teammate may write to `docs/HANDOFF.md`, even though DOCU owns the rest of `docs/`.

### If messaging is not available

If ListAgents does not show the other agents, or a message fails to send, write the message as an entry in `docs/HANDOFF.md` addressed to the receiving role (for example "@BUILDER: ..."), and tell Hassan which agent to open next.

## Phases

Each phase runs: BUILDER builds, then ORG tidies, then DOCU documents, then AUD audits. Each one messages the next teammates when it finishes, as described above. Fix and re-audit until AUD gives PASS.

1. **Setup and data check.** ORG sets up the structure and `AGENTS.md`. BUILDER identifies the PDF edition, finds the matching layout data and font, and confirms the line layout against the PDF. Stop and report to Hassan with the findings before continuing.
2. **Data pipeline.** `build-data`, `validate`, `data/quran.json`.
3. **Core reader.** Full-page layout rendering with hidden words, surah headers, one page and spread views, prev and next. AUD's position overlay check must pass here before anything else is built on top.
4. **Navigation and settings.** Jump to page, surah and juz, URL state, keyboard, swipe, settings, last page memory.
5. **Languages.** Language picker on entry, header switch, English and Arabic strings, right to left interface.
6. **Polish and deploy.** Typography, themes, mobile layout, GitHub Pages deploy through Actions. Version 1 is live after this phase.
7. **Version 2, part A: memorization tools.** Peek mode, test mode, memorization tracker, bookmarks.
8. **Version 2, part B: extras.** Juz, hizb and quarter markers, print-ready booklet, installable offline app, surah search.

At the end of every phase, give Hassan a short summary: what was done, what AUD found, and anything he needs to decide. Keep it short and plain.

## Writing rules for all agents

- Never use em dashes in any writing (docs, UI text, comments, commit messages).
- Plain, simple English in docs and UI.
