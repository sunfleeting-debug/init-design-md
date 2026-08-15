# Scan Checklist — files to read in order

Read each item in order. Extract the facts listed under "Extract".

Missing and unreadable are different outcomes:

- **File does not exist** — expected; skip it silently and continue.
- **File exists but read/parse fails** (permission denied, invalid JSON/YAML,
  bad encoding) — record `<file>: <verbatim reason>` in `scanErrors`, set
  `partialScan: true`, and continue. Never swallow the reason: the facts this
  row would have produced are now unknown, not false, and that changes the
  Phase 2 question selection and the tokens Phase 4 carries forward.

If every file that exists failed to read, also set `degradedScan: true` and
continue (the Phase 3 question count stays capped at 4). All three signals get
reported in the Phase 7 summary.

| # | File | Extract |
|:--|:-----|:--------|
| 1 | `package.json` | `stack` (react/vue/svelte/next/nuxt/unknown from deps), `hasTailwind` (tailwindcss dep), project `name` (candidate for front-matter `name`), `description` (intent signal) |
| 2 | `README.md` (first 100 lines) | `intent` (one-sentence summary), `hasFigmaLink` (figma.com URL), `looksLikeMarketing` (marketing/landing/brand words), `looksLikeDashboard` (dashboard/admin/metrics/app/console words) |
| 3 | `tailwind.config.{js,ts,mjs,cjs}` | `hasTailwindTokens` (colors/spacing/fontFamily defined), existing token values to carry forward |
| 4 | `postcss.config.*`, `globals.css`, `theme.css`, `variables.css`, `app.css` | `hasCssVars` (--color-*, --font-*, --spacing-* variables), actual color values |
| 5 | Root `DESIGN.md` | `hasExistingDesignMd` (conflict detection for Phase 5) |
| 6 | `.claude/CLAUDE.md`, `CLAUDE.md`, `AGENTS.md` | `guidanceTarget` — which file exists / is the primary agent-guidance file, in Phase 5's precedence order (`.claude/CLAUDE.md` → `CLAUDE.md` → `AGENTS.md`) |
| 7 | (only with `--deep`) 3–5 sampled UI component files + any CSS modules | actual color usage, spacing rhythm, component patterns to reflect in tokens |

## Derived booleans

- `noPrimaryColor` — no `colors.primary` token found (from CSS vars / tailwind)
- `hasPrimaryColor` — negation of `noPrimaryColor`; used by the accent-usage question
- `noTypography` — no `fontFamily` tokens found
- `mentionsDark` — `dark` / `night` / `theme-switch` / `prefers-color-scheme` appears in deps or README
