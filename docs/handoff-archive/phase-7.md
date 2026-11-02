# HANDOFF archive: Phase 7

Phase 7 (Memorization tools) got PASS from AUD on 2026-11-02. These are the Phase 7 entries moved out of `docs/HANDOFF.md` by ORG, in the order they had in the log.

## 2026-11-02, DOCU, Phase 7 closed

- Did: Recorded AUD's Phase 7 PASS (checked in `docs/AUDIT.md`). Peek off by default is in D58, READER, USER-GUIDE (English and Arabic) and README. `docs/TEAM-START.md` part 2 and first actions now for phase 8 (phase 7 commit and push pending ORG). README status phase 8. DEVLOG: ORG's tidy, the PASS, a phase 8 section. Prettier clean, no em dashes.
- Files changed: `docs/TEAM-START.md`, `README.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (done), ORG (docs ready for the phase 7 commit).
- Open items: after ORG's phase 7 commit, update TEAM-START part 2 (last commit). Phase 8 docs.

## 2026-11-02, DOCU, Phase 7 (peek off by default; ORG's tidy)

- Did: Recorded Hassan's decision (relayed by BUILDER, checked in `src/app.js`): peek starts switched off, a saved choice is kept. D58, READER (Settings table, Peek paragraph), USER-GUIDE English and Arabic, README. Recorded BUILDER's live-site check for P6-02 in README Deploy and DEVLOG. ORG's phase 7 tidy moved nothing, so no doc paths change; READER's files table already lists the 4 new files.
- Files changed: `docs/DECISIONS.md`, `docs/READER.md`, `docs/USER-GUIDE.md`, `README.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD, BUILDER, ORG.
- Open items: AUD's phase 7 audit. TEAM-START part 2 at the phase 7 PASS.

## 2026-11-02, AUD, Phase 7

- Did: Phase 7 audit (peek, test mode, tracker, bookmarks, P key, blank-tap peek, persistence, storage blocked, phone dark in both languages, overlay 100% within 5 px). All four findings closed. Also verified P6-02 on GitHub (run 41474933287 green) and the live site. Phase 7: **PASS**.
- Files changed: docs/AUDIT.md, docs/HANDOFF.md.
- Messages sent: BUILDER, ORG, DOCU (Phase 7 PASS, start Phase 8).
- Open items: ORG commits and pushes Phase 7 after this PASS; then AUD checks the Actions run and the live site. Hassan: P6-06 (email in commits).

## 2026-11-02 16:10, ORG, Phase 7

- Did: Hassan picked "switch Pages to GitHub Actions, then push" in ORG's chat (BUILDER had already switched it with his OK; I checked `build_type: workflow`). Committed only `.github/workflows/deploy.yml` as `03a8fc4` on top of `9dec020`. Pre-push: no pdf, db or tmp files in the range, and validate on a clean export of HEAD gave 20 pass, 1 skip. Pushed `f8d2876..03a8fc4`. The first Actions run 41474933287 passed (check and deploy), and the live site returns 200 (P6-02). Phase 7 tidy: validate 20 pass + 1 skip, Prettier clean, no em dashes, i18n 48 = 48 keys with none empty, no unused exports or debug lines, localStorage only in `storage.js`. The built site (626 files) loads under `/quran-verse-openings/` with all files 200 and no console errors. `docs/STRUCTURE.md`: the 4 new src files, the deploy rule, `tmp/phase7/`. No moves or renames.
- Files changed: `docs/STRUCTURE.md`, `docs/HANDOFF.md`, git history (`03a8fc4`).
- Messages sent: BUILDER, AUD, DOCU (push and run result; tidy done).
- Open items: AUD's Phase 7 PASS, then the Phase 7 commit by path (src/, index.html, i18n, docs) and push, which deploys. `tmp/org-site/` is still held by the test server on port 8765 (I could not stop it); remove it once the server has stopped.

## 2026-11-02, BUILDER, Phase 7 (peek off by default; first deploy checked)

- Did: Hassan chose peek switched OFF by default ("lets do switched off first"): `src/app.js` default false; a saved choice is kept. `tmp/tools/phase7_checks.py` 40 of 40 (new check: unchecked by default, a tap shows nothing). Checked ORG's push 03a8fc4: Actions run 41474933287 "Check and deploy" succeeded step by step on GitHub's runner (all checksums OK, validate 20 pass + 1 skip, build, upload, configure, deploy). Live site serves only the site files (docs/, scripts/, data/sources/, README.md return 404), Phase 6 build; headless Chrome on the live URL (desktop en dark, phone ar light): no console errors, no failed requests, no sideways scroll.
- Files changed: `src/app.js`; `tmp/tools/phase7_checks.py`. Nothing committed.
- Messages sent: DOCU (P6-02 run result, D58 change), AUD (P7-04 decided, live check), ORG (live verified, app.js change).
- Open items: ORG's Phase 7 tidy, then AUD's formal PASS; Phase 8 next.

## 2026-11-02, DOCU, Phase 7 (push recorded)

- Did: Checked ORG's push (`origin/main` = `03a8fc4`, on top of `9dec020`) and run 41474933287 with `gh run view` (check and deploy both succeeded). Updated `docs/TEAM-START.md` part 2 (last commit, P6-02 passed, phase 7 waits for ORG's tidy and AUD's PASS) and the first actions per role. README Deploy: first run passed. D56: both commits pushed. DEVLOG.
- Files changed: `docs/TEAM-START.md`, `README.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: ORG and AUD (TEAM-START fixed).
- Open items: update the docs if ORG's phase 7 tidy moves anything. TEAM-START part 2 at the phase 7 PASS.

## 2026-11-02, DOCU, Phase 7 (peek changes documented)

- Did: Documented BUILDER's fixes for P7-01 and P7-02, checked against `src/peek.js` and both string files. READER: peek on the blank stretch of a line, the P key (ح on an Arabic keyboard; next verse with hidden words, reading order, wraps around; not in fields, test mode or the language screen), Keyboard section. USER-GUIDE English and Arabic: the new setting wording, blank-stretch tap, P key. New D66 (keyboard way to peek). TEAM-START read list D1 to D66. DEVLOG.
- Files changed: `docs/READER.md`, `docs/USER-GUIDE.md`, `docs/DECISIONS.md`, `docs/TEAM-START.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (docs updated), BUILDER (grid aria-label note).
- Open items: the grid squares' new aria-label sits inside `#progress-grid`, which is `aria-hidden="true"` in `index.html`, so screen readers still do not hear it. Told BUILDER; READER still says the grid is hidden from screen readers. BUILDER: intended (604 squares would be noisy; the summary and page box do the same job; the labels help automated checks). No doc change.

## 2026-11-02, BUILDER, Phase 7 (AUD's minor items P7-01 to P7-03 fixed)

- Did: P7-01: a tap on the blank stretch of a line where hidden words are peeks the verse whose word place is nearest the tap (hidden words keep their boxes). P7-02: the P key (physical key, so it also works on an Arabic keyboard) peeks the next verse on screen in reading order, one at a time; the Peek setting's label now says "(or press P)". It is not active in fields, in test mode, or while the language screen is open. P7-03: the grid squares have an aria-label (the same as their title). P7-04 is a question for Hassan (peek on by default). Told DOCU that D60's code behaviour (progress kept when the same pages are drawn again) is the intended one.
- Tests: `tmp/tools/phase7_checks.py` 39 of 39 (3 new checks for P7-01 to P7-03). Phase 4 65 of 65, Phase 5 46 of 46, Phase 6 26 of 26, movement 132 of 132, strings 48 equal keys, no em dashes.
- Files changed: `src/peek.js`, `src/app.js`, `src/progress.js`, `src/i18n/en.json`, `src/i18n/ar.json`. Nothing committed.
- Messages sent: AUD (fixes), ORG and DOCU (files and behaviour).
- Open items: AUD's formal PASS after ORG's tidy; ORG's push of Phase 6 and the deploy.yml commit; first Actions run for DOCU (P6-02).

## 2026-11-02, DOCU, Phase 7 (decisions refined)

- Did: BUILDER checked D58 to D63. Updated D58 (markers shown by peek, tap in test mode), D60 (what resets a test; markers follow their own setting), D61 (marks exclude each other, bookmark separate; per page from PROJECT.md), D63 (grid from PROJECT.md, header stays 2 rows, WCAG 2.5.8 note). New D64 (test bar under the pages) and D65 (ribbon in the top margin). READER: bookmark separate from marks. TEAM-START read list D1 to D65. DEVLOG.
- Files changed: `docs/DECISIONS.md`, `docs/READER.md`, `docs/TEAM-START.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER (words-setting reset question), AUD (decisions updated).
- Open items: BUILDER said a change of the words setting restarts a test; the code reads as if it keeps progress (`setWords` redraws the same pages, `apply` keeps `shown` when the pages are the same). Left out of D60 until BUILDER answers.
- Update: BUILDER confirmed the code is right (no code change). A test restarts only when the pages on screen change (page turn, jump, view switch); language, words and markers changes keep progress. Recorded in D60, READER and USER-GUIDE (English and Arabic). AUD told.

## 2026-11-02, DOCU, Phase 7 (docs ready)

- Did: Documented phase 7 from BUILDER's handoff, checked against `src/peek.js`, `src/test-mode.js`, `src/progress.js`, `src/places.js`, the `index.html` and `render.js` diffs and both string files (48 keys each). READER: intro, files table (4 new files, 48 keys, `data-verse`), Go to, Settings (peek, test mode), new "Memorization tools (phase 7)" section, storage keys `qvo.marks` and `qvo.bookmarks`. USER-GUIDE English and Arabic: peek, test, tracker, bookmarks, what the site remembers. README status and done list. D58 to D63 (BUILDER's phase 7 choices). DEVLOG. TEAM-START read list now D1 to D63. Prettier clean, no em dashes.
- Files changed: `docs/READER.md`, `docs/USER-GUIDE.md`, `README.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/TEAM-START.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (phase 7 docs ready), BUILDER (please check D58 to D63).
- Open items: ORG's phase 7 tidy may change files; update docs if so. First Actions run (P6-02). TEAM-START part 2 at the phase 7 PASS.

## 2026-11-02, BUILDER, Phase 7 (built, handed to ORG, DOCU and AUD)

- Did: Found the repo public and GitHub Pages live through "Deploy from a branch" (whole repo, unchecked; Phase 5 commit live and working). Hassan chose the checked workflow: with his approval Pages source is now "GitHub Actions" (gh api), and `deploy.yml` deploys on main after the check job passes (push or manual; pull requests checked only). ORG commits that file on its own and pushes; first run still to report. Phase 7: peek (tap an opening: the verse's hidden words show in place, in their own colour, for 4 seconds; a second tap hides them; on by default, saved), test mode (hides every opening on screen; Show next opening in reading order, right page first; a tap on the page does the same; counter; Show all; Hide all; End test; a new page starts hidden; markers follow their own setting; not saved), memorization tracker (each page memorized or needs review, buttons for the pages on screen in the Go to panel, summary, a grid of 604 squares by juz that opens a page; memorized filled, review a ring), bookmarks (per page, list with page and surah name, remove, small ribbon in the page's top margin outside the text block). Shared `src/places.js` for the surah and juz at the top of a page. `render.js` only adds `data-verse` to word spans (no layout change).
- Tests: `tmp/tools/phase7_checks.py` 36 of 36 (peek shows only that verse and hides again, test mode order and counter, page turn resets, language switch keeps progress, marks and bookmarks with reload, Arabic, 390 px in both languages with dark theme, storage blocked, no console errors; nothing moves: 0 px at the same scale; the test bar makes the page a little smaller, every word stays in place inside it, under 0.02 px). Phase 4 65 of 65, Phase 5 46 of 46, Phase 6 26 of 26, movement 132 of 132, overlay on 32 pages identical to Phase 3, validate 20 pass + 1 skip, Prettier clean, no em dashes, 48 strings in each file.
- Files changed: new `src/places.js`, `src/peek.js`, `src/test-mode.js`, `src/progress.js`; changed `src/render.js`, `src/app.js`, `src/controls.js`, `src/styles.css`, `index.html`, `src/i18n/en.json`, `src/i18n/ar.json`, `.github/workflows/deploy.yml` (separate commit). Nothing committed.
- Messages sent: AUD, ORG, DOCU (Pages decision); ORG, DOCU, AUD (Phase 7 handoff).
- Open items: ORG commits deploy.yml alone, pushes 9dec020 and that commit; I check the first Actions run and tell DOCU (P6-02). Phase 7 tidy, docs, audit.

## 2026-11-02, DOCU, Phase 7

- Did: Recorded Hassan's decision (relayed by BUILDER, checked by AUD): repo public, Pages source "GitHub Actions", `deploy.yml` publishes on `main` after the checks. D46 (public), D53 (replaced), D56 (phase 6 is `9dec020`), D14, new D57. README: Status (live, address), Deploy (new flow, about the fonts: downloadable, no license from this project), Credits note, clone note. DATA-SOURCES: fonts are public. TEAM-START part 2, standing rule on the public repo, first actions. DEVLOG. Prettier clean, no em dashes.
- Files changed: `README.md`, `docs/DECISIONS.md`, `docs/DATA-SOURCES.md`, `docs/TEAM-START.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (done, ready to check), ORG and BUILDER (recorded).
- Open items: record the first Actions run result (P6-02) when BUILDER reports it. Phase 7 docs.

## 2026-11-02, DOCU, Phase 7 (started after restart)

- Did: New DOCU session (successor). Read TEAM-START, HANDOFF, git state. Phase 6 is committed as `9dec020`, not pushed. At ORG's request, left `docs/TEAM-START.md` part 2 and the README Deploy text unchanged until Hassan decides about the public repo and Pages (part 2 still says the phase 6 commit is next, which is out of date).
- Files changed: `docs/HANDOFF.md`.
- Messages sent: ORG (holding, waiting for Hassan's answer).
- Open items: once Hassan decides, update TEAM-START part 2 (last commit `9dec020`, push state, public or private, Pages source), README Deploy and Status, D46, DEVLOG. Then document phase 7 when BUILDER finishes.

## 2026-11-02, ORG, Phase 7 (started after restart)

- Did: New ORG session (successor). Read TEAM-START, AGENTS, HANDOFF. Found Phase 6 already committed as `9dec020` (tree equals `refs/snapshots/phase-6`, author Hassan) but NOT pushed: `origin/main` is still `f8d2876`. Checked GitHub: the repo is now PUBLIC and Pages is on with "Deploy from a branch" (main, /), so a push of `9dec020` publishes the whole repo at once, before `deploy.yml`'s checks. Holding the push until Hassan decides (BUILDER asked him the same). Archived the 11 Phase 6 entries to `docs/handoff-archive/phase-6.md` and the late Phase 5 ORG entry to the top of `docs/handoff-archive/phase-5.md`.
- Files changed: `docs/HANDOFF.md`, `docs/handoff-archive/phase-6.md` (new), `docs/handoff-archive/phase-5.md`.
- Messages sent: BUILDER (push on hold), DOCU and AUD (push on hold, repo public, archive done).
- Open items: Hassan: push now or switch Pages to "GitHub Actions" first; also confirm the repo going public was his choice (standing rule D46). DOCU's post-PASS edits (README, DECISIONS, DEVLOG, TEAM-START) are uncommitted; they go into the Phase 7 commit. Tidy Phase 7 when BUILDER finishes.
