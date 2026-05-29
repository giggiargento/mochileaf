export const defaultLocale = 'en' as const;
export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  es: 'ES',
};
