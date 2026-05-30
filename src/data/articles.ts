export {
  articleSlugFromId,
  loadArticles,
  loadArticleEntries,
  getArticle,
  getArticleEntry,
  renderArticle,
  renderArticleForLocale,
  articleSeoForLocale,
  getFeaturedArticles,
  getTrendingArticles,
  getArticlesByGame,
  sortArticlesByDateDesc,
} from '../lib/content/articles';

import type { Locale } from '../i18n/config';
import { isGuideCategory, isNewsCategory } from '../utils/article-routes';
import { loadArticles, sortArticlesByDateDesc } from '../lib/content/articles';

export async function getNewsByGame(gameSlug: string, locale: Locale = 'en') {
  const all = await loadArticles(locale);
  return all.filter((a) => a.gameSlug === gameSlug && isNewsCategory(a.category));
}

export async function getGuidesByGame(gameSlug: string, locale: Locale = 'en') {
  const all = await loadArticles(locale);
  return all.filter((a) => a.gameSlug === gameSlug && isGuideCategory(a.category));
}

/** All hub news/update posts across games, newest first. */
export async function getAllNewsArticles(locale: Locale = 'en') {
  const all = await loadArticles(locale);
  return sortArticlesByDateDesc(all.filter((a) => a.gameSlug && isNewsCategory(a.category)));
}
