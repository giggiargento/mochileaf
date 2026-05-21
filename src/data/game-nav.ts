import type { Game, NavItem } from '../types';

type NavSection = { label: string; path: string; icon: string };

function baseNav(slug: string, items: NavSection[]): NavItem[] {
  const base = `/${slug}`;
  return items.map((item) => ({
    label: item.label,
    icon: item.icon,
    href: item.path === '' ? base : `${base}/${item.path}`,
  }));
}

const defaultSections: NavSection[] = [
  { label: 'Home', path: '', icon: 'house' },
  { label: 'Characters', path: 'characters', icon: 'users' },
  { label: 'Builds', path: 'builds', icon: 'hammer' },
  { label: 'Tier List', path: 'tier-list', icon: 'medal' },
  { label: 'News', path: 'news', icon: 'newspaper' },
  { label: 'Guides', path: 'guides', icon: 'book-open' },
  { label: 'Search', path: 'search', icon: 'magnifying-glass' },
  { label: 'About', path: 'about', icon: 'info' },
];

/** Per-game sidebar sections — omit pages that do not fit the game. */
const navBySlug: Record<string, NavSection[]> = {
  'animal-crossing-new-horizons': [
    { label: 'Home', path: '', icon: 'house' },
    { label: 'Villagers', path: 'characters', icon: 'users' },
    { label: 'Homes', path: 'houses', icon: 'armchair' },
    { label: 'Items', path: 'items', icon: 'package' },
    { label: 'Island tours', path: 'island-tours', icon: 'television' },
    { label: 'Guides', path: 'guides', icon: 'book-open' },
    { label: 'About', path: 'about', icon: 'info' },
  ],
  'neverness-to-everness': [
    { label: 'Home', path: '', icon: 'house' },
    { label: 'Characters', path: 'characters', icon: 'users' },
    { label: 'Teams', path: 'teams', icon: 'users-three' },
    { label: 'Guides', path: 'guides', icon: 'book-open' },
    { label: 'News', path: 'news', icon: 'newspaper' },
    { label: 'Search', path: 'search', icon: 'magnifying-glass' },
    { label: 'About', path: 'about', icon: 'info' },
  ],
  'stardew-valley': [
    { label: 'Home', path: '', icon: 'house' },
    { label: 'Villagers', path: 'characters', icon: 'users' },
    { label: 'Mods', path: 'mods', icon: 'package' },
    { label: 'Guides', path: 'guides', icon: 'book-open' },
    { label: 'News', path: 'news', icon: 'newspaper' },
    { label: 'Search', path: 'search', icon: 'magnifying-glass' },
    { label: 'About', path: 'about', icon: 'info' },
  ],
};

export function getGameNavForGame(game: Game): NavItem[] {
  const sections = navBySlug[game.slug] ?? defaultSections;
  return baseNav(game.slug, sections);
}
