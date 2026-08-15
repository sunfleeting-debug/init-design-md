import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { readOrFail, parseYaml } from './helpers.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REFS = path.join(root, 'skills/init-design-md/references');
const VALID_TRIGGERS = new Set([
  // All projectContext booleans/values listed in SKILL.md Phase 1, plus the
  // special `always` trigger. Kept in the same order as Phase 1.
  'stack',
  'hasTailwind',
  'hasTailwindTokens',
  'hasCssVars',
  'noPrimaryColor',
  'hasPrimaryColor',
  'noTypography',
  'looksLikeDashboard',
  'looksLikeMarketing',
  'hasFigmaLink',
  'mentionsDark',
  'hasExistingDesignMd',
  'guidanceTarget',
  'intent',
  'degradedScan',
  'always',
]);

function loadQuestions() {
  const file = path.join(REFS, 'question-bank.yaml');
  return parseYaml(readOrFail(file), file);
}

function schemaPath() {
  return path.join(REFS, 'question-bank.schema.json');
}

test('question-bank.yaml is valid YAML and an array', () => {
  const q = loadQuestions();
  assert.ok(Array.isArray(q), 'question-bank.yaml must be a YAML array');
  assert.ok(q.length >= 5, `expected >=5 questions, got ${q.length}`);
});

test('every question matches the JSON schema', () => {
  const rawSchema = readOrFail(schemaPath());
  let schema;
  try {
    schema = JSON.parse(rawSchema);
  } catch (err) {
    assert.fail(`invalid JSON in ${schemaPath()}: ${err.message}`);
  }
  const ajv = new Ajv2020({ allErrors: true });
  const validate = ajv.compile(schema);
  const q = loadQuestions();
  const ok = validate(q);
  assert.ok(ok, `questions failed schema: ${JSON.stringify(validate.errors, null, 2)}`);
});

test('trigger values are known', () => {
  const q = loadQuestions();
  for (const item of q) {
    assert.ok(
      VALID_TRIGGERS.has(item.trigger),
      `unknown trigger "${item.trigger}" in question "${item.id}"`
    );
  }
});

test('defaultIndex points at a valid option and priority is unique', () => {
  const q = loadQuestions();
  const priorities = new Set();
  for (const item of q) {
    assert.ok(Array.isArray(item.options) && item.options.length > 0,
      `question "${item.id}": options must be a non-empty array`);
    assert.equal(typeof item.defaultIndex, 'number',
      `question "${item.id}": defaultIndex must be a number`);
    assert.ok(item.defaultIndex >= 0 && item.defaultIndex < item.options.length,
      `question "${item.id}": defaultIndex out of range`);
    assert.ok(!priorities.has(item.priority),
      `question "${item.id}": duplicate priority ${item.priority}`);
    priorities.add(item.priority);
  }
});

test('the default option is the one labeled (recommended)', () => {
  const q = loadQuestions();
  for (const item of q) {
    const defaultOption = item.options?.[item.defaultIndex];
    assert.ok(defaultOption, `question "${item.id}": no option at defaultIndex ${item.defaultIndex}`);
    const defaultLabel = defaultOption.label;
    assert.equal(typeof defaultLabel, 'string',
      `question "${item.id}": default option has no label`);
    assert.ok(defaultLabel.includes('(recommended)'),
      `question "${item.id}": default option "${defaultLabel}" is not labeled "(recommended)"`);
  }
});
