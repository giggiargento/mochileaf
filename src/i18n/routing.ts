import { defaultLocale, type Locale } from './config';

/** Path without legacy `/es` prefix (English-only). */
export function stripLocalePrefix(pathname: string): string {
  if (pathname === '/es' || pathname === '/es/') return '/';
  if (pathname.startsWith('/es/')) return pathname.slice(3) || '/';
  return pathname;
}

export function getLocaleFromPath(_pathname: string): Locale {
  return defaultLocale;
}

export function pathForLocale(path: string, _locale?: Locale): string {
  return path.replace(/\/$/, '') || '/';
}
