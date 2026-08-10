import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import yaml from 'js-yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const example = path.join(root, 'skills/init-design-md/examples/minimal.md');

test('examples/minimal.md parses as YAML front matter', () => {
  const raw = readFileSync(example, 'utf8');
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(fm, 'must have YAML front matter delimited by ---');
  const data = yaml.load(fm[1]);
  assert.equal(typeof data, 'object');
  assert.ok(data.name, 'front matter needs a name');
  assert.ok(data.colors?.primary, 'front matter needs colors.primary');
});

test('examples/minimal.md has canonical section order', () => {
  const raw = readFileSync(example, 'utf8');
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
