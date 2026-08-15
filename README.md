# design-md-init

让 AI 代理按你的设计系统生成 UI。

Standardize AI-generated UI across your project.

## 简介 / Overview

**中文:** 一个 Claude Code 插件。先扫描项目,问几个关键问题(主色、字体、密度、圆角等),然后在项目根目录生成一份 `DESIGN.md` —— 用 YAML 写下设计令牌(颜色、字体、间距、圆角等),用 Markdown 写下设计理念与使用规则。同时它会把一段"先生成 UI 代码前先读 DESIGN.md"的引导写进 `CLAUDE.md` / `AGENTS.md`,让后续每一个 AI 代理都按你的设计系统产出 UI,杜绝颜色/间距/字体随机发挥。一条命令完成。

**English:** A Claude Code plugin that scans your project, asks a few key design questions (primary color, typography, density, corner style, etc.), then writes a complete `DESIGN.md` at the project root — with design tokens (colors, typography, spacing, corner radius, etc.) in YAML and design rationale plus usage rules in Markdown. It also injects a "read DESIGN.md before writing UI" guidance block into `CLAUDE.md` / `AGENTS.md`, so every AI agent working on the project generates UI strictly against your design system. Zero config, one command.

## 它做什么 / What it does

写两个文件:

1. `./DESIGN.md` —— 设计系统的"单一事实源":YAML 令牌 + Markdown 理念。
2. 一段 `## Design System` 块,追加到 `CLAUDE.md` / `AGENTS.md`(若无则新建 `.claude/CLAUDE.md`)—— 让 AI 代理在写 UI 前自动读到 DESIGN.md。

It writes two things:

1. `./DESIGN.md` — the design system source of truth: YAML tokens + Markdown rationale.
2. A `## Design System` block, appended to `CLAUDE.md` / `AGENTS.md` (or a new `.claude/CLAUDE.md` if none exist) — so AI agents read DESIGN.md before generating UI.

## 安装 / Install

本仓库本身就是一个 plugin marketplace。

This repo doubles as a plugin marketplace.

```bash
# 从本地目录 / from a local checkout
claude plugin marketplace add /path/to/design-md-init
claude plugin install design-md-init

# 从 GitHub 安装(发布后) / install from GitHub once published
claude plugin marketplace add sunfleeting-debug/init-design-md
claude plugin install design-md-init
```

## 使用 / Use

```bash
# 初始化当前项目 / bootstrap the current project
/init-design-md

# 跳过提问,用默认 / skip questions, use defaults
/init-design-md --defaults

# 深度扫描 UI 组件文件 / include existing UI source files in the scan
/init-design-md --deep

# 已有 DESIGN.md 时不提示,自动合并 / auto-merge into an existing DESIGN.md
/init-design-md --from-existing
```

生成后,验证 + 接入构建:

After generating, validate and wire up your build:

```bash
npx --yes @google/design.md@0.4.0 lint DESIGN.md
npx --yes @google/design.md@0.4.0 export --format css-tailwind DESIGN.md > theme.css
```

## 开发 / Development

```bash
npm install
npm test
```

测试套件包含真实 linter 集成测试(对黄金示例跑真实校验)。

The test suite includes a real-linter integration test against the golden example.

## 许可证 / License

Apache-2.0
