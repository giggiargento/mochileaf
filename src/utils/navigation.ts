import type { Game, NavItem } from '../types';
import { routableGames } from '../lib/content/registry';
import { getGameNavForGame } from '../data/game-nav';
import { getGameDisplayName } from './game-display';

export function normalizeNavPath(path: string): string {
  const trimmed = path.replace(/\/$/, '');
  return trimmed === '' ? '/' : trimmed;
}

export function flattenNavItems(items: NavItem[]): NavItem[] {
  return items.flatMap((item) => [item, ...(item.children ?? [])]);
}

export function findBestNavMatch(items: NavItem[], currentPath: string): NavItem | undefined {
  const path = normalizeNavPath(currentPath);
  const matches = flattenNavItems(items).filter((nav) => {
    const navHref = normalizeNavPath(nav.href);
    return path === navHref || (navHref !== '/' && path.startsWith(`${navHref}/`));
  });
  return matches.sort(
    (a, b) => normalizeNavPath(b.href).length - normalizeNavPath(a.href).length,
  )[0];
}

export function isNavItemActive(item: NavItem, bestMatch: NavItem | undefined): boolean {
  if (!bestMatch) return false;
  return normalizeNavPath(item.href) === normalizeNavPath(bestMatch.href);
}

export function isNavParentActive(item: NavItem, currentPath: string): boolean {
  const path = normalizeNavPath(currentPath);
  const href = normalizeNavPath(item.href);
  if (path === href || (href !== '/' && path.startsWith(`${href}/`))) return true;
  return (
    item.children?.some((child) => {
      const childHref = normalizeNavPath(child.href);
      return path === childHref || path.startsWith(`${childHref}/`);
    }) ?? false
  );
}

function activeGameNavChildren(): NavItem[] {
  return routableGames
    .map((game) => ({
      label: getGameDisplayName(game, 'short'),
      href: `/${game.slug}`,
    }));
}

export const globalNav: NavItem[] = [
  { label: 'Home', href: '/', icon: 'house' },
  {
    label: 'Games',
    href: '/games',
    icon: 'game-controller',
    children: activeGameNavChildren(),
  },
  { label: 'Articles', href: '/articles', icon: 'article' },
  { label: 'Cozy Creators', href: '/cozy-creators', icon: 'heart' },
  { label: 'About', href: '/about', icon: 'user-circle' },
];

export function getGameNav(game: Game): NavItem[] {
  return getGameNavForGame(game);
}
