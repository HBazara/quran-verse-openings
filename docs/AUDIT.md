# AUDIT

Auditor: AUD. Read-only on code and docs. This file is the only thing AUD writes.

## Phase 1: Setup and data check

Date: 2026-10-31 (re-check 3 after DOCU update)
Verdict: **PASS** for the Phase 1 work. All blockers are closed. Phase 2 may start only after Hassan decides P1-08 (font licence) and P1-09 (V2 layout and fonts), because BUILDER needs his answers and a QUL account (D25) for the downloads.

### What was checked

| Check                                                              | Result                                                                                             |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| Folder layout matches PROJECT.md structure                         | OK. All folders exist. Only `.gitkeep` placeholders inside.                                        |
| `AGENTS.md` matches PROJECT.md                                     | OK. Role sections and phase list are identical to PROJECT.md.                                      |
| `.gitignore` excludes the PDF and `tmp/`                           | OK. `git check-ignore` confirms `standard1-quran.pdf` and `tmp/` are ignored.                      |
| Formatter and editor config                                        | OK. `.editorconfig`, `.prettierrc.json`, `.prettierignore`, `.gitattributes` present and sensible. |
| Em dashes in docs, config, comments                                | OK. None found.                                                                                    |
| PDF edition identified, page count and layout confirmed            | MISSING. No report exists.                                                                         |
| Matching layout data and font found                                | MISSING. `data/`, `assets/fonts/` are empty.                                                       |
| 25-page PDF spot check (lines, first and last word)                | MISSING. No `tmp/` renders and no notes.                                                           |
| DOCU files (README, DEVLOG, DECISIONS, DATA-SOURCES, USER-GUIDE)   | MISSING. `docs/` was empty before this file.                                                       |
| `docs/STRUCTURE.md`                                                | MISSING.                                                                                           |
| Text integrity, layout data, position, feature, translation checks | Not applicable yet. No data or code exists.                                                        |

### Findings

| ID    | Severity | File                | Issue                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Owner   | Status                                                   |
| ----- | -------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------- |
| P1-01 | blocker  | (none)              | BUILDER's Phase 1 work is not done. No finding on whether the PDF is the Madani mushaf (Hafs, 604 pages, 15 lines), no chosen layout database, word script or font, and no line-layout check against the PDF. Rule 1 items 2 and 3 are unmet, and Hassan has nothing to review.                                                                                                                                                                                      | BUILDER | accepted                                                 |
| P1-02 | blocker  | `docs/`             | RE-CHECK: README, DEVLOG, DECISIONS, DATA-SOURCES, USER-GUIDE now exist, no em dashes, README matches the tree and PDF checksum matches (size and SHA-256 verified). DATA-SOURCES still lists no text source or font, waits on P1-01. Original issue: DOCU had not documented the phase. Missing: `README.md`, `docs/DEVLOG.md`, `docs/DECISIONS.md`, `docs/DATA-SOURCES.md`, `docs/USER-GUIDE.md`. DEVLOG and DECISIONS should at least record ORG's setup choices. | DOCU    | fixed (re-check 3)                                       |
| P1-03 | major    | `docs/STRUCTURE.md` | File tree document is missing. ORG must keep it current after each phase.                                                                                                                                                                                                                                                                                                                                                                                            | ORG     | fixed (STRUCTURE.md matches the tree; HANDOFF.md exists) |
| P1-04 | minor    | `PROJECT.md`        | Placeholders `[PDF FILE NAME]` and `[REPO NAME]` are still unresolved. `AGENTS.md` already names the PDF as `standard1-quran.pdf`. The repo name is still Hassan's decision.                                                                                                                                                                                                                                                                                         | Hassan  | open                                                     |
| P1-05 | minor    | repo                | The git repo has no commits yet and nothing is staged. Not a problem now, but the first commit should confirm the PDF stays out (it is ignored).                                                                                                                                                                                                                                                                                                                     | ORG     | open                                                     |
| P1-06 | minor    | `.gitignore`        | `*.pdf` ignores every PDF, including any future PDF that is meant to be committed. Fine for now. Revisit if Hassan decides to publish a PDF.                                                                                                                                                                                                                                                                                                                         | ORG     | open                                                     |

### To get PASS

1. BUILDER confirms the PDF edition and page count, picks the layout data and font (QUL first, check terms), does the 25-page spot check, and reports to Hassan.
2. DOCU finishes `docs/DATA-SOURCES.md` with the chosen sources (the other docs are done).
3. AUD re-checks. Also needed from Hassan: a decision after BUILDER's report, as the phase says to stop and report before continuing.

### Re-check 1 notes

- AGENTS.md: roles, phases and the messaging section match PROJECT.md. OK.
- New minor P1-07 (ORG): `docs/.gitkeep` is now redundant because `docs/` has files. Remove it and keep STRUCTURE.md current.
- P1-05 and P1-06 wait on Hassan. A missing first commit does not block PASS.
- P1-07 verified fixed: `docs/.gitkeep` is gone and STRUCTURE.md still matches the tree.

### Re-check 2 notes (BUILDER's report, `tmp/phase1/RESULTS.md`)

What AUD verified itself:

- All 47 checksums in `tmp/phase1/checksums.sha256` match the files on disk (run from the project root).
- PDF page map: PDF page 607 shows mushaf page 604 (An-Nas), PDF page 8 shows mushaf page 5 with 15 lines. Offset of 3 holds on both.
- The report is complete and consistent: edition evidence, sample of 42 pages, method, 1,066 of 1,066 line ends, comparison with V1 and V4, font measurement, licences, warnings.

What AUD could not do yet: the independent 25-page check (my pages: 5, 18, 37, 60, 90, 118, 140, 165, 200, 222, 242, 270, 300, 325, 345, 370, 395, 425, 455, 490, 520, 555, 580, 598, 603). It needs the layout data and fonts in the repo, which arrive in Phase 2, and the site in Phase 3. Phase 1 evidence is BUILDER's own, with AUD's spot checks above. AUD will repeat the line and word check on these pages once `data/quran.json` exists.

New findings:

| ID    | Severity | File                   | Issue                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Owner        | Status                                                                                                                          |
| ----- | -------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| P1-07 | minor    | `docs/.gitkeep`        | Redundant file.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | ORG          | fixed                                                                                                                           |
| P1-08 | major    | font                   | The V2 page fonts (QCF2, 604 files) have no published licence (name record says "Test Font, KFGQPC"). We would self-host them on a public site. Hassan must accept the risk or choose another option before Phase 2.                                                                                                                                                                                                                                                                                              | Hassan       | accepted by Hassan (relayed by BUILDER, 17:50); credit KFGQPC and QUL, DOCU to record in D24                                    |
| P1-09 | major    | `PROJECT.md`           | Corrected after BUILDER's reply: the layout is the one PROJECT.md asked for (QUL layout 10, V2). The only departure is the font: QPC V2 page fonts with the V2 glyph script instead of `qpc-hafs`, for measured reasons (word centres move up to 47.6 px with QPC Hafs). Allowed by "use the font the layout was built for", but Hassan must confirm. Rule 1 items 1 and 5 need small rewording because openings come from the Unicode text (script 312) and are drawn with V2 glyphs at the same word locations. | Hassan, DOCU | closed: decided by Hassan, D23 recorded by DOCU. Only the optional PROJECT.md wording of Rule 1 items 1 and 5 stays with Hassan |
| P1-10 | minor    | `docs/DATA-SOURCES.md` | Needs per-file checksums, licences and download dates. Source for these: BUILDER's RESULTS.md section 8 and `checksums.sha256` (both in ignored `tmp/`, so DOCU should copy the needed values). Tanzil is CC BY 3.0 and needs credit and a link in README.                                                                                                                                                                                                                                                        | DOCU         | fixed (re-check 3)                                                                                                              |
| P1-11 | minor    | `README.md`            | Credits must name QUL (Tarteel), KFGQPC and Tanzil (with link) before Phase 6.                                                                                                                                                                                                                                                                                                                                                                                                                                    | DOCU         | fixed (re-check 3)                                                                                                              |
| P1-12 | minor    | process                | A second "Aud" session [380f0e] exists in the agent list. Messages may reach the wrong one.                                                                                                                                                                                                                                                                                                                                                                                                                       | Hassan       | open                                                                                                                            |

Notes for later phases: the print has hizb and quarter boxes in the margin (page 5), so Phase 8 markers must come from the V2 data. Tanzil page maps follow a different print on some pages and must not be used for pages.

### Re-check 3 notes

- DATA-SOURCES.md: edition, picked sources, licences and all 47 checksums verified. Every hash in the doc matches `tmp/phase1/checksums.sha256` (no extras, none missing).
- README.md credits name QUL (Tarteel), KFGQPC and Tanzil (CC BY 3.0, link). DECISIONS D23 to D25 are recorded as awaiting Hassan. No em dashes in any doc.
- Still open and owned by Hassan: P1-04, P1-05, P1-06, P1-08, P1-09, P1-12. Phase 1 closes with PASS; Phase 2 is gated on P1-08, P1-09 and D25.

- Hassan accepted the QCF2 licence risk (P1-08), relayed by BUILDER. P1-09 (font choice) waits on Hassan's side-by-side comparison in `tmp/compare/`. D25: Hassan will do the QUL downloads himself.
- Hassan chose the V2 page fonts (P1-09) and finished the QUL downloads (D25), relayed by BUILDER. Phase 2 started. Phase 3 note: printed lines are not on a perfectly even grid (page 187 drifts up to 15 scan px), so the overlay check compares each line's real position, not a fixed grid.
- DOCU edited PROJECT.md (repo name `quran-verse-openings`, PDF name, Rule 1 items 1, 4, 5 and new item 7: no raw QUL databases in git) and says Hassan allowed it. AUD could not verify that permission, only that the edits match D14, D29, D30. P1-04 is closed.
- New P1-13 (minor, ORG): `AGENTS.md` line 9 still says the repo name is undecided. ORG is to sync. Also re-check that AGENTS.md matches PROJECT.md Rule 1 after the edits.
- Phase 2 risk (BUILDER): with raw QUL files out of git (Rule 1 item 7), `scripts/validate` in GitHub Actions must still run every text and layout check from committed data. Cross-checks that need raw sources must be possible to run locally and be documented.
- P1-13 verified fixed by ORG: AGENTS.md has the repo name and Rule 1 item 7, roles, messaging and phases match PROJECT.md, `.gitignore` blocks QUL database files and does not ignore `data/quran.json`.
- Phase 2 plan per ORG (final): `data/sources/` holds the 2 Tanzil files (byte-exact) and `SHA256SUMS` for all 5 sources. QUL databases stay local. `data/` also gets `quran.json`, `quran.json.sha256`, `tanzil-differences.json`. CI runs the internal checks and the Tanzil cross-check. QUL word, glyph and line checks run only with `--full` locally. AUD will run `--full` and require its output as Phase 2 evidence. Committing Tanzil needs the CC BY 3.0 credit and link in README (already there) and verbatim copies.

## Phase 2: Data pipeline

Date: 2026-10-31
Verdict: **PASS.** Data, scripts, ORG's tidy and DOCU's docs are audited. No blockers. Phase 3 may start. One minor item (P2-05, code comments still point to `tmp/`) is carried to the Phase 3 check.

### What AUD ran

- `node scripts/validate.mjs`: 13 PASS, 1 SKIP (the QUL checks, by design in CI mode).
- `node scripts/validate.mjs --full`: 16 PASS.
- AUD's own script (not BUILDER's code), reading the QUL databases directly: 83,668 words and 6,236 verses in 114 surahs; every word's id, text, verse, position and V2 glyph code in `data/quran.json` identical; all 9,046 layout lines identical (type, centring, surah, first and last word, no gaps); verse counts per surah match the standard table; 5 x 6,236 openings recomputed independently (31,180), 0 differences, none empty, 1,136 verses shorter than 5 words show whole; every verse ends with exactly one Arabic-Indic marker; no Bismillah inside verse 1 of surahs 2 to 114; Al-Fatiha 1:1 is the 4-word Bismillah; At-Tawbah 9:1 starts with its own text; every surah start page and line matches the layout.
- Mutation test (AUD's own): removed one vowel from 114:3 and updated the hash file. `validate` failed on the Tanzil check, as it should.
- `data/quran.json` SHA-256 matches `quran.json.sha256`. Tanzil files match `SHA256SUMS`. No em dashes in scripts, data docs or any doc. Prettier passes on `scripts/`. `data/quran.json` is not git-ignored.

### Findings

| ID    | Severity | File                                 | Issue                                                                                                                                                                                                                                          | Owner   | Status           |
| ----- | -------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------- |
| P2-01 | minor    | `scripts/validate.mjs`               | By design, a moved word or changed glyph with an updated hash passes in CI mode and is only caught by `--full`. Accepted, documented. Rule: run `--full` before any data commit. CI wiring is planned for Phase 6.                             | BUILDER | accepted         |
| P2-02 | minor    | `data/quran.json`                    | 37:130 is one word ("إِلۡ يَاسِينَ", as in QUL and the print) where Tanzil has two. An opening of 3 or more words shows it whole. Documented in CROSSCHECK.                                                                                    | BUILDER | accepted         |
| P2-03 | minor    | `data/quran.json`                    | The hizb sign ۞ is joined to the next word in 209 words (text like "۞ إِنَّ"), as the brief's rules allow. Phase 3 must draw it from the glyph, not from this text, and must not count it as a word.                                           | BUILDER | note for Phase 3 |
| P2-04 | minor    | `data/quran.json`                    | The Unicode text differs from the print in marks on 9 words (8 pause signs, and 52:37:7). None is within the first 5 words of its verse, so no opening is affected. Documented.                                                                | BUILDER | accepted         |
| P2-05 | minor    | `data/tanzil-differences.json`, docs | The committed differences file points to a cross-check report that exists only in ignored `tmp/phase2/CROSSCHECK.md`. A reader of the repo cannot find it. Copy it into `docs/` (for example `docs/TEXT-CROSSCHECK.md`) and fix the reference. | DOCU    | open             |

### Still open before PASS

1. ~~ORG~~ done: verified `docs/STRUCTURE.md` matches the tree, validate re-run by AUD (13 PASS 1 SKIP, and 16 PASS with `--full`).
2. ~~DOCU~~ done (re-check): README "Run locally", a data format doc, DATA-SOURCES (Phase 2 downloads, checksums), DEVLOG and DECISIONS match the code.

### Re-check notes (Phase 2 docs)

- README "Run locally" and "Deploy", `docs/DATA-FORMAT.md`, `docs/TEXT-CROSSCHECK.md` (same content as the tmp report plus a note), DATA-SOURCES, DECISIONS D26, D29, D32 and DEVLOG match the code and the commands I ran. No em dashes.
- AUD also checked the juz table against the standard starts (for example 2:142 p22, 3:93 p62, 78:1 p582), hizb 60 (87:1, p591) and quarter 240 (100:9, p600). All correct.
- P2-05 is partly done: the report is in `docs/`. BUILDER is still repointing `data/tanzil-differences.json` and two code comments (`scripts/validate.mjs:10`, `scripts/lib/sources.mjs:204`) from `tmp/phase2/CROSSCHECK.md` to `docs/TEXT-CROSSCHECK.md`. If this changes `data/`, BUILDER must re-run `build-data`/`validate --full`. Status: open, minor, does not block PASS.
- Phase 3 notes for BUILDER: the 604 page fonts go to `assets/fonts/` through ORG. The surah banner font (QUL 458) is still not downloaded. Overlay check uses each line's real printed position (grid drift up to 15 scan px). Draw ۞ from the glyph.

### Phase 2 late fix (BUILDER, after PASS): quarter 106

- Print check by AUD: page 264 (PDF page 267) line 14 starts with the hizb sign before 15:49, with the margin marker "ربع الحزب ٢٧" beside it. Quarter 106 = 15:49 is correct. Tanzil's 15:50 was wrong.
- AUD re-ran: `validate` 14 PASS 1 SKIP, `--full` 17 PASS, AUD's own script still 0 failures, `quran.json` hash matches. 199 hizb signs plus 41 surah starts = 240 quarters. Juz are every 8th quarter and hizb every 4th. No em dashes.
- P2-05 verified done: references point to `docs/TEXT-CROSSCHECK.md`. Status: closed. The Phase 2 PASS stands.
- Process note: DOCU must update DATA-FORMAT.md (checks now 14 and 17, quarter source) and DECISIONS D26 to match this change. ORG, DOCU: BUILDER should have messaged you.
- Docu's update for the quarter change verified: DATA-FORMAT (checks 14 and 17, quarters section), D26, DATA-SOURCES, README counts and hash prefix match the code. Closed.
- Phase 3 pre-check (ORG): `assets/fonts/qcf2/` has 604 woff2 page fonts, each checked by AUD against `docs/checksums/qul-fonts-v2.sha256`. The banner font (QUL 458) is in `assets/fonts/surah-header/`. Open licence item: the banner font is not covered by D24, DOCU to record it (owner DOCU, minor).
- Phase 3 note (BUILDER): scripts now write Arabic as numeric code points. AUD re-ran after the change: `validate` 14 PASS 1 SKIP, `--full` 17 PASS, own script 0 failures.
- Phase 3 to check: banner font (D33) and Bismillah font QCF_BSML (D34). The Bismillah font comes from KFGQPC's site or a third-party mirror (nuqayah/qpc-fonts), not QUL. Needed for PASS: exact source URL, licence text, SHA-256 in `docs/DATA-SOURCES.md` and `docs/checksums/`, and a check that the Bismillah lines sit exactly where the print has them (overlay check). Owner: BUILDER and DOCU.
