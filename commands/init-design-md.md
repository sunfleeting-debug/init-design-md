---
name: init-design-md
description: Generate a DESIGN.md for this project to standardize AI-generated UI
argument-hint: "[--deep] [--defaults] [--from-existing]"
allowed-tools: "Bash(npx:*), Read, Grep, Glob, Write, Edit, AskUserQuestion, Skill"
---

Invoke the skill (use the Skill tool, skill name `design-md-init:init-design-md`) and run its full workflow.
Invocation arguments: $ARGUMENTS — forward them to the skill as its args, so the skill's Phase 1/3/5 checks can see the flags.

Pass through any flags from the invocation:
- `--deep` — also sample UI component source files during the scan (Phase 1)
- `--defaults` — skip all clarifying questions, use plugin defaults (Phase 3)
- `--from-existing` — auto-merge an existing DESIGN.md without prompting (Phase 5)
