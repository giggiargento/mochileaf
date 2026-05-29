import { getCollection, render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Article } from '../../types';
import { isPublishableArticle, type ArticleFrontmatter } from '../../content/schemas/article';

type ArticleEntry = CollectionEntry<'articles'>;

let articlesCache: Article[] | null = null;
let entriesCache: ArticleEntry[] | null = null;

/** Filename slug from collection id (handles optional path prefix / extension). */
export function articleSlugFromId(id: string): string {
  return id.replace(/^.*[/\\]/, '').replace(/\.mdx?$/i, '');
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

export async function loadArticleEntries(): Promise<ArticleEntry[]> {
  if (!import.meta.env.DEV && entriesCache) return entriesCache;

  const entries = await getCollection('articles');
  const publishable = entries.filter(({ data }) => isPublishableArticle(data));

  if (!import.meta.env.DEV) entriesCache = publishable;
  return publishable;
}

export async function loadArticles(): Promise<Article[]> {
  if (!import.meta.env.DEV && articlesCache) return articlesCache;

  const entries = await loadArticleEntries();
  const articles = entries.map(entryToArticle);

  if (!import.meta.env.DEV) articlesCache = articles;
  return articles;
}

export async function getArticleEntry(slug: string): Promise<ArticleEntry | undefined> {
  const normalized = articleSlugFromId(slug);
  const entries = await loadArticleEntries();
  return entries.find((e) => articleSlugFromId(e.id) === normalized);
}

export async function renderArticle(slug: string) {
  const entry = await getArticleEntry(slug);
  if (!entry) return undefined;
  const { Content } = await render(entry);
  return { entry, Content, data: entry.data };
}

export async function getFeaturedArticles(): Promise<Article[]> {
  const all = await loadArticles();
  return all.filter((a) => a.featured).slice(0, 4);
}

export async function getTrendingArticles(): Promise<Article[]> {
  const all = await loadArticles();
  return all.filter((a) => a.trending);
}

export async function getArticlesByGame(gameSlug: string): Promise<Article[]> {
  const all = await loadArticles();
  return all.filter((a) => a.gameSlug === gameSlug);
}
