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
