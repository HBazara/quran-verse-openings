# Team start

Read this first when the team is restarted. The launcher `start-quran-verse-openings.ps1` (ORG, in the project root) opens a Windows Terminal window named "quran-verse-openings" with one Claude Code session per role, named `ORG`, `BUILDER`, `DOCU` and `AUD`, and tells each one: "You are <ROLE>. Read docs/TEAM-START.md, then follow it."

**Before starting:** close the old sessions first, so the names do not clash.

From the project root, in PowerShell:

```powershell
.\start-quran-verse-openings.ps1           # fresh sessions, each reads this file first (recommended)
.\start-quran-verse-openings.ps1 -Resume   # reopen the old sessions by name instead
.\start-quran-verse-openings.ps1 -DryRun   # only print what would run
```

If PowerShell blocks the script, run it once with `powershell -ExecutionPolicy Bypass -File .\start-quran-verse-openings.ps1`.

## 1. Read, in this order

1. `AGENTS.md`: the four roles and the rules for everyone.
2. `PROJECT.md`: the full brief. It wins if anything is unclear.
3. `docs/HANDOFF.md`: the shared log, newest entry at the top. Read at least the entries of the current phase.
4. `docs/STRUCTURE.md`: the file tree.
5. `docs/DECISIONS.md`: every decision so far (D1 to D79). Many of them change what the brief alone would suggest.

Use `docs/handoff-archive/phase-N.md` only when you need the history of an earlier phase. `docs/DEVLOG.md` has the full story in one place.

## 2. Where the project stands

_Updated by DOCU at the end of every phase. Last update: 2026-11-03, after the larger phone heading was pushed._

- **Phase:** all 8 phases are built and audited. Phase 8 (version 2 part B: juz, hizb and quarter markers, print-ready booklet, installable offline app, surah search) got PASS on 2026-11-02. Peek starts switched off (Hassan, D58).
- **Repo:** https://github.com/HBazara/quran-verse-openings is **public** (Hassan, 2026-11-02, D46).
- **Last commit:** `68695b2` "Page heading: larger on phones", pushed: `origin/main` is `68695b2`. Its Actions run (41669403986) passed check and deploy, so it is live. This hash update is a docs-only change for a later commit.
- **The site is live** at https://hbazara.github.io/quran-verse-openings/. Pages source is "GitHub Actions": `deploy.yml` publishes on `main` only after the checks pass (D57). Every run so far passed, starting with the first (41474933287, P6-02). The fonts are now public without a published license (P6-04, `docs/DATA-SOURCES.md`).
- **Offline:** the installable app is live (P6-03 done). AUD's live check of `68695b2` (2026-11-03): the service worker is active, the manifest is linked and the app cache holds all 28 app files. **Not tested:** the browser's install prompt and a real offline reload (AUD's tools cannot switch the network off). So install and offline are verified by cache contents only; **Hassan can confirm on a phone**.
- **Checks:** `node scripts/validate.mjs` gives 21 PASS and 1 SKIP; `--full` gives 25 PASS (it needs the QUL databases in `tmp/downloads/qul/x/`).
- **After phase 8:** P8-01, P8-03 and P8-04 are fixed, verified by AUD and live; P8-02 is closed (Hassan first kept the margin markers on everywhere, D67; on 2026-11-03 he chose to start phones without them, D79). Still open for **Hassan**: P6-06, his email address is visible in every commit now that the repo is public; new commits could use a GitHub no-reply address, and old commits stay unless history is rewritten.
- **Page heading:** the juz and surah names above each page, as in the print, asked for by Hassan, built by BUILDER, documented by DOCU (D72 to D75), passed AUD's audit and is live (`57ee514`). P9-01 closed: Hassan keeps the data's spelling of the 4 surah names that differ from the print by a hamza (D76). P9-02: Hassan asked for a larger heading on phones; built by BUILDER, documented by DOCU (D77), PASS by AUD, live (`68695b2`).
- **In progress:** the phone layout change Hassan asked for (D78: the screen never scrolls, the page fills it; D79: phones start without the margin markers). Built by BUILDER, tidied by ORG, documented by DOCU, PASS by AUD (no findings). DOCU sent "docs final"; ORG commits and pushes it. After the deploy, **Hassan checks it on his iPhone** (Chrome cannot copy the iPhone's bounce).
- **Next:** Hassan confirms install and offline on a phone if he wants. Hassan decides P6-06. No phase 9 is planned; any new work follows the same path: BUILDER, ORG, DOCU, AUD, then ORG commits after DOCU's "docs final".

## 3. Standing rules from Hassan

- **Commits:** one commit per phase, made only by ORG, only after AUD's PASS, from the audited state (D56). Pushes go through ORG too. After a PASS, ORG waits for DOCU's "docs final" message before committing, so DOCU's closing edits go into the same commit (agreed by ORG and DOCU, 2026-11-02).
- **The repo is public** since 2026-11-02 (D46). Every push to `main` that passes the checks goes live (D57), so push only audited work.
- **Never commit** the PDF (`*.pdf`, D10) or the QUL databases (`PROJECT.md` Rule 1 item 7). Both are ignored by git.
- **The Quran text must be exact** (`PROJECT.md` Rule 1). Never take Arabic text from the PDF, never type or edit it by hand.
- **No em dashes** anywhere. Plain, simple English. Format with Prettier.
- **Stay in your lane.** If something in another role's files is wrong, message the owner; never fix it yourself.
- **Questions for Hassan:** ask him in your own chat, then message his answer to every role it affects.

## 4. How to message

- Run `ListAgents` to see the other sessions. Send with `SendMessage` to the name exactly as `ListAgents` prints it.
- Keep messages short: phase, file, what happened, what you need.
- Reply to every message that needs action. Never wait silently: if you are blocked, message whoever blocks you and tell Hassan.
- After every turn, add an entry at the top of `docs/HANDOFF.md` (below the `---` line), using the template there.
- If messaging does not work, write the message as a `docs/HANDOFF.md` entry addressed to the role (for example "@BUILDER: ...") and tell Hassan which session to open.

## 5. First action after reading

1. Add a `docs/HANDOFF.md` entry: date and time, your role, the phase, "started after restart", and what you think your next step is.
2. Then, by role, for the current state in part 2:
   - **ORG:** commit DOCU's docs-only hash update with the next change. Apply Hassan's answer on P6-06 if it changes the commit identity.
   - **AUD:** audit BUILDER's phone layout change after DOCU's docs.
   - **BUILDER:** fix any AUD finding on the P8 fixes; Message ORG, DOCU and AUD after any change.
   - **DOCU:** record any fix or decision on P8-01 to P8-04. Keep part 2 of this file current.
