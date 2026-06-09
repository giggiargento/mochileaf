/** English-only site — locale types kept for gradual cleanup of call sites. */
export const defaultLocale = 'en' as const;
export type Locale = typeof defaultLocale;
