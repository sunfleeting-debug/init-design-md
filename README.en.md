<div align="center">
  <img src=".github/assets/icon.png" width="108" alt="init-design-md" />
  <h1>init-design-md</h1>
  <p><b>Make AI agents build UI against your design system</b><br /><sub>One command to write a DESIGN.md, and wire the rules into CLAUDE.md / AGENTS.md</sub></p>
  <p>
    <img src="https://img.shields.io/badge/Claude%20Code-plugin-D97757" alt="Claude Code plugin">
    <img src="https://img.shields.io/badge/Node-%E2%89%A518-339933" alt="Node >= 18">
    <img src="https://img.shields.io/badge/interops-Google%20design.md-4285F4" alt="Interops with Google design.md">
    <img src="https://img.shields.io/badge/License-Apache--2.0-97CA00" alt="License: Apache-2.0">
  </p>
  <p>
    <a href="README.md">简体中文</a> ·
    <b>English</b>
  </p>
</div>

A Claude Code plugin that scans your project, asks a few key design questions (primary color, typography, density, corner style, …), then writes a complete `DESIGN.md` at the project root — **design tokens** (colors, typography, spacing, corner radius, …) in YAML and **design rationale plus usage rules** in Markdown. It also injects a "read DESIGN.md before writing UI" guidance block into `CLAUDE.md` / `AGENTS.md`, so every AI agent working on the project generates UI strictly against your design system — no more random colors, spacing or fonts.

**Zero config, one command.**

## At a glance

| | |
| --- | --- |
| **Shape** | Claude Code plugin (this repo doubles as its own plugin marketplace) |
| **Plugin id** | `design-md-init` · command `/init-design-md` |
| **Output** | `./DESIGN.md` (YAML tokens + Markdown rationale) plus a `## Design System` guidance block in `CLAUDE.md` / `AGENTS.md` |
| **Downstream** | Validate and export with `@google/design.md` (CSS / Tailwind theme) |
| **Requires** | Node ≥ 18 |
| **License** | Apache-2.0 |

---

## ✨ What it does

It writes two things:

1. **`./DESIGN.md`** — the design system's source of truth: YAML tokens + Markdown rationale. It scans your project, asks about the primary color, typography, density and corner style, then turns the answers into structured tokens rather than a vague prose description.
2. **A `## Design System` guidance block** — appended to `CLAUDE.md` / `AGENTS.md` (or a new `.claude/CLAUDE.md` if neither exists). That way AI agents **read DESIGN.md before writing UI** instead of improvising every time.

```text
/init-design-md
      │
      ├─ Phase 1  scan the project (stack, existing UI; --deep samples component sources)
      ├─ Phase 3  ask a few key questions (skip with --defaults)
      ├─ Phase 5  write DESIGN.md (auto-merge with --from-existing)
      └─ append ## Design System to CLAUDE.md / AGENTS.md
```

---

## 📦 Install

This repository doubles as a plugin marketplace, so you can install straight from GitHub:

```bash
claude plugin marketplace add sunfleeting-debug/init-design-md
claude plugin install design-md-init
```

Or from a local checkout:

```bash
claude plugin marketplace add /path/to/init-design-md
claude plugin install design-md-init
```

---

## 🚀 Use

```bash
# bootstrap the current project
/init-design-md

# skip the questions, use defaults
/init-design-md --defaults

# deep scan: include existing UI component source files in the analysis
/init-design-md --deep

# auto-merge into an existing DESIGN.md without prompting
/init-design-md --from-existing
```

After generating, validate and wire up your build:

```bash
npx --yes @google/design.md lint DESIGN.md
npx --yes @google/design.md export --format css-tailwind DESIGN.md > theme.css
```

---

## 🛠 Development

```bash
npm install
npm test
```

The test suite includes a **real-linter integration test** against the golden example, plus command, question-bank and static-structure checks.

> There is also a manual, pre-release **smoke test procedure**: [`docs/smoke-test.md`](docs/smoke-test.md).
> The deterministic `test/` suite cannot execute the natural-language instructions in SKILL.md, so the plugin's actual behaviour is verified there by a human.

---

## 📁 Repository layout

```text
.
├── .claude-plugin/
│   ├── plugin.json           plugin manifest
│   └── marketplace.json      marketplace manifest (this repo is its own marketplace)
├── commands/
│   └── init-design-md.md     the /init-design-md entry point (forwards args to the skill)
├── skills/init-design-md/
│   ├── SKILL.md              the workflow itself (Phase 1/3/5)
│   ├── references/           question bank, scan checklist, spec summary, export cheatsheet
│   └── examples/minimal.md   a minimal example output
├── test/                     node --test suite (includes the real-linter integration test)
└── docs/smoke-test.md        manual pre-release smoke procedure
```

---

## 📄 License

[Apache-2.0](LICENSE)
