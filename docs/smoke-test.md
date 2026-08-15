# Smoke Test Procedure (per release)

Run this before tagging a release. It is the real integration test — the
deterministic `test/` suite cannot execute natural-language SKILL.md
instructions, so this is where the plugin's actual behavior gets verified.

## Procedure

1. `cd` into a real project (pick one NOT already using this plugin).
2. Run `/init-design-md` in Claude Code.
3. Verify:
   - `./DESIGN.md` was created and reads sensibly (not generic filler);
     Overview references this project's stack or name.
   - YAML front matter parses; run `npx --yes @google/design.md lint DESIGN.md` →
     exit 0.
   - The agent-guidance block was appended to `.claude/CLAUDE.md` (or
     `CLAUDE.md` / `AGENTS.md`, per Phase 5 precedence), or created if none
     existed.
   - Rerun `/init-design-md` → prompts with overwrite / merge / write as
     DESIGN.v2.md (no `--from-existing`). Choose **overwrite** to move on.
   - Rerun `/init-design-md --defaults` → no clarifying questions (Phase 3
     skipped); at the conflict prompt choose **overwrite**; the regenerated
     Overview contains the defaults-notice sentence.
   - Rerun `/init-design-md --from-existing` → no prompt; prints merged diff;
     existing token values unchanged.
   - Rerun `/init-design-md --deep` → at the conflict prompt choose
     **overwrite**; the regenerated DESIGN.md's tokens reflect the sampled UI
     source files (only if the project has UI components).
4. Failure paths (error handling contract). In a scratch copy of the project:
   - `chmod 000 package.json`, run `/init-design-md --defaults` → the summary
     lists `package.json` under scan errors with the real reason and
     `Status: completed with degradations` (not `success`). Restore with
     `chmod 644`.
   - `chmod 444 .` (read-only dir), run `/init-design-md --defaults` → the run
     stops with `Status: failed`, names the write error, leaves no
     `DESIGN.md.tmp` behind, and does not append the guidance block.
   - Hand-edit the generated `DESIGN.md` to introduce a lint error (e.g. set
     `colors.primary` to `notacolor`), rerun `/init-design-md --from-existing`
     → Phase 6 prints the error findings and the summary reports the non-zero
     lint exit under degradations.
5. Back in the plugin repo, record the run under `test/golden/<date>-<project>/`
   (create dir, commit it) with the generated DESIGN.md and a short note on
   anything odd.

## Failures

- If any step 3 or step 4 check fails, fix `SKILL.md` (or the relevant reference doc),
  re-run, and update the golden record. Do not ship a release with a failing
  smoke test.
