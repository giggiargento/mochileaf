import type { Game, NavItem } from '../types';

export const globalNav: NavItem[] = [
  { label: 'Home', href: '/', icon: 'house' },
  { label: 'Games', href: '/games', icon: 'game-controller' },
  { label: 'Articles', href: '/articles', icon: 'article' },
  { label: 'About', href: '/about', icon: 'info' },
];

export function getGameNav(game: Game): NavItem[] {
  const base = `/${game.slug}`;
  return [
    { label: 'Home', href: base, icon: 'house' },
    { label: 'Characters', href: `${base}/characters`, icon: 'users' },
    { label: 'Builds', href: `${base}/builds`, icon: 'hammer' },
    { label: 'Tier List', href: `${base}/tier-list`, icon: 'medal' },
    { label: 'News', href: `${base}/news`, icon: 'newspaper' },
    { label: 'Guides', href: `${base}/guides`, icon: 'book-open' },
    { label: 'Search', href: `${base}/search`, icon: 'magnifying-glass' },
    { label: 'About', href: `${base}/about`, icon: 'info' },
  ];
}
