# HANDOFF archive: Phase 2

Phase 2 (Data pipeline) got PASS from AUD on 2026-10-31 at 21:30. These are the Phase 2 entries moved out of `docs/HANDOFF.md` by ORG, in the order they had in the log.

## 2026-10-31 22:15, ORG, Phase 2 follow-up

- Did: Re-checked BUILDER's post-PASS rebuild (P2-05 references now point to `docs/TEXT-CROSSCHECK.md`, quarter start in surah 15 fixed to 15:49). `validate` 14 pass and 1 skip, `--full` 17 pass, `data/sources` checksums OK, no `tmp/phase` references left in code or data, Prettier clean, no em dashes, no .db or .pdf files untracked. No file moves needed. `docs/STRUCTURE.md` unchanged.
- Files changed: `docs/HANDOFF.md`.
- Messages sent: BUILDER (re-run OK), AUD (data changed after PASS, please re-check), DOCU (new validate check and 15:49 fix for DEVLOG and DATA-FORMAT).
- Open items: AUD to confirm the post-PASS data change.

## 2026-10-31 22:00, ORG, Phase 2 closed

- Did: Phase 2 got PASS from AUD. Moved the 22 Phase 2 entries to `docs/handoff-archive/phase-2.md` and the 2 late "Phase 1 closed" entries to the top of `docs/handoff-archive/phase-1.md`. No `tmp/` cleanup this phase: `tmp/phase2/` is kept because `docs/TEXT-CROSSCHECK.md` points to it, and `tmp/renders/pdf/` and `tmp/downloads/` are needed for Phase 3.
- Files changed: `docs/HANDOFF.md`, `docs/handoff-archive/phase-1.md`, `docs/handoff-archive/phase-2.md` (new).
- Messages sent: AUD, BUILDER, DOCU (archive done).
- Open items carried into Phase 3: P2-05 (BUILDER: code comments still point to `tmp/`). BUILDER will ask ORG where the 604 page fonts go in `assets/fonts/`. Hassan: P1-05 (first commit), P1-06 (publishing the PDF), P1-12 (second "Aud" session).

## 2026-10-31 22:05, DOCU, Phase 2 closed

- Did: Recorded AUD's Phase 2 PASS and findings P2-01 to P2-05 in `docs/DEVLOG.md`. README status now says phase 3. Checked: `data/tanzil-differences.json`, `scripts/validate.mjs:10` and `scripts/lib/sources.mjs:204` still point to `tmp/phase2/CROSSCHECK.md` (BUILDER's open part of P2-05).
- Files changed: `README.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: none.
- Open items: phase 3 docs when BUILDER and ORG finish. Check BUILDER's P2-05 repoint.

## 2026-10-31 20:00, ORG, Phase 2

- Did: Checked DOCU's new `docs/DATA-FORMAT.md` and `docs/TEXT-CROSSCHECK.md` (Prettier clean, no em dashes, `tmp/` only mentioned, not linked). `docs/STRUCTURE.md` needs no change: DOCU's files are covered by the `docs/` line. Changed the cleanup plan: keep ALL of `tmp/phase2/` (3.1 MB) after PASS, because `docs/TEXT-CROSSCHECK.md` says its evidence stays there. This replaces the `tmp/phase2/` part of my 19:45 entry.
- Files changed: `docs/HANDOFF.md`.
- Messages sent: DOCU, BUILDER.
- Open items: After Phase 2 PASS, archive the Phase 2 entries. No `tmp/` cleanup needed this phase.

## 2026-10-31 21:30, AUD, Phase 2

- Did: Audited Phase 2. validate 13 PASS 1 SKIP, `--full` 16 PASS, own independent script 0 failures (83,668 words, 9,046 lines, 31,180 openings), mutation test caught. Docs and STRUCTURE verified. Phase 2: **PASS**. Phase 3 may start.
- Files changed: docs/AUDIT.md, docs/HANDOFF.md.
- Messages sent: BUILDER, ORG, DOCU (Phase 2 PASS, start Phase 3).
- Open items: P2-05 repointing (BUILDER), P1-05 first commit, P1-06, P1-12 (Hassan).

## 2026-10-31 21:45, DOCU, Phase 2

- Did: Documented the built phase 2. Read `tmp/phase2/PHASE2-HANDOFF.md`, the scripts and `data/quran.json`. Ran `sha256sum -c --ignore-missing SHA256SUMS` (OK), `node scripts/validate.mjs` (13 pass, 1 skip) and `--full` (16 pass), Node 24.18.0. New `docs/DATA-FORMAT.md`. Updated `README.md` (status, Run locally, Deploy plan, folders, credits), `docs/DATA-SOURCES.md` (source use table, `data/sources/`, differences list), `docs/DECISIONS.md` (D26 now matches the code: Tanzil supplies juz, hizb and quarter start verses and surah names; D29 built; D32 run `--full` before data commits), `docs/DEVLOG.md`. Prettier clean, no em dashes.
- Files changed: `README.md`, `docs/DATA-FORMAT.md` (new), `docs/DATA-SOURCES.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: ORG (new `docs/DATA-FORMAT.md` for STRUCTURE.md). AUD (phase 2 docs ready). BUILDER (D26 changed to match the code; question about checking juz and hizb starts against the print).
- Also: copied `tmp/phase2/CROSSCHECK.md` to `docs/TEXT-CROSSCHECK.md` (ORG, BUILDER and AUD P2-05), with a provenance note and the validate line updated. Linked it from `README.md` and `docs/DATA-SOURCES.md`.
- Open items: BUILDER to point `data/tanzil-differences.json` and the two code comments at `docs/TEXT-CROSSCHECK.md`.

## 2026-10-31 19:45, ORG, Phase 2

- Did: Tidy pass after BUILDER's Phase 2 build. Re-ran `node scripts/validate.mjs` (13 pass, 1 skip) and `--full` (16 pass), plus `sha256sum -c --ignore-missing` in `data/sources/` (OK). No QUL databases in the repo. No dead code: every export in `scripts/lib/sources.mjs` is used. Prettier is clean (data/ is skipped on purpose: `quran.json` is hashed). No em dashes. Removed `data/.gitkeep` and `scripts/.gitkeep`. Added `scripts/lib/` and `tmp/phase2/` to `docs/STRUCTURE.md`, plus "never hand-edit or reformat" on `data/`. Validate passes again after the changes.
- Files changed: `data/.gitkeep` (removed), `scripts/.gitkeep` (removed), `docs/STRUCTURE.md`, `docs/HANDOFF.md`.
- Messages sent: DOCU and AUD (tidy done), BUILDER (ack, CROSSCHECK.md placement).
- Open items: `data/tanzil-differences.json` points to "the Phase 2 cross-check report", which lives only in ignored `tmp/phase2/CROSSCHECK.md`. Proposed that DOCU copies it into `docs/` (DOCU and BUILDER to settle). After Phase 2 PASS: clean `tmp/phase2/` except `CROSSCHECK.md` and `PHASE2-HANDOFF.md`, and archive the Phase 2 entries.

## 2026-10-31 21:25 (BUILDER clock), BUILDER, Phase 2 (built, handed to ORG and DOCU)

- Did: Finished the Tanzil cross-check (report `tmp/phase2/CROSSCHECK.md`): same words in every verse except 37:130; same letters except 2 hamza encodings; QUL 312's marks match the print except 9 words (52:37:7 small seen, 8 pause signs), none an opening; Tanzil differs from the print far more. Derived surah, juz, hizb and quarter starts (juz pages match the known Madani list). Wrote `scripts/build-data.mjs`, `scripts/validate.mjs`, `scripts/lib/sources.mjs`; generated `data/quran.json` (604 pages, 9,046 lines, 6,236 verses, 83,668 words). `validate` passes 13 checks (1 SKIP: QUL, local only); `--full` passes 16. 10 deliberate-error tests: 9 caught by the default mode, the 10th by `--full`. Rebuild is byte-identical. Nothing committed.
- Files changed: `scripts/build-data.mjs`, `scripts/validate.mjs`, `scripts/lib/sources.mjs`, `data/quran.json`, `data/quran.json.sha256`, `data/tanzil-differences.json`, `data/sources/` (2 Tanzil files, `SHA256SUMS`) (repo, untracked); `tmp/phase2/` (ignored).
- Messages sent: ORG (Phase 2 built, tidy; agreed `data/sources/` plan), DOCU (handoff details, CI plan, credits), AUD (ready to audit; validate plan).
- Open items: ORG tidy, DOCU docs, AUD audit. Phase 3 needs: the 604 woff2 fonts in `assets/fonts/` (ask ORG), the surah banner font (QUL 458, not downloaded). Phase 6: `deploy.yml` runs validate before deploy. Details: `tmp/phase2/PHASE2-HANDOFF.md`.

## 2026-10-31 21:20, DOCU, Phase 2

- Did: Read `tmp/phase2/CROSSCHECK.md` in full. Added a "Text cross-check" section to `docs/DATA-SOURCES.md` (every difference listed). Rewrote D29 with the agreed CI plan (Tanzil files in `data/sources/`, QUL databases local, planned not built). Added D31 (QUL 312 stays the text source). Updated DEVLOG. Checked: all 9 words where QUL 312 differs from the print are word 7 or later, so no opening is affected. Matched D29 to the current `.gitattributes`, `.editorconfig` and `docs/STRUCTURE.md`, because ORG's and BUILDER's messages disagreed.
- Files changed: `docs/DATA-SOURCES.md`, `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER (CROSSCHECK.md validate wording; send commands and formats when built; confirm D29 as recorded). ORG (an out-of-date data/sources/ note, which crossed with ORG's correction; D29 now matches ORG's final plan).
- Open items: document `build-data`, `validate`, `data/quran.json` and `data/sources/` once they exist.

## 2026-10-31 19:15, ORG, Phase 2

- Did: BUILDER's "no data/sources/" message crossed with mine. Final plan, confirmed by BUILDER: `data/sources/` holds Tanzil `quran-uthmani.txt` and `quran-data.js` (byte-exact) plus `SHA256SUMS` for all 5 sources. The 3 QUL databases stay in `tmp/downloads/qul/` (ignored). There is no `data/sources.json`. Restored the `data/sources/**` rules in `.gitattributes` and `.editorconfig`. Updated `data/` in `docs/STRUCTURE.md`: `quran.json`, `quran.json.sha256`, `tanzil-differences.json`, `sources/`. This replaces my 19:05 entry.
- Files changed: `.gitattributes`, `.editorconfig`, `docs/STRUCTURE.md`, `docs/HANDOFF.md`.
- Messages sent: DOCU and AUD (final plan, ignore the 19:05 version).
- Open items: ORG's Phase 2 tidy pass starts when BUILDER reports.

## 2026-10-31 19:05, ORG, Phase 2

- Did: BUILDER dropped `data/sources/` (no raw sources in git, Tanzil included). Removed the now-unused `data/sources/**` rules from `.gitattributes` and `.editorconfig`. `docs/STRUCTURE.md`: `data/` now lists `quran.json` and `sources.json` (manifest only), `scripts/` lists `build-data.mjs` and `validate.mjs`.
- Files changed: `.gitattributes`, `.editorconfig`, `docs/STRUCTURE.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER (ack, CI question), DOCU (D29 replaced by the manifest plan), AUD (FYI).
- Open items: The sources for every committed file stay in `tmp/downloads/`, so never delete them (see `docs/checksums/` and `data/sources.json`). ORG's Phase 2 tidy pass starts when BUILDER reports.

## 2026-10-31 21:00, DOCU, Phase 2

- Did: Checked ORG's changes (`.gitignore` ignores QUL database files, `AGENTS.md` synced, `data/sources/` plan now Tanzil only). Recorded them in D29 and `docs/DEVLOG.md`.
- Files changed: `docs/DECISIONS.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: none.
- Open items: D29 final once BUILDER confirms the `data/sources/` contents and the CI validate approach.

## 2026-10-31 18:55, ORG, Phase 2

- Did: Synced to Hassan's decisions (relayed by DOCU). `AGENTS.md`: repo name `quran-verse-openings`, confirmed edition, picked sources, no QUL databases in git, Rule 1 summary now says the Unicode text (QUL 312) drives openings (AUD P1-13). The role, messaging and phase sections still match `PROJECT.md` word for word. `.gitignore`: added `*.db`, `*.sqlite`, `*.sqlite3`, `*.db.zip`, so QUL databases cannot be committed (Rule 1 item 7). `.gitattributes` comment and the `data/sources/` line in `docs/STRUCTURE.md`: Tanzil text only.
- Files changed: `AGENTS.md`, `.gitignore`, `.gitattributes`, `docs/STRUCTURE.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER (D29 change: only Tanzil in `data/sources/`?), AUD (P1-13 done), DOCU (synced).
- Open items: BUILDER to confirm whether the Tanzil files still go in `data/sources/`, and how CI validates without the QUL databases. Hassan: first commit (P1-05), publishing the PDF (P1-06), second "Aud" session (P1-12).

## 2026-10-31 20:50, DOCU, Phase 2

- Did: Hassan's answers: no QUL databases in git, credit QUL; DOCU may edit `PROJECT.md` and pick the repo name. Picked `quran-verse-openings` (D14). Edited `PROJECT.md`: placeholders filled, edition confirmed, Rule 1 item 1 now names the V2 sources (QUL 10, 61, 249, 312) instead of `qpc-hafs`, items 4 and 5 use the Unicode text (QUL 312), new item 7 (no QUL databases in git). Updated D14, D29, new D30, DATA-SOURCES, README, DEVLOG. Prettier clean, no em dashes.
- Files changed: `PROJECT.md`, `README.md`, `docs/DECISIONS.md`, `docs/DATA-SOURCES.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: ORG (sync `AGENTS.md`, redo the `data/sources/` plan). BUILDER (no QUL databases in git, Rule 1 changes, CI validate impact). AUD (P1-04 and P1-09 rewording done).
- Open items: ORG and BUILDER to settle how CI validates without the QUL databases (D29). First commit (Hassan).

## 2026-10-31 20:35, DOCU, Phase 2

- Did: Recorded ORG's `data/sources/` plan as D29 in `docs/DECISIONS.md` (planned, QUL license question pending Hassan). Noted the `data/sources/` exception in D17 and D20. Added it to `docs/DATA-SOURCES.md` and `docs/DEVLOG.md`. Checked `.gitattributes` and `.editorconfig` match ORG's description. `data/sources/` does not exist yet.
- Files changed: `docs/DECISIONS.md`, `docs/DATA-SOURCES.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: ORG (recorded). BUILDER (the .db checksums are already in `docs/checksums/qul-downloads.sha256`).
- Open items: Hassan: QUL databases in a public repo (D29). Update DATA-SOURCES when `data/sources/` and its `SHA256SUMS` exist.

## 2026-10-31 18:40, ORG, Phase 2

- Did: Answered BUILDER's folder question: verified sources go in `data/sources/` with unchanged names and a `SHA256SUMS` file. `.gitattributes`: `data/sources/** -text -diff` (byte for byte, so checksums and Tanzil's verbatim rule hold, also for the .txt and .js files), plus `*.db`, `*.sqlite`, `*.zip` as binary. `.editorconfig`: all rules unset for `data/sources/**`. Added `data/sources/` to `docs/STRUCTURE.md`.
- Files changed: `.gitattributes`, `.editorconfig`, `docs/STRUCTURE.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER (answer), DOCU (record the decision).
- Open items: Hassan: confirm that the raw QUL databases (no published licence) may be committed to a public repo. D24 covers the fonts only. Phase 3: BUILDER will ask about the 604 woff2 fonts (98 MB) in `assets/fonts/`.

## 2026-10-31 18:20 (BUILDER clock), BUILDER, Phase 2 (in progress, paused: usage limit)

- Did: Hassan picked the V2 page fonts (D23) and downloaded the QUL files. Verified all of them: the official layout matches the 42 checked pages word for word; 604 pages, 114 surahs, 6,236 verses, 83,668 words, no gaps or overlaps; every glyph exists in its page font; woff2 fonts are QUL subsets of the ttf with no visible difference. Sent DOCU the file mapping and checksums (`tmp/downloads/qul-checksums.sha256`, `tmp/downloads/qul-fonts-checksums.sha256`). Tanzil cross-check so far: same word count in every verse except 37:130 (QPC keeps "إل ياسين" as one word, Tanzil two); letters identical in all words after 3 documented spelling conventions, except 2:72:4 and 56:23:2 (hamza spelled differently; the print matches QPC for 56:23:2).
- Files changed: `docs/HANDOFF.md` (repo). Work files in `tmp/downloads/qul/x/`, `tmp/tools/verify_sources.py`, `tmp/tools/tanzil_xcheck.py`, `tmp/tools/xcheck_detail.py`, `tmp/phase2/` (ignored). No repo code yet.
- Messages sent: DOCU (D23 pick; file mapping and checksums), AUD (P1-09 decided, Phase 2 started).
- Open items (resume here): finish the Tanzil cross-check for marks (vowels, tanween, pause signs) and check a few pause-sign differences against the PDF; then surah, juz and hizb start pages; then `scripts/build-data`, `scripts/validate` (Node, `node:sqlite`, no dependencies) and `data/quran.json`; ask ORG where the source databases should live in the repo; send DOCU the data format and commands.

## 2026-10-31 18:30, DOCU, Phase 2

- Did: Recorded ORG's rule (no file listed in `docs/checksums/` is deleted without asking DOCU and BUILDER) as D28 in `docs/DECISIONS.md`.
- Files changed: `docs/DECISIONS.md`, `docs/HANDOFF.md`.
- Messages sent: none.
- Open items: rest of phase 2 docs when BUILDER finishes.

## 2026-10-31 18:30, ORG, Phase 2

- Did: Added DOCU's new `docs/checksums/` folder (3 SHA-256 lists, 1,263 entries, LF line endings) to `docs/STRUCTURE.md`. The lists are the lasting record for files in `tmp/`.
- Files changed: `docs/STRUCTURE.md`, `docs/HANDOFF.md`.
- Messages sent: DOCU (ack).
- Open items: Updated `tmp/` keep list for later cleanups: never delete `tmp/downloads/` (including `tmp/downloads/qul/`) or any file listed in `docs/checksums/` without asking DOCU and BUILDER first.

## 2026-10-31 18:25, DOCU, Phase 2

- Did: Verified BUILDER's QUL checksum lists (8 archives and databases, 1,208 fonts, all OK). Added an "Official QUL downloads (phase 2)" section to `docs/DATA-SOURCES.md`: file, QUL resource, export date, contents, SHA-256. Created `docs/checksums/` with copies of the three checksum lists, because `tmp/` is ignored by git (1,263 of 1,263 entries verified from there). Noted that the surah banner font (QUL 458) is not downloaded yet. Updated DEVLOG and the README docs list. Prettier clean, no em dashes.
- Files changed: `docs/DATA-SOURCES.md`, `docs/DEVLOG.md`, `README.md`, `docs/HANDOFF.md`, `docs/checksums/qul-downloads.sha256` (new), `docs/checksums/qul-fonts-v2.sha256` (new), `docs/checksums/phase1-trial.sha256` (new).
- Messages sent: ORG (new folder `docs/checksums/` for STRUCTURE.md). BUILDER (downloads recorded).
- Open items: banner font QUL 458 (phase 3). Rest of phase 2 docs when BUILDER finishes `build-data`, `validate` and `data/quran.json`.

## 2026-10-31 18:10, DOCU, Phase 2

- Did: Recorded Hassan's font choice (relayed by BUILDER and AUD): D23 confirmed, QPC V2 page fonts (QUL 249) with the V2 glyph script (QUL 61), Unicode text from QUL 312 for openings and checks. Kept the Rule 1 rewording as an open item for Hassan (P1-09), because `PROJECT.md` is his file. Recorded that Hassan's official QUL downloads are in `tmp/downloads/qul/` (5 files) and that phase 2 has started. Prettier clean, no em dashes.
- Files changed: `README.md`, `docs/DECISIONS.md`, `docs/DATA-SOURCES.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: AUD and BUILDER (D23 recorded).
- Open items: BUILDER's phase 2 report: QUL resource and version for each downloaded file, download date, checksums. Rule 1 rewording in `PROJECT.md` (Hassan).

## 2026-10-31 17:48 (BUILDER clock), BUILDER, Phase 2 (not started)

- Did: Hassan answered P1-08 / D24: QCF2 page fonts accepted without a licence (told him KFGQPC still owns them; credit KFGQPC and QUL). Relayed to AUD and DOCU. He asked to see both fonts before deciding D23, so I built `tmp/compare/font-compare.html`: his printed pages 187, 545 and 50 with the V2 font and qpc-hafs drawn on top, with "openings only" and flip views. Ink overlap with the print: V2 about 0.63 to 0.65, qpc-hafs about 0.18 to 0.21. Wrote him step-by-step QUL download instructions and created `tmp/downloads/qul/` for the files.
- Files changed: `docs/HANDOFF.md` (repo); `tmp/compare/`, `tmp/tools/build_compare.py`, `tmp/tools/calibrate_compare.py`, `tmp/tools/compare_template.html`, `tmp/tools/qpc312.py`, `tmp/phase1/RESULTS.md` (ignored). Rebuilt `tmp/venv`.
- Messages sent: AUD (P1-08 answer), DOCU (D24 answer).
- Open items: Hassan: D23 font pick after viewing the page, then the QUL downloads. Phase 3 note for AUD and BUILDER: printed line positions drift up to 15 px (scan) from an even grid on page 187, so the overlay check needs a tolerance or per-page line offsets (details in `tmp/phase1/RESULTS.md`).

## 2026-10-31 18:00, DOCU, Phase 2 (not started)

- Did: Recorded Hassan's answers relayed by BUILDER. D24 confirmed: QCF2 fonts accepted without a published license, credit KFGQPC and QUL. D25 confirmed: Hassan does the QUL downloads himself with BUILDER's instructions. D23 still pending, waiting on the side-by-side font comparison. Updated `README.md` (status, credits), `docs/DECISIONS.md`, `docs/DATA-SOURCES.md`, `docs/DEVLOG.md`. Prettier clean, no em dashes.
- Files changed: `README.md`, `docs/DECISIONS.md`, `docs/DATA-SOURCES.md`, `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: BUILDER and AUD (D24 and D25 recorded).
- Open items: D23 font choice. Phase 2 download versions, dates and checksums from BUILDER.

## 2026-10-31 17:04 (BUILDER clock), BUILDER, Phase 2 (not started)

- Did: Checked ORG's tmp/ cleanup: 625 page images, 42 page files, `tmp/tools/` and `tmp/downloads/` all present; all 47 checksums in `tmp/phase1/checksums.sha256` still match. Added the cleanup note and the venv rebuild commands to `tmp/phase1/RESULTS.md`.
- Files changed: `docs/HANDOFF.md` (repo); `tmp/phase1/RESULTS.md` (ignored).
- Messages sent: none.
- Open items: Phase 2 starts when Hassan decides P1-08 (QCF2 font licence), P1-09 (font choice) and D25 (QUL account and the official downloads). First Phase 2 step: rebuild `tmp/venv`, then check the official QUL layout against `tmp/phase1/pages/*.json`.
