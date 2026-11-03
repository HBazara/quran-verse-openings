# HANDOFF

Shared log for BUILDER, ORG, DOCU and AUD. Newest entry at the top.
Read this before starting work. After each turn, add an entry at the top using the template below.
When a phase gets PASS, ORG moves that phase's entries to `docs/handoff-archive/phase-X.md`.

Template:

```
## YYYY-MM-DD HH:MM, ROLE, Phase N
- Did:
- Files changed:
- Messages sent:
- Open items:
```

---

## 2026-11-03, DOCU, P9-01 and P9-02 decided

- Did: Recorded Hassan's answers (relayed by BUILDER): P9-01 keep the data's spelling (D76; removed from the open lists), P9-02 larger heading on phones (D77). Checked BUILDER's `src/styles.css` diff (`clamp(16px, 11px / scale, 21px)`, line ends 4 px above the frame). READER Page heading and Known limits, TEAM-START (D1 to D77, page heading line), DEVLOG.
- Files changed: `docs/READER.md`, `docs/DECISIONS.md`, `docs/TEAM-START.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (docs ready for the P9-02 re-check).
- Open items: "docs final" to ORG after AUD's PASS. P6-06 still with Hassan. AUD's install and offline check.
- Update: AUD gave PASS; TEAM-START and DEVLOG updated; sent ORG "docs final".

## 2026-11-03 10:39, BUILDER, after phase 8 (P9-01 and P9-02 answered; heading larger on phones)

- Did: Hassan's answers: P9-01, keep the data's spelling of the 4 names (no change); P9-02, make the heading larger on phones. In `src/styles.css` the heading's size now follows the page scale: 16 px (the print's size) when the page is drawn near full size, growing when the page is drawn small so it stays about 11 screen pixels (390 and 360 px phones: 11.0; 320 px phones: 9.7, capped at 21 px by the room above the frame; phones held sideways: 7.2). Its line now ends 4 px above the frame at every size, so the letters grow upward into the free space. Printing has no `--scale` and keeps 16 px.
- Tests: `tmp/tools/heading_checks.py` 23 of 23 (new: the largest size fits on every page, smallest gap 40 px on page 603; screen size and room for the letters at 1400, 390, 360 and 320 px and sideways; print at 16 px). phase4 65, phase5 46, phase6 26, phase7 41, phase8 52, movement 132 of 132, overlay identical to Phase 3 (markers off) and Phase 8 (markers on), validate 21 + 1 skip, `--full` 25, Prettier clean, no em dashes.
- Files changed: `src/styles.css`. Not committed.
- Messages sent: AUD (the new auditor: where things stand, re-check), DOCU and ORG (Hassan's answers, the change).
- Open items: AUD re-check, DOCU docs, ORG follow-up commit.

## 2026-11-02, DOCU, page heading pushed

- Did: Checked `57ee514` (pushed) and run 41529135878 (success). Updated TEAM-START part 2 (last commit, heading live) and the README; DEVLOG.
- Files changed: `docs/TEAM-START.md`, `README.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md` (docs-only, for a later commit).
- Messages sent: ORG (recorded).
- Open items: Hassan decides P9-01 (4 hamza spellings) and P6-06 (email in commits).

## 2026-11-02 20:10, ORG, after Phase 8 (page heading committed)

- Did: After AUD's PASS and DOCU's "docs final", committed the page heading (`src/places.js`, `src/render.js`, `src/styles.css`, both i18n files) with DOCU's docs and AUD's AUDIT.md as `57ee514` "Page heading: juz and surah names above the frame". Pre-push: no forbidden files, no em dashes, Prettier clean, validate on a clean export 21 pass + 1 skip. Pushed `ff8141f..57ee514`. Actions run 41529135878: check success, deploy success. The live `src/places.js` has `pageHeading`.
- Files changed: git history (`57ee514`), `docs/HANDOFF.md`.
- Messages sent: AUD (run id), DOCU (hash), BUILDER (live).
- Open items: this entry goes into the next commit. `tmp/org-site/` stays until Hassan stops my old test server on port 8765. P6-06 is Hassan's call.

## 2026-11-02, DOCU, page heading closed

- Did: Recorded AUD's PASS for the page heading. Added P9-01 (4 hamza spellings, as AUD confirmed on the print) and P9-02 (heading 7 to 9 px on phones) to READER Known limits; TEAM-START part 2 and README updated; DEVLOG. Sent ORG "docs final".
- Files changed: `docs/READER.md`, `docs/TEAM-START.md`, `README.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: ORG ("docs final"), AUD (recorded).
- Open items: Hassan decides P9-01 and P6-06. Record the commit hash after ORG's push.

## 2026-11-02, AUD, Page heading

- Did: Audited the page heading (Hassan's request after Phase 8): compared with the print on about 34 pages, fit, screen readers, themes, phone, print, overlay and hidden-word tests. PASS. P9-01 (four surah names spelled differently from the print) and P9-02 (small on phones) noted.
- Files changed: docs/AUDIT.md, docs/HANDOFF.md.
- Messages sent: BUILDER, ORG, DOCU (PASS; ORG commits and pushes).
- Open items: Hassan: P9-01 hamza spellings, P6-06 email.

## 2026-11-02 19:40, ORG, after Phase 8 (page heading)

- Did: Tidy pass on BUILDER's page heading (Hassan's request after Phase 8). validate 21 pass + 1 skip, no em dashes, i18n 109 = 109 keys with none empty, no debug lines. The 30 `heading.juzN` strings are ordinal labels ("Juz 1", "الجزء الأول"), not Quran text, and the surah names come from `data/quran.json` (Rule 1 is kept). Ran Prettier on `docs/HANDOFF.md` (CRLF on disk only). The built site (634 files, `tmp/org9/`, removed afterwards) shows the right heading on page 50 (juz 3, Al-Baqarah and Al-Imran on the spread) and page 582 (juz 29 and 30), and none on page 1. No console errors or warnings, no failed requests. The server ran inside the test and stopped with it. No new, moved or renamed files, so no STRUCTURE change.
- Files changed: `docs/HANDOFF.md`.
- Messages sent: AUD, DOCU (tidy done), BUILDER (clean).
- Open items: AUD's audit, then DOCU's "docs final", then one commit for the heading plus DOCU's docs-only update.

## 2026-11-02, DOCU, page heading documented

- Did: Documented BUILDER's page heading after reading the `render.js` diff and running `pageHeading` on pages 3, 121, 385, 502, 591, 595, 604 (all match BUILDER's description; surahs 2 to 114 are each named somewhere). READER (files, drawing step 7, Bookmarks ribbon, new "Page heading" section with the rule and the 4 hamza names), USER-GUIDE English and Arabic (new section, ribbon corner), README done list, D65 note, D72 to D75, TEAM-START (D1 to D75, new work and the hamza question for Hassan), DEVLOG.
- Files changed: `docs/READER.md`, `docs/USER-GUIDE.md`, `README.md`, `docs/DECISIONS.md`, `docs/TEAM-START.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (ready to audit), BUILDER (recorded), ORG (wait for "docs final").
- Open items: Hassan on the 4 hamza names. "docs final" after AUD's PASS.
- Update: BUILDER corrected D74 (the top-of-page rule differs from the print on 38 pages, for example 62, 106, 502, 595 to 604; pages 121 and 385 tested other wrong rules) and step 3 (the page with verse 1). DOCU re-counted 38 with `src/places.js` and fixed D74 and READER. AUD told.

## 2026-11-02 16:00, BUILDER, after phase 8 (page heading, asked by Hassan)

- Did: Hassan asked for the surah name and the juz at the top of each page. Pages 3 to 604 now have the print's heading above the frame: the juz in words on the right ("الجزء الثاني"), the surah name or names on the left ("سورة البقرة"). Pages 1 and 2 have none, as in the print. Always Arabic like the print; screen readers hear it in the interface language before the verses. It prints in the booklet. The rule, read from the print on all 85 pages where a surah or a juz changes (`pageHeading` in `src/places.js`): the juz that fills most of the page; the surah with more than half of the page's verse lines, else every surah that begins on the page; a surah left out everywhere is named where it begins (Al-A'la on 591, Al-Layl on 595). The bookmark ribbon moved to the page's top corner so it never covers the juz name.
- Tests: `tmp/tools/heading_checks.py` 17 of 17 (every page against the print table `tmp/header/print-truth.json` and the 517 one-surah pages, fit, screen readers in both languages, three themes, phone, ribbon, print). `tmp/tools/heading_vs_print.py` makes side-by-side images (`tmp/header/compare-*.png`, `rest-*.png`). Overlay identical to Phase 3 (markers off) and Phase 8 (markers on) on every line of 32 pages; movement 132 of 132; phase4 65, phase5 46, phase6 26, phase7 41, phase8 52 (its marker check now finds the marker line, since the heading lines come first); validate 21 + 1 skip, `--full` 25; 109 equal strings; Prettier clean; no em dashes.
- Files changed: `src/places.js`, `src/render.js`, `src/styles.css`, `src/i18n/en.json`, `src/i18n/ar.json`. Not committed.
- Messages sent: ORG, DOCU, AUD (handoff).
- Open items: Hassan: 4 surah names in the data (Tanzil) differ from the print by a hamza (ابراهيم, الانسان, الإنفطار, الإنشقاق); kept as they are unless he decides otherwise. ORG tidy, DOCU docs, AUD audit.

## 2026-11-02, DOCU, after phase 8 (fixes pushed)

- Did: Checked `ff8141f` (pushed) and run 41515688740 (success). Updated TEAM-START part 2 (last commit, all P8 items closed, P6-06 open for Hassan, next steps) and first actions; README status; DEVLOG. CRLF: the working copies of all docs show CRLF because `core.autocrlf` is true; `.gitattributes` (`eol=lf`) stores them as LF, and Prettier passes, so nothing to change.
- Files changed: `docs/TEAM-START.md`, `README.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md` (docs-only, for a later commit).
- Messages sent: ORG (hash recorded, CRLF explained).
- Open items: Hassan decides P6-06.

## 2026-11-02 15:06, BUILDER, after phase 8 (fixes live)

- Did: Checked ORG's `ff8141f` on the live site: `sw.js` has the no-cache downloads (VERSION `48a58a85c073`, fonts version unchanged, so saved page fonts are kept), and the new `search.js`, `peek.js` and `progress.js` are served. In headless Chrome: the reader opens, the service worker is active, "aal imran" finds surah 3, no console errors or warnings.
- Files changed: `docs/HANDOFF.md`.
- Messages sent: none.
- Open items: none for BUILDER.

## 2026-11-02 19:00, ORG, Phase 8 fixes

- Did: After AUD's re-check and DOCU's "docs final", committed BUILDER's P8-01, P8-03 and P8-04 fixes (`src/search.js`, `src/peek.js`, `src/app.js`, `src/progress.js`, `sw.js`), DOCU's Phase 8 closing docs, AUD's AUDIT.md and the Phase 7 and 8 archives as `ff8141f` "Phase 8 fixes: search, peek, offline updates". Prettier flagged CRLF line endings in `docs/HANDOFF.md`. I fixed it before the push (the stored file was already LF). Pre-push: no forbidden files, no em dashes, validate on a clean export 21 pass + 1 skip. Moved `refs/snapshots/phase-8` to this tree. Pushed `44452fb..ff8141f`. Actions run 41515688740: check success, deploy success. The live `sw.js` has the no-cache fix. New team rule agreed with DOCU: after a PASS, ORG commits only after DOCU says "docs final".
- Files changed: git history (`ff8141f`), `docs/HANDOFF.md`.
- Messages sent: AUD (run id), DOCU (hash), BUILDER (pushed).
- Open items: DOCU's docs-only update with this hash goes into a later commit. `tmp/org-site/` stays until Hassan stops my old test server on port 8765. P6-06 (email public in commits) is Hassan's call.

## 2026-11-02 15:03, BUILDER, after phase 8 (fixes closed)

- Did: AUD verified and closed P8-01, P8-03, P8-04 and the grid focus fix, and closed P8-02 with Hassan's answer. Nothing is open for BUILDER; all eight phases are built.
- Files changed: `docs/HANDOFF.md`.
- Messages sent: none.
- Open items: ORG's follow-up commit and push (DOCU's docs are final; the checked deploy publishes it).

## 2026-11-02, DOCU, after phase 8 (docs final)

- Did: AUD verified the P8 fixes and closed P8-02. Updated README and TEAM-START part 2 (fixes verified, commit next by ORG) and AUD's first action. DEVLOG. Sent ORG "docs final".
- Files changed: `README.md`, `docs/TEAM-START.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: ORG ("docs final").
- Open items: after ORG's push, record the commit and run in TEAM-START part 2 and README.

## 2026-11-02, AUD, Phase 8 re-check

- Did: Verified Phase 8 live on https (Actions run 41511458126 green, installable, offline), then re-checked BUILDER's fixes P8-01, P8-03, P8-04 and the grid focus fix (own tests, a Pages-like 10 minute cache). All pass. P8-02 closed (Hassan: markers stay on). Fixes: **PASS**.
- Files changed: docs/AUDIT.md, docs/HANDOFF.md.
- Messages sent: BUILDER, ORG, DOCU (fixes pass; ORG commits and pushes).
- Open items: ORG commits and pushes the fixes; AUD checks that run and the live site. Hassan: P6-06 (email in commits).

## 2026-11-02, DOCU, after phase 8 (P8-02 decided)

- Did: Recorded Hassan's answer on P8-02 (relayed by BUILDER): margin markers stay on by default everywhere, phones included; no code change. D67, READER (Known limits), README, TEAM-START part 2 and BUILDER's first action, DEVLOG.
- Files changed: `docs/DECISIONS.md`, `docs/READER.md`, `README.md`, `docs/TEAM-START.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (recorded).
- Open items: AUD's re-check of the P8 fixes, then "docs final" to ORG.

## 2026-11-02 14:57, BUILDER, after phase 8 (P8-02 answered)

- Did: Asked Hassan about P8-02 (the margin markers, on by default, make the text about 10% smaller on phones). His answer: keep the markers on by default everywhere, phones included; readers who want bigger text switch them off in Settings. No code change.
- Files changed: `docs/HANDOFF.md`.
- Messages sent: AUD, DOCU, ORG (Hassan's answer).
- Open items: AUD re-check of P8-01, P8-03, P8-04 and the grid focus fix; then DOCU's "docs final" and ORG's follow-up commit.

## 2026-11-02, DOCU, after phase 8 (P8 fixes documented)

- Did: Documented BUILDER's fixes for P8-01, P8-03, P8-04 and the grid focus change, checked against the diffs of `src/search.js`, `sw.js`, `src/peek.js`, `src/app.js` and `src/progress.js`. README (status of the open items), READER (Find a surah alias, peek hide, offline no-cache, grid focus; removed the open-findings line from Known limits), D70, D71, TEAM-START part 2 and first actions, DEVLOG.
- Files changed: `README.md`, `docs/READER.md`, `docs/DECISIONS.md`, `docs/TEAM-START.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (docs for the fixes ready), BUILDER (recorded).
- Open items: Hassan's answer on P8-02 (BUILDER relays it). Then "docs final" to ORG after AUD's re-check.

## 2026-11-02 14:54, BUILDER, after phase 8 (P8-01, P8-03, P8-04 fixed, plus one tracker warning)

- Did:
  - P8-01: search finds "aal imran" (also "aal-e-imran", "aali imran") through a one-entry alias list in `src/search.js` (`ALIASES`, surah 3 only). The forgiving comparison drops an article before it collapses double letters; changing that order would make "An-Nasr" match "Al-Asr".
  - P8-03: `sw.js` now downloads with `cache: 'no-cache'` (`FRESH`) everywhere: app files (network first), the app files saved at install, and page fonts saved on first view. GitHub Pages sends `Cache-Control: max-age=600`, so before this an open reader could see the old version for up to 10 minutes after a deploy, and a new worker could save old files for offline use.
  - P8-04: switching peek off, or test mode on, hides a running peek at once (`hidePeeks` in `src/peek.js`, called from `src/app.js`).
  - Tracker grid (found by the phase 7 suite): a click on a grid square put the focus inside the grid, which is `aria-hidden` (a picture, P7-03), and Chrome sometimes warned in the console. The squares no longer take the focus from a click or tap (`src/progress.js`); the click still opens the page.
- Tests: new `tmp/tools/pages_server.py` serves the built site with GitHub Pages' cache rule, and `phase8_checks.py` now uses it: 52 of 52 (new checks for P8-01, P8-03, P8-04). New `tmp/tools/deploy_refresh_check.py` simulates a deploy for a reader who already has the app: with the real `sw.js` the new version shows at the next load and is what gets saved for offline use; a control without no-cache shows the old version at every step, so the check can see the problem. phase7 41 of 41 (three runs; new focus check), phase4 65, phase5 46, phase6 26, movement 132 of 132, validate 21 + 1 skip, `--full` 25, Prettier clean, no em dashes.
- Files changed: `src/search.js`, `src/peek.js`, `src/app.js`, `src/progress.js`, `sw.js`. Not committed.
- Messages sent: AUD (re-check), ORG (files for the follow-up commit), DOCU (what changed for the docs).
- Open items: AUD re-check. P8-02 is with Hassan (margin markers on by default on phones).

## 2026-11-02, DOCU, after phase 8 (commit timing)

- Did: Agreed with ORG: after a PASS, ORG waits for DOCU's "docs final" message before committing (phases 7 and 8 each missed DOCU's closing edits). Added to the commits rule in `docs/TEAM-START.md` part 3.
- Files changed: `docs/TEAM-START.md`, `docs/HANDOFF.md`.
- Messages sent: none.
- Open items: send ORG "docs final" after the P8 fixes are documented and AUD re-checks them.

## 2026-11-02, DOCU, after phase 8 (commit recorded)

- Did: Checked ORG's commit `44452fb` (pushed, `origin/main` = `44452fb`) and Actions run 41511458126 (check and deploy success) with git and `gh run view`. Updated `docs/TEAM-START.md` part 2 (version 2 live, next steps) and first actions; README status. My phase 8 closing edits (README, READER, DECISIONS, TEAM-START, DEVLOG) came after `44452fb`, so they go into the next commit.
- Files changed: `docs/TEAM-START.md`, `README.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: ORG (done; the late edits wait for the next commit).
- Open items: Hassan decides P8-02. Record BUILDER's fixes for P8-01, P8-03, P8-04 (`src/` changes already appear in the working tree).

## 2026-11-02 18:10, ORG, Phase 8 closed

- Did: AUD gave Phase 8 PASS. No code had changed since AUD's findings, so I committed the working tree by path as `44452fb` "Phase 8: search, margin markers, print booklet, offline app" (author Hassan). It includes DOCU's Phase 7 closing edits and the Phase 7 archive. Saved tree snapshot `refs/snapshots/phase-8`. Pre-push: no pdf, db or tmp files, no em dashes, Prettier clean, validate on a clean export of HEAD 21 pass + 1 skip. Pushed `c13eaa0..44452fb`. Actions run 41511458126: check success, deploy success. Live: the site, `sw.js`, `manifest.webmanifest`, the icons and `src/search.js` all return 200. Moved the 6 Phase 8 entries to `docs/handoff-archive/phase-8.md` and the late Phase 7 ORG entry to the top of `docs/handoff-archive/phase-7.md`.
- Files changed: git history (`44452fb`), `docs/HANDOFF.md`, `docs/handoff-archive/phase-7.md`, `docs/handoff-archive/phase-8.md` (new).
- Messages sent: AUD (run id), DOCU (commit hash), BUILDER (pushed; optional P8 fixes).
- Open items: AUD checks the live run, the install and offline use on https. The open minor items P8-01, P8-03 and P8-04 (BUILDER) and the note P8-02 (Hassan: markers on by default on phones?) would need a follow-up commit after AUD re-checks. This archive goes into that commit. `tmp/org-site/` is still locked by the old test server on port 8765.
