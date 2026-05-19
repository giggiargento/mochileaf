import type { Game, NavItem } from '../types';

export const globalNav: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Games', href: '/#games' },
  { label: 'Articles', href: '/#articles' },
  { label: 'About', href: '/about' },
];

export function getGameNav(game: Game): NavItem[] {
  const base = `/${game.slug}`;
  return [
    { label: 'Home', href: base },
    { label: 'Characters', href: `${base}/characters` },
    { label: 'Builds', href: `${base}/builds` },
    { label: 'Tier List', href: `${base}/tier-list` },
    { label: 'News', href: `${base}/news` },
    { label: 'Guides', href: `${base}/guides` },
    { label: 'Search', href: `${base}/search` },
    { label: 'About', href: `${base}/about` },
  ];
}
