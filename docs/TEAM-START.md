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
5. `docs/DECISIONS.md`: every decision so far (D1 to D71). Many of them change what the brief alone would suggest.

Use `docs/handoff-archive/phase-N.md` only when you need the history of an earlier phase. `docs/DEVLOG.md` has the full story in one place.

## 2. Where the project stands

_Updated by DOCU at the end of every phase. Last update: 2026-11-02, after the phase 8 commit and push._

- **Phase:** all 8 phases are built and audited. Phase 8 (version 2 part B: juz, hizb and quarter markers, print-ready booklet, installable offline app, surah search) got PASS on 2026-11-02. Peek starts switched off (Hassan, D58).
- **Repo:** https://github.com/HBazara/quran-verse-openings is **public** (Hassan, 2026-11-02, D46).
- **Last commit:** `44452fb` "Phase 8: search, margin markers, print booklet, offline app", pushed: `origin/main` is `44452fb`. Its Actions run (41511458126) passed check and deploy, so **version 2 is live**. DOCU's phase 8 closing edits (this part, README status, READER and DECISIONS open notes, DEVLOG) came after that commit and go into the next commit.
- **The site is live** at https://hbazara.github.io/quran-verse-openings/. Pages source is "GitHub Actions": `deploy.yml` publishes on `main` only after the checks pass (D57). Every run so far passed, starting with the first (41474933287, P6-02). The fonts are now public without a published license (P6-04, `docs/DATA-SOURCES.md`).
- **Offline:** the installable app is live (P6-03 done). AUD checks installing and offline use on the real https site.
- **Checks:** `node scripts/validate.mjs` gives 21 PASS and 1 SKIP; `--full` gives 25 PASS (it needs the QUL databases in `tmp/downloads/qul/x/`).
- **Open after phase 8:** BUILDER fixed P8-01 (search "aal imran"), P8-03 (deploy delay) and P8-04 (peek hides when switched off), plus a grid focus fix; documented by DOCU, verified by AUD. Not committed yet: ORG commits and pushes them with the doc edits (DOCU sent "docs final"). P8-02: Hassan keeps the margin markers on by default everywhere, phones included (D67); no code change.
- **Next:** AUD checks the live app (install and offline). Then the open items above, as Hassan decides. No phase 9 is planned. Any fix follows the same path: BUILDER, ORG, DOCU, AUD, then ORG commits and pushes.

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
   - **ORG:** after AUD's PASS on the P8 fixes and DOCU's "docs final", commit them with the uncommitted doc edits and push.
   - **AUD:** check the live app (install and offline on https), and the run after the P8 fixes push.
   - **BUILDER:** fix any AUD finding on the P8 fixes; Message ORG, DOCU and AUD after any change.
   - **DOCU:** record any fix or decision on P8-01 to P8-04. Keep part 2 of this file current.
