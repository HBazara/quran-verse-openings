# Quran Verse Openings

A memorization mushaf for the web. It shows the Quran page by page like a printed mushaf, but each verse shows only its opening words (رؤوس الآيات). The opening words sit in the same spot they have on the printed page, and the rest of the verse is left as empty space. The reader sees the start of each verse and recites the rest from memory.

It will be a static site with plain HTML, CSS and JavaScript. It has no backend and no runtime API calls, and it works offline once loaded.

## Status

**Phase 6 of 8: polish and deploy.** Phases 1 (setup and data check), 2 (data pipeline), 3 (core reader), 4 (navigation and settings) and 5 (languages) passed the audit.

Done so far:

- Folder structure, `AGENTS.md`, `.gitignore`, `.editorconfig`, `.gitattributes` and Prettier config (ORG).
- Edition check (BUILDER): the PDF is the King Fahd Complex (KFGQPC) Madinah mushaf, Hafs, 1421H print, 604 pages of 15 lines. The QUL V2 layout matched the print on every line checked across 42 sample pages.
- Decisions: Hassan picked the QPC V2 page fonts, approved the surah banner and Bismillah fonts, and downloaded the official QUL files.
- Data pipeline (BUILDER): `scripts/build-data.mjs` builds `data/quran.json` (604 pages, 9,046 lines, 114 surahs, 6,236 verses, 83,668 words). `scripts/validate.mjs` runs 18 checks, or 22 with `--full`. All pass.
- Core reader (BUILDER): whole pages in the printed layout, with only the first words of each verse visible, surah banners, Bismillah lines, one page or two-page view, Next and Previous. See `docs/READER.md`.
- Navigation and settings (BUILDER): go to a page, surah or juz; settings for opening words, verse-end markers, zoom and theme, saved in the browser; keyboard arrows and swipe; the last page is remembered.
- Languages (BUILDER): a language screen every time the site opens (English or العربية), a language switch in the header, and a full right-to-left Arabic interface with Arabic-Indic numbers.

Not done yet: polish and deploy (phase 6), version 2 features (phases 7 and 8).

See `docs/DEVLOG.md` for the full history.

## Run locally

Get the code:

```sh
git clone https://github.com/HBazara/quran-verse-openings.git
cd quran-verse-openings
```

The repo is private for now (D46), so cloning needs access, and it works once the first push is done.

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

Not set up yet (phase 6). The plan is to deploy to GitHub Pages through GitHub Actions. Before deploying, the workflow will run `cd data/sources && sha256sum -c --ignore-missing SHA256SUMS` and `node scripts/validate.mjs`, and any failure blocks the deploy. The repo is https://github.com/HBazara/quran-verse-openings. It is private for now, as a backup; free GitHub Pages needs it to be public, which Hassan will decide before phase 6.

## Folder layout

| Folder               | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `index.html`         | The page the site opens                    |
| `src/`               | App code (JavaScript, CSS)                 |
| `src/i18n/`          | Interface strings: `en.json` and `ar.json` |
| `assets/fonts/`      | Self-hosted fonts                          |
| `data/`              | Generated `quran.json` and its checks      |
| `data/sources/`      | Tanzil text files, byte for byte           |
| `scripts/`           | `build-data` and `validate` scripts        |
| `scripts/lib/`       | Shared code for the scripts                |
| `docs/`              | All documentation                          |
| `.github/workflows/` | Deploy workflow                            |

`assets/fonts/` holds the 604 QPC V2 page fonts (`qcf2/`), the surah banner font (`surah-header/`) and the Bismillah font (`bismillah/`). `.github/workflows/` is still empty (only a `.gitkeep`). The full tree with one line per folder is in `docs/STRUCTURE.md`.

## Reference PDF

`standard1-quran.pdf` sits in the project root. We use it only to confirm the edition and page layout, never as a source for the Arabic text. It is ignored by git (`*.pdf` in `.gitignore`), must never be committed, and will never be published (D10).

## Credits

Sources picked in phase 1, font confirmed by Hassan. Full details, licenses and checksums are in `docs/DATA-SOURCES.md`.

- **Quran text, page layout and word data:** [QUL, the Quranic Universal Library](https://qul.tarteel.ai) by Tarteel. KFGQPC V2 layout (1421H print), V2 glyph script and KFGQPC Hafs Unicode script. The raw QUL databases are not stored in this repo; the site uses data generated from them.
- **Mushaf, script and fonts:** King Fahd Glorious Quran Printing Complex (KFGQPC), Madinah. The QPC V2 page fonts (QCF2) are by KFGQPC and served through QUL. No license has been published for them. Hassan accepted using them with credit to KFGQPC and QUL. The surah banner font (QCF_SurahHeader_COLOR, QUL font 458) is also by KFGQPC, served through QUL; Hassan approved using it with credit to KFGQPC and QUL (D33).
- **Bismillah font:** QCF2BSML by the King Fahd Glorious Quran Printing Complex (KFGQPC), obtained from the [nuqayah/qpc-fonts](https://github.com/nuqayah/qpc-fonts) mirror on GitHub (D34). No license has been published for it.
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
- `AGENTS.md`: the four agent roles and the rules for everyone
- `PROJECT.md`: the full project brief
