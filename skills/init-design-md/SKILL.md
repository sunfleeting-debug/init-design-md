---
name: init-design-md
description: Bootstrap a DESIGN.md for the current project to standardize AI-generated UI. Use when the user asks to generate a design system, define visual tokens, make AI agents produce consistent UI, or "init a design.md".
---

# init-design-md

Generate a `DESIGN.md` for the current project and wire up agent guidance so
future AI work in this project follows it.

## Workflow

Run the seven phases below **in order**. Each phase has explicit success /
degraded / failure outcomes. **A phase failure never aborts the run** — degrade
forward and report what degraded in the Phase 7 summary.

## Phase 1 — Scan the project (mandatory)

Read `references/scan-checklist.md`. Walk its list in order, extracting facts
into an in-memory `projectContext`:

- `stack`, `hasTailwind`, `hasTailwindTokens`, `hasCssVars`
- `noPrimaryColor`, `hasPrimaryColor`, `noTypography`
- `looksLikeDashboard`, `looksLikeMarketing`
- `hasFigmaLink`, `mentionsDark`, `hasExistingDesignMd`
- `guidanceTarget` (`CLAUDE.md` | `AGENTS.md` | `.claude/CLAUDE.md` | null)
- `intent` (one-sentence project summary)
- `degradedScan` (true if no files were readable)

If all files are unreadable, set `degradedScan: true` and continue — do not
abort.

If the invocation included `--deep`, also read 3–5 sampled UI component files
and any CSS modules (scan-checklist row 7) and reflect them in the extracted
facts.

## Phase 2 — Decide what to ask

Read `references/question-bank.yaml`. Select questions whose `trigger` matches
`projectContext`. The `always` trigger always matches. A trigger matches when
its named `projectContext` boolean is true. Sort selected questions
by `priority` ascending, then take the top 4.

If zero questions match, skip Phase 3 entirely.

`degradedScan` does not change the question count — the cap is always 4.

## Phase 3 — Ask the user (one batched call)

Make **one** `AskUserQuestion` call with up to 4 questions. Follow the
question-bank's `options` verbatim and carry over each question's `header`
field unchanged. Every question must carry:
- 2–4 options with one-line descriptions
- the `defaultIndex` option labeled with `(recommended)` in its label

If the user picks "Other" and leaves it blank, treat it as accepting the
default.

If the user cancels the question prompt, print `Generation cancelled.` and
stop — do not write any files.

If the user picks an option that requests custom input (e.g. '我直接给 hex',
'我自定义'), ask one short follow-up for the value and use it.

If the command was invoked with `--defaults`, **skip this phase** and use each
question's `defaultIndex`.

## Phase 4 — Draft the DESIGN.md

Read `references/spec-summary.md` and `references/tailwind-export-cheatsheet.md`.
Also read `examples/minimal.md` as a structural reference for the output shape.

Build YAML front matter by:
1. Carrying forward tokens found in Phase 1 (CSS vars, tailwind colors) with
   the same values and names where possible.
2. Filling gaps with the user's Phase 3 answers, or with question-bank defaults
   if Phase 3 was skipped. Map answers to the fields they concern: primary
   color → `colors.primary`; typography → `typography.fontFamily`/`fontSize`;
   accent scope → `colors.accent`; density → Layout rationale; corner style →
   `rounded.*`; dark mode → a dark-variant note in the rationale; system
   name → front-matter `name`.
3. Using Tailwind-friendly token names per the cheatsheet.
4. **Never inventing a schema field.** If a needed field isn't in
   `spec-summary.md`, omit it. The `omitted` front-matter key may only name
   these five sections: `colors`, `typography`, `spacing`, `rounded`,
   `components`. (Layout and Elevation & Depth cannot be declared omitted —
   the linter rejects unknown omitted names.) When you decide not to include
   one of those five sections, declare it in the `omitted` front-matter list.

Build the markdown body in canonical section order (Overview, Colors,
Typography, Layout, Elevation & Depth, Shapes, Components, Do's and Don'ts).
Every present section needs both rationale (why) and usage rules (how to
apply) so an agent reading it knows how to use the tokens, not just their values.

If Phase 3 was skipped (defaults used), the Overview must include:

> _Design rationale: density, corner radius, dark mode, and accent scope were
> set from plugin defaults and not from your explicit choices. Edit this
> section after generation if any default is wrong for your project._

## Phase 5 — Write files (conflict detection)

**`./DESIGN.md`:**

- Doesn't exist → write it.
- Exists and no `--from-existing` flag → one `AskUserQuestion`: `overwrite` /
  `merge into existing` / `write as DESIGN.v2.md`. Default: `merge into existing`.
- Exists with `--from-existing` → skip the prompt. Auto-merge: keep every
  existing token value; add new tokens from the draft only where absent; never
  overwrite an existing value. Print the merged diff to stdout.

`overwrite` is destructive — print a one-line warning before proceeding.

Merge semantics for `merge into existing`:
- Keep existing sections verbatim; append draft sections that are absent, in
  canonical order.
- Never overwrite an existing scalar token value; append new tokens.
- Write atomically (write to `DESIGN.md.tmp`, then rename over `DESIGN.md`).

**Agent-guidance file:**

When multiple guidance files exist, target exactly one, in this order:
`.claude/CLAUDE.md`, then `CLAUDE.md`, then `AGENTS.md`.

- `guidanceTarget` found (CLAUDE.md / AGENTS.md / .claude/CLAUDE.md) → append a
  `## Design System` block referencing `./DESIGN.md`. Never replace the file.
- No guidance target → create `.claude/CLAUDE.md` with the same block plus a
  one-line stub for project-specific instructions.

If the file was written as `DESIGN.v2.md`, replace `./DESIGN.md` with
`./DESIGN.v2.md` in the block below.

The block:

```markdown
## Design System

This project uses [DESIGN.md](./DESIGN.md) as the source of truth for all
visual design decisions. **Before generating any UI code, read `./DESIGN.md`
and follow its token names exactly.** Do not introduce new colors, fonts,
spacing, or radii that aren't in `DESIGN.md`. If a needed token doesn't exist,
surface it to the user; do not improvise.

After making UI changes, re-read `DESIGN.md` to verify the result stays
within the spec.
```

On write failure (permission denied, disk full, etc.), print the specific
reason and a remediation, record it as a degraded phase, and continue to
Phase 7.

## Phase 6 — Verify (best-effort)

Run `npx --yes @google/design.md lint <the file written this run>`. If it
runs, print the findings.

Expect warnings on generated files — for example, an `orphaned-tokens` warning
for a color defined but not yet referenced by any component is normal and not a
failure. **The success bar is exit code 0 / zero errors.**

If `npx` fails (no network / not installed), skip and tell the user to run it
manually. This phase never blocks anything.

## Phase 7 — Hand off

Print a single summary block:

- Files written / modified (with paths)
- Lint findings summary (if Phase 6 ran)
- List of any degraded phases (scan failure, defaults used, lint skipped) —
  **nothing silent**
- Next steps: review `DESIGN.md`, optionally run
  `npx --yes @google/design.md export --format css-tailwind <that same file>`,
  commit.
