/**
 * Validates Mochileaf content JSON/Markdown without a full site build.
 * Run: npm run content:lint
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { articleSchema } from '../src/content/schemas/article';
import { characterSchema } from '../src/content/schemas/character';
import { gameSchema } from '../src/content/schemas/game';
import { guideDefaultsSchema, guideSchema } from '../src/content/schemas/guide';
import { collectTodoStrings } from '../src/lib/content/todo-report';

const root = join(fileURLToPath(import.meta.url), '..', '..');
const contentRoot = join(root, 'src/content');

type LintIssue = { level: 'error' | 'warn'; message: string };

const errors: LintIssue[] = [];
const warnings: LintIssue[] = [];

function readJsonDir(dir: string): { id: string; data: unknown }[] {
  const abs = join(contentRoot, dir);
  return readdirSync(abs)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({
      id: f.replace(/\.json$/, ''),
      data: JSON.parse(readFileSync(join(abs, f), 'utf8')),
    }));
}

function lintCollection<T>(
  name: string,
  items: { id: string; data: unknown }[],
  schema: { safeParse: (d: unknown) => { success: boolean; data?: T; error?: { message: string } } },
  assertId?: (data: T, id: string) => void,
) {
  const parsed: T[] = [];
  for (const { id, data } of items) {
    const result = schema.safeParse(data);
    if (!result.success) {
      errors.push({
        level: 'error',
        message: `[${name}] ${id}: ${result.error?.issues.map((i) => i.message).join('; ')}`,
      });
      continue;
    }
    try {
      assertId?.(result.data!, id);
    } catch (e) {
      errors.push({ level: 'error', message: `[${name}] ${id}: ${(e as Error).message}` });
      continue;
    }
    parsed.push(result.data!);
    for (const todo of collectTodoStrings(name, id, data as Record<string, unknown>)) {
      warnings.push({
        level: 'warn',
        message: `[${name}] ${id} — TODO in ${todo.field}: ${todo.value.slice(0, 80)}`,
      });
    }
  }
  return parsed;
}

const games = lintCollection('games', readJsonDir('games'), gameSchema, (g, id) => {
  if (g.slug !== id) throw new Error(`slug "${g.slug}" must match filename`);
});

const characters = lintCollection('characters', readJsonDir('characters'), characterSchema, (c, id) => {
  if (c.slug !== id) throw new Error(`slug "${c.slug}" must match filename`);
  if (!games.some((g) => g.slug === c.gameSlug)) {
    throw new Error(`unknown gameSlug "${c.gameSlug}"`);
  }
});

lintCollection('guides', readJsonDir('guides'), guideSchema, (g, id) => {
  if (g.characterSlug !== id) throw new Error(`characterSlug "${g.characterSlug}" must match filename`);
  if (!characters.some((c) => c.slug === g.characterSlug)) {
    throw new Error(`unknown characterSlug "${g.characterSlug}"`);
  }
});

lintCollection(
  'guideDefaults',
  readJsonDir('guides/_defaults'),
  guideDefaultsSchema,
);

const articlesDir = join(contentRoot, 'articles');
for (const file of readdirSync(articlesDir).filter((f) => f.endsWith('.md'))) {
  const id = file.replace(/\.md$/, '');
  const raw = readFileSync(join(articlesDir, file), 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    errors.push({ level: 'error', message: `[articles] ${id}: missing frontmatter` });
    continue;
  }
  const frontmatter = parseYaml(match[1]);
  const result = articleSchema.safeParse(frontmatter);
  if (!result.success) {
    errors.push({
      level: 'error',
      message: `[articles] ${id}: ${result.error.issues.map((i) => i.message).join('; ')}`,
    });
    continue;
  }
  if (result.data.gameSlug && !games.some((g) => g.slug === result.data.gameSlug)) {
    errors.push({ level: 'error', message: `[articles] ${id}: unknown gameSlug "${result.data.gameSlug}"` });
  }
  for (const todo of collectTodoStrings('articles', id, frontmatter as Record<string, unknown>)) {
    warnings.push({
      level: 'warn',
      message: `[articles] ${id} — TODO in ${todo.field}`,
    });
  }
}

console.log(`Content lint: ${games.length} games, ${characters.length} characters checked.\n`);

if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`  ⚠ ${w.message}`);
  console.log('');
}

if (errors.length) {
  console.error(`Errors (${errors.length}):`);
  for (const e of errors) console.log(`  ✖ ${e.message}`);
  process.exit(1);
}

console.log('✓ All content files passed schema validation.');
