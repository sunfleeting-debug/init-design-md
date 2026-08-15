import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { frontmatter, paths } from './helpers/repo.mjs';

test('commands/init-design-md.md exists with valid frontmatter', () => {
  assert.ok(existsSync(paths.command), 'commands/init-design-md.md missing');
  const { data } = frontmatter(paths.command);
  assert.equal(typeof data, 'object');
  assert.ok(data.description, 'command needs a description');
});

test('command name matches the skill it invokes', () => {
  const { data: cmd } = frontmatter(paths.command);
  const { data: skill } = frontmatter(paths.skill);
  assert.equal(cmd.name, skill.name,
    `command name "${cmd.name}" must equal skill name "${skill.name}"`);
  assert.equal(cmd.name, 'init-design-md');
});

test('command allowed-tools includes Skill', () => {
  const { data } = frontmatter(paths.command);
  assert.ok(data['allowed-tools'], 'command needs allowed-tools');
  assert.match(data['allowed-tools'], /\bSkill\b/,
    'allowed-tools must include the Skill tool');
});

test('argument-hint lists --deep, --defaults, and --from-existing', () => {
  const { data } = frontmatter(paths.command);
  assert.ok(data['argument-hint'], 'command needs argument-hint');
  for (const flag of ['--deep', '--defaults', '--from-existing']) {
    assert.ok(data['argument-hint'].includes(flag),
      `argument-hint must include ${flag}`);
  }
});

test('command body invokes the plugin-qualified skill', () => {
  const { body } = frontmatter(paths.command);
  assert.match(body, /design-md-init:init-design-md/,
    'body must reference the plugin-qualified skill name design-md-init:init-design-md');
});
