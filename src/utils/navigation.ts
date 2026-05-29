import type { Game, NavItem } from '../types';
import { routableGames } from '../lib/content/registry';
import { getGameNavForGame } from '../data/game-nav';
import { getGameDisplayName } from './game-display';
import { defaultLocale, type Locale } from '../i18n/config';
import { pathForLocale, stripLocalePrefix } from '../i18n/routing';
import { t } from '../i18n/messages';

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
    const navHref = stripLocalePrefix(normalizeNavPath(nav.href));
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
  const path = stripLocalePrefix(normalizeNavPath(currentPath));
  const href = stripLocalePrefix(normalizeNavPath(item.href));
  if (path === href || (href !== '/' && path.startsWith(`${href}/`))) return true;
  return (
    item.children?.some((child) => {
      const childHref = stripLocalePrefix(normalizeNavPath(child.href));
      return path === childHref || path.startsWith(`${childHref}/`);
    }) ?? false
  );
}

function activeGameNavChildren(locale: Locale): NavItem[] {
  return routableGames.map((game) => ({
    label: getGameDisplayName(game, 'short'),
    href: pathForLocale(`/${game.slug}`, locale),
  }));
}

const globalNavKeys = [
  { labelKey: 'nav.home', href: '/', icon: 'house' },
  { labelKey: 'nav.games', href: '/games', icon: 'game-controller', children: true },
  { labelKey: 'nav.articles', href: '/articles', icon: 'article' },
  { labelKey: 'nav.cozyCreators', href: '/cozy-creators', icon: 'heart' },
  { labelKey: 'nav.about', href: '/about', icon: 'user-circle' },
] as const;

export function getGlobalNav(locale: Locale = defaultLocale): NavItem[] {
  return globalNavKeys.map((item) => ({
    label: t(item.labelKey, locale),
    href: pathForLocale(item.href, locale),
    icon: item.icon,
    ...(item.children ? { children: activeGameNavChildren(locale) } : {}),
  }));
}

/** @deprecated Use getGlobalNav(locale) */
export const globalNav = getGlobalNav(defaultLocale);

export function getGameNav(game: Game, locale: Locale = defaultLocale): NavItem[] {
  return getGameNavForGame(game, locale);
}
