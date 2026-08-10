---
name: init-design-md
description: Generate a DESIGN.md for this project to standardize AI-generated UI
argument-hint: "[--deep] [--defaults] [--from-existing]"
allowed-tools: "Bash, Read, Grep, Glob, Write, Edit, AskUserQuestion"
---

Invoke the `init-design-md` skill (use the Skill tool, skill name
`init-design-md`) and run its full workflow.

Pass through any flags from the invocation:
- `--deep` — also sample UI component source files during the scan (Phase 1)
- `--defaults` — skip all clarifying questions, use plugin defaults (Phase 3)
- `--from-existing` — auto-merge an existing DESIGN.md without prompting (Phase 5)
