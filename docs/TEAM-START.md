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
5. `docs/DECISIONS.md`: every decision so far (D1 to D66). Many of them change what the brief alone would suggest.

Use `docs/handoff-archive/phase-N.md` only when you need the history of an earlier phase. `docs/DEVLOG.md` has the full story in one place.

## 2. Where the project stands

_Updated by DOCU at the end of every phase. Last update: 2026-11-02, after the push and the first Actions run._

- **Phase:** 7 of 8, version 2 part A: peek mode, test mode, memorization tracker, bookmarks. Phases 1 to 6 passed AUD's audit. Phase 7 is built by BUILDER (including fixes for AUD's minor items P7-01 to P7-03) and documented by DOCU; it waits for ORG's tidy and AUD's PASS. It is not committed.
- **Repo:** https://github.com/HBazara/quran-verse-openings is **public** (Hassan, 2026-11-02, D46).
- **Last commit:** `03a8fc4` "Deploy after the checks pass on main (Hassan's decision)", on top of `9dec020` "Phase 6: polish and deploy workflow". Both are pushed: `origin/main` is `03a8fc4`.
- **The site is live** at https://hbazara.github.io/quran-verse-openings/. Pages source is "GitHub Actions": `deploy.yml` publishes on `main` only after the checks pass (D57). The first run on GitHub (run 41474933287) passed: check and deploy both succeeded, and the site is served from Actions (P6-02). The fonts are now public without a published license (P6-04, `docs/DATA-SOURCES.md`).
- **Offline:** the site does not work fully offline yet; each new page loads its font. That comes with the installable app in phase 8 (P6-03).
- **Checks:** `node scripts/validate.mjs` gives 20 PASS and 1 SKIP; `--full` gives 24 PASS (it needs the QUL databases in `tmp/downloads/qul/x/`).
- **Next:** ORG tidies phase 7, AUD audits it. After PASS, ORG commits phase 7 and pushes; the push publishes it.

## 3. Standing rules from Hassan

- **Commits:** one commit per phase, made only by ORG, only after AUD's PASS, from the audited state (D56). Pushes go through ORG too.
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
   - **ORG:** tidy phase 7. After AUD's PASS, commit and push it and archive the phase 7 handoff entries.
   - **AUD:** audit phase 7 after ORG's tidy. After the phase 7 push, check that its Actions run passed and the live site loads.
   - **BUILDER:** fix any phase 7 findings. Start phase 8 only after "Phase 7 PASS".
   - **DOCU:** wait for findings on the docs, or for the next phase to document. Update part 2 of this file at the end of every phase.
