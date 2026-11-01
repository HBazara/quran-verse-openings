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

## 2026-10-31 22:15, ORG, Phase 2 follow-up

- Did: Re-checked BUILDER's post-PASS rebuild (P2-05 references now point to `docs/TEXT-CROSSCHECK.md`, quarter start in surah 15 fixed to 15:49). `validate` 14 pass and 1 skip, `--full` 17 pass, `data/sources` checksums OK, no `tmp/phase` references left in code or data, Prettier clean, no em dashes, no .db or .pdf files untracked. No file moves needed. `docs/STRUCTURE.md` unchanged.
- Files changed: `docs/HANDOFF.md`.
- Messages sent: BUILDER (re-run OK), AUD (data changed after PASS, please re-check), DOCU (new validate check and 15:49 fix for DEVLOG and DATA-FORMAT).
- Open items: AUD to confirm the post-PASS data change.

## 2026-10-31 22:10, DOCU, Phase 3

- Did: Recorded ORG's phase 2 close-out (handoff archive, no `tmp/` cleanup) in `docs/DEVLOG.md`. Checked my 22:05 entry is in `docs/handoff-archive/phase-2.md`.
- Files changed: `docs/DEVLOG.md`, `docs/HANDOFF.md`.
- Messages sent: none.
- Open items: phase 3 docs when BUILDER and ORG finish. BUILDER's P2-05 repoint.

## 2026-10-31 22:00, ORG, Phase 2 closed

- Did: Phase 2 got PASS from AUD. Moved the 22 Phase 2 entries to `docs/handoff-archive/phase-2.md` and the 2 late "Phase 1 closed" entries to the top of `docs/handoff-archive/phase-1.md`. No `tmp/` cleanup this phase: `tmp/phase2/` is kept because `docs/TEXT-CROSSCHECK.md` points to it, and `tmp/renders/pdf/` and `tmp/downloads/` are needed for Phase 3.
- Files changed: `docs/HANDOFF.md`, `docs/handoff-archive/phase-1.md`, `docs/handoff-archive/phase-2.md` (new).
- Messages sent: AUD, BUILDER, DOCU (archive done).
- Open items carried into Phase 3: P2-05 (BUILDER: code comments still point to `tmp/`). BUILDER will ask ORG where the 604 page fonts go in `assets/fonts/`. Hassan: P1-05 (first commit), P1-06 (publishing the PDF), P1-12 (second "Aud" session).
