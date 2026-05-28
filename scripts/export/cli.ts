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
 *   npm run export:game -- stardew guides
 */
import { resolveGameSlug, shortLabel } from './game-aliases';
import {
  documentHeader,
  filterArticles,
  formatArticle,
  formatCharacter,
  formatGame,
  formatGuide,
  joinEntries,
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

function exportGameBundle(gameSlug: string, bundle: GameBundle) {
  const label = shortLabel(gameSlug);
  const paths: string[] = [];

  const characters = sortByName(
    bundle.characters.filter((c) => c.gameSlug === gameSlug),
  );
  if (characters.length > 0) {
    paths.push(
      writeExport(
        `${label}-characters.md`,
        joinEntries(
          documentHeader(
            `${label.toUpperCase()} characters`,
            `src/content/characters/ (${gameSlug})`,
            characters.length,
          ),
          characters.map(formatCharacter),
        ),
      ),
    );
  }

  const buildGuides = [...bundle.guides]
    .filter((g) => g.gameSlug === gameSlug)
    .sort((a, b) => a.characterSlug.localeCompare(b.characterSlug, 'en'));
  if (buildGuides.length > 0) {
    paths.push(
      writeExport(
        `${label}-build-guides.md`,
        joinEntries(
          documentHeader(
            `${label.toUpperCase()} build guides`,
            `src/content/guides/ (${gameSlug})`,
            buildGuides.length,
          ),
          buildGuides.map(formatGuide),
        ),
      ),
    );
  }

  const guideArticles = filterArticles(bundle.articles, {
    gameSlug,
    category: 'guide',
  }).sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title, 'en'));
  if (guideArticles.length > 0) {
    paths.push(
      writeExport(
        `${label}-guides.md`,
        joinEntries(
          documentHeader(
            `${label.toUpperCase()} guide articles`,
            `src/content/articles/ (${gameSlug}, category: guide)`,
            guideArticles.length,
          ),
          guideArticles.map(formatArticle),
        ),
      ),
    );
  }

  const newsArticles = filterArticles(bundle.articles, {
    gameSlug,
    category: 'news',
  }).sort((a, b) => a.frontmatter.title.localeCompare(b.frontmatter.title, 'en'));
  if (newsArticles.length > 0) {
    paths.push(
      writeExport(
        `${label}-news.md`,
        joinEntries(
          documentHeader(
            `${label.toUpperCase()} news articles`,
            `src/content/articles/ (${gameSlug}, category: news)`,
            newsArticles.length,
          ),
          newsArticles.map(formatArticle),
        ),
      ),
    );
  }

  const allGameArticles = filterArticles(bundle.articles, { gameSlug }).sort((a, b) =>
    a.frontmatter.title.localeCompare(b.frontmatter.title, 'en'),
  );
  if (allGameArticles.length > 0) {
    paths.push(
      writeExport(
        `${label}-articles.md`,
        joinEntries(
          documentHeader(
            `${label.toUpperCase()} articles (all categories)`,
            `src/content/articles/ (${gameSlug})`,
            allGameArticles.length,
          ),
          allGameArticles.map(formatArticle),
        ),
      ),
    );
  }

  return paths;
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
    paths.push(...exportGameBundle(game.slug, bundle));
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
  game <alias> Per-game bundle (e.g. acnh, stardew, nte)

npm scripts:
  npm run export:all
  npm run export:characters
  npm run export:games
  npm run export:guides
  npm run export:articles
  npm run export:acnh
  npm run export:stardew
  npm run export:nte
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
      const gameSlug = resolveGameSlug(rest[0] ?? '');
      written = exportGameBundle(gameSlug, {
        characters: loadCharacters(),
        guides: loadGuides(),
        articles: loadArticles(),
      });
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
