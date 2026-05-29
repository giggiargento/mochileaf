/**
 * Editorial review exports — combined Markdown files under exports/review/
 *
 * Usage:
 *   npm run export:all
 *   npm run export:characters
 *   npm run export:games
 *   npm run export:guides
 *   npm run export:articles
 *   npm run export:acnh
 *   npm run export:stardew
 *   npm run export:nte
 *   npm run export:game -- stardew
 *   npm run export:game -- nte split   # 5 separate files (legacy)
 */
import { resolveGameSlug, shortLabel } from './game-aliases';
import {
  combinedGameHeader,
  documentHeader,
  filterArticles,
  formatArticle,
  formatCharacter,
  formatGame,
  formatGuide,
  joinEntries,
  sectionHeader,
} from './format';
import {
  loadArticles,
  loadCharacters,
  loadGames,
  loadGuides,
} from './load';
import { writeExport } from './write';

type GameBundle = {
  characters: ReturnType<typeof loadCharacters>;
  guides: ReturnType<typeof loadGuides>;
  articles: ReturnType<typeof loadArticles>;
};

function sortByName<T extends { name?: string; title?: string; slug: string }>(
  items: T[],
  nameKey: keyof T = 'name' as keyof T,
): T[] {
  return [...items].sort((a, b) => {
    const an = String(a[nameKey] ?? a.slug);
    const bn = String(b[nameKey] ?? b.slug);
    return an.localeCompare(bn, 'en');
  });
}

function exportCharactersAll(characters = loadCharacters()) {
  const sorted = sortByName(characters);
  const body = joinEntries(
    documentHeader('Characters (all games)', 'src/content/characters/', sorted.length),
    sorted.map(formatCharacter),
  );
  return writeExport('characters-all.md', body);
}

function exportGamesAll(games = loadGames()) {
  const sorted = sortByName(games);
  const body = joinEntries(
    documentHeader('Games (all hubs)', 'src/content/games/', sorted.length),
    sorted.map(formatGame),
  );
  return writeExport('games-all.md', body);
}

function exportGuidesAll(guides = loadGuides()) {
  const sorted = [...guides].sort((a, b) =>
    a.characterSlug.localeCompare(b.characterSlug, 'en'),
  );
  const body = joinEntries(
    documentHeader('NTE build guides (all)', 'src/content/guides/', sorted.length),
    sorted.map(formatGuide),
  );
  return writeExport('guides-all.md', body);
}

function exportArticlesAll(articles = loadArticles()) {
  const sorted = [...articles].sort((a, b) =>
    a.frontmatter.title.localeCompare(b.frontmatter.title, 'en'),
  );
  const body = joinEntries(
    documentHeader('Articles (all)', 'src/content/articles/', sorted.length),
    sorted.map(formatArticle),
  );
  return writeExport('articles-all.md', body);
}

type GameSection = { fileKey: string; title: string; source: string; entries: string[] };

function collectGameSections(gameSlug: string, bundle: GameBundle): GameSection[] {
  const label = shortLabel(gameSlug);
  const sections: GameSection[] = [];

  const characters = sortByName(
    bundle.characters.filter((c) => c.gameSlug === gameSlug),
  );
  if (characters.length > 0) {
    sections.push({
      fileKey: 'characters',
      title: `${label.toUpperCase()} characters`,
      source: `src/content/characters/ (${gameSlug})`,
      entries: characters.map(formatCharacter),
    });
  }

  const buildGuides = [...bundle.guides]
    .filter((g) => g.gameSlug === gameSlug)
    .sort((a, b) => a.characterSlug.localeCompare(b.characterSlug, 'en'));
  if (buildGuides.length > 0) {
    sections.push({
      fileKey: 'build-guides',
      title: `${label.toUpperCase()} build guides`,
      source: `src/content/guides/ (${gameSlug})`,
      entries: buildGuides.map(formatGuide),
    });
  }

  const guideArticles = filterArticles(bundle.articles, {
    gameSlug,
    category: 'guide',
  }).sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title, 'en'));
  if (guideArticles.length > 0) {
    sections.push({
      fileKey: 'guides',
      title: `${label.toUpperCase()} guide articles`,
      source: `src/content/articles/ (${gameSlug}, category: guide)`,
      entries: guideArticles.map(formatArticle),
    });
  }

  const newsArticles = filterArticles(bundle.articles, {
    gameSlug,
    category: 'news',
  }).sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title, 'en'));
  if (newsArticles.length > 0) {
    sections.push({
      fileKey: 'news',
      title: `${label.toUpperCase()} news articles`,
      source: `src/content/articles/ (${gameSlug}, category: news)`,
      entries: newsArticles.map(formatArticle),
    });
  }

  const allGameArticles = filterArticles(bundle.articles, { gameSlug }).sort((a, b) =>
    a.frontmatter.title.localeCompare(b.frontmatter.title, 'en'),
  );
  if (allGameArticles.length > 0) {
    sections.push({
      fileKey: 'articles',
      title: `${label.toUpperCase()} articles (all categories)`,
      source: `src/content/articles/ (${gameSlug})`,
      entries: allGameArticles.map(formatArticle),
    });
  }

  return sections;
}

function exportGameBundleCombined(gameSlug: string, bundle: GameBundle) {
  const label = shortLabel(gameSlug);
  const sections = collectGameSections(gameSlug, bundle);
  if (sections.length === 0) {
    throw new Error(`No exportable content for game "${gameSlug}".`);
  }

  const parts: string[] = [combinedGameHeader(gameSlug, label)];
  for (const section of sections) {
    parts.push(
      joinEntries(
        sectionHeader(section.title, section.source, section.entries.length),
        section.entries,
      ),
    );
  }

  return [writeExport(`${label}-review.md`, parts.join('\n\n---\n\n'))];
}

function exportGameBundleSplit(gameSlug: string, bundle: GameBundle) {
  const label = shortLabel(gameSlug);
  const paths: string[] = [];

  for (const section of collectGameSections(gameSlug, bundle)) {
    paths.push(
      writeExport(
        `${label}-${section.fileKey}.md`,
        joinEntries(
          documentHeader(section.title, section.source, section.entries.length),
          section.entries,
        ),
      ),
    );
  }

  if (paths.length === 0) {
    throw new Error(`No exportable content for game "${gameSlug}".`);
  }

  return paths;
}

function exportGameBundle(gameSlug: string, bundle: GameBundle, mode: 'combined' | 'split') {
  return mode === 'split'
    ? exportGameBundleSplit(gameSlug, bundle)
    : exportGameBundleCombined(gameSlug, bundle);
}

function exportAll() {
  const paths = [
    exportGamesAll(),
    exportCharactersAll(),
    exportGuidesAll(),
    exportArticlesAll(),
  ];

  const bundle: GameBundle = {
    characters: loadCharacters(),
    guides: loadGuides(),
    articles: loadArticles(),
  };

  for (const game of loadGames()) {
    paths.push(...exportGameBundle(game.slug, bundle, 'split'));
  }

  const editorials = filterArticles(bundle.articles, {}).filter((a) => !a.frontmatter.gameSlug);
  if (editorials.length > 0) {
    paths.push(
      writeExport(
        'articles-editorial.md',
        joinEntries(
          documentHeader(
            'Site-wide editorials',
            'src/content/articles/ (no gameSlug)',
            editorials.length,
          ),
          editorials.map(formatArticle),
        ),
      ),
    );
  }

  return paths;
}

function printHelp() {
  console.log(`
Mochileaf editorial export

Commands:
  all          Export everything (global + per-game bundles)
  characters   exports/review/characters-all.md
  games        exports/review/games-all.md
  guides       exports/review/guides-all.md (NTE JSON build guides)
  articles     exports/review/articles-all.md
  game <alias> [split]  One review file per game (default), or 5 files with split

npm scripts:
  npm run export:all
  npm run export:characters
  npm run export:games
  npm run export:guides
  npm run export:articles
  npm run export:acnh
  npm run export:stardew
  npm run export:nte
  npm run export:game -- acnh split
`);
}

const [command, ...rest] = process.argv.slice(2);

if (!command || command === 'help' || command === '--help') {
  printHelp();
  process.exit(0);
}

let written: string[] = [];

try {
  switch (command) {
    case 'all':
      written = exportAll();
      break;
    case 'characters':
      written = [exportCharactersAll()];
      break;
    case 'games':
      written = [exportGamesAll()];
      break;
    case 'guides':
      written = [exportGuidesAll()];
      break;
    case 'articles':
      written = [exportArticlesAll()];
      break;
    case 'game': {
      const args = rest.filter((a) => a !== '--split');
      const split = rest.includes('split') || rest.includes('--split');
      const gameSlug = resolveGameSlug(args[0] ?? '');
      written = exportGameBundle(
        gameSlug,
        {
          characters: loadCharacters(),
          guides: loadGuides(),
          articles: loadArticles(),
        },
        split ? 'split' : 'combined',
      );
      break;
    }
    default:
      console.error(`Unknown command: ${command}\n`);
      printHelp();
      process.exit(1);
  }

  console.log(`Wrote ${written.length} file(s):`);
  for (const p of written) console.log(`  ${p}`);
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
