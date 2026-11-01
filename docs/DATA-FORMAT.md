# Data format and checks

How `data/quran.json` is built, what is in it, and what `scripts/validate.mjs` checks. Built in phase 2 by BUILDER.

## Files

| File                             | In git | What it is                                                                                                                                                                   |
| -------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `scripts/build-data.mjs`         | yes    | Builds `data/quran.json` from the sources. Local only, because it needs the QUL databases.                                                                                   |
| `scripts/validate.mjs`           | yes    | All checks. Default mode runs in CI; `--full` runs locally.                                                                                                                  |
| `scripts/lib/sources.mjs`        | yes    | Shared code: finds and checksums the sources, reads QUL and Tanzil, and holds the documented rules for comparing with Tanzil.                                                |
| `data/quran.json`                | yes    | The generated data the site reads. About 4.15 MB, minified. No timestamps, so the same sources always give the same bytes.                                                   |
| `data/quran.json.sha256`         | yes    | SHA-256 of `data/quran.json`, written by `build-data`.                                                                                                                       |
| `data/tanzil-differences.json`   | yes    | The reviewed list of differences from Tanzil. Verse and word locations and categories only, no text.                                                                         |
| `data/sources/quran-uthmani.txt` | yes    | Tanzil Uthmani 1.1, byte for byte.                                                                                                                                           |
| `data/sources/quran-data.js`     | yes    | Tanzil metadata 1.0, byte for byte.                                                                                                                                          |
| `data/sources/SHA256SUMS`        | yes    | SHA-256 of all 8 source files (2 Tanzil, 3 QUL databases, the surah banner font, its `ligatures.json`, and the Bismillah font), in the format "hash, two spaces, file name". |
| The 3 QUL databases              | **no** | Local only, in `tmp/downloads/qul/x/` (`PROJECT.md` Rule 1 item 7).                                                                                                          |

## Commands

You need Node 24 (tested with 24.18). There are no dependencies, no `package.json` and no install step. Run from the project root.

```sh
node scripts/build-data.mjs        # local only: needs the QUL databases
node scripts/validate.mjs          # CI and local
node scripts/validate.mjs --full   # local: also checks against the QUL databases
cd data/sources && sha256sum -c --ignore-missing SHA256SUMS   # checks the committed Tanzil files
```

Options:

- `build-data.mjs --qul <folder> --tanzil <folder>`
- `validate.mjs --qul <folder>`
- Default folders: QUL `tmp/downloads/qul/x` (searched one level deep). Tanzil: `data/sources`, then `tmp/downloads/tanzil`.
- `validate.mjs --write-tanzil-differences` rewrites `data/tanzil-differences.json`. Use it only after a source change has been reviewed.

`build-data` checks every source against `data/sources/SHA256SUMS` before it builds anything.

**Rule before committing new data:** run `build-data`, then `validate --full`. Both must pass. See "Limit" below for why.

## `data/quran.json`

Top-level fields:

| Field        | What it holds                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| `format`     | Format version, currently `1`.                                                                           |
| `edition`    | "KFGQPC Madinah mushaf, Hafs from Asim, 1421H print, 604 pages, 15 lines"                                |
| `layout`     | The layout name from the QUL layout file: "QCF V2 ( 1421H print )"                                       |
| `sources`    | One entry per source: `role` (`layout`, `glyphs`, `text`, `tanzilText`, `tanzilMeta`), `file`, `sha256`. |
| `wordFields` | The order of the fields in each word: `["id", "glyph", "text", "verse", "position", "end"]`              |
| `counts`     | `pages` 604, `lines` 9,046, `surahs` 114, `verses` 6,236, `words` 83,668 (verse-end markers included).   |
| `surahs`     | 114 entries, see below.                                                                                  |
| `juz`        | 30 entries.                                                                                              |
| `hizb`       | 60 entries.                                                                                              |
| `quarters`   | 240 entries (hizb quarters).                                                                             |
| `pages`      | 604 entries, see below.                                                                                  |

### Surahs

Each entry: `surah` (1 to 114), `name` (Arabic name, from Tanzil metadata), `verses` (number of verses), `page` and `line` where verse 1 starts, and `headerPage` (the page with the surah banner).

`headerPage` differs from `page` for 18 surahs whose banner is on the last line of the page before: 4, 10, 22, 23, 24, 26, 27, 32, 33, 37, 38, 45, 47, 53, 60, 64, 65, 80.

### Juz, hizb and quarters

Each entry: its number (`juz`, `hizb` or `quarter`), `verse` (the first verse, as "surah:verse"), `page` and `line`.

The page and line always come from the V2 layout. The first verse of each quarter comes from the print itself: the 199 verses whose first word carries the hizb sign ۞ (in QUL 312 and in the V2 glyphs), plus the 41 quarters that begin a surah, where the surah banner marks the start instead of the sign. 240 quarters in all. Hizb n is quarter 4n minus 3. Juz n is quarter 8n minus 7. `build-data` checks that these juz starts equal Tanzil's juz list, and compares the quarters with Tanzil's quarter list. They differ in one reviewed place: the print has the hizb sign at **15:49** (page 264, line 14), and Tanzil lists 15:50. `data/quran.json` follows the print (D26).

### Pages and lines

Each page: `page` (1 to 604) and `lines`. Pages 1 and 2 have 8 lines, all others 15.

Each line has:

- `type`: `ayah` (verse text), `surah` (surah banner) or `basmala` (Bismillah line).
- `centered`: `true` or `false`.
- `surah`: only on `surah` lines, the surah number.
- `words`: only on `ayah` lines.

### Words

Each word is an array, in the order given by `wordFields`:

| Field      | What it is                                                                    |
| ---------- | ----------------------------------------------------------------------------- |
| `id`       | 1 to 83,668, in reading order.                                                |
| `glyph`    | The V2 glyph code or codes that draw the word with that page's font (QUL 61). |
| `text`     | The Unicode text of the word, verbatim from QUL 312.                          |
| `verse`    | The verse, as "surah:verse".                                                  |
| `position` | 1, 2, 3 ... within the verse. The verse-end marker is last.                   |
| `end`      | `1` for the verse-end marker, otherwise `0`.                                  |

**Opening words:** for N words per verse, the site shows every word with `end` 0 and `position` up to N, plus the verse-end markers. A verse shorter than N shows whole.

## What `validate` checks

### Default mode (CI)

Uses only committed files.

1. `data/quran.json` matches `data/quran.json.sha256`. This catches a hand edit or a tool rewriting the file.
2. 604 pages, in order. 8 lines on pages 1 and 2, 15 on all others. Every line has a valid type and centering. Every `ayah` line has words.
3. 114 surah banners, in order, all centered. A centered Bismillah line after every banner except surahs 1 and 9 (112 in all). Each surah's verse 1 starts right after.
4. Every word id from 1 to 83,668 appears exactly once, in reading order, with no gaps or overlaps.
5. Characters: text only in the Arabic block (U+0600 to U+06FF, with single inner spaces only for the hizb and sajda signs), no Latin letters or digits, nothing empty. Glyph codes only in U+FB50 to U+FDFF.
6. 114 surahs and 6,236 verses, each once and in order, never split across two places. Verse counts match the surah list.
7. In every verse, positions run 1, 2, 3 ... There is exactly one verse-end marker, it is last, and it shows the verse number in Arabic-Indic digits.
8. Openings for N = 1 to 5, in all 6,236 verses: the words shown are exactly the first N words, in order. Short verses show whole. No empty words.
9. No Bismillah inside verse 1 of surahs 2 to 114. Verse 1 of Al-Fatiha is the 4-word Bismillah.
10. Surah, juz, hizb and quarter starts: the right counts, in order, and each page and line points at its verse's first word. Hizb n is quarter 4n minus 3. Juz 1 is on page 1.
11. Quarter starts follow the hizb signs of the print: every hizb sign ۞ is on the first word of a verse and starts a quarter; every quarter starts with the sign or with a new surah; juz and hizb are every 8th and 4th quarter.
12. The Tanzil files match `data/sources/SHA256SUMS`.
13. Tanzil cross-check of every verse, with the documented conventions (see `docs/DATA-SOURCES.md`).
14. The differences found are exactly the reviewed list in `data/tanzil-differences.json`. A new difference, or one that disappears, fails the check.

The checks against the QUL databases are skipped in this mode and print a SKIP line.

### `--full` mode (local)

Adds:

15. The 3 QUL databases match `data/sources/SHA256SUMS`.
16. All 9,046 lines match the QUL layout: page, line, type, centering, surah, first and last word.
17. All 83,668 words match QUL 312 (text) and QUL 61 (glyph codes), with verse and position.

### Tested: validate catches errors

BUILDER made each change below to a copy of `data/quran.json` and ran validate. The files were restored afterwards.

| Change                                      | Caught by                                                        |
| ------------------------------------------- | ---------------------------------------------------------------- |
| One letter changed, hash not updated        | hash check, Tanzil check                                         |
| One letter changed, hash updated            | Tanzil check                                                     |
| One kasra removed, hash updated             | Tanzil check                                                     |
| A line removed from page 50                 | line counts, word ids, verse markers, Tanzil check               |
| Wrong word position in 112:1                | positions, openings                                              |
| Two words swapped                           | word ids, positions, Tanzil check                                |
| Latin letter added                          | characters, Tanzil check                                         |
| Juz 10 page wrong                           | start pages                                                      |
| A word moved to the next line, hash updated | **not caught in default mode.** Caught by `--full` (line check). |

### Limit

CI does not have the QUL databases. So if someone changes line breaks or glyph codes on purpose and also updates `data/quran.json.sha256`, CI cannot see it. This is why `validate --full` must pass locally before any change to the data is committed.

## Last run

DOCU ran both modes on 2026-10-31 with Node 24.18.0, after the quarter fix: the default mode passed 14 checks with 1 skipped, and `--full` passed all 17. `sha256sum -c --ignore-missing SHA256SUMS` passed for both Tanzil files. The SHA-256 of `data/quran.json` was `67f83a4b45b425cb70a9b67c00bbe1082097d28774d347f852d6aef3fd51bde6`, matching `data/quran.json.sha256`.
