import { defaultLocale, type Locale } from './config';

/** Strip `/es` prefix for path matching (nav active state, etc.). */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === '/es' || pathname === '/es/') return '/';
  if (pathname.startsWith('/es/')) return pathname.slice(3) || '/';
  return pathname;
}

export function getLocaleFromPath(pathname: string): Locale {
  if (pathname === '/es' || pathname.startsWith('/es/')) return 'es';
  return defaultLocale;
}

/** Prefix path for locale (`en` stays unprefixed). */
export function pathForLocale(path: string, locale: Locale): string {
  const normalized = path.replace(/\/$/, '') || '/';
  if (locale === defaultLocale) return normalized;
  if (normalized === '/') return '/es';
  return `/es${normalized}`;
}
