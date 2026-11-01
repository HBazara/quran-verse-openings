# HANDOFF archive: Phase 3

Phase 3 (Core reader) got PASS from AUD on 2026-11-01 (re-check 2). These are the Phase 3 entries moved out of `docs/HANDOFF.md` by ORG, in the order they had in the log.

## 2026-11-01 11:40, DOCU, Phase 3 closed

- Did: Recorded AUD's Phase 3 PASS. New D43 (P3-03 and P3-04 carried to phase 6). README status: phase 4. DEVLOG: PASS and a new phase 4 section.
- Files changed: `README.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (recorded).
- Open items: phase 4 docs. Hassan's banner and Bismillah font decision (D33, D34, P3-03).

## 2026-11-01, AUD, Phase 3

- Did: Phase 3 audit. Own overlay script on 25 pages (97% within 3 px, 100% within 5 px), hidden-word pixel test (300 comparisons, 0 moved), keyboard, labels, contrast, pages 1 and 2 checked with BUILDER's mapping. Phase 3: **PASS**. P3-03 (Bismillah shape) and P3-04 (banner ornament) carried to Phase 6.
- Files changed: docs/AUDIT.md, docs/HANDOFF.md.
- Messages sent: BUILDER, ORG, DOCU (Phase 3 PASS, start Phase 4).
- Open items: Hassan: final Bismillah font, PDF publishing (P1-06), second Aud session (P1-12), push permission.

## 2026-11-01 11:15, DOCU, Phase 3

- Did: Documented BUILDER's pages 1 and 2 refit after checking `src/render.js` (`OPENING_PAGES`: 26.6 px, `lineTops` with 252.6, `ends` 7 pairs per page; `fontPagesFor`) and `src/app.js`. Updated `docs/READER.md` (draw steps, files table, geometry, results), new D42, DEVLOG. Prettier clean, no em dashes.
- Files changed: `docs/READER.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER (recorded). AUD (READER.md updated for pages 1 and 2).
- Open items: AUD's remaining phase 3 checks. P3-03, P3-04.

## 2026-11-01 01:30, ORG, Phase 3

- Did: Re-checked BUILDER's pages 1 and 2 fix (`src/render.js`, `src/app.js`, `src/styles.css`). `validate` 16 pass and 1 skip, Prettier clean, no em dashes. No dead code: the new export `fontPagesFor` is used in `app.js`, and the new `.line.fit` rule is used by `render.js`. No new files outside `tmp/`. `docs/STRUCTURE.md` unchanged.
- Files changed: `docs/HANDOFF.md`.
- Messages sent: none.
- Open items: Hassan's font decision. Keep `tmp/tools/` and `tmp/phase3/` until Phase 3 PASS.

## 2026-11-01 (BUILDER clock), BUILDER, Phase 3 (pages 1 and 2 for AUD)

- Did: AUD asked for my scan mapping and per-line measurements for pages 1 and 2 (the round frame is not drawn, so its overlay cannot align them). Measuring found three faults, now fixed. (1) The script was too big: 26.6 px, not 28, so the middle lines were about 5% too wide. (2) The print fits each line to the circle, so each line is now spread between the print's measured ink ends. (3) The print's page 2 Bismillah is the same calligraphy as page 1's verse 1:1 (checked on the scan), but the site drew the long QCF2BSML one (250 px against 158). It is now drawn with page 1's QCF2 glyphs for 1:1 from the data, so page 2 also loads page 1's font. Line 2's top is 252.6. Results: all 14 lines within 1.3 px (baseline and both ends); surah names within 3 px; openings 0 px movement in 132 of 132 cases (pages 1 and 2 included); no console errors; Prettier clean; no em dashes; validate passes.
- Files changed: `src/render.js`, `src/app.js`, `src/styles.css`. New tool `tmp/tools/opening_pages.py`; results in `tmp/phase3/` (opening-pages.json and .txt, name masks). Nothing committed.
- Messages sent: AUD (mapping: translation only, scale 1, block origin at scan (51.7, 190.0) on page 1 and (198.7, 191.3) on page 2; the per-line table; banner names; the fixes), DOCU (numbers for READER.md), ORG (files changed).
- Open items: AUD's verdict on pages 1 and 2; P3-03 Bismillah on pages 3 to 604 waits on Hassan's font decision; P3-04 banner ornament (Phase 6; on pages 1 and 2 the print's banner is a tall green panel with a central cartouche).

## 2026-11-01 10:45, DOCU, Phase 3

- Did: AUD confirmed D41 and the P3-01 and P3-02 closures and recorded them in `docs/AUDIT.md`. Kept D41 unchanged as AUD asked; added a DEVLOG line.
- Files changed: `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: none.
- Open items: AUD's remaining phase 3 checks. P3-03 (Hassan's font decision), P3-04 (phase 6).

## 2026-11-01 10:30, DOCU, Phase 3

- Did: Recorded D41 (one layout; overlay pass rule median 1 px and at least 95% of verse lines within 5 px) from BUILDER's report of AUD's acceptance. Updated `docs/READER.md` (AUD re-check 97% / 100%, known limits incl. P3-04) and DEVLOG. `docs/AUDIT.md` does not show the rule or the P3-01 and P3-02 closures yet, so D41 says "as reported by BUILDER".
- Files changed: `docs/DECISIONS.md`, `docs/READER.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (please confirm D41 and the closures in AUDIT.md). BUILDER (recorded).
- Open items: P3-03 (Hassan's Bismillah font decision), P3-04 (phase 6).

## 2026-11-01 (BUILDER clock), BUILDER, Phase 3 (AUD re-check)

- Did: Read AUD's re-check: 97% of ayah line parts within 3 px, 100% within 5 px on its 25 pages; P3-01 (line pitch) and P3-02 (hizb sign) closed. AUD accepted the rule "median 1 px and at least 95% of lines within 5 px" for ayah lines, so per-page offsets from the PDF are dropped. No code changes this turn.
- Files changed: `docs/HANDOFF.md`.
- Messages sent: AUD (ORG and DOCU already have the render.js changes; per-page offsets dropped), DOCU (AUD's accepted rule and the options, for DECISIONS).
- Open items: P3-03 Bismillah shape waits on Hassan's font decision (then I tell AUD which font is final); P3-04 banner ornament is Phase 6; AUD is still checking pages 1 and 2, the spread, keyboard, labels, contrast and READER.md.

## 2026-11-01 10:00, DOCU, Phase 3

- Did: Documented BUILDER's new geometry after AUD's findings. Checked the numbers in `src/render.js` (grid 5.94 + i x 52.653, lines 471.8 from 15.6, banner 481 printed / 486 glyph box with dy 4, 3.5, -2.5, Bismillah dy -6 and 1, quarter sign split into its own span with the word's visibility). Updated `docs/READER.md`, D36, new D40, DEVLOG. Prettier clean, no em dashes.
- Files changed: `docs/READER.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER (recorded). AUD (READER.md updated).
- Open items: Hassan's banner and Bismillah font decision. AUD's answer on the page-level 4 to 5 px offsets.

## 2026-11-01 01:10, ORG, Phase 3

- Did: Re-checked after BUILDER's fix round (`src/render.js` only). `validate` 16 pass and 1 skip, Prettier clean, no em dashes, no unused exports or functions in `render.js`. New `docs/READER.md` (DOCU) is covered by the `docs/` line, so `docs/STRUCTURE.md` is unchanged. Keep `tmp/tools/` and `tmp/phase3/` until Phase 3 PASS.
- Files changed: `docs/HANDOFF.md`.
- Messages sent: none.
- Open items: Hassan's font decision (banner and Bismillah). Push waits on it.

## 2026-11-01 (BUILDER clock), BUILDER, Phase 3 (fixes for AUD's overlay findings 1, 2 and 4)

- Did: Fixed AUD finding 1 (vertical pitch): the print's lines are 52.653 px apart starting 5.94 px into the block, not 799/15 (fitted on 423 lines of 32 pages); every line now uses that grid. Fixed finding 2 (hizb sign): the print sets the quarter sign (۞) apart with a full word space, but in the V2 glyph data it is the first glyph of its word; the renderer now gives it its own place in the line (all 199 cases checked: the text starts with the sign and the first glyph is the sign's shape; the data is unchanged, no space in the raw QUL 61 text either). Finding 4 (banner position): banners now 481 px wide like the print and placed by measurement on all 112 banners (4 px below the grid on the first line, 3.5 px elsewhere, 2.5 px above it on the last line). Finding 3 (Bismillah): moved by measurement on all 111 Bismillah lines (6 px up on the first line, 1 px down elsewhere); both ends now match the print at the median; the inner shape differs because the QCF2BSML glyph stretches only بسم, while the print stretches بسم and الرحيم (checked every glyph in QCF2BSML and the page fonts: none matches). That part waits on Hassan's font decision. Also widened justified lines by 2.8 px (left 15.6, width 471.8; fitted on 442 lines).
- Results on AUD's 25 pages (360 ayah lines, my own measure): both directions within 3 px went from 205 to 274 lines; within 5 px from 313 to 355. Left-right 95th percentile 3 px. What remains is mostly whole pages that sit 4 to 5 px higher or lower in the print (pages 18, 270, 325, 520, 555) and the print's uneven hand spacing; one layout for all pages cannot follow that. Openings: 0 pixels of movement in 108 of 108 cases (9 pages, n = 1 to 3 against all, 1400 and 390 px, both views). No console errors. Prettier clean, no em dashes, validate 16 pass + 1 skip.
- Files changed: `src/render.js` only. New test tools in `tmp/tools/` (serve_route.py: serves the files to headless Chrome without a server process; overlay2.py, frame_lines.py, ink_runs.py, line_compare.py, movement_check.py); results in `tmp/phase3/`. Nothing committed.
- Messages sent: AUD (fixes and numbers, re-check please), ORG and DOCU (render.js geometry changed; new numbers for docs/READER.md).
- Open items: AUD re-check; Bismillah shape waits on Hassan's font decision; whole-page shifts of 4 to 5 px stay unless Hassan wants per-page offsets measured from the PDF (would raise lines within 3 px to about 89%).

## 2026-11-01 09:00, DOCU, Phase 3

- Did: Documented the core reader. Read `index.html` and all of `src/` and matched them to BUILDER's report (default view by 900 px width, `visibility: hidden` for non-openings, 220 ms slide skipped on reduced motion, no fallback font, address settings). Checked `en.json` and `ar.json`: same 10 keys, none empty. New `docs/READER.md`. `docs/USER-GUIDE.md` now covers what works (EN and AR). `README.md`: status, how to open the reader with a static server, folders, docs list. D36 to D39. DEVLOG. Prettier clean, no em dashes.
- Files changed: `README.md`, `docs/READER.md` (new), `docs/USER-GUIDE.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER (recorded; `lang` in the address is only read on load). ORG (new `docs/READER.md`). AUD (phase 3 docs ready). Also recorded ORG's phase 3 tidy in DEVLOG.
- Open items: none for DOCU until ORG's phase 3 tidy or AUD's findings.

## 2026-11-01 00:30, ORG, Phase 3

- Did: Tidy pass after BUILDER's Phase 3 build. `validate` 16 pass and 1 skip, `--full` 20 pass. Prettier clean, no em dashes in text files. `en.json` and `ar.json`: same 10 keys, no empty values, every key used. No dead code in `src/` (all exports imported, no unused functions). Site load test: served the repo under `/quran-verse-openings/` (as GitHub Pages will) and fetched index.html, all src files, both string files, `data/quran.json` and fonts, including the two CSS font URLs: all 200. Removed `src/i18n/.gitkeep`. `docs/STRUCTURE.md`: index.html, the src files, `tmp/phase3/`, and the Bismillah font in SHA256SUMS. Validate passes again after the changes. Nothing committed.
- Files changed: `src/i18n/.gitkeep` (removed), `docs/STRUCTURE.md`, `docs/HANDOFF.md`.
- Messages sent: DOCU and AUD (tidy done), BUILDER (heads-up on the font question).
- Open items: Hassan is deciding whether to replace the banner and Bismillah fonts ("All rights reserved") with the openly licensed KFGQPC Uthmanic Hafs font. Push waits on that. Keep `tmp/phase3/` until Phase 3 PASS.

## 2026-11-01 (BUILDER clock), BUILDER, Phase 3 (built, handed to ORG, DOCU and AUD)

- Did: Hassan allowed the test server restart. Nudged text lines 1 px right and 1 px down (from the overlay check). Fixed a fitting bug: the page was fitted while the loading line was still visible and not re-fitted after; now a ResizeObserver re-fits on any size change. Final checks: overlay on 7 pages (90 lines) left-right median 0 px (85 within 3 px), up-down 0 to 1 px on typical pages (pages 187 and 255: the print's uneven spacing); openings moved 0 pixels between `n=all` and `n=2` in 16 of 16 cases (1400 px and 390 px, one page and spread); phone defaults to one page, no sideways scroll; page turns, ends (1 and 604) and spread order correct; tab order and labels fine; no console errors; Prettier clean; no em dashes; en and ar have the same 10 keys.
- Files changed: `src/render.js`, `src/app.js`, `index.html` (empty favicon, so no 404); test tools `tmp/tools/overlay_check.py`, `tmp/tools/reader_checks.py`, results in `tmp/phase3/` (ignored). Nothing committed.
- Messages sent: ORG (Phase 3 built, tidy), DOCU (run steps, features, geometry, checks, limits), AUD (ready for the 25-page overlay check, with how to run it).
- Open items: ORG tidy, DOCU docs, AUD overlay check and PASS, then ORG commits. Known limits for later: uneven print line spacing on some pages; frame ornaments and the round frame of pages 1 and 2 not drawn (Phase 6 polish).

## 2026-11-01 00:10 (BUILDER clock), BUILDER, Phase 3 (in progress, paused)

- Did: Hassan approved the banner font (D33) and chose KFGQPC's Bismillah font (D34). Got QCF2BSML.ttf from the nuqayah/qpc-fonts mirror (KFGQPC's own URL is 404), placed it in `assets/fonts/bismillah/`; its glyph U+FC21 matches the printed Bismillah. Added `surahs[].banner` to `data/quran.json` (from QUL's ligatures.json) and 3 validate checks (default 16 PASS + 1 SKIP, `--full` 20 PASS). Scripts now write Arabic characters as code points (rebuild was byte-identical). Built the reader: `index.html`, `src/app.js`, `src/render.js`, `src/fonts.js`, `src/i18n.js`, `src/styles.css`, `src/i18n/en.json` and `ar.json` (same 10 keys). It shows whole pages in the QCF2 page fonts with non-opening words hidden (`visibility: hidden`), banners, Bismillah lines, page numbers, one page and spread views (odd page on the right), Next on the left, a short slide that respects reduced motion. Address: `#page=`, `n=1..5|all`, `view=`, `lang=`. First overlay check against the print on 7 pages (90 lines): horizontal median +1 px (79 lines within 3 px), vertical median +3 px (68 within 5 px; pages 187 and 255 are the print's uneven line spacing).
- Files changed: the reader files above, `scripts/build-data.mjs`, `scripts/validate.mjs`, `scripts/lib/sources.mjs`, `data/quran.json`, `data/quran.json.sha256`, `data/sources/SHA256SUMS` (8 lines), `assets/fonts/bismillah/QCF2BSML.ttf`; work files in `tmp/phase3/`, `tmp/tools/overlay_check.py` (ignored). Nothing committed (ORG commits after AUD's PASS).
- Messages sent: DOCU and AUD (Hassan's font answers; QCF2BSML details; data and check changes), ORG (Bismillah font placed).
- Open items (resume here): the local test server was stopped by Claude Code because the computer ran low on memory; restart only with Hassan's OK. Then: correct the small vertical offset (about 3 px) and re-run `tmp/tools/overlay_check.py`; check phone width, one-page view, that openings do not move between `n=all` and `n=2`, keyboard focus, no console errors; then hand Phase 3 to ORG and DOCU, and to AUD for the overlay check.

## 2026-11-01 00:05, DOCU, Phase 3

- Did: Documented BUILDER's `surahs[].banner` field and the 3 new validate checks. Ran validate (16 pass, 1 skip) and `--full` (20 pass); checked the field (114 distinct characters, U+FC45 to U+FBEB). Rewrote both check lists in `docs/DATA-FORMAT.md` in the order validate prints them, updated the last run and hash (`ffa4dded...`, newer than commit `99a16e3`). Updated `docs/DATA-SOURCES.md` (ligatures.json use), the check numbers in `docs/TEXT-CROSSCHECK.md` (now 15 and 16) and README counts. Prettier clean, no em dashes.
- Files changed: `README.md`, `docs/DATA-FORMAT.md`, `docs/DATA-SOURCES.md`, `docs/TEXT-CROSSCHECK.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER (recorded).
- Open items: the reader (`index.html`, `src/`) when BUILDER finishes phase 3.

## 2026-10-31 23:50, DOCU, Phase 3

- Did: Recorded the first commit `99a16e3` and the repo https://github.com/HBazara/quran-verse-openings (not pushed). Checked the commit tracks no PDF, `.db` or `tmp/` files. README: clone command and repo link. DECISIONS: D14 repo URL, new D35 (first commit). DEVLOG updated. Left the author email out of the docs. Noticed uncommitted phase 3 work by BUILDER: `data/quran.json` and the scripts changed, validate now 16 pass 1 skip, so `docs/DATA-FORMAT.md` (14 checks, old hash) is out of date until BUILDER's phase 3 report.
- Files changed: `README.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER (send the phase 3 data and check changes when done).
- Open items: phase 3 docs, including the new validate checks.

## 2026-10-31 23:30, ORG, Phase 3

- Did: AUD closed P1-05. Push gate agreed with AUD: no push until (1) Hassan says so and (2) AUD confirms the Bismillah font's source URL, licence and SHA-256 are documented (BUILDER and DOCU).
- Files changed: `docs/HANDOFF.md`.
- Messages sent: AUD (ack).
- Open items: the push gate above.

## 2026-10-31 23:20, ORG, Phase 3

- Did: P1-05: first commit `99a16e3` (641 files) with Hassan's approval, author Hassan <hassan.abazara@gmail.com> (set for this repo only; the global git identity is the business one). Committed only the staged snapshot that passed `validate` (14 pass, 1 skip), checked in a clean temp copy. BUILDER's newer Phase 3 edits to scripts and data are NOT in it. No PDF, .db or tmp/ files. Created the public repo `HBazara/quran-verse-openings` (Hassan's personal account) and added it as `origin`. Not pushed yet. `docs/STRUCTURE.md`: bismillah/ now lists `QCF2BSML.ttf`.
- Files changed: git history, `docs/STRUCTURE.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER, DOCU, AUD (first commit and repo).
- Open items: Push waits for Hassan's go-ahead. Nobody commits or pushes except through ORG with Hassan's approval.

## 2026-10-31 23:35, DOCU, Phase 3

- Did: Clarified D34 per BUILDER: `QCF_BSML` (V1) and `QCF2BSML` (V2) are two versions of KFGQPC's Bismillah font; "QCF_BSML" was the family name given to Hassan, and QCF2BSML is the one that matches this print. BUILDER confirmed the name-record note.
- Files changed: `docs/DECISIONS.md`, `docs/HANDOFF.md`.
- Messages sent: none.
- Open items: Hassan's confirmation of QCF2BSML (BUILDER is telling him). Phase 3 reader docs.

## 2026-10-31 23:30, DOCU, Phase 3

- Did: Documented the Bismillah font `QCF2BSML.ttf` (D34). Verified SHA-256 (matches `tmp/downloads/bismillah/` and `data/sources/SHA256SUMS`, 8 lines), name records and the U+FC21 glyph; validate 14 pass 1 skip. `docs/DATA-SOURCES.md` font table, D34 (notes QCF2BSML instead of the QCF_BSML name Hassan was given), D29 and `docs/DATA-FORMAT.md` now say 8 files, README credit added, new `docs/checksums/bismillah.sha256`. Name record 4 reads "QCF2BSML" (BUILDER reported "KFC QCF2BSML Regular"); docs use what the file says.
- Files changed: `README.md`, `docs/DATA-SOURCES.md`, `docs/DATA-FORMAT.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`, `docs/checksums/bismillah.sha256` (new).
- Messages sent: BUILDER (recorded). ORG (new checksum list; keep `tmp/downloads/bismillah/` per D28).
- Open items: Hassan to confirm QCF2BSML instead of QCF_BSML. Phase 3 reader docs.

## 2026-10-31 23:15, DOCU, Phase 3

- Did: Recorded Hassan's answers relayed by BUILDER: D33 approved (banner font, credit KFGQPC and QUL), D34 option 1 (`QCF_BSML` from KFGQPC or `nuqayah/qpc-fonts`, not downloaded yet). Checked `data/sources/SHA256SUMS` (7 lines, Tanzil OK, validate 14 pass 1 skip) and updated the "5 sources" wording in `docs/DATA-FORMAT.md`, `docs/DATA-SOURCES.md` and D29. README credit updated.
- Files changed: `README.md`, `docs/DATA-FORMAT.md`, `docs/DATA-SOURCES.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER (recorded; send QCF_BSML details). ORG (`docs/STRUCTURE.md` line 15 still says "all 5 sources").
- Open items: `QCF_BSML` URL, version, license and SHA-256 from BUILDER.

## 2026-10-31 22:55, ORG, Phase 3

- Did: `docs/STRUCTURE.md`: the `data/sources/` line no longer says "5 sources" (SHA256SUMS now lists 7: 2 Tanzil, 3 QUL databases, banner font, ligatures.json), and added `assets/fonts/bismillah/` as planned. Hassan approved the banner font (D33) and picked QCF_BSML for the Bismillah (D34), relayed by DOCU.
- Files changed: `docs/STRUCTURE.md`, `docs/HANDOFF.md`.
- Messages sent: DOCU (fixed).
- Open items: When QCF_BSML is downloaded, place it in `assets/fonts/bismillah/` with its original name, and add its checksum.

## 2026-10-31 23:00, DOCU, Phase 3

- Did: Documented the fonts ORG added. Checked all 604 `assets/fonts/qcf2/*.woff2` against `docs/checksums/qul-fonts-v2.sha256` (604 OK) and the banner font hash (matches ORG's). Read the banner font name records with `tmp/venv`: "King Fahad Complex, All rights reserved." (QUL lists no copyright). New `docs/checksums/qul-surah-header.sha256`. `docs/DATA-SOURCES.md`: "Fonts in the repo" section. `docs/DECISIONS.md`: D33 (banner font license, pending Hassan), D34 (Bismillah font, pending Hassan). README and DEVLOG updated. Prettier clean, no em dashes.
- Files changed: `README.md`, `docs/DATA-SOURCES.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`, `docs/checksums/qul-surah-header.sha256` (new).
- Messages sent: ORG (recorded; banner font needs Hassan's decision). BUILDER (FYI D33 and D34).
- Open items: Hassan: D33 and D34. Phase 3 docs when the reader is built.

## 2026-10-31 22:40, ORG, Phase 3

- Did: Placed the Phase 3 fonts at BUILDER's request. Copied the 604 page fonts to `assets/fonts/qcf2/` (p1.woff2 to p604.woff2) and the banner font to `assets/fonts/surah-header/QCF_SurahHeader_COLOR-Regular.woff2`, with original names. Verified all 604 page fonts against `docs/checksums/qul-fonts-v2.sha256` (all match) and the banner font byte for byte against `tmp/downloads/qul/x/surah-header/`. Banner font SHA-256: 46bd0a3672870743bbfef161d352731423e5e53e9b45eee6a4f0fdeba69ff6dd. Removed `assets/fonts/.gitkeep`. Total 95 MB, largest file under 1 MB. `.woff2` is binary in `.gitattributes`, and Prettier skips `assets/fonts/`. `ligatures.json` was not copied (build-data takes the 114 characters into `data/quran.json`).
- Files changed: `assets/fonts/qcf2/` (604 new), `assets/fonts/surah-header/` (1 new), `assets/fonts/.gitkeep` (removed), `docs/STRUCTURE.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER (done, Bismillah folder), DOCU (fonts placed, banner font licence), AUD (FYI).
- Open items: Bismillah font (QCF_BSML) waits on Hassan. If approved, it goes in `assets/fonts/bismillah/`. BUILDER adds the banner font to `data/sources/SHA256SUMS`.

## 2026-10-31 22:45 (BUILDER clock), BUILDER, Phase 3 (starting)

- Did: After AUD's Phase 2 PASS: did P2-05 (references now point to `docs/TEXT-CROSSCHECK.md`). Found and fixed a data error raised by DOCU's question: quarter 106 was 15:50 (Tanzil), the print has the hizb sign at 15:49 (page 264, margin "ربع الحزب ٢٧"). build-data now takes quarter starts from the print's hizb signs plus surah starts, Tanzil only as a cross-check; new validate check enforces it (default 14 PASS + 1 SKIP, `--full` 17 PASS). Phase 3 prep: inspected the surah banner font Hassan downloaded (QUL 458, KFGQPC QCF_SurahHeader_COLOR, draws each whole banner as one colour glyph). Found that no font we have draws the printed standalone Bismillah; it needs KFGQPC's QCF_BSML (not on QUL).
- Files changed: `scripts/build-data.mjs`, `scripts/validate.mjs`, `scripts/lib/sources.mjs`, `data/quran.json`, `data/quran.json.sha256`, `data/tanzil-differences.json` (note only), `docs/HANDOFF.md`; `tmp/downloads/qul/x/surah-header/` (extracted, ignored).
- Messages sent: AUD (P2-05 done, quarter fix, please re-check), ORG (rebuilt; Phase 3 font placement request), DOCU (quarter rule, new check).
- Open items: Hassan: OK for the banner font (KFGQPC, no published licence, like the page fonts) and a source for the QCF_BSML Bismillah font. ORG: font folders. Then the Phase 3 renderer.

## 2026-10-31 22:40, DOCU, Phase 3 (late phase 2 change)

- Did: Documented BUILDER's quarter fix (15:49 from the print, not Tanzil's 15:50) and the new validate check. Read the new code in `scripts/build-data.mjs` and `scripts/validate.mjs`, re-ran validate (14 pass, 1 skip) and `--full` (17 pass). Confirmed P2-05 references now point to `docs/TEXT-CROSSCHECK.md`. Updated `docs/DATA-FORMAT.md`, D26, `docs/DATA-SOURCES.md`, `docs/TEXT-CROSSCHECK.md`, `README.md`, `docs/DEVLOG.md`. Prettier clean, no em dashes.
- Files changed: `README.md`, `docs/DATA-FORMAT.md`, `docs/DATA-SOURCES.md`, `docs/DECISIONS.md`, `docs/TEXT-CROSSCHECK.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (late change documented). BUILDER and ORG (done, check name taken from the validate output).
- Open items: phase 3 docs.

## 2026-10-31 22:10, DOCU, Phase 3

- Did: Recorded ORG's phase 2 close-out (handoff archive, no `tmp/` cleanup) in `docs/DEVLOG.md`. Checked my 22:05 entry is in `docs/handoff-archive/phase-2.md`.
- Files changed: `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: none.
- Open items: phase 3 docs when BUILDER and ORG finish. BUILDER's P2-05 repoint.
