import { t } from '../../i18n/messages';

/** Page copy helpers (English-only). */
export function usePageLocale(_currentLocale?: string) {
  const p = (path: string) => path.replace(/\/$/, '') || '/';
  const tr = (key: string, vars?: Record<string, string>) => t(`page.${key}`, vars);
  const hub = (gameSlug: string, ...segments: string[]) => {
    const sub = segments.filter(Boolean).join('/');
    return p(sub ? `/${gameSlug}/${sub}` : `/${gameSlug}`);
  };
  return { locale: 'en' as const, p, tr, hub } as const;
}

export type PageLocale = ReturnType<typeof usePageLocale>;
