import type { Article } from '../types';
import { defaultLocale, type Locale } from '../i18n/config';
import { pathForLocale } from '../i18n/routing';
import { t } from '../i18n/messages';

export type ArticleHubSection = 'news' | 'guides';

/** Hub list path for this article (news, guides, or global articles). */
export function getArticleListHref(article: Article, locale: Locale = defaultLocale): string {
  if (!article.gameSlug) return pathForLocale('/articles', locale);
  return pathForLocale(`/${article.gameSlug}/${getArticleHubSection(article)}`, locale);
}

export function getArticleListLabel(article: Article, locale: Locale = defaultLocale): string {
  if (!article.gameSlug) return t('article.backAll', locale);
  return getArticleHubSection(article) === 'guides'
    ? t('article.backGuides', locale)
    : t('article.backNews', locale);
}

/** Canonical article URL — game hubs use /{game}/news|guides/{slug}. */
export function getArticleHref(article: Article, locale: Locale = defaultLocale): string {
  if (!article.gameSlug) return pathForLocale(`/articles/${article.slug}`, locale);
  return `${getArticleListHref(article, locale)}/${article.slug}`;
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
