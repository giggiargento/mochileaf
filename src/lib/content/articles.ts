import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Article } from '../../types';
import { isPublishableArticle, type ArticleFrontmatter } from '../../content/schemas/article';
import { defaultLocale, type Locale } from '../../i18n/config';
import {
  getLocalizedArticleBody,
  localizeArticle,
  localizeArticleSeo,
} from '../i18n/content';
import { renderMarkdownToHtml } from '../i18n/render-markdown';

type ArticleEntry = CollectionEntry<'articles'>;

let articlesCache: Article[] | null = null;
let entriesCache: ArticleEntry[] | null = null;

/** Filename slug from collection id (handles optional path prefix / extension). */
export function articleSlugFromId(id: string): string {
  return id.replace(/^.*[/\\]/, '').replace(/\.mdx?$/i, '');
}

/** Newest first (publishedAt YYYY-MM-DD). */
export function sortArticlesByDateDesc<T extends { publishedAt: string }>(articles: T[]): T[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

function entryToArticle(entry: ArticleEntry): Article {
  return {
    slug: articleSlugFromId(entry.id),
    title: entry.data.title,
    excerpt: entry.data.excerpt,
    category: entry.data.category,
    gameSlug: entry.data.gameSlug,
    publishedAt: entry.data.publishedAt,
    readTime: entry.data.readTime,
    featured: entry.data.featured,
    trending: entry.data.trending,
    coverImage: entry.data.coverImage,
    coverCaption: entry.data.coverCaption,
  };
}

function applyArticleLocale(articles: Article[], locale: Locale): Article[] {
  if (locale === defaultLocale) return articles;
  return articles.map((a) => localizeArticle(a, locale));
}

export async function loadArticleEntries(): Promise<ArticleEntry[]> {
  if (!import.meta.env.DEV && entriesCache) return entriesCache;

  const entries = await getCollection('articles');
  const publishable = entries.filter(({ data }) => isPublishableArticle(data));

  if (!import.meta.env.DEV) entriesCache = publishable;
  return publishable;
}

/** All articles for a locale (Spanish overlays applied when locale is `es`). */
export async function loadArticles(locale: Locale = defaultLocale): Promise<Article[]> {
  if (!import.meta.env.DEV && locale === defaultLocale && articlesCache) {
    return articlesCache;
  }

  const entries = await loadArticleEntries();
  const articles = applyArticleLocale(
    sortArticlesByDateDesc(entries.map(entryToArticle)),
    locale,
  );

  if (!import.meta.env.DEV && locale === defaultLocale) articlesCache = articles;
  return articles;
}

export async function getArticleEntry(slug: string): Promise<ArticleEntry | undefined> {
  const normalized = articleSlugFromId(slug);
  const entries = await loadArticleEntries();
  return entries.find((e) => articleSlugFromId(e.id) === normalized);
}

export async function getArticle(slug: string, locale: Locale = defaultLocale): Promise<Article | undefined> {
  const entry = await getArticleEntry(slug);
  if (!entry) return undefined;
  return localizeArticle(entryToArticle(entry), locale);
}

export type RenderedArticle = {
  article: Article;
  entry: ArticleEntry;
  /** Localized HTML body when a Spanish overlay exists. */
  html: string | null;
  /** English (or missing overlay) Astro content component. */
  Content: Awaited<ReturnType<typeof render>>['Content'] | null;
};

/** Single entry point for article detail pages — title, excerpt, and body follow locale. */
export async function renderArticleForLocale(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<RenderedArticle | undefined> {
  const entry = await getArticleEntry(slug);
  if (!entry) return undefined;

  const article = localizeArticle(entryToArticle(entry), locale);
  const localizedBody = getLocalizedArticleBody(slug, locale);

  if (localizedBody) {
    return {
      article,
      entry,
      html: await renderMarkdownToHtml(localizedBody),
      Content: null,
    };
  }

  const { Content } = await render(entry);
  return { article, entry, html: null, Content };
}

export function articleSeoForLocale(
  entry: ArticleEntry,
  article: Article,
  locale: Locale,
): { title: string; description: string } {
  return localizeArticleSeo(
    {
      title: article.title,
      description: article.excerpt,
    },
    article.slug,
    locale,
  );
}

/** @deprecated Use renderArticleForLocale */
export async function renderArticle(slug: string) {
  const entry = await getArticleEntry(slug);
  if (!entry) return undefined;
  const { Content } = await render(entry);
  return { entry, Content, data: entry.data };
}

export async function getFeaturedArticles(locale: Locale = defaultLocale): Promise<Article[]> {
  const all = await loadArticles(locale);
  return all.filter((a) => a.featured).slice(0, 4);
}

export async function getTrendingArticles(locale: Locale = defaultLocale): Promise<Article[]> {
  const all = await loadArticles(locale);
  return sortArticlesByDateDesc(all.filter((a) => a.trending));
}

export async function getArticlesByGame(
  gameSlug: string,
  locale: Locale = defaultLocale,
): Promise<Article[]> {
  const all = await loadArticles(locale);
  return sortArticlesByDateDesc(all.filter((a) => a.gameSlug === gameSlug));
}
