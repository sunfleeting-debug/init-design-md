import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import yaml from 'js-yaml';
import { Ajv2020 } from 'ajv/dist/2020.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REFS = path.join(root, 'skills/init-design-md/references');
const VALID_TRIGGERS = new Set([
  'noPrimaryColor',
  'hasPrimaryColor',
  'noTypography',
  'hasTailwindTokens',
  'looksLikeDashboard',
  'looksLikeMarketing',
  'hasFigmaLink',
  'mentionsDark',
  'hasExistingDesignMd',
  'always',
]);

function loadQuestions() {
  const raw = readFileSync(path.join(REFS, 'question-bank.yaml'), 'utf8');
  return yaml.load(raw);
}

test('question-bank.yaml is valid YAML and an array', () => {
  const q = loadQuestions();
  assert.ok(Array.isArray(q), 'question-bank.yaml must be a YAML array');
  assert.ok(q.length >= 5, `expected >=5 questions, got ${q.length}`);
});

test('every question matches the JSON schema', () => {
  const schema = JSON.parse(
    readFileSync(path.join(REFS, 'question-bank.schema.json'), 'utf8')
  );
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
    const defaultLabel = item.options[item.defaultIndex].label;
    assert.ok(defaultLabel.includes('(recommended)'),
      `question "${item.id}": default option "${defaultLabel}" is not labeled "(recommended)"`);
  }
});
