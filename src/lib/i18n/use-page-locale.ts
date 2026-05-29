import type { Locale } from '../../i18n/config';
import { localePath, resolveLocale } from '../../i18n/locale';
import { t } from '../../i18n/messages';

/** Shared locale helpers for Astro pages. */
export function usePageLocale(currentLocale: string | undefined) {
  const locale = resolveLocale(currentLocale);
  const p = (path: string) => localePath(path, locale);
  const tr = (key: string, vars?: Record<string, string>) => t(`page.${key}`, locale, vars);
  const hub = (gameSlug: string, ...segments: string[]) => {
    const sub = segments.filter(Boolean).join('/');
    return p(sub ? `/${gameSlug}/${sub}` : `/${gameSlug}`);
  };
  return { locale, p, tr, hub } as const;
}

export type PageLocale = ReturnType<typeof usePageLocale>;
