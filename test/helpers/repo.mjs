import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import yaml from 'js-yaml';

/** Absolute path to the repository root. */
export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..'
);

/** Absolute path to the skill directory. */
export const SKILL = path.join(root, 'skills/init-design-md');

/** Absolute path to the skill's references directory. */
export const REFS = path.join(SKILL, 'references');

/** Frequently asserted-on files, resolved from the repo root. */
export const paths = {
  command: path.join(root, 'commands/init-design-md.md'),
  skill: path.join(SKILL, 'SKILL.md'),
  example: path.join(SKILL, 'examples/minimal.md'),
  questionBank: path.join(REFS, 'question-bank.yaml'),
  questionBankSchema: path.join(REFS, 'question-bank.schema.json'),
  specSummary: path.join(REFS, 'spec-summary.md'),
  lintCli: path.join(root, 'node_modules/@google/design.md/dist/index.js'),
};

const FRONTMATTER = /^---\n([\s\S]*?)\n---/;

/** Read a UTF-8 file. */
export function readText(filePath) {
  return readFileSync(filePath, 'utf8');
}

/** Read a JSON file. */
export function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

/**
 * Split a Markdown file into its parsed YAML frontmatter and remaining body,
 * asserting that the frontmatter block is present.
 */
export function frontmatter(filePath) {
  const raw = readText(filePath);
  const fm = raw.match(FRONTMATTER);
  assert.ok(fm, `${path.basename(filePath)} must start with YAML frontmatter`);
  return { raw, yamlText: fm[1], data: yaml.load(fm[1]), body: raw.slice(fm[0].length) };
}

/** Parse the question bank YAML into an array of questions. */
export function loadQuestions() {
  return yaml.load(readText(paths.questionBank));
}

/** All `## ` headings of a Markdown file, in document order. */
export function headings(filePath) {
  return [...readText(filePath).matchAll(/^## (.+)$/gm)].map((m) => m[1]);
}
