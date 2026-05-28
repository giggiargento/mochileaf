import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { articleSchema, type ArticleFrontmatter } from '../../src/content/schemas/article';
import { characterSchema, type CharacterContent } from '../../src/content/schemas/character';
import { gameSchema, type GameContent } from '../../src/content/schemas/game';
import {
  guideDefaultsSchema,
  guideSchema,
  type GuideContent,
  type GuideDefaultsContent,
} from '../../src/content/schemas/guide';

const root = join(fileURLToPath(import.meta.url), '..', '..', '..');
export const contentRoot = join(root, 'src/content');

export type LoadedArticle = {
  slug: string;
  frontmatter: ArticleFrontmatter;
  body: string;
};

function readJsonDir<T>(dir: string, schema: { parse: (d: unknown) => T }): { id: string; data: T }[] {
  const abs = join(contentRoot, dir);
  return readdirSync(abs)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({
      id: f.replace(/\.json$/, ''),
      data: schema.parse(JSON.parse(readFileSync(join(abs, f), 'utf8'))),
    }));
}

export function loadGames(): GameContent[] {
  return readJsonDir('games', gameSchema).map(({ data }) => data);
}

export function loadCharacters(): CharacterContent[] {
  return readJsonDir('characters', characterSchema).map(({ data }) => data);
}

export function loadGuides(): GuideContent[] {
  return readJsonDir('guides', guideSchema).map(({ data }) => data);
}

export function loadGuideDefaults(): { id: string; data: GuideDefaultsContent }[] {
  return readJsonDir('guides/_defaults', guideDefaultsSchema);
}

export function loadArticles(): LoadedArticle[] {
  const dir = join(contentRoot, 'articles');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/, '');
      const raw = readFileSync(join(dir, f), 'utf8');
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
      if (!match) {
        throw new Error(`[articles] ${slug}: missing frontmatter`);
      }
      const frontmatter = articleSchema.parse(parseYaml(match[1]));
      const body = match[2].trim();
      return { slug, frontmatter, body };
    });
}

export const exportRoot = join(root, 'exports', 'review');
