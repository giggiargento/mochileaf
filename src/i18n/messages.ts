import en from './ui/en.json';
import es from './ui/es.json';
import { defaultLocale, type Locale } from './config';

const catalogs: Record<Locale, Record<string, string>> = { en, es };

export function t(
  key: string,
  locale: Locale = defaultLocale,
  vars?: Record<string, string>,
): string {
  const catalog = catalogs[locale] ?? catalogs[defaultLocale];
  let text = catalog[key] ?? catalogs[defaultLocale][key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, value);
    }
  }
  return text;
}
