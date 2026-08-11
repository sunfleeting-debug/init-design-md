# design-md-init

> 一键为你的项目生成规范化的 [DESIGN.md](https://github.com/google-labs-code/design.md),让所有 AI 代理产出统一、可控的 UI 设计。

## 简介 / Overview

**中文:** `design-md-init` 是一个 Claude Code 插件,用于把 [DESIGN.md](https://github.com/google-labs-code/design.md) 设计令牌规范带到任何项目中。它会扫描你的项目结构,询问几个关键的设计决策(主色调、字体、密度、圆角等),然后自动生成一份完整的 `DESIGN.md`——包含 YAML 格式的设计令牌和 Markdown 格式的设计理念说明。同时它会把"先读 DESIGN.md 再写 UI 代码"的引导块注入到 `CLAUDE.md` / `AGENTS.md`,确保后续所有 AI 代理都按你定义的设计系统生成 UI,从源头杜绝颜色、间距、字体等不一致问题。无需任何配置,一条命令即可。

**English:** `design-md-init` is a Claude Code plugin that brings the [DESIGN.md](https://github.com/google-labs-code/design.md) design-token specification into any project. It scans your project structure, asks a few key design decisions (primary color, typography, density, corner style, etc.), then auto-generates a complete `DESIGN.md` — with YAML design tokens and Markdown design rationale. It also injects a "read DESIGN.md before writing UI" guidance block into `CLAUDE.md` / `AGENTS.md`, so every AI agent in the project generates UI strictly against your design system. Zero config, one command.

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
