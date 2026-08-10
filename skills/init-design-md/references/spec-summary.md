# DESIGN.md Format — Condensed Schema (for generation)

## File structure

A DESIGN.md has two layers:

1. **YAML front matter** — machine-readable design tokens, between `---` fences at the top.
2. **Markdown body** — human-readable rationale in `##` sections.

## Front matter schema

```yaml
version: <string>          # optional; current: "alpha"
name: <string>             # required
description: <string>      # optional
omitted: <string[]|OmittedSection[]>  # optional; suppress lint warnings for intentionally absent sections
colors:
  <token-name>: <Color>
typography:
  <token-name>: <Typography>
rounded:
  <scale-level>: <Dimension>
spacing:
  <scale-level>: <Dimension | number>
components:
  <component-name>:
    <token-name>: <string | token reference>
```

> Note: `spacing` values must carry a unit — bare numbers are dropped by the
> exporter. Always use unit'd values (e.g. `8px`).

## Token types

| Type | Format | Example |
|:-----|:-------|:--------|
| Color | Any valid CSS color (hex, rgb(), oklch(), named, color-mix) | `#1A1C1E`, `oklch(62% 0.18 250)` |
| Dimension | number + unit (`px`, `em`, `rem`) | `48px`, `-0.02em` |
| Token reference | `{path.to.token}` | `{colors.primary}` |
| Typography | object with keys below | see Typography section |

## Typography keys

- `fontFamily` (string)
- `fontSize` (Dimension)
- `fontWeight` (number, e.g. 400 / 700)
- `lineHeight` (Dimension | unitless number, e.g. 1.6)
- `letterSpacing` (Dimension)
- `fontFeature` (string) — `font-feature-settings`
- `fontVariation` (string) — `font-variation-settings`

## Component property keys

`backgroundColor`, `textColor`, `typography`, `rounded`, `padding`, `size`, `height`, `width`.

Component values may be literal or token references. Variants (hover, active, pressed) are separate entries with related keys: `button-primary`, `button-primary-hover`, `button-primary-active`.

## Section order (markdown body)

Sections use `##` headings. Present ones must appear in this order:

1. Overview (alias: Brand & Style)
2. Colors
3. Typography
4. Layout (alias: Layout & Spacing)
5. Elevation & Depth (alias: Elevation)
6. Shapes
7. Components
8. Do's and Don'ts

Sections can be omitted; the `omitted` front-matter key suppresses warnings for intentionally absent ones.

## Required content by section

- **Overview** — brand personality, audience, emotional response. One paragraph minimum.
- **Colors** — at least a `primary` palette. Common convention: `primary`, `secondary`, `tertiary`, `neutral`.
- **Typography** — 9–15 levels typical; name like `headline-display`, `body-md`, `label-sm`, `caption`.
- **Components** — style atoms: buttons, chips, lists, tooltips, checkboxes, radio, input fields.

## Recommended token names (non-normative)

- Colors: `primary`, `secondary`, `tertiary`, `neutral`, `surface`, `on-surface`, `error`
- Typography: `headline-display`, `headline-lg`, `headline-md`, `body-lg`, `body-md`, `body-sm`, `label-lg`, `label-md`, `label-sm`
- Rounded: `none`, `sm`, `md`, `lg`, `xl`, `full`

## Consumer behavior for unknown content

| Scenario | Behavior |
|:---------|:---------|
| Unknown section heading | Preserve; do not error |
| Unknown color token name | Accept if value is valid |
| Unknown typography token name | Accept as valid typography |
| Unknown component property | Accept with warning |
| Duplicate section heading | Error; reject the file |
