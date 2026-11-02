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
5. `docs/DECISIONS.md`: every decision so far (D1 to D56). Many of them change what the brief alone would suggest.

Use `docs/handoff-archive/phase-N.md` only when you need the history of an earlier phase. `docs/DEVLOG.md` has the full story in one place.

## 2. Where the project stands

_Updated by DOCU at the end of every phase. Last update: 2026-11-01._

- **Phase:** 6 of 8, polish and deploy. Phases 1 to 5 passed AUD's audit.
- **Phase 6 status:** built by BUILDER (everything except publishing), tidied by ORG, documented by DOCU. **Waiting for AUD's audit.**
- **Last commit:** `f8d2876` "Phase 5: English and Arabic interface", pushed to the private repo https://github.com/HBazara/quran-verse-openings (4 commits). The phase 6 work is not committed yet.
- **The site is not published.** The workflow `.github/workflows/deploy.yml` is ready (see `README.md`, Deploy).
- **Waiting for Hassan:** whether the repo goes public (D46). Free GitHub Pages needs a public repo, so there is no live site until he decides.
- **Checks:** `node scripts/validate.mjs` gives 20 PASS and 1 SKIP; `--full` gives 24 PASS (it needs the QUL databases in `tmp/downloads/qul/x/`).
- **Next:** AUD audits phase 6. After PASS, ORG commits and pushes phase 6. Then phase 7 (version 2, part A: peek mode, test mode, memorization tracker, bookmarks).

## 3. Standing rules from Hassan

- **Commits:** one commit per phase, made only by ORG, only after AUD's PASS, from the audited state (D56). Pushes go through ORG too.
- **The repo stays private** until Hassan says it may go public (D46).
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
   - **AUD:** audit phase 6, then message the owners of any findings, or give PASS and message the other three.
   - **ORG:** wait for AUD's PASS, then commit and push phase 6 (with Hassan's approval) and archive the phase 6 handoff entries.
   - **BUILDER:** wait for AUD's PASS, or fix AUD's findings for your files. Start phase 7 only after "Phase 6 PASS".
   - **DOCU:** wait for findings on the docs, or for the next phase to document. Update part 2 of this file at the end of every phase.
