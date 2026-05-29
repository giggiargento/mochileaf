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
} from '../lib/content/articles';

import type { Locale } from '../i18n/config';
import { isGuideCategory, isNewsCategory } from '../utils/article-routes';
import { loadArticles } from '../lib/content/articles';

export async function getNewsByGame(gameSlug: string, locale: Locale = 'en') {
  const all = await loadArticles(locale);
  return all.filter((a) => a.gameSlug === gameSlug && isNewsCategory(a.category));
}

export async function getGuidesByGame(gameSlug: string, locale: Locale = 'en') {
  const all = await loadArticles(locale);
  return all.filter((a) => a.gameSlug === gameSlug && isGuideCategory(a.category));
}
