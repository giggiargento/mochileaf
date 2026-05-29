import type { Game, NavItem } from '../types';
import type { Locale } from '../i18n/config';
import { pathForLocale } from '../i18n/routing';
import { t } from '../i18n/messages';

type NavSection = { labelKey: string; path: string; icon: string };

function baseNav(slug: string, items: NavSection[], locale: Locale): NavItem[] {
  const base = pathForLocale(`/${slug}`, locale);
  return items.map((item) => ({
    label: t(item.labelKey, locale),
    icon: item.icon,
    href: item.path === '' ? base : `${base}/${item.path}`,
  }));
}

const defaultSections: NavSection[] = [
  { labelKey: 'nav.home', path: '', icon: 'house' },
  { labelKey: 'nav.characters', path: 'characters', icon: 'users' },
  { labelKey: 'nav.builds', path: 'builds', icon: 'hammer' },
  { labelKey: 'nav.tierList', path: 'tier-list', icon: 'medal' },
  { labelKey: 'nav.news', path: 'news', icon: 'newspaper' },
  { labelKey: 'nav.guides', path: 'guides', icon: 'book-open' },
  { labelKey: 'nav.search', path: 'search', icon: 'magnifying-glass' },
  { labelKey: 'nav.about', path: 'about', icon: 'info' },
];

/** Per-game sidebar sections — omit pages that do not fit the game. */
const navBySlug: Record<string, NavSection[]> = {
  'animal-crossing-new-horizons': [
    { labelKey: 'nav.home', path: '', icon: 'house' },
    { labelKey: 'nav.villagers', path: 'characters', icon: 'users' },
    { labelKey: 'nav.homes', path: 'houses', icon: 'armchair' },
    { labelKey: 'nav.items', path: 'items', icon: 'package' },
    { labelKey: 'nav.islandTours', path: 'island-tours', icon: 'television' },
    { labelKey: 'nav.guides', path: 'guides', icon: 'book-open' },
    { labelKey: 'nav.news', path: 'news', icon: 'newspaper' },
    { labelKey: 'nav.about', path: 'about', icon: 'info' },
  ],
  'neverness-to-everness': [
    { labelKey: 'nav.home', path: '', icon: 'house' },
    { labelKey: 'nav.characters', path: 'characters', icon: 'users' },
    { labelKey: 'nav.teams', path: 'teams', icon: 'users-three' },
    { labelKey: 'nav.guides', path: 'guides', icon: 'book-open' },
    { labelKey: 'nav.news', path: 'news', icon: 'newspaper' },
    { labelKey: 'nav.search', path: 'search', icon: 'magnifying-glass' },
    { labelKey: 'nav.about', path: 'about', icon: 'info' },
  ],
  'stardew-valley': [
    { labelKey: 'nav.home', path: '', icon: 'house' },
    { labelKey: 'nav.villagers', path: 'characters', icon: 'users' },
    { labelKey: 'nav.mods', path: 'mods', icon: 'package' },
    { labelKey: 'nav.guides', path: 'guides', icon: 'book-open' },
    { labelKey: 'nav.news', path: 'news', icon: 'newspaper' },
    { labelKey: 'nav.search', path: 'search', icon: 'magnifying-glass' },
    { labelKey: 'nav.about', path: 'about', icon: 'info' },
  ],
};

export function getGameNavForGame(game: Game, locale: Locale = 'en'): NavItem[] {
  const sections = navBySlug[game.slug] ?? defaultSections;
  return baseNav(game.slug, sections, locale);
}
