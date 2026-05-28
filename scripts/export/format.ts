import type { ArticleFrontmatter } from '../../src/content/schemas/article';
import type { CharacterContent } from '../../src/content/schemas/character';
import type { GameContent } from '../../src/content/schemas/game';
import type { GuideContent } from '../../src/content/schemas/guide';
import { isTodoText, type ContentSeo } from '../../src/content/schemas/shared';
import { collectTodoStrings } from '../../src/lib/content/todo-report';
import type { LoadedArticle } from './load';

function mdList(items: string[] | undefined, empty = '_None_'): string {
  const list = (items ?? []).filter((s) => s.trim().length > 0);
  if (list.length === 0) return empty;
  return list.map((item) => `- ${item}`).join('\n');
}

function formatSeo(seo: ContentSeo): string {
  const lines = [
    `- **Title:** ${seo.title}`,
    `- **Description:** ${seo.description}`,
  ];
  if (seo.image) lines.push(`- **Image:** ${seo.image}`);
  if (seo.keywords?.length) lines.push(`- **Keywords:** ${seo.keywords.join(', ')}`);
  return lines.join('\n');
}

function formatTodos(collection: string, id: string, data: unknown): string {
  const todos = collectTodoStrings(collection, id, data as Record<string, unknown>);
  if (todos.length === 0) return '_No TODO placeholders found._';
  return todos.map((t) => `- **${t.field}:** ${t.value}`).join('\n');
}

function flagTodo(label: string, value: string | undefined): string {
  if (!value) return '';
  return isTodoText(value) ? ` ⚠️ _TODO_` : '';
}

export function documentHeader(title: string, source: string, count: number): string {
  return [
    `# ${title}`,
    '',
    `**Generated:** ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC`,
    `**Entries:** ${count}`,
    `**Source:** \`${source}\``,
    '',
    '> Combined export for editorial review. Paste into ChatGPT or share with reviewers.',
    '',
  ].join('\n');
}

export function formatGame(game: GameContent): string {
  return [
    `## ${game.name}`,
    '',
    `- **Slug:** \`${game.slug}\``,
    `- **Status:** ${game.status}`,
    game.shortName ? `- **Short name:** ${game.shortName}` : '',
    `- **Tagline:** ${game.tagline}`,
    '',
    '### SEO',
    formatSeo(game.seo),
    '',
    '### Tags',
    mdList(game.tags),
    '',
    '### Description',
    game.description + flagTodo('description', game.description),
    '',
    game.about && game.about !== game.description
      ? `### About\n\n${game.about}${flagTodo('about', game.about)}\n`
      : '',
    '### Genres',
    mdList(game.genres),
    '',
    '### Platforms',
    mdList(game.platforms),
    '',
    '### Cozy mechanics',
    mdList(game.cozyMechanics),
    '',
    '### Beginner tips',
    mdList(game.beginnerTips),
    '',
    '### Similar games',
    mdList(game.similarGames),
    '',
    '### TODO fields',
    formatTodos('games', game.slug, game),
  ]
    .filter(Boolean)
    .join('\n');
}

function formatAcnhBlock(character: CharacterContent): string {
  const acnh = character.acnh;
  if (!acnh) return '';

  const lines: string[] = ['### ACNH reference', ''];
  if (acnh.intro) lines.push(acnh.intro, '');
  if (acnh.appearance) {
    lines.push('#### Appearance', '', acnh.appearance, '');
  }
  if (acnh.personality) {
    lines.push('#### Personality (detail)', '', acnh.personality, '');
  }
  const vi = acnh.villagerInfo;
  if (vi) {
    lines.push('#### Villager info', '');
    for (const [key, val] of Object.entries(vi)) {
      if (val == null || val === '') continue;
      if (Array.isArray(val)) {
        lines.push(`- **${key}:** ${val.join(', ')}`);
      } else {
        lines.push(`- **${key}:** ${val}`);
      }
    }
    lines.push('');
  }
  if (acnh.house) {
    lines.push('#### House', '');
    const h = acnh.house;
    if (h.exteriorImage) lines.push(`- Exterior reference: ${h.exteriorImage}`);
    if (h.interiorImage) lines.push(`- Interior reference: ${h.interiorImage}`);
    if (h.furniture?.length) {
      lines.push('', '**Furniture:**', mdList(h.furniture));
    }
    lines.push('');
  }
  return lines.join('\n');
}

export function formatCharacter(character: CharacterContent): string {
  return [
    `## ${character.name}`,
    '',
    `- **Slug:** \`${character.slug}\``,
    `- **Game:** ${character.gameSlug}`,
    `- **Role:** ${character.role}`,
    character.element ? `- **Element:** ${character.element}` : '',
    character.personality ? `- **Personality:** ${character.personality}` : '',
    character.species ? `- **Species:** ${character.species}` : '',
    character.rarity ? `- **Rarity:** ${character.rarity}` : '',
    character.tier ? `- **Tier:** ${character.tier}` : '',
    '',
    '### SEO',
    formatSeo(character.seo),
    '',
    '### Tags',
    mdList(character.tags),
    '',
    '### Description',
    character.description + flagTodo('description', character.description),
    '',
    character.houseStyle
      ? `### House style\n\n${character.houseStyle}\n\n${character.houseDescription ?? ''}`
      : '',
    '### Likes',
    mdList(character.likes),
    '',
    '### Dislikes',
    mdList(character.dislikes),
    '',
    '### Favorite gifts',
    mdList(character.favoriteGifts),
    '',
    '### Favorite foods',
    mdList(character.favoriteFoods),
    '',
    '### Routines',
    character.routines?.length
      ? character.routines
          .map((r) => `- **${r.label}** @ ${r.location}${r.time ? ` (${r.time})` : ''}`)
          .join('\n')
      : '_None_',
    '',
    '### Relationships',
    character.relationships?.length
      ? character.relationships.map((r) => `- **${r.name}:** ${r.note}`).join('\n')
      : '_None_',
    '',
    '### Trivia',
    mdList(character.trivia),
    '',
    formatAcnhBlock(character),
    '### TODO fields',
    formatTodos('characters', character.slug, character),
  ]
    .filter(Boolean)
    .join('\n');
}

export function formatGuide(guide: GuideContent): string {
  const formatItems = (items: { name: string; note?: string }[]) =>
    items.map((i) => `- **${i.name}**${i.note ? ` — ${i.note}` : ''}`).join('\n');

  return [
    `## ${guide.characterSlug} (build guide)`,
    '',
    `- **Character slug:** \`${guide.characterSlug}\``,
    `- **Game:** ${guide.gameSlug}`,
    '',
    '### SEO',
    formatSeo(guide.seo),
    '',
    '### Build summary',
    guide.buildSummary + flagTodo('buildSummary', guide.buildSummary),
    '',
    '### Recommended disks',
    formatItems(guide.diskSets),
    '',
    '### Recommended modules',
    formatItems(guide.modules),
    '',
    '### Skill priority',
    guide.skillPriority
      .map((s, i) => `${i + 1}. **${s.skill}** — ${s.scales}`)
      .join('\n'),
    '',
    '### What to farm',
    guide.farming
      .map(
        (f) =>
          `- **${f.name}** — ${f.purpose}\n  - Where: ${f.location}${f.tip ? `\n  - Tip: ${f.tip}` : ''}`,
      )
      .join('\n'),
    '',
    '### TODO fields',
    formatTodos('guides', guide.characterSlug, guide),
  ].join('\n');
}

export function formatArticle(article: LoadedArticle): string {
  const fm = article.frontmatter;
  return [
    `## ${fm.title}`,
    '',
    `- **Slug:** \`${article.slug}\``,
    `- **Category:** ${fm.category}`,
    fm.gameSlug ? `- **Game:** ${fm.gameSlug}` : '',
    `- **Published:** ${fm.publishedAt}`,
    `- **Read time:** ${fm.readTime}`,
    fm.featured ? `- **Featured:** yes` : '',
    fm.trending ? `- **Trending:** yes` : '',
    fm.draft ? `- **Draft:** yes` : '',
    '',
    '### SEO',
    formatSeo(fm.seo),
    '',
    '### Excerpt',
    fm.excerpt + flagTodo('excerpt', fm.excerpt),
    '',
    '### TODO fields',
    formatTodos('articles', article.slug, fm),
    '',
    '### Body',
    '',
    article.body || '_Empty body._',
  ]
    .filter(Boolean)
    .join('\n');
}

export function joinEntries(header: string, entries: string[]): string {
  const divider = '\n\n---\n\n';
  return header + entries.join(divider) + '\n';
}

export type ArticleFilter = {
  gameSlug?: string;
  category?: ArticleFrontmatter['category'];
};

export function filterArticles(articles: LoadedArticle[], filter: ArticleFilter): LoadedArticle[] {
  return articles.filter((a) => {
    if (filter.gameSlug && a.frontmatter.gameSlug !== filter.gameSlug) return false;
    if (filter.category && a.frontmatter.category !== filter.category) return false;
    return true;
  });
}
