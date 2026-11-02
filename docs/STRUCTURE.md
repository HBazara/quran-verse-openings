# Structure

The project file tree, one line per folder. ORG keeps this current after every phase.

```
/
├─ index.html              entry page (no interface text; loads src/styles.css and src/app.js)
├─ manifest.webmanifest    app manifest for the installable offline app (name, colours, icons)
├─ sw.js                   service worker for offline use; must stay at the root so its scope covers the whole site
├─ src/                    app code: app.js (start), render.js (page layout), fonts.js (font loading), i18n.js (strings), controls.js (Go to and Settings panel contents), panels.js (opening and closing the panels), input.js (keyboard and swipe), language.js (language screen on entry), storage.js (only place that uses localStorage), places.js (surah and juz of each page), peek.js (peek mode), test-mode.js (test mode), progress.js (memorization tracker and bookmarks), search.js (surah search), print.js (print booklet), offline.js (registers sw.js, Offline use settings), styles.css
│  └─ i18n/                interface strings: en.json and ar.json with the same keys
├─ assets/
│  ├─ icons/               app icons: icon-192.png, icon-512.png, icon-maskable-512.png
│  └─ fonts/               self-hosted Quran fonts, original file names kept so checksums still match
│     ├─ qcf2/             KFGQPC QCF2 page fonts (QUL 249): p1.woff2 to p604.woff2, one per mushaf page
│     ├─ surah-header/     KFGQPC surah banner colour font (QUL 458): QCF_SurahHeader_COLOR-Regular.woff2
│     └─ bismillah/        KFGQPC Bismillah font (D34): QCF2BSML.ttf
├─ data/                   generated data: quran.json (minified) and quran.json.sha256 from scripts/build-data.mjs, tanzil-differences.json (reviewed list, no text). Never hand-edit or reformat
│  └─ sources/             Tanzil quran-uthmani.txt and quran-data.js (byte-exact) plus SHA256SUMS for every source build-data reads (Tanzil files, QUL databases, banner font, ligatures.json, Bismillah font) and qcf2.sha256 (the 604 page fonts). QUL files stay in tmp/downloads/qul/
├─ scripts/                build-data.mjs, validate.mjs (--full adds the QUL checks) and build-site.mjs (copies the published files into a site folder and stamps the version in sw.js). Plain Node, no dependencies
│  └─ lib/                 shared code for the scripts: sources.mjs (find, checksum and read the sources), surah-names.mjs (English surah names), fontcheck.mjs (font checks for validate)
├─ docs/                   all documentation (owned by DOCU, except the files below)
│  ├─ AUDIT.md             AUD's findings table
│  ├─ HANDOFF.md           shared log, every agent writes to it
│  ├─ STRUCTURE.md         this file (ORG)
│  ├─ checksums/           SHA-256 lists for the source files in tmp/ (DOCU), check with `sha256sum -c` from the root
│  └─ handoff-archive/     HANDOFF entries moved here per phase after PASS (ORG)
├─ .github/
│  └─ workflows/           deploy.yml: checksums and validate on every push, then deploy to GitHub Pages on main (every push or a manual run, never pull requests). Publishes index.html, manifest.webmanifest, sw.js, src/, assets/fonts/, assets/icons/, data/quran.json
├─ tmp/                    ignored by git: downloads/ (all sources), renders/pdf/, phase1/ to phase8/, compare/ (font comparison), tools/ (check and overlay scripts)
├─ AGENTS.md               roles and rules for every agent (ORG)
├─ start-quran-verse-openings.ps1  opens the 4 agent sessions as Windows Terminal tabs; fresh sessions read docs/TEAM-START.md (ORG)
├─ PROJECT.md              the full project brief
└─ README.md               what the site is, run, deploy, credits (DOCU)
```

Root config files: `.gitignore`, `.gitattributes`, `.editorconfig`, `.prettierrc.json`, `.prettierignore`.

Built site folders (`_site/`) are ignored by git; CI builds the site fresh.

The reference PDF `standard1-quran.pdf` sits in the root and is ignored by git. It is never committed.
