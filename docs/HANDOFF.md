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

## 2026-11-01, AUD, Phase 6

- Did: Phase 6 audit: workflow read and its commands run, 5 mutation tests (all caught), built site served under /quran-verse-openings/ (no external or failed requests, overlay 100% within 5 px, hidden-word test 0 problems), glyph check of all fonts (0 missing), themes, 8 sizes x 2 languages, docs, launcher and TEAM-START. Phase 6: **PASS** (version 1 ready, not live).
- Files changed: docs/AUDIT.md, docs/HANDOFF.md.
- Messages sent: ORG, BUILDER, DOCU (Phase 6 PASS; ORG commits and pushes, then reports the first Actions run).
- Open items: P6-02 first Actions run, P6-04 Hassan's public or private decision, Phase 7 may start.

## 2026-11-01 23:20, ORG, Phase 6

- Did: Hassan asked to name the launcher after the project: renamed `start-team.ps1` to `start-quran-verse-openings.ps1` (window name `quran-verse-openings`; the script now finds itself with `$PSCommandPath`). Dry run OK. Updated `docs/STRUCTURE.md`. Hassan asked to remember this setup for new projects: saved it in ORG's project memory and in Hassan's global `~/.claude/CLAUDE.md` (outside the repo).
- Files changed: `start-team.ps1` renamed to `start-quran-verse-openings.ps1`, `docs/STRUCTURE.md`, `docs/HANDOFF.md`.
- Messages sent: DOCU (update the name in TEAM-START.md and DEVLOG), AUD (audit the new name).
- Open items: DOCU updates `docs/TEAM-START.md`. Then both files go into the Phase 6 commit after PASS.

## 2026-11-01 23:00, ORG, Phase 6

- Did: Tested `start-team.ps1` against DOCU's new `docs/TEAM-START.md` (dry run, fresh mode): 4 tabs, sessions named ORG, BUILDER, DOCU, AUD. Changed the first message to match DOCU's file word for word: "You are <ROLE>. Read docs/TEAM-START.md, then follow it."
- Files changed: `start-team.ps1`, `docs/HANDOFF.md`.
- Messages sent: DOCU (tested OK), AUD (please include `start-team.ps1` and `docs/TEAM-START.md` in the Phase 6 audit).
- Open items: `start-team.ps1` and `docs/TEAM-START.md` go into the Phase 6 commit after AUD's PASS.

## 2026-11-01 20:00, DOCU, Phase 6

- Did: Wrote `docs/TEAM-START.md` for ORG's launcher (read order, project state from git and AUDIT.md, standing rules from D10, D46, D56 and Rule 1, messaging, first action per role). Added it to the README docs list and DEVLOG. Prettier clean, no em dashes.
- Files changed: `docs/TEAM-START.md` (new), `README.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: ORG (file exists, name kept).
- Open items: keep part 2 of `docs/TEAM-START.md` current every phase. Phase 6 audit.

## 2026-11-01 22:40, ORG, Phase 6

- Did: Hassan asked for a one-click team start. Wrote `start-team.ps1` (root): opens one Windows Terminal window with 4 tabs, each a fresh Claude Code session named ORG, BUILDER, DOCU and AUD (`claude -n`), whose first message is "You are <ROLE>. Read docs/TEAM-START.md and follow it." `-Resume` reopens the old sessions by name instead (`claude -r`), and `-DryRun` only prints. Fresh mode refuses to start while `docs/TEAM-START.md` is missing. Dry runs tested. Added it to `docs/STRUCTURE.md`. Recommended fresh sessions to Hassan (the old ones have very long histories).
- Files changed: `start-team.ps1` (new), `docs/STRUCTURE.md`, `docs/HANDOFF.md`.
- Messages sent: DOCU (asked for `docs/TEAM-START.md`: read order, current state, standing rules, messaging, first action per role).
- Open items: DOCU writes `docs/TEAM-START.md`, then ORG re-tests. `start-team.ps1` goes into the next commit after AUD checks it.

## 2026-11-01 19:30, DOCU, Phase 6

- Did: Recorded ORG's commits `48c0d15` (phase 4) and `f8d2876` (phase 5) and the push; checked `origin/main` is at `f8d2876`. New D56 (one commit per audited phase), D35 updated, README clone note. DEVLOG.
- Files changed: `README.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: none.
- Open items: phase 6 audit, then its commit. Hassan: public or private (D46).

## 2026-11-01 22:10, ORG, Phase 6

- Did: With approval from Hassan in ORG's chat ("commit by phase", push, repo stays private): committed Phase 4 as `48c0d15` (from `refs/snapshots/phase-4`) and Phase 5 as `f8d2876` (from `refs/snapshots/phase-5`), author Hassan. Checked all 4 commits: no .pdf, .db, .zip, tmp/ or _site/ files, no em dashes, `validate` 18 pass and 1 skip on a clean export of HEAD. Pushed `main` to the PRIVATE repo `HBazara/quran-verse-openings`: the remote is at `f8d2876`, 658 files. No Actions run yet, because `deploy.yml` is Phase 6 work and not committed.
- Files changed: git history, `docs/HANDOFF.md`.
- Messages sent: AUD, BUILDER, DOCU (commits and push done).
- Open items: Commit and push Phase 6 after AUD's PASS (approved by Hassan: commit by phase). The repo stays private for now (Hassan). Phase 6 work stays uncommitted in the working tree until then.

## 2026-11-01 19:00, DOCU, Phase 6

- Did: Documented phase 6 (no publishing). Read `.github/workflows/deploy.yml` and `scripts/build-site.mjs`; ran validate (20 pass, 1 skip) and `--full` (24 pass, order matches BUILDER's list); checked `data/sources/qcf2.sha256` (604 OK); checked the CSS palettes and the 640 px rule. Updated README (Deploy: not published, how it would work, what it needs), DATA-FORMAT, READER, DATA-SOURCES, TEXT-CROSSCHECK, D53 to D55, DEVLOG. Prettier clean, no em dashes.
- Files changed: `README.md`, `docs/DATA-FORMAT.md`, `docs/READER.md`, `docs/DATA-SOURCES.md`, `docs/TEXT-CROSSCHECK.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER (recorded). AUD (phase 6 docs ready). No message to ORG needed: ORG had already added `_site/` to `.gitignore`. Added `scripts/lib/fontcheck.mjs` to DATA-FORMAT and ORG's tidy to DEVLOG.
- Open items: Hassan: public or private (D46), then deploy. Phase 6 audit.

## 2026-11-01 21:45, ORG, Phase 6

- Did: Tidy pass after BUILDER's Phase 6 build (non-publishing parts). Added `_site/` to `.gitignore` and removed `.github/workflows/.gitkeep` (BUILDER's asks). Read `deploy.yml`: checks run before the build, `shell: bash` gives -e and pipefail, and the deploy job runs only on a manual run on main. Built the site into `tmp/org-site/` (then removed): 622 files, about 100 MB, only index.html, src/, assets/fonts/, data/quran.json, `.nojekyll` and an empty marker file. No docs, scripts, checksum files, .pdf or .db. `validate` 20 pass and 1 skip, `--full` 24 pass, Prettier clean, no em dashes, 29 i18n keys matching, no dead code, all files load under `/quran-verse-openings/`. `docs/STRUCTURE.md`: build-site.mjs, fontcheck.mjs, qcf2.sha256, the workflow, `tmp/phase6/`, `_site/`. Nothing committed.
- Files changed: `.gitignore`, `.github/workflows/.gitkeep` (removed), `docs/STRUCTURE.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER, DOCU, AUD (tidy done).
- Open items: Keep `tmp/phase6/` until PASS. Hassan: push, approve the commits for Phases 4 to 6, decide public or private (free Pages needs public).

## 2026-11-01 (BUILDER clock), BUILDER, Phase 6 (non-publishing parts built; deploy waits on Hassan)

- Did: Phase 5 PASS. Phase 6 without publishing (AUD and ORG: no public deploy until Hassan decides public or private and pushes). P4-02: the view switch shows icons only below 640 px (names kept for screen readers), so the header is 2 rows on phones (320 to 414 px) and 1 row from about 1000 px. P4-03: the banner font's own palettes follow the theme (dark: palette 1, sepia: palette 2) through `@font-palette-values`. Typography: fuller interface font list, Arabic interface text 17 px with more line space; new validate check that every glyph the site draws exists in its font (88,186 glyph codes in 604 page fonts, 114 banners, the Bismillah; a wrong font made it fail) with a small TTF/WOFF2 cmap reader (`scripts/lib/fontcheck.mjs`, matches fontTools on the four fonts). The 604 page fonts are now pinned in `data/sources/qcf2.sha256` (`validate --write-font-sums`; a changed byte fails both validate and `sha256sum -c`). Deploy: `scripts/build-site.mjs` gathers index.html, src/, assets/fonts/ and data/quran.json (622 files; refuses to replace a folder it did not make); `.github/workflows/deploy.yml` checks sums (ORG's command plus quran.json, the 604 page fonts and both other fonts) and runs validate on every push and pull request, builds and uploads the site; the deploy job runs only when started by hand on main.
- Tests: `tmp/tools/phase6_checks.py` 26 of 26 (the built site served under /quran-verse-openings/: no request outside it, no missing file, fonts load, no console errors; header rows and no sideways scroll at 320 to 1400 px and 844x390 in both languages; banner palettes per theme; view button names). Phase 5 46 of 46, Phase 4 65 of 65, movement 132 of 132, overlay on 32 pages identical to Phase 3. validate 20 pass + 1 skip, `--full` 24 pass.
- Files changed: new `.github/workflows/deploy.yml`, `scripts/build-site.mjs`, `scripts/lib/fontcheck.mjs`, `data/sources/qcf2.sha256`; changed `index.html`, `src/styles.css`, `scripts/validate.mjs`. Nothing committed.
- Messages sent: ORG, DOCU, AUD (Phase 6 handoff).
- Open items: Hassan decides public or private (free GitHub Pages needs a public repo; once published, anyone can download the fonts the site uses, whatever the repo's visibility) and pushes; then switch on Pages (Source: GitHub Actions) and run the workflow by hand. ORG: `_site/` in .gitignore?

## 2026-11-01 17:30, ORG, Phase 5 closed

- Did: Phase 5 got PASS from AUD. Moved the 6 Phase 5 entries to `docs/handoff-archive/phase-5.md` and 1 late Phase 4 entry to the top of `docs/handoff-archive/phase-4.md`. No `tmp/` cleanup: `tmp/renders/pdf/`, `tmp/downloads/`, `tmp/phase3/`, `tmp/phase5/` kept as AUD asked, and `tmp/phase4/` and `tmp/compare/` kept because docs point to them. Saved the audited Phase 5 state as tree snapshot `refs/snapshots/phase-5` (validated), so BUILDER can start Phase 6.
- Files changed: `docs/HANDOFF.md`, `docs/handoff-archive/phase-4.md`, `docs/handoff-archive/phase-5.md` (new), git index and refs.
- Messages sent: AUD, BUILDER, DOCU (archive done, snapshot saved).
- Open items carried into Phase 6: Hassan pushes `80d62f6` (remote still empty). Commits from `refs/snapshots/phase-4` and `refs/snapshots/phase-5` wait on approval from Hassan. Repo stays private until Hassan says public, which free GitHub Pages needs in Phase 6. Second "Aud" session (P1-12).
