# Quran Verse Openings

A memorization mushaf for the web. It shows the Quran page by page like a printed mushaf, but each verse shows only its opening words (رؤوس الآيات). The opening words sit in the same spot they have on the printed page, and the rest of the verse is left as empty space. The reader sees the start of each verse and recites the rest from memory.

It is a static site with plain HTML, CSS and JavaScript, with no backend and no runtime API calls. From phase 8 it can be installed as an app and works offline after the first visit.

## Status

**All 8 phases are built, audited and live** (version 2, commits `44452fb` and `ff8141f`, 2026-11-02). The site is live at https://hbazara.github.io/quran-verse-openings/ (see Deploy).

Done so far:

- Folder structure, `AGENTS.md`, `.gitignore`, `.editorconfig`, `.gitattributes` and Prettier config (ORG).
- Edition check (BUILDER): the PDF is the King Fahd Complex (KFGQPC) Madinah mushaf, Hafs, 1421H print, 604 pages of 15 lines. The QUL V2 layout matched the print on every line checked across 42 sample pages.
- Decisions: Hassan picked the QPC V2 page fonts, approved the surah banner and Bismillah fonts, and downloaded the official QUL files.
- Data pipeline (BUILDER): `scripts/build-data.mjs` builds `data/quran.json` (604 pages, 9,046 lines, 114 surahs, 6,236 verses, 83,668 words). `scripts/validate.mjs` runs 21 checks, or 25 with `--full`. All pass.
- Core reader (BUILDER): whole pages in the printed layout, with only the first words of each verse visible, surah banners, Bismillah lines, one page or two-page view, Next and Previous. See `docs/READER.md`.
- Navigation and settings (BUILDER): go to a page, surah or juz; settings for opening words, verse-end markers, zoom and theme, saved in the browser; keyboard arrows and swipe; the last page is remembered.
- Languages (BUILDER): a language screen every time the site opens (English or العربية), a language switch in the header, and a full right-to-left Arabic interface with Arabic-Indic numbers.
- Polish (BUILDER): banner colors that suit each theme, a two-row header on phones, interface typography, and a GitHub workflow that checks everything and then publishes the site.
- Memorization tools (BUILDER): peek (tap a verse, or press P, to see all of it for 4 seconds; off until switched on in Settings), test mode (hide the openings and show them one by one), a memorization tracker (mark pages memorized or needs review, a grid of all 604 pages by juz), and bookmarks.

- Extras (BUILDER): juz, hizb and quarter markers in the page margin, surah search by name or number, printing a booklet on A5 sheets, and an installable app that works offline.
- Page heading (BUILDER, after phase 8, at Hassan's request; audited and live, `57ee514`): the juz and the surah name above each page, as in the print.

After phase 8 (see `docs/AUDIT.md`): BUILDER fixed P8-01 (the search spelling "aal imran"), P8-03 (a new deploy could take up to 10 minutes to show) and P8-04 (peek did not hide at once when switched off); AUD verified the fixes, and they are live (commit `ff8141f`). Hassan kept the margin markers on by default on phones too (P8-02).

See `docs/DEVLOG.md` for the full history.

## Run locally

Get the code:

```sh
git clone https://github.com/HBazara/quran-verse-openings.git
cd quran-verse-openings
```

The repo is public (D46): https://github.com/HBazara/quran-verse-openings. It has one commit per audited phase (D56).

Open the reader. There is no build step, but the site must be served over HTTP, because browsers block loading the data from a `file://` page. Any static server works. With Python, from the project root:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Then open http://127.0.0.1:8765/ in a browser. Add `#page=50` to the address to open page 50. How to use the reader is in `docs/USER-GUIDE.md`.

To work on the data:

The data scripts need Node 24 (tested with 24.18). There is nothing to install. From the project root:

```sh
node scripts/validate.mjs          # check data/quran.json (works from a fresh clone)
node scripts/validate.mjs --full   # also check against the QUL databases (local only)
node scripts/build-data.mjs        # rebuild data/quran.json (local only)
```

`build-data` and `--full` need the 3 QUL databases in `tmp/downloads/qul/x/`. They are not in git, so download them from QUL (see `docs/DATA-SOURCES.md`). Before committing new data, run `build-data` and then `validate --full`; both must pass. Details: `docs/DATA-FORMAT.md`.

## Deploy

**The site is live at https://hbazara.github.io/quran-verse-openings/.** Hassan made the repo public and set Settings > Pages > Source to "GitHub Actions" (2026-11-02, D46, D57). The first run of the workflow on GitHub (2026-11-02, after commit `03a8fc4`) passed: the checks and the deploy both succeeded (AUD finding P6-02). The live site serves only the site files: `docs/`, `scripts/`, `data/sources/` and `README.md` are not on it.

`.github/workflows/deploy.yml` ("Check and deploy") runs on every push to `main`, every pull request, and when started by hand (Actions > Check and deploy > Run workflow):

1. Checks the checksums of the Tanzil sources (`data/sources/SHA256SUMS`), `data/quran.json`, the 604 page fonts (`data/sources/qcf2.sha256`), and the banner and Bismillah fonts.
2. Runs `node scripts/validate.mjs`.
3. Builds the site folder with `node scripts/build-site.mjs _site` (and stamps the service worker with version hashes) and uploads it.
4. On `main` only (a push or a run started by hand), publishes that folder to GitHub Pages. Pull requests are only checked, never published.

Any failure stops everything after it, so a broken site is never published. Only `index.html`, `manifest.webmanifest`, `sw.js`, `src/`, `assets/fonts/`, `assets/icons/` and `data/quran.json` go live; docs, scripts and checksum files do not.

**About the fonts:** the published site serves its fonts, so anyone can download them. They are not ours to license: the page fonts, the banner font and the Bismillah font have no published license, and the banner and Bismillah fonts say "All rights reserved" (see Credits and `docs/DATA-SOURCES.md`). Hassan accepted using them with credit to KFGQPC and QUL (D24, D33, D34). This project gives no license for them.

## Folder layout

| Folder                          | Purpose                                          |
| ------------------------------- | ------------------------------------------------ |
| `index.html`                    | The page the site opens                          |
| `sw.js`, `manifest.webmanifest` | The offline app: service worker and app manifest |
| `src/`                          | App code (JavaScript, CSS)                       |
| `src/i18n/`                     | Interface strings: `en.json` and `ar.json`       |
| `assets/fonts/`                 | Self-hosted fonts                                |
| `assets/icons/`                 | App icons (an open book, no text)                |
| `data/`                         | Generated `quran.json` and its checks            |
| `data/sources/`                 | Tanzil text files, byte for byte                 |
| `scripts/`                      | `build-data` and `validate` scripts              |
| `scripts/lib/`                  | Shared code for the scripts                      |
| `docs/`                         | All documentation                                |
| `.github/workflows/`            | The check and deploy workflow                    |

`assets/fonts/` holds the 604 QPC V2 page fonts (`qcf2/`), the surah banner font (`surah-header/`) and the Bismillah font (`bismillah/`). The full tree with one line per folder is in `docs/STRUCTURE.md`.

## Reference PDF

`standard1-quran.pdf` sits in the project root. We use it only to confirm the edition and page layout, never as a source for the Arabic text. It is ignored by git (`*.pdf` in `.gitignore`), must never be committed, and will never be published (D10).

## Credits

Sources picked in phase 1, font confirmed by Hassan. Full details, licenses and checksums are in `docs/DATA-SOURCES.md`.

- **Quran text, page layout and word data:** [QUL, the Quranic Universal Library](https://qul.tarteel.ai) by Tarteel. KFGQPC V2 layout (1421H print), V2 glyph script and KFGQPC Hafs Unicode script. The raw QUL databases are not stored in this repo; the site uses data generated from them.
- **Mushaf, script and fonts:** King Fahd Glorious Quran Printing Complex (KFGQPC), Madinah. The QPC V2 page fonts (QCF2) are by KFGQPC and served through QUL. No license has been published for them. Hassan accepted using them with credit to KFGQPC and QUL. The surah banner font (QCF_SurahHeader_COLOR, QUL font 458) is also by KFGQPC, served through QUL; Hassan approved using it with credit to KFGQPC and QUL (D33).
- **Bismillah font:** QCF2BSML by the King Fahd Glorious Quran Printing Complex (KFGQPC), obtained from the [nuqayah/qpc-fonts](https://github.com/nuqayah/qpc-fonts) mirror on GitHub (D34). No license has been published for it.
- **Fonts on the live site:** since 2026-11-02 the repo and the site are public, so all these fonts can be downloaded by anyone. They stay the property of KFGQPC and are not licensed by this project (see Deploy, About the fonts).
- **Text cross-check and surah names:** [Tanzil Quran Text](https://tanzil.net) (Uthmani 1.1 and metadata 1.0), used under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). The Arabic surah names in `data/quran.json` come from Tanzil metadata, which is also used to cross-check the text and the juz and quarter starts. The two Tanzil files in `data/sources/` are verbatim copies.

## Documentation

- `docs/DEVLOG.md`: dated log of every step
- `docs/DECISIONS.md`: decisions and the reasons for them
- `docs/DATA-SOURCES.md`: sources, versions, licenses, checksums (full checksum lists in `docs/checksums/`)
- `docs/DATA-FORMAT.md`: the `data/quran.json` format, the commands, and every check `validate` runs
- `docs/READER.md`: how the reader draws a page, its files, geometry, views and limits
- `docs/TEXT-CROSSCHECK.md`: the full comparison of our text with Tanzil and the print
- `docs/USER-GUIDE.md`: how to use the site (English and Arabic)
- `docs/HANDOFF.md`: running log of what each agent did and the messages between agents (older phases move to `docs/handoff-archive/`)
- `docs/STRUCTURE.md`: the file tree, one line per folder (written by ORG)
- `docs/AUDIT.md`: audit findings and phase sign-offs (written by AUD)
- `docs/TEAM-START.md`: how to restart the four agent sessions, and where the project stands now
- `AGENTS.md`: the four agent roles and the rules for everyone
- `PROJECT.md`: the full project brief
