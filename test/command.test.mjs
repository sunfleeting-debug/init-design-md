import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import yaml from 'js-yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const commandPath = path.join(root, 'commands/init-design-md.md');
const skillPath = path.join(root, 'skills/init-design-md/SKILL.md');

function frontmatter(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const fm = raw.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(fm, `${path.basename(filePath)} must start with YAML frontmatter`);
  return { data: yaml.load(fm[1]), body: raw.slice(fm[0].length) };
}

test('commands/init-design-md.md exists with valid frontmatter', () => {
  assert.ok(existsSync(commandPath), 'commands/init-design-md.md missing');
  const { data } = frontmatter(commandPath);
  assert.equal(typeof data, 'object');
  assert.ok(data.description, 'command needs a description');
});

test('command name matches the skill it invokes', () => {
  const { data: cmd } = frontmatter(commandPath);
  const { data: skill } = frontmatter(skillPath);
  assert.equal(cmd.name, skill.name,
    `command name "${cmd.name}" must equal skill name "${skill.name}"`);
  assert.equal(cmd.name, 'init-design-md');
});

test('command allowed-tools includes Skill', () => {
  const { data } = frontmatter(commandPath);
  assert.ok(data['allowed-tools'], 'command needs allowed-tools');
  assert.match(data['allowed-tools'], /\bSkill\b/,
    'allowed-tools must include the Skill tool');
});

test('argument-hint lists --deep, --defaults, and --from-existing', () => {
  const { data } = frontmatter(commandPath);
  assert.ok(data['argument-hint'], 'command needs argument-hint');
  for (const flag of ['--deep', '--defaults', '--from-existing']) {
    assert.ok(data['argument-hint'].includes(flag),
      `argument-hint must include ${flag}`);
  }
});

test('command body invokes the plugin-qualified skill', () => {
  const { body } = frontmatter(commandPath);
  assert.match(body, /design-md-init:init-design-md/,
    'body must reference the plugin-qualified skill name design-md-init:init-design-md');
});
