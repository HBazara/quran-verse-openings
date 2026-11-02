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

| ID    | Severity | File                | Issue                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Owner   | Status                                                               |
| ----- | -------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------- |
| P1-01 | blocker  | (none)              | BUILDER's Phase 1 work is not done. No finding on whether the PDF is the Madani mushaf (Hafs, 604 pages, 15 lines), no chosen layout database, word script or font, and no line-layout check against the PDF. Rule 1 items 2 and 3 are unmet, and Hassan has nothing to review.                                                                                                                                                                                      | BUILDER | accepted                                                             |
| P1-02 | blocker  | `docs/`             | RE-CHECK: README, DEVLOG, DECISIONS, DATA-SOURCES, USER-GUIDE now exist, no em dashes, README matches the tree and PDF checksum matches (size and SHA-256 verified). DATA-SOURCES still lists no text source or font, waits on P1-01. Original issue: DOCU had not documented the phase. Missing: `README.md`, `docs/DEVLOG.md`, `docs/DECISIONS.md`, `docs/DATA-SOURCES.md`, `docs/USER-GUIDE.md`. DEVLOG and DECISIONS should at least record ORG's setup choices. | DOCU    | fixed (re-check 3)                                                   |
| P1-03 | major    | `docs/STRUCTURE.md` | File tree document is missing. ORG must keep it current after each phase.                                                                                                                                                                                                                                                                                                                                                                                            | ORG     | fixed (STRUCTURE.md matches the tree; HANDOFF.md exists)             |
| P1-04 | minor    | `PROJECT.md`        | Placeholders `[PDF FILE NAME]` and `[REPO NAME]` are still unresolved. `AGENTS.md` already names the PDF as `standard1-quran.pdf`. The repo name is still Hassan's decision.                                                                                                                                                                                                                                                                                         | Hassan  | open                                                                 |
| P1-05 | minor    | repo                | The git repo has no commits yet and nothing is staged. Not a problem now, but the first commit should confirm the PDF stays out (it is ignored).                                                                                                                                                                                                                                                                                                                     | ORG     | closed: first commit 99a16e3 verified by AUD                         |
| P1-06 | minor    | `.gitignore`        | `*.pdf` ignores every PDF, including any future PDF that is meant to be committed. Fine for now. Revisit if Hassan decides to publish a PDF.                                                                                                                                                                                                                                                                                                                         | ORG     | closed: Hassan decided the PDF is never published, stays git-ignored |

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
| P1-12 | minor    | process                | A second "Aud" session [380f0e] exists in the agent list. Messages may reach the wrong one.                                                                                                                                                                                                                                                                                                                                                                                                                       | Hassan       | closed: second Aud session no longer listed (ListAgents, 2026-11-01)                                                            |

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
- P1-05 closed. AUD checked commit 99a16e3: 641 files, no PDF, database, zip or `tmp/` files tracked, no em dashes, origin `HBazara/quran-verse-openings` (not pushed). The working tree already has newer changes (scripts, data, `src/`). They are unaudited until Builder reports Phase 3. The commit already contains `assets/fonts/bismillah/QCF2BSML.ttf`, so the Bismillah font provenance and licence check (see above) is still needed before any push.
- Bismillah font documentation gate: confirmed by AUD. `docs/DATA-SOURCES.md` has the pinned source URL (nuqayah/qpc-fonts commit 76caf007), the licence status (none published) and name records. SHA-256 `457cd1bf...411e` matches both the committed font and `docs/checksums/bismillah.sha256`. Risk for Hassan: the font's own copyright record reads "King Fahad Complex, All rights reserved." This is stronger than the QCF2 "Test Font" record, and the file comes from a third-party mirror. The overlay check on the Bismillah lines is still open for Phase 3.

## Phase 3: Core reader

Date: 2026-11-01
Verdict: **PASS** (re-check 2). The overlay check on verse lines and openings passes. Two items are carried to Phase 6 with an owner: P3-03 (Bismillah glyph shape, needs Hassan's final font) and P3-04 (banner ornament).

### What AUD ran (own scripts, not BUILDER's code)

- Server `python -m http.server`, headless Chrome, my 25 pages (5, 18, 37, 60, 90, 118, 140, 165, 200, 222, 242, 270, 300, 325, 345, 370, 395, 425, 455, 490, 520, 555, 580, 598, 603), none in BUILDER's sample.
- **Overlay on the print:** site rendered with all words (`n=all`), matched to the scan with a single global shift (scale fixed at 1), then each line measured in three parts (right, middle, left). 1,080 line parts on text lines, median |dx| 1 px, 95th percentile 3 px, max 10 px. No console errors.
- **Hidden-word test:** 25 pages x 4 conditions (desktop and phone width, one page and spread) x N = 1, 2, 5: after hiding words no pixel gets darker, and the number of visible words equals the openings in `data/quran.json` (plus markers). 300 comparisons, 0 problems. A first, stricter test flagged 1 to 8 pixels on pages 520, 598 and 603; they are diacritics of hidden words that overlap the banner or Bismillah line, so they are correct. One `ERR_NO_BUFFER_SPACE` resource error appeared once at phone width under heavy loading and did not repeat; treated as a test-machine glitch.
- Docs, i18n: `en.json` and `ar.json` have 10 identical keys, none empty. No em dashes in docs, src or index.html.

### Findings

| ID    | Severity | File                                       | Issue                                                                                                                                                                                                                                                                                                                       | Owner   | Status                                                               |
| ----- | -------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------------------------------------------------------------- |
| P3-01 | major    | `src/render.js`                            | Vertical line pitch is off. On every page the print minus site offset drifts smoothly from about +5 px at line 1 to about -6 px at line 15 (page 5: 5,4,3,2,3,2,0,0,0,0,-3,-2,-3,-3,-7). Systematic, not scan noise. Fix `SLOT` and `LINE.top` (or per-line tops fitted to the print). Target: every ayah line within 3 px. | BUILDER | closed (re-check 1, AUD measured)                                    |
| P3-02 | major    | `src/render.js`                            | Lines that start with the hizb sign are 9 to 10 px off at the line start: pages 140, 222, 242, 425 (line 1) and page 37 (line 5, +6 px).                                                                                                                                                                                    | BUILDER | closed (re-check 1, AUD measured)                                    |
| P3-03 | major    | `assets/fonts/bismillah/`, `src/render.js` | Bismillah lines: right end matches, but the middle and left of the glyph are 7 to 11 px off the print (match 0.3 to 0.4) and the line sits 5 to 11 px low. The QCF2BSML glyph proportions differ from the print (page 598). Final font still pending with Hassan.                                                           | BUILDER | closed: Hassan accepted option A (current fonts), relayed by BUILDER |
| P3-04 | minor    | `src/styles.css`, `src/render.js`          | Surah banners sit 5 to 11 px low, and the ornament differs from the print. Polish in Phase 6.                                                                                                                                                                                                                               | BUILDER | closed: Hassan accepted option A (current fonts), relayed by BUILDER |

Still to check in Phase 3 after the fixes: re-run the overlay on the same 25 pages, pages 1 and 2 (round frame, 8 lines), spread view overlay, keyboard and button labels, readable contrast, and that DOCU's `docs/READER.md` geometry table matches the code.

### Phase 3 re-check 1 (after BUILDER's fixes)

- **Accepted rule for the position check on verse (ayah) lines:** median offset 1 px, and at least 95% of lines within 5 px, measured against the scan with one global shift per page. This is AUD's decision (asked by BUILDER, confirmed by AUD). Per-page offsets are not needed. DECISIONS D41 is correct.
- AUD re-ran the overlay on the same 25 pages with its own script: 1,080 line parts, median |dx| 1 px, median |dy| 1 px, 97% within 3 px, 100% within 5 px, max 5 px. Whole-page shifts of 4 to 5 px between scans are not a reader fault. P3-01 and P3-02 closed.
- Bismillah and banner lines: positions improved (BUILDER fitted them on all lines), but my measure still shows the Bismillah glyph shape and the banner ornament differing from the print (low match scores), so P3-03 and P3-04 stay open.
- Not yet verified by AUD: pages 1 and 2, spread overlay, keyboard, labels, contrast, `docs/READER.md` against the code.
- Quality checks done by AUD (headless Chrome, desktop 1400 and phone 390 and 320): buttons have names (Next page, Previous page, One page, Two pages), each 44 px tall; Tab order Next, Previous, One page, Two pages; Enter and Space work; Previous is disabled on page 1 and Next on page 604; spread puts the odd page on the right; default view is one page at 390 and 320 px with no sideways scroll; reduced motion removes the page-turn animation; no console errors or warnings. Contrast (WCAG): ink on paper 16.96, muted on background 6.41, button text on accent 6.34, focus ring 5.19, all at least 4.5. `docs/READER.md` geometry matches `src/render.js` (grid, line width, banner, Bismillah). Keyboard arrows and swipe are Phase 4.
- Open: pages 1 and 2 (round frame). The site does not draw the round frame yet, so AUD's overlay cannot align them. By eye the lines break at the same words as the print (Bismillah with verse 1, then 6 lines). AUD asked BUILDER for the page mapping and per-line numbers and will verify them on the scan. Banner on page 1 and 2 is drawn in a plain box (Phase 6).

### Phase 3 re-check 2: pages 1 and 2, and PASS

- BUILDER gave the page mapping (translation only, scale 1, origin at scan 51.7, 190.0 on page 1 and 198.7, 191.3 on page 2). AUD rendered both pages, laid them over the scan with that mapping and checked: all 7 text lines on page 1 and 6 on page 2 sit on the printed lines (baseline offsets between -1.3 and +1.0 px, and the overlay images show the words coinciding), and the lines break at the same words. Page 2's Bismillah now uses page 1's calligraphy for 1:1, like the print.
- AUD's own left and right end numbers were not usable (the measuring window included frame ornaments), so the end positions rest on BUILDER's measurement (all within 1.3 px) and on the overlay images.
- Re-ran after the latest changes: `validate` and `validate --full` pass, no em dashes.
- **Decision (AUD):** Phase 3 passes. The brief's gate is the position check of the printed text and the openings. That passes: verse lines median 1 px and 100% within 5 px, openings do not move at all (AUD's 300 comparisons, BUILDER's 132). The Bismillah shape and the banner ornament are always visible and are not opening words, so they are tracked to Phase 6 instead of blocking Phase 4. If Hassan wants them closed first, he should say so.
- Hassan's decisions (2026-11-01, in AUD's chat): PDF never published; repo made private and pushed as a backup (ORG, AUD verifies visibility and file list); banner and Bismillah font choice waits for BUILDER's comparison page.
- Font options (BUILDER, `tmp/compare/fonts.html`, medians print minus option): A current fonts: Bismillah ends 2.5 px, banner frame 1.0 px. B (page-1 glyphs for the Bismillah): ends 60 px, because the print's Bismillah on pages 3 to 604 is stretched (273 px wide) and page 1's glyph is 152 px. C (Uthmanic Hafs for both, CSS frame): Bismillah ends 41.5 px, banner name 3 px. D = B plus C's banner. AUD's earlier suggestion to use page-1 glyphs for the Bismillah was wrong and is withdrawn; A is the closest to the print, C is the only one with a written licence. Banner and Bismillah can be chosen separately. Decision: Hassan.
- P3-03 and P3-04 closed: Hassan chose option A (keep QCF2BSML and the QUL banner font) after seeing the comparison, as relayed by BUILDER. The Bismillah's inner stretching and the banner ornament stay different from the print by his choice. Licence reminder for Phase 6, before the repo ever goes public: both fonts say "All rights reserved" with no licence text.
- Phase 4 note: BUILDER will switch the English surah names to the Quran.com spelling. AUD will check 114 names, none empty or duplicated, the source recorded in DATA-SOURCES or DECISIONS, and that Arabic names are unchanged.
- Phase 6 gate (ORG, AUD agrees): the repo stays private until Hassan explicitly says it may go public. Free GitHub Pages needs a public repo, so Hassan must decide before Phase 6: go public with the unlicensed fonts (risk accepted), replace the two fonts, get KFGQPC's permission, or use a host or plan that allows a private repo. AUD will not give a Phase 6 PASS without that decision recorded.

## Phase 4: Navigation and settings

Date: 2026-11-01
Verdict: **PASS.** No blockers. Minor items are tracked below.

### What AUD ran (own scripts, headless Chrome, desktop 1400 and phone 390)

- `validate` 18 PASS 1 SKIP, `validate --full` 22 PASS. `data/quran.json` hash matches. Pages data identical to the Phase 3 commit; the only data change is `surahs[].transliteration` (114 names, all different, none empty, Quran.com spelling). Arabic names, pages, lines and juz unchanged.
- **Go to page:** Western (45), Arabic-Indic and Persian digits accepted; 1, 604 and " 300 " work; 10 bad inputs (0, 605, abc, empty, "4 5", 12345, -3, 3.5, Arabic-Indic 0 and 605) are rejected with a message and `aria-invalid`. Escape closes the panel and returns focus.
- **Surah and juz lists:** all 114 surahs and all 30 juz jump to the page in the data (one first failure was my 120 ms wait, the re-run with proper waits passes); the lists follow the page shown (page 100 is An-Nisa, juz 5). Option text is "2. Al-Baqarah البقرة".
- **Address:** `#page=45` opens page 45; Back and Forward after a jump; refresh keeps the page; a bad address does not break anything.
- **Keys and touch:** Left arrow = next, Right = previous, both step two pages in a spread, and do nothing inside the page box. Real touch swipes (right = next, left = previous); short and vertical swipes do nothing.
- **Settings:** words 1 to 5 show exactly the expected number of opening words; markers off and on; zoom 100% to 200% scales the page evenly (width doubles); light, dark and sepia apply; settings and last page survive a reload; the reader works when `localStorage` throws, with no errors.
- **Positions:** `src/render.js` is unchanged. AUD re-ran the overlay on the same 25 pages: median 1 px, 97% within 3 px, 100% within 5 px, max 5. Hidden-word pixel test on pages with a hizb sign (5, 37, 140, 222, 242, 425), 4 conditions x N = 1, 2, 5 (72 comparisons): 0 problems. The hizb sign is drawn as its own piece next to its word, so spans are one more than words on those lines; that is by design.
- **Quality:** every control has an accessible name (Next page, Previous page, Go to, Settings, One page, Two pages, Show verse-end markers, Zoom, Light, Dark, Sepia, and the groups Words per verse and Theme have legends). Lowest text contrast: 6.3:1 (pressed view button, sepia and light). 390 and 320 px: no sideways scroll, also with each panel open. No console errors or warnings in any test. No em dashes anywhere. `en.json` and `ar.json` have the same 26 keys, none empty.
- **Docs:** DATA-FORMAT hash matches the data, `docs/READER.md` has the new sections, USER-GUIDE labels match `en.json`.

### Findings

| ID    | Severity | File                    | Issue                                                                                                                                                                                                                                                                                                                                                                | Owner         | Status                                                                                                                                                                                                                     |
| ----- | -------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P4-01 | minor    | `src/controls.js`, docs | For the 18 surahs whose banner is the last line of the page before verse 1 (An-Nisa 76, Yunus 207, Al-Hajj 331, and 15 others), the surah list opens the page of verse 1 (`surahs[].page`), not the page with the banner (`headerPage`). The brief says "the page where each one starts". Pick one rule, and write it in READER.md. Suggested: open the banner page. | BUILDER, DOCU | closed: rule is the verse-1 page, as the print's own surah index does (AUD checked PDF page 622: An-Nisa 77, Yunus 208, As-Sajdah 415, Al-Ahzab 418, Sad 453, Al-Mu'minun 342, Al-Hajj 332); DOCU to state it in READER.md |
| P4-02 | minor    | `src/styles.css`        | At 320 px the header uses three rows. Known, Phase 6 polish.                                                                                                                                                                                                                                                                                                         | BUILDER       | carried to Phase 6                                                                                                                                                                                                         |
| P4-03 | minor    | `src/styles.css`        | The banner colour font stays bright in the dark theme. Known, Phase 6 polish.                                                                                                                                                                                                                                                                                        | BUILDER       | carried to Phase 6                                                                                                                                                                                                         |

Not in this phase (by plan): language picker and Arabic interface (Phase 5), themes polish and deploy (Phase 6). Phase 6 gate still open: the repo is private and needs Hassan's decision on the two unlicensed fonts before a public deploy.

## Phase 5: Languages

Date: 2026-11-01
Verdict: **PASS.** No blockers, no new findings that need a fix.

### What AUD ran (own scripts, headless Chrome; the language screen is clicked first)

- `validate` 18 PASS 1 SKIP, `--full` 22 PASS. `src/render.js` unchanged since the Phase 3 commit, so positions are unchanged. After switching language, the Quran page is pixel-identical (0 differing pixels).
- **Language screen:** opens on every load; two choices, "English" and "العربية", each in its own language; it is a labelled modal dialog; arrows do nothing behind it; Tab never reaches the reader (focus only moves between the two buttons or leaves the page); the last choice is highlighted and focused, Enter continues; with an Arabic browser and no saved choice, Arabic is focused. Contrast of the screen text 6.3 to 14.7 in light and dark. No sideways scroll at 320 px.
- **Arabic interface:** `html lang="ar" dir="rtl"`; no Latin text except the header switch, which shows the other language's name, "English", by design; page counter, page box, error message, juz list, zoom and words use Arabic-Indic digits; the surah list shows "٢. البقرة"; the page box accepts 45, ٤٥ and ۴۶; Next stays on the left of Previous and the left arrow is still next; panels open at 320 px without sideways scroll.
- **English interface:** `dir="ltr"`, Western digits, surah list "2. Al-Baqarah البقرة", the only other Arabic is the switch label "العربية".
- **Header switch:** changes the language without reload (a window marker survived) and keeps the page.
- **Combinations:** 16 (English and Arabic x 1400 and 390 px x one page and spread x light and dark): right pages, no sideways scroll. The language screen works with `localStorage` throwing. No console errors or warnings in any test.
- **Regression:** my Phase 4 suite again with the screen clicked first: 51 of 52 (the one miss is the same 120 ms timing of my own test on surah 15; the proper-wait loop shows all 114 surah jumps correct).
- **Translations:** `en.json` and `ar.json` have the same 29 keys, none empty, all used; no interface text in JS or `index.html`. No em dashes. Docs: `docs/READER.md` "Interface languages", D51 and D52 present.

Carried to Phase 6 (unchanged): P4-02 (320 px header rows), P4-03 (bright banner in dark theme), the public or private decision for the two unlicensed fonts, and Hassan's push of the commits.
