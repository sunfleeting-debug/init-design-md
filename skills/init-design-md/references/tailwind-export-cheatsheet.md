# Tailwind Export Cheatsheet

When naming tokens in a generated DESIGN.md, prefer names that map cleanly to
Tailwind's theme namespace so `npx @google/design.md export` produces usable
output. This is guidance, not a requirement — DESIGN.md accepts any valid token name.

## Tailwind v3 (`theme.extend`)

The `export --format json-tailwind` emitter maps:

| DESIGN.md group | Tailwind namespace |
|:----------------|:-------------------|
| `colors.*` | `theme.extend.colors` |
| `typography.fontFamily` | `theme.extend.fontFamily` |
| `typography.fontSize` | `theme.extend.fontSize` |
| `typography.*` (other) | folded into the fontSize tuples (weight / lineHeight / letterSpacing metadata), not separate namespaces |
| `rounded.*` | `theme.extend.borderRadius` |
| `spacing.*` | `theme.extend.spacing` |

## Tailwind v4 (`@theme { ... }` CSS)

The `export --format css-tailwind` emitter emits CSS custom properties with
these namespaces:

| DESIGN.md group | CSS namespace |
|:----------------|:---------------|
| `colors.*` | `--color-*` |
| `typography.fontFamily` | `--font-*` |
| `typography.fontSize` | `--text-*` |
| `typography.lineHeight` | `--leading-*` |
| `typography.letterSpacing` | `--tracking-*` |
| `typography.fontWeight` | `--font-weight-*` |
| `rounded.*` | `--radius-*` |
| `spacing.*` | `--spacing-*` |

## Consequences for generation

- Prefer flat, hyphenated token names: `primary`, `surface-container`, `body-md`.
- Avoid slash characters in token names (they don't map to CSS custom property names).
- If the project is Tailwind v4 (`tailwindcss >= 4` in package.json), prefer
  emitting `spacing` scale keys (`xs`, `sm`, `md`, `lg`, `xl`) over arbitrary
  values so they land in `--spacing-*`.
- Keep color values in `#RRGGBB` hex when the source doesn't dictate otherwise;
  it round-trips through all emitters.
