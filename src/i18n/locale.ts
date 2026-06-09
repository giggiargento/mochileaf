import { defaultLocale, type Locale } from './config';

export function resolveLocale(_currentLocale?: string): Locale {
  return defaultLocale;
}

/** Internal path (English-only — no locale prefix). */
export function localePath(path: string, _locale?: Locale): string {
  const normalized = path.replace(/\/$/, '') || '/';
  return normalized;
}
