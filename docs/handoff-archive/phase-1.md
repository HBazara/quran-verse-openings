# HANDOFF archive: Phase 1

Phase 1 (Setup and data check) got PASS from AUD on 2026-10-31 at 17:30. These are the Phase 1 entries moved out of `docs/HANDOFF.md` by ORG, newest at the top.

## 2026-10-31 17:45, DOCU, Phase 1 closed

- Did: Recorded ORG's phase 1 close-out (handoff archive, `tmp/` cleanup) in `docs/DEVLOG.md`.
- Files changed: `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: ORG (please archive my 17:35 entry, it missed `phase-1.md`).
- Open items: update DECISIONS and DATA-SOURCES when Hassan answers D23 to D25.

## 2026-10-31 17:40, ORG, Phase 1 closed

- Did: Phase 1 got PASS from AUD. Moved all Phase 1 entries to `docs/handoff-archive/phase-1.md`. Cleaned `tmp/` as agreed: removed `tmp/venv/` (397 MB), `tmp/phase1/visual/` (123 MB) and the 36 loose files in `tmp/renders/`. Kept `tmp/renders/pdf/` (625 page images), `tmp/downloads/`, `tmp/tools/` and the rest of `tmp/phase1/`. `tmp/` is now 207 MB.
- Files changed: `docs/HANDOFF.md`, `docs/handoff-archive/phase-1.md` (new), `docs/handoff-archive/.gitkeep` (removed), `docs/STRUCTURE.md`.
- Messages sent: AUD, BUILDER, DOCU (archive and cleanup done).
- Open items carried into Phase 2: Phase 2 starts only after Hassan decides P1-08 (QCF2 font licence), P1-09 (V2 font choice) and D25 (QUL account). Also with Hassan: P1-04 (repo name), P1-05 (first commit), P1-06 (publishing the PDF), P1-12 (second "Aud" session). BUILDER needs `tmp/venv` rebuilt for Phase 2 checks.

## 2026-10-31 17:35, DOCU, Phase 1

- Did: Corrected D23 in `docs/DECISIONS.md` per BUILDER: layout is V2 (QUL 10) in both options. The choice for Hassan is only the font: `qpc-hafs` (QUL 245) with the Unicode script 312, or QCF2 (QUL 249) with the V2 glyph script 61. Added QUL font 245 to `docs/DATA-SOURCES.md`. Recorded AUD's Phase 1 PASS in `docs/DEVLOG.md` and `README.md`. Prettier clean, no em dashes.
- Files changed: `README.md`, `docs/DECISIONS.md`, `docs/DATA-SOURCES.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (D23 wording changed after PASS, facts unchanged). BUILDER (D23 corrected).
- Open items: when Hassan answers D23 to D25, update DECISIONS and DATA-SOURCES. Phase 2 download versions and checksums from BUILDER.

## 2026-10-31 17:01 (BUILDER clock), BUILDER, Phase 1

- Did: Read DOCU's Phase 1 docs for the facts that came from BUILDER. They are correct, except that D23 option (a) and AUD's P1-09 frame the `qpc-hafs` suggestion as a different layout. The "1421H print" layout in `PROJECT.md` is QUL layout 10 (V2), the one picked; only the font and glyph script differ. Read AUD's Phase 1 PASS.
- Files changed: `docs/HANDOFF.md`.
- Messages sent: DOCU (will send official download versions, dates and checksums in Phase 2; D23 option (a) correction), AUD (P1-09 wording: layout unchanged, only the font differs).
- Open items: Phase 2 does not start until Hassan decides P1-08 (QCF2 font licence), P1-09 (font choice) and D25 (QUL account for the official downloads).

## 2026-10-31 17:30, AUD, Phase 1

- Did: Re-checked DOCU's update. DATA-SOURCES (all hashes match), README credits, DECISIONS D23 to D25, no em dashes. Phase 1 work: **PASS**. Phase 2 is gated on Hassan: P1-08 (font licence), P1-09 (V2 layout and fonts), D25 (QUL account).
- Files changed: docs/AUDIT.md, docs/HANDOFF.md.
- Messages sent: BUILDER, ORG, DOCU (Phase 1 PASS and the Hassan gate).
- Open items: Hassan: P1-04, P1-05, P1-06, P1-08, P1-09, P1-12. AUD runs the 25-page check in Phase 3.

## 2026-10-31 17:25, DOCU, Phase 1

- Did: Documented BUILDER's edition check. Re-ran `tmp/phase1/checksums.sha256` (47 of 47 OK). `docs/DATA-SOURCES.md`: edition, page offset, picked QUL resources (layout 10, scripts 61 and 312, font 249), Tanzil 1.1, licenses, per-file checksums, reference pages, the warning about Tanzil's page map, and existing renderers. `docs/DECISIONS.md`: D1 confirmed, D3 notes the 8 lines on pages 1 and 2, D23 (V2 layout and QCF2 fonts over `qpc-hafs`, awaiting Hassan), D24 (QCF2 license, pending), D25 (QUL account, pending), D26 (no Tanzil page map), D27 (build our own renderer). `README.md`: status and credits for QUL, KFGQPC and Tanzil with links and CC BY 3.0. `docs/DEVLOG.md`: BUILDER, AUD, ORG and DOCU phase 1 steps. Ran Prettier on all my docs (all clean). No em dashes.
- Files changed: `README.md`, `docs/DATA-SOURCES.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (P1-02, P1-09 DOCU part, P1-10, P1-11 ready to re-check). ORG (Prettier done). BUILDER (ack, please send phase 2 download versions and checksums).
- Open items: `docs/DATA-SOURCES.md` needs the official phase 2 downloads (versions, dates, checksums) after Hassan's QUL login. D23 to D25 wait on Hassan.

## 2026-10-31 16:58 (BUILDER clock), BUILDER, Phase 1

- Did: Read AUD's acceptance of P1-01 (no BUILDER items left in `docs/AUDIT.md`) and ORG's tmp/ cleanup plan. Asked ORG to also keep `tmp/tools/` and `tmp/phase1/` (except `visual/`); ORG agreed.
- Files changed: `docs/HANDOFF.md`.
- Messages sent: ORG (keep `tmp/tools/` and `tmp/phase1/`).
- Open items: Phase 2 waits for Hassan: P1-08 (QCF2 font licence), P1-09 (layout and font choice), and the official QUL downloads (free account).

## 2026-10-31 17:20, ORG, Phase 1

- Did: Final tmp/ cleanup plan, with BUILDER's additions. This replaces the plan in my 17:12 entry.
- Files changed: `docs/HANDOFF.md`.
- Messages sent: BUILDER (ack).
- Open items: Only after AUD says PASS: archive the Phase 1 entries to `docs/handoff-archive/phase-1.md`. CLEAN only `tmp/venv/`, `tmp/phase1/visual/` and the loose files directly in `tmp/renders/`. KEEP `tmp/renders/pdf/` (AUD, Phase 3), `tmp/downloads/` (Phase 2 inputs), `tmp/tools/` (check scripts), and everything else in `tmp/phase1/` (`pages/`, `strips/`, the `*.json` results, `RESULTS.md`, `checksums.sha256`; BUILDER uses `pages/*.json` in Phase 2).

## 2026-10-31 17:12, ORG, Phase 1

- Did: Updated the tmp/ cleanup plan at AUD's request. This replaces the open items in my 17:05 entry.
- Files changed: `docs/HANDOFF.md`.
- Messages sent: AUD (ack), BUILDER (tmp/renders/pdf is kept for AUD).
- Open items: After Phase 1 PASS (and only after AUD says PASS): archive the Phase 1 entries to `docs/handoff-archive/phase-1.md`. Clean `tmp/venv`, `tmp/phase1/visual`, and the loose files in `tmp/renders/`. KEEP `tmp/renders/pdf/` (625 PDF page images, needed for AUD's Phase 3 overlay check) and `tmp/downloads/` (Phase 2 inputs). P1-05 and P1-06 wait on Hassan.

## 2026-10-31 17:05, AUD, Phase 1

- Did: Audited BUILDER's report (tmp/phase1/RESULTS.md). Verified 47 of 47 checksums and the PDF offset on pages 5 and 604. Accepted P1-01. Raised P1-08 to P1-12. Verdict still NOT PASS: DATA-SOURCES and README are stale (P1-02, P1-10, P1-11), and Hassan must decide the font licence and layout choice.
- Files changed: docs/AUDIT.md, docs/HANDOFF.md.
- Messages sent: DOCU (DATA-SOURCES, README, DECISIONS), BUILDER (accepted, 25 pages wait for Phase 3).
- Open items: DOCU fixes; Hassan: P1-08, P1-09, P1-12.

## 2026-10-31 17:05, ORG, Phase 1

- Did: Tidy pass after BUILDER's Phase 1 report. The repo tree matches `docs/STRUCTURE.md`, nothing is misplaced, and there is no dead code (no code yet). The PDF and `tmp/` are still ignored, and there are no em dashes. `.gitkeep` files stay only in folders that are still empty. `tmp/` was kept as is, at BUILDER's request. `scripts/validate` does not exist yet and there is no site to load, so there was nothing to re-run.
- Files changed: `docs/STRUCTURE.md` (tmp/ line), `docs/HANDOFF.md`.
- Messages sent: DOCU and AUD (tidy done, Prettier warnings on their files).
- Open items: After Phase 1 PASS, clean `tmp/renders`, `tmp/phase1/visual`, `tmp/venv`, and keep `tmp/downloads` until Phase 2. Also after PASS, archive the Phase 1 entries to `docs/handoff-archive/phase-1.md`. P1-05 and P1-06 wait on Hassan.

## 2026-10-31 16:55, BUILDER, Phase 1

- Did: Identified the PDF: KFGQPC Madinah mushaf, Hafs, Uthman Taha, the 1421H edition (text approved 26/1/1420 AH), printed 1429 AH. 625 PDF pages, mushaf page = PDF page minus 3, 15 lines per page. Compared QUL layouts V1 (1405H), V2 (1421H) and V4 (1441H). Picked V2 (QUL layout 10) with the QPC V2 glyph script (61) and the QPC V2 page fonts (249), Unicode text from QUL script 312, cross-check with Tanzil. Checked 42 sample pages: 616 lines and 1,066 line ends, no mismatches (automated matching on every line, 9 pages read in full by eye). Measured that `qpc-hafs` would move words up to 48 px inside a line. Reported to Hassan.
- Files changed: none in the repo. Evidence in `tmp/` (summary in `tmp/phase1/RESULTS.md`, checksums in `tmp/phase1/checksums.sha256`).
- Messages sent: AUD (progress and sample page list; final results), DOCU (sources, checksums, decisions to record), ORG (keep `tmp/` until Phase 1 PASS).
- Open items: Hassan to decide: (1) font: QPC V2 page fonts instead of `qpc-hafs`, (2) QCF2 page fonts have no published licence, (3) the official QUL downloads need a free QUL account. Phase 2 waits for these.

## 2026-10-31 16:50, ORG, Phase 1

- Did: P1-07 fixed: `docs/.gitkeep` removed. `docs/STRUCTURE.md` checked against the real tree and still current. Corrected my 16:33 note: DOCU's entry was never lost.
- Files changed: `docs/.gitkeep` (removed), `docs/HANDOFF.md`.
- Messages sent: AUD (P1-07 fixed).
- Open items: P1-05 and P1-06 wait on Hassan. ORG's tidy pass waits on BUILDER's Phase 1 report (P1-01).

## 2026-10-31 16:45, AUD, Phase 1

- Did: Re-checked ORG and DOCU work. P1-03 and P1-02 fixed (README, DEVLOG, DECISIONS, DATA-SOURCES, USER-GUIDE, STRUCTURE, HANDOFF verified; AGENTS.md matches PROJECT.md). Phase 1 still NOT PASS: P1-01 open (BUILDER edition and layout report). Gave BUILDER my 25 audit pages.
- Files changed: docs/AUDIT.md, docs/HANDOFF.md.
- Messages sent: BUILDER (P1-01, my 25 pages), ORG (P1-03, P1-07), DOCU (P1-02).
- Open items: P1-01 (BUILDER), DATA-SOURCES to be completed (DOCU), P1-07 (ORG), P1-04 to P1-06 (Hassan).

## 2026-10-31 16:38, DOCU, Phase 1

- Did: Confirmed with ListAgents that BUILDER, ORG and AUD are reachable. Earlier (16:16) wrote `README.md`, `docs/DEVLOG.md`, `docs/DECISIONS.md`, `docs/DATA-SOURCES.md` (PDF SHA-256 recorded) and `docs/USER-GUIDE.md`. This turn: recorded ORG's 16:33 work and the new messaging process in DEVLOG and DECISIONS (D21, D22). Added `HANDOFF.md`, `AUDIT.md`, `STRUCTURE.md` and `handoff-archive/` to the README.
- Files changed: `README.md`, `docs/DEVLOG.md`, `docs/DECISIONS.md`, `docs/HANDOFF.md`.
- Messages sent: AUD (P1-02: `README.md` exists, phase 1 docs ready to re-check). ORG (about `HANDOFF.md` and the unneeded `docs/.gitkeep`, then a correction, because ORG had already created `HANDOFF.md`).
- Open items: `docs/DATA-SOURCES.md`, README credits and decision D1 wait on BUILDER's edition check (P1-01).

## 2026-10-31 16:33, ORG, Phase 1

- Did: Added the "How agents keep each other updated" section to `AGENTS.md` and synced the team and phases text with the new `PROJECT.md`. Created `docs/STRUCTURE.md` (AUD P1-03), this file, and `docs/handoff-archive/`. Ran Prettier on `AGENTS.md`.
- Files changed: `AGENTS.md`, `docs/STRUCTURE.md`, `docs/HANDOFF.md`, `docs/handoff-archive/.gitkeep`.
- Messages sent: AUD (P1-03 and HANDOFF fixed, P1-05 waiting on Hassan), DOCU (`AGENTS.md` changed, new files in `docs/`).
- Open items: P1-05, the first commit: waiting for Hassan's go-ahead, because commits need his approval. P1-06 (`*.pdf` ignore rule) is unchanged until Hassan decides about publishing the PDF.
- Note: Removed `docs/.gitkeep`. (An earlier note here said DOCU's entry was lost. That was wrong, nothing was lost. See ORG 16:50.)

## 2026-10-31 16:11, ORG, Phase 1

- Did: Set up the project. Renamed the brief to `PROJECT.md`. Created the folders `src/i18n`, `assets/fonts`, `data`, `scripts`, `docs`, `.github/workflows`. Wrote `AGENTS.md`, `.gitignore` (ignores the PDF and `tmp/`), `.gitattributes`, `.editorconfig`, `.prettierrc.json`, `.prettierignore`. Ran `git init` (no commits).
- Files changed: all of the above.
- Messages sent: none (messaging was not set up yet). Handed off to BUILDER through Hassan.
- Open items: repo name (Hassan).
