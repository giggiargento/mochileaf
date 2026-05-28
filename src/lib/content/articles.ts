import { getCollection, render } from 'astro:content';
import type { Article } from '../../types';
import { isPublishableArticle, type ArticleFrontmatter } from '../../content/schemas/article';

let articlesCache: Article[] | null = null;
let entriesCache: Awaited<ReturnType<typeof loadArticleEntries>> | null = null;

function entryToArticle(entry: { id: string; data: ArticleFrontmatter }): Article {
  return {
    slug: entry.id.replace(/\.md$/, ''),
    title: entry.data.title,
    excerpt: entry.data.excerpt,
    category: entry.data.category,
    gameSlug: entry.data.gameSlug,
    publishedAt: entry.data.publishedAt,
    readTime: entry.data.readTime,
    featured: entry.data.featured,
    trending: entry.data.trending,
  };
}

export async function loadArticleEntries() {
  if (!entriesCache) {
    const entries = await getCollection('articles');
    entriesCache = entries.filter(({ data }) => isPublishableArticle(data));
  }
  return entriesCache;
}

export async function loadArticles(): Promise<Article[]> {
  if (articlesCache) return articlesCache;
  const entries = await loadArticleEntries();
  articlesCache = entries.map(entryToArticle);
  return articlesCache;
}

export async function getArticleEntry(slug: string) {
  const entries = await loadArticleEntries();
  return entries.find((e) => e.id === `${slug}.md` || e.id === slug);
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
