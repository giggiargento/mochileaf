/**
 * One-time / repeat migration: copies legacy src/data into src/content.
 * Run: npm run content:migrate
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { games } from '../src/lib/content/games.ts';
import { characters } from '../src/lib/content/characters.ts';
import { getCollection } from 'astro:content';
import { articleBodies } from '../src/data/_legacy/article-bodies.ts';
import { getNteCharacterGuide } from '../src/data/_legacy/nte-character-guides.ts';
import type { Character } from '../src/types/index.ts';
import type { GameContent, GuideContent } from '../src/content/schemas.ts';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const contentRoot = join(root, 'src/content');

const acnhDetails = JSON.parse(
  readFileSync(join(root, 'src/data/acnh-villager-details.json'), 'utf8'),
) as { villagers: Record<string, unknown> };

function writeJson(path: string, data: unknown) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function gameToContent(game: (typeof games)[0]): GameContent {
  return {
    ...game,
    seo: {
      title: `${game.name} guides & cozy tips`,
      description: game.description,
    },
    genres: [],
    platforms: [],
    cozyMechanics: [],
    similarGames: [],
    beginnerTips: [],
    tags: [game.shortName ?? game.name].filter(Boolean),
    about: game.description,
  };
}

function characterToContent(c: Character) {
  const acnh = acnhDetails.villagers[c.slug];
  const vi = acnh && typeof acnh === 'object' && 'villagerInfo' in acnh
    ? (acnh as { villagerInfo?: { food?: string; drink?: string; hobby?: string } }).villagerInfo
    : undefined;

  return {
    ...c,
    seo: {
      title: `${c.name} — ${c.role}`,
      description: c.description,
    },
    likes: [],
    dislikes: [],
    favoriteGifts: [],
    favoriteFoods: vi?.food ? [vi.food] : [],
    routines: [],
    relationships: [],
    trivia: [],
    tags: [c.personality, c.species, c.element].filter(Boolean) as string[],
    ...(acnh ? { acnh } : {}),
  };
}

function sectionsToMarkdown(sections: { heading?: string; paragraphs: string[] }[]): string {
  return sections
    .map((section) => {
      const heading = section.heading ? `## ${section.heading}\n\n` : '';
      const body = section.paragraphs.join('\n\n');
      return `${heading}${body}`;
    })
    .join('\n\n');
}

function articleFrontmatter(article: (typeof articles)[0]): string {
  const lines = [
    '---',
    `title: ${JSON.stringify(article.title)}`,
    `excerpt: ${JSON.stringify(article.excerpt)}`,
    `category: ${JSON.stringify(article.category)}`,
    ...(article.gameSlug ? [`gameSlug: ${JSON.stringify(article.gameSlug)}`] : []),
    `publishedAt: ${JSON.stringify(article.publishedAt)}`,
    `readTime: ${JSON.stringify(article.readTime)}`,
    ...(article.featured ? ['featured: true'] : []),
    ...(article.trending ? ['trending: true'] : []),
    'seo:',
    `  title: ${JSON.stringify(article.title)}`,
    `  description: ${JSON.stringify(article.excerpt)}`,
    '---',
    '',
  ];
  return lines.join('\n');
}

async function main() {
// --- games ---
for (const game of games) {
  writeJson(join(contentRoot, 'games', `${game.slug}.json`), gameToContent(game));
}

// --- characters ---
for (const c of characters) {
  writeJson(join(contentRoot, 'characters', `${c.slug}.json`), characterToContent(c));
}

// --- NTE role defaults + per-character overrides ---
const nteChars = characters.filter((c) => c.gameSlug === 'neverness-to-everness');
const roles = ['Attack', 'Support', 'Defense', 'Assist'] as const;
const defaultsDir = join(contentRoot, 'guides', '_defaults');

for (const role of roles) {
  const sample = nteChars.find((c) => c.role === role) ?? nteChars[0];
  const guide = getNteCharacterGuide(sample);
  const payload: Omit<GuideContent, 'characterSlug' | 'gameSlug'> = {
    buildSummary: guide.buildSummary,
    diskSets: guide.diskSets,
    modules: guide.modules,
    skillPriority: guide.skillPriority,
    farming: guide.farming,
  };
  writeJson(join(defaultsDir, `${role.toLowerCase()}.json`), payload);
}

for (const c of nteChars) {
  const full = getNteCharacterGuide(c);
  const custom = {
    characterSlug: c.slug,
    gameSlug: c.gameSlug,
    buildSummary: full.buildSummary,
    diskSets: full.diskSets,
    modules: full.modules,
    skillPriority: full.skillPriority,
    farming: full.farming,
    seo: {
      title: `${c.name} build guide`,
      description: full.buildSummary,
    },
  };
  writeJson(join(contentRoot, 'guides', `${c.slug}.json`), custom);
}

// --- articles ---
const articlesDir = join(contentRoot, 'articles');
mkdirSync(articlesDir, { recursive: true });

const articleEntries = await getCollection('articles');
const legacyArticles = articleEntries.map((entry) => ({
  slug: entry.id.replace(/\.md$/, ''),
  title: entry.data.title,
  excerpt: entry.data.excerpt,
  category: entry.data.category,
  gameSlug: entry.data.gameSlug,
  publishedAt: entry.data.publishedAt,
  readTime: entry.data.readTime,
  featured: entry.data.featured,
  trending: entry.data.trending,
}));

for (const article of legacyArticles) {
  const body = articleBodies[article.slug];
  const md =
    articleFrontmatter(article) +
    (body ? sectionsToMarkdown(body) : '_TODO: Write article body in Markdown._\n');
  writeFileSync(join(articlesDir, `${article.slug}.md`), md, 'utf8');
}

  console.log(
    `Migrated ${games.length} games, ${characters.length} characters, ${legacyArticles.length} articles, ${nteChars.length} NTE guides.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
