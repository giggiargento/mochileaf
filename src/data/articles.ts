export {
  loadArticles,
  loadArticleEntries,
  getArticleEntry,
  renderArticle,
  getFeaturedArticles,
  getTrendingArticles,
  getArticlesByGame,
} from '../lib/content/articles';

import { isGuideCategory, isNewsCategory } from '../utils/article-routes';
import { loadArticles } from '../lib/content/articles';

export async function getNewsByGame(gameSlug: string) {
  const all = await loadArticles();
  return all.filter((a) => a.gameSlug === gameSlug && isNewsCategory(a.category));
}

export async function getGuidesByGame(gameSlug: string) {
  const all = await loadArticles();
  return all.filter((a) => a.gameSlug === gameSlug && isGuideCategory(a.category));
}
