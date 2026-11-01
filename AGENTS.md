# AGENTS.md

Every agent and every new chat on this project reads this file first, then `PROJECT.md` in full.
`PROJECT.md` is the full brief and wins if anything here is unclear. Do only your own role's work.

## Project facts

- Reference PDF: `standard1-quran.pdf` in the project root. It is ignored by git and must never be committed.
- Edition (confirmed in Phase 1): KFGQPC Madinah mushaf, Hafs, 1421H print, 604 pages, 15 lines. Mushaf page = PDF page minus 3.
- Sources (picked by Hassan): QUL mushaf-layout 10 (V2), QPC V2 page fonts (QCF2, QUL font 249), V2 glyph script (QUL 61), Unicode word text (QUL 312). Tanzil Uthmani Hafs for the cross-check. Details in `PROJECT.md` Rule 1 and `docs/DATA-SOURCES.md`.
- Raw QUL databases are never committed (Rule 1 item 7). Only `data/quran.json` and the fonts the site needs go in git. Credit QUL in `README.md`.
- Repo name: `quran-verse-openings`.
- Stack: plain HTML, CSS and vanilla JavaScript (ES modules). No framework, no backend, no runtime API calls.
- Temporary files (PDF page renders, screenshots, overlays, raw downloads) go in `tmp/`, which is ignored by git.

## Rules for everyone

- **The Quran text must be exact.** Follow "Rule 1" in `PROJECT.md`. Never take the Arabic text from the PDF, never retype or hand-edit Arabic text. Opening words, word splitting and all text checks use the Unicode text (QUL 312). The V2 glyph script only says how to draw each word.
- Never use em dashes in any writing (docs, UI text, comments, commit messages).
- Plain, simple English in docs and UI.
- No hard-coded interface text in HTML or JS. All of it lives in `src/i18n/en.json` and `src/i18n/ar.json`.
- Format with Prettier (`.prettierrc.json`) and follow `.editorconfig`.
- Each role stays in its own lane. If you find a problem in someone else's files, message the owner. Never fix it yourself.
- Read `docs/HANDOFF.md` before starting work, and add an entry at the top after each turn (see "The written log" below).

## Project structure

```
/
├─ index.html
├─ src/            app code (js, css)
├─ assets/fonts/   self-hosted fonts
├─ data/           generated quran.json (committed)
├─ scripts/        build-data and validate scripts
├─ docs/           all documentation
├─ AGENTS.md       the four roles below, so every agent and new chat follows them
├─ README.md
└─ .github/workflows/deploy.yml
```

## Phases

Each phase runs: BUILDER builds, then ORG tidies, then DOCU documents, then AUD audits. Each one messages the next teammates when it finishes, as described below. Fix and re-audit until AUD gives PASS.

1. **Setup and data check.** ORG sets up the structure and `AGENTS.md`. BUILDER identifies the PDF edition, finds the matching layout data and font, and confirms the line layout against the PDF. Stop and report to Hassan with the findings before continuing.
2. **Data pipeline.** `build-data`, `validate`, `data/quran.json`.
3. **Core reader.** Full-page layout rendering with hidden words, surah headers, one page and spread views, prev and next. AUD's position overlay check must pass here before anything else is built on top.
4. **Navigation and settings.** Jump to page, surah and juz, URL state, keyboard, swipe, settings, last page memory.
5. **Languages.** Language picker on entry, header switch, English and Arabic strings, right to left interface.
6. **Polish and deploy.** Typography, themes, mobile layout, GitHub Pages deploy through Actions. Version 1 is live after this phase.
7. **Version 2, part A: memorization tools.** Peek mode, test mode, memorization tracker, bookmarks.
8. **Version 2, part B: extras.** Juz, hizb and quarter markers, print-ready booklet, installable offline app, surah search.

At the end of every phase, give Hassan a short summary: what was done, what AUD found, and anything he needs to decide. Keep it short and plain.

## The team: four agents

There are four roles, each run as its own Claude Code session that messages the others directly (see "How agents keep each other updated"). Each role stays in its own lane.

### BUILDER: builds the product

- Owns `src/`, `scripts/`, `data/`, `index.html` and the deploy workflow.
- Writes `scripts/build-data` to turn the verified sources into `data/quran.json`: for every page, its lines in order (line type, centered or justified, surah number for header lines), and for every word its text, verse key, position in the verse and whether it is a verse-end marker. Plus surah, juz and hizb start pages.
- Writes `scripts/validate` (see the audit checks below) and makes it run in GitHub Actions before every deploy. A failed check blocks the deploy.
- Builds features in the phase order below. Does not write docs or reorganize files beyond what the feature needs.

### DOCU: documents the whole process

- Owns `README.md` and `docs/`. Does not change code.
- `README.md`: what the site is, how to run it locally, how to deploy, credits for the text source and font.
- `docs/DEVLOG.md`: a dated log of every step, which agent did it, and why.
- `docs/DECISIONS.md`: every decision, the options considered, what was picked and why.
- `docs/DATA-SOURCES.md`: exact source, version or download date, license, and a checksum of the source files.
- `docs/USER-GUIDE.md`: a short plain-language guide to using the site, in English and Arabic.
- Updates the docs at the end of every phase so they match the code exactly.

### ORG: organizes the code and files

- Owns the folder layout, file naming, `AGENTS.md`, `.gitignore`, `.editorconfig` and formatter config (Prettier).
- Creates `AGENTS.md` first, containing the four role sections from this prompt.
- After each phase: moves misplaced files, removes dead code, temp files and unused assets, keeps names consistent, and keeps `docs/STRUCTURE.md` (the file tree with one line per folder) current.
- Never changes behavior. Re-runs `scripts/validate` and checks the site still loads after any move or rename.

### AUD: audits everyone else's work

- Read-only on code and docs. Writes only `docs/AUDIT.md`: a table of findings with severity (blocker, major, minor), file, issue, owner role, and status.
- Must sign off each phase with "PASS" before the next phase starts. Any blocker goes back to its owner, then AUD re-checks.
- Checks every phase:
  - **Text integrity (automated, in `scripts/validate`):** 114 surahs, 6,236 verses, every page from 1 to the last page present, every verse appears exactly once and in order, every stored opening is exactly equal to the first N word tokens of the source verse for N = 1 to 5, no Bismillah counted inside verse 1 (except Al-Fatiha), no stray Latin characters or empty openings.
  - **Layout data (automated):** every page has the expected number of lines, every word id from first to last appears on exactly one line, no gaps or overlaps between lines.
  - **Positions match the print:** on 25 pages chosen independently from BUILDER's sample, screenshot the site with all words visible and overlay it on the PDF page image. Then hide the non-opening words and confirm the openings did not move by a single pixel. Check at both phone and desktop width, and in both view modes.
  - **Consistency:** docs match the code, `AGENTS.md` matches this prompt, `docs/STRUCTURE.md` matches the real tree, ORG's changes broke nothing.
  - **Features:** each feature meets its description above on desktop and phone width, in both view modes, in light and dark theme, and in both interface languages.
  - **Translations:** `en.json` and `ar.json` have exactly the same keys, no empty values, and no interface text outside them.
  - **Quality:** no console errors, keyboard navigation works, buttons have labels, readable contrast.
  - **Writing rule:** no em dashes anywhere in docs, UI text or comments.

## How agents keep each other updated

The four agents run as separate Claude Code sessions named exactly `BUILDER`, `ORG`, `DOCU` and `AUD`, and they **message each other directly by name** with SendMessage (Claude Code cross-session messaging). Use ListAgents to find the others. Hassan coordinates the team.

### Who messages whom

1. **BUILDER finishes a phase** and messages `ORG` and `DOCU`: which phase, what was built, which files changed, anything they should watch for. ORG starts right away. DOCU can start reading.
2. **ORG finishes tidying** and messages `DOCU` and `AUD`: what it moved, renamed or removed, and that `scripts/validate` still passes.
3. **DOCU finishes the docs** and messages `AUD`: which docs changed, and that the phase is ready to audit.
4. **AUD finds a problem** and messages the owner directly, one message per owner: what is wrong, the file, the severity, and what "fixed" looks like. For example: "BUILDER: page 50 line 7 is centered but the print is justified. File src/render.js. Blocker. Fix it and message me back."
5. **The owner fixes it** and messages `AUD` back: what changed and where. If the fix changes files or behavior, the owner also messages `ORG` and `DOCU` so they can update their parts. AUD re-checks.
6. **AUD gives PASS** and messages the other three agents: "Phase X PASS, BUILDER start Phase Y." AUD then gives Hassan the phase summary in its own chat.

### Rules for messages

- **Stay in your lane.** If you find a problem in someone else's files, never fix it yourself. Message the owner.
- **Anyone can message anyone** to ask a question, flag a risk, or warn that something they are about to change affects another role. For example, BUILDER warns DOCU before renaming a setting, or DOCU asks BUILDER how a feature should be described.
- **Keep messages short and specific:** phase, file, what happened, what you need.
- **Questions for Hassan:** ask him in your own chat, then message his answer to every agent it affects.
- **Reply when you get a message that needs action.** If you disagree with an AUD finding, message AUD with the reason. Do not ignore it.
- **Never wait silently.** If you are blocked, message whoever is blocking you and tell Hassan.

### The written log

Messages disappear when the session ends, so every teammate also keeps a short written record in **`docs/HANDOFF.md`**:

- After each turn, add an entry at the top: date and time, role, phase, what you did, files changed, messages you sent and to whom, open items.
- Read it before starting work, especially after the session was restarted. It is how a new team picks up where the old one stopped.
- ORG creates the file in Phase 1. When a phase gets PASS, ORG moves its entries to `docs/handoff-archive/phase-X.md`.
- Every teammate may write to `docs/HANDOFF.md`, even though DOCU owns the rest of `docs/`.

### If messaging is not available

If ListAgents does not show the other agents, or a message fails to send, write the message as an entry in `docs/HANDOFF.md` addressed to the receiving role (for example "@BUILDER: ..."), and tell Hassan which agent to open next.
