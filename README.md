# design-md-init

A Claude Code plugin that bootstraps a [DESIGN.md](https://github.com/google-labs-code/design.md)
for any project, standardizing AI-generated UI.

## What it does

Scans your project, asks a few clarifying questions, then writes:

1. `./DESIGN.md` — the design-system truth: tokens in YAML front matter + design
   rationale in markdown.
2. A `## Design System` block in `CLAUDE.md` / `AGENTS.md` (or a new
   `.claude/CLAUDE.md`) so AI agents read `DESIGN.md` before generating UI.

## Install

This repo doubles as a plugin marketplace.

```bash
# from a local checkout
claude plugin marketplace add /path/to/design-md-init
claude plugin install design-md-init

# once published to GitHub, add by URL instead
claude plugin marketplace add Fleeting/design-md-init
claude plugin install design-md-init
```

## Use

```bash
# in the project you want to bootstrap
/init-design-md

# skip questions, use defaults
/init-design-md --defaults

# include existing UI source files in the scan
/init-design-md --deep

# auto-merge into an existing DESIGN.md without prompting
/init-design-md --from-existing
```

After generating, validate and wire up your build:

```bash
npx --yes @google/design.md lint DESIGN.md
npx --yes @google/design.md export --format css-tailwind DESIGN.md > theme.css
```

## Development

```bash
npm install
npm test
```

## License

Apache-2.0
