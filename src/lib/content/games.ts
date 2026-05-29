import type { Game } from '../../types';
import { defaultLocale, type Locale } from '../../i18n/config';
import { localizeGame } from '../i18n/content';
import {
  allGames,
  getFeaturedGames as getFeaturedGamesRaw,
  getGame as getGameRaw,
  routableGames,
} from './registry';

export { allGames, routableGames };

/** Active, validated hubs — safe for `getStaticPaths` and nav. */
export const games = routableGames;

function applyGameLocale(list: Game[], locale: Locale): Game[] {
  if (locale === defaultLocale) return list;
  return list.map((g) => localizeGame(g, locale));
}

export function getAllGames(locale: Locale = defaultLocale) {
  return applyGameLocale(allGames as Game[], locale);
}

export function getGame(slug: string, locale: Locale = defaultLocale) {
  const g = getGameRaw(slug);
  return g ? localizeGame(g as Game, locale) : undefined;
}

export function getFeaturedGames(locale: Locale = defaultLocale) {
  return applyGameLocale(getFeaturedGamesRaw() as Game[], locale);
}
