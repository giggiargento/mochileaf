import type { Article, Character, Game, NteCharacterGuide } from '../../types';
import type { Locale } from '../../i18n/config';

/** English-only — overlays removed; passthrough for stable data-layer API. */

export function localizeArticle(article: Article, _locale?: Locale): Article {
  return article;
}

export function localizeArticleSeo(
  seo: { title: string; description: string },
  _slug: string,
  _locale?: Locale,
): { title: string; description: string } {
  return seo;
}

export function getLocalizedArticleBody(_slug: string, _locale?: Locale): string | null {
  return null;
}

export function localizeCharacter(character: Character, _locale?: Locale): Character {
  return character;
}

export function localizeCharacterSeo(
  seo: { title: string; description: string },
  _slug: string,
  _locale?: Locale,
): { title: string; description: string } {
  return seo;
}

export function localizeGame(game: Game, _locale?: Locale): Game {
  return game;
}

export function localizeNteGuide(
  guide: NteCharacterGuide,
  _characterSlug: string,
  _locale?: Locale,
): NteCharacterGuide {
  return guide;
}
