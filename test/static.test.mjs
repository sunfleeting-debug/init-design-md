import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILL = path.join(root, 'skills/init-design-md');
const KNOWN_KEYS = new Set([
  'version', 'name', 'description', 'omitted',
  'colors', 'typography', 'rounded', 'spacing', 'components',
  'fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing',
  'fontFeature', 'fontVariation',
  'backgroundColor', 'textColor', 'typography', 'rounded', 'padding',
  'size', 'height', 'width',
]);

test('SKILL.md exists and has valid frontmatter', () => {
  const skillPath = path.join(SKILL, 'SKILL.md');
  assert.ok(existsSync(skillPath), 'SKILL.md missing');
  const raw = readFileSync(skillPath, 'utf8');
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(fm, 'SKILL.md must start with YAML frontmatter');
  assert.match(raw, /name: init-design-md/, 'frontmatter name must match directory');
  assert.ok(/\S/.test(fm[1]), 'frontmatter must be non-empty');
});

test('every references/* file named in SKILL.md exists', () => {
  const raw = readFileSync(path.join(SKILL, 'SKILL.md'), 'utf8');
  const refs = [...raw.matchAll(/references\/([\w.-]+)/g)].map((m) => m[1]);
  assert.ok(refs.length > 0, 'SKILL.md must reference at least one references/ file');
  for (const ref of new Set(refs)) {
    assert.ok(existsSync(path.join(SKILL, 'references', ref)),
      `SKILL.md references missing file: references/${ref}`);
  }
});

test('spec-summary.md only uses known schema keys', () => {
  const raw = readFileSync(path.join(SKILL, 'references/spec-summary.md'), 'utf8');
  // Only backtick-wrapped tokens in key position (line start, optionally after
  // a "- " bullet) are schema keys. Value examples like `px` or `primary` in
  // tables and the "Recommended token names" section are not keys.
  const mentions = raw
    .split('\n')
    .filter((line) => /^[ \t]*(?:- )?`[a-zA-Z]+`/.test(line))
    .flatMap((line) => [...line.matchAll(/`([a-zA-Z]+)`/g)].map((m) => m[1]));
  for (const key of new Set(mentions)) {
    assert.ok(KNOWN_KEYS.has(key),
      `spec-summary.md mentions unknown schema key: ${key}`);
  }
});

test('question-bank.yaml exists (dependency of Phase 2)', () => {
  assert.ok(existsSync(path.join(SKILL, 'references/question-bank.yaml')));
});
