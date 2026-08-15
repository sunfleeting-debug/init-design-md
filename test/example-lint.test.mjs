import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { lint } from '@google/design.md/linter';
import { readOrFail, parseYaml } from './helpers.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const example = path.join(root, 'skills/init-design-md/examples/minimal.md');
const LINT_CLI = path.join(root, 'node_modules/@google/design.md/dist/index.js');

test('examples/minimal.md parses as YAML front matter', () => {
  const raw = readOrFail(example);
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(fm, 'must have YAML front matter delimited by ---');
  const data = parseYaml(fm[1], example);
  assert.ok(data !== null && typeof data === 'object', 'front matter must be a mapping');
  assert.ok(data.name, 'front matter needs a name');
  assert.ok(data.colors?.primary, 'front matter needs colors.primary');
});

test('examples/minimal.md has canonical section order', () => {
  const raw = readOrFail(example);
  const headings = [...raw.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  const canonical = [
    'Overview', 'Colors', 'Typography', 'Layout', 'Elevation & Depth',
    'Shapes', 'Components', "Do's and Don'ts",
  ];
  let prev = -1;
  for (const h of headings) {
    const idx = canonical.indexOf(h);
    assert.ok(idx > prev, `section "${h}" out of canonical order`);
    prev = idx;
  }
});

test('real linter: examples/minimal.md has zero errors (exit 0 state)', () => {
  const report = lint(readOrFail(example));
  const errors = report.findings.filter((f) => f.severity === 'error');
  assert.equal(report.summary.errors, 0,
    `real linter reported errors:\n${JSON.stringify(errors, null, 2)}`);
  // The golden example is known to produce exactly one orphaned-tokens
  // warning (colors.neutral is defined but never referenced). Warnings are
  // tolerated; this pins the expected warning so drift is visible.
  const orphaned = report.findings.filter((f) => f.rule === 'orphaned-tokens');
  assert.equal(orphaned.length, 1,
    `expected exactly one orphaned-tokens warning, got:\n${JSON.stringify(orphaned, null, 2)}`);
  assert.equal(orphaned[0].severity, 'warning');
  assert.equal(orphaned[0].path, 'colors.neutral');
});

test('real linter CLI exits 0 on examples/minimal.md', () => {
  assert.ok(existsSync(LINT_CLI),
    `lint CLI missing at ${LINT_CLI} — run \`npm install\` first`);
  const res = spawnSync(process.execPath, [LINT_CLI, 'lint', example], {
    encoding: 'utf8',
  });
  assert.ifError(res.error);
  assert.equal(res.signal, null, `lint CLI killed by signal ${res.signal}`);
  assert.equal(res.status, 0,
    `lint CLI exited ${res.status}:\nstdout:\n${res.stdout}\nstderr:\n${res.stderr}`);
  let report;
  try {
    report = JSON.parse(res.stdout);
  } catch (err) {
    assert.fail(`lint CLI stdout is not valid JSON (${err.message}):\n${res.stdout}`);
  }
  assert.equal(report.summary.errors, 0);
});
