# Quran Verse Openings

A memorization mushaf for the web. It shows the Quran page by page like a printed mushaf, but each verse shows only its opening words (رؤوس الآيات). The opening words sit in the same spot they have on the printed page, and the rest of the verse is left as empty space. The reader sees the start of each verse and recites the rest from memory.

It will be a static site with plain HTML, CSS and JavaScript. It has no backend and no runtime API calls, and it works offline once loaded.

## Status

**Phase 3 of 8: core reader.** Phases 1 (setup and data check) and 2 (data pipeline) passed the audit. The site itself is not built yet.

Done so far:

- Folder structure, `AGENTS.md`, `.gitignore`, `.editorconfig`, `.gitattributes` and Prettier config (ORG).
- Edition check (BUILDER): the PDF is the King Fahd Complex (KFGQPC) Madinah mushaf, Hafs, 1421H print, 604 pages of 15 lines. The QUL V2 layout matched the print on every line checked across 42 sample pages.
- Decisions: Hassan picked the QPC V2 page fonts and accepted that they have no published license. Hassan downloaded the official QUL files.
- Data pipeline (BUILDER): `scripts/build-data.mjs` builds `data/quran.json` (604 pages, 9,046 lines, 114 surahs, 6,236 verses, 83,668 words). `scripts/validate.mjs` runs 14 checks, or 17 with `--full`. All pass.

Not done yet: reader, navigation, languages, deploy.

See `docs/DEVLOG.md` for the full history.

## Run locally

There is no site to open yet (no `index.html`). The reader comes in phase 3.

What you can run now is the data pipeline. You need Node 24 (tested with 24.18). There is nothing to install. From the project root:

```sh
node scripts/validate.mjs          # check data/quran.json (works from a fresh clone)
node scripts/validate.mjs --full   # also check against the QUL databases (local only)
node scripts/build-data.mjs        # rebuild data/quran.json (local only)
```

`build-data` and `--full` need the 3 QUL databases in `tmp/downloads/qul/x/`. They are not in git, so download them from QUL (see `docs/DATA-SOURCES.md`). Before committing new data, run `build-data` and then `validate --full`; both must pass. Details: `docs/DATA-FORMAT.md`.

## Deploy

Not set up yet (phase 6). The plan is to deploy to GitHub Pages through GitHub Actions. Before deploying, the workflow will run `cd data/sources && sha256sum -c --ignore-missing SHA256SUMS` and `node scripts/validate.mjs`, and any failure blocks the deploy. The repo name is `quran-verse-openings`.

## Folder layout

| Folder               | Purpose                                    |
| -------------------- | ------------------------------------------ |
| `src/`               | App code (JavaScript, CSS)                 |
| `src/i18n/`          | Interface strings: `en.json` and `ar.json` |
| `assets/fonts/`      | Self-hosted fonts                          |
| `data/`              | Generated `quran.json` and its checks      |
| `data/sources/`      | Tanzil text files, byte for byte           |
| `scripts/`           | `build-data` and `validate` scripts        |
| `scripts/lib/`       | Shared code for the scripts                |
| `docs/`              | All documentation                          |
| `.github/workflows/` | Deploy workflow                            |

`assets/fonts/` holds the 604 QPC V2 page fonts (`qcf2/`), the surah banner font (`surah-header/`) and the Bismillah font (`bismillah/`). `src/`, `src/i18n/` and `.github/workflows/` are still empty (each holds only a `.gitkeep`). The full tree with one line per folder is in `docs/STRUCTURE.md`.

## Reference PDF

`standard1-quran.pdf` sits in the project root. We use it only to confirm the edition and page layout, never as a source for the Arabic text. It is ignored by git (`*.pdf` in `.gitignore`) and must never be committed.

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
- `docs/TEXT-CROSSCHECK.md`: the full comparison of our text with Tanzil and the print
- `docs/USER-GUIDE.md`: how to use the site (English and Arabic)
- `docs/HANDOFF.md`: running log of what each agent did and the messages between agents (older phases move to `docs/handoff-archive/`)
- `docs/STRUCTURE.md`: the file tree, one line per folder (written by ORG)
- `docs/AUDIT.md`: audit findings and phase sign-offs (written by AUD)
- `AGENTS.md`: the four agent roles and the rules for everyone
- `PROJECT.md`: the full project brief
