import { defaultLocale, type Locale } from './config';
import { pathForLocale } from './routing';

export function resolveLocale(currentLocale: string | undefined): Locale {
  return currentLocale === 'es' ? 'es' : defaultLocale;
}

/** Prefix an internal path for the active locale (EN stays unprefixed). */
export function localePath(path: string, locale: Locale = defaultLocale): string {
  return pathForLocale(path, locale);
}
