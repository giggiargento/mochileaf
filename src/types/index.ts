export interface Game {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  accent: 'sage' | 'blossom' | 'mist' | 'lavender' | 'honey';
  coverGradient: string;
  featured?: boolean;
  status: 'active' | 'coming-soon';
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: 'news' | 'guide' | 'editorial' | 'update';
  gameSlug?: string;
  publishedAt: string;
  readTime: string;
  featured?: boolean;
  trending?: boolean;
}

export interface Character {
  slug: string;
  name: string;
  role: string;
  element?: string;
  gameSlug: string;
  description: string;
  tier?: 'S' | 'A' | 'B' | 'C';
}

export interface Build {
  slug: string;
  name: string;
  characterSlug: string;
  gameSlug: string;
  difficulty: 'easy' | 'medium' | 'hard';
  summary: string;
  tags: string[];
}

export interface TierEntry {
  tier: 'S' | 'A' | 'B' | 'C' | 'D';
  characters: string[];
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface Update {
  id: string;
  title: string;
  gameSlug?: string;
  date: string;
  type: 'patch' | 'event' | 'content' | 'community';
}
