import type { Article } from '../types';

export const articles: Article[] = [
  {
    slug: 'lantern-festival-guide',
    title: 'Lantern Festival: A Cozy Walkthrough',
    excerpt:
      'Follow the firefly paths, unlock hidden tea houses, and collect every memory lantern without rushing.',
    category: 'guide',
    gameSlug: 'whisperwood',
    publishedAt: '2026-05-12',
    readTime: '8 min',
    featured: true,
    trending: true,
  },
  {
    slug: 'spring-planting-tips',
    title: 'Spring Planting: Slow Living on the Farm',
    excerpt:
      'Which crops pair best with rainy weeks, and how to design a garden that feels like a watercolor painting.',
    category: 'guide',
    gameSlug: 'stardew-haven',
    publishedAt: '2026-05-10',
    readTime: '6 min',
    featured: true,
  },
  {
    slug: 'patch-1-4-notes',
    title: 'Patch 1.4 — Softer Nights & New Music',
    excerpt:
      'Ambient tracks at dusk, gentler weather transitions, and quality-of-life touches for peaceful sessions.',
    category: 'update',
    gameSlug: 'whisperwood',
    publishedAt: '2026-05-08',
    readTime: '4 min',
    trending: true,
  },
  {
    slug: 'cozy-gaming-rituals',
    title: 'Building a Cozy Gaming Ritual',
    excerpt:
      'Tea, warm light, and intentional pacing — how editorial calm can transform your play sessions.',
    category: 'editorial',
    publishedAt: '2026-05-05',
    readTime: '5 min',
    featured: true,
  },
  {
    slug: 'biolume-shores-map',
    title: 'Biolume Shores: Illustrated Map Notes',
    excerpt:
      'Hand-drawn landmarks, secret coves, and the quietest anchor spots for sunset sailing.',
    category: 'guide',
    gameSlug: 'moonlit-tides',
    publishedAt: '2026-05-03',
    readTime: '10 min',
    trending: true,
  },
  {
    slug: 'community-tea-gathering',
    title: 'Community Tea Gathering — Recap',
    excerpt:
      'Screenshots, fan art, and heartwarming stories from our first virtual tea party event.',
    category: 'news',
    publishedAt: '2026-05-01',
    readTime: '3 min',
  },
];

export function getFeaturedArticles(): Article[] {
  return articles.filter((a) => a.featured).slice(0, 4);
}

export function getTrendingArticles(): Article[] {
  return articles.filter((a) => a.trending);
}

export function getArticlesByGame(gameSlug: string): Article[] {
  return articles.filter((a) => a.gameSlug === gameSlug);
}
