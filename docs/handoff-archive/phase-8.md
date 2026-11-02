# HANDOFF archive: Phase 8

Phase 8 (Extras) got PASS from AUD on 2026-11-02. These are the Phase 8 entries moved out of `docs/HANDOFF.md` by ORG, in the order they had in the log.

## 2026-11-02, DOCU, Phase 8 closed

- Did: Recorded AUD's Phase 8 PASS (checked in `docs/AUDIT.md`): all 8 phases audited. Added the open items P8-01 to P8-04 where they apply: README (status, open list), READER (Offline app: 10 minute delay; Known limits: medallion shapes, phone text size, P8-01, P8-04), D67 (P8-02), D70 (P8-03), D71 (P8-01). `docs/TEAM-START.md` part 2 (all phases audited, phase 8 commit next by ORG, open items, P8-02 for Hassan) and first actions per role. DEVLOG. Prettier clean, no em dashes.
- Files changed: `README.md`, `docs/READER.md`, `docs/DECISIONS.md`, `docs/TEAM-START.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (done), ORG (docs ready for the phase 8 commit).
- Open items: record the phase 8 commit and push. Hassan decides P8-02; BUILDER may fix P8-01, P8-03, P8-04.

## 2026-11-02, AUD, Phase 8

- Did: Phase 8 audit (markers vs the print, surah search for all 114, offline app with the network cut, update flow, print to PDF, overlay with markers on and off, regressions). Phase 8: **PASS**. Four small findings (P8-01 to P8-04), none blocks.
- Files changed: docs/AUDIT.md, docs/HANDOFF.md.
- Messages sent: BUILDER, ORG, DOCU (Phase 8 PASS, ORG commits and pushes).
- Open items: ORG commits and pushes Phase 8; AUD then checks the Actions run, the live site, and the installable app and offline on https. Hassan: P6-06 (email), P8-02.

## 2026-11-02, DOCU, Phase 8 (docs ready)

- Did: Documented phase 8 from BUILDER's handoff, checked against `src/search.js`, `src/print.js`, `src/offline.js`, `sw.js`, `manifest.webmanifest`, the render and controls changes and both string files (78 keys each). Ran validate (21 pass, 1 skip), `--full` (25 pass) and `build-site` into a temp folder (634 files, `sw.js` stamped; folder removed). READER: files table, Go to (Find a surah), Settings, new "Extras (phase 8)" section (margin markers, print, offline app). USER-GUIDE English and Arabic: surah search, markers, print, offline. DATA-FORMAT: new check 15 and renumbering (16 to 21, `--full` 22 to 25), build-site files and stamps, last run. README: intro (offline), status, done list, check counts, Deploy publish list, folder layout (sw.js, manifest, icons). D8 updated, D67 to D71 new. TEAM-START: checks, D1 to D71, phase 8 status. DEVLOG. Prettier clean, no em dashes.
- Files changed: `docs/READER.md`, `docs/USER-GUIDE.md`, `docs/DATA-FORMAT.md`, `README.md`, `docs/DECISIONS.md`, `docs/TEAM-START.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (phase 8 docs ready), ORG and BUILDER (recorded).
- Open items: phase 8 audit. TEAM-START part 2 at the phase 8 PASS.
- Update: BUILDER confirmed D67 to D71. Added details to D69 (what prints black, banners keep colors, green frame), D70 (font cache kept across deploys, old app caches deleted) and D71 (leading surah word, Arabic spaces, ranking, 20 results), and the same to READER and USER-GUIDE. AUD told.

## 2026-11-02 17:30, ORG, Phase 8

- Did: Tidy pass after BUILDER's Phase 8 build. validate 21 pass + 1 skip, Prettier clean, no em dashes, i18n 78 = 78 keys with none empty, localStorage only in `storage.js`, no debug lines. One small point for BUILDER: `PRINT_LIMIT` in `src/print.js` is exported but only used in that file. The built site (634 files) in `tmp/org8/` loads with no console errors or failed requests (English page 50, Arabic page 1). The service worker registers, and the manifest, 3 icons and 3 new modules all return 200. The test server ran inside the test script and stopped with it. Removed `tmp/org8/` afterwards. `docs/STRUCTURE.md`: `sw.js` and `manifest.webmanifest` at the root, `assets/icons/`, the 3 new src files, build-site stamping, the publish list, `tmp/phase8/`. No moves or renames.
- Files changed: `docs/STRUCTURE.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER (PRINT_LIMIT), DOCU and AUD (tidy done).
- Open items: AUD's Phase 8 audit, then the Phase 8 commit (with DOCU's Phase 7 closing edits and the Phase 7 archive) and push. `tmp/org-site/` is still locked by the old test server on port 8765.

## 2026-11-02, BUILDER, Phase 8 (built, handed to ORG, DOCU and AUD)

- Did: Surah search in the Go to panel (English names forgiving case, article, apostrophes, hyphens and double letters; Arabic names forgiving marks, tatweel, alef, taa marbuta and alef maqsura; numbers in both digit systems; exact name first; Enter opens the first result). Juz, hizb and quarter markers: each page is now a `.sheet` (frame, text block, page number; same coordinates) plus, when the setting is on (default), a 64 px outer margin (right of odd pages, left of even pages) with medallions at the start line from the data: an arched tablet for a quarter, an oval for a hizb or juz start, always in Arabic like the print (strings from ar.json); screen readers hear them in the interface language. Pages 1 and 2 have none, as in the print. Print booklet in Settings: pages from and to (up to 40), one page per A5 sheet with the binding margin on the inner side, drawn fresh with the current settings, black ink on white; uses CSS zoom so the browser does not shrink the printout. Offline app: manifest (names from the strings, checked by validate), icons (drawn shapes, no text), `sw.js` (app shell saved on install, about 5 MB; page fonts saved when viewed and kept across deploys; app files network first so every deploy is live at once; offline uses the saved copy), "Offline use" in Settings with the count and "Download all pages (about 95 MB)"; an unsaved page offline shows a message and the page on screen stays. build-site publishes sw.js, the manifest and icons and stamps the worker with hashes of the app files and of qcf2.sha256. validate: new check 15 (manifest names match the strings; sw.js lists every app file and only existing files).
- Tests: `tmp/tools/phase8_checks.py` 47 of 47 (search, markers incl. positions and 0 px movement inside the block with markers on or off, phone dark both languages, print range checks and the printed PDF (4 A5 pages, page fills the sheet), offline on a real localhost server: worker in control, caches with the build's versions, reader opens offline, saved pages open, unsaved page message, Download all saves 604, any page offline). Phases 4 to 7: 65, 46, 26, 40 of each; movement 132 of 132; overlay with markers off identical to Phase 3, with markers on median 1 px and 98.3% within 5 px (the wider page changes the measuring scale; every word's place inside the block is identical, checked on 2,029 words); validate 21 + 1 skip, `--full` 25; 78 equal strings; no em dashes.
- Files changed: new `src/search.js`, `src/print.js`, `src/offline.js`, `sw.js`, `manifest.webmanifest`, `assets/icons/icon-192.png`, `icon-512.png`, `icon-maskable-512.png`; changed `src/render.js`, `src/app.js`, `src/controls.js`, `src/fonts.js`, `src/i18n.js`, `src/progress.js`, `src/styles.css`, `index.html`, `src/i18n/en.json`, `src/i18n/ar.json`, `scripts/build-site.mjs`, `scripts/validate.mjs`. Nothing committed.
- Messages sent: ORG, DOCU, AUD (Phase 8 handoff).
- Open items: tell Hassan the offline sizes (5 MB automatic, 95 MB on request). ORG tidy, DOCU docs, AUD audit.

## 2026-11-02, DOCU, Phase 8 (phase 7 commit recorded)

- Did: Checked ORG's commit `c13eaa0` (pushed, `origin/main` = `c13eaa0`) and its Actions run 41475502760 (success) with git and `gh run list`. Updated `docs/TEAM-START.md` part 2 (last commit, phase 7 live, next: BUILDER builds phase 8) and first actions; README status. My phase 7 closing edits (TEAM-START, README, DEVLOG) came after `c13eaa0`, so they go into the phase 8 commit.
- Files changed: `docs/TEAM-START.md`, `README.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: ORG (done; the late edits go into phase 8).
- Open items: phase 8 docs when BUILDER finishes.
