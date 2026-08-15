import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import yaml from 'js-yaml';

/**
 * Read a file, failing with the path instead of a bare ENOENT stack.
 */
export function readOrFail(filePath, hint = '') {
  assert.ok(existsSync(filePath), `missing file: ${filePath}${hint ? ` (${hint})` : ''}`);
  try {
    return readFileSync(filePath, 'utf8');
  } catch (err) {
    assert.fail(`cannot read ${filePath}: ${err.message}`);
  }
}

/**
 * Parse YAML, attributing parse errors to the source file.
 */
export function parseYaml(source, filePath) {
  let data;
  try {
    data = yaml.load(source);
  } catch (err) {
    assert.fail(`invalid YAML in ${filePath}: ${err.message}`);
  }
  return data;
}

/**
 * Parse `---`-delimited YAML front matter, reporting which file and which
 * stage failed rather than throwing on a null/scalar document later on.
 */
export function frontmatter(filePath, hint = '') {
  const raw = readOrFail(filePath, hint);
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(fm, `${filePath} must start with --- delimited YAML front matter`);
  const data = parseYaml(fm[1], filePath);
  assert.ok(
    data !== null && typeof data === 'object' && !Array.isArray(data),
    `${filePath} front matter must be a non-empty YAML mapping, got ${
      Array.isArray(data) ? 'array' : data === null ? 'empty document' : typeof data
    }`
  );
  return { data, body: raw.slice(fm[0].length), raw };
}
