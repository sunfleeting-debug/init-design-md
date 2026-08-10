# Smoke Test Procedure (per release)

Run this before tagging a release. It is the real integration test — the
deterministic `test/` suite cannot execute natural-language SKILL.md
instructions, so this is where the plugin's actual behavior gets verified.

## Procedure

1. `cd` into a real project (pick one NOT already using this plugin).
2. Run `/init-design-md` in Claude Code.
3. Verify:
   - `./DESIGN.md` was created and reads sensibly (not generic filler).
   - YAML front matter parses; run `npx @google/design.md lint DESIGN.md` →
     exit 0.
   - The agent-guidance block was appended to `CLAUDE.md` / `AGENTS.md` /
     `.claude/CLAUDE.md`.
   - Rerun `/init-design-md` → prompts with overwrite / merge / rename (no
     `--from-existing`).
   - Rerun `/init-design-md --defaults` → no questions asked; Overview contains
     the defaults-notice sentence.
   - Rerun `/init-design-md --from-existing` → no prompt; prints merged diff;
     existing token values unchanged.
4. Record the run under `tests/golden/<date>-<project>/` (create dir) with the
   generated DESIGN.md and a short note on anything odd.

## Failures

- If any step 3 check fails, fix `SKILL.md` (or the relevant reference doc),
  re-run, and update the golden record. Do not ship a release with a failing
  smoke test.
