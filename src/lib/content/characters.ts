import type { Character } from '../../types';
import { defaultLocale, type Locale } from '../../i18n/config';
import { localizeCharacter } from '../i18n/content';
import {
  allCharacters,
  getCharacter as getCharacterRaw,
  getCharacterBySlug as getCharacterBySlugRaw,
  getCharactersByGame as getCharactersByGameRaw,
  routableCharacters,
} from './registry';

export {
  allCharacters,
  routableCharacters,
};

/** Validated characters with routes — safe for listings and `getStaticPaths`. */
export const characters = routableCharacters;

function applyCharacterLocale(list: Character[], locale: Locale): Character[] {
  if (locale === defaultLocale) return list;
  return list.map((c) => localizeCharacter(c, locale));
}

export function getAllCharacters(locale: Locale = defaultLocale) {
  return applyCharacterLocale(allCharacters as Character[], locale);
}

export function getCharacter(gameSlug: string, slug: string, locale: Locale = defaultLocale) {
  const c = getCharacterRaw(gameSlug, slug);
  return c ? localizeCharacter(c as Character, locale) : undefined;
}

export function getCharacterBySlug(slug: string, locale: Locale = defaultLocale) {
  const c = getCharacterBySlugRaw(slug);
  return c ? localizeCharacter(c as Character, locale) : undefined;
}

export function getCharactersByGame(gameSlug: string, locale: Locale = defaultLocale) {
  return applyCharacterLocale(getCharactersByGameRaw(gameSlug) as Character[], locale);
}
