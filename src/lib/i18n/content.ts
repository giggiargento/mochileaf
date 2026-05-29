import fs from 'node:fs';
import path from 'node:path';
import type { Article, Character, Game, NteCharacterGuide } from '../../types';
import { defaultLocale, type Locale } from '../../i18n/config';

export type ArticleTranslation = Partial<
  Pick<Article, 'title' | 'excerpt' | 'coverCaption'> & {
    seoTitle?: string;
    seoDescription?: string;
    body?: string;
  }
>;

export type CharacterTranslation = Partial<
  Pick<Character, 'role' | 'description' | 'houseStyle' | 'houseDescription'> & {
    seoTitle?: string;
    seoDescription?: string;
    acnh?: Character['acnh'];
  }
>;

export type GameTranslation = Partial<
  Pick<Game, 'tagline' | 'description' | 'about'> & {
    seoTitle?: string;
    seoDescription?: string;
  }
>;

export type GuideTranslation = Partial<NteCharacterGuide>;

const cache = new Map<string, unknown>();

function translationPath(collection: string, slug: string, locale: Locale): string {
  return path.join(
    process.cwd(),
    'src/i18n/generated',
    locale,
    collection,
    `${slug}.json`,
  );
}

function loadTranslation<T extends Record<string, unknown>>(
  collection: string,
  slug: string,
  locale: Locale,
): T | null {
  if (locale === defaultLocale) return null;
  const cacheKey = `${locale}:${collection}:${slug}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey) as T | null;

  const file = translationPath(collection, slug, locale);
  if (!fs.existsSync(file)) {
    cache.set(cacheKey, null);
    return null;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as T;
    cache.set(cacheKey, parsed);
    return parsed;
  } catch {
    cache.set(cacheKey, null);
    return null;
  }
}

function mergeAcnh(
  base: Character['acnh'],
  overlay: Character['acnh'] | undefined,
): Character['acnh'] | undefined {
  if (!base) return overlay;
  if (!overlay) return base;
  return {
    ...base,
    ...overlay,
    villagerInfo: overlay.villagerInfo
      ? { ...base.villagerInfo, ...overlay.villagerInfo }
      : base.villagerInfo,
    house: overlay.house ? { ...base.house, ...overlay.house } : base.house,
  };
}

export function localizeArticle(article: Article, locale: Locale): Article {
  const tr = loadTranslation<ArticleTranslation>('articles', article.slug, locale);
  if (!tr) return article;
  return {
    ...article,
    title: tr.title ?? article.title,
    excerpt: tr.excerpt ?? article.excerpt,
    coverCaption: tr.coverCaption ?? article.coverCaption,
  };
}

export function localizeArticleSeo(
  seo: { title: string; description: string },
  slug: string,
  locale: Locale,
): { title: string; description: string } {
  const tr = loadTranslation<ArticleTranslation>('articles', slug, locale);
  if (!tr) return seo;
  return {
    title: tr.seoTitle ?? tr.title ?? seo.title,
    description: tr.seoDescription ?? tr.excerpt ?? seo.description,
  };
}

export function getLocalizedArticleBody(slug: string, locale: Locale): string | null {
  const tr = loadTranslation<ArticleTranslation>('articles', slug, locale);
  return tr?.body ?? null;
}

export function localizeCharacter(character: Character, locale: Locale): Character {
  const tr = loadTranslation<CharacterTranslation>('characters', character.slug, locale);
  if (!tr) return character;

  const seo = character.seo
    ? {
        ...character.seo,
        title: tr.seoTitle ?? character.seo.title,
        description: tr.seoDescription ?? character.seo.description,
      }
    : character.seo;

  return {
    ...character,
    role: tr.role ?? character.role,
    description: tr.description ?? character.description,
    houseStyle: tr.houseStyle ?? character.houseStyle,
    houseDescription: tr.houseDescription ?? character.houseDescription,
    seo,
    acnh: mergeAcnh(character.acnh, tr.acnh),
  };
}

export function localizeCharacterSeo(
  seo: { title: string; description: string },
  slug: string,
  locale: Locale,
): { title: string; description: string } {
  const tr = loadTranslation<CharacterTranslation>('characters', slug, locale);
  if (!tr) return seo;
  return {
    title: tr.seoTitle ?? seo.title,
    description: tr.seoDescription ?? tr.description ?? seo.description,
  };
}

export function localizeGame(game: Game, locale: Locale): Game {
  const tr = loadTranslation<GameTranslation>('games', game.slug, locale);
  if (!tr) return game;

  const seo = game.seo
    ? {
        ...game.seo,
        title: tr.seoTitle ?? game.seo.title,
        description: tr.seoDescription ?? game.seo.description,
      }
    : game.seo;

  return {
    ...game,
    tagline: tr.tagline ?? game.tagline,
    description: tr.description ?? game.description,
    about: tr.about ?? game.about,
    seo,
  };
}

export function localizeNteGuide(
  guide: NteCharacterGuide,
  characterSlug: string,
  locale: Locale,
): NteCharacterGuide {
  const tr = loadTranslation<GuideTranslation>('guides', characterSlug, locale);
  if (!tr) return guide;
  return {
    buildSummary: tr.buildSummary ?? guide.buildSummary,
    diskSets: tr.diskSets ?? guide.diskSets,
    modules: tr.modules ?? guide.modules,
    skillPriority: tr.skillPriority ?? guide.skillPriority,
    farming: tr.farming ?? guide.farming,
  };
}
