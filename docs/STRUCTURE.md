# Structure

The project file tree, one line per folder. ORG keeps this current after every phase.

```
/
├─ index.html              entry page (not created yet, Phase 3)
├─ src/                    app code (js, css)
│  └─ i18n/                interface strings: en.json and ar.json with the same keys
├─ assets/
│  └─ fonts/               self-hosted Quran fonts, original file names kept so checksums still match
│     ├─ qcf2/             KFGQPC QCF2 page fonts (QUL 249): p1.woff2 to p604.woff2, one per mushaf page
│     ├─ surah-header/     KFGQPC surah banner colour font (QUL 458): QCF_SurahHeader_COLOR-Regular.woff2
│     └─ bismillah/        KFGQPC Bismillah font (D34): QCF2BSML.ttf
├─ data/                   generated data: quran.json (minified) and quran.json.sha256 from scripts/build-data.mjs, tanzil-differences.json (reviewed list, no text). Never hand-edit or reformat
│  └─ sources/             Tanzil quran-uthmani.txt and quran-data.js (byte-exact) plus SHA256SUMS for every source build-data reads (Tanzil files, QUL databases, banner font, ligatures.json). QUL files stay in tmp/downloads/qul/
├─ scripts/                build-data.mjs and validate.mjs (plain Node, no dependencies; validate --full adds the QUL checks)
│  └─ lib/                 shared code for both scripts (sources.mjs: find, checksum and read the sources)
├─ docs/                   all documentation (owned by DOCU, except the files below)
│  ├─ AUDIT.md             AUD's findings table
│  ├─ HANDOFF.md           shared log, every agent writes to it
│  ├─ STRUCTURE.md         this file (ORG)
│  ├─ checksums/           SHA-256 lists for the source files in tmp/ (DOCU), check with `sha256sum -c` from the root
│  └─ handoff-archive/     HANDOFF entries moved here per phase after PASS (ORG)
├─ .github/
│  └─ workflows/           deploy.yml: validate, then deploy to GitHub Pages
├─ tmp/                    ignored by git: downloads/ (QUL and Tanzil sources), renders/pdf/, phase1/, phase2/, tools/
├─ AGENTS.md               roles and rules for every agent (ORG)
├─ PROJECT.md              the full project brief
└─ README.md               what the site is, run, deploy, credits (DOCU)
```

Root config files: `.gitignore`, `.gitattributes`, `.editorconfig`, `.prettierrc.json`, `.prettierignore`.

The reference PDF `standard1-quran.pdf` sits in the root and is ignored by git. It is never committed.
