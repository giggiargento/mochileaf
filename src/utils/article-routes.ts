import type { Article } from '../types';

export type ArticleHubSection = 'news' | 'guides';

/** Hub list path for this article (news, guides, or global articles). */
export function getArticleListHref(article: Article): string {
  if (!article.gameSlug) return '/articles';
  return `/${article.gameSlug}/${getArticleHubSection(article)}`;
}

export function getArticleListLabel(article: Article): string {
  if (!article.gameSlug) return 'All articles';
  return getArticleHubSection(article) === 'guides' ? 'Guides' : 'News';
}

/** Canonical article URL — game hubs use /{game}/news|guides/{slug}. */
export function getArticleHref(article: Article): string {
  if (!article.gameSlug) return `/articles/${article.slug}`;
  return `${getArticleListHref(article)}/${article.slug}`;
}

export function getArticleHubSection(article: Article): ArticleHubSection {
  if (article.category === 'guide') return 'guides';
  return 'news';
}

export function isNewsCategory(category: Article['category']): boolean {
  return category === 'news' || category === 'update';
}

export function isGuideCategory(category: Article['category']): boolean {
  return category === 'guide';
}
